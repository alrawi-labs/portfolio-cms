'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsVisible(currentScrollY > 500);

      // Calculate scroll progress with safety checks
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollableHeight = scrollHeight - clientHeight;
      
      if (scrollableHeight > 0) {
        const progress = Math.min((currentScrollY / scrollableHeight) * 100, 100);
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Safety check for opacity value
  const opacityValue = isNaN(scrollProgress / 100) ? 0 : scrollProgress / 100;
  const shadowOpacity = isNaN(0.4 * (scrollProgress / 100)) ? 0 : 0.4 * (scrollProgress / 100);

  return (
    <>
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .scroll-btn-enter {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>

      <button
        onClick={scrollToTop}
        className={`scroll-btn-enter fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 group ${
          isVisible ? 'block' : 'hidden'
        }`}
        aria-label="Scroll to top"
      >
        {/* Main button container */}
        <div className="relative">
          {/* Background with gradient - opacity based on scroll */}
          <div 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-110 bg-primary"
            style={{
              background: "transparent",
              boxShadow: `0 4px 20px rgba(135, 80, 247, ${shadowOpacity})`,
              opacity: opacityValue,
            }}
          >
            {/* Hover overlay */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary-400 to-primary"
            ></div>

            {/* Arrow icon */}
            <ArrowUp 
              className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10 transition-transform duration-300 group-hover:-translate-y-1" 
              strokeWidth={2.5}
            />

            {/* Subtle pulse on hover */}
            <div 
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
              }}
            ></div>
          </div>

          {/* Progress ring around button */}
          <svg 
            className="absolute -inset-1 w-14 h-14 sm:w-16 sm:h-16 -rotate-90 pointer-events-none"
            style={{ 
              filter: 'drop-shadow(0 0 6px rgba(135, 80, 247, 0.4))',
              transform: 'rotate(-90deg) scale(1)',
            }}
          >
            {/* Background circle */}
            <circle
              cx="50%"
              cy="50%"
              r="27"
              fill="none"
              stroke="rgba(135, 80, 247, 0.2)"
              strokeWidth="3"
            />
            {/* Progress circle */}
            <circle
              cx="50%"
              cy="50%"
              r="27"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 27}`}
              strokeDashoffset={`${2 * Math.PI * 27 * (1 - scrollProgress / 100)}`}
              style={{
                filter: 'drop-shadow(0 0 4px rgba(135, 80, 247, 0.8))',
              }}
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a574ff" />
                <stop offset="50%" stopColor="#8750f7" />
                <stop offset="100%" stopColor="#6b2fb5" />
              </linearGradient>
            </defs>
          </svg>

          {/* Outer glow ring */}
          <div 
            className="absolute -inset-2 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-primary to-primary-700"
          ></div>
        </div>
      </button>
    </>
  );
}