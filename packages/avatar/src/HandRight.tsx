import { BeerHand } from "./BeerHand";
import { FistHand } from "./FistHand";
import { PointyHand } from "./PointyHand";
import { Props } from "./type";
import s from "./HandRight.module.css";

export const HandRight = (props: Props) => (
  <g className={s.groupJitter}>
    <g className={s.groupPosition}>
      <g data-pose-when="morning">
        <FistHand {...props} />
      </g>
      <g data-pose-when="afternoon">
        <BeerHand {...props} />
      </g>
      <g data-pose-when="day">
        <g transform="scale(1,-1)">
          <PointyHand {...props} />
        </g>
      </g>
    </g>
  </g>
);
