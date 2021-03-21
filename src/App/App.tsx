import React from "react";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import { getFlagEmoji } from "../emojiFlagSequence";
import { Earth } from "./Earth/Earth";
import { useList } from "./useLocationList";
import { useLocations } from "./useLocationStore";
import { Lines } from "./Lines/Lines";
import { Search } from "./Search";

export const App = () => {
  const locations = useLocations();
  const { list, add, remove } = useList(locations);

  return (
    <>
      <Search add={add} locations={locations ?? []} />

      <span>----</span>

      <div style={{ maxHeight: "200px", overflow: "scroll" }}>
        {list.map((c) => (
          <div key={c.key}>
            {getFlagEmoji(c.countryCode)} {c.name}
            <a
              href="#"
              style={{ marginLeft: "10px" }}
              onClick={(event) => {
                event.preventDefault();
                remove(c);
              }}
            >
              ×
            </a>
          </div>
        ))}
      </div>

      <Earth list={list} />

      <Lines list={list} />
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
