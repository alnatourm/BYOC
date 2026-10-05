let memoryCsrfToken: string | null = null;
let memorySessionToken: string | null = null;

export function setMemoryCsrfToken(token: string | null) {
  memoryCsrfToken = token;
}

export function getMemoryCsrfToken(): string | null {
  return memoryCsrfToken;
}

export function setMemorySessionToken(token: string | null) {
  memorySessionToken = token;
}

export function getMemorySessionToken(): string | null {
  return memorySessionToken;
}

export interface ApiOptions extends RequestInit {
  idempotencyKey?: string;
}

export async function api<T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers || {});

  headers.set('Accept', 'application/json');

  if (memorySessionToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${memorySessionToken}`);
  }

  if (method !== 'GET' && method !== 'HEAD') {
    if (memoryCsrfToken) {
      headers.set('x-csrf-token', memoryCsrfToken);
    }
    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  if (options.idempotencyKey) {
    headers.set('Idempotency-Key', options.idempotencyKey);
  } else if (endpoint.includes('/stages/') && endpoint.includes('/start') && method === 'POST') {
    headers.set('Idempotency-Key', `idemp_${crypto.randomUUID()}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    method,
    headers,
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type');
  let data: any = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (data && typeof data === 'object') {
    if (data.csrfToken) {
      setMemoryCsrfToken(data.csrfToken);
    }
    if (data.token) {
      setMemorySessionToken(data.token);
    }
  }

  if (!response.ok) {
    const errorMsg = typeof data === 'object' && data?.error ? data.error : `HTTP ${response.status}: ${response.statusText}`;
    const err = new Error(errorMsg) as any;
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data as T;
}
