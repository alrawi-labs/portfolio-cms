"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, Award, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Languages() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const t = useTranslations("languages");

  const languages = t.raw("languages");
  const levels = t.raw("levels");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setIsVisible(true);
          // Dilleri sırayla göster
          languages.forEach((_: any, index: number) => {
            setTimeout(() => {
              setVisibleItems((prev) => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, 300 + index * 150);
          });
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible, languages.length]);

  return (
    <section
      ref={sectionRef}
      id="languages"
      className="pb-20 px-4 sm:px-6 lg:px-8 bg-dark-secondary relative overflow-hidden"
      style={{ scrollMarginTop: '140px' }}
    >
      {/* Background Gradient Effects */}
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="w-10 h-10 text-primary" />
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-wide bg-gradient-hero bg-clip-text text-transparent">
              {t("title")}
            </h2>
          </div>
          <p className="text-text/90 text-lg max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Languages Grid */}
        <div className="grid sm:grid-cols-3 lg:grid-cols-3 gap-8">
          {languages.map((language: any, index: number) => (
            <div
              key={index}
              className={`relative transition-all duration-1000 ease-out ${
                visibleItems[index]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="group border border-border rounded-2xl p-10 hover:border-primary transition-all duration-500 relative overflow-hidden h-full hover:shadow-2xl hover:shadow-primary/20">
                {/* Background Image - Waving Flag */}
                <div 
                  className="absolute inset-0 opacity-40 group-hover:opacity-40 transition-opacity duration-500"
                  style={{ 
                    backgroundImage: `url(${language.backward})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
                
                {/* Waving Light Effect */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%, transparent 100%)',
                    animation: 'waveLight 3s ease-in-out infinite',
                    mixBlendMode: 'overlay'
                  }}
                ></div>
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-dark opacity-85 group-hover:opacity-80 transition-opacity duration-500"></div>
                
                {/* Hover Gradient Background */}
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                    style={{
                      animation: 'shimmer 2s infinite'
                    }}
                  ></div>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Flag with Glow Effect */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative text-7xl group-hover:scale-110 transition-transform duration-500">
                      {language.flag}
                    </div>
                  </div>

                  {/* Language Name */}
                  <h3 className="text-2xl font-bold text-text mb-2 group-hover:text-primary transition-colors duration-300">
                    {language.name}
                  </h3>
                  
                  {/* Native Name */}
                  <p className="text-text/60 text-base mb-6 font-medium">
                    {language.nativeName}
                  </p>

                  {/* Decorative Line */}
                  <div className="w-16 h-1 bg-gradient-primary rounded-full mb-6 group-hover:w-24 transition-all duration-500"></div>

                  {/* Level Badge */}
                  <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-primary group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-500">
                    <Award className="w-4 h-4 text-dark" />
                    <span className="text-dark font-bold text-sm">
                      {levels[language.level]}
                    </span>
                  </div>
                </div>

                {/* Corner Decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-primary opacity-0 group-hover:opacity-10 blur-2xl rounded-full transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-primary opacity-0 group-hover:opacity-10 blur-2xl rounded-full transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes waveLight {
          0% {
            transform: translateX(-100%) skewX(-15deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%) skewX(-15deg);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}