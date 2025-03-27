import { defineMiddleware } from 'astro/middleware';
import { getLocaleFromUrl } from './i18n/i18n';
import { localeSlugs } from './configuration';

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware((context, next) => {
  // Get the locale from the URL
  const locale = getLocaleFromUrl(context.request.url);
  
  console.log(
    `[Middleware] Processing ${context.request.url} with locale ${locale}`
  );
  
  // Store locale in locals for components to access
  context.locals.locale = locale;
  
  // Check if there's a language query parameter (for explicit language switching)
  const url = new URL(context.request.url);
  const targetLocale = url.searchParams.get('lang');
  
  if (targetLocale && localeSlugs.includes(targetLocale as any) && targetLocale !== locale) {
    // Log language change
    console.log(`[Middleware] Language change detected: ${locale} -> ${targetLocale}`);
    
    // Remove the lang parameter to avoid loops
    url.searchParams.delete('lang');
    
    // We'll let the client-side handler in LanguageSwitcher handle the actual redirect
    // This is to ensure it can handle the game-specific path logic
  }
  
  return next();
});
