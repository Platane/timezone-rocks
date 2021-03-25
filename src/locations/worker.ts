import { createWorkerHandler } from "../worker/utils";
import * as api from "./search";

createWorkerHandler(api);
