"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

export default function Volunteering() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<any>(null);
  const t = useTranslations("volunteering");

  const volunteering = t.raw("volunteering");

  // Check if desktop on mount and resize
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Lenis smooth scroll initialization
  useEffect(() => {
    let lenis: any;

    const initLenis = async () => {
      const Lenis = (await import('@studio-freight/lenis')).default;
      
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        touchMultiplier: 2,
      });

      lenisRef.current = lenis;

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    };

    initLenis();

    return () => {
      if (lenis) {
        lenis.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const scrolled = -rect.top;
      const sectionHeight = section.clientHeight - window.innerHeight;
      
      const progress = Math.max(0, Math.min(volunteering.length, scrolled / (sectionHeight / volunteering.length)));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [volunteering.length]);

  const getCardTransform = (index: number) => {
    const fadeInStart = index - 0.3;
    const fadeInEnd = index;
    const activeStart = index;
    const activeEnd = index + 0.6;
    const fadeOutStart = index + 0.6;
    const fadeOutEnd = index + 1;
    
    if (scrollProgress < fadeInStart) {
      return {
        translateY: 80,
        opacity: 0,
        scale: 0.92,
        blur: 10,
        zIndex: index,
        pointerEvents: 'none' as const
      };
    }
    else if (scrollProgress >= fadeInStart && scrollProgress < fadeInEnd) {
      const progress = (scrollProgress - fadeInStart) / (fadeInEnd - fadeInStart);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      return {
        translateY: 80 - (eased * 80),
        opacity: eased,
        scale: 0.92 + (eased * 0.08),
        blur: 10 - (eased * 10),
        zIndex: 10 + index,
        pointerEvents: 'auto' as const
      };
    }
    else if (scrollProgress >= activeStart && scrollProgress < activeEnd) {
      return {
        translateY: 0,
        opacity: 1,
        scale: 1,
        blur: 0,
        zIndex: 10 + index,
        pointerEvents: 'auto' as const
      };
    } 
    else if (scrollProgress >= fadeOutStart && scrollProgress < fadeOutEnd) {
      const progress = (scrollProgress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
      const eased = Math.pow(progress, 2);
      
      return {
        translateY: -(eased * 40),
        opacity: 1 - eased,
        scale: 1 - (eased * 0.08),
        blur: eased * 8,
        zIndex: index,
        pointerEvents: 'none' as const
      };
    } 
    else {
      return {
        translateY: -40,
        opacity: 0,
        scale: 0.92,
        blur: 8,
        zIndex: index,
        pointerEvents: 'none' as const
      };
    }
  };

  return (
    <div
      ref={sectionRef}
      className="lg:h-auto bg-[#0e0714] relative"
      id="volunteering"
      style={{ 
        height: isDesktop ? `${100 + volunteering.length * 120}vh` : 'auto',
        backgroundColor: '#0e0714',
        position: 'relative',
        scrollMarginTop: '100px'
      }}
    >
      <div className="lg:sticky lg:top-0 lg:h-screen overflow-hidden overflow-x-hidden">
        {/* Vertical "Volunteering" text - hidden on mobile */}
        <div 
          className="hidden md:block absolute top-1/2 z-40 pointer-events-none"
          style={{
            transformOrigin: 'center center',
            transform: 'translateY(-50%) rotate(-90deg)',
          }}
        >
          <h2 
            className="text-3xl lg:text-5xl font-bold tracking-wide whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #a574ff 0%, #8750f7 50%, #7343d2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: 0.3,
              fontWeight: 800,
            }}
          >
            {t("title")}
          </h2>
        </div>

        {volunteering.map((item: any, index: number) => {
          const transform = getCardTransform(index);

          return (
            <div
              key={index}
              className="lg:absolute lg:inset-0 relative min-h-screen"
              style={{
                transform: isDesktop ? `translateY(${transform.translateY}vh) scale(${transform.scale})` : 'none',
                opacity: isDesktop ? transform.opacity : 1,
                filter: isDesktop ? `blur(${transform.blur}px)` : 'none',
                zIndex: isDesktop ? transform.zIndex : 'auto',
                pointerEvents: isDesktop ? transform.pointerEvents : 'auto',
                transition: isDesktop ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease, filter 0.6s ease' : 'none',
                willChange: isDesktop ? 'transform, opacity, filter' : 'auto'
              }}
            >
              {/* Background */}
              <div className="absolute inset-0" style={{ backgroundColor: '#0e0714' }}>
                {/* Gradient Orbs - smaller on mobile */}
                <div 
                  className="absolute top-10 md:top-20 left-5 md:left-10 w-48 h-48 md:w-96 md:h-96 rounded-full blur-3xl"
                  style={{
                    background: index === 0 ? 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)' : 
                               index === 1 ? 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)' : 
                               'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%)'
                  }}
                ></div>
                <div 
                  className="absolute bottom-10 md:bottom-20 right-5 md:right-10 w-48 h-48 md:w-96 md:h-96 rounded-full blur-3xl"
                  style={{
                    background: index === 0 ? 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)' : 
                               index === 1 ? 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)' : 
                               'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)'
                  }}
                ></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center py-8 md:py-0 overflow-x-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
                  <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-7xl mx-auto w-full">
                    
                    {/* Left - Content */}
                    <div className="space-y-4 md:space-y-6 lg:space-y-8 order-2 lg:order-1">
                      {/* Badge & Icon */}
                      <div className="flex items-center gap-3 md:gap-4">
                        
                        <div 
                          className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold"
                          style={{
                            backgroundColor: 'rgba(135, 80, 247, 0.15)',
                            color: '#8750f7',
                            border: '1px solid rgba(135, 80, 247, 0.3)'
                          }}
                        >
                          {item.date}
                        </div>
                      </div>

                      {/* Title */}
                      <h2 
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                        style={{
                          background: 'linear-gradient(135deg, #a574ff 0%, #8750f7 50%, #7343d2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >
                        {item.role}
                      </h2>

                      {/* Organization */}
                      <div className="space-y-1.5 md:space-y-2">
                        <p className="text-lg sm:text-xl lg:text-2xl font-semibold" style={{ color: 'rgb(221, 221, 221)' }}>
                          {item.organization}
                        </p>
                        <p className="text-base md:text-lg" style={{ color: 'rgba(221, 221, 221, 0.7)' }}>
                          {item.event}
                        </p>
                        <p className="text-xs md:text-sm flex items-center gap-2" style={{ color: 'rgba(221, 221, 221, 0.5)' }}>
                          <span>📍</span> {item.location}
                        </p>
                      </div>

                      {/* Description */}
                      <div 
                        className="p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl backdrop-blur-sm"
                        style={{
                          backgroundColor: 'rgba(20, 12, 28, 0.6)',
                          border: '1px solid rgba(135, 80, 247, 0.2)'
                        }}
                      >
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed" style={{ color: 'rgba(221, 221, 221, 0.85)' }}>
                          {item.description}
                        </p>
                      </div>

                      {/* Progress */}
                      <div className="flex gap-1.5 md:gap-2">
                        {volunteering.map((_: any, idx: number) => (
                          <div
                            key={idx}
                            className="h-1 md:h-1.5 rounded-full flex-1 transition-all duration-500"
                            style={{
                              backgroundColor: scrollProgress > idx + 0.3 ? '#8750f7' : 'rgba(135, 80, 247, 0.2)'
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Right - Image */}
                    <div className="relative w-full order-1 lg:order-2">
                      <div 
                        className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl"
                        style={{
                          border: '2px solid rgba(135, 80, 247, 0.3)',
                          aspectRatio: '2000 / 1414'
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.role}
                          className="w-full h-full object-contain"
                          style={{
                            objectPosition: 'center'
                          }}
                        />
                        
                        {/* Overlay */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(135deg, rgba(14, 7, 20, 0.4) 0%, transparent 50%, rgba(14, 7, 20, 0.6) 100%)'
                          }}
                        ></div>

                        {/* Glow */}
                        <div 
                          className="absolute -inset-2 rounded-2xl md:rounded-3xl -z-10 blur-xl"
                          style={{
                            background: index === 0 ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' :
                                       index === 1 ? 'linear-gradient(135deg, #a855f7, #ec4899)' :
                                       'linear-gradient(135deg, #ef4444, #f97316)',
                            opacity: 0.3
                          }}
                        ></div>
                      </div>

                      {/* Decorative blob - hidden on small screens */}
                      <div 
                        className="hidden md:block absolute -bottom-8 -right-8 w-32 h-32 lg:w-40 lg:h-40 rounded-full blur-3xl pointer-events-none"
                        style={{
                          background: index === 0 ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' :
                                     index === 1 ? 'linear-gradient(135deg, #a855f7, #ec4899)' :
                                     'linear-gradient(135deg, #ef4444, #f97316)',
                          opacity: 0.4
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}