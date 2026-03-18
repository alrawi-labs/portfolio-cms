import { NextRequest, NextResponse } from "next/server";
import { getLocale, msgPath, readJson, writeJson } from "../_helpers";

function filePath(locale: string) {
  return msgPath(`messages/skills/${locale}.json`);
}

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json(await readJson(filePath(getLocale(req))));
  } catch { return NextResponse.json({ error: "Okunamadı." }, { status: 500 }); }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await writeJson(filePath(getLocale(req)), body);
    return NextResponse.json(body);
  } catch { return NextResponse.json({ error: "Kaydedilemedi." }, { status: 500 }); }
}