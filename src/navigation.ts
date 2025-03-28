import { GAME_KEY, Locale } from './configuration';
import { getPermalink  } from './utils/permalinks';

import {  useTranslations } from './i18n/i18n';
import { GamePaths } from './pages/path';

export const headerData = (locale: Locale) => {
  const t = useTranslations(locale);
  return {
    links: [
      {
        text: t('nav.rooms'),
        links: [
          {
            text: t('wailing-woman.titleShort'),
            href: getPermalink(locale, GamePaths[GAME_KEY.Frau][locale].game),
          },

          {
            text: t('zoo-of-death.titleShort'),
            href: getPermalink(locale, GamePaths[GAME_KEY.Zoo][locale].game),
          },
          {
            text: t('malvini.titleShort'),
            href: getPermalink(
              locale,
              GamePaths[GAME_KEY.Malvini][locale].game
            ),
          },
          {
            text: t('phantom-island.titleShort'),
            href: getPermalink(
              locale,
              GamePaths[GAME_KEY.Phantominsel][locale].game
            ),
          },
          {
            text: t('guschi.titleShort'),
            href: getPermalink(locale, GamePaths[GAME_KEY.Guschi][locale].game),
          },
        ],
      },
      {
        text: t('nav.groups'),
        href: getPermalink('/firmen'),
      },
      {
        text: t('nav.contact'),
        href: getPermalink('/kontakt'),
      },
      {
        text: t('nav.faqs'),
        href: getPermalink('/faq'),
      },

      {
        text: t('nav.makers'),
        href: getPermalink('/die-macher'),
      },
    ],
    actions: [
      {
        text: 'Download',
        href: 'https://github.com/onwidget/astrowind',
        target: '-blank',
      },
    ],
  };
};
