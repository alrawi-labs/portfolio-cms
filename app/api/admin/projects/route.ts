import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { getLocale } from "../_helpers";

function projectsDir(locale: string) {
  return path.join(process.cwd(), "messages", "projects", "details", locale);
}

export async function GET(req: NextRequest) {
  const locale = getLocale(req);
  const dir    = projectsDir(locale);
  try {
    await fs.mkdir(dir, { recursive: true });
    const files    = (await fs.readdir(dir)).filter(f => f.endsWith(".json")).sort();
    const projects = await Promise.all(
      files.map(async file => {
        const content = await fs.readFile(path.join(dir, file), "utf-8");
        return { ...JSON.parse(content), _file: file };
      })
    );
    return NextResponse.json(projects);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Projeler yüklenemedi." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const locale = getLocale(req);
  const dir    = projectsDir(locale);
  try {
    await fs.mkdir(dir, { recursive: true });
    const body  = await req.json();
    const files = (await fs.readdir(dir)).filter(f => f.endsWith(".json"));

    // Yeni ID: mevcut max + 1
    let maxId = 0;
    for (const file of files) {
      const data = JSON.parse(await fs.readFile(path.join(dir, file), "utf-8"));
      if (data.id > maxId) maxId = data.id;
    }

    const newId    = maxId + 1;
    const slug     = (body.title || "untitled").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const fileName = `${newId}-${slug}.json`;

    const newProject = {
      id: newId,
      title: body.title || "", subtitle: body.subtitle || "",
      isFeatured: body.isFeatured || false,
      description: body.description || "", longDescription: body.longDescription || "",
      category: body.category || "", tags: body.tags || [],
      image: body.image || "", techLogos: body.techLogos || [],
      date: body.date || "", duration: body.duration || "",
      teamSize: body.teamSize || 1, role: body.role || "",
      demoLink: body.demoLink || null, githubLink: body.githubLink || null,
      technologies: body.technologies || [], contentBlocks: body.contentBlocks || [],
      challenges: body.challenges || [], solutions: body.solutions || [],
      results: body.results || [], testimonial: body.testimonial || null,
    };

    await fs.writeFile(path.join(dir, fileName), JSON.stringify(newProject, null, 2), "utf-8");
    return NextResponse.json({ ...newProject, _file: fileName }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Proje oluşturulamadı." }, { status: 500 });
  }
}