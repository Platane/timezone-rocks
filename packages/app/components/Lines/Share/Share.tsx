import { useMemo } from "react";
import { selectPins, selectT } from "../../../store/selectors";
import { useValue } from "../../../store/hooks";
import type { Store } from "../../../store/store";
import { stringify } from "../../../store/utils-stringify";
import { usePreviousUntilTruthy } from "../../../hooks/usePreviousUntilTruthy";
import { useExtendedTruthiness } from "../../../hooks/useExtendedTruthiness";
import { ShareUrl } from "./ShareUrl";
import { ShareICal } from "./ShareICal";
import s from "./Share.module.css";

type Props = { store: Store; visible: boolean };
export const Share = ({ store, visible }: Props) => {
  const visiblePlus = useExtendedTruthiness(visible, 200);

  if (!visiblePlus) return null;
  else return <Inside store={store} visible={visible} />;
};

const Inside = ({ store, visible }: Props) => {
  const pins = useValue(store, selectPins);

  // freeze the shared time while the cursor is being dragged
  const liveT = useValue(store, selectT);
  const t = usePreviousUntilTruthy(visible ? liveT : null)!;

  const url = useMemo(() => {
    const u = new URL(window.location.href);
    u.hash = stringify({ pins, t });
    return u.toString();
  }, [pins, t]);

  return (
    <div className={s.container}>
      <ShareUrl visible={visible} url={url} />
      <ShareICal visible={visible} url={url} startDate={t} />
    </div>
  );
};
