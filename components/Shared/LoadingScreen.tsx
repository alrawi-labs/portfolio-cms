"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const locale = useLocale();
  const t = useTranslations('loading');
  
  // Arapça için özel işlem - harfleri ayırmıyoruz
  const loadingText = locale === 'ar' ? [t('text')] : t('text').split('');

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Start exit animation
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2500);

    // Remove component after exit animation
    const removeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className={`fixed inset-0 z-[999] bg-dark flex items-center justify-center overflow-hidden transition-all duration-1000 ${
      isExiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
    }`}>
      {/* Animated background gradients - Responsive */}
      <div className={`absolute inset-0 transition-all duration-1000 ${
        isExiting ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
      }`}>
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-primary/20 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-primary/10 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main content - Responsive */}
      <div className={`relative z-10 flex flex-col items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-4 transition-all duration-1000 ${
        isExiting ? 'scale-150 opacity-0 translate-y-[-100px]' : 'scale-100 opacity-100 translate-y-0'
      }`}>
        {/* Logo animation - Responsive size */}
        <div className={`relative transition-all duration-1000 ${
          isExiting ? 'scale-0 rotate-180' : 'scale-100 rotate-0'
        }`}>
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl sm:blur-2xl animate-ping"></div>
          <svg
            width="60"
            height="60"
            viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 animate-float drop-shadow-[0_0_15px_rgba(135,80,247,0.6)] sm:drop-shadow-[0_0_20px_rgba(135,80,247,0.6)] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px]"
          >
            <path
              d="M 499 43C 446 43 397 71 370 118C 370 118 20 724 20 724C -7 770 -7 827 20 874C 47 920 96 949 150 949C 150 949 850 949 850 949C 904 949 953 920 980 874C 1007 827 1007 770 980 724C 980 724 630 118 630 118C 604 73 558 45 507 43C 504 43 502 43 499 43C 499 43 499 43 499 43M 0,0"
              className="fill-text"
            />
          </svg>
        </div>

        {/* Loading text with letter animation - Responsive & RTL Support */}
        <div className={`flex items-center ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-0.5 sm:gap-1 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
            {locale === 'ar' ? (
              // Arapça için tek bir span - harfleri ayırmıyoruz
              <span
                className="inline-block leading-none text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-hero bg-clip-text text-transparent animate-wave tracking-wide sm:tracking-wider"
                style={{
                  fontFamily: "'Cairo', 'Tajawal', sans-serif",
                  direction: 'rtl',
                  minHeight: '1.2em'
                }}
              >
                {t('text')}
              </span>
            ) : (
              // Diğer diller için harf harf animasyon
              loadingText.map((letter, index) => (
                <span
                  key={index}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-hero bg-clip-text text-transparent animate-wave tracking-wide sm:tracking-wider"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                  }}
                >
                  {letter}
                </span>
              ))
            )}
          </div>
          
          {/* Animated dots - Responsive */}
          <div className={`flex gap-0.5 sm:gap-1 items-center ${locale === 'ar' ? 'mr-1 sm:mr-2' : 'ml-1 sm:ml-2'}`}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></span>
            ))}
          </div>
        </div>

        {/* Progress bar - Responsive */}
        <div className="w-full max-w-[200px] sm:max-w-[280px] md:max-w-xs lg:max-w-sm xl:max-w-md px-4 sm:px-0">
          <div className="relative h-1 sm:h-1.5 bg-dark-secondary rounded-full overflow-hidden border border-primary/20">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 animate-shimmer"></div>
            
            {/* Progress fill */}
            <div
              className={`absolute inset-y-0 bg-gradient-to-r from-primary via-primary-400 to-primary rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(135,80,247,0.8)] sm:shadow-[0_0_20px_rgba(135,80,247,0.8)] ${
                locale === 'ar' ? 'right-0' : 'left-0'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              {/* Shimmer effect on progress */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-fast"></div>
            </div>
          </div>

          {/* Progress percentage - Responsive */}
          <div className="text-center mt-2 sm:mt-3 md:mt-4 text-text/60 text-xs sm:text-sm font-medium tracking-wide sm:tracking-widest pb-2">
            {locale === 'ar' ? `%}${Math.min(Math.round(progress), 100)}` : `${Math.min(Math.round(progress), 100)}%`}
          </div>
        </div>

        {/* Orbiting particles - Responsive */}
        <div className="absolute inset-0 pointer-events-none hidden sm:block">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary/40 rounded-full animate-orbit"
              style={{
                animationDelay: `${i * 0.5}s`,
                animationDuration: '4s',
              }}
            ></div>
          ))}
        </div>

        {/* Mobile only: Smaller particles */}
        <div className="absolute inset-0 pointer-events-none sm:hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-1 bg-primary/40 rounded-full animate-orbit-small"
              style={{
                animationDelay: `${i * 1}s`,
                animationDuration: '3s',
              }}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
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

        @keyframes shimmer-fast {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        @keyframes orbit {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(120px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(120px) rotate(-360deg);
            opacity: 0;
          }
        }

        @keyframes orbit-small {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(80px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(80px) rotate(-360deg);
            opacity: 0;
          }
        }

        .animate-wave {
          animation: wave 1.5s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-shimmer-fast {
          animation: shimmer-fast 1s infinite;
        }

        .animate-orbit {
          animation: orbit 4s linear infinite;
        }

        .animate-orbit-small {
          animation: orbit-small 3s linear infinite;
        }

        /* Tablet responsive adjustments */
        @media (min-width: 640px) and (max-width: 1023px) {
          @keyframes orbit {
            0% {
              transform: translate(-50%, -50%) rotate(0deg) translateX(150px) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) rotate(360deg) translateX(150px) rotate(-360deg);
              opacity: 0;
            }
          }
        }

        /* Desktop responsive adjustments */
        @media (min-width: 1024px) {
          @keyframes orbit {
            0% {
              transform: translate(-50%, -50%) rotate(0deg) translateX(180px) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) rotate(360deg) translateX(180px) rotate(-360deg);
              opacity: 0;
            }
          }
        }
      `}</style>
    </div>
  );
}