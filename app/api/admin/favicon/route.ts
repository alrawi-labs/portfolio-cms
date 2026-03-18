import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

const ROOT       = process.cwd();
const APP_DIR    = path.join(ROOT, "app");
const PUBLIC_DIR = path.join(ROOT, "public");

/*
  Next.js App Router favicon kuralları:
  - app/favicon.ico        → otomatik <link rel="icon">
  - app/icon.png           → otomatik <link rel="icon">
  - app/icon.svg           → otomatik <link rel="icon">
  - app/apple-icon.png     → otomatik <link rel="apple-touch-icon">

  public/ klasörüne de kopyalanır — doğrudan URL erişimi için.
*/
const SLOT_CONFIG: Record<string, { appFile: string; publicFile: string }> = {
  "favicon.ico":        { appFile: "favicon.ico",    publicFile: "favicon.ico"        },
  "favicon.png":        { appFile: "icon.png",       publicFile: "favicon.png"        },
  "apple-touch-icon.png": { appFile: "apple-icon.png", publicFile: "apple-touch-icon.png" },
  "icon.svg":           { appFile: "icon.svg",       publicFile: "icon.svg"           },
};

export async function GET() {
  try {
    const result: Record<string, boolean> = {};
    for (const [slot, config] of Object.entries(SLOT_CONFIG)) {
      try {
        await fs.access(path.join(APP_DIR, config.appFile));
        result[slot] = true;
      } catch {
        result[slot] = false;
      }
    }
    return NextResponse.json({ slots: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Okunamadı." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { filename, base64 } = await request.json();

    if (!filename || !base64) {
      return NextResponse.json({ error: "filename ve base64 zorunlu." }, { status: 400 });
    }

    const config = SLOT_CONFIG[filename];
    if (!config) {
      return NextResponse.json({ error: "Geçersiz dosya adı." }, { status: 400 });
    }

    const buffer = Buffer.from(base64, "base64");

    // app/ klasörüne yaz (Next.js metadata için)
    await fs.writeFile(path.join(APP_DIR, config.appFile), buffer);

    // public/ klasörüne de kopyala (doğrudan URL erişimi için)
    await fs.writeFile(path.join(PUBLIC_DIR, config.publicFile), buffer);

    return NextResponse.json({ success: true, filename, appFile: config.appFile });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Yüklenemedi." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { filename } = await request.json();
    const config = SLOT_CONFIG[filename];
    if (!config) return NextResponse.json({ error: "Geçersiz." }, { status: 400 });

    // Her iki yerden de sil
    for (const p of [
      path.join(APP_DIR, config.appFile),
      path.join(PUBLIC_DIR, config.publicFile),
    ]) {
      try { await fs.unlink(p); } catch { /* yok sayılabilir */ }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Silinemedi." }, { status: 500 });
  }
}