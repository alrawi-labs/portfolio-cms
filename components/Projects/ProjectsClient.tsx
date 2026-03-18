"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { localeMap } from "@/data/systemLanguages";

// SVG Icons
const SearchIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const FilterIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const CalendarIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const XIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  date?: string;
  isFeatured?: boolean;
}

interface Translations {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
  };
  search: {
    placeholder: string;
    filterButton: string;
    showingResults: string;
    project: string;
    projects: string;
  };
  categories: {
    all: string;
    webDevelopment: string;
    mobileApp: string;
    design: string;
    aiMl: string;
    blockchain: string;
  };
  noResults: {
    title: string;
    description: string;
    clearButton: string;
  };
}

interface ProjectsClientProps {
  projects: Project[];
  translations: Translations;
  locale: string;
}

export default function ProjectsClient({ projects, translations, locale }: ProjectsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [showFilters, setShowFilters] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const localeCode = localeMap[locale as keyof typeof localeMap] || 'en-US';
    
    return date.toLocaleDateString(localeCode, {
      month: 'long',
      year: 'numeric'
    });
  };

  // Filter projects
  useEffect(() => {
    let filtered = projects;

    // Filter by category
    if (selectedCategory !== "all") {
      const categoryName = translations.categories[selectedCategory as keyof typeof translations.categories];
      filtered = filtered.filter(p => p.category === categoryName);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredProjects(filtered);
  }, [selectedCategory, searchQuery, projects, translations]);

  const categories = ["all", "webDevelopment", "mobileApp", "design", "aiMl", "blockchain"];

  return (
    <div className="min-h-screen bg-dark text-text pt-20">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              {translations.hero.badge}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
              {translations.hero.title}
            </h1>

            <p className="text-lg text-text-muted">
              {translations.hero.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          {/* Search Box */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
            <input
              type="text"
              placeholder={translations.search.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-secondary/80 border border-border-subtle rounded-xl pl-12 pr-4 py-3 text-text focus:outline-none focus:border-primary/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-6 py-3 rounded-xl transition-colors w-full sm:w-auto justify-center"
          >
            <FilterIcon className="w-5 h-5" />
            {translations.search.filterButton}
          </button>

          {/* Category Filters (Desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-dark-secondary/80 text-text-muted hover:bg-dark-secondary hover:text-text"
                }`}
              >
                {translations.categories[category as keyof typeof translations.categories]}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="lg:hidden mt-4 flex flex-wrap gap-2 p-4 bg-dark-secondary/50 rounded-xl border border-border-subtle">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setShowFilters(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-dark-secondary/80 text-text-muted hover:bg-dark-secondary hover:text-text"
                }`}
              >
                {translations.categories[category as keyof typeof translations.categories]}
              </button>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="mt-6 text-sm text-text-muted">
          {translations.search.showingResults} {filteredProjects.length}{" "}
          {filteredProjects.length === 1 
            ? translations.search.project 
            : translations.search.projects}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 pb-20">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Link
                href={`/${locale}/projects/${project.id}`}
                key={project.id}
                className="group bg-dark-secondary/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-border-subtle hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-dark-secondary/90 backdrop-blur-sm text-text px-3 py-1 rounded-full text-sm font-medium border border-border-subtle">
                    {project.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {project.date && (
                    <div className="flex items-center gap-2 text-sm text-text-muted mb-3">
                      <CalendarIcon className="w-4 h-4" />
                      {formatDate(project.date)}
                    </div>
                  )}

                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>

                  {project.subtitle && (
                    <p className="text-sm text-primary mb-2">{project.subtitle}</p>
                  )}

                  <p className="text-text-muted text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-dark/50 text-text-muted px-3 py-1 rounded-full text-xs font-medium border border-border-subtle hover:border-primary/50 hover:text-primary transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Accent Line */}
                  <div className="mt-4 relative h-1 rounded-full overflow-hidden bg-dark/30">
                    <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-dark-secondary/50 rounded-full mb-6">
              <SearchIcon className="w-10 h-10 text-text-muted" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{translations.noResults.title}</h3>
            <p className="text-text-muted mb-6">{translations.noResults.description}</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              {translations.noResults.clearButton}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}