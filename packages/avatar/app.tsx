import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Avatar } from ".";

export const App = () => {
  const poses = [
    //
    "night",
    "morning",
    "day",
    "afternoon",
  ] as const;
  const [pose, setPose] = useState(
    () => new URLSearchParams(location.search).get("pose") ?? "afternoon"
  );

  return (
    <>
      <Avatar
        style={{ width: "100%", height: "100vh" }}
        pose={pose as any}
        color="#cc00b1"
        colorDark="#a81094"
      />
      <div style={{ position: "fixed", top: 0 }}>
        {poses.map((pose) => (
          <a
            key={pose}
            href="#"
            style={{ padding: "10px" }}
            onClick={() => setPose(pose)}
          >
            {pose}
          </a>
        ))}
      </div>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
