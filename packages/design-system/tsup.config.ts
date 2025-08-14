import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entryPoints: ["src/**/*.tsx", "src/**/*.ts"],
  format: ["cjs", "esm"],
  dts: true,
  external: ["react", "react-dom", "next", ".css"],
  ...options,
}));