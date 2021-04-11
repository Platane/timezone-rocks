import { useMemo } from "react";

export const useShare = (shareParams: {
  text?: string;
  title?: string;
  url?: string;
  files?: readonly File[];
}) => {
  const share = useMemo(() => {
    const payload: ShareData & { files?: readonly File[] } = { ...shareParams };

    if (shareParams.files)
      payload.files = Object.freeze([...shareParams.files]);

    const canShare =
      // @ts-ignore
      navigator.canShare?.(payload) || (navigator.share && !payload.files);

    if (!canShare) return undefined;

    return () => navigator.share(payload);
  }, [shareParams.text, shareParams.title, shareParams.url, shareParams.files]);

  return share;
};
