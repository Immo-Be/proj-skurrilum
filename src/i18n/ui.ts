import room1 from './rooms/der-zoo-des-todes.json';

const defaultLang = 'de' as const;

// type En = Record<string, string>;

// type Translation<Enn extends En> = {
//   en: Enn;
//   de: {
//     [Properties in keyof Enn]: string;
//   };
// };

// const room1: Translation<En> = {

// } as const;

export const tsdf = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.twitter': 'Twitter',
  },
  de: {
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
  },
} as const;

export const ui = {
  en: {
    ...room1.en,
    ...tsdf.en,
  },
  de: {
    ...room1.de,
    ...tsdf.de,
  },
} as const;

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}
