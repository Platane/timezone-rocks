import React, { useState } from "react";
import { styled } from "@linaria/react";
import { getFlagEmoji } from "../emojiFlagSequence";
import { useList } from "./useLocationList";
import { useSearch, useSearchResults } from "./useSearchLocation";
import { Location } from "./useLocationStore";

type Props = { locations: Location[] } & Pick<
  ReturnType<typeof useList>,
  "add"
>;

export const Search = ({ add, locations }: Props) => {
  const [query, setQuery] = useState("");
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
    </>
  );
};

const ResultItem = styled.a`
  display: block;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px;
  width: calc(100% - 20px);
`;
