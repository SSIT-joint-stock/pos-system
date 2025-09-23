// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginNext from "@next/eslint-plugin-next";
import pluginFilenames from "eslint-plugin-filenames";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

export default [
  { ignores: ["node_modules/", ".next/", "dist/", "build/", "coverage/"] },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,

  {
    // React/Next/filenames rules
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "@next/next": pluginNext,
      filenames: pluginFilenames,
    },
    settings: { react: { version: "detect" } },

    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.serviceworker,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },

    rules: {
      // Next
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
      // React + Hooks
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@next/next/no-html-link-for-pages": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // TS files
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "filenames/match-regex": ["error", "^(index|[a-z0-9-]+)$", true],
    },
  },

  // .d.ts
  {
    files: ["**/*.d.ts"],
    rules: { "filenames/match-regex": "off" },
  },

  // // test files
  // {
  //   files: ["**/*.test.ts", "**/*.test.tsx"],
  //   rules: {
  //     "filenames/match-regex": [
  //       "error",
  //       "^(index|[a-z0-9-]+|[A-Z][A-Za-z0-9]*)\\.test$",
  //       true,
  //     ],
  //   },
  // },
];
