const fs = require('fs');
const path = require('path');

// Kaynak dosya
const sourceFile = './messages/projects/index/en.json';
const data = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

// Hedef klasörler
const indexDir = './public/data/projects/index';
const detailsDir = './public/data/projects/details/en';

// Klasörleri oluştur
[indexDir, detailsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('🚀 Proje ayırma işlemi başlıyor...\n');

// 1. Index dosyası için sadece özet bilgileri al
const indexItems = data.items.map(project => ({
  id: project.id,
  isFeatured: project.isFeatured,
  title: project.title,
  subtitle: project.subtitle,
  description: project.description,
  category: project.category,
  tags: project.tags,
  image: project.image,
  techLogos: project.techLogos,
  icon: project.icon,
  date: project.date
}));

const indexData = {
  hero: data.hero,
  search: data.search,
  categories: data.categories,
  projectCard: data.projectCard,
  noResults: data.noResults,
  featuredProjects: data.featuredProjects,
  items: indexItems
};

// Index dosyasını kaydet
fs.writeFileSync(
  path.join(indexDir, 'en.json'),
  JSON.stringify(indexData, null, 2)
);
console.log('✅ Index dosyası oluşturuldu: en.json');
console.log(`   - ${indexItems.length} proje özeti`);
console.log(`   - Dosya boyutu: ${(JSON.stringify(indexData).length / 1024).toFixed(2)} KB\n`);

// 2. Her proje için detay dosyası oluştur
let totalSize = 0;
data.items.forEach(project => {
  const detailData = {
    id: project.id,
    title: project.title,
    subtitle: project.subtitle,
    description: project.description,
    longDescription: project.longDescription,
    category: project.category,
    tags: project.tags,
    image: project.image,
    techLogos: project.techLogos,
    icon: project.icon,
    
    // Metadata
    date: project.date,
    client: project.client,
    duration: project.duration,
    teamSize: project.teamSize,
    role: project.role,
    
    // Links
    demoLink: project.demoLink,
    githubLink: project.githubLink,
    
    // Detaylı içerik
    technologies: project.technologies,
    contentBlocks: project.contentBlocks,
    challenges: project.challenges,
    solutions: project.solutions,
    results: project.results,
    testimonial: project.testimonial,
    
    // UI Metinleri (sadece detay sayfasında kullanılanlar)
    detail: data.detail
  };

  const fileName = `${project.id}-${project.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.json`;
  const filePath = path.join(detailsDir, fileName);
  
  fs.writeFileSync(filePath, JSON.stringify(detailData, null, 2));
  
  const fileSize = JSON.stringify(detailData).length;
  totalSize += fileSize;
  
  console.log(`✅ ${fileName}`);
  console.log(`   - Boyut: ${(fileSize / 1024).toFixed(2)} KB`);
  console.log(`   - Content Blocks: ${detailData.contentBlocks?.length || 0}`);
});

console.log('\n' + '='.repeat(50));
console.log('✨ Ayırma işlemi tamamlandı!');
console.log('='.repeat(50));
console.log(`\n📊 İstatistikler:`);
console.log(`   - Toplam proje: ${data.items.length}`);
console.log(`   - Index boyutu: ${(JSON.stringify(indexData).length / 1024).toFixed(2)} KB`);
console.log(`   - Toplam detay boyutu: ${(totalSize / 1024).toFixed(2)} KB`);
console.log(`   - Ortalama detay boyutu: ${(totalSize / data.items.length / 1024).toFixed(2)} KB`);
console.log(`\n📁 Oluşturulan dosyalar:`);
console.log(`   - ${indexDir}/en.json`);
console.log(`   - ${detailsDir}/*.json (${data.items.length} dosya)`);
console.log(`\n🎯 Sonraki adımlar:`);
console.log(`   1. Türkçe çevirileri oluştur (tr.json ve details/tr/)`);
console.log(`   2. Arapça çevirileri oluştur (ar.json ve details/ar/)`);
console.log(`   3. Görselleri /public/data/projects/media/ klasörüne taşı`);
console.log(`   4. Component'leri yeni yapıya göre güncelle\n`);