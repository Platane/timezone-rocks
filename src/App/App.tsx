import { useCallback, useEffect, useMemo, useState } from "react";
import deburr from "lodash.deburr";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import { getFlagEmoji } from "../emojiFlagSequence";
import { Canvas } from "react-three-fiber";
import { OrbitControls, Html } from "drei";
import * as THREE from "three";

export const App = () => {
  const [query, setQuery] = useState("");
  const cities = useCities();
  const { list, addCity, removeCity } = useList(cities);
  const results = useSearchResults(useSearch(cities ?? []), query);

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
            addCity(c);
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
              removeCity(c);
            }}
          >
            ×
          </a>
        </div>
      ))}

      <WorldCanvas style={{ height: "500px" }}>
        <OrbitControls />
        <directionalLight position={[10, 8, 6]} intensity={1} />

        <mesh>
          <sphereBufferGeometry args={[1, 64, 64]} />
          <meshPhysicalMaterial color={"orange"} metalness={0} roughness={0} />
        </mesh>

        {list.map(({ key, name, countryCode, longitude, latitude }) => {
          const s = new THREE.Spherical(
            1,
            (latitude / 180) * Math.PI,
            (longitude / 180) * Math.PI
          );
          const p = new THREE.Vector3().setFromSpherical(s);

          return (
            <group key={key} position={p.toArray()}>
              <mesh>
                <sphereBufferGeometry args={[0.01, 16, 16]} />
                <meshBasicMaterial color={"red"} />
              </mesh>

              <Html style={{ pointerEvents: "none" }}>
                {getFlagEmoji(countryCode)}
              </Html>
            </group>
          );
        })}
      </WorldCanvas>
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

const WorldCanvas = styled(Canvas)`
  width: 100%;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px;
  width: calc(100% - 20px);
`;

const parseCities = (csv: string) =>
  csv.split("\n").map((s) => {
    const [name, countryCode, lo, la, offset, offsetDST] = s.split(",");
    return {
      name,
      countryCode,
      longitude: +lo,
      latitude: +la,
      timezone: {
        label: [offset, offsetDST].join("/"),
        offset: +offset,
        offsetDST: +offsetDST,
      },
    };
  });
type City = ReturnType<typeof parseCities>[number];
type CityWithKey = ReturnType<typeof createKey>[number];

const useCities = () => {
  const [cities, setCities] = useState<CityWithKey[]>();

  useEffect(() => {
    import(
      /* webpackPrefetch: true */
      // @ts-ignore
      "../cities/cities.csv"
    ).then((m) => setCities(createKey(parseCities(m.default))));
  }, []);

  return cities;
};

const useSearch = (cities: CityWithKey[]) => {
  const search = useCallback(
    (query: string) => {
      const res: CityWithKey[] = [];

      if (!query) return res;

      const qSlug = deburr(query.toLocaleLowerCase());

      for (const city of cities) {
        if (city.normalizedName.includes(qSlug)) {
          res.push(city);
          if (res.length >= 16) return res;
        }
      }
      return res;
    },
    [cities]
  );

  return search;
};

const useList = (cities?: CityWithKey[]) => {
  const [list, setList] = useState<CityWithKey[]>([]);

  useEffect(() => {
    if (!cities) return;

    const list = window.location.hash
      .slice(1)
      .split(",")
      .map((key) => cities.find((c) => c.key === key)!)
      .filter(Boolean);

    setList(list);
  }, [cities]);

  useEffect(() => {
    if (!cities) return;

    window.location.hash = list.map((c) => c.key).join(",");
  }, [cities, list]);

  return {
    list,
    addCity: (c: CityWithKey) =>
      setList((l) => [...l.filter((cc) => c.key !== cc.key), c]),
    removeCity: (c: CityWithKey) =>
      setList((l) => l.filter((cc) => c.key !== cc.key)),
    clear: () => setList([]),
  };
};

const createKey = (cities: City[]) => {
  const fullKeys = cities.map(({ name, countryCode, longitude, latitude }) =>
    deburr((name + countryCode + longitude + latitude).toLowerCase()).replace(
      /[^a-z0-9]+/g,
      ""
    )
  );

  return cities.map((city, i) => {
    let key = fullKeys[i].slice(0, 3);

    while (fullKeys.some((fullKey, j) => i !== j && fullKey.startsWith(key)))
      key = fullKeys[i].slice(0, key.length + 1);

    return { key, normalizedName: deburr(city.name.toLowerCase()), ...city };
  });
};

const useSearchResults = (search: ReturnType<typeof useSearch>, query = "") =>
  useMemo(() => search(query), [query, search]);
