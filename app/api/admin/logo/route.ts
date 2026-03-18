import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

const FILE = path.join(process.cwd(), "data", "techIcons.ts");

export async function GET() {
  try {
    const content = await fs.readFile(FILE, "utf-8");
    const match = content.match(/SiteLogo\s*=\s*["']([^"']+)["']/);
    return NextResponse.json({ logo: match?.[1] || "" });
  } catch { return NextResponse.json({ error: "Okunamadı." }, { status: 500 }); }
}

export async function PUT(request: NextRequest) {
  try {
    const { logo } = await request.json();
    const content = await fs.readFile(FILE, "utf-8");
    const updated = content.replace(
      /SiteLogo\s*=\s*["'][^"']*["']/,
      `SiteLogo = "${logo}"`
    );
    await fs.writeFile(FILE, updated, "utf-8");
    return NextResponse.json({ logo });
  } catch { return NextResponse.json({ error: "Kaydedilemedi." }, { status: 500 }); }
}