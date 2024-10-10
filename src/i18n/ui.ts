const defaultLang = 'de' as const;

export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.twitter': 'Twitter',
    title: 'Welcome to the Next.js i18n example',
  },
  de: {
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    title: "Bienvenue dans l'exemple de i18n de Next.js",
  },
} as const;

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}
