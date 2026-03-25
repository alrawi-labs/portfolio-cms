// app/[locale]/blog/page.tsx
import { getTranslations, getLocale } from "next-intl/server";
import blogPostsData from "@/data/blog.json";
import type { BlogPost } from "@/data/types";
const blogPosts = blogPostsData as BlogPost[];
import BlogsClient from "@/components/Blog/BlogsClient";

export async function generateMetadata() {
  const t = await getTranslations("blog");
  return {
    title: t("hero.title"),
    description: t("hero.subtitle"),
  };
}

export default async function BlogPage() {
  const locale = await getLocale();
  const t      = await getTranslations("blog");

  const translations = {
    hero: {
      badge:    t("hero.badge"),
      title:    t("hero.title"),
      subtitle: t("hero.subtitle"),
    },
    search: {
      placeholder:    t("search.placeholder"),
      filterButton:   t("search.filterButton"),
      showingResults: t("search.showingResults"),
      article:        t("search.article"),
      articles:       t("search.articles"),
    },
    categories: {
      all:            t("categories.all"),
      webDevelopment: t("categories.webDevelopment"),
      programming:    t("categories.programming"),
      design:         t("categories.design"),
      aiMl:           t("categories.aiMl"),
      career:         t("categories.career"),
    },
    readMore:    t("readMore"),
    readingTime: t("readingTime"),
    noResults: {
      title:       t("noResults.title"),
      description: t("noResults.description"),
      clearButton: t("noResults.clearButton"),
    },
  };

  return (
    <BlogsClient
      posts={blogPosts}
      translations={translations}
      locale={locale}
    />
  );
}