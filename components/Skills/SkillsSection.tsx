"use client";

import { useState, useEffect, useRef } from "react";
import { Code2, Layers, Brain, Database } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Skills() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const t = useTranslations("skills");

  const skillsData = [
    {
      icon: Code2,
      title: t("categories.programmingLanguages"),
      skills: t.raw("skills.programmingLanguages"),
    },
    {
      icon: Layers,
      title: t("categories.frameworks"),
      skills: t.raw("skills.frameworks"),
    },
    {
      icon: Brain,
      title: t("categories.concepts"),
      skills: t.raw("skills.concepts"),
    },
    {
      icon: Database,
      title: t("categories.databases"),
      skills: t.raw("skills.databases"),
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const currentCategory = skillsData[activeCategory];
  const Icon = currentCategory.icon;

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="min-h-screen flex flex-col bg-dark-secondary justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20"
      style={{ 
        scrollMarginTop: '35px',
      }}
    >
      {/* Background Gradient Effects */}
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(135, 80, 247, 0.1)' }}></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(135, 80, 247, 0.05)' }}></div>

      <div className="container mx-auto relative z-10 max-w-6xl">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-wide bg-gradient-hero bg-clip-text text-transparent mb-4">
            {t("title")}
          </h2>
          <p className="text-text/90 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Category Tabs */}
        <div
          className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {skillsData.map((category, index) => {
            const CategoryIcon = category.icon;
            return (
              <button
                key={index}
                onClick={() => setActiveCategory(index)}
                className={`group flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === index
                    ? "scale-105 shadow-lg"
                    : "border hover:border-opacity-100"
                }`}
                style={{
                  background: activeCategory === index 
                    ? 'linear-gradient(260deg, #2a1454, #8750f7)' 
                    : '#0e0714',
                  borderColor: activeCategory === index ? 'transparent' : '#8750f7',
                  borderWidth: '1px',
                  color: activeCategory === index ? '#140c1c' : 'rgb(221, 221, 221)',
                  boxShadow: activeCategory === index ? '0 10px 40px rgba(135, 80, 247, 0.3)' : 'none'
                }}
              >
                <CategoryIcon className="w-5 h-5" />
                <span className="hidden sm:inline">{category.title}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Display */}
        <div
          className={`relative transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Category Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl p-0.5" style={{ background: 'linear-gradient(260deg, #2a1454, #8750f7)' }}>
              <div className="w-full h-full rounded-2xl flex items-center justify-center" style={{ background: '#140c1c' }}>
                <Icon className="w-8 h-8" style={{ color: '#8750f7' }} />
              </div>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold" style={{ color: 'rgb(221, 221, 221)' }}>
              {currentCategory.title}
            </h3>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentCategory.skills.map((skill: any, index: number) => (
              <div
                key={skill.name}
                className="group relative overflow-hidden rounded-xl p-6 transition-all duration-500 hover:scale-105"
                style={{
                  background: '#0e0714',
                  borderWidth: '1px',
                  borderColor: '#8750f7',
                  animation: isVisible
                    ? `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                    : "none",
                }}
              >
                {/* Hover Gradient Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(135, 80, 247, 0.1), rgba(42, 20, 84, 0.1))'
                  }}
                ></div>
                
                {/* Skill Name */}
                <div className="relative z-10 flex items-center gap-3">
                  <div 
                    className="w-2 h-2 rounded-full transition-all duration-500 group-hover:w-3 group-hover:h-3"
                    style={{ background: '#8750f7' }}
                  ></div>
                  <span 
                    className="font-medium text-base lg:text-lg transition-colors duration-300"
                    style={{ color: 'rgb(221, 221, 221)' }}
                  >
                    {skill.name}
                  </span>
                </div>

                {/* Shimmer Effect on Hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                    animation: 'shimmer 2s infinite'
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
}