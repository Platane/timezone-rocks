import { PointyHand } from "./PointyHand";
import { TeaCup } from "./TeaCup";
import { Props } from "./type";
import s from "./HandLeft.module.css";

export const HandLeft = (props: Props) => (
  <g className={s.groupJitter} data-pose={props.pose}>
    <g className={s.groupPosition} data-pose={props.pose}>
      {props.pose === "morning" && <TeaCup {...props} />}
      {(props.pose === "day" || props.pose === "afternoon") && (
        <PointyHand {...props} />
      )}
    </g>
  </g>
);
