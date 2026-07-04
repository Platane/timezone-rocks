import { useMemo } from "react";
import { useStore } from "../../../store/store";
import { selectLocations } from "../../../store/selector";
import { stringify } from "../../../store/utils-stringify";
import { usePreviousUntilTruthy } from "../../../hooks/usePreviousUntilTruthy";
import { useExtendedTruthiness } from "../../../hooks/useExtendedTruthiness";
import { ShareUrl } from "./ShareUrl";
import { ShareICal } from "./ShareICal";
import s from "./Share.module.css";

export const Share = () => {
  const visible = useStore((s) => !s.dateCursorDragged);
  const visiblePlus = useExtendedTruthiness(visible, 200);

  if (!visiblePlus) return null;
  else return <Inside visible={visible} />;
};

const Inside = ({ visible }: { visible: boolean }) => {
  const locations = useStore(selectLocations);

  const t = usePreviousUntilTruthy(
    useStore((s) => (s.dateCursorDragged ? null : s.t))
  )!;

  const url = useMemo(() => {
    const u = new URL(window.location.href);
    u.hash = stringify({ locations, t });
    return u.toString();
  }, [locations, t]);

  return (
    <div className={s.container}>
      <ShareUrl visible={visible} url={url} />
      <ShareICal visible={visible} url={url} startDate={t} />
    </div>
  );
};
