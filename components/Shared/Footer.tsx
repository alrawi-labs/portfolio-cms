"use client";

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('header');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#140c1c] border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <svg width="50" height="50" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
              <path d="M 499 43C 446 43 397 71 370 118C 370 118 20 724 20 724C -7 770 -7 827 20 874C 47 920 96 949 150 949C 150 949 850 949 850 949C 904 949 953 920 980 874C 1007 827 1007 770 980 724C 980 724 630 118 630 118C 604 73 558 45 507 43C 504 43 502 43 499 43C 499 43 499 43 499 43M 0,0" className="fill-white" />
            </svg>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-8 mb-8">
            <button onClick={() => scrollToSection('services')} className="hover:text-purple-400 transition-colors relative group">
              {t('services')}.
              <span className="absolute -bottom-1 start-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-purple-400 transition-colors relative group">
              {t('projects')}.
              <span className="absolute -bottom-1 start-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => scrollToSection('skills')} className="hover:text-purple-400 transition-colors relative group">
              {t('skills')}.
              <span className="absolute -bottom-1 start-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => scrollToSection('resume')} className="hover:text-purple-400 transition-colors relative group">
              {t('resume')}.
              <span className="absolute -bottom-1 start-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => scrollToSection('languages')} className="hover:text-purple-400 transition-colors relative group">
              {t('languages')}.
              <span className="absolute -bottom-1 start-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => scrollToSection('volunteering')} className="hover:text-purple-400 transition-colors relative group">
              {t('volunteering')}.
              <span className="absolute -bottom-1 start-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => scrollToSection('certificates')} className="hover:text-purple-400 transition-colors relative group">
              {t('certificates')}.
              <span className="absolute -bottom-1 start-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-purple-400 transition-colors relative group">
              {t('contact')}.
              <span className="absolute -bottom-1 start-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </button>
          </nav>

          {/* Copyright */}
          <div className="text-gray-400">
            © 2026 All Rights Reserved by{" "}
            <span className="text-purple-400">Yasir AL-Rawi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}