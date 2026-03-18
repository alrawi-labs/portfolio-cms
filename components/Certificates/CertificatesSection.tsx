"use client";

import { useState, useEffect, useRef } from "react";
import { Award, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useTranslations } from 'next-intl';

// Marquee Component
function Marquee({
  className = "",
  reverse = false,
  pauseOnHover = false,
  children,
  repeat = 2,
}: {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  repeat?: number;
}) {
  return (
    <div className={`group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] ${className}`}>
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`flex shrink-0 justify-around gap-4 ${
              reverse ? "animate-marquee-reverse" : "animate-marquee"
            } ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`}
          >
            {children}
          </div>
        ))}
    </div>
  );
}

// Certificate Card Component
function CertificateCard({
  img,
  title,
  issuer,
  date,
  category,
  onClick,
}: {
  img: string;
  title: string;
  issuer: string;
  date: string;
  category: string;
  onClick: () => void;
}) {
  return (
    <figure
      onClick={onClick}
      className="relative w-72 cursor-pointer overflow-hidden rounded-2xl border-2 border-border bg-dark hover:border-primary transition-all duration-300 group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          alt={title}
          src={img}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-60"></div>

        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-xs font-semibold">
            {category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <figcaption className="text-base font-bold text-text mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </figcaption>
        <p className="text-sm text-text/70 mb-1">{issuer}</p>
        <p className="text-xs text-text/50">{date}</p>
      </div>
    </figure>
  );
}

export default function Certificates() {
  const t = useTranslations('certificates');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Tüm veri artık JSON'dan geliyor
  const rawCerts = t.raw('certificates') as Array<{
    title: string;
    issuer: string;
    date: string;
    category: string;
    img: string;
    link: string;
  }>;

  const certificates = rawCerts.map((cert) => ({
    ...cert,
    category: t(`categories.${cert.category}`),
  }));

  const firstRow = certificates.slice(0, Math.ceil(certificates.length / 2));
  const secondRow = certificates.slice(Math.ceil(certificates.length / 2));

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

  const openModal = (index: number) => {
    setSelectedCertificate(index);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedCertificate(null);
    document.body.style.overflow = "unset";
  };

  const nextCertificate = () => {
    if (selectedCertificate !== null) {
      setSelectedCertificate((selectedCertificate + 1) % certificates.length);
    }
  };

  const prevCertificate = () => {
    if (selectedCertificate !== null) {
      setSelectedCertificate((selectedCertificate - 1 + certificates.length) % certificates.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedCertificate === null) return;
      if (e.key === "ArrowLeft") prevCertificate();
      if (e.key === "ArrowRight") nextCertificate();
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCertificate]);

  return (
    <section
      ref={sectionRef}
      id="certificates"
      className="py-12 sm:py-16 md:py-20 bg-dark-secondary relative overflow-hidden"
      style={{ scrollMarginTop: '30px' }}
    >
      <div className="absolute top-10 sm:top-20 right-5 sm:right-10 w-48 h-48 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 sm:bottom-20 left-5 sm:left-10 w-36 h-36 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div
          className={`text-center mb-8 sm:mb-12 md:mb-16 px-4 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-primary p-0.5">
              <div className="w-full h-full bg-dark rounded-2xl sm:rounded-3xl flex items-center justify-center">
                <Award className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-wide bg-gradient-hero bg-clip-text text-transparent mb-3 sm:mb-4">
            {t('title')}
          </h2>
          <p className="text-text/90 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed px-4">
            {t('subtitle')}
          </p>
          <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-primary/10 border border-primary/20">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="text-primary font-bold text-base sm:text-lg">
              {certificates.length}+ {t('certificatesCount')}
            </span>
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:60s]" repeat={4}>
            {firstRow.map((cert, idx) => (
              <CertificateCard key={idx} {...cert} onClick={() => openModal(idx)} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:60s]" repeat={4}>
            {secondRow.map((cert, idx) => (
              <CertificateCard
                key={idx}
                {...cert}
                onClick={() => openModal(firstRow.length + idx)}
              />
            ))}
          </Marquee>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-dark-secondary"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-dark-secondary"></div>
        </div>
      </div>

      {selectedCertificate !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark/95 backdrop-blur-sm p-3 sm:p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl w-full bg-dark-secondary border border-border rounded-2xl sm:rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-dark/80 backdrop-blur-sm border border-border flex items-center justify-center hover:border-primary transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-text" />
            </button>

            <button
              onClick={prevCertificate}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-dark/80 backdrop-blur-sm border border-border flex items-center justify-center hover:border-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-text" />
            </button>
            <button
              onClick={nextCertificate}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-dark/80 backdrop-blur-sm border border-border flex items-center justify-center hover:border-primary transition-colors"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-text" />
            </button>

            <div className="relative aspect-[4/3] bg-dark">
              <img
                src={certificates[selectedCertificate].img}
                alt={certificates[selectedCertificate].title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-4 sm:p-6 border-t border-border">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-text mb-2">
                    {certificates[selectedCertificate].title}
                  </h3>
                  <p className="text-text/70 text-base sm:text-lg mb-1">
                    {certificates[selectedCertificate].issuer}
                  </p>
                  <p className="text-text/50 text-sm sm:text-base">
                    {certificates[selectedCertificate].date}
                  </p>
                </div>
                <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-sm sm:text-base">
                  {certificates[selectedCertificate].category}
                </span>
              </div>

              <a
                href={certificates[selectedCertificate].link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-primary text-dark font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all"
              >
                <span>{t('viewCertificate')}</span>
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
            </div>

            <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-dark/80 backdrop-blur-sm border border-border text-text/70 text-xs sm:text-sm">
              {selectedCertificate + 1} {t('of')} {certificates.length}
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% - 1rem)); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(calc(-100% - 1rem)); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee var(--duration, 40s) linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse var(--duration, 40s) linear infinite;
        }
      `}} />
    </section>
  );
}