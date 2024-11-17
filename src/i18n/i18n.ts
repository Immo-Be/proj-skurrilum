import zooOfDeathTranslations from './rooms/der-zoo-des-todes.json';
import phantomIslandTranslations from './rooms/die-phantominsel.json';
import wailingWomanTranslations from './rooms/die-weinende-frau.json';
import guschisGrotteTranslations from './rooms/guschis-geile-grotte.json';
import malvinisVermächtnisTranslations from './rooms/malvinis-vermaechtnis.json';
import uiTranslations from './ui.json';

const defaultLang = 'de' as const;

const translations = {
  en: {
    ...zooOfDeathTranslations.en,
    ...uiTranslations.en,
    ...phantomIslandTranslations.en,
    ...wailingWomanTranslations.en,
    ...guschisGrotteTranslations.en,
    ...malvinisVermächtnisTranslations.en,
  },
  de: {
    ...zooOfDeathTranslations.de,
    ...uiTranslations.de,
    ...phantomIslandTranslations.de,
    ...wailingWomanTranslations.de,
    ...guschisGrotteTranslations.de,
    ...malvinisVermächtnisTranslations.de,
  },
} as const;

export function useTranslations(lang: keyof typeof translations) {
  return function t(key: keyof (typeof translations)[typeof defaultLang]) {
    return translations[lang][key] || translations[defaultLang][key];
  };
}

export type Translation = ReturnType<typeof useTranslations>;
