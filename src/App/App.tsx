import React from "react";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import loadable from "@loadable/component";
import { Lines } from "./Lines/Lines";
import { Search } from "./Search";
import { useStore } from "./store/store";
// @ts-ignore
import modelPath from "../assets/earth/scene.glb";
import "./Earth/Locations/useLabelElements";
import { DatePicker } from "./DatePicker";
import { Earth } from "./Earth/Earth";

// const Earth = loadable(() => import("./Earth/Earth"));

// const preloadEarth = () => {
//   Earth.preload();
//   const link = document.createElement("link");
//   link.setAttribute("rel", "prefetch");
//   link.setAttribute("href", modelPath);
//   link.setAttribute("crossorigin", "anonymous");
//   document.head.appendChild(link);
// };

// preloadEarth();

export const App = () => {
  const locationStoreReady = useStore((s) => s.locationStoreReady);

  if (!locationStoreReady) return null;

  return (
    <>
      <TopContainer>
        <EarthContainer>
          <Earth />
        </EarthContainer>
      </TopContainer>

      <Search />

      <DatePicker />

      <Lines />
    </>
  );
};

export const globals = css`
  :global() {
    html {
      box-sizing: border-box;
      user-select: none;
      font-family: Helvetica, Arial, sans-serif;
      background-color: #203b53;
    }

    body {
      margin: 0;
    }

    *,
    *:before,
    *:after {
      box-sizing: inherit;
      user-select: inherit;
    }

    @media (max-width: 500px) {
      #root {
        padding-bottom: 360px;
      }
    }
  }
`;

const TopContainer = styled.div`
  width: 100%;
  overflow: hidden;
`;
const EarthContainer = styled.div`
  position: relative;
  height: 500px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 500px) {
    height: 300px;
    max-width: 400px;
  }
`;
