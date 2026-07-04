import { BeerHand } from "./BeerHand";
import { FistHand } from "./FistHand";
import { PointyHand } from "./PointyHand";
import { Props } from "./type";
import s from "./HandRight.module.css";

export const HandRight = (props: Props) => (
  <g className={s.groupJitter} data-pose={props.pose}>
    <g className={s.groupPosition} data-pose={props.pose}>
      {props.pose === "morning" && <FistHand {...props} />}
      {props.pose === "afternoon" && <BeerHand {...props} />}
      {props.pose === "day" && (
        <g transform="scale(1,-1)">
          <PointyHand {...props} />
        </g>
      )}
    </g>
  </g>
);
