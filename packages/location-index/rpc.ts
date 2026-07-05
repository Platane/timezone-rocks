const symbol = "worker-rpc__";

type GenericApi = Record<string, (...args: any[]) => any>;

let i = 0;

export const createRpcServer = <API extends GenericApi>(api: API) =>
  self.addEventListener("message", async (event) => {
    if (event.data?.symbol === symbol) {
      try {
        const res = await api[event.data.methodName](...event.data.args);
        self.postMessage({ symbol, key: event.data.key, res });
      } catch (error: any) {
        postMessage({ symbol, key: event.data.key, error: error.message });
      }
    }
  });

export const createRpcClient = <API extends GenericApi>(worker: Worker) => {
  const originalTerminate = worker.terminate;
  worker.terminate = () => {
    worker.dispatchEvent(new Event("terminate"));
    originalTerminate.call(worker);
  };

  return new Proxy(
    {} as {
      [K in keyof API]: (
        ...args: Parameters<API[K]>
      ) => Promise<Awaited<ReturnType<API[K]>>>;
    },
    {
      get:
        (_, methodName) =>
        (...args: any[]) =>
          new Promise((resolve, reject) => {
            i = (i + 1) % Number.MAX_SAFE_INTEGER;
            const key = i;

            const onTerminate = () => {
              worker.removeEventListener("terminate", onTerminate);
              worker.removeEventListener("message", onMessageHandler);
              reject(new Error("worker terminated"));
            };

            const onMessageHandler = (event: MessageEvent) => {
              if (event.data?.symbol === symbol && event.data.key === key) {
                if (event.data.error) reject(event.data.error);
                else if (event.data.res) resolve(event.data.res);

                worker.removeEventListener("terminate", onTerminate);
                worker.removeEventListener("message", onMessageHandler);
              }
            };

            worker.addEventListener("message", onMessageHandler);
            worker.addEventListener("terminate", onTerminate);
            worker.postMessage({ symbol, key, methodName, args });
          }),
    }
  );
};
