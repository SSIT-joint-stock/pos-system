import { join } from 'path';
const cwd = process.cwd();

export const apps = [
    {
        name: 'pos-web-main',
        script: 'npm run start',
        cwd: join(cwd, 'apps/web/main'),
        watch: false,
        env_file: join(cwd, '.env.production'),
        env_production: {
            NODE_ENV: 'production',
        },
        out_file: "./front-end-out.log",
        error_file: "./front-end-error.log",
        log_date_format: "DD-MM HH:mm:ss Z",
    },
    {
        name: 'pos-web-retail',
        script: 'npm run start',
        cwd: join(cwd, 'apps/web/retail'),
        watch: false,
        env_file: join(cwd, '.env.production'),
        env_production: {
            NODE_ENV: 'production',
        },
        out_file: "./front-end-out.log",
        error_file: "./front-end-error.log",
        log_date_format: "DD-MM HH:mm:ss Z",
    }
];