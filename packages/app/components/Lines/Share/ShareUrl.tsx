import { appearAnimation, Button, disappearAnimation } from "./buttons";
import { ShareIcon } from "../../Icons/ShareIcon";
import { useShare } from "../../../hooks/useShare";
import { useClipboardCopy } from "../../../hooks/useClipboardCopy";
import { useDecayedValue } from "../../../hooks/useDecayedValue";
import s from "./ShareUrl.module.css";

const accentColor = "#e88a28";

export const ShareUrl = ({
  url,
  visible,
}: {
  url: string;
  visible: boolean;
}) => {
  const share = useShare({ url, title: "TimeZone.rocks" });
  const { copy, copied } = useClipboardCopy(url);
  const key = useDecayedValue(copied?.key, 1000);

  return (
    <>
      <Button
        tabIndex={-1}
        href={url}
        target="_blank"
        title={share ? "share" : "share link"}
        className={`${s.buttonUrl} ${
          visible ? appearAnimation : disappearAnimation
        }`}
        onClick={
          (share && preventDefault(share)) ||
          (copy && preventDefault(copy)) ||
          undefined
        }
      >
        <ShareIcon className={s.shareIcon} color={accentColor} />
      </Button>

      {key && (
        <div className={s.copiedHint} key={key}>
          url copied!
        </div>
      )}
    </>
  );
};

const preventDefault = (fn: (e: Event) => void) => (e: any) => {
  e.preventDefault();
  return fn(e);
};
