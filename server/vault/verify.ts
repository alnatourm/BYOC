import { validateUrlSsrf } from '../utils/ssrfGuard';

export { isPrivateOrReservedIp } from '../utils/ssrfGuard';

export async function validateSsrfTargetUrl(targetUrl: string): Promise<string> {
  const result = await validateUrlSsrf(targetUrl);
  return result.pinnedIp;
}

export async function verifyProviderApiKey(
  type: 'gemini' | 'anthropic' | 'openai' | 'groq' | 'webhook' | string,
  secret: string
): Promise<{ verified: boolean; message: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    // Auto-detect Groq keys starting with gsk_
    if (secret.startsWith('gsk_') || type === 'groq') {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        method: 'GET',
        headers: { Authorization: `Bearer ${secret}` },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        return { verified: true, message: 'Groq API key verified successfully.' };
      }
      return { verified: false, message: `Groq API returned status ${res.status}` };
    }

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
      const pinnedIp = await validateSsrfTargetUrl(secret);
      clearTimeout(timeout);
      return { verified: true, message: `Webhook endpoint SSRF validated (IP: ${pinnedIp}).` };
    }

    clearTimeout(timeout);
    return { verified: false, message: 'Unsupported provider type' };
  } catch (err: any) {
    clearTimeout(timeout);
    return { verified: false, message: err?.message || 'Verification call failed' };
  }
}
