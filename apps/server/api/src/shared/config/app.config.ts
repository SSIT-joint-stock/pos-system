import * as process from "process";
import { env } from "@repo/config-env";


const config = {
   ...env,
};

if (config.NODE_ENV === 'development') {
//   console.log('config', config);
}

export default config;