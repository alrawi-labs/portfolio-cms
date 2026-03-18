"use client";

import { useEffect, useState, useRef } from "react";
import { useLocaleContext } from "../_components/LocaleContext";

type VolItem = { role: string; organization: string; event: string; location: string; date: string; description: string; image: string };
type VolData  = { title: string; volunteering: VolItem[] };

const EMPTY: VolData      = { title: "", volunteering: [] };
const EMPTY_ITEM: VolItem = { role: "", organization: "", event: "", location: "", date: "", description: "", image: "" };

const INPUT: React.CSSProperties = {
  width: "100%", background: "#12121c", border: "1px solid #252535",
  borderRadius: 8, color: "#e2e2e8", fontSize: 13,
  padding: "10px 14px", outline: "none", boxSizing: "border-box",
};
const TEXTAREA: React.CSSProperties = { ...INPUT, resize: "vertical" as const, minHeight: 90, lineHeight: 1.6 };

function iFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) { e.target.style.borderColor = "#8750f7"; }
function iBlur (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) { e.target.style.borderColor = "#252535"; }

/* ── Field ── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <div style={{ width: 2, height: 12, background: "#8750f7", borderRadius: 1, flexShrink: 0 }} />
        <label style={{ color: "#9898b8", fontSize: 12, fontWeight: 500 }}>{label}</label>
      </div>
      {children}
    </div>
  );
}

/* ── SaveBtn ── */
function SaveBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      background: loading ? "#6340b5" : "#8750f7", color: "#fff",
      border: "none", borderRadius: 10, padding: "10px 22px",
      fontSize: 13, fontWeight: 600,
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1, whiteSpace: "nowrap" as const,
    }}>
      {loading ? "Kaydediliyor…" : "Kaydet"}
    </button>
  );
}

/* ── Toast ── */
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

/* ── Görsel alanı ── */
function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [tab, setTab]       = useState<"url" | "upload">("url");
  const [uploading, setUpl] = useState(false);
  const fileRef             = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUpl(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((res, rej) => {
        reader.onload  = e => res((e.target?.result as string).split(",")[1]);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      const resp = await fetch("/api/admin/certificates-upload", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, base64 }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);
      onChange(data.path);
    } catch (e: unknown) { alert((e as Error).message || "Yükleme hatası"); }
    finally { setUpl(false); }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 2, height: 12, background: "#8750f7", borderRadius: 1 }} />
          <label style={{ color: "#9898b8", fontSize: 12, fontWeight: 500 }}>Görsel / Sertifika</label>
        </div>
        <div style={{ display: "flex", gap: 2, background: "#0a0a12", borderRadius: 6, padding: 2 }}>
          {(["url", "upload"] as const).map(t => (
            <button key={t} type="button" onClick={() => setTab(t)} style={{
              padding: "2px 10px", borderRadius: 5, border: "none", cursor: "pointer", fontSize: 11,
              background: tab === t ? "#8750f730" : "transparent",
              color:      tab === t ? "#a78bfa"   : "#52525e",
            }}>
              {t === "url" ? "🔗 URL" : "📁 Dosya"}
            </button>
          ))}
        </div>
      </div>
      {tab === "url" ? (
        <input value={value} onChange={e => onChange(e.target.value)} style={INPUT}
          placeholder="/assets/images/… veya https://…" onFocus={iFocus} onBlur={iBlur} />
      ) : (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.gif" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{
            ...INPUT, cursor: "pointer", textAlign: "left" as const,
            color: value ? "#e2e2e8" : "#52525e",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
          }}>
            {uploading ? "Yükleniyor…" : value || "Dosya seç…"}
          </button>
        </div>
      )}
      {value && (
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
          <img src={value} alt="önizleme"
            style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 6, border: "1px solid #1e1e2e" }}
            onError={e => (e.currentTarget as HTMLImageElement).style.display = "none"} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#52525e", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{value}</div>
            <button type="button" onClick={() => onChange("")} style={{ background: "transparent", border: "none", color: "#f87171", fontSize: 11, cursor: "pointer", padding: 0, marginTop: 2 }}>Kaldır</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Collapse'lı kayıt kartı ── */
function VolCard({ item, index, total, onUpdate, onMove, onDelete }: {
  item: VolItem; index: number; total: number;
  onUpdate: (k: keyof VolItem, v: string) => void;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div style={{
      background: "#0d0d14", border: "1px solid #1e1e2e",
      borderLeft: "3px solid #2dd4bf",
      borderRadius: 14, overflow: "hidden",
    }}>
      {/* Başlık — collapse */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px", cursor: "pointer",
          background: open ? "#10101a" : "#0d0d14",
          borderBottom: open ? "1px solid #1a1a28" : "none",
          transition: "background 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#10101a"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = open ? "#10101a" : "#0d0d14"}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
          <span style={{ color: "#2dd4bf", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>#{index + 1}</span>
          {item.image && (
            <img src={item.image} alt="" style={{ width: 28, height: 28, borderRadius: 5, objectFit: "cover", flexShrink: 0, border: "1px solid #1e1e2e" }}
              onError={e => (e.currentTarget as HTMLImageElement).style.display = "none"} />
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "#e2e2e8", fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
              {item.role || <span style={{ color: "#52525e", fontWeight: 400 }}>Rol girilmedi</span>}
            </div>
            {(item.organization || item.event) && (
              <div style={{ color: "#52525e", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const, marginTop: 2 }}>
                {[item.organization, item.event].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          {item.date && (
            <span style={{ background: "#2dd4bf15", color: "#2dd4bf", borderRadius: 5, padding: "1px 8px", fontSize: 11, fontWeight: 600 }}>
              {item.date}
            </span>
          )}
          <span style={{ color: "#52525e", fontSize: 11 }}>{open ? "▲" : "▼"}</span>
          {/* Aksiyonlar — propagasyonu durdur */}
          <div onClick={e => e.stopPropagation()} style={{ display: "flex", gap: 5 }}>
            <button onClick={() => onMove(-1)} disabled={index === 0} style={{
              background: "transparent", border: "1px solid #1e1e2e", borderRadius: 7,
              color: index === 0 ? "#2a2a3a" : "#9898a8",
              padding: "4px 9px", fontSize: 12, cursor: index === 0 ? "not-allowed" : "pointer",
            }}>↑</button>
            <button onClick={() => onMove(1)} disabled={index === total - 1} style={{
              background: "transparent", border: "1px solid #1e1e2e", borderRadius: 7,
              color: index === total - 1 ? "#2a2a3a" : "#9898a8",
              padding: "4px 9px", fontSize: 12, cursor: index === total - 1 ? "not-allowed" : "pointer",
            }}>↓</button>
            <button onClick={() => { if (!confirm("Silinsin mi?")) return; onDelete(); }} style={{
              background: "#7f1d1d", border: "none", borderRadius: 7,
              color: "#fca5a5", padding: "4px 10px", fontSize: 12, cursor: "pointer",
            }}>Sil</button>
          </div>
        </div>
      </div>

      {/* İçerik */}
      {open && (
        <div style={{ padding: "18px 18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Satır 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <Field label="Rol">
              <input value={item.role} onChange={e => onUpdate("role", e.target.value)}
                style={INPUT} placeholder="Gönüllü, Organizatör…" onFocus={iFocus} onBlur={iBlur} />
            </Field>
            <Field label="Organizasyon">
              <input value={item.organization} onChange={e => onUpdate("organization", e.target.value)}
                style={INPUT} onFocus={iFocus} onBlur={iBlur} />
            </Field>
            <Field label="Etkinlik">
              <input value={item.event} onChange={e => onUpdate("event", e.target.value)}
                style={INPUT} onFocus={iFocus} onBlur={iBlur} />
            </Field>
          </div>

          {/* Satır 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Lokasyon">
              <input value={item.location} onChange={e => onUpdate("location", e.target.value)}
                style={INPUT} placeholder="İstanbul, Türkiye" onFocus={iFocus} onBlur={iBlur} />
            </Field>
            <Field label="Tarih">
              <input value={item.date} onChange={e => onUpdate("date", e.target.value)}
                style={INPUT} placeholder="2024 veya Mart 2024" onFocus={iFocus} onBlur={iBlur} />
            </Field>
          </div>

          {/* Satır 3: Açıklama + Görsel */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
            <Field label="Açıklama">
              <textarea value={item.description} onChange={e => onUpdate("description", e.target.value)}
                style={TEXTAREA} onFocus={iFocus} onBlur={iBlur} />
            </Field>
            <ImageField value={item.image} onChange={v => onUpdate("image", v)} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ANA SAYFA
══════════════════════════════════════════════════════════ */
export default function VolunteeringPage() {
  const { locale } = useLocaleContext();
  const [data, setData]       = useState<VolData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState<{ ok: boolean; text: string } | null>(null);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/volunteering?locale=${locale}`)
      .then(r => r.json())
      .then(d => setData({ title: d.title || "", volunteering: Array.isArray(d.volunteering) ? d.volunteering : [] }))
      .catch(() => setData(EMPTY))
      .finally(() => setLoading(false));
  }, [locale]);

  function showToast(ok: boolean, text: string) { setToast({ ok, text }); setTimeout(() => setToast(null), 3000); }

  function updateItem(i: number, k: keyof VolItem, v: string) {
    setData(d => { const a = [...d.volunteering]; a[i] = { ...a[i], [k]: v }; return { ...d, volunteering: a }; });
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir; if (j < 0 || j >= data.volunteering.length) return;
    const a = [...data.volunteering]; [a[i], a[j]] = [a[j], a[i]];
    setData(d => ({ ...d, volunteering: a }));
  }
  function remove(i: number) {
    setData(d => ({ ...d, volunteering: d.volunteering.filter((_, j) => j !== i) }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/volunteering?locale=${locale}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(true, `Kaydedildi [${locale.toUpperCase()}] ✓`);
    } catch (e: unknown) { showToast(false, (e as Error).message || "Hata"); }
    finally { setSaving(false); }
  }

  const filtered = search
    ? data.volunteering.filter(v =>
        v.role.toLowerCase().includes(search.toLowerCase()) ||
        v.organization.toLowerCase().includes(search.toLowerCase()) ||
        v.event.toLowerCase().includes(search.toLowerCase())
      )
    : data.volunteering;

  return (
    <div style={{ paddingBottom: 80 }}>
      {toast && <Toast {...toast} />}

      {/* ── Sayfa başlığı ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 3, height: 24, background: "#8750f7", borderRadius: 2, flexShrink: 0 }} />
            <h1 style={{ color: "#e2e2e8", fontSize: 24, fontWeight: 700, lineHeight: 1 }}>Gönüllülük</h1>
          </div>
          <div style={{ marginLeft: 13, display: "flex", alignItems: "center", gap: 10 }}>
            <code style={{ color: "#6d6d8a", fontSize: 12, background: "#12121c", padding: "3px 8px", borderRadius: 5, border: "1px solid #1e1e2e" }}>
              messages/volunteering/{locale}.json
            </code>
            <span style={{ color: "#52525e", fontSize: 12 }}>·</span>
            <span style={{ color: "#52525e", fontSize: 12 }}>{data.volunteering.length} kayıt</span>
          </div>
        </div>
        <SaveBtn onClick={save} loading={saving} />
      </div>

      {loading ? (
        <div style={{ color: "#52525e", fontSize: 13, padding: "60px 0", textAlign: "center" as const }}>Yükleniyor…</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Bölüm başlığı */}
          <div style={{ background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "24px 26px" }}>
            <div style={{
              color: "#52525e", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase" as const,
              marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid #1a1a28",
            }}>
              Bölüm Metinleri
            </div>
            <Field label="Bölüm Başlığı">
              <input value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value }))}
                style={INPUT} placeholder="Volunteering" onFocus={iFocus} onBlur={iBlur} />
            </Field>
          </div>

          {/* Kayıtlar */}
          <div style={{ background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "24px 26px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #1a1a28" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ color: "#52525e", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
                  Kayıtlar
                </div>
                {data.volunteering.length > 0 && (
                  <div style={{ position: "relative" }}>
                    <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                      width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#52525e" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Ara…"
                      style={{ ...INPUT, paddingLeft: 30, maxWidth: 200, fontSize: 12, padding: "7px 12px 7px 30px" }}
                      onFocus={iFocus} onBlur={iBlur} />
                  </div>
                )}
              </div>
              <button onClick={() => setData(d => ({ ...d, volunteering: [{ ...EMPTY_ITEM }, ...d.volunteering] }))} style={{
                background: "transparent", border: "1px solid #1e1e2e", borderRadius: 8,
                color: "#9898a8", padding: "7px 14px", fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#2dd4bf"; el.style.color = "#2dd4bf"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#1e1e2e"; el.style.color = "#9898a8"; }}
              >
                <span style={{ fontSize: 14 }}>+</span> Ekle
              </button>
            </div>

            {/* Boş durum */}
            {data.volunteering.length === 0 && (
              <div style={{ textAlign: "center" as const, padding: "40px 0" }}>
                <div style={{ color: "#52525e", fontSize: 13, marginBottom: 14 }}>Henüz kayıt yok.</div>
                <button onClick={() => setData(d => ({ ...d, volunteering: [{ ...EMPTY_ITEM }] }))} style={{
                  background: "#8750f7", color: "#fff", border: "none", borderRadius: 10,
                  padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>
                  İlk Kaydı Ekle
                </button>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map((item, idx) => {
                const realIndex = data.volunteering.indexOf(item);
                return (
                  <VolCard
                    key={realIndex}
                    item={item}
                    index={realIndex}
                    total={data.volunteering.length}
                    onUpdate={(k, v) => updateItem(realIndex, k, v)}
                    onMove={dir => move(realIndex, dir)}
                    onDelete={() => remove(realIndex)}
                  />
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
            <SaveBtn onClick={save} loading={saving} />
          </div>
        </div>
      )}
    </div>
  );
}