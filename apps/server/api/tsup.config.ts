import { defineConfig, type Options } from "tsup";
import { promises } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

export default defineConfig(async (options: Options) => {
	return ({
		entry: ["./src/**/*.ts"],
		// entry: ["./src/**/*.{js,jsx,ts,tsx}"],
		// Mark problematic packages as external
		external: [
			'@mapbox/node-pre-gyp',
			'aws-sdk',
			'mock-aws-s3',
			'nock',
			'@jsdevtools/ono',
			'*.node',
			'snappy',
			'bcrypt',
			'sharp'
		],
		// noExternal: [/^(?!(@mapbox\/node-pre-gyp|aws-sdk|mock-aws-s3|nock|@jsdevtools\/ono)$).*/],
		exclude: ["**/*.hbs", "**/*.html"],
		format: ["esm", "cjs"],
		clean: true, // clean the dist folder before bundling
		// bundle: true, // bundle all dependencies, except "devDependencies"
		tsconfig: "./tsconfig.json",
		platform: 'node',
		// watch: "./src/**/*",
		...options,
		onSuccess: async () => {
			// Copy handlebars templates
			const templateFiles = glob.sync('src/modules/**/*.hbs');
			for (const file of templateFiles) {
				const destPath = file.replace('src/', 'dist/');
				await promises.mkdir(join(process.cwd(), destPath, '..'), { recursive: true });
				await promises.copyFile(file, destPath);
			}

			// Copy package.json to dist directory for bcrypt
			await promises.copyFile('package.json', 'dist/package.json');
		},
	})
});