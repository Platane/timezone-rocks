import fetch from "node-fetch";
import cheerio, { Element } from "cheerio";

export const getSunRiseTime = async (
  position: { latitude: number; longitude: number },
  year = 2020
) => {
  console.log("fetching", (position as any).name, year);

  const url =
    `https://gml.noaa.gov/grad/solcalc/table.php?` +
    new URLSearchParams({
      lat: position.latitude + "",
      lon: position.longitude + "",
      year: year + "",
    }).toString();

  const html = await fetch(url, {
    headers: { "User-Agent": "github.com/platane/timezone-rocks node-fetch" },
  }).then((res) => res.text());

  const timezone = html.match(/Time Zone Offset: ([\S]+)/)?.[1];

  const $ = cheerio.load(html);

  const readTable = (table: Element) =>
    new Map(
      $(table)
        .find("tr")
        .toArray()
        .slice(1)
        .map((td, day) =>
          $(td)
            .find("td")
            .toArray()
            .slice(1)
            .map((td, month) => {
              const text = $(td).text();
              return [
                year +
                  "-" +
                  (month + 1).toString().padStart(2, "0") +
                  "-" +
                  (day + 1).toString().padStart(2, "0"),
                text,
              ];
            })
        )
        .flat()
        .filter(([, value]) => value)
        .sort() as [string, string][]
    );

  const [sunRiseTable, sunSetTable] = $("table").toArray();

  const sunRiseMap = readTable(sunRiseTable);
  const sunSetMap = readTable(sunSetTable);

  const points = Array.from(sunRiseMap.keys()).map((date) => ({
    date,
    sunRise: sunRiseMap.get(date)!,
    sunSet: sunSetMap.get(date)!,
  }));

  return { timezone, points };
};
