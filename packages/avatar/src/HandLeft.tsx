import { PointyHand } from "./PointyHand";
import { TeaCup } from "./TeaCup";
import { Props } from "./type";
import s from "./HandLeft.module.css";

export const HandLeft = (props: Props) => (
  <g className={s.groupJitter}>
    <g className={s.groupPosition}>
      <g data-pose-when="morning">
        <TeaCup {...props} />
      </g>
      <g data-pose-when="day afternoon">
        <PointyHand {...props} />
      </g>
    </g>
  </g>
);
