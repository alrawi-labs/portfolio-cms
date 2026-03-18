"use client";

import { useState, useEffect, useRef } from "react";
import { Briefcase, GraduationCap } from "lucide-react";
import { useTranslations } from 'next-intl';

interface ResumeItem {
  year: string;
  title: string;
  company: string;
}

export default function ExperienceEducation() {
  const t = useTranslations('resume');
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"experience" | "education">("experience");
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const experiences: ResumeItem[] = t.raw('experience');
  const education: ResumeItem[] = t.raw('education');

  const currentData = activeTab === "experience" ? experiences : education;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setIsVisible(true);
          currentData.forEach((_, index) => {
            setTimeout(() => {
              setVisibleItems((prev) => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, 500 + (index * 200));
          });
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible, currentData.length]);

  useEffect(() => {
    setVisibleItems([]);
    currentData.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, index * 200);
    });
  }, [activeTab]);

  return (
    <section
      ref={sectionRef}
      id="resume"
      className="min-h-screen flex flex-col justify-center bg-dark-secondary relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20"
      style={{ scrollMarginTop: '35px' }}
    >
      {/* Background Gradient Effects */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto relative z-10 max-w-5xl">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-wide bg-gradient-hero bg-clip-text text-transparent mb-4">
            {t('title')}
          </h2>
          <p className="text-text/90 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Tab Buttons */}
        <div
          className={`flex justify-center gap-4 mb-12 transition-all duration-1000 delay-200 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <button
            onClick={() => setActiveTab("experience")}
            className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === "experience"
                ? "bg-gradient-primary text-dark shadow-lg shadow-primary/50"
                : "bg-dark border border-border text-text hover:border-primary"
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span>{t('tabs.experience')}</span>
          </button>
          <button
            onClick={() => setActiveTab("education")}
            className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === "education"
                ? "bg-gradient-primary text-dark shadow-lg shadow-primary/50"
                : "bg-dark border border-border text-text hover:border-primary"
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span>{t('tabs.education')}</span>
          </button>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent hidden lg:block"></div>

          {/* Timeline Items */}
          <div className="space-y-8">
            {currentData.map((item: any, index: number) => (
              <div
                key={index}
                className={`relative transition-all duration-1000 ease-out ${
                  visibleItems[index]
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-16 scale-95"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`flex flex-col lg:flex-row gap-8 items-start lg:items-center ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Content Card */}
                  <div className="flex-1 lg:w-[calc(50%-2rem)]">
                    <div
                      className={`group bg-gradient-to-br from-dark via-dark-secondary to-dark backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-primary hover:from-dark-secondary hover:via-dark hover:to-dark-secondary transition-all duration-500 relative overflow-hidden ${
                        index % 2 === 0 ? "lg:text-right" : "lg:text-left"
                      }`}
                    >
                      {/* Hover Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Shine Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      </div>

                      <div className="relative z-10">
                        {/* Year */}
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
                          {item.year}
                        </span>

                        {/* Title */}
                        <h3 className="text-xl lg:text-2xl font-bold text-text mb-2 group-hover:text-primary transition-colors duration-300">
                          {item.title}
                        </h3>

                        {/* Company */}
                        <p className="text-text/70 text-base lg:text-lg">
                          {item.company}
                        </p>
                      </div>

                      {/* Bottom Line Animation */}
                      <div
                        className={`mt-4 h-0.5 bg-gradient-primary transition-all duration-700 ${
                          index % 2 === 0
                            ? "group-hover:w-full ml-auto"
                            : "group-hover:w-full"
                        } w-0`}
                      ></div>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="hidden lg:flex items-center justify-center w-16 shrink-0">
                    <div className={`w-4 h-4 rounded-full bg-primary border-4 border-dark shadow-lg shadow-primary/50 relative transition-all duration-500 ${
                      visibleItems[index] ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    }`}>
                      <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75"></div>
                      <div className="absolute inset-[-8px] rounded-full border border-primary/30"></div>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden lg:block flex-1 lg:w-[calc(50%-2rem)]"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}