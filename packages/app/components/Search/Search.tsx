import type { ILocation } from "@tzr/location-index";
import type { TextFragments } from "@tzr/location-index/search/splitFragments";
import { useRef, useState } from "react";
import { getFlagEmoji } from "../../flags/emoji";
import { useExtendedTruthiness } from "../../hooks/useExtendedTruthiness";
import { usePreviousUntilTruthy } from "../../hooks/usePreviousUntilTruthy";
import { useStore } from "../../store/store";
import { useSearchResults } from "../../store/useSearchLocation";
import { useSubscribe } from "../../store/useSubscribe";
import s from "./Search.module.css";

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
    <form
      className={s.container}
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
      <input
        className={s.input}
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
        <div
          className={s.suggestionContainer}
          onMouseLeave={() => setHoveredKey(undefined)}
        >
          {results.map((c) => (
            <a
              className={s.suggestionItem}
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
            </a>
          ))}
        </div>
      )}
    </form>
  );
};

const getEmojiType = (type: ILocation["type"]) => {
  if (type === "city") return "🏙";
  if (type === "admin") return "🏛";
  if (type === "country") return "🌐";
  if (type === "timezone") return "🕒";
};

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
          <span className={s.suggestionFlag} />
          <span className={s.suggestionType} title={location.type}>
            {getEmojiType(location.type)}
          </span>
          <span className={s.suggestionName}>
            <FragmentedText fragments={name} />
          </span>
          <span className={s.suggestionSubName}>
            <FragmentedText fragments={subName} />
          </span>
        </>
      );
    }

    case "country":
    case "admin":
    case "city":
      return (
        <>
          <span className={s.suggestionFlag}>
            {location.countryCode ? getFlagEmoji(location.countryCode) : ""}
          </span>
          <span className={s.suggestionType} title={location.type}>
            {getEmojiType(location.type)}
          </span>
          <span className={s.suggestionName}>
            <FragmentedText fragments={location.fragments} />
          </span>
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
