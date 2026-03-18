import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "assets", "images", "Certificates");

export async function POST(request: NextRequest) {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const { filename, base64 } = await request.json();
    if (!filename || !base64) {
      return NextResponse.json({ error: "filename ve base64 zorunlu." }, { status: 400 });
    }

    // Güvenlik: sadece resim uzantıları
    const ext = path.extname(filename).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) {
      return NextResponse.json({ error: "Sadece resim dosyaları kabul edilir." }, { status: 400 });
    }

    // Dosya adını güvenli hale getir
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = path.join(UPLOAD_DIR, safeName);

    const buffer = Buffer.from(base64, "base64");
    await fs.writeFile(filePath, buffer);

    const publicPath = `/assets/images/Certificates/${safeName}`;
    return NextResponse.json({ success: true, path: publicPath });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Yüklenemedi." }, { status: 500 });
  }
}