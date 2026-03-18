import path from "path";
import { promises as fs } from "fs";
import { NextRequest } from "next/server";

const ROOT = process.cwd();

export function getLocale(request: NextRequest): string {
  const locale = new URL(request.url).searchParams.get("locale") || "en";
  // Güvenlik: sadece harf ve tire
  return locale.replace(/[^a-z-]/gi, "").toLowerCase() || "en";
}

export function msgPath(relative: string): string {
  return path.join(ROOT, relative);
}

export async function readJson(filePath: string): Promise<unknown> {
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content);
}

export async function writeJson(filePath: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}