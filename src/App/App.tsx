import React from "react";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import loadable from "@loadable/component";
import { Lines } from "./Lines/Lines";
import { Search } from "./Search";
import { useStore } from "./store/store";

const Earth = loadable(() => import("./Earth/Earth"));

export const App = () => {
  const locationStoreReady = useStore((s) => s.locationStoreReady);

  if (!locationStoreReady) return null;

  return (
    <>
      <EarthContainer>
        <Earth />
      </EarthContainer>

      <Search />

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
  }
`;

const EarthContainer = styled.div`
  height: 400px;
  width: 100%;
`;
