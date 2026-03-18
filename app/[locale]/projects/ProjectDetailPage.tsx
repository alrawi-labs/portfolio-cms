import ProjectDetail from '@/components/Projects/ProjectDetail';
import { getProjectDetail, getAllProjectIds } from '@/lib/projectLoader';
import { notFound } from 'next/navigation';
import { systemLanguageCodes } from '@/data/systemLanguages';

interface PageProps {
  params: {
    id: string;
    locale: string;
  };
}

// Static paths oluştur (build time)
export async function generateStaticParams() {
  const paths = [];

  for (const locale of systemLanguageCodes) {
    const ids = await getAllProjectIds(locale);
    for (const id of ids) {
      paths.push({ locale, id: String(id) });
    }
  }

  return paths;
}

// Server Component - Veriyi yükle
export default async function ProjectDetailPage({ params }: PageProps) {
  const projectId = Number(params.id);
  
  try {
    const project = await getProjectDetail(projectId, params.locale);
    return <ProjectDetail project={project} locale={params.locale} />;
  } catch (error) {
    notFound();
  }
}

// SEO Metadata
export async function generateMetadata({ params }: PageProps) {
  try {
    const project = await getProjectDetail(Number(params.id), params.locale);
    return {
      title: `${project.title} | Portfolio`,
      description: project.description,
    };
  } catch {
    return { title: 'Project Not Found' };
  }
}
