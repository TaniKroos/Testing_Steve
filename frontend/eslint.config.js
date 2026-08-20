import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module", parserOptions: { ecmaFeatures: { jsx: true } }, globals: { window: "readonly", document: "readonly", fetch: "readonly", URLSearchParams: "readonly" } },
    plugins: { "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    rules: { ...js.configs.recommended.rules, ...reactHooks.configs.recommended.rules, ...jsxA11y.configs.recommended.rules, "no-unused-vars": "off" },
  },
];
