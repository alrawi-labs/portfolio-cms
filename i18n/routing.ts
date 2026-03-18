import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { systemLanguageCodes, type SystemLanguageCode } from '@/data/systemLanguages';

export type Locale = SystemLanguageCode;

export const routing = defineRouting({
  locales: systemLanguageCodes,
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);