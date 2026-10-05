import dns from 'node:dns/promises';
import net from 'node:net';

export function isPrivateOrReservedIp(ip: string): boolean {
  if (!net.isIP(ip)) return false;

  // IPv6
  if (ip === '::1' || ip === '::' || ip.startsWith('fe80:') || ip.startsWith('fc00:') || ip.startsWith('fd00:')) {
    return true;
  }

  // Convert IPv4 to number for CIDR checks
  if (net.isIPv4(ip)) {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4) return true;

    // Loopback 127.0.0.0/8
    if (parts[0] === 127) return true;
    // Private 10.0.0.0/8
    if (parts[0] === 10) return true;
    // Private 172.16.0.0/12
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // Private 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) return true;
    // Link-local 169.254.0.0/16 (Cloud Metadata 169.254.169.254)
    if (parts[0] === 169 && parts[1] === 254) return true;
    // CGNAT 100.64.0.0/10
    if (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) return true;
    // Multicast 224.0.0.0/4
    if (parts[0] >= 224 && parts[0] <= 239) return true;
    // Broadcast 255.255.255.255
    if (ip === '255.255.255.255') return true;
    // 0.0.0.0
    if (parts[0] === 0) return true;
  }

  return false;
}

export async function validateSsrfTargetUrl(targetUrl: string): Promise<string> {
  const parsed = new URL(targetUrl);
  if (parsed.protocol !== 'https:') {
    throw new Error('SSRF_GUARD: Only HTTPS endpoints are permitted for webhook connections.');
  }

  const hostname = parsed.hostname;
  if (isPrivateOrReservedIp(hostname)) {
    throw new Error(`SSRF_GUARD: Target IP ${hostname} is private or restricted.`);
  }

  // Resolve DNS and check resolved IP
  const addresses = await dns.resolve4(hostname).catch(() => []);
  if (addresses.length === 0) {
    const ipv6Addresses = await dns.resolve6(hostname).catch(() => []);
    if (ipv6Addresses.length === 0) {
      throw new Error(`SSRF_GUARD: Unable to resolve hostname ${hostname}`);
    }
    for (const ip of ipv6Addresses) {
      if (isPrivateOrReservedIp(ip)) {
        throw new Error(`SSRF_GUARD: Resolved IP ${ip} for ${hostname} is private or restricted.`);
      }
    }
    return ipv6Addresses[0];
  }

  for (const ip of addresses) {
    if (isPrivateOrReservedIp(ip)) {
      throw new Error(`SSRF_GUARD: Resolved IP ${ip} for ${hostname} is private or restricted.`);
    }
  }

  return addresses[0];
}

export async function verifyProviderApiKey(
  type: 'gemini' | 'anthropic' | 'openai' | 'webhook',
  secret: string
): Promise<{ verified: boolean; message: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    if (type === 'gemini') {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
        method: 'GET',
        headers: { 'x-goog-api-key': secret },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        return { verified: true, message: 'Gemini API key verified successfully.' };
      }
      return { verified: false, message: `Gemini API returned status ${res.status}` };
    }

    if (type === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/models', {
        method: 'GET',
        headers: {
          'x-api-key': secret,
          'anthropic-version': '2023-06-01',
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        return { verified: true, message: 'Anthropic API key verified successfully.' };
      }
      return { verified: false, message: `Anthropic API returned status ${res.status}` };
    }

    if (type === 'openai') {
      const res = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: { Authorization: `Bearer ${secret}` },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        return { verified: true, message: 'OpenAI API key verified successfully.' };
      }
      return { verified: false, message: `OpenAI API returned status ${res.status}` };
    }

    if (type === 'webhook') {
      const resolvedIp = await validateSsrfTargetUrl(secret);
      clearTimeout(timeout);
      return { verified: true, message: `Webhook endpoint SSRF validated (IP: ${resolvedIp}).` };
    }

    clearTimeout(timeout);
    return { verified: false, message: 'Unsupported provider type' };
  } catch (err: any) {
    clearTimeout(timeout);
    return { verified: false, message: err?.message || 'Verification call failed' };
  }
}
