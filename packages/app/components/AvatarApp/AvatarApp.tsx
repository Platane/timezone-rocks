import { styled } from "@linaria/react";
import { Avatar, Pose } from "@tzr/avatar";
import React from "react";
import { getColors } from "../Earth/Locations/Label";

const poses: Pose[] = ["afternoon", "day", "morning", "night"];

export const AvatarApp = () => {
  const colors = React.useMemo(
    () => getColors(Math.floor(Math.random() * 1000000)),
    []
  );
  const [pose, setPose] = React.useState<Pose>("afternoon");

  return (
    <Container>
      <BackLink href="/">{"<"} back to the app</BackLink>

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
    </Container>
  );
};

const BackLink = styled.a`
align-self: self-start;
&:hover,
&:active,
&:visited{
  color:#fff;
}

`;

const Container = styled.div`
  width:100vw;
  height:  100vh ;
  padding: 16px;
  gap: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;


color:#fff;


::global(){
  #root,#root{
    padding-bottom:0;
  }
}
`;
