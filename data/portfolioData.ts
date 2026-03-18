import {
  Service,
  Portfolio,
  Skill,
  Testimonial,
  Experience,
  Education,
  Global,
} from "./types";

export const services: Service[] = [
  {
    id: 1,
    title: "Web Development",
    description:
      "Conducting qualitative and quantitative research to understand user needs, behaviors, and pain points. Utilizing methods...",
  },
  {
    id: 2,
    title: "UI/UX Design",
    description:
      "Conducting qualitative and quantitative research to understand user needs, behaviors, and pain points. Utilizing methods...",
  },
  {
    id: 3,
    title: "Content Writing",
    description:
      "Conducting qualitative and quantitative research to understand user needs, behaviors, and pain points. Utilizing methods...",
  },
  {
    id: 4,
    title: "Digital Marketing",
    description:
      "Conducting qualitative and quantitative research to understand user needs, behaviors, and pain points. Utilizing methods...",
  },
];

export const portfolios: Portfolio[] = [
  {
    id: 1,
    title: "Mochnix",
    category: "branding",
    image:
      "https://gerold.themejunction.net/wp-content/uploads/2024/05/portfolio-1.jpg",
    description: "Project was about precision and information....",
  },
  {
    id: 2,
    title: "Sebastian",
    category: "apps",
    image:
      "https://gerold.themejunction.net/wp-content/uploads/2024/05/portfolio-2.jpg",
    description: "Project was about precision and information....",
  },
  {
    id: 3,
    title: "New Age",
    category: "ux-ui",
    image:
      "https://gerold.themejunction.net/wp-content/uploads/2024/05/portfolio-4.jpg",
    description: "Project was about precision and information....",
  },
  {
    id: 4,
    title: "Deloitte",
    category: "branding",
    image:
      "https://gerold.themejunction.net/wp-content/uploads/2024/05/portfolio-3.jpg",
    description: "Project was about precision and information....",
  },
];

export const skills: Skill[] = [
  {
    name: "Figma",
    percentage: 92,
    icon: "https://gerold.themejunction.net/wp-content/uploads/2024/05/figma.png",
  },
  {
    name: "Sketch",
    percentage: 80,
    icon: "https://gerold.themejunction.net/wp-content/uploads/2024/05/sketch.png",
  },
  {
    name: "XD",
    percentage: 85,
    icon: "https://gerold.themejunction.net/wp-content/uploads/2024/05/xd.png",
  },
  {
    name: "WordPress",
    percentage: 99,
    icon: "https://gerold.themejunction.net/wp-content/uploads/2024/05/wp.png",
  },
  {
    name: "React",
    percentage: 89,
    icon: "https://gerold.themejunction.net/wp-content/uploads/2024/05/react.png",
  },
  {
    name: "JavaScript",
    percentage: 93,
    icon: "https://gerold.themejunction.net/wp-content/uploads/2024/05/js.png",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Brandon Fraser",
    role: "Senior Software Dev, Cosmic Sport",
    quote:
      "Taylor is a professional Designer he really helps my business by providing value to my business.",
    image:
      "https://gerold.themejunction.net/wp-content/uploads/2024/05/testi-1.jpg",
  },
  {
    id: 2,
    name: "Tim Bailey",
    role: "SEO Specialist, Theme Junction",
    quote:
      "Taylor is a professional Designer he really helps my business by providing value to my business.",
    image:
      "https://gerold.themejunction.net/wp-content/uploads/2024/05/testi-2.jpg",
  },
];

export const experiences: Experience[] = [
  {
    period: "2022 - Present",
    title: "Lead Developer",
    company: "Blockdots, London",
  },
  {
    period: "2021 - 2022",
    title: "Full Stack Web Developer",
    company: "Parsons, The New School",
  },
  {
    period: "2020 - 2021",
    title: "UI Designer",
    company: "House of Life, Leeds",
  },
  {
    period: "2018 - 2020",
    title: "Junior Graphics Designer",
    company: "Theme Junction, Bursa",
  },
];

export const educations: Education[] = [
  {
    period: "2020 - 2023",
    title: "Programming course",
    institute: "Harverd University",
  },
  {
    period: "2016 - 2020",
    title: "Graphic design course",
    institute: "University of Denmark",
  },
  {
    period: "2012 - 2015",
    title: "Web design course",
    institute: "University of California",
  },
  {
    period: "2010 - 2011",
    title: "Design & Technology",
    institute: "Parsons, The New School",
  },
];

export const global: Global = {
  LightLogo: `<svg width="24" height="24" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <path 
    d="M 499 43C 446 43 397 71 370 118C 370 118 20 724 20 724C -7 770 -7 827 20 874C 47 920 96 949 150 949C 150 949 850 949 850 949C 904 949 953 920 980 874C 1007 827 1007 770 980 724C 980 724 630 118 630 118C 604 73 558 45 507 43C 504 43 502 43 499 43C 499 43 499 43 499 43M 0,0" 
    fill="white"
  />
</svg>
`,
  DarkLogo: `<svg width="24" height="24" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path d="M 499 43C 446 43 397 71 370 118C 370 118 20 724 20 724C -7 770 -7 827 20 874C 47 920 96 949 150 949C 150 949 850 949 850 949C 904 949 953 920 980 874C 1007 827 1007 770 980 724C 980 724 630 118 630 118C 604 73 558 45 507 43C 504 43 502 43 499 43C 499 43 499 43 499 43M 0,0"/></svg>`,
};
