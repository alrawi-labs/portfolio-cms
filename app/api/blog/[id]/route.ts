import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const FILE = join(process.cwd(), "data", "blog.json");

type Params = Promise<{ id: string }>;

async function readPosts(): Promise<Record<string, unknown>[]> {
  if (!existsSync(FILE)) return [];
  return JSON.parse(await readFile(FILE, "utf-8"));
}

async function writePosts(posts: unknown[]) {
  await writeFile(FILE, JSON.stringify(posts, null, 2), "utf-8");
}

/* GET /api/admin/blog/[id] */
export async function GET(
  _: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const post = (await readPosts()).find((p) => p.id === id);
    if (!post) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
    return NextResponse.json(post);
  } catch (e) {
    console.error("[blog GET id]", e);
    return NextResponse.json({ error: "Okunamadı." }, { status: 500 });
  }
}

/* PUT /api/admin/blog/[id] */
export async function PUT(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body   = await req.json();
    const posts  = await readPosts();
    const idx    = posts.findIndex((p) => p.id === id);

    if (idx === -1)
      return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });

    posts[idx] = {
      ...posts[idx],
      ...body,
      id,                                                     // id asla değişmez
      updatedAt: new Date().toISOString().split("T")[0],
    };

    await writePosts(posts);
    return NextResponse.json(posts[idx]);
  } catch (e) {
    console.error("[blog PUT]", e);
    return NextResponse.json({ error: "Kaydedilemedi." }, { status: 500 });
  }
}

/* DELETE /api/admin/blog/[id] */
export async function DELETE(
  _: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id }   = await params;
    const posts    = await readPosts();
    const filtered = posts.filter((p) => p.id !== id);

    if (filtered.length === posts.length)
      return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });

    await writePosts(filtered);
    return NextResponse.json({ deleted: true });
  } catch (e) {
    console.error("[blog DELETE]", e);
    return NextResponse.json({ error: "Silinemedi." }, { status: 500 });
  }
}