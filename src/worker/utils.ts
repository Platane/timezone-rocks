export const createWorkerHandler = (api: Record<string, Function>) => {
  const pm = postMessage as any;

  onmessage = async ({ data }: any) => {
    // @ts-ignore
    const m = api[data?.method];

    if (!m) return;

    const e = { key: data.key } as any;
    try {
      e.result = await m(...data.args);
    } catch (error) {
      e.error = error;
    }
    pm(e);
  };
};

export const createRemote =
  (worker: Worker, method: string) =>
  (...args: any) =>
    new Promise<any>((resolve, reject) => {
      const key = Math.random().toString();

      const handler = ({ data }: any) => {
        if (key === data.key) {
          if (data.error) reject(data.error);
          else resolve(data.result);

          worker.removeEventListener("message", handler);
        }
      };
      worker.addEventListener("message", handler);

      worker.postMessage({ key, method, args });
    });
