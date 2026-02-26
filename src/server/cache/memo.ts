// Server-only module. Do not import in client components.
export function memoize<T>(factory: () => T): () => T {
  let cached: T | undefined;
  return () => {
    if (cached === undefined) {
      cached = factory();
    }
    return cached;
  };
}
