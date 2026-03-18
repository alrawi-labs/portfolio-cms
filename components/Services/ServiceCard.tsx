"use client";

import { useState, useEffect, useRef } from "react";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
  isVisible: boolean;
}

export default function ServiceCard({
  number,
  title,
  description,
  icon: Icon,
  index,
  isVisible,
}: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group bg-dark border border-border rounded-2xl lg:rounded-3xl p-6 lg:p-8 hover:border-primary transition-all duration-500 relative overflow-hidden ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* Mouse Follow Border Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(99, 102, 241, 0.15), transparent 40%)",
          borderRadius: "inherit",
        }}
      ></div>

      {/* Hover Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10">
        {/* Icon & Number */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500">
            <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-primary" />
          </div>
          <span className="text-4xl lg:text-5xl font-bold text-border group-hover:text-primary/30 transition-colors duration-500">
            {number.toString().padStart(2, "0")}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-text text-xl lg:text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-text/80 leading-relaxed text-sm lg:text-base">
          {description}
        </p>

        {/* Bottom Line Animation */}
        <div className="mt-4 h-0.5 w-0 bg-gradient-primary group-hover:w-full transition-all duration-700"></div>
      </div>
    </div>
  );
}