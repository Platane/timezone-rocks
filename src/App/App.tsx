import React from "react";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import { Earth } from "./Earth/Earth";
import { Lines } from "./Lines/Lines";
import { Search } from "./Search";
import { useStore } from "./store/store";

export const App = () => {
  const locations = useStore((s) => s.locations);

  return (
    <>
      <Search />

      <Earth list={locations} />

      <Lines list={locations} />
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

const ResultItem = styled.a`
  display: block;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px;
  width: calc(100% - 20px);
`;
