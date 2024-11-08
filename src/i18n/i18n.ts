import zoo_of_death from './rooms/der-zoo-des-todes.json';
import uiTranslations from './ui.json';

const defaultLang = 'de' as const;

const translations = {
  en: {
    ...zoo_of_death.en,
    ...uiTranslations.en,
  },
  de: {
    ...zoo_of_death.de,
    ...uiTranslations.de,
  },
} as const;

export function useTranslations(lang: keyof typeof translations) {
  return function t(key: keyof (typeof translations)[typeof defaultLang]) {
    return translations[lang][key] || translations[defaultLang][key];
  };
}

export type Translation = ReturnType<typeof useTranslations>;
