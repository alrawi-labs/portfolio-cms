"use client";

import { useEffect, useState, useRef } from "react";

type PersonalData = { photo?: string; [key: string]: unknown };
type StatsData    = { years?: number; projects?: number; clients?: number; awards?: number; technologies?: number; [key: string]: unknown };

const INPUT: React.CSSProperties = {
  width: "100%", background: "#12121c", border: "1px solid #252535",
  borderRadius: 8, color: "#e2e2e8", fontSize: 13,
  padding: "10px 14px", outline: "none", boxSizing: "border-box",
};

function iFocus(e: React.FocusEvent<HTMLInputElement>) { e.target.style.borderColor = "#8750f7"; }
function iBlur (e: React.FocusEvent<HTMLInputElement>) { e.target.style.borderColor = "#252535"; }

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

function Field({ label, badge, children }: { label: string; badge?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <div style={{ width: 2, height: 12, background: "#8750f7", borderRadius: 1, flexShrink: 0 }} />
        <label style={{ color: "#9898b8", fontSize: 12, fontWeight: 500 }}>{label}</label>
        {badge && (
          <span style={{ background: "#8750f715", color: "#a78bfa", fontSize: 10, borderRadius: 4, padding: "1px 6px", fontWeight: 600 }}>
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/* ── Görsel alanı ── */
function ImgField({
  value, onChange, label = "Görsel", uploadEndpoint, previewRound = false,
}: {
  value: string; onChange: (v: string) => void;
  label?: string; uploadEndpoint: string; previewRound?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [tab, setTab]             = useState<"url" | "upload">("url");
  const fileRef                   = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((res, rej) => {
        reader.onload  = e => res((e.target?.result as string).split(",")[1]);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      const res  = await fetch(uploadEndpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, base64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onChange(data.path);
    } catch (e: unknown) { alert((e as Error).message || "Yükleme hatası"); }
    finally { setUploading(false); }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <div style={{ width: 2, height: 12, background: "#8750f7", borderRadius: 1, flexShrink: 0 }} />
        <label style={{ color: "#9898b8", fontSize: 12, fontWeight: 500 }}>{label}</label>
        <div style={{ marginLeft: "auto", display: "flex", gap: 2, background: "#0d0d14", borderRadius: 6, padding: 2 }}>
          {(["url", "upload"] as const).map(t => (
            <button key={t} type="button" onClick={() => setTab(t)} style={{
              padding: "2px 9px", borderRadius: 5, border: "none", cursor: "pointer", fontSize: 11,
              background: tab === t ? "#8750f720" : "transparent",
              color:      tab === t ? "#a78bfa"   : "#52525e",
              fontWeight: tab === t ? 600 : 400,
            }}>
              {t === "url" ? "URL" : "Dosya"}
            </button>
          ))}
        </div>
      </div>

      {tab === "url" ? (
        <input value={value} onChange={e => onChange(e.target.value)} style={INPUT}
          placeholder="/assets/images/photo.png veya https://…" onFocus={iFocus} onBlur={iBlur} />
      ) : (
        <div style={{ display: "flex", gap: 8 }}>
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.gif" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{
            ...INPUT, cursor: "pointer", textAlign: "left" as const,
            color: value ? "#e2e2e8" : "#6d6d8a",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
          }}>
            {uploading ? "Yükleniyor…" : value || "Dosya seç…"}
          </button>
        </div>
      )}

      {value && (
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14 }}>
          <img src={value} alt="önizleme" style={{
            width: previewRound ? 72 : 56, height: previewRound ? 72 : 56,
            objectFit: "cover",
            borderRadius: previewRound ? "50%" : 8,
            border: "2px solid #1e1e2e",
          }}
            onError={e => (e.currentTarget as HTMLImageElement).style.display = "none"} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#6d6d8a", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{value}</div>
            <button type="button" onClick={() => onChange("")} style={{
              background: "transparent", border: "none", color: "#f87171",
              fontSize: 12, cursor: "pointer", padding: 0, marginTop: 4,
            }}>Kaldır</button>
          </div>
        </div>
      )}
    </div>
  );
}

const STAT_FIELDS = [
  { key: "years",        label: "Deneyim (Yıl)",    placeholder: "5",  color: "#a78bfa" },
  { key: "projects",     label: "Proje Sayısı",     placeholder: "54", color: "#38bdf8" },
  { key: "clients",      label: "Müşteri Sayısı",   placeholder: "12", color: "#34d399" },
  { key: "awards",       label: "Ödül Sayısı",      placeholder: "48", color: "#f472b6" },
  { key: "technologies", label: "Teknoloji Sayısı", placeholder: "26", color: "#fb923c" },
] as const;

/* ══ ANA SAYFA ══ */
export default function PersonalPage() {
  const [personal, setPersonal] = useState<PersonalData>({ photo: "" });
  const [stats, setStats]       = useState<StatsData>({ years: 0, projects: 0, clients: 0, awards: 0, technologies: 0 });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/personal")
      .then(r => r.json())
      .then(d => {
        if (d.personal) setPersonal(d.personal);
        if (d.stats)    setStats(d.stats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function showToast(ok: boolean, text: string) { setToast({ ok, text }); setTimeout(() => setToast(null), 3000); }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/personal", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personal, stats }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(true, "Kaydedildi ✓");
    } catch (e: unknown) { showToast(false, (e as Error).message || "Hata"); }
    finally { setSaving(false); }
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      {toast && <Toast {...toast} />}

      {/* ── Sayfa başlığı ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 3, height: 24, background: "#8750f7", borderRadius: 2, flexShrink: 0 }} />
            <h1 style={{ color: "#e2e2e8", fontSize: 24, fontWeight: 700, lineHeight: 1 }}>Kişisel & Stats</h1>
          </div>
          <div style={{ marginLeft: 13 }}>
            <p style={{ color: "#52525e", fontSize: 13 }}>Profil fotoğrafı ve istatistik değerleri</p>
          </div>
        </div>
        <SaveBtn onClick={save} loading={saving} />
      </div>

      {loading ? (
        <div style={{ color: "#52525e", fontSize: 13, padding: "60px 0", textAlign: "center" as const }}>Yükleniyor…</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ── Profil Fotoğrafı ── */}
          <div style={{ background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "24px 26px" }}>
            <div style={{
              color: "#52525e", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase" as const,
              marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #1a1a28",
            }}>
              Profil Fotoğrafı
            </div>
            <ImgField
              value={String(personal.photo || "")}
              onChange={v => setPersonal(p => ({ ...p, photo: v }))}
              label="Fotoğraf"
              uploadEndpoint="/api/admin/personal-upload"
              previewRound
            />
          </div>

          {/* ── İstatistikler ── */}
          <div style={{ background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "24px 26px" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #1a1a28",
            }}>
              <div>
                <div style={{ color: "#e2e2e8", fontSize: 15, fontWeight: 600, marginBottom: 3 }}>İstatistikler</div>
                <div style={{ color: "#52525e", fontSize: 12 }}>Hero ve Stats bölümlerinde gösterilen sayılar</div>
              </div>
              <div style={{ background: "#8750f715", border: "1px solid #8750f730", borderRadius: 7, padding: "3px 10px" }}>
                <span style={{ color: "#a78bfa", fontSize: 11, fontWeight: 600 }}>{STAT_FIELDS.length} alan</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
              {STAT_FIELDS.map(({ key, label, placeholder, color }) => (
                <div key={key} style={{
                  background: "#0d0d14", border: "1px solid #1e1e2e",
                  borderTop: `3px solid ${color}`,
                  borderRadius: 12, padding: "14px 14px 16px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <div style={{ width: 2, height: 12, background: color, borderRadius: 1, flexShrink: 0 }} />
                    <label style={{ color: "#9898b8", fontSize: 11, fontWeight: 500 }}>{label}</label>
                  </div>
                  <input
                    type="number" min={0}
                    value={Number(stats[key] ?? 0)}
                    onChange={e => setStats(s => ({ ...s, [key]: Number(e.target.value) }))}
                    style={{ ...INPUT, fontSize: 22, fontWeight: 700, color, textAlign: "center" as const, padding: "8px" }}
                    placeholder={placeholder}
                    onFocus={e => { e.target.style.borderColor = color; }}
                    onBlur={e  => { e.target.style.borderColor = "#252535"; }}
                  />
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 16, background: "#0d0d14", border: "1px solid #1a1a28",
              borderRadius: 8, padding: "10px 14px",
            }}>
              <p style={{ color: "#3a3a50", fontSize: 12 }}>
                💡 Bu değerler <code style={{ color: "#6d6d8a" }}>data/stats.ts</code> dosyasına yazılır.
              </p>
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