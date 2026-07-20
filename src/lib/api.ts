const SECRET = import.meta.env.VITE_API_SECRET ?? '';

async function hmacHeaders(): Promise<Record<string, string>> {
  const ts = Date.now().toString();
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, encoder.encode(ts));
  const hex = Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return { 'X-Timestamp': ts, 'X-Signature': hex };
}

export async function apiFetch(url: string, init?: RequestInit): Promise<Response> {
  const auth = await hmacHeaders();
  return fetch(url, {
    ...init,
    headers: { ...init?.headers, ...auth },
  });
}
