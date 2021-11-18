import React, { useMemo } from "react";
import { styled } from "@linaria/react";
import { useStore } from "../../store/store";
import { stringify } from "../../store/persist";
import { usePreviousUntilTruthy } from "../../../hooks/usePreviousUntilTruthy";
import { useExtendedTruthiness } from "../../../hooks/useExtendedTruthiness";
import { ShareUrl } from "./ShareUrl";
import { ShareICal } from "./ShareICal";
import { listVersion } from "../../../locations";

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
    const u = new URL(window.location.href);
    u.hash = stringify({ locations, t, listVersion });
    return u.toString();
  }, [locations, t]);

  return (
    <Container>
      <ShareUrl visible={visible} url={url} />
      <ShareICal visible={visible} url={url} startDate={t} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;
