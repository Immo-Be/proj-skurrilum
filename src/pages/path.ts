import type { GetStaticPaths } from 'astro';
import { GAME_KEY } from '../configuration';

export const GamePaths = {
  [GAME_KEY.Guschi]: {
    de: {
      locale: undefined,
      game: 'guschis-geile-grotte',
    },
    en: {
      locale: 'en',
      game: 'guschis-seedy-cellar',
    },
  },
  [GAME_KEY.Zoo]: {
    de: {
      locale: undefined,
      game: 'zoo-des-todes',
    },
    en: {
      locale: 'en',
      game: 'the-zoo-of-death',
    },
  },
  [GAME_KEY.Phantominsel]: {
    de: {
      locale: undefined,
      game: 'die-phantominsel',
    },
    en: {
      locale: 'en',
      game: 'the-phantom-island',
    },
  },
  [GAME_KEY.Frau]: {
    de: {
      locale: undefined,
      game: 'die-weinende-frau',
    },
    en: {
      locale: 'en',
      game: 'the-wailing-woman',
    },
  },
  [GAME_KEY.Malvini]: {
    de: {
      locale: undefined,
      game: 'malvinis-vermaechtnis',
    },
    en: {
      locale: 'en',
      game: 'malvinis-legacy',
    },
  },
} as const;

export const generateRouteParams = (async () => {
  return Object.entries(GamePaths).flatMap(([key, translations]) =>
    // For default locale (German), we have to pass undefined as the locale
    // This will generate URLs like /game-name instead of /de/game-name
    // For the props, we want to pass the actual locale
    Object.entries(translations).map(([localekey, { locale, game }]) => ({
      params: {
        locale,
        game,
      },
      props: { game: key, locale: localekey },
    }))
  );
}) satisfies GetStaticPaths;
