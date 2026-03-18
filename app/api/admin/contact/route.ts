import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

const FILE = path.join(process.cwd(), "data", "contacts.json");

export async function GET() {
  try {
    const content = await fs.readFile(FILE, "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error("GET /api/admin/contact error:", error);
    return NextResponse.json({ error: "Okunamadı." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    await fs.writeFile(FILE, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json(body);
  } catch (error) {
    console.error("PUT /api/admin/contact error:", error);
    return NextResponse.json({ error: "Kaydedilemedi." }, { status: 500 });
  }
}