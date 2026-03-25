"use client";

import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import type { BlogPost } from "@/data/types";
import { localeMap } from "@/data/systemLanguages";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";

// SVG Icons (matching Projects pattern)
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

const XIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const ClockIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const BookOpenIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const TagIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l7.29-7.29a1 1 0 0 0 0-1.41Z" />
    <path d="M7 7h.01" />
  </svg>
);

interface BlogTranslations {
  hero:        { badge: string; title: string; subtitle: string };
  search:      { placeholder: string; filterButton: string; showingResults: string; article: string; articles: string };
  categories:  Record<string, string>;
  readMore:    string;
  readingTime: string;
  noResults:   { title: string; description: string; clearButton: string };
}

interface BlogsClientProps {
  posts:        BlogPost[];
  translations: BlogTranslations;
  locale:       string;
}

export default function BlogsClient({ posts, translations, locale }: BlogsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery,       setSearchQuery]       = useState("");
  const [showFilters,       setShowFilters]        = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(
      localeMap[locale as keyof typeof localeMap] || "en-US",
      { day: "numeric", month: "long", year: "numeric" }
    );
  };

  const filtered = useMemo(() => {
    let result = posts;
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return result;
  }, [selectedCategory, searchQuery, posts]);

  const featured = posts.find((p) => p.isFeatured);
  const categories = Object.keys(translations.categories);

  return (
    <div className="min-h-screen bg-dark text-text pt-20">
      <Header />

      {/* ── Hero ─────────────────────────────────── */}
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

      {/* ── Featured Post ────────────────────────── */}
      {featured && selectedCategory === "all" && !searchQuery && (
        <div className="container mx-auto px-4 mb-12">
          <div className="flex items-center gap-2 mb-5">
            <BookOpenIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-text-muted uppercase tracking-widest">
              Featured Article
            </span>
          </div>

          <Link href={`/${locale}/blog/${featured.slug}`} className="group block">
            <div className="relative overflow-hidden grid lg:grid-cols-2 bg-dark-secondary/30 backdrop-blur-sm rounded-2xl border border-border-subtle hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">

              {/* Image */}
              <div className="relative h-64 lg:h-full min-h-[280px] overflow-hidden rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-dark/80" />

                {/* Featured badge */}
                <div className="absolute top-4 left-4 bg-dark-secondary/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-sm font-medium border border-border-subtle">
                  ✦ Featured
                </div>
              </div>

              {/* Content */}
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/20">
                    {translations.categories[featured.category] ?? featured.category}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-text-muted">
                    <ClockIcon className="w-3.5 h-3.5" />
                    {featured.readingTime} {translations.readingTime}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {featured.title}
                </h2>

                {featured.subtitle && (
                  <p className="text-sm text-primary mb-3">{featured.subtitle}</p>
                )}

                <p className="text-text-muted text-sm mb-6 line-clamp-3 leading-relaxed">
                  {featured.excerpt}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={featured.author.avatar}
                    alt={featured.author.name}
                    className="w-9 h-9 object-cover rounded-full border border-border-subtle"
                  />
                  <div>
                    <p className="text-sm font-medium text-text">{featured.author.name}</p>
                    <p className="text-xs text-text-muted">{formatDate(featured.publishedAt)}</p>
                  </div>
                </div>

                {/* Bottom Accent Line */}
                <div className="mt-6 relative h-1 rounded-full overflow-hidden bg-dark/30">
                  <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* ── Search + Filter ───────────────────────── */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">

          {/* Search */}
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

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-6 py-3 rounded-xl transition-colors w-full sm:w-auto justify-center"
          >
            <FilterIcon className="w-5 h-5" />
            {translations.search.filterButton}
          </button>

          {/* Desktop category filters */}
          <div className="hidden lg:flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-white"
                    : "bg-dark-secondary/80 text-text-muted hover:bg-dark-secondary hover:text-text"
                }`}
              >
                {translations.categories[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile filters panel */}
        {showFilters && (
          <div className="lg:hidden mt-4 flex flex-wrap gap-2 p-4 bg-dark-secondary/50 rounded-xl border border-border-subtle">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setShowFilters(false); }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-white"
                    : "bg-dark-secondary/80 text-text-muted hover:bg-dark-secondary hover:text-text"
                }`}
              >
                {translations.categories[cat]}
              </button>
            ))}
          </div>
        )}

        {/* Results count */}
        <div className="mt-6 text-sm text-text-muted">
          {translations.search.showingResults}{" "}
          {filtered.length}{" "}
          {filtered.length === 1 ? translations.search.article : translations.search.articles}
        </div>
      </div>

      {/* ── Posts Grid ────────────────────────────── */}
      <div className="container mx-auto px-4 pb-20">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post) => (
              <Link
                href={`/${locale}/blog/${post.slug}`}
                key={post.id}
                className="group bg-dark-secondary/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-border-subtle hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2"
              >
                {/* Cover image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-dark-secondary/90 backdrop-blur-sm text-text px-3 py-1 rounded-full text-sm font-medium border border-border-subtle">
                    {translations.categories[post.category] ?? post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm text-text-muted mb-3">
                    <ClockIcon className="w-4 h-4" />
                    {post.readingTime} {translations.readingTime}
                    <span className="text-border-subtle">·</span>
                    {formatDate(post.publishedAt)}
                  </div>

                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-text-muted text-sm mb-4 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1 bg-dark/50 text-text-muted px-3 py-1 rounded-full text-xs font-medium border border-border-subtle hover:border-primary/50 hover:text-primary transition-colors"
                      >
                        <TagIcon className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Author row */}
                  <div className="flex items-center gap-2 pt-4 border-t border-border-subtle">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-7 h-7 object-cover rounded-full border border-border-subtle flex-shrink-0"
                    />
                    <p className="text-sm font-medium text-text flex-1 min-w-0 truncate">
                      {post.author.name}
                    </p>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {translations.readMore} →
                    </span>
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
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
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

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div className="mt-auto"><Footer /></div>
    </div>
  );
}