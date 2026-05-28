// Keeps HTMLImageElement references alive so the browser never evicts them from
// the HTTP cache due to GC. Callers fire-and-forget; the browser handles
// deduplication and actual network caching via its HTTP cache.

const _held = new Map<string, HTMLImageElement>();

export function preloadImage(url: string): Promise<void> {
  if (!url || _held.has(url)) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload  = () => { _held.set(url, img); resolve(); };
    img.onerror = () => resolve(); // never reject — missing image is non-fatal
    img.src = url;
  });
}

export function preloadImages(urls: string[]): Promise<void> {
  return Promise.all(urls.filter(Boolean).map(preloadImage)).then(() => {});
}
