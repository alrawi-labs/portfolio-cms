// @ts-nocheck

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { useTranslations } from "next-intl";
import { statsData } from "@/data/stats";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

interface ParticlesProps {
  isHovered: boolean;
  isMobile: boolean;
}

// Sabit particle değerleri (hydration hatasını önlemek için)
const PARTICLE_CONFIG = Array.from({ length: 20 }, (_, i) => ({
  width: 1 + ((i * 0.15) % 4),
  height: 1 + ((i * 0.12) % 4),
  left: (i * 5.26) % 100,
  top: (i * 4.73) % 100,
  opacity: 0.3 + ((i * 0.025) % 0.5),
  xOffset: (i % 2 === 0 ? 1 : -1) * (50 + ((i * 5) % 50)),
  xOffset2: (i % 2 === 0 ? 1 : -1) * (75 + ((i * 7.5) % 75)),
  yOffset: -(50 + ((i * 5) % 50)),
  duration: 2 + ((i * 0.1) % 2),
  delay: (i * 0.05) % 1,
}));

const AnimatedStatsBar: React.FC = () => {
  const t = useTranslations("home.stats");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(statsRef, { once: true, amount: 0.3 });

  // Mount kontrolü
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Mobil cihaz kontrolü
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Counter hook with smooth animation
  const useCounter = (
    end: number,
    duration: number = 2000,
    start: number = 0,
  ): number => {
    const [count, setCount] = useState<number>(start);

    useEffect(() => {
      if (!isInView) return;
      if (isMobile) {
        setIsMounted(true);
        setCount(end);
        return;
      }

      let startTime: number | null = null;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        const easeOutExpo =
          progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setCount(Math.floor(easeOutExpo * (end - start) + start));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [isInView, isMobile, end, duration, start]);

    return count;
  };

  // Component içinde:
  const years = useCounter(statsData.years, 2000);
  const projects = useCounter(statsData.projects, 2500);
  const clients = useCounter(statsData.clients, 2200);
  const awards = useCounter(statsData.awards, 2300);

  const stats: Stat[] = [
    {
      value: years,
      suffix: "",
      label: t("yearsLabel"),
      description: t("yearsDesc"),
    },
    {
      value: projects,
      suffix: "+",
      label: t("projectsLabel"),
      description: t("projectsDesc"),
    },
    {
      value: clients,
      suffix: t("k"),
      label: t("clientsLabel"),
      description: t("clientsDesc"),
    },
    {
      value: awards,
      suffix: "",
      label: t("awardsLabel"),
      description: t("awardsDesc"),
    },
  ];

  // Enhanced Particle component
  const Particles: React.FC<ParticlesProps> = ({ isHovered, isMobile }) => {
    if (isMobile || !isMounted) return null;

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLE_CONFIG.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: particle.width,
              height: particle.height,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              background: `rgba(135, 80, 247, ${particle.opacity})`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={
              isHovered
                ? {
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: [particle.xOffset, particle.xOffset2],
                    y: [0, particle.yOffset],
                  }
                : { opacity: 0 }
            }
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    );
  };

  // Animation variants
  const cardVariants = {
    hidden: (direction: string) => ({
      opacity: isMobile ? 1 : 0,
      x: isMobile ? 0 : direction === "left" ? -120 : 120,
      filter: isMobile ? "blur(0px)" : "blur(10px)",
      scale: isMobile ? 1 : 0.9,
    }),
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration: isMobile ? 0 : 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: isMobile ? 0 : 0.2,
      },
    },
  };

  return (
    <section
      id="stats"
      className="w-full bg-dark-secondary py-16 sm:py-20 lg:py-24 px-4 sm:px-8 font-sora"
      style={{ scrollMarginTop: "30px" }}
    >
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .gradient-text {
          background: linear-gradient(260deg, #2a1454, #8750f7, #c3a6ff, #8750f7, #2a1454);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 4s ease infinite;
        }
        
        .glow-box {
          box-shadow: 0 4px 20px rgba(135, 80, 247, 0.15),
                      0 8px 40px rgba(135, 80, 247, 0.1),
                      inset 0 0 30px rgba(135, 80, 247, 0.05);
        }
        
        .glow-box:hover {
          box-shadow: 0 8px 30px rgba(135, 80, 247, 0.3),
                      0 12px 60px rgba(135, 80, 247, 0.2),
                      inset 0 0 50px rgba(135, 80, 247, 0.1);
        }
        
        .shimmer-line {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(135, 80, 247, 0.6),
            transparent
          );
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      <div ref={statsRef} className="w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={isMobile ? {} : { opacity: 0, y: -30 }}
          animate={
            !isMobile && isInView
              ? { opacity: 1, y: 0 }
              : isMobile
                ? {}
                : { opacity: 0, y: -30 }
          }
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={isMobile ? {} : { scale: 0 }}
            animate={
              !isMobile && isInView
                ? { scale: 1 }
                : isMobile
                  ? {}
                  : { scale: 0 }
            }
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-wide bg-gradient-hero bg-clip-text text-transparent mb-4">
              {t("title")}
            </h2>
            <p className="text-text/90 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
          </motion.div>

          <motion.div
            className="h-1 w-24 bg-gradient-to-r from-primary via-[#c3a6ff] to-primary mx-auto rounded-full"
            initial={isMobile ? {} : { scaleX: 0 }}
            animate={
              !isMobile && isInView
                ? { scaleX: 1 }
                : isMobile
                  ? {}
                  : { scaleX: 0 }
            }
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {stats.map((stat, index) => {
            const direction = index % 2 === 0 ? "left" : "right";

            return (
              <motion.div
                key={index}
                className="group relative"
                custom={direction}
                variants={cardVariants}
                onMouseEnter={() => !isMobile && setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={isMobile ? {} : { y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Outer Glow */}
                {!isMobile && isMounted && (
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.5 }}
                  />
                )}

                {/* Main Card */}
                <div className="relative bg-gradient-to-br from-dark-secondary to-dark rounded-3xl p-8 sm:p-10 lg:p-12 glow-box transition-all duration-500 overflow-hidden border border-border-subtle group-hover:border-primary/50 min-h-[320px] sm:min-h-[360px] lg:min-h-[400px] flex flex-col justify-between">
                  {/* Particles */}
                  <Particles
                    isHovered={hoveredIndex === index}
                    isMobile={isMobile}
                  />

                  {/* Top Accent Corner */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Background Pattern */}
                  {isMounted && (
                    <motion.div
                      className="absolute inset-0 opacity-[0.02]"
                      style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, #8750f7 1px, transparent 0)`,
                        backgroundSize: "40px 40px",
                      }}
                      animate={
                        !isMobile && hoveredIndex === index
                          ? { scale: 1.1, opacity: 0.05 }
                          : { scale: 1, opacity: 0.02 }
                      }
                      transition={{ duration: 0.5 }}
                    />
                  )}

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Label */}
                    <motion.div
                      className="text-sm sm:text-base font-semibold text-text/50 tracking-wider uppercase mb-6"
                      animate={
                        !isMobile && hoveredIndex === index
                          ? { x: 5 }
                          : { x: 0 }
                      }
                      transition={{ duration: 0.3 }}
                    >
                      {stat.label}
                    </motion.div>

                    {/* Number */}
                    <div className="relative flex items-baseline gap-2 mb-4">
                      <motion.span
                        className={`text-6xl sm:text-7xl lg:text-8xl font-black transition-all duration-500 ${
                          !isMobile && hoveredIndex === index
                            ? "gradient-text"
                            : "text-primary"
                        }`}
                        animate={
                          !isMobile && hoveredIndex === index
                            ? { scale: 1.1 }
                            : { scale: 1 }
                        }
                        transition={{
                          duration: 0.3,
                          type: "spring",
                          stiffness: 200,
                        }}
                      >
                        {stat.value}
                      </motion.span>
                      {stat.suffix && (
                        <motion.span
                          className={`text-4xl sm:text-5xl lg:text-6xl font-bold transition-all duration-500 ${
                            !isMobile && hoveredIndex === index
                              ? "text-primary"
                              : "text-primary/70"
                          }`}
                          animate={
                            !isMobile && hoveredIndex === index
                              ? { scale: 1.1, rotate: 5 }
                              : { scale: 1, rotate: 0 }
                          }
                          transition={{ duration: 0.3 }}
                        >
                          {stat.suffix}
                        </motion.span>
                      )}
                    </div>

                    {/* Description */}
                    <motion.div
                      className={`text-sm sm:text-base lg:text-lg font-medium tracking-wide transition-colors duration-300 ${
                        !isMobile && hoveredIndex === index
                          ? "text-text/80"
                          : "text-text/40"
                      }`}
                      animate={
                        !isMobile && hoveredIndex === index
                          ? { x: 5 }
                          : { x: 0 }
                      }
                      transition={{ duration: 0.3 }}
                    >
                      {stat.description}
                    </motion.div>
                  </div>

                  {/* Bottom Decorative Elements */}
                  <div className="relative z-10 mt-auto pt-6">
                    {/* Shimmer Line */}
                    {!isMobile && isMounted && (
                      <motion.div
                        className="h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-4 overflow-hidden"
                        initial={{ scaleX: 0 }}
                        animate={
                          hoveredIndex === index ? { scaleX: 1 } : { scaleX: 0 }
                        }
                        transition={{ duration: 0.5 }}
                      >
                        <div className="h-full shimmer-line" />
                      </motion.div>
                    )}

                    {/* Accent Line */}
                    {!isMobile && isMounted && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-[#c3a6ff] to-primary rounded-b-3xl"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={
                          hoveredIndex === index
                            ? { scaleX: 1, opacity: 1 }
                            : { scaleX: 0, opacity: 0 }
                        }
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Decorative Section */}
        <motion.div
          className="text-center mt-16 sm:mt-20"
          initial={isMobile ? {} : { opacity: 0 }}
          animate={
            !isMobile && isInView
              ? { opacity: 1 }
              : isMobile
                ? {}
                : { opacity: 0 }
          }
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="inline-flex items-center gap-2 text-sm text-text/40">
            <motion.div
              className="w-2 h-2 rounded-full bg-primary"
              animate={
                isMobile || !isMounted
                  ? {}
                  : { scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }
              }
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>{t("trustedBy")}</span>
            <motion.div
              className="w-2 h-2 rounded-full bg-primary"
              animate={
                isMobile || !isMounted
                  ? {}
                  : { scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }
              }
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedStatsBar;
