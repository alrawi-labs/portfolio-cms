'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { routing, type Locale } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';
import { systemLanguages } from '@/data/systemLanguages';

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  // systemLanguages'den languageNames objesi oluştur
  const languageNames = Object.fromEntries(
    systemLanguages.map(lang => [lang.code, lang.name])
  ) as Record<Locale, string>;

  // Dışarı tıklandığında menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative group/dropdown" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 rounded-xl border border-border/30 bg-dark-secondary/50 backdrop-blur-sm text-text hover:text-text-hover hover:border-primary/50 transition-all duration-300 text-base font-semibold tracking-wide flex items-center gap-2 relative group/button"
        aria-label="Dil seçimi"
        aria-expanded={isOpen}
      >
        <span className="relative z-10">{languageNames[locale]}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-500 relative z-10 ${isOpen ? 'rotate-180' : ''}`} />
        <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300 rounded-xl"></span>
      </button>

      {/* Dropdown Menu */}
      <div className={`absolute top-full start-0 mt-4 w-56 origin-top transition-all duration-500 ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="bg-dark/95 backdrop-blur-xl border border-border/30 rounded-2xl overflow-hidden shadow-2xl">
          <div className="h-1 bg-gradient-primary"></div>
          <div className="p-2">
            {(routing.locales as readonly Locale[]).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`w-full text-start px-5 py-3.5 transition-all duration-300 text-base rounded-xl relative group/item ${
                  locale === lang
                    ? 'text-primary font-bold bg-primary/10'
                    : 'text-text hover:text-text-hover hover:bg-primary/10'
                }`}
              >
                <span className="relative z-10 flex items-center justify-between">
                  {languageNames[lang]}
                  {locale === lang && (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                {locale !== lang && (
                  <span className="absolute start-0 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-gradient-primary group-hover/item:w-4 transition-all duration-500 ms-1"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}