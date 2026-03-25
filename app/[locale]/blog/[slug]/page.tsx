// app/[locale]/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import blogPostsData from "@/data/blog.json";
import type { BlogPost } from "@/data/types";
const blogPosts = blogPostsData as BlogPost[];
import BlogDetailClient from "./BlogDetailClient";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title:       post.title,
    description: post.excerpt,
    openGraph: {
      title:       post.title,
      description: post.excerpt,
      images:      [{ url: post.coverImage }],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const locale = await getLocale();
  const t      = await getTranslations("blog");

  /* Related: same category, excluding current */
  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  /* Fallback: any other posts if not enough related */
  const fallback = blogPosts
    .filter((p) => p.id !== post.id && p.category !== post.category)
    .slice(0, 3 - relatedPosts.length);

  const translations = {
    backToBlog:      t("backToBlog"),
    readingTime:     t("readingTime"),
    tableOfContents: t("tableOfContents"),
    relatedArticles: t("relatedArticles"),
    shareArticle:    t("shareArticle"),
    linkCopied:      t("linkCopied"),
    categories: {
      all:            t("categories.all"),
      webDevelopment: t("categories.webDevelopment"),
      programming:    t("categories.programming"),
      design:         t("categories.design"),
      aiMl:           t("categories.aiMl"),
      career:         t("categories.career"),
    },
  };

  return (
    <BlogDetailClient
      post={post}
      relatedPosts={[...relatedPosts, ...fallback]}
      translations={translations}
      locale={locale}
    />
  );
}