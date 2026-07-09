import type { LocationSearcher } from "@tzr/location-index";
import type { TextFragments } from "@tzr/location-index/search/splitFragments";
import { useEffect, useRef, useState } from "react";
import { Flag } from "../../flags/Flag";
import { useExtendedTruthiness } from "../../hooks/useExtendedTruthiness";
import { usePreviousUntilTruthy } from "../../hooks/usePreviousUntilTruthy";
import { addPin } from "../../store/mutators";
import type { Store } from "../../store/store";
import { useSearchResults } from "../../store/useSearchLocation";
import s from "./Search.module.css";

export const Search = ({
  store,
  locationSearcher,
}: {
  store: Store;
  locationSearcher: LocationSearcher;
}) => {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const focusedPlus = useExtendedTruthiness(focused, 100);
  const [hoveredKey, setHoveredKey] = useState<string>();
  const results = usePreviousUntilTruthy(
    useSearchResults(locationSearcher, query),
    []
  )!;

  const ref = useRef<HTMLFormElement | null>(null);
  useEffect(() => {
    if (
      focused &&
      ref.current &&
      // likely a device with a virtual keyboard
      "ontouchend" in document
    ) {
      const y = ref.current.getBoundingClientRect().top + window.scrollY - 10;
      window.scrollTo(0, y);
    }
  }, [focused]);

  return (
    <form
      className={s.container}
      ref={ref}
      onSubmit={(e) => {
        e.preventDefault();
        const top = results.find((r) => r.key === hoveredKey) ?? results[0];
        if (top) {
          store.setState(addPin(top));
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
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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
            <button
              className={s.suggestionItem}
              type="button"
              key={c.key}
              data-hovered={hoveredKey === c.key}
              onMouseEnter={() => setHoveredKey(c.key)}
              onClick={() => {
                store.setState(addPin(c));
                setQuery("");
                setHoveredKey(undefined);
              }}
            >
              <span className={s.suggestionFlag}>
                {c.type === "timezone" ? (
                  "🕒"
                ) : (
                  <Flag countryCode={c.countryCode} className={s.flagIcon} />
                )}
              </span>
              <span className={s.suggestionName}>
                <FragmentedText fragments={c.fragments} />
              </span>
              <span className={s.suggestionType}>{typeLabel[c.type]}</span>
            </button>
          ))}
        </div>
      )}
    </form>
  );
};

const typeLabel = {
  city: "city",
  admin: "state",
  country: "country",
  timezone: "timezone",
} as const;

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
