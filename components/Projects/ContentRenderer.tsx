// "use client";

// import React, { useState } from 'react';
// import Image from 'next/image';
// import {
//   ContentBlock,
//   ContentType,
//   TextContent,
//   ImageContent,
//   VideoContent,
//   ImageGalleryContent,
//   CodeContent,
//   QuoteContent
// } from '@/data/projectsData';

// interface ContentRendererProps {
//   blocks: ContentBlock[];
// }

// const ContentRenderer: React.FC<ContentRendererProps> = ({ blocks }) => {
//   // Blokları sıraya göre sırala
//   const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

//   return (
//     <div className="max-w-4xl mx-auto space-y-12">
//       {sortedBlocks.map((block, index) => (
//         <div key={index} className="animate-fade-in">
//           {renderBlock(block)}
//         </div>
//       ))}
//     </div>
//   );
// };

// // Her içerik tipini render et
// function renderBlock(block: ContentBlock) {
//   switch (block.type) {
//     case ContentType.TEXT:
//       return <TextBlock data={block.data as TextContent} />;
//     case ContentType.IMAGE:
//       return <ImageBlock data={block.data as ImageContent} />;
//     case ContentType.VIDEO:
//       return <VideoBlock data={block.data as VideoContent} />;
//     case ContentType.IMAGE_GALLERY:
//       return <ImageGalleryBlock data={block.data as ImageGalleryContent} />;
//     case ContentType.CODE:
//       return <CodeBlock data={block.data as CodeContent} />;
//     case ContentType.QUOTE:
//       return <QuoteBlock data={block.data as QuoteContent} />;
//     default:
//       return null;
//   }
// }

// // TEXT BLOCK
// const TextBlock: React.FC<{ data: TextContent }> = ({ data }) => {
//   const columns = data.layout === 'two-column' ? 'md:columns-2 gap-8' : '';
  
//   return (
//     <div className="prose prose-invert max-w-none">
//       {data.heading && (
//         <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
//           {data.heading}
//         </h2>
//       )}
//       {data.subheading && (
//         <h3 className="text-xl md:text-2xl text-primary mb-6">
//           {data.subheading}
//         </h3>
//       )}
//       <div 
//         className={`text-text-muted leading-relaxed text-lg whitespace-pre-wrap ${columns}`}
//         dangerouslySetInnerHTML={{ __html: formatText(data.content) }}
//       />
//     </div>
//   );
// };

// // IMAGE BLOCK
// const ImageBlock: React.FC<{ data: ImageContent }> = ({ data }) => {
//   const widthClass = {
//     small: 'max-w-md',
//     medium: 'max-w-2xl',
//     large: 'max-w-4xl',
//     full: 'max-w-full'
//   }[data.width || 'large'];

//   const positionClass = {
//     left: 'mr-auto',
//     center: 'mx-auto',
//     right: 'ml-auto'
//   }[data.position || 'center'];

//   return (
//     <figure className={`${widthClass} ${positionClass}`}>
//       <div className="relative rounded-2xl overflow-hidden border border-border-subtle group">
//         <img
//           src={data.src}
//           alt={data.alt}
//           className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//       </div>
//       {data.caption && (
//         <figcaption className="mt-4 text-center text-text-muted text-sm italic">
//           {data.caption}
//         </figcaption>
//       )}
//     </figure>
//   );
// };

// // VIDEO BLOCK
// const VideoBlock: React.FC<{ data: VideoContent }> = ({ data }) => {
//   const aspectRatioClass = {
//     '16:9': 'aspect-video',
//     '4:3': 'aspect-[4/3]',
//     '1:1': 'aspect-square',
//     '21:9': 'aspect-[21/9]'
//   }[data.aspectRatio || '16:9'];

//   const getEmbedUrl = () => {
//     if (data.youtubeId) {
//       return `https://www.youtube.com/embed/${data.youtubeId}`;
//     }
//     if (data.vimeoId) {
//       return `https://player.vimeo.com/video/${data.vimeoId}`;
//     }
//     return data.src;
//   };

//   return (
//     <figure className="max-w-4xl mx-auto">
//       <div className={`relative ${aspectRatioClass} rounded-2xl overflow-hidden border border-border-subtle bg-dark-secondary`}>
//         {data.youtubeId || data.vimeoId ? (
//           <iframe
//             src={getEmbedUrl()}
//             className="absolute inset-0 w-full h-full"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//           />
//         ) : (
//           <video
//             src={data.src}
//             controls
//             className="absolute inset-0 w-full h-full object-cover"
//             poster={data.thumbnail}
//           />
//         )}
//       </div>
//       {data.caption && (
//         <figcaption className="mt-4 text-center text-text-muted text-sm italic">
//           {data.caption}
//         </figcaption>
//       )}
//     </figure>
//   );
// };

// // IMAGE GALLERY BLOCK
// const ImageGalleryBlock: React.FC<{ data: ImageGalleryContent }> = ({ data }) => {
//   const [selectedImage, setSelectedImage] = useState<number | null>(null);

//   const layoutClass = {
//     grid: 'grid grid-cols-2 md:grid-cols-3 gap-4',
//     masonry: 'columns-2 md:columns-3 gap-4 space-y-4',
//     slider: 'flex overflow-x-auto gap-4 snap-x snap-mandatory'
//   }[data.layout || 'grid'];

//   return (
//     <div className={layoutClass}>
//       {data.images.map((img, idx) => (
//         <div
//           key={idx}
//           className="relative group cursor-pointer"
//           onClick={() => setSelectedImage(idx)}
//         >
//           <div className="relative rounded-xl overflow-hidden border border-border-subtle">
//             <img
//               src={img.src}
//               alt={img.alt}
//               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//             />
//             <div className="absolute inset-0 bg-dark/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//               <span className="text-white text-sm font-medium">Click to enlarge</span>
//             </div>
//           </div>
//           {img.caption && (
//             <p className="mt-2 text-text-muted text-xs">{img.caption}</p>
//           )}
//         </div>
//       ))}

//       {/* Lightbox */}
//       {selectedImage !== null && (
//         <div
//           className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
//           onClick={() => setSelectedImage(null)}
//         >
//           <img
//             src={data.images[selectedImage].src}
//             alt={data.images[selectedImage].alt}
//             className="max-w-full max-h-full object-contain rounded-xl"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// // CODE BLOCK
// const CodeBlock: React.FC<{ data: CodeContent }> = ({ data }) => {
//   const [copied, setCopied] = useState(false);

//   const copyCode = () => {
//     navigator.clipboard.writeText(data.code);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <figure className="max-w-4xl mx-auto">
//       <div className="relative bg-dark-secondary/50 rounded-xl border border-border-subtle overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-3 border-b border-border-subtle">
//           <span className="text-sm text-text-muted font-mono">{data.language}</span>
//           <button
//             onClick={copyCode}
//             className="text-sm text-primary hover:text-primary/80 transition-colors"
//           >
//             {copied ? 'Copied!' : 'Copy'}
//           </button>
//         </div>
        
//         {/* Code */}
//         <pre className="p-6 overflow-x-auto">
//           <code className="text-sm font-mono text-text leading-relaxed">
//             {data.code}
//           </code>
//         </pre>
//       </div>
//       {data.caption && (
//         <figcaption className="mt-4 text-center text-text-muted text-sm italic">
//           {data.caption}
//         </figcaption>
//       )}
//     </figure>
//   );
// };

// // QUOTE BLOCK
// const QuoteBlock: React.FC<{ data: QuoteContent }> = ({ data }) => {
//   return (
//     <blockquote className="relative bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl p-8 md:p-12 border border-primary/20">
//       {/* Quote icon */}
//       <svg
//         className="w-12 h-12 text-primary/30 mb-6"
//         fill="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
//         <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
//       </svg>

//       <p className="text-xl md:text-2xl text-text mb-8 leading-relaxed italic">
//         "{data.text}"
//       </p>

//       {data.author && (
//         <div className="flex items-center gap-4">
//           {data.avatar && (
//             <img
//               src={data.avatar}
//               alt={data.author}
//               className="w-14 h-14 rounded-full border-2 border-primary/50"
//             />
//           )}
//           <div>
//             <div className="font-bold text-lg">{data.author}</div>
//             {data.role && <div className="text-text-muted text-sm">{data.role}</div>}
//           </div>
//         </div>
//       )}
//     </blockquote>
//   );
// };

// // Yardımcı fonksiyon: Markdown-benzeri formatlamayı HTML'e çevir
// function formatText(text: string): string {
//   return text
//     .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') // Bold
//     .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
//     .replace(/^• (.+)$/gm, '<li class="ml-6">$1</li>') // Bullet points
//     .replace(/\n\n/g, '</p><p class="mb-4">') // Paragraphs
//     .replace(/^(.+)$/gm, '<p class="mb-4">$1</p>'); // Wrap in paragraphs
// }

// export default ContentRenderer;