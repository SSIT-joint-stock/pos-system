import * as process from "process";
import { env } from "@repo/config-env";


const config = {
   ...env,
};

console.log('config', config);

export default config;