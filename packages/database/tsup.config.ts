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
	external: [
		"@prisma/client",
	],
	...options,
}));