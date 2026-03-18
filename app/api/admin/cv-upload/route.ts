import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "public", "assets", "docs");
const MAX_SIZE   = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  try {
    const { filename, base64 } = await req.json();

    if (!filename || !base64) {
      return NextResponse.json({ error: "filename ve base64 gerekli." }, { status: 400 });
    }

    // Sadece izin verilen uzantılar
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    if (!["pdf", "doc", "docx"].includes(ext)) {
      return NextResponse.json({ error: "Sadece PDF, DOC veya DOCX yüklenebilir." }, { status: 400 });
    }

    const buffer = Buffer.from(base64, "base64");
    if (buffer.byteLength > MAX_SIZE) {
      return NextResponse.json({ error: "Dosya 10 MB'dan büyük olamaz." }, { status: 400 });
    }

    // Her zaman cv.pdf (veya cv.docx) olarak kaydet — kolayca referans verilebilsin
    const safeName = `cv.${ext}`;

    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(join(UPLOAD_DIR, safeName), buffer);

    return NextResponse.json({ path: `/assets/docs/${safeName}` });
  } catch (e: unknown) {
    console.error("[cv-upload]", e);
    return NextResponse.json({ error: "Yükleme başarısız." }, { status: 500 });
  }
}