import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["./src/**/*.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  minify: false,
  // Handle external dependencies
  external: [
    'clsx',
    'tailwind-merge',
    'dayjs',
    'zod'
  ],
  // Skip bundling external modules
  noExternal: [],
  // Platform-specific settings
  platform: 'node',
  target: 'node18',
  // Handle native modules
  onSuccess: 'echo "Build completed successfully"',
  ...options,
}));