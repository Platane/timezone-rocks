import { getSunRiseTime as getSunRiseTime_ } from "./sun-rise";
import * as crypto from "crypto";
import * as path from "path";
import * as fs from "fs";
import pLimit from "p-limit";

const limit = pLimit(1);

const CACHE_DIR = path.join(__dirname, ".cache");
fs.mkdirSync(CACHE_DIR, { recursive: true });

const HASH = crypto
  .createHash("sha256")
  .update(getSunRiseTime_.toString())
  .digest("hex")
  .slice(0, 6);

export const getSunRiseTime: typeof getSunRiseTime_ = async (
  p,
  year = 2020
) => {
  const cacheFilename =
    path.join(CACHE_DIR, [HASH, p.latitude, p.longitude, year].join("_")) +
    ".json";
  if (fs.existsSync(cacheFilename))
    return JSON.parse(fs.readFileSync(cacheFilename).toString());
  else {
    const result = await limit(() => getSunRiseTime_(p, year));
    fs.writeFileSync(cacheFilename, JSON.stringify(result));
    return result;
  }
};

const wait = (delay = 0) =>
  new Promise((resolve) => setTimeout(resolve, delay));
