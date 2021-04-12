import React, { useEffect, useMemo, useState } from "react";
import { styled } from "@linaria/react";
import { appearAnimation, Button, disappearAnimation } from "./buttons";
import { useShare } from "../../../hooks/useShare";
import { generateICal } from "../../../ical-utils";

export const ShareICal = ({
  url,
  startDate,
  visible,
}: {
  url: string;
  startDate: number;
  visible: boolean;
}) => {
  const iCal = useMemo(() => generateICal({ url, startDate }), [
    url,
    startDate,
  ]);

  const dataUri = useMemo(() => `data:text/calendar;base64,${btoa(iCal)}`, [
    iCal,
  ]);

  const files = useMemo(() => {
    const blob = new Blob([iCal], { type: "text/calendar" });
    const file = new File([blob], "file.png", { type: "text/calendar" });
    return [file];
  }, [url]);

  const share = useShare({ files, title: "invite" });

  return (
    <ButtonICal
      href={dataUri}
      download={"invite.ics"}
      target="_self"
      className={visible ? appearAnimation : disappearAnimation}
      onClick={share ? preventDefault(share) : undefined}
    >
      iCal
    </ButtonICal>
  );
};

const preventDefault = (fn: (e: Event) => void) => (e: any) => {
  e.preventDefault();
  return fn(e);
};

const ButtonICal = styled(Button)`
  user-select: none;
  user-drag: none;
`;
