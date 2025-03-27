
import { GamePaths } from '../pages/[...locale]/[game]/path';
import { GAME_KEY } from '../configuration';
import { getLocaleFromUrl } from '../i18n/i18n';

/**
 * Checks if the current path is a game path and returns the appropriate localized version
 * @param currentPath The current URL path
 * @param targetLocale The locale to switch to
 * @returns The localized game path or null if not a game path
 */
export function getLocalizedGamePath(currentPath: string, targetLocale: string): string | null {
  // Extract path segments
  const pathSegments = currentPath.split('/').filter(Boolean);
  
  // If we don't have enough segments, it's not a game path
  if (pathSegments.length < 1) return null;
  
  // Determine current locale (might be in first segment or default)
  const currentLocale = getLocaleFromUrl(currentPath);
  
  // Extract the potential game slug (could be in first or second position depending on locale)
  const gameSlug = pathSegments.length > 1 && pathSegments[0] === currentLocale 
    ? pathSegments[1] 
    : pathSegments[0];
  
  // Look through all game paths to find a match
  for (const [gameKey, translations] of Object.entries(GamePaths)) {
    // Check if this game slug matches any of our known games in the current locale
    if (translations[currentLocale]?.game === gameSlug) {
      // We found a match! Get the target locale's path for this game
      const targetPath = translations[targetLocale];
      
      if (targetPath) {
        // Construct the new path
        const basePath = targetPath.locale ? `/${targetPath.locale}` : '';
        return `${basePath}/${targetPath.game}`;
      }
    }
  }
  
  // If we reach here, no matching game path was found
  return null;
}
