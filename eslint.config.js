import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tailwindCanonicalClasses from "eslint-plugin-tailwind-canonical-classes";
import globals from "globals";

export default [
  {
    ignores: [
      "**/dist/**",
      "**/public/**",
      "**/*.d.ts",
      "packages/engine/assets/**",
    ],
  },
  // Browser-based code (Apps, SDK, and Engine Core)
  {
    files: [
      "apps/saas-web/**/*.{js,jsx}",
      "packages/sdk/**/*.{js,jsx}",
      "packages/engine/src/LivenessEngine.js",
      "packages/engine/src/utils.js",
    ],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "tailwind-canonical-classes": tailwindCanonicalClasses,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "tailwind-canonical-classes/tailwind-canonical-classes": [
        "warn",
        {
          cssPath: "apps/saas-web/src/index.css",
        },
      ],
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },
  // Node.js code (saas-api, config files, scripts, and engine tests)
  {
    files: [
      "apps/saas-api/**/*.js",
      "packages/engine/src/**/*.test.js",
      "**/vite.config.js",
      "scripts/**/*.js",
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },
];
