import { downloadGlb } from "./downloadGlb";
import { generateGlb } from "./generate";
generateGlb().then(downloadGlb);
