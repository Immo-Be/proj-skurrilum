import tailwind from '@astrojs/tailwind';
import {i18n} from 'astro-i18n-aut/integration';
import icon from 'astro-icon';
import {defineConfig} from 'astro/config';

// Todo: Add sitemap filter to i18n integration

const defaultLocale = 'de';
const locales = {
  de: 'de', // the `defaultLocale` value must present in `locales` keys
  en: 'en',
};

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com/',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    i18n({
      defaultLocale, // the default locale
      locales, // the locales you want to support
    }),
    tailwind(),
    icon({
      include: {
        tabler: ['*'],
      },
    }),
  ],
});