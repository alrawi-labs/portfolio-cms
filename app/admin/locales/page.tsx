"use client";

import { useEffect, useState } from "react";

type Locale = { code: string; name: string; locale: string };

const INPUT: React.CSSProperties = {
  width: "100%", background: "#12121c", border: "1px solid #252535",
  borderRadius: 8, color: "#e2e2e8", fontSize: 13,
  padding: "10px 14px", outline: "none", boxSizing: "border-box",
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
  "messages/{code}.json",
  "messages/certificates/{code}.json",
  "messages/languages/{code}.json",
  "messages/projects/index/{code}.json",
  "messages/resume/{code}.json",
  "messages/services/{code}.json",
  "messages/skills/{code}.json",
  "messages/vision/{code}.json",
  "messages/volunteering/{code}.json",
  "messages/projects/details/{code}/",
];

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
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 3, height: 24, background: "#8750f7", borderRadius: 2, flexShrink: 0 }} />
            <h1 style={{ color: "#e2e2e8", fontSize: 24, fontWeight: 700, lineHeight: 1 }}>Dil Yönetimi</h1>
          </div>
          <div style={{ marginLeft: 13, display: "flex", alignItems: "center", gap: 10 }}>
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
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{
                        background: c.bg, color: c.text,
                        borderRadius: 7, padding: "4px 12px",
                        fontSize: 13, fontFamily: "monospace", fontWeight: 700,
                        letterSpacing: "0.04em",
                      }}>{l.code}</span>
                      <div>
                        <div style={{ color: "#e2e2e8", fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{l.name}</div>
                        <div style={{ color: "#52525e", fontSize: 12 }}>{l.locale}</div>
                      </div>
                      {l.code === "en" && (
                        <span style={{
                          background: "#052e16", color: "#4ade80",
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
                        }}
                        onMouseEnter={e => { if (deleting !== l.code) { (e.currentTarget as HTMLElement).style.background = "#7f1d1d"; (e.currentTarget as HTMLElement).style.color = "#fca5a5"; } }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
                      >
                        {deleting === l.code ? "Siliniyor…" : "Sil"}
                      </button>
                    ) : (
                      <span style={{ color: "#3a3a50", fontSize: 12 }}>Silinemez</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Yeni Dil Ekle ── */}
          <div style={{
            background: "#10101a",
            border: "1px solid #1e1e2e",
            borderRadius: 16, padding: "24px 26px",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #1a1a28",
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 6px #34d399" }} />
              <div style={{ color: "#e2e2e8", fontSize: 15, fontWeight: 600 }}>Yeni Dil Ekle</div>
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
              {adding ? "Oluşturuluyor…" : "Dil Ekle"}
            </button>
          </div>

          {/* ── Otomatik oluşturulan dosyalar ── */}
          <div style={{ background: "#0d0d14", border: "1px solid #1a1a28", borderRadius: 12, padding: "18px 22px" }}>
            <div style={{
              color: "#52525e", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 14,
            }}>
              Otomatik Oluşturulan Dosyalar
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 12 }}>
              {CREATED_FILES.map(f => (
                <span key={f} style={{
                  background: "#12121c", border: "1px solid #1e1e2e",
                  borderRadius: 5, padding: "3px 9px", fontSize: 11,
                  color: "#6d6d8a", fontFamily: "monospace",
                }}>
                  {f}
                </span>
              ))}
            </div>
            <p style={{ color: "#3a3a50", fontSize: 12, lineHeight: 1.6 }}>
              Dil eklendiğinde yukarıdaki dosyalar boş şablonla oluşturulur.
              Dil silindiğinde tüm bu dosyalar kalıcı olarak silinir.
              <code style={{ color: "#52525e" }}> en</code> dili silinemez.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}