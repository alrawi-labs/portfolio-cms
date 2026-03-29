import { NextRequest } from "next/server";

const OWNER  = process.env.GITHUB_OWNER!;
const REPO   = process.env.GITHUB_REPO!;
const BRANCH = process.env.GITHUB_BRANCH || "main";
const TOKEN  = process.env.GITHUB_TOKEN!;

const BASE = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

export function getLocale(request: NextRequest): string {
  const locale = new URL(request.url).searchParams.get("locale") || "en";
  return locale.replace(/[^a-z-]/gi, "").toLowerCase() || "en";
}

export function msgPath(relative: string): string {
  return relative; // Artık path.join gerekmez, GitHub API relative path kullanır
}

export async function readJson(filePath: string): Promise<unknown> {
  const res = await fetch(`${BASE}/${filePath}?ref=${BRANCH}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub okuma hatası: ${filePath}`);
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return JSON.parse(content);
}

async function getSha(filePath: string): Promise<string> {
  const res = await fetch(`${BASE}/${filePath}?ref=${BRANCH}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`SHA alınamadı: ${filePath}`);
  const data = await res.json();
  return data.sha;
}

export async function writeJson(filePath: string, data: unknown): Promise<void> {
  const sha     = await getSha(filePath);
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

  const res = await fetch(`${BASE}/${filePath}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `cms: update ${filePath}`,
      content,
      sha,
      branch: BRANCH,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "GitHub yazma hatası");
  }
}