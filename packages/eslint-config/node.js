import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["node_modules/", "dist/", "build/"] },
  js.configs.recommended,
  // Base TS rules
  ...tseslint.configs.recommended,
  // Type-aware TS rules
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        // Enable type-aware linting without hardcoding project paths
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        Buffer: true,
        process: true,
        console: true,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "no-var": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-misused-promises": [
        2,
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
    },
  },
];