import { use } from "react";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
import ScrollToTop from "@/components/Shared/ScrollToTop";
import ProjectsPage from "@/components/Projects/ProjectsPage";

interface ProjectsProps {
  params: Promise<{ locale: string }>;
}

export default function Projects({ params }: ProjectsProps) {
  const { locale } = use(params);

  return (
    <div className="min-h-screen bg-[#140c1c] text-white font-['Sora']">
      <Header />
      <ProjectsPage locale={locale} />
      <Footer />
      <ScrollToTop />
    </div>
  );
}