import { C } from '../configuration';
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

const IETF_BCP_47_LOCALE_PATTERN = /^\/?(\w{2}(?!\w)(-\w{1,})*)\/?/;

export function parseLocaleTagFromPath(path: string) {
  const match = path.match(IETF_BCP_47_LOCALE_PATTERN);
  return match ? match[1] : undefined;
}

export function parseLocale(locale?: string) {
  return locale && locale in C.LOCALES
    ? (locale as keyof typeof C.LOCALES)
    : C.DEFAULT_LOCALE;
}

/**
 * Extracts the pathname from a URL string
 */
function getPathnameFromString(urlString: string): string {
  try {
    // Handle both full URLs and pathname-only strings
    const urlObj = urlString.startsWith('http') 
      ? new URL(urlString) 
      : new URL(urlString, 'http://example.com');
    return urlObj.pathname;
  } catch (e) {
    // If URL parsing fails, use the string directly
    return urlString;
  }
}

/**
 * Removes the base URL prefix from a path if present
 */
function removeBaseUrlPrefix(path: string): string {
  if (import.meta.env.DEV_BASE_URL && path.startsWith(import.meta.env.DEV_BASE_URL)) {
    return path.slice(import.meta.env.DEV_BASE_URL.length);
  }
  return path;
}

/**
 * Extracts the locale from a URL or path string
 */
export function getLocaleFromUrl(url: URL | string) {
  
  // Extract the pathname
  const pathWithPrefix = typeof url === 'string' 
    ? getPathnameFromString(url) 
    : url.pathname;
  
  // Remove the base URL prefix if present
  const cleanPath = removeBaseUrlPrefix(pathWithPrefix);
  
  // Extract and parse the locale from the path
  const localeTag = parseLocaleTagFromPath(cleanPath);
  return parseLocale(localeTag);
}
