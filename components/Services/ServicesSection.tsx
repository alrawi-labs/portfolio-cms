"use client";

import { useState, useEffect, useRef } from "react";
import * as LucideIcons from "lucide-react";
import { useTranslations } from 'next-intl';
import ServiceCard from "./ServiceCard";

export default function Services() {
  const t = useTranslations('services');
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  // Dinamik olarak hizmet sayısını al
  const servicesCount = t.raw('items').length;

  useEffect(() => {
    setVisibleCards(new Array(servicesCount).fill(false));
  }, [servicesCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);

          Array.from({ length: servicesCount }).forEach((_, index) => {
            setTimeout(() => {
              setVisibleCards((prev) => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, index * 400);
          });
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [servicesCount]);

  // Varsayılan icon listesi
  const defaultIcons = ['Code', 'Palette', 'Cpu', 'Shield'];

  return (
    <section
      ref={sectionRef}
      id="services"
      className="min-h-screen flex flex-col justify-center bg-dark-secondary relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20"
      style={{ scrollMarginTop: "25px" }}
    >
      {/* Background Gradient Effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-wide bg-gradient-hero bg-clip-text text-transparent mb-4">
            {t('title')}
          </h2>
          <p className="text-text/90 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
          {t.raw('items').map((service: any, index: number) => {
            const iconName = service.icon || defaultIcons[index] || 'Code';
            
            // Lucide'dan dinamik olarak icon al
            const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Code;

            return (
              <ServiceCard
                key={index}
                number={index + 1}
                title={service.title}
                description={service.description}
                icon={IconComponent}
                index={index}
                isVisible={visibleCards[index]}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}