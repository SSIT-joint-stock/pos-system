import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false,
  clean: true,
  minify: !options.watch,
  sourcemap: options.watch ? 'inline' : false,
  ...options,
})); 