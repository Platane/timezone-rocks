import React, { useEffect, useMemo } from "react";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import { useStore } from "../store/store";
import { stringify } from "../store/persist";
import { usePreviousUntilTruthy } from "../../hooks/usePreviousUntilTruthy";
import { ShareIcon } from "../Icons/ShareIcon";
import { accentColor } from "../theme";
import { generateICal } from "../../ical-utils";
import { useExtendedTruthiness } from "../../hooks/useExtendedTruthiness";

export const Share = () => {
  const visible = useStore((s) => !s.dateCursorDragged);
  const visiblePlus = useExtendedTruthiness(visible, 200);

  if (!visiblePlus) return null;
  else return <Inside visible={visible} />;
};

const Inside = ({ visible }: { visible: boolean }) => {
  const locations = useStore((s) => s.locations);

  const t = usePreviousUntilTruthy(
    useStore((s) => (s.dateCursorDragged ? null : s.t))
  )!;

  const url = useMemo(() => {
    const hash = stringify({ locations, t });

    const u = new URL(window.location.href);

    u.hash = hash;

    return u.toString();
  }, [locations, t]);

  const iCalHref = useMemo(() => {
    const ical = generateICal({ url, startDate: t });
    return `data:text/calendar;base64,${btoa(ical)}`;
  }, [url, t]);

  // const iCalHref = useMemo(() => {
  //   const ical = generateICal({ url, startDate: t });

  //   const blob = new Blob([ical], { type: "text/calendar" });
  //   return URL.createObjectURL(blob);
  // }, [url, t]);
  // useEffect(() => () => URL.revokeObjectURL(iCalHref), [iCalHref]);

  return (
    <Container>
      <ButtonShare
        href={url}
        target="blank"
        className={visible ? appearAnimation : disappearAnimation}
      >
        <ShareIcon2 color={accentColor} />
      </ButtonShare>

      <ButtonICal
        href={iCalHref}
        download="invite.ics"
        className={visible ? appearAnimation : disappearAnimation}
      >
        iCal
      </ButtonICal>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Button = styled.a`
  text-decoration: none;
  display: inline-block;
  border-radius: 4px;
  border: solid 2px ${accentColor};
  width: 34px;
  height: 24px;
  margin: 0 2px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  color: ${accentColor};
  font-size: 0.8em;
`;

const ButtonICal = styled(Button)``;

const ButtonShare = styled(Button)``;

const ShareIcon2 = styled(ShareIcon)`
  width: calc(100% - 2px);
  height: calc(100% - 2px);
`;

const appearAnimation = css`
  animation-duration: 300ms;

  &:nth-child(1) {
    animation-name: animation1;
    @keyframes animation1 {
      0% {
        transform: scale(0);
      }
      33% {
        transform: scale(0);
      }
      66% {
        transform: scale(1);
      }
      100% {
        transform: scale(1);
      }
    }
  }

  &:nth-child(2) {
    animation-name: animation2;
    @keyframes animation2 {
      0% {
        transform: scale(0);
      }
      33% {
        transform: scale(0);
      }
      66% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
  }
`;

const disappearAnimation = css`
  transform: scale(0);
  animation-duration: 120ms;

  &:nth-child(1) {
    animation-name: animation1;
    @keyframes animation1 {
      0% {
        transform: scale(1);
      }
      40% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }
  }

  &:nth-child(2) {
    animation-name: animation2;
    @keyframes animation2 {
      0% {
        transform: scale(1);
      }
      60% {
        transform: scale(0);
      }
      100% {
        transform: scale(0);
      }
    }
  }
`;
