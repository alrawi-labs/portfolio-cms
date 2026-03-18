// data/systemLanguages.ts
export const systemLanguages = [
  { code: 'en', name: 'English', locale: 'en-US' },
  { code: 'tr', name: 'Türkçe', locale: 'tr-TR' },
  { code: 'ar', name: 'العربية', locale: 'ar-SA' }
] as const;

export const systemLanguageCodes = systemLanguages.map(lang => lang.code) as readonly string[];

export type SystemLanguageCode = typeof systemLanguages[number]['code'];

// Locale map'i otomatik oluştur
export const localeMap = Object.fromEntries(
  systemLanguages.map(lang => [lang.code, lang.locale])
);
