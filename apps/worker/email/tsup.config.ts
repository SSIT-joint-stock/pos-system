import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: !options.watch,
  sourcemap: options.watch ? 'inline' : false,
  ...options,
})); 