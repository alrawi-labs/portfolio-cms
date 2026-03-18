import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { getLocale } from "../../_helpers";

function projectsDir(locale: string) {
  return path.join(process.cwd(), "messages", "projects", "details", locale);
}

async function findFile(locale: string, id: number) {
  const dir   = projectsDir(locale);
  const files = await fs.readdir(dir);
  const found = files.find(f => f.startsWith(`${id}-`) && f.endsWith(".json"));
  return found ? path.join(dir, found) : null;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const filePath = await findFile(getLocale(req), Number(id));
    if (!filePath) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
    return NextResponse.json(JSON.parse(await fs.readFile(filePath, "utf-8")));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Yüklenemedi." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numId    = Number(id);
    const locale   = getLocale(req);
    const filePath = await findFile(locale, numId);
    if (!filePath) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });

    const body    = await req.json();
    const current = JSON.parse(await fs.readFile(filePath, "utf-8"));
    const updated = { ...current, ...body, id: numId };
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf-8");
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const filePath = await findFile(getLocale(req), Number(id));
    if (!filePath) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
    await fs.unlink(filePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Silinemedi." }, { status: 500 });
  }
}