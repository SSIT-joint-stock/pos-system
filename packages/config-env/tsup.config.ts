import { defineConfig, type Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  minify: false,
  ...options,
}));


