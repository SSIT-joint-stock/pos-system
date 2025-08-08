import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
	entry: ["./src/**/*.ts"],
	format: ["cjs", 'esm'],
	dts: true,
	clean: true,
	sourcemap: true,
	outExtension: ({ format }) => ({
		js: format === "cjs" ? ".cjs" : ".js",
	}),
	// Handle native modules and external dependencies
	external: [
		'bullmq',
		'snappy',
		'telegraf',
		'@telegraf/types',
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