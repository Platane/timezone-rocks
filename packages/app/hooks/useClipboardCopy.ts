import { useMemo, useState } from "react";

const copyText = document.createElement("textarea");
copyText.style.display = "none";

export const useClipboardCopy = (text: string) => {
  const [copied, setCopied] = useState<{ key: string; text: string }>();

  const copy = useMemo(() => {
    // @ts-ignore
    if (window.navigator?.clipboard?.writeText)
      return () => {
        const key = Math.random().toString();
        navigator.clipboard
          .writeText(text)
          .then(() => setCopied({ key, text }));
      };

    // @ts-ignore
    if (document.execCommand) {
      return () => {
        copyText.innerText = text;
        copyText.select();

        document.execCommand("copy");
      };
    }

    return undefined;
  }, [text]);

  return { copy, copied: text === copied?.text ? copied : null };
};
