"use client";

import React, { useState, useEffect } from 'react';

interface ChevronIconProps {
  className?: string;
}

const ChevronLeft: React.FC<ChevronIconProps> = ({ className }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight: React.FC<ChevronIconProps> = ({ className }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

interface ImageItem {
  url: string;
  alt?: string;
  caption?: string;
}

interface ImageCarouselProps {
  images: ImageItem[];
  heading?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  heading, 
  autoPlay = true, 
  autoPlayInterval = 5000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, autoPlay, images.length, autoPlayInterval]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-4">
      {heading && (
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <span className="w-1.5 h-8 bg-primary rounded-full" />
          {heading}
        </h3>
      )}
      
      <div className="relative group">
        {/* Main Image Container */}
        <div className="relative rounded-2xl overflow-hidden border border-border-subtle shadow-2xl shadow-primary/10 aspect-video bg-dark-secondary">
          <div className="relative w-full h-full">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                  index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt || `Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                disabled={isAnimating}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-dark/50 hover:bg-dark/70 backdrop-blur-sm text-text p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border border-border-subtle"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={handleNext}
                disabled={isAnimating}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-dark/50 hover:bg-dark/70 backdrop-blur-sm text-text p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border border-border-subtle"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Caption Overlay */}
          {images[currentIndex].caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark/90 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-text text-sm leading-relaxed">
                {images[currentIndex].caption}
              </p>
            </div>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 bg-dark/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-text text-sm font-medium border border-border-subtle">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto p-2 scrollbar-thin">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isAnimating}
                className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                  index === currentIndex
                    ? 'border-primary ring-2 ring-primary/50 scale-105'
                    : 'border-border-subtle hover:border-primary/50 opacity-60 hover:opacity-100'
                } disabled:cursor-not-allowed`}
                aria-label={`Go to image ${index + 1}`}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-primary/20" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Progress Dots (for smaller galleries) */}
        {images.length > 1 && images.length <= 8 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isAnimating}
                className={`transition-all duration-300 rounded-full disabled:cursor-not-allowed ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-primary'
                    : 'w-2 h-2 bg-text-muted/30 hover:bg-text-muted/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;