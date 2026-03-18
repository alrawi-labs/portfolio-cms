import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

const ROOT     = process.cwd();
const SYS_FILE = path.join(ROOT, "data", "systemLanguages.ts");

/* ── Mevcut dilleri oku ── */
async function getLocales(): Promise<{ code: string; name: string; locale: string }[]> {
  try {
    const content = await fs.readFile(SYS_FILE, "utf-8");
    const match = content.match(/\[\s*([\s\S]*?)\s*\]\s*as const/);
    if (!match) return [];
    const items = match[1].matchAll(/\{\s*code:\s*['"](\w+)['"]\s*,\s*name:\s*['"]([^'"]+)['"]\s*,\s*locale:\s*['"]([^'"]+)['"]\s*\}/g);
    return Array.from(items).map(m => ({ code: m[1], name: m[2], locale: m[3] }));
  } catch { return []; }
}

/* ── systemLanguages.ts dosyasını yeniden yaz ── */
async function writeLocales(locales: { code: string; name: string; locale: string }[]) {
  const entries = locales.map(l =>
    `  { code: '${l.code}', name: '${l.name}', locale: '${l.locale}' }`
  ).join(",\n");

  // Orijinal dosyadaki ek export satırlarını koru
  const content = `// data/systemLanguages.ts
export const systemLanguages = [
${entries}
] as const;

export const systemLanguageCodes = systemLanguages.map(lang => lang.code) as readonly string[];

export type SystemLanguageCode = typeof systemLanguages[number]['code'];

// Locale map'i otomatik oluştur
export const localeMap = Object.fromEntries(
  systemLanguages.map(lang => [lang.code, lang.locale])
);
`;
  await fs.writeFile(SYS_FILE, content, "utf-8");
}

/* ── Boş JSON şablonları ── */
function buildEmptyFiles(code: string): Record<string, unknown> {
  return {
    [`messages/${code}.json`]: {
      header: { home:"",stats:"",services:"",work:"",projects:"",resume:"",about:"",skills:"",languages:"",volunteering:"",certificates:"",contact:"",startAProject:"" },
      home: {
        hero:  { greeting:"",name:"",titleLine1:"",titleLine2:"",description:"",downloadCV:"",viewWork:"",follow:"" },
        stats: { title:"",subtitle:"",yearsLabel:"",yearsDesc:"",projectsLabel:"",projectsDesc:"",clientsLabel:"",clientsDesc:"",awardsLabel:"",awardsDesc:"",trustedBy:"",yearsExp:"",projects:"",k:"" },
      },
      contact: {
        title:"",subtitle:"",badge:"",
        form:{ name:{label:"",placeholder:""},email:{label:"",placeholder:""},subject:{label:"",placeholder:""},message:{label:"",placeholder:""},submit:"",sending:"" },
        success:{title:"",message:""},
        info:{ email:{title:""},phone:{title:""},location:{title:"" }},
        social:{ title:"" },
      },
      loading:{text:""},
      backToProjects:"",technologiesUsed:"",projectLink:"",liveDemo:"",sourceCode:"",challenges:"",solutions:"",duration:"",teamSize:"",resultsImpact:"",videoNotSupported:"",client:"",technologies:"",date:"",
    },
    [`messages/certificates/${code}.json`]: {
      title:"",subtitle:"",certificatesCount:"",viewCertificate:"",of:"",
      categories:{ ai:"",dataScience:"",cybersecurity:"",php:"",cloudComputing:"",programming:"",devops:"",softSkills:"",network:"",effectiveCommunication:"",trainingTrainers:"" },
      certificates:[],
    },
    [`messages/languages/${code}.json`]: {
      title:"",subtitle:"",
      levels:{ native:"",professional:"",intermediate:"" },
      languages:[],
    },
    [`messages/projects/index/${code}.json`]: {
      hero:{ badge:"",title:"",subtitle:"" },
      search:{ placeholder:"",filterButton:"",showingResults:"",project:"",projects:"" },
      categories:{ all:"",webDevelopment:"",mobileApp:"",design:"",aiMl:"",blockchain:"" },
      projectCard:{ technologiesUsed:"" },
      noResults:{ title:"",description:"",clearButton:"" },
      featuredProjects:{ title:"",subtitle:"",viewProject:"",allProjects:{ title:"",description:"",button:"",stats:{ projects:"",technologies:"",years:"" } } },
    },
    [`messages/resume/${code}.json`]: {
      title:"",subtitle:"",
      tabs:{ experience:"",education:"" },
      experience:[],education:[],
    },
    [`messages/services/${code}.json`]: { title:"",subtitle:"",items:[] },
    [`messages/skills/${code}.json`]: {
      title:"",subtitle:"",
      categories:{ programmingLanguages:"",frameworks:"",concepts:"",databases:"" },
      skills:{ programmingLanguages:[],frameworks:[],concepts:[],databases:[] },
    },
    [`messages/vision/${code}.json`]: { statements:[] },
    [`messages/volunteering/${code}.json`]: { title:"",volunteering:[] },
  };
}

/* ════════════ HANDLERS ════════════ */
export async function GET() {
  try {
    const locales = await getLocales();
    return NextResponse.json(locales);
  } catch { return NextResponse.json({ error: "Okunamadı." }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  try {
    const { code, name, locale } = await request.json();
    if (!code || !name || !locale) return NextResponse.json({ error: "code, name ve locale zorunlu." }, { status: 400 });

    const existing = await getLocales();
    if (existing.find(l => l.code === code)) {
      return NextResponse.json({ error: `'${code}' dili zaten mevcut.` }, { status: 409 });
    }

    // Tüm JSON dosyalarını oluştur
    const files = buildEmptyFiles(code);
    for (const [relPath, content] of Object.entries(files)) {
      const fullPath = path.join(ROOT, relPath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      // Zaten varsa üzerine yazma
      try { await fs.access(fullPath); }
      catch { await fs.writeFile(fullPath, JSON.stringify(content, null, 2), "utf-8"); }
    }

    // Proje detayları klasörünü oluştur
    await fs.mkdir(path.join(ROOT, "messages", "projects", "details", code), { recursive: true });

    // systemLanguages.ts güncelle
    await writeLocales([...existing, { code, name, locale }]);

    return NextResponse.json({ code, name, locale }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Dil oluşturulamadı." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code) return NextResponse.json({ error: "code zorunlu." }, { status: 400 });
    if (code === "en") return NextResponse.json({ error: "Varsayılan dil silinemez." }, { status: 400 });

    const existing = await getLocales();
    const updated  = existing.filter(l => l.code !== code);
    await writeLocales(updated);

    // JSON dosyalarını sil (hata olsa bile devam et)
    const filesToDelete = [
      `messages/${code}.json`,
      `messages/certificates/${code}.json`,
      `messages/languages/${code}.json`,
      `messages/projects/index/${code}.json`,
      `messages/resume/${code}.json`,
      `messages/services/${code}.json`,
      `messages/skills/${code}.json`,
      `messages/vision/${code}.json`,
      `messages/volunteering/${code}.json`,
    ];
    for (const f of filesToDelete) {
      try { await fs.unlink(path.join(ROOT, f)); } catch { /* yok sayılabilir */ }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Silinemedi." }, { status: 500 });
  }
}