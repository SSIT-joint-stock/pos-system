/** @type {import("eslint").Linter.Config} */
export default {
  root: true,
  extends: ["@repo/eslint-config/node.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};