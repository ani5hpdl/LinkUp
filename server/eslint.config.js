import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default [
  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.node,
      },
    },

    rules: {
      // 🔧 Practical backend rules
      "no-console": "warn",
      "no-unused-vars": "off", // handled by TS
      "@typescript-eslint/no-unused-vars": ["warn"],

      // Better error handling
      "@typescript-eslint/no-explicit-any": "warn",

      // Async safety
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/await-thenable": "error",

      // Clean imports
      "@typescript-eslint/consistent-type-imports": "warn",
    },
  },

  {
    ignores: [
      "node_modules",
      "dist",
      "build",
      ".env",
    ],
  },
];