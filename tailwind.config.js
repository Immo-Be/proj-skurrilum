/** @type {import('tailwindcss').Config} */
// import typographyPlugin from '@tailwindcss/typography';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,astro}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito-Regular', ...defaultTheme.fontFamily.sans],
      },

      fontSize: {
        lg: 'var(--step-0)',
      },

      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        text_difference: 'rgb(var(--color-text-difference) / <alpha-value>)',
        primary: 'var(--aw-color-primary)',
        secondary: 'var(--aw-color-secondary)',
        accent: 'var(--aw-color-accent)',
        default: 'var(--aw-color-text-default)',
        muted: 'var(--aw-color-text-muted)',

        // success: 'rgb(var(--color-success) / <alpha-value>)',
        // info: 'rgb(var(--color-info) / <alpha-value>)',
        // warn: 'rgb(var(--color-warn) / <alpha-value>)',
        // error: 'rgb(var(--color-error) / <alpha-value>)',
        // transparent: 'transparent',
        // current: 'currentColor',
      },
    },
  },
  //   plugins: [typographyPlugin],
};
