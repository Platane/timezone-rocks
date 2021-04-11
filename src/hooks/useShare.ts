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

    if (!canShare(payload)) return undefined;

    return () => {
      navigator.share(payload);
    };
  }, [shareParams.text, shareParams.title, shareParams.url, shareParams.files]);

  return share;
};

const canShare = (payload: { files?: readonly File[] }) => {
  // can only share video or image files
  if (
    payload.files &&
    !payload.files?.every(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    )
  )
    return false;

  // @ts-ignore
  if (navigator.canShare) return navigator.canShare?.(payload);

  // @ts-ignore
  return navigator.share && !payload.files;
};
