import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "public", "assets", "images");
const MAX_SIZE   = 2 * 1024 * 1024; // 2 MB

export async function POST(req: NextRequest) {
  try {
    const { filename, base64 } = await req.json();

    if (!filename || !base64) {
      return NextResponse.json({ error: "filename ve base64 gerekli." }, { status: 400 });
    }

    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    if (!["svg", "png", "jpg", "jpeg", "webp"].includes(ext)) {
      return NextResponse.json({ error: "Desteklenmeyen dosya türü." }, { status: 400 });
    }

    const buffer = Buffer.from(base64, "base64");
    if (buffer.byteLength > MAX_SIZE) {
      return NextResponse.json({ error: "Dosya 2 MB'dan büyük olamaz." }, { status: 400 });
    }

    // logoLight.svg / logoLight.png vb. olarak kaydet
    const safeName = `logoLight.${ext}`;

    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(join(UPLOAD_DIR, safeName), buffer);

    return NextResponse.json({ path: `/assets/images/${safeName}` });
  } catch (e: unknown) {
    console.error("[logo-upload]", e);
    return NextResponse.json({ error: "Yükleme başarısız." }, { status: 500 });
  }
}