const cacheDir = new URL("./node_modules/.cache/", import.meta.url).pathname;

/**
 * fetch with an on-disk cache.
 */
export const fetch = async (uri: string | URL, o?: RequestInit) => {
  const path = cacheDir + uri.toString().replaceAll("/", "_");
  const file = Bun.file(path);

  if (await file.exists()) return new Response(file);

  const buffer = await acquireLockAndExecute(async () => {
    console.log("fetching", uri.toString());

    const res = await globalThis.fetch(uri, o);
    if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));

    return res.arrayBuffer();
  });

  await Bun.write(path, buffer);

  return new Response(buffer);
};

let lock: Promise<unknown> | null = null;
const acquireLockAndExecute = async <T>(h: () => Promise<T>): Promise<T> => {
  while (lock) await lock;
  const promise = h();
  lock = promise
    .finally(() => new Promise((r) => setTimeout(r, 1000)))
    .finally(() => {
      lock = null;
    });

  return promise;
};
