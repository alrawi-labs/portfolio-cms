"use client";

import { useRef, useEffect } from "react";

export interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  fallbackText?: string;
}

export default function LazyVideo({ src, poster, className, fallbackText }: LazyVideoProps) {
  const ref     = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && ref.current && !ref.current.src) {
          ref.current.src = src;
          ref.current.load();
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div ref={wrapRef} className="relative rounded-2xl overflow-hidden border border-border-subtle shadow-2xl shadow-primary/5">
      <video
        ref={ref}
        controls
        preload="none"
        poster={poster}
        className={`w-full aspect-video object-cover ${className || ""}`}
      >
        {fallbackText}
      </video>
    </div>
  );
}