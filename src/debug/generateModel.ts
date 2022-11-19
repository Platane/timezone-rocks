//
// generate the earth glb from the source file
import { downloadGlb, generateGlb } from "../App/Earth/generate/generate";
generateGlb().then(downloadGlb);
