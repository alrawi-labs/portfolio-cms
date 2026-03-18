import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "public", "assets", "images");
const MAX_SIZE   = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const { filename, base64 } = await req.json();

    if (!filename || !base64) {
      return NextResponse.json({ error: "filename ve base64 gerekli." }, { status: 400 });
    }

    // Sadece izin verilen uzantılar
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    if (!["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
      return NextResponse.json({ error: "Desteklenmeyen dosya türü." }, { status: 400 });
    }

    const buffer = Buffer.from(base64, "base64");
    if (buffer.byteLength > MAX_SIZE) {
      return NextResponse.json({ error: "Dosya 5 MB'dan büyük olamaz." }, { status: 400 });
    }

    // Benzersiz dosya adı: my-photo-<timestamp>.ext
    const safeName = `my-photo-${Date.now()}.${ext}`;
    const destDir  = join(UPLOAD_DIR);

    await mkdir(destDir, { recursive: true });
    await writeFile(join(destDir, safeName), buffer);

    return NextResponse.json({ path: `/assets/images/${safeName}` });
  } catch (e: unknown) {
    console.error("[personal-upload]", e);
    return NextResponse.json({ error: "Yükleme başarısız." }, { status: 500 });
  }
}