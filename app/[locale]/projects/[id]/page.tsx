import { notFound } from 'next/navigation';
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
import ScrollToTop from "@/components/Shared/ScrollToTop";
import ProjectDetail from '@/components/Projects/ProjectDetail';
import { getProjectDetail } from '@/lib/projectLoader';

// Type for params
type PageProps = {
  params: Promise<{ id: string; locale: string }>;
};

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// Generate metadata for each project page
export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const projectId = Number(params.id);
  
  try {
    const project = await getProjectDetail(projectId, params.locale);
    
    return {
      title: `${project.title} | Portfolio`,
      description: project.description || `View details for ${project.title}`,
      openGraph: {
        title: project.title,
        description: project.description,
        images: project.image ? [project.image] : [],
      },
    };
  } catch (error) {
    return { 
      title: 'Project Not Found',
      description: 'The requested project could not be found.'
    };
  }
}

// Main page component
export default async function ProjectDetailPage(props: PageProps) {
  const params = await props.params;
  const projectId = Number(params.id);
  
  // Validate project ID
  if (isNaN(projectId)) {
    notFound();
  }

  try {
    // Load project detail using the new loader (server-side fs)
    const project = await getProjectDetail(projectId, params.locale);
    
    return (
      <div className="min-h-screen bg-dark text-text font-['Sora']">
        <Header />
        <ProjectDetail project={project} locale={params.locale} />
        <Footer />
        <ScrollToTop />
      </div>
    );
  } catch (error) {
    console.error(`Failed to load project ${projectId} for locale ${params.locale}:`, error);
    notFound(); // Redirect to 404 page
  }
}