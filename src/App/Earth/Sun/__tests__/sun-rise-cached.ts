import { getSunRiseTime as getSunRiseTime_ } from "./sun-rise";
import * as crypto from "crypto";
import * as path from "path";
import * as fs from "fs";

const CACHE_DIR = path.join(__dirname, ".cache");
fs.mkdirSync(CACHE_DIR, { recursive: true });

const HASH = crypto
  .createHash("sha256")
  .update(getSunRiseTime_.toString())
  .digest("hex");

export const getSunRiseTime: typeof getSunRiseTime_ = async (
  { latitude, longitude },
  year = 2020
) => {
  const cacheFilename =
    path.join(
      CACHE_DIR,
      ["sunrise", HASH, latitude, longitude, year].join("_")
    ) + ".json";
  if (fs.existsSync(cacheFilename))
    return JSON.parse(fs.readFileSync(cacheFilename).toString());
  else {
    const result = await getSunRiseTime_({ latitude, longitude }, year);
    fs.writeFileSync(cacheFilename, JSON.stringify(result));
    return result;
  }
};
