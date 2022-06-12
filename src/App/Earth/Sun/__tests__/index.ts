import { DateTime } from "luxon";
import * as THREE from "three";
import { getMatchingLocation, listVersion } from "../../../../locations";
import { stringify } from "../../../store/stringify-utils";
import { setLatLng } from "../../Locations/utils";
import { createGetSunDirection } from "./createGetSunDirection";

const HASH = "6ff489";
export const getSunRiseTime = async (
  p: { latitude: number; longitude: number },
  year = 2020
): Promise<{
  timezone: string;
  points: {
    date: string;
    sunRise: string;
    sunSet: string;
  }[];
}> =>
  await import(
    `./.cache/${[HASH, p.latitude, p.longitude, year].join("_")}.json`
  );

const spherical = new THREE.Spherical(1);
const n = new THREE.Vector3();
const sunDirection = new THREE.Vector3();

const toPoints = ({
  timezone: zone,
  points,
}: {
  timezone: string;
  points: {
    date: string;
    sunRise: string;
    sunSet: string;
  }[];
}) =>
  points.map((p) => {
    const sunRiseTimestamp = DateTime.fromISO(p.date + "T" + p.sunRise, {
      zone,
    }).toMillis();
    const sunSetTimestamp = DateTime.fromISO(p.date + "T" + p.sunSet, {
      zone,
    }).toMillis();

    return {
      ...p,
      timezone: zone,
      sunSetTimestamp,
      sunRiseTimestamp,
      crepusculeTimestamp: [sunRiseTimestamp, sunSetTimestamp],
    };
  });

const getCrepusculeHours = (
  getSunDirection: (timestamp: number, target: THREE.Vector3) => void,
  zone: string,
  latLng: Parameters<typeof setLatLng>[1],
  date: string
) => {
  setLatLng(spherical, latLng);

  n.setFromSpherical(spherical);

  const fError = (hour: number) => {
    const isoDate = date + "T" + formatHour(hour);

    const t = DateTime.fromISO(isoDate, { zone }).toMillis();

    getSunDirection(t, sunDirection);

    return Math.abs(sunDirection.dot(n));
  };

  const derivate =
    (f: (t: number) => number, dt = 0.0001) =>
    (t: number) =>
      (f(t + dt) - f(t - dt)) / (2 * dt);

  const dfError = derivate(fError);

  return [
    [0, 12],
    [12, 24],
  ].map((interval) => {
    let [a, b] = interval;

    for (let k = 16; k--; ) {
      const h = (a + b) / 2;

      if (dfError(h) < 0) a = h;
      else b = h;
    }

    const h = (a + b) / 2;

    return h;
  });
};

const parseHour = (s: string) => {
  const [h, m] = s.split(":");
  return parseInt(h) + parseInt(m) / 60;
};

const formatHour = (hour: number) => {
  const h = Math.floor(hour);
  const m = Math.floor((hour % 1) * 60);
  const s = ((hour * 60) % 1) * 60;

  return (
    h.toString().padStart(2, "0") +
    ":" +
    m.toString().padStart(2, "0") +
    ":" +
    s.toFixed(3).padStart(6, "0")
  );
};

0;
(async () => {
  const [location] = await getMatchingLocation("Quito");

  const points = toPoints(await getSunRiseTime(location, 2022))
    .sort((a, b) => a.sunRiseTimestamp - b.sunRiseTimestamp)
    .slice(0, 400);

  const getSunDirection = createGetSunDirection([]);

  while (document.body.children[0])
    document.body.removeChild(document.body.children[0]);

  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  const ctx = canvas.getContext("2d")!;

  const y = (h: number) => (h / 24) * canvas.height;
  const x = (i: number) => (i * canvas.width) / points.length;

  const computedHours = points.map((p) =>
    getCrepusculeHours(getSunDirection, location.timezone, location, p.date)
  );

  {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    points.forEach((p, i) => {
      ctx.lineTo(x(i), y(parseHour(p.sunRise)));
    });
    ctx.strokeStyle = "green";
    ctx.stroke();

    ctx.lineTo(99999, 0);
    ctx.fillStyle = "#3331";
    ctx.fill();
  }
  {
    ctx.beginPath();
    ctx.moveTo(0, 99999);
    points.forEach((p, i) => {
      ctx.lineTo(x(i), y(parseHour(p.sunSet)));
    });
    ctx.strokeStyle = "green";
    ctx.stroke();

    ctx.lineTo(99999, 99999);
    ctx.fillStyle = "#3331";
    ctx.fill();
  }

  {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    points.forEach((p, i) => {
      const [sr] = computedHours[i];
      ctx.lineTo(x(i), y(sr));
    });
    ctx.strokeStyle = "red";
    ctx.stroke();
  }

  {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    points.forEach((p, i) => {
      const [, ss] = computedHours[i];
      ctx.lineTo(x(i), y(ss));
    });
    ctx.strokeStyle = "orange";
    ctx.stroke();
  }

  {
    for (let h = 2; h < 24; h += 2) {
      ctx.fillStyle = "#333a";
      ctx.textBaseline = "middle";
      ctx.fillText(formatHour(h).slice(0, 5), 5, y(h));

      ctx.strokeStyle = "#3333";
      ctx.beginPath();
      ctx.moveTo(30, y(h));
      ctx.lineTo(x(400), y(h));
      ctx.stroke();
    }
  }

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.width = "300px";
  iframe.style.height = "350px";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.src = `https://localhost:8080/#${stringify({
    locations: [location],
    listVersion,
  })}`;

  document.body.appendChild(iframe);

  canvas.onmousemove = (e) => {
    debugger;

    const i = Math.floor((e.clientX / canvas.width) * points.length);
    const h = (e.clientY / canvas.height) * 24;

    // const [h] = computedHours[i];

    const t = DateTime.fromISO(points[i].date + "T" + formatHour(h), {
      zone: points[i].timezone,
    }).toMillis();

    const day = 24 * 60 * 60 * 1000;
    const w = 2.5;

    iframe.contentWindow?.__useStore?.setState?.({
      t,
      tWindow: [t - (day * w) / 2, t + (day * w) / 2],
    });
  };

  // canvas.onclick = (e) => {
  //   const i = Math.floor((e.clientX / canvas.width) * points.length);
  //   const h = (e.clientY / canvas.height) * 24;

  //   const t = DateTime.fromISO(points[i].date + "T" + formatHour(h), {
  //     zone: points[i].timezone,
  //   }).toMillis();

  //   const day = 24 * 60 * 60 * 1000;
  //   const w = 2.5;

  //   iframe.contentWindow?.__useStore?.setState?.({
  //     t,
  //     tWindow: [t - (day * w) / 2, t + (day * w) / 2],
  //   });
  // };
})();
