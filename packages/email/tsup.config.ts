import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
	entry: ["./src/**/*.ts"],
	format: ["cjs", 'esm'],
	dts: true,
	clean: true,
	sourcemap: true,
	// Handle native modules and external dependencies
	external: [
		'bullmq',
		'snappy',
		'nodemailer',
		'nodemailer-express-handlebars',
		'nodemailer-smtp-transport',
		'marked',
		'@repo/types',
		'@repo/utils'
	],
	// Skip bundling native modules
	noExternal: [],
	// Platform-specific settings
	platform: 'node',
	target: 'node18',
	// Handle native modules
	onSuccess: 'echo "Build completed successfully"',
	...options,
}));