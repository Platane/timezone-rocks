import { styled } from "@linaria/react";
import type { ILocation } from "@tzr/location-index";
import type { TextFragments } from "@tzr/location-index/search/splitFragments";
import React, { useRef, useState } from "react";
import { getFlagEmoji } from "../flags/emoji";
import { useExtendedTruthiness } from "../hooks/useExtendedTruthiness";
import { usePreviousUntilTruthy } from "../hooks/usePreviousUntilTruthy";
import { useStore } from "../store/store";
import { useSearchResults } from "../store/useSearchLocation";
import { useSubscribe } from "../store/useSubscribe";

export const Search = () => {
  const focused = useStore((s) => s.searchFocused);
  const focusSearch = useStore((s) => s.focusSearch);
  const blurSearch = useStore((s) => s.blurSearch);
  const addLocation = useStore((s) => s.addLocation);
  const [query, setQuery] = useState("");
  const focusedPlus = useExtendedTruthiness(focused, 100);
  const [hoveredKey, setHoveredKey] = useState<string>();
  const results = usePreviousUntilTruthy(useSearchResults(query), [])!;

  const ref = useRef<HTMLFormElement | null>(null);
  useSubscribe(
    (focus) => {
      if (
        focus &&
        ref.current &&
        // likely a device with a virtual keyboard
        "ontouchend" in document
      ) {
        const y = ref.current.getBoundingClientRect().top + window.scrollY - 10;
        window.scrollTo(0, y);
      }
    },
    (s) => s.searchFocused
  );

  return (
    <Container
      ref={ref}
      onSubmit={(e) => {
        e.preventDefault();
        const top = results.find((r) => r.key === hoveredKey) ?? results[0];
        if (top) {
          addLocation(top);
          setQuery("");
          setHoveredKey(undefined);
        }
      }}
    >
      <Input
        type="search"
        placeholder="Add your teammate's timezone"
        spellCheck={false}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={focusSearch}
        onBlur={blurSearch}
        onKeyDownCapture={(e) => {
          switch (e.code) {
            case "ArrowUp":
            case "ArrowDown":
              setHoveredKey((key) => {
                const delta = e.code === "ArrowDown" ? 1 : -1;
                const i = results.findIndex((r) => r.key === key);
                if (i === -1 && delta === -1)
                  return results[results.length - 1]?.key;
                return results[(i + delta) % results.length]?.key;
              });
              e.preventDefault();
              break;
          }
        }}
      />

      {results.length > 0 && focusedPlus && (
        <SuggestionContainer onMouseLeave={() => setHoveredKey(undefined)}>
          {results.map((c) => (
            <SuggestionItem
              href="#"
              key={c.key}
              data-hovered={hoveredKey === c.key}
              onMouseEnter={() => setHoveredKey(c.key)}
              onClick={(event) => {
                event.preventDefault();
                addLocation(c);
                setQuery("");
                setHoveredKey(undefined);
              }}
            >
              <SuggestionContent location={c} />
            </SuggestionItem>
          ))}
        </SuggestionContainer>
      )}
    </Container>
  );
};

const getEmojiType = (type: ILocation["type"]) => {
  if (type === "city") return "🏙";
  if (type === "admin") return "🏛";
  if (type === "country") return "🌐";
  if (type === "timezone") return "🕒";
};

const Container = styled.form`
  position: relative;
  margin: 0 10px 10px 10px;
  width: calc(100% - 20px);
`;

const SuggestionContainer = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  box-shadow: 2px 4px 5px 0 #3333;
  border-radius: 0 0 2px 2px;
  background-color: #fff;
  padding: 6px 0;
  z-index: 3;
`;

const SuggestionContent = ({
  location,
}: {
  location: ILocation & { fragments: TextFragments };
}) => {
  switch (location.type) {
    case "timezone": {
      const name: TextFragments = [];
      const subName: TextFragments = [];

      for (const f of location.fragments) {
        if (subName.length > 0) {
          subName.push(f);
        } else {
          const r = new RegExp(/ -/);

          if (f.text.match(r)) {
            name.push(f);
          } else {
            const i = r.lastIndex - 1;
            name.push({ ...f, text: f.text.substring(0, i) });
            subName.push({ ...f, text: f.text.substring(i) });
          }
        }
      }

      return (
        <>
          <SuggestionFlag />
          <SuggestionType title={location.type}>
            {getEmojiType(location.type)}
          </SuggestionType>
          <SuggestionName>
            <FragmentedText fragments={name} />
          </SuggestionName>
          <SuggestionSubName>
            <FragmentedText fragments={subName} />
          </SuggestionSubName>
        </>
      );
    }

    case "country":
    case "admin":
    case "city":
      return (
        <>
          <SuggestionFlag>
            {location.countryCode ? getFlagEmoji(location.countryCode) : ""}
          </SuggestionFlag>
          <SuggestionType title={location.type}>
            {getEmojiType(location.type)}
          </SuggestionType>
          <SuggestionName>
            <FragmentedText fragments={location.fragments} />
          </SuggestionName>
        </>
      );
  }
};

const FragmentedText = ({ fragments }: { fragments: TextFragments }) => (
  <>
    {fragments.map(({ match, text }, i) =>
      match ? (
        <span key={i} data-fragment-match>
          {text}
        </span>
      ) : (
        text
      )
    )}
  </>
);

const SuggestionItem = styled.a<{ "data-hovered": boolean }>`
  display: block;
  padding: 6px 4px 6px 4px;
  font-size: 1.1em;

  &[data-hovered="true"]{
    background-color: -webkit-focus-ring-color;
    background-color: Highlight;
  }
`;
const SuggestionFlag = styled.span`
  display: inline-block;
  width: 24px;
  text-align: center;
  font-size: 18px;
`;
const SuggestionType = styled.span`
  display: inline-block;
  width: 24px;
  text-align: center;
  font-size: 18px;
`;
const SuggestionName = styled.span`
  font-size: 1.1em;
  margin-left: 2px;
  & > [data-fragment-match]{
    font-weight:bold;
    background-color: #71799c33;
    border-radius: 2px;
  }
`;
const SuggestionSubName = styled.span`
  font-size: 0.9em;
  & > [data-fragment-match]{
    font-weight:bold;
    background-color: #71799c33;
    border-radius: 2px;

  }
`;

const Input = (styled.input as any)`
  font-size: 1.2em;
  padding: 10px 16px;
  height: 50px;
  width: 100%;
  border: none;
  outline: none;
  border-radius: 2px;
  user-select: auto;

  &:focus {
    box-shadow: 0 0 0 2px -webkit-focus-ring-color;
    box-shadow: 0 0 0 2px Highlight;
  }
` as (props: React.ComponentProps<"input">) => any;
