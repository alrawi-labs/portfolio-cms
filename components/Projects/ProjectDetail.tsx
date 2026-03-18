"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { ProjectDetail } from "@/data/types";
import { localeMap } from "@/data/systemLanguages";
import ImageCarousel from "./ImageCarousel";
import CodeBlock from "./CodeBlock";
import { useTranslations } from "next-intl";
import { ProjectDataService } from "../../lib/projectLoader";
import LazyVideo from "./LazyVideo";

// SVG Icons
const FALLBACK_TECH_ICON =
  "data:image/svg+xml;base64," +
  btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
    <rect fill="#0a0a0a" width="80" height="80" rx="12"/>
    <circle cx="40" cy="40" r="20" fill="#667eea" opacity="0.5"/>
  </svg>
`);

const ArrowLeftIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);
const CalendarIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);
const UserIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const ClockIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const UsersIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const ExternalLinkIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" x2="21" y1="14" y2="3" />
  </svg>
);
const GithubIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
const CheckCircleIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

interface ProjectDetailClientProps {
  project: ProjectDetail;
  locale: string;
}

const ProjectDetailClient: React.FC<ProjectDetailClientProps> = ({
  project,
  locale,
}) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const t = useTranslations();
  const handleImageError = (
    logoUrl: string,
    e: React.SyntheticEvent<HTMLImageElement>,
  ) => {
    if (!imageErrors.has(logoUrl)) {
      setImageErrors((prev) => new Set(prev).add(logoUrl));
      e.currentTarget.src = FALLBACK_TECH_ICON;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString(localeMap[locale] || "en-US", {
      month: "long",
      year: "numeric",
    });
  };

  function parseMarkdown(text: string): JSX.Element {
    // **bold** metni parse et
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            // Bold
            return (
              <strong key={index} className="font-bold text-text">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text">
      {/* Hero Section */}
      <div className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="container mx-auto px-4 relative z-10 mt-5">
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {t("backToProjects")}
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Information */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                {project.category}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                {project.title}
              </h1>

              {project.subtitle && (
                <p className="text-xl text-primary mb-4">{project.subtitle}</p>
              )}

              <p className="text-lg text-text-muted mb-8 leading-relaxed">
                {project.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Her iki yapıyı da destekle: project.date VEYA project.meta?.date */}
                {(project.date || (project as any).meta?.date) && (
                  <div className="bg-dark-secondary/50 backdrop-blur-sm rounded-xl p-4 border border-border-subtle hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <CalendarIcon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-text-muted text-sm">
                        {t("date")}
                      </span>
                    </div>
                    <p className="text-text font-semibold">
                      {formatDate(project.date || (project as any).meta?.date)}
                    </p>
                  </div>
                )}

                {(project.duration || (project as any).meta?.duration) && (
                  <div className="bg-dark-secondary/50 backdrop-blur-sm rounded-xl p-4 border border-border-subtle hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <ClockIcon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-text-muted text-sm">
                        {t("duration")}
                      </span>
                    </div>
                    <p className="text-text font-semibold">
                      {project.duration || (project as any).meta?.duration}
                    </p>
                  </div>
                )}

                {(project.client || (project as any).meta?.client) && (
                  <div className="bg-dark-secondary/50 backdrop-blur-sm rounded-xl p-4 border border-border-subtle hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <UserIcon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-text-muted text-sm">
                        {t("client")}
                      </span>
                    </div>
                    <p className="text-text font-semibold">
                      {project.client || (project as any).meta?.client}
                    </p>
                  </div>
                )}

                {(project.teamSize || (project as any).meta?.teamSize) && (
                  <div className="bg-dark-secondary/50 backdrop-blur-sm rounded-xl p-4 border border-border-subtle hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <UsersIcon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-text-muted text-sm">
                        {t("teamSize")}
                      </span>
                    </div>
                    <p className="text-text font-semibold">
                      {project.teamSize || (project as any).meta?.teamSize}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {project.demoLink && (
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
                  >
                    <ExternalLinkIcon className="w-5 h-5" />
                    {t("liveDemo")}
                  </a>
                )}
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-dark-secondary hover:bg-dark-secondary/80 text-text border border-border-subtle hover:border-text/20 px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1"
                  >
                    <GithubIcon className="w-5 h-5" />
                    {t("viewSource")}
                  </a>
                )}
              </div>
            </div>

            {/* Right: Image & Tech Stack */}
            <div className="space-y-8">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden border border-border-subtle shadow-2xl shadow-primary/5 group">
                <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Technologies */}
              {project.techLogos && project.techLogos.length > 0 && (
                <div className="bg-dark-secondary/30 backdrop-blur-sm rounded-2xl p-6 border border-border-subtle">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full" />
                    {t("technologiesUsed")}
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {project.techLogos.map((logo: string, idx: number) => (
                      <div
                        key={idx}
                        className="group/tech relative p-4 bg-dark-secondary/50 rounded-xl border border-border-subtle hover:border-primary/50 transition-all hover:bg-dark-secondary hover:-translate-y-1"
                      >
                        <img
                          src={logo}
                          alt="Tech"
                          className="w-12 h-12 object-contain filter grayscale group-hover/tech:grayscale-0 transition-all duration-300"
                          onError={(e) => handleImageError(logo, e)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Content Blocks Section */}
            {project.contentBlocks && project.contentBlocks.length > 0 && (
              <div className="space-y-8">
                {project.contentBlocks.map((block: any, idx: number) => {
                  // Type 0: Text Content
                  if (block.type === 0) {
                    return (
                      <div
                        key={idx}
                        className="bg-dark-secondary/20 rounded-2xl p-8 border border-border-subtle"
                      >
                        {block.heading && (
                          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-8 bg-primary rounded-full" />
                            {block.heading}
                          </h3>
                        )}
                        {block.subheading && (
                          <h4 className="text-xl font-semibold mb-3 text-text-muted">
                            {block.subheading}
                          </h4>
                        )}
                        {block.content && (
                          <div className="text-text-muted leading-relaxed whitespace-pre-line">
                            {parseMarkdown(block.content || "")}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Type 1: Single Image
                  if (block.type === 1) {
                    return (
                      <div key={idx} className="space-y-4">
                        {block.heading && (
                          <h3 className="text-2xl font-bold flex items-center gap-2">
                            <span className="w-1.5 h-8 bg-primary rounded-full" />
                            {block.heading}
                          </h3>
                        )}
                        <div className="relative rounded-2xl overflow-hidden border border-border-subtle shadow-2xl shadow-primary/5 group">
                          <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          <img
                            src={block.imageUrl}
                            alt={block.heading || "Project image"}
                            className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        {block.caption && (
                          <p className="text-sm text-text-muted italic text-center">
                            {block.caption}
                          </p>
                        )}
                      </div>
                    );
                  }

                  // Type 2: Video Content
                  if (block.type === 2) {
                    return (
                      <div key={idx} className="space-y-4">
                        {block.heading && (
                          <h3 className="text-2xl font-bold flex items-center gap-2">
                            <span className="w-1.5 h-8 bg-primary rounded-full" />
                            {block.heading}
                          </h3>
                        )}
                        <LazyVideo
                          src={block.videoUrl}
                          poster={block.posterUrl}
                          fallbackText={t("videoNotSupported")}
                        />
                        {block.caption && (
                          <p className="text-sm text-text-muted italic text-center">
                            {block.caption}
                          </p>
                        )}
                      </div>
                    );
                  }

                  // Type 3: Image Gallery
                  if (block.type === 3) {
                    return (
                      <div key={idx}>
                        <ImageCarousel
                          images={block.images || []}
                          heading={block.heading}
                          autoPlay={block.autoPlay !== false}
                          autoPlayInterval={block.autoPlayInterval || 5000}
                        />
                      </div>
                    );
                  }

                  // Type 4: Code Block - YENİ!
                  if (block.type === 4) {
                    return (
                      <div key={idx}>
                        <CodeBlock
                          heading={block.heading}
                          subheading={block.subheading}
                          content={block.content}
                          codeBlocks={block.codeBlocks || []}
                          defaultTab={block.defaultTab || 0}
                        />
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            )}

            {/* Challenges Section */}
            {project.challenges && project.challenges.length > 0 && (
              <div className="bg-dark-secondary/20 rounded-2xl p-8 border border-border-subtle">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-8 bg-primary rounded-full" />
                  {t("challenges")}
                </h3>
                <div className="space-y-4">
                  {project.challenges.map((challenge: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-dark-secondary/30 p-4 rounded-lg"
                    >
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                      <p className="text-text-muted leading-relaxed">
                        {challenge}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Solutions Section */}
            {project.solutions && project.solutions.length > 0 && (
              <div className="bg-dark-secondary/20 rounded-2xl p-8 border border-border-subtle">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CheckCircleIcon className="w-6 h-6 text-primary" />
                  {t("solutions")}
                </h3>
                <div className="space-y-4">
                  {project.solutions.map((solution: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-dark-secondary/30 p-4 rounded-lg border-l-2 border-primary"
                    >
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                      <p className="text-text-muted leading-relaxed">
                        {solution}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results Section */}
            {project.results && project.results.length > 0 && (
              <div className="bg-gradient-to-br from-primary/10 to-transparent rounded-2xl p-8 border border-primary/20">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-8 bg-primary rounded-full" />
                  {t("resultsImpact")}
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {project.results.map((result: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-dark-secondary/50 backdrop-blur-sm p-6 rounded-xl border border-border-subtle"
                    >
                      <div className="text-3xl font-bold text-primary mb-2">
                        {result.value}
                      </div>
                      <div className="text-sm text-text-muted uppercase tracking-wider mb-1">
                        {result.metric}
                      </div>
                      <p className="text-text-muted text-sm">
                        {result.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonial Section */}
            {project.testimonial && (
              <div className="bg-dark-secondary/30 rounded-2xl p-8 border border-border-subtle">
                <div className="flex items-start gap-4">
                  <span className="text-6xl text-primary/30">"</span>
                  <div>
                    <p className="text-lg text-text-muted italic mb-4 leading-relaxed">
                      {project.testimonial.text}
                    </p>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-bold text-text">
                          {project.testimonial.author}
                        </p>
                        <p className="text-sm text-text-muted">
                          {project.testimonial.position}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* ── Satın Alma Kartı ── Sidebar'da technologies'in altına ekle ── */}
            {project.buy && (
              <div className="relative rounded-2xl overflow-hidden border border-primary/30 bg-gradient-to-br from-primary/10 via-dark-secondary/40 to-dark-secondary/20 backdrop-blur-sm shadow-xl shadow-primary/10">
                {/* Arka plan parıltı efekti */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative p-6 space-y-5">
                  {/* Başlık */}
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/15 p-2 rounded-lg">
                      <svg
                        className="w-5 h-5 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="8" cy="21" r="1" />
                        <circle cx="19" cy="21" r="1" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-text">{t("buy")}</h3>
                  </div>

                  {/* Fiyat */}
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-extrabold text-text leading-none">
                      {project.buy.price}
                    </span>
                    <span className="text-text-muted text-sm mb-1">
                      {project.buy.currency}
                    </span>
                  </div>

                  {/* Özellikler */}
                  <div className="space-y-2">
                    {project.buy.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2.5">
                        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center">
                          <svg
                            className="w-2.5 h-2.5 text-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Satın Al butonu */}
                  <a
                    href={project.buy.buylink}
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="8" cy="21" r="1" />
                      <circle cx="19" cy="21" r="1" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
                      />
                    </svg>
                    {t("buynow")}
                  </a>
                </div>
              </div>
            )}

            {/* Technologies Details */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="bg-dark-secondary/20 rounded-2xl p-6 border border-border-subtle sticky top-24">
                <h3 className="text-xl font-bold mb-4">{t("technologies")}</h3>
                <div className="space-y-4">
                  {project.technologies.map((tech: any, idx: number) => (
                    <div
                      key={idx}
                      className="pb-4 border-b border-border-subtle last:border-0 last:pb-0"
                    >
                      <p className="font-semibold text-text mb-1">
                        {tech.name}
                      </p>
                      <p className="text-sm text-text-muted">
                        {tech.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            );
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default ProjectDetailClient;
