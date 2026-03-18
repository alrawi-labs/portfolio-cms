// "use client";

// import React, { useState, useEffect } from "react";

// interface Project {
//   id: number;
//   title: string;
//   description: string;
//   category: string;
//   tags: string[];
//   image: string;
//   date: string;
//   link: string;
//   techLogos?: string[]; // Teknoloji logo URL'leri
// }

// // SVG Icon Components
// const SearchIcon = (props: any) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
//     <circle cx="11" cy="11" r="8"></circle>
//     <path d="m21 21-4.3-4.3"></path>
//   </svg>
// );

// const FilterIcon = (props: any) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
//     <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
//   </svg>
// );

// const ExternalLinkIcon = (props: any) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
//     <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
//     <polyline points="15 3 21 3 21 9"></polyline>
//     <line x1="10" x2="21" y1="14" y2="3"></line>
//   </svg>
// );

// const CalendarIcon = (props: any) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
//     <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
//     <line x1="16" x2="16" y1="2" y2="6"></line>
//     <line x1="8" x2="8" y1="2" y2="6"></line>
//     <line x1="3" x2="21" y1="10" y2="10"></line>
//   </svg>
// );

// const XIcon = (props: any) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
//     <path d="M18 6 6 18"></path>
//     <path d="m6 6 12 12"></path>
//   </svg>
// );

// const ProjectsPage: React.FC = () => {
//   const [isMobile, setIsMobile] = useState<boolean>(false);
//   const [selectedCategory, setSelectedCategory] = useState<string>("All");
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
//   const [showFilters, setShowFilters] = useState<boolean>(false);
//   const [mounted, setMounted] = useState<boolean>(false);

//   // Mobil kontrol
//   useEffect(() => {
//     setMounted(true);
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // Örnek projeler
//   const projects: Project[] = [
//     {
//       id: 1,
//       title: "E-Commerce Platform",
//       description: "Modern and scalable e-commerce solution with advanced features",
//       category: "Web Development",
//       tags: ["React", "Node.js", "MongoDB"],
//       techLogos: [
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
//       ],
//       image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
//       date: "2024-03",
//       link: "#"
//     },
//     {
//       id: 2,
//       title: "Mobile Banking App",
//       description: "Secure and user-friendly mobile banking application",
//       category: "Mobile App",
//       tags: ["React Native", "Firebase", "iOS"],
//       techLogos: [
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg"
//       ],
//       image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop",
//       date: "2024-02",
//       link: "#"
//     },
//     {
//       id: 3,
//       title: "Brand Identity Design",
//       description: "Complete brand identity package for tech startup",
//       category: "Design",
//       tags: ["Branding", "Logo", "UI/UX"],
//       techLogos: [
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg",
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg"
//       ],
//       image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop",
//       date: "2024-01",
//       link: "#"
//     },
//     {
//       id: 4,
//       title: "AI Chatbot Integration",
//       description: "Advanced AI-powered customer service chatbot",
//       category: "AI/ML",
//       tags: ["Python", "TensorFlow", "NLP"],
//       techLogos: [
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg"
//       ],
//       image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
//       date: "2023-12",
//       link: "#"
//     },
//     {
//       id: 5,
//       title: "Dashboard Analytics",
//       description: "Real-time analytics dashboard with data visualization",
//       category: "Web Development",
//       tags: ["Vue.js", "D3.js", "API"],
//       techLogos: [
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/d3js/d3js-original.svg",
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
//       ],
//       image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
//       date: "2023-11",
//       link: "#"
//     },
//     {
//       id: 6,
//       title: "Fitness Tracking App",
//       description: "Comprehensive fitness and health tracking application",
//       category: "Mobile App",
//       tags: ["Flutter", "Dart", "HealthKit"],
//       techLogos: [
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg"
//       ],
//       image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop",
//       date: "2023-10",
//       link: "#"
//     },
//     {
//       id: 7,
//       title: "Corporate Website",
//       description: "Professional corporate website with CMS integration",
//       category: "Web Development",
//       tags: ["WordPress", "PHP", "MySQL"],
//       techLogos: [
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
//       ],
//       image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
//       date: "2023-09",
//       link: "#"
//     },
//     {
//       id: 8,
//       title: "Social Media Campaign",
//       description: "Creative social media campaign for product launch",
//       category: "Design",
//       tags: ["Photoshop", "Illustrator", "Marketing"],
//       techLogos: [
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg",
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg",
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg"
//       ],
//       image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
//       date: "2023-08",
//       link: "#"
//     },
//     {
//       id: 9,
//       title: "Blockchain Platform",
//       description: "Decentralized application built on Ethereum",
//       category: "Blockchain",
//       tags: ["Solidity", "Web3", "Smart Contracts"],
//       techLogos: [
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidity/solidity-original.svg",
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
//         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ethereum/ethereum-original.svg"
//       ],
//       image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
//       date: "2023-07",
//       link: "#"
//     }
//   ];

//   const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];

//   // Filtreleme
//   useEffect(() => {
//     let filtered = projects;

//     if (selectedCategory !== "All") {
//       filtered = filtered.filter(p => p.category === selectedCategory);
//     }

//     if (searchQuery) {
//       filtered = filtered.filter(p =>
//         p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
//       );
//     }

//     setFilteredProjects(filtered);
//   }, [selectedCategory, searchQuery]);

//   return (
//     <div className="min-h-screen bg-dark-secondary text-text">
//       <style>{`
//         @keyframes gradient-shift {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }
        
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-20px); }
//         }
        
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
        
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes fadeInScale {
//           from {
//             opacity: 0;
//             transform: scale(0.8);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
        
//         @keyframes techFloat {
//           0%, 100% { 
//             transform: translateY(0) rotate(0deg);
//             opacity: 0;
//           }
//           10% {
//             opacity: 1;
//           }
//           50% {
//             transform: translateY(-120px) rotate(180deg);
//             opacity: 1;
//           }
//           90% {
//             opacity: 1;
//           }
//           100% {
//             transform: translateY(-240px) rotate(360deg);
//             opacity: 0;
//           }
//         }
        
//         @keyframes techPulse {
//           0%, 100% {
//             transform: scale(1) translateY(0);
//             filter: drop-shadow(0 0 0px rgba(135, 80, 247, 0));
//           }
//           50% {
//             transform: scale(1.05) translateY(-5px);
//             filter: drop-shadow(0 10px 30px rgba(135, 80, 247, 0.6));
//           }
//         }
        
//         @keyframes techSlideIn {
//           0% {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes techGlow {
//           0%, 100% {
//             box-shadow: 0 8px 32px rgba(135, 80, 247, 0.15);
//           }
//           50% {
//             box-shadow: 0 8px 32px rgba(135, 80, 247, 0.35);
//           }
//         }
        
//         @keyframes scaleX {
//           from { transform: scaleX(0); }
//           to { transform: scaleX(1); }
//         }
        
//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             max-height: 0;
//           }
//           to {
//             opacity: 1;
//             max-height: 500px;
//           }
//         }
        
//         .animate-fade-in {
//           animation: fadeIn 0.6s ease-out forwards;
//         }
        
//         .animate-fade-in-up {
//           animation: fadeInUp 0.6s ease-out forwards;
//         }
        
//         .animate-fade-in-scale {
//           animation: fadeInScale 0.5s ease-out forwards;
//         }
        
//         .animate-scale-x {
//           animation: scaleX 0.8s ease-out forwards;
//         }
        
//         .animate-slide-down {
//           animation: slideDown 0.3s ease-out forwards;
//         }
        
//         .gradient-text {
//           background: linear-gradient(260deg, #2a1454, #8750f7, #c3a6ff, #8750f7, #2a1454);
//           background-size: 300% 300%;
//           -webkit-background-clip: text;
//           background-clip: text;
//           -webkit-text-fill-color: transparent;
//           animation: gradient-shift 4s ease infinite;
//         }
        
//         .project-card {
//           transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
//           position: relative;
//         }
        
//         .project-card::before {
//           content: '';
//           position: absolute;
//           inset: -2px;
//           border-radius: 1rem;
//           padding: 2px;
//           background: linear-gradient(135deg, #8750f7, #c3a6ff, #8750f7);
//           -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
//           -webkit-mask-composite: xor;
//           mask-composite: exclude;
//           opacity: 0;
//           transition: opacity 0.5s ease;
//         }
        
//         .project-card:hover::before {
//           opacity: 1;
//         }
        
//         .project-card:hover {
//           transform: translateY(-12px) scale(1.02);
//           box-shadow: 0 30px 60px rgba(135, 80, 247, 0.3);
//         }
        
//         .project-card:hover .bottom-accent {
//           transform: scaleX(1);
//         }
        
//         .bottom-accent {
//           transform: scaleX(0);
//           transform-origin: left;
//           transition: transform 0.4s ease;
//         }
        
//         .image-overlay {
//           background: linear-gradient(180deg, transparent 0%, rgba(42, 20, 84, 0.95) 100%);
//         }
        
//         .shine-effect {
//           position: absolute;
//           top: 0;
//           left: -100%;
//           width: 100%;
//           height: 100%;
//           background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
//           transition: left 0.7s ease;
//         }
        
//         .project-card:hover .shine-effect {
//           left: 100%;
//         }
        
//         .tech-logo-float {
//           position: absolute;
//           pointer-events: none;
//           z-index: 10;
//           animation: techFloat 3s ease-out forwards;
//         }
        
//         .tech-logos-container {
//           position: absolute;
//           inset: 0;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 2rem;
//           opacity: 0;
//           transition: opacity 0.5s ease;
//           pointer-events: none;
//           z-index: 15;
//           background: rgba(14, 7, 20, 0.85);
//           backdrop-filter: blur(8px);
//         }
        
//         .project-card:hover .tech-logos-container {
//           opacity: 1;
//         }
        
//         .tech-logo-static {
//           width: 80px;
//           height: 80px;
//           padding: 16px;
//           background: rgba(255, 255, 255, 0.95);
//           border: 3px solid rgba(135, 80, 247, 0.8);
//           border-radius: 20px;
//           backdrop-filter: blur(10px);
//           animation: techPulse 2s ease-in-out infinite;
//           box-shadow: 0 8px 32px rgba(135, 80, 247, 0.4);
//         }
        
//         .tech-logo-static:nth-child(1) {
//           animation-delay: 0s;
//         }
        
//         .tech-logo-static:nth-child(2) {
//           animation-delay: 0.3s;
//         }
        
//         .tech-logo-static:nth-child(3) {
//           animation-delay: 0.6s;
//         }
        
//         .tech-logo-wrapper {
//           position: relative;
//           animation: techSlideIn 0.5s ease-out forwards;
//           opacity: 0;
//         }
        
//         .tech-logo-wrapper:nth-child(1) {
//           animation-delay: 0.1s;
//         }
        
//         .tech-logo-wrapper:nth-child(2) {
//           animation-delay: 0.2s;
//         }
        
//         .tech-logo-wrapper:nth-child(3) {
//           animation-delay: 0.3s;
//         }
        
//         .tech-logo-inner {
//           position: relative;
//           width: 100px;
//           height: 100px;
//           padding: 20px;
//           background: rgba(255, 255, 255, 0.98);
//           border-radius: 20px;
//           transition: all 0.4s ease;
//           box-shadow: 0 8px 32px rgba(135, 80, 247, 0.15);
//         }
        
//         .tech-logo-inner:hover {
//           transform: translateY(-8px);
//           box-shadow: 0 16px 48px rgba(135, 80, 247, 0.3);
//         }
        
//         .tech-logo-inner::before {
//           content: '';
//           position: absolute;
//           inset: -2px;
//           border-radius: 22px;
//           padding: 2px;
//           background: linear-gradient(135deg, #8750f7, #c3a6ff);
//           -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
//           -webkit-mask-composite: xor;
//           mask-composite: exclude;
//           opacity: 0;
//           transition: opacity 0.4s ease;
//         }
        
//         .tech-logo-inner:hover::before {
//           opacity: 1;
//         }
        
//         .filter-glass {
//           background: rgba(14, 7, 20, 0.8);
//           backdrop-filter: blur(20px);
//           -webkit-backdrop-filter: blur(20px);
//         }
        
//         .delay-100 { animation-delay: 0.1s; }
//         .delay-200 { animation-delay: 0.2s; }
//         .delay-300 { animation-delay: 0.3s; }
//         .delay-400 { animation-delay: 0.4s; }
//         .delay-500 { animation-delay: 0.5s; }
//       `}</style>

//       {/* Hero Section */}
//       <section className="relative pt-24 pb-12 px-4 sm:px-8 overflow-hidden">
//         {/* Background Effects */}
//         <div className="absolute inset-0 opacity-40">
//           <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[120px] animate-pulse" />
//           <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/30 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }} />
//           <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-primary-300/20 rounded-full blur-[150px]" style={{ animation: 'float 8s ease-in-out infinite' }} />
//         </div>

//         <div className="relative max-w-7xl mx-auto">
//           <div className={`text-center mb-12 ${mounted && !isMobile ? 'animate-fade-in-up' : ''}`}>
//             <div className={mounted && !isMobile ? 'animate-fade-in-scale delay-200' : ''}>
//               <div className="inline-block mb-4">
//                 <span className="text-primary text-sm font-semibold tracking-[0.3em] uppercase">Portfolio</span>
//               </div>
//               <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight">
//                 <span className="gradient-text">Our Projects</span>
//               </h1>
//               <p className="text-text-muted text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed">
//                 Explore our portfolio of innovative solutions and creative works that drive success
//               </p>
//             </div>

//             <div className={`h-1 w-32 bg-gradient-to-r from-primary via-purple-500 to-primary mx-auto mt-8 rounded-full ${mounted && !isMobile ? 'animate-scale-x delay-400' : ''}`} />
//           </div>

//           {/* Search and Filter Bar */}
//           <div className={`filter-glass border border-border-subtle/50 rounded-3xl p-6 sm:p-8 shadow-2xl ${mounted && !isMobile ? 'animate-fade-in-up delay-300' : ''}`}>
//             <div className="flex flex-col lg:flex-row gap-4 items-center">
//               {/* Search Box */}
//               <div className="relative flex-1 w-full">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
//                   <SearchIcon />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search projects, tags, categories..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full bg-dark-secondary/80 border border-border-subtle rounded-xl pl-12 pr-4 py-3 text-text focus:outline-none focus:border-primary/50 transition-colors"
//                 />
//                 {searchQuery && (
//                   <button
//                     onClick={() => setSearchQuery("")}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
//                   >
//                     <XIcon />
//                   </button>
//                 )}
//               </div>

//               {/* Filter Toggle (Mobile) */}
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="lg:hidden flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-6 py-3 rounded-xl transition-colors w-full sm:w-auto justify-center"
//               >
//                 <FilterIcon />
//                 <span>Filters</span>
//               </button>

//               {/* Category Filters (Desktop) */}
//               <div className="hidden lg:flex items-center gap-2 flex-wrap">
//                 {categories.map((category) => (
//                   <button
//                     key={category}
//                     onClick={() => setSelectedCategory(category)}
//                     className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                       selectedCategory === category
//                         ? "bg-primary text-white"
//                         : "bg-dark-secondary/80 text-text-muted hover:bg-dark-secondary hover:text-text"
//                     }`}
//                   >
//                     {category}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Mobile Filters */}
//             {showFilters && (
//               <div className="lg:hidden animate-slide-down overflow-hidden">
//                 <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border-subtle">
//                   {categories.map((category) => (
//                     <button
//                       key={category}
//                       onClick={() => {
//                         setSelectedCategory(category);
//                         setShowFilters(false);
//                       }}
//                       className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                         selectedCategory === category
//                           ? "bg-primary text-white"
//                           : "bg-dark-secondary/80 text-text-muted hover:bg-dark-secondary hover:text-text"
//                       }`}
//                     >
//                       {category}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Results Count */}
//           <div className={`mt-6 text-text-muted text-sm ${mounted && !isMobile ? 'animate-fade-in delay-500' : ''}`}>
//             Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
//           </div>
//         </div>
//       </section>

//       {/* Projects Grid */}
//       <section className="px-4 sm:px-8 pb-20">
//         <div className="max-w-7xl mx-auto">
//           {filteredProjects.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
//               {filteredProjects.map((project, index) => (
//                 <div
//                   key={project.id}
//                   className={`project-card group relative bg-dark/90 rounded-2xl overflow-hidden border border-border-subtle/30 backdrop-blur-sm ${
//                     mounted && !isMobile ? 'animate-fade-in-up' : ''
//                   }`}
//                   style={{ animationDelay: `${index * 0.08}s` }}
//                 >
//                   {/* Image */}
//                   <div className="relative h-72 overflow-hidden">
//                     <div className="shine-effect" />
//                     <img
//                       src={project.image}
//                       alt={project.title}
//                       className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
//                     />
//                     <div className="absolute inset-0 image-overlay group-hover:opacity-90" />
                    
//                     {/* Tech Logos Overlay - Hover'da görünür */}
//                     {project.techLogos && project.techLogos.length > 0 && (
//                       <div className="absolute inset-0 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
//                         {/* Minimalist Overlay */}
//                         <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/80 to-dark/60 backdrop-blur-sm" />
                        
//                         {/* Tech Logos */}
//                         <div className="relative z-10 flex items-center justify-center gap-6">
//                           {project.techLogos.map((logo, idx) => (
//                             <div 
//                               key={idx} 
//                               className="tech-logo-wrapper"
//                             >
//                               <div className="tech-logo-inner">
//                                 <img 
//                                   src={logo} 
//                                   alt={project.tags[idx]}
//                                   className="w-full h-full object-contain"
//                                   onError={(e) => {
//                                     e.currentTarget.src = 'https://via.placeholder.com/80?text=Tech';
//                                   }}
//                                 />
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
                    
//                     {/* Category Badge */}
//                     <div className="absolute top-4 left-4 z-30">
//                       <span className="bg-gradient-to-r from-primary to-purple-400 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
//                         {project.category}
//                       </span>
//                     </div>

//                     {/* Link Button */}
//                     <a
//                       href={project.link}
//                       className="absolute top-4 right-4 z-30 bg-primary/80 backdrop-blur-md p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:scale-110 shadow-lg"
//                     >
//                       <ExternalLinkIcon />
//                     </a>
//                   </div>

//                   {/* Content */}
//                   <div className="p-7">
//                     <div className="flex items-center gap-2 text-primary/80 text-xs mb-4 font-medium">
//                       <CalendarIcon />
//                       <span>{new Date(project.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
//                     </div>

//                     <h3 className="text-2xl font-bold text-text mb-3 group-hover:text-primary transition-colors leading-tight">
//                       {project.title}
//                     </h3>

//                     <p className="text-text-muted text-sm sm:text-base mb-5 leading-relaxed overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
//                       {project.description}
//                     </p>

//                     {/* Tags */}
//                     <div className="flex gap-2 flex-wrap">
//                       {project.tags.map((tag, idx) => (
//                         <span
//                           key={idx}
//                           className="text-xs font-medium bg-primary/10 text-primary border border-primary/30 px-3 py-1.5 rounded-lg transition-all hover:bg-primary/20"
//                         >
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Bottom Accent */}
//                   <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-purple-400 to-primary bottom-accent" />
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className={`text-center py-20 ${mounted ? 'animate-fade-in-scale' : ''}`}>
//               <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
//                 <SearchIcon width="32" height="32" />
//               </div>
//               <h3 className="text-2xl font-bold text-text mb-2">No projects found</h3>
//               <p className="text-text-muted mb-6">Try adjusting your search or filter criteria</p>
//               <button
//                 onClick={() => {
//                   setSearchQuery("");
//                   setSelectedCategory("All");
//                 }}
//                 className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium transition-colors"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default ProjectsPage;

