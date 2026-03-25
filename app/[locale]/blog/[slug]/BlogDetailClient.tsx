"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Tag,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  ChevronRight,
  Hash,
  Sparkles,
} from "lucide-react";
import type { BlogPost, BlogContentBlock } from "@/data/types";
import { localeMap } from "@/data/systemLanguages";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
import { useTranslations } from "next-intl";

interface BlogDetailTranslations {
  backToBlog: string;
  readingTime: string;
  tableOfContents: string;
  relatedArticles: string;
  shareArticle: string;
  linkCopied: string;
  categories: Record<string, string>;
}

interface BlogDetailClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  translations: BlogDetailTranslations;
  locale: string;
}

/* ── Helpers ─────────────────────────────────────────── */
function parseMarkdown(text: string): JSX.Element {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-bold text-text">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

interface TocEntry {
  id: string;
  text: string;
  level: number;
}

function buildToc(blocks: BlogContentBlock[]): TocEntry[] {
  const toc: TocEntry[] = [];
  blocks.forEach((block) => {
    if (block.type === 0 && block.heading)
      toc.push({ id: slugify(block.heading), text: block.heading, level: 2 });
    if (block.type === 0 && block.subheading)
      toc.push({
        id: slugify(block.subheading),
        text: block.subheading,
        level: 3,
      });
  });
  return toc;
}

/* ─────────────────────────────────────────────────────── */
export default function BlogDetailClient({
  post,
  relatedPosts,
  translations,
  locale,
}: BlogDetailClientProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [tocOpen, setTocOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const toc = useMemo(() => buildToc(post.contentBlocks), [post.contentBlocks]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(
      localeMap[locale as keyof typeof localeMap] || "en-US",
      { day: "numeric", month: "long", year: "numeric" },
    );

  useEffect(() => {
    const headings = contentRef.current?.querySelectorAll("[data-heading-id]");
    if (!headings?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setActiveId(entry.target.getAttribute("data-heading-id") ?? "");
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-dark text-text flex flex-col">
      <Header />

      {/* ── Background grid ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* ── Hero / Cover ─────────────────────────── */}
        <div className="relative pt-24 pb-12 overflow-hidden">
          <div className="relative h-[45vh] min-h-[320px] overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-dark/40 to-dark/90" />
          </div>

          {/* Hero text overlay */}
          <div className="absolute bottom-0 left-0 right-0 pb-10 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-4xl">
              {/* Back link */}
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center gap-2 mb-6 text-text-muted hover:text-primary transition-colors group"
              >
                <ArrowLeft
                  size={16}
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                />
                <span className="text-sm font-medium">
                  {translations.backToBlog}
                </span>
              </Link>

              {/* Category badge */}
              <div className="mb-5">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
                  <Sparkles size={12} />
                  {translations.categories[post.category] ?? post.category}
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent leading-tight">
                {post.title}
              </h1>

              {post.subtitle && (
                <p className="text-xl text-primary mb-5 font-medium">
                  {post.subtitle}
                </p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-8 h-8 object-cover rounded-full border border-primary/30"
                  />
                  <span className="text-sm text-text-muted font-medium">
                    {post.author.name}
                  </span>
                </div>
                <span className="text-text-muted/40">·</span>
                <span className="flex items-center gap-1.5 text-sm text-text-muted">
                  <Calendar size={13} />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="text-text-muted/40">·</span>
                <span className="flex items-center gap-1.5 text-sm text-text-muted">
                  <Clock size={13} />
                  {post.readingTime} {translations.readingTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main content area ────────────────────── */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-14">
          <div className="grid lg:grid-cols-[1fr_280px] gap-10">
            {/* ── Article body ── */}
            <div ref={contentRef} className="space-y-8 min-w-0">
              {post.contentBlocks.map((block, idx) => {
                /* Type 0: Text */
                if (block.type === 0)
                  return (
                    <div
                      key={idx}
                      className="bg-dark-secondary/20 rounded-2xl p-8 border border-border-subtle"
                    >
                      {block.heading && (
                        <div data-heading-id={slugify(block.heading)}>
                          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-8 bg-primary rounded-full flex-shrink-0" />
                            {block.heading}
                          </h3>
                        </div>
                      )}
                      {block.subheading && (
                        <h4
                          data-heading-id={slugify(block.subheading)}
                          className="text-xl font-semibold mb-3 text-text-muted"
                        >
                          {block.subheading}
                        </h4>
                      )}
                      {block.content && (
                        <div className="text-text-muted leading-relaxed whitespace-pre-line">
                          {parseMarkdown(block.content)}
                        </div>
                      )}
                    </div>
                  );

                /* Type 1: Image */
                if (block.type === 1)
                  return (
                    <div key={idx} className="space-y-4">
                      {block.heading && (
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                          <span className="w-1.5 h-8 bg-primary rounded-full flex-shrink-0" />
                          {block.heading}
                        </h3>
                      )}
                      <div className="relative rounded-2xl overflow-hidden border border-border-subtle shadow-2xl shadow-primary/5 group">
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <img
                          src={block.imageUrl}
                          alt={block.heading || ""}
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

                /* Type 2: Code */
                if (block.type === 2)
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl overflow-hidden border border-border-subtle bg-dark-secondary/20"
                    >
                      {block.heading && (
                        <div className="flex items-center gap-3 px-6 pt-5 pb-3 border-b border-border-subtle">
                          <Hash size={14} className="text-primary" />
                          <span className="text-sm font-semibold text-text-muted tracking-wide">
                            {block.heading}
                          </span>
                          {block.language && (
                            <span className="ml-auto px-3 py-0.5 text-xs font-medium border border-border-subtle rounded-full text-text-muted uppercase tracking-wider">
                              {block.language}
                            </span>
                          )}
                        </div>
                      )}
                      <pre className="m-0 p-6 bg-dark/60 overflow-x-auto text-sm font-mono leading-relaxed text-text">
                        <code>{block.code}</code>
                      </pre>
                      {block.caption && (
                        <p className="px-6 py-3 text-xs text-text-muted italic border-t border-border-subtle">
                          {block.caption}
                        </p>
                      )}
                    </div>
                  );

                /* Type 3: Quote */
                if (block.type === 3)
                  return (
                    <div
                      key={idx}
                      className="bg-dark-secondary/30 rounded-2xl p-8 border border-border-subtle border-l-2 border-l-primary"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-6xl text-primary/30 font-serif leading-none flex-shrink-0">
                          "
                        </span>
                        <div>
                          <p className="text-lg text-text-muted italic mb-4 leading-relaxed">
                            {block.quote}
                          </p>
                          {block.author && (
                            <div className="flex items-center gap-2">
                              <span className="block w-px h-5 bg-primary" />
                              <span className="text-sm text-text-muted font-medium">
                                {block.author}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );

                /* Type 4: Divider */
                if (block.type === 4)
                  return (
                    <div key={idx} className="flex items-center gap-4 py-2">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border-subtle" />
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className={`rounded-full bg-primary ${i === 1 ? "w-1.5 h-1.5 opacity-70" : "w-1 h-1 opacity-30"}`}
                          />
                        ))}
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border-subtle" />
                    </div>
                  );

                return null;
              })}

              {/* Tags footer */}
              <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-border-subtle">
                <Tag size={13} className="text-text-muted" />
                {post.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs border border-border-subtle rounded-full text-text-muted hover:border-primary/50 hover:text-primary transition-colors duration-200 cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Sidebar ── */}
            <aside className="space-y-6">
              {/* Table of Contents */}
              {toc.length > 0 && (
                <div className="bg-dark-secondary/20 rounded-2xl border border-border-subtle overflow-hidden sticky top-24">
                  <button
                    className="w-full flex items-center gap-3 p-5 hover:bg-dark-secondary/30 transition-colors"
                    onClick={() => setTocOpen(!tocOpen)}
                  >
                    <span className="w-1 h-5 bg-primary rounded-full flex-shrink-0" />
                    <span className="text-sm font-bold text-text flex-1 text-left">
                      {translations.tableOfContents}
                    </span>
                    <ChevronRight
                      size={14}
                      className={`text-text-muted transition-transform duration-300 ${tocOpen ? "rotate-90" : ""}`}
                    />
                  </button>

                  {tocOpen && (
                    <nav className="px-5 pb-5 space-y-1 border-t border-border-subtle pt-3">
                      {toc.map((entry) => (
                        <a
                          key={entry.id}
                          href={`#${entry.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .querySelector(`[data-heading-id="${entry.id}"]`)
                              ?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                          }}
                          className={`block py-1.5 text-sm transition-colors duration-200 hover:text-primary ${
                            entry.level === 3
                              ? "pl-4 border-l border-border-subtle"
                              : ""
                          } ${
                            activeId === entry.id
                              ? "text-primary font-semibold"
                              : "text-text-muted"
                          }`}
                        >
                          {entry.level === 3 && (
                            <span className="text-text-muted mr-1.5 text-xs">
                              ›
                            </span>
                          )}
                          {entry.text}
                        </a>
                      ))}
                    </nav>
                  )}
                </div>
              )}

              {/* Social Share */}
              <div className="bg-dark-secondary/20 rounded-2xl p-5 border border-border-subtle">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full" />
                  {translations.shareArticle}
                </h3>

                <div className="flex gap-2">
                  {[
                    {
                      icon: <Twitter size={14} />,
                      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`,
                    },
                    {
                      icon: <Linkedin size={14} />,
                      href: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`,
                    },
                  ].map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center flex-1 py-2.5 border border-border-subtle rounded-xl text-text-muted hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                    >
                      {item.icon}
                    </a>
                  ))}

                  {/* Copy link */}
                  <button
                    onClick={copyLink}
                    className={`flex items-center justify-center flex-1 gap-1.5 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                      copied
                        ? "border-primary text-primary bg-primary/10"
                        : "border-border-subtle text-text-muted hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <LinkIcon size={13} />
                    {copied ? translations.linkCopied : ""}
                  </button>
                </div>
              </div>

              {/* Author card */}
              <div className="bg-dark-secondary/20 rounded-2xl p-5 border border-border-subtle">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full" />
                  Author
                </h3>
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-12 h-12 object-cover rounded-full border border-primary/30 flex-shrink-0"
                  />
                  <div>
                    <p className="font-bold text-text text-sm">
                      {post.author.name}
                    </p>
                    {post.author.title && (
                      <p className="text-xs text-text-muted mt-0.5">
                        {post.author.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* ── Related Articles ─────────────────────── */}
          {relatedPosts.length > 0 && (
            <div className="mt-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border-subtle" />
                <div className="flex items-center gap-2">
                  <Sparkles size={12} className="text-text-muted" />
                  <span className="text-sm font-bold text-text-muted uppercase tracking-widest">
                    {translations.relatedArticles}
                  </span>
                  <Sparkles size={12} className="text-text-muted" />
                </div>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border-subtle" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.slice(0, 3).map((related, i) => (
                  <Link
                    href={`/${locale}/blog/${related.slug}`}
                    key={related.id}
                    className="group block"
                  >
                    <div className="relative overflow-hidden h-full rounded-2xl border border-border-subtle bg-dark-secondary/20 hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-b from-primary/5 to-transparent rounded-2xl" />

                      <div className="relative h-40 overflow-hidden rounded-t-2xl">
                        <img
                          src={related.coverImage}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
                        <span className="absolute top-3 right-3 text-sm font-bold text-text-muted">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                      </div>

                      <div className="p-5">
                        <p className="mb-2 flex items-center gap-1.5 text-xs text-text-muted">
                          <Clock size={11} />
                          {related.readingTime} {translations.readingTime}
                        </p>
                        <h4 className="text-base font-bold text-text group-hover:text-primary transition-colors duration-300 leading-snug">
                          {related.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
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
}
