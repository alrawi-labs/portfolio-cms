import { NextRequest, NextResponse } from "next/server";
import { getLocale, msgPath, readJson, writeJson } from "../_helpers";

function filePath(locale: string) {
  return msgPath(`messages/services/${locale}.json`);
}

export async function GET(req: NextRequest) {
  try {
    const data = await readJson(filePath(getLocale(req)));
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: "Okunamadı." }, { status: 500 }); }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await writeJson(filePath(getLocale(req)), body);
    return NextResponse.json(body);
  } catch { return NextResponse.json({ error: "Kaydedilemedi." }, { status: 500 }); }
}