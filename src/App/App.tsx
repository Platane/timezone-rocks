import { useState } from "react";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import { getFlagEmoji } from "../emojiFlagSequence";
import { Earth } from "./Earth/Earth";
import { useList } from "./useLocationList";
import { useSearch, useSearchResults } from "./useSearchLocation";
import { useLocations } from "./useLocationStore";

export const App = () => {
  const [query, setQuery] = useState("");
  const locations = useLocations();
  const { list, add, remove } = useList(locations);
  const results = useSearchResults(useSearch(locations ?? []), query);

  return (
    <>
      <Input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {results.map((c) => (
        <ResultItem
          href="#"
          key={c.key}
          onClick={(event) => {
            event.preventDefault();
            add(c);
            setQuery("");
          }}
        >
          {getFlagEmoji(c.countryCode)} {c.name}
        </ResultItem>
      ))}

      <span>----</span>

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

      <Earth list={list} />
    </>
  );
};

export const globals = css`
  :global() {
    html {
      box-sizing: border-box;
    }

    body {
      margin: 0;
    }

    *,
    *:before,
    *:after {
      box-sizing: inherit;
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
