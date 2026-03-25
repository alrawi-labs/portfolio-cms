import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const ROOT = process.cwd();

type PackMeta = {
  code: string;
  name: string;
  locale: string;
  direction?: "ltr" | "rtl";
  version?: string;
  author?: string;
};

type LanguagePack = {
  meta: PackMeta;
  files: Record<string, unknown>;
};

/* ── middleware.ts güncelle ── */
async function updateMiddleware(code: string) {
  const mwPath = path.join(ROOT, "middleware.ts");
  try {
    let content = await fs.readFile(mwPath, "utf-8");
    const localesRegex = /(locales\s*:\s*\[)([^\]]*?)(\])/;
    const match = content.match(localesRegex);
    if (match) {
      const existing = match[2]
        .split(",")
        .map(s => s.trim().replace(/['"]/g, ""))
        .filter(Boolean);
      if (!existing.includes(code)) {
        existing.push(code);
        const newLocales = existing.map(l => `"${l}"`).join(", ");
        content = content.replace(localesRegex, `$1${newLocales}$3`);
        await fs.writeFile(mwPath, content, "utf-8");
      }
    }
  } catch { /* middleware.ts yoksa atla */ }
}

/* ── i18n/routing.ts veya i18n.ts güncelle ── */
async function updateI18nConfig(code: string) {
  const candidates = [
    "i18n/routing.ts", "i18n.ts", "i18n.config.ts",
    "src/i18n.ts", "src/i18n/routing.ts", "lib/i18n.ts",
  ];
  for (const candidate of candidates) {
    const filePath = path.join(ROOT, candidate);
    try {
      let content = await fs.readFile(filePath, "utf-8");
      const localesRegex = /(locales\s*:\s*\[)([^\]]*?)(\])/;
      const match = content.match(localesRegex);
      if (match) {
        const existing = match[2]
          .split(",")
          .map(s => s.trim().replace(/['"]/g, ""))
          .filter(Boolean);
        if (!existing.includes(code)) {
          existing.push(code);
          const newLocales = existing.map(l => `"${l}"`).join(", ");
          content = content.replace(localesRegex, `$1${newLocales}$3`);
          await fs.writeFile(filePath, content, "utf-8");
        }
      }
      break;
    } catch { continue; }
  }
}

/* ── systemLanguages.ts güncelle ── */
async function updateSystemLanguages(code: string, name: string, locale: string) {
  const candidates = ["data/systemLanguages.ts", "src/data/systemLanguages.ts"];
  for (const candidate of candidates) {
    const filePath = path.join(ROOT, candidate);
    try {
      let content = await fs.readFile(filePath, "utf-8");

      // Zaten var mı kontrol et
      if (content.includes(`code: "${code}"`) || content.includes(`code: '${code}'`)) break;

      // systemLanguages dizisinin kapanışını bul: "] as const"
      // Yeni girişi ondan ÖNCE ekle
      const entry = `  { code: "${code}", name: "${name}", locale: "${locale}" }`;

      // Son girişten sonraki ] as const; satırını bul
      const closingRegex = /([ \t]*\{[^}]+\})([\s\n]*\]\s*as\s*const)/;
      if (closingRegex.test(content)) {
        content = content.replace(
          closingRegex,
          `$1,\n${entry}$2`
        );
        await fs.writeFile(filePath, content, "utf-8");
      }
      break;
    } catch { continue; }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as LanguagePack;

    if (!body.meta || !body.files) {
      return NextResponse.json(
        { error: "Geçersiz format. { meta, files } yapısı bekleniyor." },
        { status: 400 }
      );
    }

    const { code, name, locale } = body.meta;

    if (!code || !name || !locale) {
      return NextResponse.json(
        { error: "meta.code, meta.name ve meta.locale zorunludur." },
        { status: 400 }
      );
    }

    if (!/^[a-z]{2,5}$/.test(code)) {
      return NextResponse.json(
        { error: `Geçersiz dil kodu: "${code}". Sadece küçük harf, 2-5 karakter olmalı.` },
        { status: 400 }
      );
    }

    const written: string[] = [];
    const errors: string[]  = [];

    for (const [relativePath, fileContent] of Object.entries(body.files)) {
      // Sadece messages/ altına izin ver
      if (!relativePath.startsWith("messages/") && relativePath !== "messages") {
        errors.push(`${relativePath} (izin verilmeyen yol)`);
        continue;
      }

      // Boş obje → sadece klasör oluştur (örn: messages/projects/details/tr)
      if (
        typeof fileContent === "object" &&
        fileContent !== null &&
        Object.keys(fileContent).length === 0
      ) {
        const dirPath = path.join(ROOT, relativePath);
        try {
          await fs.mkdir(dirPath, { recursive: true });
          written.push(relativePath + "/ (klasör)");
        } catch {
          errors.push(relativePath);
        }
        continue;
      }

      // .json uzantısı yoksa /{code}.json ekle
      let finalPath = relativePath;
      if (!relativePath.endsWith(".json")) {
        finalPath = `${relativePath}/${code}.json`;
      }

      // Path traversal önleme
      const targetPath = path.join(ROOT, finalPath);
      if (!targetPath.startsWith(path.join(ROOT, "messages"))) {
        errors.push(`${finalPath} (güvenlik ihlali)`);
        continue;
      }

      try {
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.writeFile(
          targetPath,
          JSON.stringify(fileContent, null, 2),
          "utf-8"
        );
        written.push(finalPath);
      } catch {
        errors.push(finalPath);
      }
    }

    if (written.length === 0) {
      return NextResponse.json(
        { error: "Hiçbir dosya yazılamadı." },
        { status: 400 }
      );
    }

    await Promise.allSettled([
      updateMiddleware(code),
      updateI18nConfig(code),
      updateSystemLanguages(code, name, locale),
    ]);

    return NextResponse.json({
      ok: true,
      code,
      name,
      locale,
      direction: body.meta.direction ?? "ltr",
      version:   body.meta.version,
      written:   written.length,
      errors:    errors.length,
      files:     written,
    });

  } catch (e: unknown) {
    return NextResponse.json(
      { error: (e as Error).message || "Sunucu hatası." },
      { status: 500 }
    );
  }
}