import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

const PERSONAL_FILE = path.join(process.cwd(), "data", "personal.ts");
const STATS_FILE    = path.join(process.cwd(), "data", "stats.ts");

function extractObject(content: string): Record<string, unknown> {
  const match = content.match(/=\s*(\{[\s\S]*?\});?\s*$/);
  if (!match) return {};
  try { return JSON.parse(match[1].replace(/(\w+):/g, '"$1":').replace(/'/g, '"')); }
  catch { return {}; }
}

export async function GET() {
  try {
    const [personalContent, statsContent] = await Promise.all([
      fs.readFile(PERSONAL_FILE, "utf-8"),
      fs.readFile(STATS_FILE,    "utf-8"),
    ]);
    return NextResponse.json({
      personal: extractObject(personalContent),
      stats:    extractObject(statsContent),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Okunamadı." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { personal, stats } = await request.json();

    const personalContent = `export const personalData = ${JSON.stringify(personal, null, 2)};\n`;
    const statsContent    = `export const statsData = ${JSON.stringify(stats, null, 2)};\n`;

    await Promise.all([
      fs.writeFile(PERSONAL_FILE, personalContent, "utf-8"),
      fs.writeFile(STATS_FILE,    statsContent,    "utf-8"),
    ]);

    return NextResponse.json({ personal, stats });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Kaydedilemedi." }, { status: 500 });
  }
}