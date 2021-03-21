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
  const [hover, setHover] = useState<null | number>(null);
  const results = useSearchResults(useSearch(locations ?? []), query);

  return (
    <Container
      onSubmit={(e) => {
        e.preventDefault();
        const top = results[hover as any] ?? results[0];
        if (top) {
          add(top);
          setQuery("");
          setHover(null);
        }
      }}
    >
      <Input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDownCapture={(e) => {
          switch (e.code) {
            case "ArrowUp":
              setHover((i) => {
                if (i === null) return results.length - 1;
                if (i >= results.length) return results.length - 1;
                if (i === 0) return results.length - 1;
                return i - 1;
              });
              e.preventDefault();
              break;

            case "ArrowDown":
              setHover((i) => {
                if (i === null) return 0;
                if (i >= results.length - 1) return 0;
                return i + 1;
              });
              e.preventDefault();
              break;
          }
        }}
      />

      {results.length > 0 && (
        <SuggestionContainer onMouseLeave={() => setHover(null)}>
          {results.map((c, i) => (
            <SuggestionItem
              href="#"
              key={c.key}
              style={{
                backgroundColor:
                  hover !== null && hover === i ? "#eeb" : "transparent",
              }}
              onMouseEnter={() => setHover(i)}
              onClick={(event) => {
                event.preventDefault();
                add(c);
                setQuery("");
                setHover(null);
              }}
            >
              {getFlagEmoji(c.countryCode)} {getEmojiType(c.type)} {c.name}
            </SuggestionItem>
          ))}
        </SuggestionContainer>
      )}
    </Container>
  );
};

const getEmojiType = (type: string) => {
  if (type === "city") return "🏙";
  if (type === "admin") return "🏛";
  if (type === "country") return "🌐";
};

const Container = styled.form`
  position: relative;
  margin: 10px;
  width: calc(100% - 20px);
`;

const SuggestionContainer = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  box-shadow: 2px 4px 5px 0 #3333;
  border-radius: 4px;
  background-color: #fff;
  padding: 4px 0;
  z-index: 3;
`;

const SuggestionItem = styled.a`
  display: block;
  padding: 4px 4px 4px 4px;
`;

const Input = styled.input`
  padding: 10px;
  height: 40px;
  width: 100%;
`;
