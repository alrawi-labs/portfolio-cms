import { getFeaturedProjects } from '@/lib/projects';
import FeaturedProjectsClient from './FeaturedProjectsClient';
import { getTranslations } from 'next-intl/server';

interface FeaturedProjectsProps {
  locale: string;
}

export default async function FeaturedProjects({ locale }: FeaturedProjectsProps) {
  // Server-side'da featured projeleri yükle
  const projects = await getFeaturedProjects(locale);
  
  // Çevirileri yükle
  const t = await getTranslations('projects.featuredProjects');

  const translations = {
    title: t('title'),
    subtitle: t('subtitle'),
    viewProject: t('viewProject'),
    allProjects: {
      title: t('allProjects.title'),
      description: t('allProjects.description'),
      button: t('allProjects.button'),
      stats: {
        projects: t('allProjects.stats.projects'),
        technologies: t('allProjects.stats.technologies'),
        years: t('allProjects.stats.years'),
      }
    }
  };

  return <FeaturedProjectsClient projects={projects} translations={translations} />;
}