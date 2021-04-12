import React from "react";
import { styled } from "@linaria/react";
import { appearAnimation, Button, disappearAnimation } from "./buttons";
import { accentColor } from "../../theme";
import { ShareIcon } from "../../Icons/ShareIcon";
import { useShare } from "../../../hooks/useShare";
import { useClipboardCopy } from "../../../hooks/useClipboardCopy";
import { useDecayedValue } from "../../../hooks/useDecayedValue";

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
      <ButtonUrl
        href={url}
        target="_blank"
        className={visible ? appearAnimation : disappearAnimation}
        onClick={
          (share && preventDefault(share)) ||
          (copy && preventDefault(copy)) ||
          undefined
        }
      >
        <ShareIcon2 color={accentColor} />
      </ButtonUrl>

      {key && <CopiedHint key={key}>url copied!</CopiedHint>}
    </>
  );
};

const preventDefault = (fn: (e: Event) => void) => (e: any) => {
  e.preventDefault();
  return fn(e);
};

const ButtonUrl = styled(Button)`
  user-drag: none;
`;

const ShareIcon2 = styled(ShareIcon)`
  width: calc(100% - 2px);
  height: calc(100% - 2px);
`;

const CopiedHint = styled.div`
  position: absolute;
  opacity: 0;
  background-color: #ddd;
  padding: 6px;
  border-radius: 4px;

  animation: animation 1000ms linear;

  @keyframes animation {
    0% {
      opacity: 0;
      transform: translateY(-10px) scale(0.8);
    }
    20% {
      opacity: 1;
      transform: translateY(0px);
    }
    80% {
      opacity: 1;
      transform: translateY(0px);
    }
    100% {
      opacity: 0;
      transform: translateY(-10px) scale(0.8);
    }
  }
`;
