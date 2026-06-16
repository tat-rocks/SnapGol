import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es', 'pt', 'fr', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always',
});
