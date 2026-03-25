"use client";

import { useEffect, useState, useRef } from "react";

type Locale = { code: string; name: string; locale: string };

const INPUT: React.CSSProperties = {
  width: "100%", background: "#12121c", border: "1px solid #252535",
  borderRadius: 8, color: "#e2e2e8", fontSize: 13,
  padding: "10px 14px", outline: "none", boxSizing: "border-box",
  minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
};

function iFocus(e: React.FocusEvent<HTMLInputElement>) { e.target.style.borderColor = "#8750f7"; }
function iBlur (e: React.FocusEvent<HTMLInputElement>) { e.target.style.borderColor = "#252535"; }

function Toast({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
      background: ok ? "#052e16" : "#1f0a0a",
      border: `1px solid ${ok ? "#14532d" : "#3f1010"}`,
      color: ok ? "#4ade80" : "#f87171",
      borderRadius: 10, padding: "12px 20px", fontSize: 13, fontWeight: 500,
    }}>{text}</div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <div style={{ width: 2, height: 12, background: "#8750f7", borderRadius: 1, flexShrink: 0 }} />
        <label style={{ color: "#9898b8", fontSize: 12, fontWeight: 500 }}>{label}</label>
      </div>
      {children}
      {hint && <p style={{ color: "#3a3a50", fontSize: 11, marginTop: 5 }}>{hint}</p>}
    </div>
  );
}

const LOCALE_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  en: { border: "#a78bfa", bg: "#8750f720", text: "#a78bfa" },
  tr: { border: "#38bdf8", bg: "#38bdf820", text: "#38bdf8" },
  ar: { border: "#34d399", bg: "#34d39920", text: "#34d399" },
};
function getColor(code: string) {
  return LOCALE_COLORS[code] || { border: "#9898a8", bg: "#9898a820", text: "#9898a8" };
}

const CREATED_FILES = [
  "messages/{code}.json", "messages/certificates/{code}.json",
  "messages/languages/{code}.json", "messages/projects/index/{code}.json",
  "messages/resume/{code}.json", "messages/services/{code}.json",
  "messages/skills/{code}.json", "messages/vision/{code}.json",
  "messages/volunteering/{code}.json", "messages/projects/details/{code}/",
];

/* ══════════════════════════════════════════════════════════
   LANGUAGE PACK UPLOAD
══════════════════════════════════════════════════════════ */
function PackUploadSection({ onSuccess }: { onSuccess: () => void }) {
  const [dragging, setDragging]     = useState(false);
  const [file, setFile]             = useState<File | null>(null);
  const [preview, setPreview]       = useState<{ meta?: { code: string; name: string; locale: string; version?: string }; fileCount?: number } | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [uploading, setUploading]   = useState(false);
  const [result, setResult]         = useState<{
    ok: boolean; code?: string; name?: string; locale?: string;
    written?: number; errors?: number; files?: string[]; error?: string;
  } | null>(null);
  const [showFiles, setShowFiles]   = useState(false);
  const fileRef                     = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (!f.name.endsWith(".json")) {
      setParseError("Sadece .json dosyası kabul edilir.");
      return;
    }
    setFile(f);
    setResult(null);
    setParseError(null);

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (!parsed.meta || !parsed.files) {
          setParseError("Geçersiz format — { meta, files } yapısı bekleniyor.");
          setPreview(null);
          return;
        }
        setPreview({ meta: parsed.meta, fileCount: Object.keys(parsed.files).length });
      } catch {
        setParseError("JSON parse hatası — dosya geçerli bir JSON değil.");
        setPreview(null);
      }
    };
    reader.readAsText(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  async function upload() {
    if (!file) return;
    setUploading(true); setResult(null);
    try {
      const text = await file.text();
      const body = JSON.parse(text);
      const res  = await fetch("/api/admin/language-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setResult(data);
      if (data.ok) { setFile(null); setPreview(null); onSuccess(); }
    } catch (e: unknown) {
      setResult({ ok: false, error: (e as Error).message || "Yükleme hatası" });
    } finally { setUploading(false); }
  }

  return (
    <div style={{ background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "24px 26px" }}>

      {/* Başlık */}
      <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #1a1a28" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#8750f7", boxShadow: "0 0 6px #8750f780" }} />
          <div style={{ color: "#e2e2e8", fontSize: 15, fontWeight: 600 }}>Language Pack Yükle</div>
          <span style={{ background: "#8750f715", color: "#a78bfa", borderRadius: 5, padding: "1px 8px", fontSize: 11, fontWeight: 600 }}>
            .json
          </span>
        </div>
        <p style={{ color: "#3a3a50", fontSize: 12, marginLeft: 17 }}>
          GitHub'dan indirdiğin dil paketini buraya yükle — dosyalar otomatik yerleştirilir, middleware ve config güncellenir.
        </p>
      </div>

      {/* Sürükle-bırak alanı */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? "#8750f7" : file && !parseError ? "#4ade80" : parseError ? "#f87171" : "#252535"}`,
          borderRadius: 12, padding: "28px 24px",
          background: dragging ? "#8750f708" : file && !parseError ? "#4ade8008" : parseError ? "#f8717108" : "#0d0d14",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
          cursor: file ? "default" : "pointer",
          transition: "all 0.2s",
        }}
      >
        <input ref={fileRef} type="file" accept=".json" style={{ display: "none" }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

        {file && !parseError ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: "#4ade8015", border: "1px solid #4ade8040",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>🌍</div>

            {preview && (
              <div style={{ textAlign: "center" as const }}>
                <div style={{ color: "#4ade80", fontSize: 15, fontWeight: 700 }}>
                  {preview.meta?.name}
                  <span style={{ color: "#52525e", fontWeight: 400, fontSize: 13 }}> ({preview.meta?.code})</span>
                </div>
                <div style={{ color: "#52525e", fontSize: 12, marginTop: 4 }}>
                  {preview.meta?.locale} · {preview.fileCount} dosya
                  {preview.meta?.version && ` · v${preview.meta.version}`}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <span style={{
                background: "#4ade8015", color: "#4ade80",
                borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 600,
              }}>✓ Geçerli pack</span>
              <button type="button"
                onClick={e => { e.stopPropagation(); setFile(null); setPreview(null); setParseError(null); setResult(null); }}
                style={{
                  background: "transparent", border: "1px solid #252535", borderRadius: 6,
                  color: "#3a3a50", fontSize: 11, padding: "2px 10px", cursor: "pointer",
                }}>
                Değiştir
              </button>
            </div>
          </div>
        ) : parseError ? (
          <div style={{ textAlign: "center" as const }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⚠️</div>
            <div style={{ color: "#f87171", fontSize: 13, fontWeight: 500 }}>{parseError}</div>
            <button type="button"
              onClick={e => { e.stopPropagation(); setFile(null); setParseError(null); fileRef.current?.click(); }}
              style={{
                marginTop: 10, background: "transparent", border: "1px solid #252535",
                borderRadius: 8, color: "#6d6d8a", fontSize: 12, padding: "5px 14px", cursor: "pointer",
              }}>
              Başka dosya seç
            </button>
          </div>
        ) : (
          <>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: dragging ? "#8750f720" : "#12121c",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, transition: "all 0.2s",
            }}>
              {dragging ? "⬇" : "🌍"}
            </div>
            <div style={{ textAlign: "center" as const }}>
              <div style={{ color: dragging ? "#a78bfa" : "#9898b8", fontSize: 13, fontWeight: 500 }}>
                {dragging ? "Bırakın!" : "Language pack sürükleyin veya tıklayın"}
              </div>
              <div style={{ color: "#3a3a50", fontSize: 12, marginTop: 4 }}>
                tr-pack.json · ar-pack.json · fr-pack.json…
              </div>
            </div>
          </>
        )}
      </div>

      {/* Format bilgisi */}
      <div style={{
        marginTop: 12, background: "#0d0d14", border: "1px solid #1a1a28",
        borderRadius: 10, padding: "14px 16px",
      }}>
        <div style={{ color: "#3a3a50", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 10 }}>
          Pack Formatı (tr-pack.json)
        </div>
        <pre style={{
          background: "#12121c", border: "1px solid #1e1e2e",
          borderRadius: 8, padding: "12px 14px",
          color: "#6d6d8a", fontSize: 11, lineHeight: 1.7, margin: 0,
          overflow: "auto",
        }}>{`{
  "meta": {
    "code": "tr",
    "name": "Türkçe",
    "locale": "tr-TR",
    "direction": "ltr",
    "version": "1.0.0"
  },
  "files": {
    "messages/tr.json": { "home": "Ana Sayfa", ... },
    "messages/resume/tr.json": { "title": "Özgeçmiş", ... },
    "messages/services/tr.json": { "title": "Servisler", ... }
  }
}`}</pre>
      </div>

      {/* Sonuç */}
      {result && (
        <div style={{
          marginTop: 14,
          background: result.ok ? "#052e1680" : "#1f0a0a80",
          border: `1px solid ${result.ok ? "#14532d" : "#3f1010"}`,
          borderRadius: 12, padding: "16px 18px",
        }}>
          {result.ok ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>✅</span>
                <div>
                  <div style={{ color: "#4ade80", fontSize: 14, fontWeight: 600 }}>
                    {result.name} ({result.code}) başarıyla yüklendi!
                  </div>
                  <div style={{ color: "#52525e", fontSize: 12, marginTop: 2 }}>
                    {result.written} dosya yazıldı · middleware ve config güncellendi
                    {result.errors && result.errors > 0 && ` · ${result.errors} hata`}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 10 }}>
                <span style={{ background: "#4ade8015", color: "#4ade80", borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>
                  {result.locale}
                </span>
                <span style={{ background: "#8750f715", color: "#a78bfa", borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>
                  {result.written} dosya
                </span>
              </div>
              {result.files && result.files.length > 0 && (
                <div>
                  <button type="button" onClick={() => setShowFiles(s => !s)} style={{
                    background: "transparent", border: "none",
                    color: "#3a3a50", fontSize: 11, cursor: "pointer", padding: 0,
                  }}>
                    {showFiles ? "▲ Gizle" : `▼ ${result.files.length} dosyayı göster`}
                  </button>
                  {showFiles && (
                    <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap" as const, gap: 4 }}>
                      {result.files.map(f => (
                        <code key={f} style={{
                          background: "#12121c", color: "#6d6d8a",
                          borderRadius: 4, padding: "1px 7px", fontSize: 10,
                        }}>{f}</code>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div style={{ marginTop: 12, padding: "10px 14px", background: "#8750f710", borderRadius: 8, border: "1px solid #8750f730" }}>
                <p style={{ color: "#a78bfa", fontSize: 12 }}>
                  ⚡ Dev sunucusunu yeniden başlatın: <code style={{ color: "#e2e2e8" }}>Ctrl+C → npm run dev</code>
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>❌</span>
              <div style={{ color: "#f87171", fontSize: 13 }}>{result.error}</div>
            </div>
          )}
        </div>
      )}

      {/* Yükle butonu */}
      {file && !parseError && !result?.ok && (
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={upload} disabled={uploading} style={{
            background: uploading ? "#5b2fa8" : "#8750f7", color: "#fff",
            border: "none", borderRadius: 10, padding: "11px 28px",
            fontSize: 13, fontWeight: 600,
            cursor: uploading ? "not-allowed" : "pointer",
            opacity: uploading ? 0.7 : 1,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            {uploading ? (
              <>
                <span style={{
                  width: 14, height: 14,
                  border: "2px solid #ffffff40", borderTop: "2px solid #fff",
                  borderRadius: "50%", display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }} />
                Yükleniyor…
              </>
            ) : <>🌍 Pack'i Yükle & Uygula</>}
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ANA SAYFA
══════════════════════════════════════════════════════════ */
export default function LocalesPage() {
  const [locales, setLocales]     = useState<Locale[]>([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState<{ ok: boolean; text: string } | null>(null);
  const [adding, setAdding]       = useState(false);
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [newCode, setNewCode]     = useState("");
  const [newName, setNewName]     = useState("");
  const [newLocale, setNewLocale] = useState("");

  function showToast(ok: boolean, text: string) { setToast({ ok, text }); setTimeout(() => setToast(null), 4000); }

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/locales");
      const d   = await res.json();
      setLocales(Array.isArray(d) ? d : []);
    } catch { setLocales([]); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function addLocale() {
    const code   = newCode.trim().toLowerCase();
    const name   = newName.trim();
    const locale = newLocale.trim();
    if (!code || !name || !locale) { showToast(false, "Tüm alanlar zorunlu."); return; }
    if (!/^[a-z]{2,5}$/.test(code)) { showToast(false, "Kod sadece küçük harf içermeli (ör: tr, ar, de)."); return; }
    setAdding(true);
    try {
      const res  = await fetch("/api/admin/locales", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name, locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast(true, `'${code}' dili eklendi ✓`);
      setNewCode(""); setNewName(""); setNewLocale("");
      await load();
    } catch (e: unknown) { showToast(false, (e as Error).message || "Hata"); }
    finally { setAdding(false); }
  }

  async function deleteLocale(code: string) {
    if (!confirm(`'${code}' dilini silmek istediğinize emin misiniz?\nBu dile ait tüm JSON dosyaları silinecek.`)) return;
    setDeleting(code);
    try {
      const res  = await fetch("/api/admin/locales", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast(true, `'${code}' dili silindi.`);
      await load();
    } catch (e: unknown) { showToast(false, (e as Error).message || "Hata"); }
    finally { setDeleting(null); }
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      {toast && <Toast {...toast} />}

      {/* ── Sayfa başlığı ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 32 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 3, height: 24, background: "#8750f7", borderRadius: 2, flexShrink: 0 }} />
            <h1 style={{ color: "#e2e2e8", fontSize: 24, fontWeight: 700, lineHeight: 1 }}>Dil Yönetimi</h1>
          </div>
          <div style={{ marginLeft: 13, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
            <code style={{ color: "#6d6d8a", fontSize: 12, background: "#12121c", padding: "3px 8px", borderRadius: 5, border: "1px solid #1e1e2e" }}>
              data/systemLanguages.ts
            </code>
            <span style={{ color: "#52525e", fontSize: 12 }}>·</span>
            <span style={{ color: "#52525e", fontSize: 12 }}>{locales.length} dil</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ color: "#52525e", fontSize: 13, padding: "60px 0", textAlign: "center" as const }}>Yükleniyor…</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ── Language Pack Upload ── */}
          <PackUploadSection onSuccess={() => { load(); showToast(true, "Dil paketi yüklendi ✓"); }} />

          {/* ── Mevcut Diller ── */}
          <div style={{ background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "24px 26px" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #1a1a28",
            }}>
              <div>
                <div style={{ color: "#e2e2e8", fontSize: 15, fontWeight: 600, marginBottom: 3 }}>Aktif Diller</div>
                <div style={{ color: "#52525e", fontSize: 12 }}>Sitede görünen tüm diller</div>
              </div>
              <div style={{ background: "#8750f715", border: "1px solid #8750f730", borderRadius: 7, padding: "3px 10px" }}>
                <span style={{ color: "#a78bfa", fontSize: 11, fontWeight: 600 }}>{locales.length} dil</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {locales.map(l => {
                const c = getColor(l.code);
                return (
                  <div key={l.code} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "#0d0d14", border: "1px solid #1e1e2e",
                    borderLeft: `3px solid ${c.border}`,
                    borderRadius: 12, padding: "14px 18px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0, flex: 1 }}>
                      <span style={{
                        background: c.bg, color: c.text, flexShrink: 0,
                        borderRadius: 7, padding: "4px 12px",
                        fontSize: 13, fontFamily: "monospace", fontWeight: 700,
                        letterSpacing: "0.04em",
                      }}>{l.code}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          color: "#e2e2e8", fontSize: 14, fontWeight: 500, marginBottom: 2,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
                        }}>{l.name}</div>
                        <div style={{ color: "#52525e", fontSize: 12 }}>{l.locale}</div>
                      </div>
                      {l.code === "en" && (
                        <span style={{
                          background: "#052e16", color: "#4ade80", flexShrink: 0,
                          borderRadius: 5, padding: "1px 8px", fontSize: 11, fontWeight: 600,
                        }}>Varsayılan</span>
                      )}
                    </div>
                    {l.code !== "en" ? (
                      <button
                        onClick={() => deleteLocale(l.code)}
                        disabled={deleting === l.code}
                        style={{
                          background: "transparent", border: "1px solid #3f1010",
                          borderRadius: 8, color: "#f87171", fontSize: 12, padding: "6px 14px",
                          cursor: deleting === l.code ? "not-allowed" : "pointer",
                          opacity: deleting === l.code ? 0.5 : 1, transition: "all 0.15s",
                          flexShrink: 0, marginLeft: 12,
                        }}
                        onMouseEnter={e => { if (deleting !== l.code) { (e.currentTarget as HTMLElement).style.background = "#7f1d1d"; (e.currentTarget as HTMLElement).style.color = "#fca5a5"; } }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
                      >
                        {deleting === l.code ? "Siliniyor…" : "Sil"}
                      </button>
                    ) : (
                      <span style={{ color: "#3a3a50", fontSize: 12, flexShrink: 0, marginLeft: 12 }}>Silinemez</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Yeni Dil Ekle ── */}
          <div style={{ background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "24px 26px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #1a1a28",
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 6px #34d399" }} />
              <div style={{ color: "#e2e2e8", fontSize: 15, fontWeight: 600 }}>Manuel Dil Ekle</div>
              <span style={{ color: "#52525e", fontSize: 12 }}>— boş şablonla oluşturur</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
              <Field label="Dil Kodu" hint="Küçük harf, 2-5 karakter (ör: tr, ar, de)">
                <input value={newCode} onChange={e => setNewCode(e.target.value)}
                  style={INPUT} placeholder="tr" onFocus={iFocus} onBlur={iBlur}
                  onKeyDown={e => e.key === "Enter" && addLocale()} />
              </Field>
              <Field label="Dil Adı" hint="Görünen isim (ör: Türkçe, العربية)">
                <input value={newName} onChange={e => setNewName(e.target.value)}
                  style={INPUT} placeholder="Türkçe" onFocus={iFocus} onBlur={iBlur}
                  onKeyDown={e => e.key === "Enter" && addLocale()} />
              </Field>
              <Field label="Locale Kodu" hint="BCP-47 formatı (ör: tr-TR, ar-SA)">
                <input value={newLocale} onChange={e => setNewLocale(e.target.value)}
                  style={INPUT} placeholder="tr-TR" onFocus={iFocus} onBlur={iBlur}
                  onKeyDown={e => e.key === "Enter" && addLocale()} />
              </Field>
            </div>

            <button onClick={addLocale} disabled={adding} style={{
              background: adding ? "#065f46" : "#059669", border: "none",
              borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600,
              padding: "10px 22px", cursor: adding ? "not-allowed" : "pointer",
              opacity: adding ? 0.7 : 1, display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 16 }}>+</span>
              {adding ? "Oluşturuluyor…" : "Boş Dil Ekle"}
            </button>
          </div>

          {/* ── Bilgi notu ── */}
          <div style={{ background: "#0d0d14", border: "1px solid #1a1a28", borderRadius: 12, padding: "18px 22px" }}>
            <div style={{
              color: "#52525e", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 14,
            }}>
              Manuel Eklemede Oluşturulan Dosyalar
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 12 }}>
              {CREATED_FILES.map(f => (
                <span key={f} style={{
                  background: "#12121c", border: "1px solid #1e1e2e",
                  borderRadius: 5, padding: "3px 9px", fontSize: 11,
                  color: "#6d6d8a", fontFamily: "monospace",
                }}>{f}</span>
              ))}
            </div>
            <p style={{ color: "#3a3a50", fontSize: 12, lineHeight: 1.6 }}>
              Pack yüklerken dosyalar JSON'dan gelir. Manuel eklemede boş şablonla oluşturulur.
              <code style={{ color: "#52525e" }}> en</code> dili silinemez.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}