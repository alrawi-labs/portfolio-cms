import { getAllProjects } from '@/lib/projects';
import ProjectsClient from './ProjectsClient';
import { getTranslations } from 'next-intl/server';

interface ProjectsPageProps {
  locale: string;
}

export default async function ProjectsPage({ locale }: ProjectsPageProps) {
  // Server-side'da projeleri yükle
  const projects = await getAllProjects(locale);
  
  // Çevirileri yükle
  const t = await getTranslations('projects');

  const translations = {
    hero: {
      badge: t('hero.badge'),
      title: t('hero.title'),
      subtitle: t('hero.subtitle'),
    },
    search: {
      placeholder: t('search.placeholder'),
      filterButton: t('search.filterButton'),
      showingResults: t('search.showingResults'),
      project: t('search.project'),
      projects: t('search.projects'),
    },
    categories: {
      all: t('categories.all'),
      webDevelopment: t('categories.webDevelopment'),
      mobileApp: t('categories.mobileApp'),
      design: t('categories.design'),
      aiMl: t('categories.aiMl'),
      blockchain: t('categories.blockchain'),
    },
    noResults: {
      title: t('noResults.title'),
      description: t('noResults.description'),
      clearButton: t('noResults.clearButton'),
    },
  };

  return <ProjectsClient projects={projects} translations={translations} locale={locale} />;
}