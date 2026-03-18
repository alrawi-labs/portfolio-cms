"use client";

import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import {
  Download,
  Instagram,
  Linkedin,
  Github,
  Twitter,
  ArrowRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { contactData } from "@/data/contacts";
import { statsData } from "@/data/stats";
import { personalData } from "@/data/personal";

const iconMap: Record<string, any> = {
  Instagram,
  Linkedin,
  Twitter,
  Github,
};
import "./hero.css";

export default function Hero() {
  const t = useTranslations("home.hero");
  const tStats = useTranslations("home.stats");
  const [years, setYears] = useState<number | string>(0);
  const [projects, setProjects] = useState<number | string>(0);
  const [clients, setClients] = useState<number | string>(0);
  const [awards, setAwards] = useState<number | string>(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateValue(setYears, 0, 14, 2000);
          animateValue(setProjects, 0, 50, 2000);
          animateValue(setClients, 0, 1.5, 2000, true);
          animateValue(setAwards, 0, 24, 2000);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateValue = (
    setter: Dispatch<SetStateAction<number | string>>,
    start: number,
    end: number,
    duration: number,
    isDecimal: boolean = false
  ): void => {
    const startTime = performance.now();
    const animate = (currentTime: number): void => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = start + (end - start) * easeOutQuart;

      if (isDecimal) {
        setter(current.toFixed(1));
      } else {
        setter(Math.floor(current));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  return (
    <section className="min-h-screen bg-dark-secondary flex flex-col relative overflow-hidden pt-20 pb-8 sm:pb-12 lg:pt-0 lg:pb-16">
      {/* Background Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Original Gradient Circles */}
        <div className="absolute -top-40 -right-40 sm:-top-60 sm:-right-56 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full gradient-top-right" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/3 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full gradient-middle" />

        {/* Soft Rounded Triangles - Distributed to Corners */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.12 }}
        >
          {/* Triangle 1 - Top Right Corner */}
          <path
            d="M 1100 80 L 1250 320 L 950 320 Z"
            fill="none"
            stroke="rgba(135, 80, 247, 0.4)"
            strokeWidth="3"
            className="animate-float-triangle-1"
            style={{
              strokeLinejoin: "round",
              strokeLinecap: "round",
              filter: "blur(1px)",
            }}
          />

          {/* Triangle 2 - Bottom Left Corner */}
          <path
            d="M 120 650 L 280 850 L -40 850 Z"
            fill="none"
            stroke="rgba(135, 80, 247, 0.35)"
            strokeWidth="3"
            className="animate-float-triangle-2"
            style={{
              strokeLinejoin: "round",
              strokeLinecap: "round",
              filter: "blur(1px)",
            }}
          />

          {/* Triangle 3 - Top Left Corner (Small, Inverted) */}
          <path
            d="M 100 200 L -20 50 L 220 50 Z"
            fill="none"
            stroke="rgba(135, 80, 247, 0.28)"
            strokeWidth="2"
            className="animate-float-triangle-3"
            style={{
              strokeLinejoin: "round",
              strokeLinecap: "round",
              filter: "blur(0.5px)",
            }}
          />

          {/* Triangle 4 - Bottom Right Corner (Medium) */}
          <path
            d="M 1150 750 L 1300 920 L 1000 920 Z"
            fill="none"
            stroke="rgba(135, 80, 247, 0.3)"
            strokeWidth="2.5"
            className="animate-float-triangle-4"
            style={{
              strokeLinejoin: "round",
              strokeLinecap: "round",
              filter: "blur(0.8px)",
            }}
          />

          {/* Triangle 5 - Middle Right Edge (Small) */}
          <path
            d="M 1200 400 L 1300 550 L 1100 550 Z"
            fill="none"
            stroke="rgba(135, 80, 247, 0.22)"
            strokeWidth="2"
            className="animate-float-triangle-1"
            style={{
              strokeLinejoin: "round",
              strokeLinecap: "round",
              filter: "blur(0.5px)",
              animationDelay: "1s",
            }}
          />
        </svg>

        {/* HI Text Background */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 800"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <text
            x="40%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="300"
            fill="none"
            className="stroke-primary"
            opacity="0.2"
            strokeWidth="2"
            fontWeight="900"
            fontFamily="'Bebas Neue', cursive"
            style={{
              animation: "scaleText 3s ease-in-out infinite",
              transformOrigin: "center",
              transformBox: "fill-box",
            }}
          >
            HI
          </text>
        </svg>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-1 flex items-center mt-5 lg:mt-32">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            {/* Mobile Layout */}
            <div className="lg:hidden space-y-4">
              {/* 1. Main Heading - Mobile */}
              <div className="space-y-2">
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-text/80 mb-1 animate-slide-in-left-delay-1">
                    {t("greeting")}
                  </h1>
                  <h2 className="text-4xl sm:text-5xl font-black bg-gradient-hero bg-clip-text text-transparent leading-none animate-slide-in-left-delay-2">
                    {t("name")}
                  </h2>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-text leading-tight animate-slide-in-left-delay-3">
                  {t("titleLine1")}
                  <br />
                  <span className="bg-gradient-hero bg-clip-text text-transparent">
                    {t("titleLine2")}
                  </span>
                </h3>
              </div>

              {/* 2. Image - Mobile */}
              <div className="flex justify-center animate-slide-in-right py-4">
                <div className="relative w-full max-w-[280px] sm:max-w-[320px]">
                  <div className="relative w-full aspect-square">
                    {/* Rotating Hexagon Border */}
                    <div className="absolute inset-0 animate-rotate-slow">
                      <div
                        className="w-full h-full border-2 border-primary/30"
                        style={{
                          clipPath:
                            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                        }}
                      />
                    </div>

                    {/* Main Image Container - Hexagon */}
                    <div
                      className="absolute inset-4 group cursor-pointer"
                      style={{
                        clipPath:
                          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      }}
                    >
                      {/* Glow Effect */}
                      <div className="absolute -inset-8 bg-primary/20 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

                      {/* Image with Gradient Overlay */}
                      <div className="relative w-full h-full overflow-hidden bg-gradient-photo border-2 border-primary/50">
                        <img
                          src={personalData.photo}
                          alt={t("name")}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-photo-hover opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </div>

                    {/* Floating Stats Badges */}
                    <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 px-2 py-1 sm:px-3 sm:py-2 bg-dark-secondary border border-primary/30 rounded-2xl backdrop-blur-xl shadow-2xl animate-float-badge">
                      <div
                        className="text-xl sm:text-2xl font-bold text-primary"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                      >
                        {statsData.years}+
                      </div>
                      <div className="text-[10px] text-text/60">
                        {tStats("yearsExp")}
                      </div>
                    </div>

                    <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 px-2 py-1 sm:px-3 sm:py-2 bg-dark-secondary border border-primary/30 rounded-2xl backdrop-blur-xl shadow-2xl animate-float-badge-delay">
                      <div
                        className="text-xl sm:text-2xl font-bold text-primary"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                      >
                        {statsData.projects}+
                      </div>
                      <div className="text-[10px] text-text/60">
                        {tStats("projects")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Description - Mobile */}
              <p className="text-sm sm:text-base text-text/70 leading-relaxed animate-slide-in-left-delay-5">
                {t("description")}
              </p>

              {/* 4. CTA Buttons - Mobile */}
              <div className="flex flex-wrap gap-3 animate-slide-in-left-delay-6">
                <button className="group relative px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-text text-sm font-bold rounded-full overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(135,80,247,0.6)]">
                  <span className="relative z-10 flex items-center gap-2">
                    {t("downloadCV")}
                    <Download
                      size={16}
                      className="group-hover:translate-y-1 transition-transform duration-300"
                    />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 group-hover:scale-110 transition-transform duration-500" />
                </button>

                <button className="group relative px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-primary text-primary text-sm font-bold rounded-full overflow-hidden transition-all duration-500 hover:text-text hover:scale-105">
                  <span className="relative z-10 flex items-center gap-2">
                    {t("viewWork")}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </span>
                  <div className="absolute inset-0 bg-primary translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                </button>
              </div>

              {/* 5. Social Media - Mobile */}
              <div className="flex items-center gap-3 sm:gap-4 pt-2 animate-slide-in-left-delay-7">
                <span className="text-text/50 text-[10px] sm:text-xs font-semibold tracking-wider">
                  {t("follow")}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent max-w-[150px] sm:max-w-[200px]" />
                <div className="flex gap-2">
                  {contactData.socialLinks.map((social, index) => {
                    const IconComponent = iconMap[social.icon];

                    // Eğer icon bulunamazsa null döndür
                    if (!IconComponent) return null;

                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        className="group relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-border/50 text-primary transition-all duration-500 hover:border-primary hover:scale-110"
                        style={{
                          animation: `fade-in 0.5s ease-out ${
                            0.8 + index * 0.1
                          }s both`,
                        }}
                      >
                        <IconComponent
                          size={16}
                          className="sm:w-[18px] sm:h-[18px] relative z-10 group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Desktop Layout - Image */}
            <div className="hidden lg:block lg:col-span-5 lg:order-2 animate-slide-in-right">
              <div className="relative w-full max-w-[350px] sm:max-w-[400px] lg:max-w-[450px] mx-auto lg:ml-auto">
                <div className="relative w-full aspect-square">
                  {/* Rotating Hexagon Border */}
                  <div className="absolute inset-0 animate-rotate-slow">
                    <div
                      className="w-full h-full border-2 border-primary/30"
                      style={{
                        clipPath:
                          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      }}
                    />
                  </div>

                  {/* Main Image Container - Hexagon */}
                  <div
                    className="absolute inset-4 group cursor-pointer"
                    style={{
                      clipPath:
                        "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                  >
                    {/* Glow Effect */}
                    <div className="absolute -inset-8 bg-primary/20 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* Image with Gradient Overlay */}
                    <div className="relative w-full h-full overflow-hidden bg-gradient-photo border-2 border-primary/50">
                      <img
                        src={personalData.photo}
                        alt={t("name")}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-photo-hover opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Corner Accents */}
                      <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>

                  {/* Floating Stats Badges */}
                  <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 px-3 py-2 sm:px-4 sm:py-3 bg-dark-secondary border border-primary/30 rounded-2xl backdrop-blur-xl shadow-2xl animate-float-badge">
                    <div
                      className="text-2xl sm:text-3xl font-bold text-primary"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      {statsData.years}+
                    </div>
                    <div className="text-xs text-text/60">
                      {tStats("yearsExp")}
                    </div>
                  </div>

                  <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 px-3 py-2 sm:px-4 sm:py-3 bg-dark-secondary border border-primary/30 rounded-2xl backdrop-blur-xl shadow-2xl animate-float-badge-delay">
                    <div
                      className="text-2xl sm:text-3xl font-bold text-primary"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      {statsData.projects}+
                    </div>
                    <div className="text-xs text-text/60">
                      {tStats("projects")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout - Left Content */}
            <div className="hidden lg:block lg:col-span-7 lg:order-1 space-y-6 lg:space-y-8">
              {/* Main Heading - Desktop */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-semibold text-text/80 mb-3 animate-slide-in-left-delay-1">
                    {t("greeting")}
                  </h1>
                  <h2 className="text-6xl lg:text-7xl xl:text-8xl font-black bg-gradient-hero bg-clip-text text-transparent leading-none animate-slide-in-left-delay-2">
                    {t("name")}
                  </h2>
                </div>

                <h3 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-text leading-tight animate-slide-in-left-delay-3">
                  {t("titleLine1")}
                  <br />
                  <span className="bg-gradient-hero bg-clip-text text-transparent">
                    {t("titleLine2")}
                  </span>
                </h3>
              </div>

              {/* Description - Desktop */}
              <p className="text-base sm:text-lg lg:text-xl text-text/70 leading-relaxed max-w-2xl animate-slide-in-left-delay-5">
                {t("description")}
              </p>

              {/* CTA Buttons - Desktop */}
              <div className="flex flex-wrap gap-3 sm:gap-4 animate-slide-in-left-delay-6">
                <a
                  href="/assets/docs/cv.pdf"
                  download="CV.pdf"
                  className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-primary text-text text-sm sm:text-base font-bold rounded-full overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(135,80,247,0.6)] inline-flex items-center"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t("downloadCV")}
                    <Download
                      size={18}
                      className="group-hover:translate-y-1 transition-transform duration-300"
                    />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 group-hover:scale-110 transition-transform duration-500" />
                </a>
                <a
                  href="/projects"
                  className="group relative px-6 sm:px-8 py-3 sm:py-4 border-2 border-primary text-primary text-sm sm:text-base font-bold rounded-full overflow-hidden transition-all duration-500 hover:text-text hover:scale-105 inline-flex items-center"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t("viewWork")}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </span>
                  <div className="absolute inset-0 bg-primary translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                </a>
              </div>

              {/* Social Media - Desktop */}
              <div className="flex items-center gap-4 sm:gap-6 pt-2 sm:pt-4 animate-slide-in-left-delay-7">
                <span className="text-text/50 text-xs sm:text-sm font-semibold tracking-wider">
                  {t("follow")}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent max-w-[200px] sm:max-w-xs" />
                <div className="flex gap-2 sm:gap-3">
                  {contactData.socialLinks.map((social, index) => {
                    const IconComponent = iconMap[social.icon];

                    // Eğer icon bulunamazsa null döndür
                    if (!IconComponent) return null;

                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        className="group relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-border/50 text-primary transition-all duration-500 hover:border-primary hover:scale-110"
                        style={{
                          animation: `fade-in 0.5s ease-out ${
                            0.8 + index * 0.1
                          }s both`,
                        }}
                      >
                        <IconComponent
                          size={16}
                          className="sm:w-[18px] sm:h-[18px] relative z-10 group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
