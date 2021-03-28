import { createWorkerHandler } from "../worker/utils";
import * as api from "./api";

createWorkerHandler(api);
