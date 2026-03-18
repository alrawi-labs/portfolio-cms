// lib/projectLoader.ts

import { ProjectsIndex, ProjectDetail, ProjectListItem } from '@/data/types';
import { getTechIcon, getTechIcons } from '@/data/techIcons';
import path from 'path';
import { promises as fs } from 'fs';

// Determine if we're on server or client
const isServer = typeof window === 'undefined';
const MESSAGES_DIR = isServer ? path.join(process.cwd(), 'messages') : '';

/**
 * Transform tech icon keys to URLs in project data
 */
function transformTechIcons<T extends ProjectDetail | ProjectListItem>(project: T): T {
  // Transform techLogos array (icon keys to URLs)
  if (project.techLogos && Array.isArray(project.techLogos)) {
    project.techLogos = getTechIcons(project.techLogos);
  }
  
  // Transform technologies array (only in ProjectDetail)
  if ('technologies' in project && project.technologies && Array.isArray(project.technologies)) {
    project.technologies = project.technologies.map((tech: any) => ({
      ...tech,
      icon: tech.icon ? getTechIcon(tech.icon) : undefined
    }));
  }
  
  return project;
}

/**
 * Load project index (list) for a specific locale
 */
export async function getProjectsIndex(locale: string): Promise<ProjectsIndex> {
  try {
    if (isServer) {
      // Server-side: Use file system
      const indexPath = path.join(MESSAGES_DIR, 'projects', 'index', `${locale}.json`);
      const fileContent = await fs.readFile(indexPath, 'utf-8');
      const data = JSON.parse(fileContent);
      
      // Transform tech icons in all items
      if (data.items && Array.isArray(data.items)) {
        data.items = data.items.map((item: ProjectListItem) => transformTechIcons(item));
      }
      
      return data;
    } else {
      // Client-side: Use dynamic import
      const data = await import(`@/messages/projects/index/${locale}.json`);
      const indexData = data.default;
      
      // Transform tech icons in all items
      if (indexData.items && Array.isArray(indexData.items)) {
        indexData.items = indexData.items.map((item: ProjectListItem) => transformTechIcons(item));
      }
      
      return indexData;
    }
  } catch (error) {
    console.error('Error loading project index:', error);
    // Fallback to English if locale not found
    if (locale !== 'en') {
      return getProjectsIndex('en');
    }
    throw error;
  }
}

/**
 * Load detailed project data for a specific project ID and locale
 */
export async function getProjectDetail(
  projectId: number, 
  locale: string
): Promise<ProjectDetail> {
  try {
    if (isServer) {
      // Server-side: Scan directory to find the file
      const detailsDir = path.join(MESSAGES_DIR, 'projects', 'details', locale);
      const files = await fs.readdir(detailsDir);
      
      // Find file that starts with the project ID
      const fileName = files.find(file => file.startsWith(`${projectId}-`));
      
      if (!fileName) {
        throw new Error(`Project detail file not found for ID ${projectId}`);
      }

      const detailPath = path.join(detailsDir, fileName);
      const fileContent = await fs.readFile(detailPath, 'utf-8');
      const project = JSON.parse(fileContent);
      
      // Transform tech icons before returning
      return transformTechIcons(project);
    } else {
      // Client-side: Get slug from index
      const index = await getProjectsIndex(locale);
      const project = index.items.find(p => p.id === projectId);
      
      if (!project) {
        throw new Error(`Project with ID ${projectId} not found in index`);
      }

      // Extract slug from title if not provided
      const slug = slugify(project.title);
      const data = await import(`@/messages/projects/details/${locale}/${projectId}-${slug}.json`);
      const detailProject = data.default;
      
      // Transform tech icons before returning
      return transformTechIcons(detailProject);
    }
  } catch (error) {
    console.error('Error loading project detail:', error);
    // Fallback to English if locale not found
    if (locale !== 'en') {
      return getProjectDetail(projectId, 'en');
    }
    throw error;
  }
}

/**
 * Get all project IDs from index
 */
export async function getAllProjectIds(locale: string = 'en'): Promise<number[]> {
  try {
    const index = await getProjectsIndex(locale);
    return index.items.map(p => p.id);
  } catch (error) {
    console.error(`Failed to get project IDs for locale ${locale}:`, error);
    return [];
  }
}

/**
 * Get featured projects from index
 */
export async function getFeaturedProjects(locale: string): Promise<ProjectListItem[]> {
  const index = await getProjectsIndex(locale);
  return index.items.filter(p => p.isFeatured);
}

/**
 * Get projects by category
 */
export async function getProjectsByCategory(
  category: string, 
  locale: string
): Promise<ProjectListItem[]> {
  const index = await getProjectsIndex(locale);
  
  if (category === 'all') {
    return index.items;
  }
  
  return index.items.filter(p => p.category === category);
}

/**
 * Search projects by query
 */
export async function searchProjects(
  query: string, 
  locale: string
): Promise<ProjectListItem[]> {
  const index = await getProjectsIndex(locale);
  const lowerQuery = query.toLowerCase();
  
  return index.items.filter(p => 
    p.title.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Helper function to create URL-friendly slugs
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/-+/g, '-')       // Replace multiple - with single -
    .trim();
}

/**
 * Server-side data loading for Next.js pages
 */
export class ProjectDataService {
  private locale: string;

  constructor(locale: string = 'en') {
    this.locale = locale;
  }

  async getIndex(): Promise<ProjectsIndex> {
    return getProjectsIndex(this.locale);
  }

  async getDetail(projectId: number): Promise<ProjectDetail> {
    return getProjectDetail(projectId, this.locale);
  }

  async getFeatured(): Promise<ProjectListItem[]> {
    return getFeaturedProjects(this.locale);
  }

  async getByCategory(category: string): Promise<ProjectListItem[]> {
    return getProjectsByCategory(category, this.locale);
  }

  async search(query: string): Promise<ProjectListItem[]> {
    return searchProjects(query, this.locale);
  }

  async getAllIds(): Promise<number[]> {
    return getAllProjectIds(this.locale);
  }
}