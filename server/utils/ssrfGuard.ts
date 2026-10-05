import dns from 'node:dns/promises';
import net from 'node:net';
import https from 'node:https';

export function isPrivateOrReservedIp(ip: string): boolean {
  const normalized = ip.toLowerCase().trim();

  // Handle IPv4-mapped IPv6 addresses like ::ffff:192.168.1.1 or ::ffff:10.0.0.1
  let targetIp = normalized;
  if (targetIp.startsWith('::ffff:')) {
    targetIp = targetIp.substring(7);
  }

  if (net.isIPv4(targetIp)) {
    const parts = targetIp.split('.').map((p) => parseInt(p, 10));
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
      return true; // invalid IP -> fail closed
    }

    const [a, b, c, d] = parts;

    // 0.0.0.0/8
    if (a === 0) return true;
    // 10.0.0.0/8
    if (a === 10) return true;
    // 100.64.0.0/10 (CGNAT)
    if (a === 100 && b >= 64 && b <= 127) return true;
    // 127.0.0.0/8 (Loopback)
    if (a === 127) return true;
    // 169.254.0.0/16 (Link-local)
    if (a === 169 && b === 254) return true;
    // 172.16.0.0/12
    if (a === 172 && b >= 16 && b <= 31) return true;
    // 192.0.0.0/24
    if (a === 192 && b === 0 && c === 0) return true;
    // 192.168.0.0/16
    if (a === 192 && b === 168) return true;
    // 198.18.0.0/15 (Benchmarking)
    if (a === 198 && (b === 18 || b === 19)) return true;
    // 224.0.0.0/4 (Multicast)
    if (a >= 224 && a <= 239) return true;
    // 240.0.0.0/4 (Reserved)
    if (a >= 240) return true;

    return false;
  }

  if (net.isIPv6(targetIp)) {
    // :: and ::1
    if (targetIp === '::' || targetIp === '::1' || targetIp === '0:0:0:0:0:0:0:0' || targetIp === '0:0:0:0:0:0:0:1') {
      return true;
    }
    // fc00::/7 (Unique local)
    if (targetIp.startsWith('fc') || targetIp.startsWith('fd')) return true;
    // fe80::/10 (Link-local)
    if (targetIp.startsWith('fe8') || targetIp.startsWith('fe9') || targetIp.startsWith('fea') || targetIp.startsWith('feb')) return true;
    // ff00::/8 (Multicast)
    if (targetIp.startsWith('ff')) return true;

    return false;
  }

  return true; // Unknown format -> fail closed
}

export async function validateUrlSsrf(urlStr: string): Promise<{ resolvedIps: string[]; pinnedIp: string; hostname: string }> {
  let parsed: URL;
  try {
    parsed = new URL(urlStr);
  } catch {
    throw new Error('SSRF_GUARD_REJECT: Invalid URL format.');
  }

  if (parsed.protocol !== 'https:') {
    throw new Error('SSRF_GUARD_REJECT: Webhook URLs must strictly use HTTPS protocol.');
  }

  const hostname = parsed.hostname;
  const resolvedIps: string[] = [];

  if (net.isIP(hostname)) {
    resolvedIps.push(hostname);
  } else {
    try {
      const ipv4s = await dns.resolve4(hostname).catch(() => []);
      const ipv6s = await dns.resolve6(hostname).catch(() => []);
      resolvedIps.push(...ipv4s, ...ipv6s);
    } catch {
      throw new Error(`SSRF_GUARD_REJECT: Could not resolve DNS for hostname ${hostname}`);
    }
  }

  if (resolvedIps.length === 0) {
    throw new Error(`SSRF_GUARD_REJECT: No IP addresses resolved for hostname ${hostname}`);
  }

  for (const ip of resolvedIps) {
    if (isPrivateOrReservedIp(ip)) {
      throw new Error(`SSRF_GUARD_REJECT: Hostname ${hostname} resolves to prohibited private or reserved IP address: ${ip}`);
    }
  }

  const pinnedIp = resolvedIps[0];
  return { resolvedIps, pinnedIp, hostname };
}

export function createPinnedHttpsAgent(pinnedIp: string): https.Agent {
  return new https.Agent({
    lookup: (_hostname, _options, cb) => {
      if (net.isIPv6(pinnedIp)) {
        cb(null, pinnedIp, 6);
      } else {
        cb(null, pinnedIp, 4);
      }
    },
  });
}
