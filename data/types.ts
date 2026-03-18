export interface Service {
  id: number;
  title: string;
  description: string;
}

export interface Portfolio {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

export interface Skill {
  name: string;
  percentage: number;
  icon: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  image: string;
}

export interface Experience {
  period: string;
  title: string;
  company: string;
}

export interface Education {
  period: string;
  title: string;
  institute: string;
}

export interface Global {
  LightLogo: string;
  DarkLogo: string;
}

// ===== PROJECT TYPES =====

export interface ProjectListItem {
  id: number;
  isFeatured: boolean;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  icon?: string;
  date?: string;
  techLogos: string[];
}

export interface Technology {
  name: string;
  description: string;
}

export interface ContentBlock {
  type: 0 | 1 | 2 | 3 | 4; // 0: text, 1: single image, 2: video, 3: image gallery, 4: code block
  heading?: string;
  subheading?: string;
  content?: string;

  // Single Image (type 1)
  imageUrl?: string;
  caption?: string;

  // Video (type 2)
  videoUrl?: string;
  posterUrl?: string;

  // Image Gallery (type 3)
  images?: Array<{
    url: string;
    alt?: string;
    caption?: string;
  }>;
  autoPlay?: boolean;
  autoPlayInterval?: number;

  // Code Block (type 4) - YENİ!
  codeBlocks?: Array<{
    language: string;
    label: string;
    code: string;
  }>;
  defaultTab?: number;
}

export interface ProjectResult {
  metric: string;
  value: string;
  description: string;
}

export interface ProjectTestimonial {
  text: string;
  author: string;
  position: string;
}

export interface ProjectPriceBuy {
  price: string;
  currency: string;
  features: string[];
  buylink: string;
}

// ✅ DÜZELTME: Meta objesi kaldırıldı, alanlar direkt ProjectDetail'e taşındı
export interface ProjectDetail {
  id: number;
  title: string;
  subtitle?: string; // ✅ Eklendi
  description: string;
  category: string;
  tags: string[];
  image: string;
  techLogos: string[];
  demoLink?: string;
  githubLink?: string;
  buy?: ProjectPriceBuy;

  // Meta alanları direkt burada
  date?: string; // ✅ Eklendi
  duration?: string; // ✅ Eklendi
  client?: string; // ✅ Eklendi
  teamSize?: string | number; // ✅ Eklendi (string veya number olabilir)
  role?: string; // ✅ Eklendi

  technologies: Technology[];
  contentBlocks: ContentBlock[];
  challenges?: string[];
  solutions?: string[];
  results?: ProjectResult[];
  testimonial?: ProjectTestimonial;
}

export interface ProjectsIndex {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
  };
  search: {
    placeholder: string;
    filterButton: string;
    showingResults: string;
    project: string;
    projects: string;
  };
  categories: {
    all: string;
    webDevelopment: string;
    mobileApp: string;
    design: string;
    aiMl: string;
    blockchain: string;
  };
  projectCard: {
    technologiesUsed: string;
  };
  noResults: {
    title: string;
    description: string;
    clearButton: string;
  };
  items: ProjectListItem[];
}
