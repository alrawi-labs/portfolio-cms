"use client";

import { useEffect, useState } from "react";
import { useLocaleContext } from "../_components/LocaleContext";

type Entry     = { year: string; title: string; company: string };
type ResumeData = {
  title: string; subtitle: string;
  tabs: { experience: string; education: string };
  experience: Entry[]; education: Entry[];
};

const EMPTY: ResumeData = {
  title: "", subtitle: "",
  tabs: { experience: "My Experience", education: "My Education" },
  experience: [], education: [],
};
const EMPTY_ENTRY: Entry = { year: "", title: "", company: "" };

const INPUT: React.CSSProperties = {
  width: "100%", background: "#12121c", border: "1px solid #252535",
  borderRadius: 8, color: "#e2e2e8", fontSize: 13,
  padding: "10px 14px", outline: "none", boxSizing: "border-box",
};

function iFocus(e: React.FocusEvent<HTMLInputElement>) { e.target.style.borderColor = "#8750f7"; }
function iBlur (e: React.FocusEvent<HTMLInputElement>) { e.target.style.borderColor = "#252535"; }

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

const TAB_META = {
  experience: { color: "#a78bfa", bg: "#8750f720", icon: "◇" },
  education:  { color: "#38bdf8", bg: "#38bdf820", icon: "◈" },
} as const;

export default function ResumePage() {
  const { locale } = useLocaleContext();
  const [data, setData]       = useState<ResumeData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState<{ ok: boolean; text: string } | null>(null);
  const [tab, setTab]         = useState<"experience" | "education">("experience");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/resume?locale=${locale}`)
      .then(r => r.json())
      .then(d => setData({
        ...EMPTY, ...d,
        tabs:       { ...EMPTY.tabs, ...(d.tabs || {}) },
        experience: Array.isArray(d.experience) ? d.experience : [],
        education:  Array.isArray(d.education)  ? d.education  : [],
      }))
      .catch(() => setData(EMPTY))
      .finally(() => setLoading(false));
  }, [locale]);

  function showToast(ok: boolean, text: string) { setToast({ ok, text }); setTimeout(() => setToast(null), 3000); }

  function addEntry(s: "experience" | "education") {
    setData(d => ({ ...d, [s]: [...d[s], { ...EMPTY_ENTRY }] }));
  }
  function removeEntry(s: "experience" | "education", i: number) {
    if (!confirm("Silinsin mi?")) return;
    setData(d => ({ ...d, [s]: d[s].filter((_, j) => j !== i) }));
  }
  function moveEntry(s: "experience" | "education", i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= data[s].length) return;
    const a = [...data[s]]; [a[i], a[j]] = [a[j], a[i]];
    setData(d => ({ ...d, [s]: a }));
  }
  function changeEntry(s: "experience" | "education", i: number, k: keyof Entry, v: string) {
    setData(d => { const a = [...d[s]]; a[i] = { ...a[i], [k]: v }; return { ...d, [s]: a }; });
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/resume?locale=${locale}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(true, `Kaydedildi [${locale.toUpperCase()}] ✓`);
    } catch (e: unknown) { showToast(false, (e as Error).message || "Hata"); }
    finally { setSaving(false); }
  }

  const entries = data[tab];
  const meta    = TAB_META[tab];

  return (
    <div style={{ paddingBottom: 80 }}>
      {toast && <Toast {...toast} />}

      {/* ── Sayfa başlığı ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 3, height: 24, background: "#8750f7", borderRadius: 2, flexShrink: 0 }} />
            <h1 style={{ color: "#e2e2e8", fontSize: 24, fontWeight: 700, lineHeight: 1 }}>Deneyim & Eğitim</h1>
          </div>
          <div style={{ marginLeft: 13, display: "flex", alignItems: "center", gap: 10 }}>
            <code style={{ color: "#6d6d8a", fontSize: 12, background: "#12121c", padding: "3px 8px", borderRadius: 5, border: "1px solid #1e1e2e" }}>
              messages/resume/{locale}.json
            </code>
            <span style={{ color: "#52525e", fontSize: 12 }}>·</span>
            <span style={{ color: "#a78bfa", fontSize: 12, fontWeight: 500 }}>{data.experience.length} deneyim</span>
            <span style={{ color: "#52525e", fontSize: 12 }}>·</span>
            <span style={{ color: "#38bdf8", fontSize: 12, fontWeight: 500 }}>{data.education.length} eğitim</span>
          </div>
        </div>
        <SaveBtn onClick={save} loading={saving} />
      </div>

      {loading ? (
        <div style={{ color: "#52525e", fontSize: 13, padding: "60px 0", textAlign: "center" as const }}>Yükleniyor…</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Bölüm metinleri */}
          <div style={{ background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "24px 26px" }}>
            <div style={{
              color: "#52525e", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase" as const,
              marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #1a1a28",
            }}>
              Bölüm Metinleri
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 20 }}>
              <Field label="Başlık">
                <input value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value }))}
                  style={INPUT} onFocus={iFocus} onBlur={iBlur} />
              </Field>
              <Field label="Alt Başlık">
                <input value={data.subtitle} onChange={e => setData(d => ({ ...d, subtitle: e.target.value }))}
                  style={INPUT} onFocus={iFocus} onBlur={iBlur} />
              </Field>
              <Field label="Deneyim Sekmesi">
                <input value={data.tabs.experience}
                  onChange={e => setData(d => ({ ...d, tabs: { ...d.tabs, experience: e.target.value } }))}
                  style={INPUT} onFocus={iFocus} onBlur={iBlur} />
              </Field>
              <Field label="Eğitim Sekmesi">
                <input value={data.tabs.education}
                  onChange={e => setData(d => ({ ...d, tabs: { ...d.tabs, education: e.target.value } }))}
                  style={INPUT} onFocus={iFocus} onBlur={iBlur} />
              </Field>
            </div>
          </div>

          {/* Sekme çubuğu */}
          <div style={{
            display: "flex", gap: 4,
            background: "#0a0a12", border: "1px solid #1a1a28",
            borderRadius: 12, padding: 4,
          }}>
            {(["experience", "education"] as const).map(t => {
              const m      = TAB_META[t];
              const active = tab === t;
              return (
                <button key={t} onClick={() => setTab(t)} style={{
                  flex: 1, padding: "10px 16px", border: "none", cursor: "pointer",
                  borderRadius: 8, fontSize: 13, fontWeight: active ? 600 : 400,
                  background: active ? "#8750f7" : "transparent",
                  color: active ? "#fff" : "#52525e",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  <span>{m.icon}</span>
                  {t === "experience" ? data.tabs.experience || "Deneyim" : data.tabs.education || "Eğitim"}
                  <span style={{
                    background: active ? "#ffffff25" : "#1e1e2e",
                    color: active ? "#fff" : "#52525e",
                    borderRadius: 5, padding: "1px 7px", fontSize: 11, fontWeight: 600,
                  }}>
                    {data[t].length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Giriş listesi */}
          <div style={{ background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "24px 26px" }}>
            {entries.length === 0 && (
              <div style={{ color: "#52525e", fontSize: 13, textAlign: "center" as const, padding: "32px 0" }}>
                Henüz kayıt yok.
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {entries.map((e, i) => (
                <div key={i} style={{
                  background: "#0d0d14", border: "1px solid #1e1e2e",
                  borderLeft: `3px solid ${meta.color}`,
                  borderRadius: 12, overflow: "hidden",
                }}>
                  {/* Giriş başlığı */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "11px 18px", background: "#10101a", borderBottom: "1px solid #1a1a28",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: "#3a3a50", fontSize: 11, fontWeight: 600 }}>#{i + 1}</span>
                      {e.year && (
                        <span style={{ background: meta.bg, color: meta.color, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>
                          {e.year}
                        </span>
                      )}
                      {e.title && <span style={{ color: "#9898a8", fontSize: 13 }}>{e.title}</span>}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => moveEntry(tab, i, -1)} disabled={i === 0} style={{
                        background: "transparent", border: "1px solid #1e1e2e", borderRadius: 7,
                        color: i === 0 ? "#2a2a3a" : "#9898a8",
                        padding: "4px 10px", fontSize: 12, cursor: i === 0 ? "not-allowed" : "pointer",
                      }}>↑</button>
                      <button onClick={() => moveEntry(tab, i, 1)} disabled={i === entries.length - 1} style={{
                        background: "transparent", border: "1px solid #1e1e2e", borderRadius: 7,
                        color: i === entries.length - 1 ? "#2a2a3a" : "#9898a8",
                        padding: "4px 10px", fontSize: 12, cursor: i === entries.length - 1 ? "not-allowed" : "pointer",
                      }}>↓</button>
                      <button onClick={() => removeEntry(tab, i)} style={{
                        background: "#7f1d1d", border: "none", borderRadius: 7,
                        color: "#fca5a5", padding: "4px 11px", fontSize: 12, cursor: "pointer",
                      }}>Sil</button>
                    </div>
                  </div>

                  {/* Giriş içeriği */}
                  <div style={{ padding: "16px 18px", display: "grid", gridTemplateColumns: "1fr 2fr 2fr", gap: 16 }}>
                    <Field label="Tarih Aralığı">
                      <input value={e.year} onChange={ev => changeEntry(tab, i, "year", ev.target.value)}
                        style={INPUT} placeholder="2024 – 2026" onFocus={iFocus} onBlur={iBlur} />
                    </Field>
                    <Field label={tab === "experience" ? "Pozisyon" : "Bölüm / Diploma"}>
                      <input value={e.title} onChange={ev => changeEntry(tab, i, "title", ev.target.value)}
                        style={INPUT} placeholder={tab === "experience" ? "Full-Stack Developer" : "Computer Engineering"}
                        onFocus={iFocus} onBlur={iBlur} />
                    </Field>
                    <Field label={tab === "experience" ? "Şirket / Proje" : "Üniversite / Kurum"}>
                      <input value={e.company} onChange={ev => changeEntry(tab, i, "company", ev.target.value)}
                        style={INPUT} placeholder={tab === "experience" ? "Şirket Adı" : "Üniversite Adı"}
                        onFocus={iFocus} onBlur={iBlur} />
                    </Field>
                  </div>
                </div>
              ))}
            </div>

            {/* Ekle butonu */}
            <div style={{ marginTop: 14 }}>
              <button onClick={() => addEntry(tab)} style={{
                background: "transparent", border: "1px solid #1e1e2e",
                borderRadius: 10, color: "#9898a8", padding: "9px 18px",
                fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                transition: "all 0.15s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = meta.color; el.style.color = meta.color; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#1e1e2e"; el.style.color = "#9898a8"; }}
              >
                <span style={{ fontSize: 14 }}>+</span>
                {tab === "experience" ? "Deneyim Ekle" : "Eğitim Ekle"}
              </button>
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