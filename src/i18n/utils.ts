import vi from './vi.json';
import en from './en.json';

type Locale = 'vi' | 'en';

const translations = { vi, en } as const;

export function t(locale: Locale, keyPath: string): string {
  const keys = keyPath.split('.');
  let current: unknown = translations[locale];
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return keyPath;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : keyPath;
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, firstSegment] = url.pathname.split('/');
  if (firstSegment === 'en') return 'en';
  return 'vi';
}

export function getAlternatePath(locale: Locale, currentPath: string): string {
  if (locale === 'vi') {
    // switching to EN
    return '/en' + (currentPath === '/' ? '' : currentPath);
  } else {
    // switching to VI (default, no prefix)
    return currentPath.replace(/^\/en/, '') || '/';
  }
}

// For array items (features, pricing tiers)
export function ta(locale: Locale, keyPath: string): string[] {
  const keys = keyPath.split('.');
  let current: unknown = translations[locale];
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return [];
    current = (current as Record<string, unknown>)[key];
  }
  return Array.isArray(current) ? (current as string[]) : [];
}
