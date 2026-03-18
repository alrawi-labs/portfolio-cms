import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "public", "assets", "images", "projects");
const MAX_SIZE   = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const { filename, base64 } = await req.json();

    if (!filename || !base64) {
      return NextResponse.json({ error: "filename ve base64 gerekli." }, { status: 400 });
    }

    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    if (!["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
      return NextResponse.json({ error: "Desteklenmeyen dosya türü." }, { status: 400 });
    }

    const buffer = Buffer.from(base64, "base64");
    if (buffer.byteLength > MAX_SIZE) {
      return NextResponse.json({ error: "Dosya 5 MB'dan büyük olamaz." }, { status: 400 });
    }

    // Benzersiz dosya adı: project-<timestamp>.<ext>
    const safeName = `project-${Date.now()}.${ext}`;

    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(join(UPLOAD_DIR, safeName), buffer);

    return NextResponse.json({ path: `/assets/images/projects/${safeName}` });
  } catch (e: unknown) {
    console.error("[projects-upload]", e);
    return NextResponse.json({ error: "Yükleme başarısız." }, { status: 500 });
  }
}