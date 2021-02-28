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
          key={c.name}
          onClick={(event) => {
            event.preventDefault();
            addCity(c);
          }}
        >
          {getFlagEmoji(c.countryCode)} {c.name}
        </ResultItem>
      ))}

      <span>----</span>

      {list.map((c) => (
        <ResultItem
          href="#"
          key={c.name}
          onClick={(event) => {
            event.preventDefault();
            removeCity(c);
          }}
        >
          {getFlagEmoji(c.countryCode)} {c.name}
        </ResultItem>
      ))}

      <WorldCanvas style={{ height: "500px" }}>
        <OrbitControls />
        <directionalLight position={[10, 8, 6]} intensity={1} />

        <mesh>
          <sphereBufferGeometry args={[1, 64, 64]} />
          <meshPhysicalMaterial color={"orange"} metalness={0} roughness={0} />
        </mesh>

        {list.map(({ name, countryCode, longitude, latitude }) => {
          const s = new THREE.Spherical(
            1,
            (latitude / 180) * Math.PI,
            (longitude / 180) * Math.PI
          );
          const p = new THREE.Vector3().setFromSpherical(s);

          return (
            <group key={name + countryCode} position={p.toArray()}>
              <mesh>
                <sphereBufferGeometry args={[0.01, 16, 16]} />
                <meshBasicMaterial color={"red"} />
              </mesh>

              <Html>{getFlagEmoji(countryCode)}</Html>
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

const useCities = () => {
  const [cities, setCities] = useState<City[]>();

  useEffect(() => {
    import(
      /* webpackPrefetch: true */
      // @ts-ignore
      "../cities/cities.csv"
    ).then((m) => setCities(parseCities(m.default)));
  }, []);

  return cities;
};

const useSearch = (cities: City[]) => {
  const slugs = useMemo(
    () =>
      cities.map((value) => ({
        value,
        slug: deburr(value.name.toLocaleLowerCase()),
      })),
    [cities]
  );

  const search = useCallback(
    (query: string) => {
      const res: City[] = [];

      if (!query) return res;

      const qSlug = deburr(query.toLocaleLowerCase());

      for (const { value, slug } of slugs) {
        if (slug.includes(qSlug)) {
          res.push(value);
          if (res.length >= 16) return res;
        }
      }
      return res;
    },
    [slugs]
  );

  return search;
};

const useList = (cities?: City[]) => {
  const [list, setList] = useState<City[]>([]);

  const map = useMemo(() => createMap(cities ?? []), [cities]);

  useEffect(() => {
    if (!cities) return;

    const list = window.location.hash
      .slice(1)
      .split(",")
      .map((m) => cities[map.indexOf(m)])
      .filter(Boolean);

    setList(list);
  }, [cities, map]);

  useEffect(() => {
    if (!cities) return;

    window.location.hash = list
      .map((c) => map[cities.indexOf(c)])
      .filter(Boolean)
      .join(",");
  }, [cities, map, list]);

  return {
    list,
    addCity: (c: City) => setList((l) => [...l.filter((cc) => c !== cc), c]),
    removeCity: (c: City) => setList((l) => l.filter((cc) => c !== cc)),
    clear: () => setList([]),
  };
};

const createMap = (cities: City[]) => {
  debugger;

  const fullSlugs = cities.map(({ name, countryCode, longitude }) =>
    deburr((name + countryCode + longitude).toLowerCase()).replace(
      /[^a-z0-9]+/g,
      ""
    )
  );

  return cities.map((city, i) => {
    let slug = fullSlugs[i].slice(0, 3);

    while (
      fullSlugs.some((fullSlug, j) => i !== j && fullSlug.startsWith(slug))
    )
      slug = fullSlugs[i].slice(0, slug.length + 1);

    return slug;
  });
};

const useSearchResults = (search: ReturnType<typeof useSearch>, query = "") =>
  useMemo(() => search(query), [query, search]);
