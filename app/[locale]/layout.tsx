import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from "next";
import "../globals.css";
import LoadingScreen from "@/components/Shared/LoadingScreen";
import {  type SystemLanguageCode } from '@/data/systemLanguages';

export const metadata: Metadata = {
  title: "Yasir - Web Developer + UX Designer",
  description:
    "I break down complex user experience problems to create integrity focussed solutions that connect billions of people",
};



export function generateStaticParams() {
  return routing.locales.map((locale: string) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  // Next.js 15'te params bir Promise
  const { locale } = await params;

  // Locale'in geçerli olup olmadığını kontrol et
  if (!routing.locales.includes(locale as SystemLanguageCode)) {
    notFound();
  }

  // Mesajları yükle
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <LoadingScreen />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}