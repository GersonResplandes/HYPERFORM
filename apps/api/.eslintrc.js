module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  extends: ["eslint:recommended", "@typescript-eslint/recommended", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": "warn",
  },
  env: {
    node: true,
    jest: true,
  },
};
