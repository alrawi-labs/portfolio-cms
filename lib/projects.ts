import fs from 'fs';
import path from 'path';
import { getTechIcon, getTechIcons } from '@/data/techIcons';

export interface Technology {
  name: string;
  icon?: string;
  description?: string;
}

export interface ProjectDetail {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  category: string;
  tags: string[];
  image: string;
  date?: string;
  isFeatured?: boolean;
  icon?: string;
  techLogos?: string[];
  technologies?: Technology[];
  demoLink?: string;
  githubLink?: string;
  duration?: string;
  teamSize?: number;
  role?: string;
  contentBlocks?: any[];
  challenges?: string[];
  solutions?: string[];
  results?: any[];
  testimonial?: {
    text: string;
    author: string;
    position: string;
  };
}

/**
 * Transform tech icon keys to URLs in project data
 */
function transformTechIcons(project: any): ProjectDetail {
  // Transform techLogos array (icon keys to URLs)
  if (project.techLogos && Array.isArray(project.techLogos)) {
    project.techLogos = getTechIcons(project.techLogos);
  }
  
  // Transform technologies array (icon key to URL)
  if (project.technologies && Array.isArray(project.technologies)) {
    project.technologies = project.technologies.map((tech: any) => ({
      ...tech,
      icon: tech.icon ? getTechIcon(tech.icon) : undefined
    }));
  }
  
  return project;
}

export async function getAllProjects(locale: string): Promise<ProjectDetail[]> {
  const detailsDir = path.join(process.cwd(), 'messages', 'projects', 'details', locale);
  
  try {
    // Klasördeki tüm .json dosyalarını oku
    const files = fs.readdirSync(detailsDir).filter(file => file.endsWith('.json'));
    
    // Her dosyayı oku ve parse et
    const projects = files.map(file => {
      const filePath = path.join(detailsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const project = JSON.parse(fileContent);
      
      // Tech icon'ları dönüştür
      return transformTechIcons(project);
    });
    
    // Tarihe göre sırala (en yeni önce)
    projects.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    return projects;
  } catch (error) {
    console.error(`Failed to load projects for locale ${locale}:`, error);
    return [];
  }
}

export async function getProjectById(locale: string, id: string): Promise<ProjectDetail | null> {
  const filePath = path.join(process.cwd(), 'messages', 'projects', 'details', locale, `${id}.json`);
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const project = JSON.parse(fileContent);
    
    // Tech icon'ları dönüştür
    return transformTechIcons(project);
  } catch (error) {
    console.error(`Failed to load project ${id}:`, error);
    return null;
  }
}

export async function getFeaturedProjects(locale: string): Promise<ProjectDetail[]> {
  const allProjects = await getAllProjects(locale);
  return allProjects.filter(project => project.isFeatured === true);
}