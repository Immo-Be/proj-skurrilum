export const C = {
  // Key is the locale slug, value is the locale code
  LOCALES: { en: 'en-US', de: 'de-DE' },
  // Default locale referencing one of the keys in LOCALES
  DEFAULT_LOCALE: 'de' as const,
  // Static messages for each locale
  // Various settings
  SETTINGS: {
    REMOTE: {
      BASE_URL: 'https://github.com/openscript/astro-theme-international',
    },
    BLOG: {
      PAGE_SIZE: 20,
    },
  },
} as const;


export const GAME_KEY = {
  Phantominsel: 'phantominsel',
  Frau: 'weinende-frau',
  Malvini: 'malvinis-vermaechtnis',
  Zoo: 'zoo-des-todes',
  Guschi: 'guschi',
} as const;

// Configuration helpers
export type Locale = keyof typeof C.LOCALES;
export const Locales = Object.keys(C.LOCALES).map(
  (key) => key as Locale
)

export const localeSlugs = Object.keys(C.LOCALES) as Locale[];
