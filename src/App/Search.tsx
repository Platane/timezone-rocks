import React, { useState } from "react";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import { getFlagEmoji } from "../emojiFlagSequence";
import { useSearchResults } from "./useSearchLocation";
import { useStore } from "./store/store";
import { usePreviousUntilTruthy } from "../hooks/usePreviousUntilTruthy";
import { useExtendedTruthiness } from "../hooks/useExtendedTruthiness";

export const Search = () => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const focusedPlus = useExtendedTruthiness(focused, 100);
  const [hover, setHover] = useState<null | number>(null);
  const results = usePreviousUntilTruthy(useSearchResults(query), [])!;
  const addLocation = useStore((s) => s.addLocation);

  return (
    <Container
      onSubmit={(e) => {
        e.preventDefault();
        const top = results[hover as any] ?? results[0];
        if (top) {
          addLocation(top);
          setQuery("");
          setHover(null);
        }
      }}
    >
      <Input
        type="text"
        placeholder="Add a location"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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

      {results.length > 0 && focusedPlus && (
        <SuggestionContainer onMouseLeave={() => setHover(null)}>
          {results.map((c, i) => (
            <SuggestionItem
              href="#"
              key={c.key}
              className={hover !== null && hover === i ? hoverCss : ""}
              onMouseEnter={() => setHover(i)}
              onClick={(event) => {
                event.preventDefault();
                addLocation(c);
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
  border-radius: 0 0 4px 4px;
  background-color: #fff;
  padding: 4px 0;
  z-index: 3;
`;

const SuggestionItem = styled.a`
  display: block;
  padding: 4px 4px 4px 4px;
`;

const hoverCss = css`
  background-color: -webkit-focus-ring-color;
  background-color: Highlight;
`;

const Input = styled.input`
  font-size: 1.2em;
  padding: 10px 16px;
  height: 50px;
  width: 100%;
  border: none;
  outline: none;
  border-radius: 2px;

  &:focus {
    box-shadow: 0 0 0 2px -webkit-focus-ring-color;
    box-shadow: 0 0 0 2px Highlight;
  }
`;
