import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// In order to VSCode to recognize these rules, we need to enable
export default [
  {
    languageOptions: {globals: globals.browser},
  },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,

  {
    rules: {
      'no-console': [
        1,
        {
          allow: ['warn', 'error'],
        },
      ],
      quotes: [2, 'single', 'avoid-escape'],
    },
  },
  eslintConfigPrettier,
];
