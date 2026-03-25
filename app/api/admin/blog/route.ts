import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const FILE = join(process.cwd(), "data", "blog.json");

async function readPosts(): Promise<Record<string, unknown>[]> {
  if (!existsSync(FILE)) return [];
  const raw = await readFile(FILE, "utf-8");
  return JSON.parse(raw);
}

async function writePosts(posts: unknown[]): Promise<void> {
  const dir = join(process.cwd(), "data");
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  await writeFile(FILE, JSON.stringify(posts, null, 2), "utf-8");
}

/* GET /api/admin/blog */
export async function GET() {
  try {
    return NextResponse.json(await readPosts());
  } catch (e) {
    console.error("[blog GET]", e);
    return NextResponse.json({ error: "Okunamadı." }, { status: 500 });
  }
}

/* POST /api/admin/blog */
export async function POST(req: NextRequest) {
  try {
    const body  = await req.json();
    const posts = await readPosts();

    const id   = Date.now().toString();
    const slug = (body.slug?.trim() as string | undefined)
      || (body.title as string | undefined)
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      || id;

    const newPost = {
      isFeatured:    false,
      contentBlocks: [],
      tags:          [],
      ...body,
      id,
      slug,
      publishedAt: (body.publishedAt as string) || new Date().toISOString().split("T")[0],
    };

    await writePosts([...posts, newPost]);
    return NextResponse.json(newPost, { status: 201 });
  } catch (e) {
    console.error("[blog POST]", e);
    return NextResponse.json({ error: "Oluşturulamadı." }, { status: 500 });
  }
}