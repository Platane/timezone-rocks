import { Avatar, Pose } from "@tzr/avatar";
import React from "react";
import { getColors } from "../Earth/Locations/getColors";
import s from "./AvatarApp.module.css";

const poses: Pose[] = ["afternoon", "day", "morning", "night"];

export const AvatarApp = () => {
  const colors = React.useMemo(
    () => getColors(Math.floor(Math.random() * 1000000)),
    []
  );
  const [pose, setPose] = React.useState<Pose>("afternoon");

  return (
    <div className={s.container}>
      <a className={s.backLink} href="/">
        {"<"} back to the app
      </a>

      <Avatar
        pose={pose}
        {...colors}
        style={{
          width: "calc( 100vw - 50px )",
          height: "calc( 100vh - 240px )",
        }}
      />

      <fieldset style={{ marginTop: "auto" }}>
        <legend>Avatar pose</legend>
        <div>
          {poses.map((p) => (
            <React.Fragment key={p}>
              <input
                type="radio"
                id={p}
                name="pose"
                value={p}
                checked={p === pose}
                onChange={(e) => {
                  if (e.target.checked) setPose(p);
                }}
              />
              <label htmlFor={p}>{p}</label>
            </React.Fragment>
          ))}
        </div>
      </fieldset>
    </div>
  );
};
