import * as fs from "fs";
import { getSunRiseTime } from "./sun-rise-cached";
import { location0 } from "../App/SolarSystem/location0";

/**
 * base on the location in the file location0,
 * get the sun set/rise hour for the 2022 year
 * and write the data in location0-sunRises.ts
 */

(async () => {
  const { timezone, points } = await getSunRiseTime(location0, 2022);

  fs.writeFileSync(
    __dirname + "/../App/SolarSystem/location0-sunRises.ts",
    "export const sunRises=" + JSON.stringify(points)
  );
})();
