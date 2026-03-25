import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale'i await ile al
  let locale = await requestLocale;

  // Locale'in geçerli olup olmadığını kontrol et
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: {
      // Ana mesajlar
      ...(await import(`@/messages/${locale}.json`)).default,
      
      // Bölüm mesajları
      blog: (await import(`@/messages/blog/${locale}.json`)).default,
      services: (await import(`@/messages/services/${locale}.json`)).default,
      resume: (await import(`@/messages/resume/${locale}.json`)).default,
      skills: (await import(`@/messages/skills/${locale}.json`)).default,
      languages: (await import(`@/messages/languages/${locale}.json`)).default,
      volunteering: (await import(`@/messages/volunteering/${locale}.json`)).default,
      certificates: (await import(`@/messages/certificates/${locale}.json`)).default,
      vision: (await import(`@/messages/vision/${locale}.json`)).default,
      projects: (await import(`@/messages/projects/index/${locale}.json`)).default,
      
      // ⚠️ ÖNEMLİ: Projeler artık burada YÜKLENMİYOR!
      // Projeler dinamik olarak getProjectsIndex() ve getProjectDetail() ile yükleniyor
      // Sadece statik UI metinleri için projects.json kullanılıyor (opsiyonel)
    }
  };
});