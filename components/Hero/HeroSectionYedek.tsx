"use client";

import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import {
  Download,
  Facebook,
  Linkedin,
  Dribbble,
  Github,
  Twitter,
} from "lucide-react";

import "./hero.css";

export default function Hero() {
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
    <section className="min-h-screen bg-dark-secondary flex flex-col relative pt-20 pb-4 sm:pb-6 lg:pt-0 lg:pb-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Circle - Sağ Üst */}
        <div className="absolute -top-40 -right-40 sm:-top-60 sm:-right-56 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full gradient-top-right" />

        {/* Gradient Circle - Orta */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/3 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full gradient-middle" />

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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl xl:max-w-[1300px] mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Mobile Layout - Başlık Önce */}
            <div className="lg:hidden animate-fade-in-up text-left mt-16">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-text">
                I am Yasir
              </h1>
              <h2 className="text-4xl sm:text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent leading-tight">
                Next-Level Web
                <br />
                Developer.
              </h2>
            </div>

            {/* Fotoğraf - Mobilde Ortada */}
            <div className="lg:order-2 animate-fade-in-up-delay">
              <div className="relative w-full max-w-[280px] h-[280px] sm:max-w-[350px] sm:h-[350px] md:max-w-[400px] md:h-[400px] lg:max-w-[450px] lg:h-[450px] mx-auto">
                <div
                  className="absolute inset-0 rounded-3xl blur-lg opacity-30"
                  style={{
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                ></div>
                <div className="relative z-10 w-full h-full rounded-3xl border-2 border-border/30 hover:border-primary flex items-center justify-center overflow-hidden transform rotate-3 hover:rotate-0 transition-all duration-500 ease-out group bg-gradient-photo">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out bg-gradient-photo-hover"></div>
                  <img
                    src="/assets/images/my-photo.png"
                    alt="Yasir"
                    className="relative z-10 w-full h-full object-cover rounded-3xl"
                  />
                </div>
              </div>
            </div>

            {/* Desktop & Mobil İçerik */}
            <div className="lg:order-1 animate-fade-in-up text-left">
              {/* Desktop Başlık */}
              <div className="hidden lg:block mt-16">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 lg:mb-6 text-text">
                  I am Yasir
                </h1>
                <h1
                  className="font-bold mb-4 sm:mb-6 lg:mb-4 bg-gradient-hero bg-clip-text text-transparent leading-tight lg:leading-tight"
                  style={{
                    fontSize: "4.0625rem",
                  }}
                >
                  Next-Level Web
                  <br />
                  Developer.
                </h1>
              </div>

              {/* Açıklama */}
              <p className="text-text text-xl sm:text-2xl lg:text-xl mb-6 sm:mb-8 lg:mb-10 leading-relaxed max-w-xl lg:max-w-lg">
                I break down complex user experinece problems to create
                integritiy focussed solutions that connect billions of people{" "}
              </p>

              {/* Butonlar */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
                <button className="sm:w-auto px-9 sm:px-8 py-4 rounded-full transition-all duration-500 ease-out transform hover:scale-105 flex items-center justify-center gap-2 border border-border hover:bg-primary text-primary hover:text-text backdrop-blur-sm">
                  <span className="flex items-center gap-2 font-bold">
                    <Download size={20} />
                    Download CV
                  </span>
                </button>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="social-icon w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all duration-500 ease-out hover:scale-110 hover:border-primary hover:shadow-[0_0_20px_rgba(135,80,247,0.5)] hover:bg-primary text-primary hover:text-text backdrop-blur-sm relative overflow-hidden"
                  >
                    <Facebook
                      size={18}
                      fill="currentColor"
                      className="transition-all duration-500 relative z-10 hover:rotate-[360deg]"
                    />
                  </a>
                  <a
                    href="#"
                    className="social-icon w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all duration-500 ease-out hover:scale-110 hover:border-primary hover:shadow-[0_0_20px_rgba(135,80,247,0.5)] hover:bg-primary text-primary hover:text-text backdrop-blur-sm relative overflow-hidden"
                  >
                    <Linkedin
                      size={18}
                      fill="currentColor"
                      className="transition-all duration-500 relative z-10 hover:rotate-[360deg]"
                    />
                  </a>
                  <a
                    href="#"
                    className="social-icon w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all duration-500 ease-out hover:scale-110 hover:border-primary hover:shadow-[0_0_20px_rgba(135,80,247,0.5)] hover:bg-primary text-primary hover:text-text backdrop-blur-sm relative overflow-hidden"
                  >
                    <Twitter
                      size={18}
                      fill="currentColor"
                      className="transition-all duration-500 relative z-10 hover:rotate-[360deg]"
                    />
                  </a>
                  <a
                    href="#"
                    className="social-icon w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all duration-500 ease-out hover:scale-110 hover:border-primary hover:shadow-[0_0_20px_rgba(135,80,247,0.5)] hover:bg-primary text-primary hover:text-text backdrop-blur-sm relative overflow-hidden"
                  >
                    <Github
                      size={18}
                      fill="currentColor"
                      className="transition-all duration-500 relative z-10 hover:rotate-[360deg]"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div ref={statsRef} className="relative z-20 mt-16 sm:mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl xl:max-w-[1300px] mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-16">
              {/* Stat 1 */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                {" "}
                <div
                  className="text-5xl sm:text-5xl md:text-6xl xl:text-7xl text-text"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {years}
                </div>
                <div className="text-text text-center sm:text-left text-md sm:text-sm md:text-base">
                  Years of
                  <br />
                  Experience
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-3 lg:gap-4 my-2">
                <div
                  className="text-5xl sm:text-5xl md:text-6xl xl:text-7xl text-text"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {projects}<span className="text-3xl sm:text-3xl">+</span>
                </div>
                <div className="text-text text-center sm:text-left text-md sm:text-sm md:text-base">
                  Project
                  <br />
                  Completed
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-3 lg:gap-4 my-2">
                <div
                  className="text-5xl sm:text-5xl md:text-6xl xl:text-7xl text-text"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {clients}<span className="text-3xl sm:text-3xl">K</span>
                </div>
                <div className="text-text text-center sm:text-left text-md sm:text-base md:text-lg">
                  Happy
                  <br />
                  Clients
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-3 lg:gap-4 my-2">
                <div
                  className="text-5xl sm:text-5xl md:text-6xl xl:text-7xl text-text"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {awards}
                </div>
                <div className="text-text text-center sm:text-left text-md sm:text-base md:text-lg">
                  Awards
                  <br />
                  Won
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}