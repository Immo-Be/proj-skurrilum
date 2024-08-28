/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,astro}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito-Regular', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        // success: 'rgb(var(--color-success) / <alpha-value>)',
        // info: 'rgb(var(--color-info) / <alpha-value>)',
        // warn: 'rgb(var(--color-warn) / <alpha-value>)',
        // error: 'rgb(var(--color-error) / <alpha-value>)',
        // transparent: 'transparent',
        // current: 'currentColor',
      },
    },
  },
  plugins: [],
};
