import { use } from "react";
import Header from "@/components/Shared/Header";
import Hero from "@/components/Hero/HeroSection";
import Services from "@/components/Services/ServicesSection";
import FeaturedProjects from "@/components/Projects/FeaturedProjects";
import Resume from "@/components/Resume/ResumeSection";
import Skills from "@/components/Skills/SkillsSection";
import Testimonials from "@/components/Testimonials/TestimonialsSection";
import Contact from "@/components/Contact/ContactSection";
import Stats from "@/components/Stats/StatsSection";
import Footer from "@/components/Shared/Footer";
import ScrollToTop from "@/components/Shared/ScrollToTop";
import Languages from "@/components/Languages/LanguagesSection";
import Volunteering from "@/components/Volunteering/VolunteeringSection";
import Certificates from "@/components/Certificates/CertificatesSection";
import VisionStatements from "@/components/VisionStatements/VisionStatementsSection";

interface HomeProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function Home({ params }: HomeProps) {
  const { locale } = use(params);

  return (
    <div className="min-h-screen bg-[#140c1c] text-white font-['Sora']">
      <Header />
      <Hero />
      <Stats />
      <Services />
      <FeaturedProjects locale={locale} />
      <Resume />
      <Skills />
      <Languages />
      <Volunteering />
      <Certificates />
      <VisionStatements />
      <Contact />
      <Footer />
      <ScrollToTop />
    </div>
  );
}