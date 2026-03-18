"use client";

import { useState, useEffect, useRef } from "react";
import {
  ExternalLink,
  Shield,
  Calendar,
  Filter,
  TrendingUp,
  Globe,
} from "lucide-react";
import { statsData } from "@/data/stats";



// Icon mapping
const iconMap: { [key: string]: any } = {
  Shield,
  Calendar,
  Filter,
  TrendingUp,
  Globe,
};

interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  tags: string[];
  image: string;
  icon?: string;
}

interface Translations {
  title: string;
  subtitle: string;
  viewProject: string;
  allProjects: {
    title: string;
    description: string;
    button: string;
    stats: {
      projects: string;
      technologies: string;
      years: string;
    };
  };
}

interface FeaturedProjectsClientProps {
  projects: Project[];
  translations: Translations;
}

export default function FeaturedProjectsClient({
  projects,
  translations,
}: FeaturedProjectsClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track window width
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const { top } = container.getBoundingClientRect();
      const scrollProgress =
        -top / (container.offsetHeight - window.innerHeight);

      const newIndex = Math.min(
        Math.floor(scrollProgress * projects.length),
        projects.length - 1
      );

      setActiveIndex(Math.max(0, newIndex));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [projects.length]);

  // Calculate responsive values based on window width
  const getResponsiveValues = (index: number) => {
    let offset = 0.75;
    let widthReduction = 3.75;
    let topBase = 8;

    if (windowWidth < 640) {
      // Mobile
      offset = 0.3;
      widthReduction = 1.2;
      topBase = 6;
    } else if (windowWidth < 1024) {
      // Tablet
      offset = 0.5;
      widthReduction = 2;
      topBase = 7;
    }

    return {
      transform: `translate(${index * offset}rem, ${index * offset}rem)`,
      width: `calc(100% - ${index * widthReduction}rem)`,
      top: `max(${topBase}rem, ${topBase + index * 1.5}rem)`,
    };
  };

  return (
    <section
      id="projects"
      className="relative bg-dark-secondary py-12 sm:py-16 lg:py-20"
      style={{ scrollMarginTop: "30px" }}
    >
      {/* Background Gradient Effects */}
      <div className="absolute top-1/4 left-4 sm:left-10 lg:left-20 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-4 sm:right-10 lg:right-20 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {projects && projects.length > 0 && (
          <>
            {/* Header */}
            <div className="sticky mb-8 sm:mb-8 lg:mb-8 xl:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-wide bg-gradient-hero bg-clip-text text-transparent mb-2 sm:mb-3 lg:mb-4">
                {translations.title}
              </h2>
              <p className="text-text/90 text-sm sm:text-base lg:text-lg xl:text-xl max-w-3xl leading-relaxed">
                {translations.subtitle}
              </p>
            </div>
          </>
        )}

        {/* Cards Container */}
        <div ref={containerRef} className="relative pb-[30vh] sm:pb-[40vh]">
          {projects.map((project, index) => {
            const styles = getResponsiveValues(index);
            const IconComponent = project.icon ? iconMap[project.icon] : Shield;

            return (
              <article
                key={project.id}
                className="sticky mb-[15vh] sm:mb-[20vh]"
                style={styles}
              >
                <div className="bg-dark border border-border rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl hover:shadow-primary/20 transition-all duration-500 group">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {/* Image Section */}
                    <div className="relative h-[30vh] min-h-[240px] sm:h-[35vh] sm:min-h-[280px] md:h-[40vh] md:min-h-[320px] lg:h-[55vh] lg:min-h-[440px] xl:h-[60vh] xl:min-h-[480px] overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-60"></div>

                      {/* Floating Icon */}
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 lg:top-6 lg:right-6 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl lg:rounded-2xl bg-primary/10 backdrop-blur-md border border-primary/20 flex items-center justify-center">
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-primary" />
                      </div>

                      {/* Project Number */}
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 lg:top-6 lg:left-6 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-dark">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 flex flex-col justify-center">
                      <div className="space-y-2.5 sm:space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6">
                        {/* Subtitle */}
                        {project.subtitle && (
                          <div className="flex items-center gap-2">
                            <div className="h-px w-6 sm:w-8 md:w-10 lg:w-12 bg-gradient-primary"></div>
                            <span className="text-primary text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wider">
                              {project.subtitle}
                            </span>
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent leading-tight">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-text/80 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed line-clamp-3 sm:line-clamp-4 lg:line-clamp-none">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 lg:gap-3">
                          {project.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-1.5 lg:px-4 lg:py-2 rounded-md sm:rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs md:text-sm font-medium transition-colors hover:bg-primary/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Links */}
                        <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 pt-1 sm:pt-2 lg:pt-4">
                          <a
                            href={`/projects/${project.id}`}
                            className="group/btn flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-lg sm:rounded-xl bg-gradient-primary text-dark text-xs sm:text-sm md:text-base font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
                          >
                            <span>{translations.viewProject}</span>
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* All Projects Banner */}
        <div className="">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img
                src="/assets/images/sectionBackground.png"
                alt={translations.allProjects.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-primary-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-18 lg:px-12 lg:py-20 xl:py-24 text-center">
              <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
                {/* Decorative line */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="h-px w-8 sm:w-12 md:w-16 lg:w-20 bg-gradient-to-r from-transparent to-white/60"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/80"></div>
                  <div className="h-px w-8 sm:w-12 md:w-16 lg:w-20 bg-gradient-to-l from-transparent to-white/60"></div>
                </div>

                {/* Heading */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight px-2">
                  {translations.allProjects.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto px-2">
                  {translations.allProjects.description}
                </p>

                {/* Button */}
                <div className="pt-2 sm:pt-4">
                  <a
                    href="/projects"
                    className="inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 rounded-lg sm:rounded-xl bg-white text-primary-700 text-sm sm:text-base lg:text-lg font-bold hover:bg-white/95 hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 transform group-hover:scale-105"
                  >
                    <span>{translations.allProjects.button}</span>
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 pt-4 sm:pt-6 text-white/80">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-base sm:text-lg font-bold">
                        {statsData.projects}+
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm md:text-base">
                      {translations.allProjects.stats.projects}
                    </span>
                  </div>
                  <div className="h-3 sm:h-4 w-px bg-white/30"></div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-base sm:text-lg font-bold">
                        {statsData.technologies}+
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm md:text-base">
                      {translations.allProjects.stats.technologies}
                    </span>
                  </div>
                  <div className="h-3 sm:h-4 w-px bg-white/30"></div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-base sm:text-lg font-bold">{statsData.years}+</span>
                    </div>
                    <span className="text-xs sm:text-sm md:text-base">
                      {translations.allProjects.stats.years}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements for decoration */}
            <div className="absolute top-6 left-6 sm:top-10 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-white/10 backdrop-blur-sm animate-pulse"></div>
            <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full bg-white/5 backdrop-blur-sm animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
