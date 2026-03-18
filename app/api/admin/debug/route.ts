import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET() {
  const root = process.cwd();
  const results: Record<string, unknown> = { root };

  const pathsToCheck = [
    "messages/services/en.json",
    "messages/certificates/en.json",
    "messages/languages/en.json",
    "messages/volunteering/en.json",
    "messages/en.json",
  ];

  for (const p of pathsToCheck) {
    const full = path.join(root, p);
    try {
      await fs.access(full);
      results[p] = "✓ exists";
    } catch {
      results[p] = "✗ NOT FOUND";
    }
  }

  // messages klasörü içeriğini listele
  try {
    const msgDir = path.join(root, "messages");
    const files = await fs.readdir(msgDir);
    results["messages/ contents"] = files;
  } catch (e) {
    results["messages/ contents"] = String(e);
  }

  return NextResponse.json(results, {
    headers: { "Content-Type": "application/json" },
  });
}