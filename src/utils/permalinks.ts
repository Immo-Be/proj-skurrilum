import slugify from 'limax';
import {trim} from '../utils/utils';
import { Locale } from '../configuration';
import astroConfig from '../../astro.config';


const APP_BLOG = {
  list: {
    pathname: 'blog',
  },
  category: {
    pathname: 'category',
  },
  tag: {
    pathname: 'tag',
  },
  post: {
    permalink: 'post/%slug%',
  },
};

const SITE = {
  name: 'Skurrilum',
  site: 'https://staging.seefalke.de',
  base: '/',
  trailingSlash: true,
};

export const trimSlash = (s: string) => trim(trim(s, '/'));

const {defaultLocale, prefixedLocales } = astroConfig.i18n;

const createPath = (...params: string[]) => {
  // Filter out default locale from path if prefixedLocales is false
  const filteredParams = !prefixedLocales && params.length > 0 && params[0] === defaultLocale
    ? params.slice(1)
    : params;
    
  const paths = filteredParams
    .map(el => trimSlash(el))
    .filter(el => !!el)
    .join('/');
  return '/' + paths + (SITE.trailingSlash && paths ? '/' : '');
};

const BASE_PATHNAME = SITE.base || '/';

export const cleanSlug = (text = '') =>
  trimSlash(text)
    .split('/')
    .map((slug: string) => slugify(slug))
    .join('/');

export const BLOG_BASE = cleanSlug(APP_BLOG?.list?.pathname);
export const CATEGORY_BASE = cleanSlug(APP_BLOG?.category?.pathname);
export const TAG_BASE = cleanSlug(APP_BLOG?.tag?.pathname) || 'tag';

export const POST_PERMALINK_PATTERN = trimSlash(
  APP_BLOG?.post?.permalink || `${BLOG_BASE}/%slug%`
);

/** */
export const getCanonical = (path = ''): string | URL => {
  const url = String(new URL(path, SITE.site));
  if (SITE.trailingSlash == false && path && url.endsWith('/')) {
    return url.slice(0, -1);
  } else if (SITE.trailingSlash == true && path && !url.endsWith('/')) {
    return url + '/';
  }
  return url;
};

/** 
 * Make sure these are identical to the old links
 */
export const getPermalink = (locale: Locale, slug = '', type = 'page'): string => {
  let permalink: string;

  if (
    slug.startsWith('https://') ||
    slug.startsWith('http://') ||
    slug.startsWith('://') ||
    slug.startsWith('#') ||
    slug.startsWith('javascript:')
  ) {
    return slug;
  }

  switch (type) {
    case 'home':
      permalink = getHomePermalink();
      break;

    case 'page':
      permalink = createPath(locale, trimSlash(slug));
      break;

    case 'game':
      permalink = createPath(locale);
      break;
    //case 'asset':
    //  permalink = getAsset(slug);
    //  break;
    //
    //case 'category':
    //  permalink = createPath(CATEGORY_BASE, trimSlash(slug));
    //  break;
    //
    //case 'tag':
    //  permalink = createPath(TAG_BASE, trimSlash(slug));
    //  break;
    //
    //case 'post': permalink = createPath(trimSlash(slug));
    //  break;
    //
    //case 'page':
    default:
      permalink = createPath(slug);
      break;
  }

  return definitivePermalink(permalink);
};

/** */
export const getHomePermalink = (): string => getPermalink('/');

/** */
export const getBlogPermalink = (): string => getPermalink(BLOG_BASE);

/** */
export const getAsset = (path: string): string =>
  '/' +
  [BASE_PATHNAME, path]
    .map(el => trimSlash(el))
    .filter(el => !!el)
    .join('/');

/** */
const definitivePermalink = (permalink: string): string =>
  createPath(BASE_PATHNAME, permalink);

/** */
interface MenuItem {
  href?: string | {type?: string; url?: string};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const applyGetPermalinks = (menu: MenuItem = {}): MenuItem => {
  if (Array.isArray(menu)) {
    return menu.map(item => applyGetPermalinks(item));
  } else if (typeof menu === 'object' && menu !== null) {
    const obj: MenuItem = {};
    for (const key in menu) {
      if (key === 'href') {
        if (typeof menu[key] === 'string') {
          obj[key] = getPermalink(menu[key]);
        } else if (typeof menu[key] === 'object') {
          if (menu[key].type === 'home') {
            obj[key] = getHomePermalink();
          } else if (menu[key].type === 'blog') {
            obj[key] = getBlogPermalink();
          } else if (menu[key].type === 'asset') {
            obj[key] = getAsset(menu[key].url);
          } else if (menu[key].url) {
            obj[key] = getPermalink(menu[key].url, menu[key].type);
          }
        }
      } else {
        obj[key] = applyGetPermalinks(menu[key]);
      }
    }
    return obj;
  }
  return menu;
};
