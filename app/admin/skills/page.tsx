"use client";

import { useEffect, useState } from "react";
import { useLocaleContext } from "../_components/LocaleContext";

type SkillItem   = { name: string };
type CategoryKey = "programmingLanguages" | "frameworks" | "concepts" | "databases";
type SkillsData  = {
  title: string; subtitle: string;
  categories: Record<CategoryKey, string>;
  skills: Record<CategoryKey, SkillItem[]>;
};

const CATEGORY_KEYS: CategoryKey[] = ["programmingLanguages", "frameworks", "concepts", "databases"];

const CAT_META: Record<CategoryKey, { color: string; bg: string; label: string }> = {
  programmingLanguages: { color: "#a78bfa", bg: "#8750f720", label: "Programlama Dilleri" },
  frameworks:           { color: "#38bdf8", bg: "#38bdf820", label: "Frameworks"          },
  concepts:             { color: "#c084fc", bg: "#c084fc20", label: "Kavramlar"            },
  databases:            { color: "#34d399", bg: "#34d39920", label: "Veritabanları"        },
};

const DEFAULT: SkillsData = {
  title: "", subtitle: "",
  categories: {
    programmingLanguages: "Programming Languages",
    frameworks: "Frameworks & Libraries",
    concepts: "Concepts & Techniques",
    databases: "Databases",
  },
  skills: { programmingLanguages: [], frameworks: [], concepts: [], databases: [] },
};

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

/* ── Kategori paneli ── */
function CategoryPanel({ catKey, skills, label, onLabelChange, onSkillChange, onAddSkill, onRemoveSkill, onMoveSkill }: {
  catKey: CategoryKey;
  skills: SkillItem[];
  label: string;
  onLabelChange: (v: string) => void;
  onSkillChange: (i: number, name: string) => void;
  onAddSkill: (name: string) => void;
  onRemoveSkill: (i: number) => void;
  onMoveSkill: (i: number, dir: -1 | 1) => void;
}) {
  const [newSkill, setNewSkill] = useState("");
  const meta = CAT_META[catKey];

  function handleAdd() {
    const t = newSkill.trim(); if (!t) return;
    onAddSkill(t); setNewSkill("");
  }

  return (
    <div style={{
      background: "#0d0d14", border: "1px solid #1e1e2e",
      borderLeft: `3px solid ${meta.color}`,
      borderRadius: 14, overflow: "hidden",
    }}>
      {/* Panel başlığı */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px", background: "#10101a", borderBottom: "1px solid #1a1a28",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <span style={{
            background: meta.bg, color: meta.color,
            borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 600, flexShrink: 0,
          }}>
            {catKey}
          </span>
          {/* Kategori adı — düzenlenebilir */}
          <input
            value={label}
            onChange={e => onLabelChange(e.target.value)}
            style={{
              background: "transparent", border: "none",
              color: "#e2e2e8", fontSize: 14, fontWeight: 600,
              flex: 1, outline: "none",
            }}
          />
        </div>
        <span style={{
          background: "#1e1e2e", color: "#52525e",
          borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600, flexShrink: 0,
        }}>
          {skills.length} beceri
        </span>
      </div>

      {/* Beceri listesi */}
      <div style={{ padding: "16px 20px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
        {skills.length === 0 && (
          <p style={{ color: "#3a3a50", fontSize: 12, textAlign: "center" as const, padding: "8px 0" }}>
            Henüz beceri yok.
          </p>
        )}

        {/* Beceriler grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
          {skills.map((sk, i) => (
            <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {/* Sıralama */}
              <div style={{ display: "flex", flexDirection: "column", gap: 1, flexShrink: 0 }}>
                <button onClick={() => onMoveSkill(i, -1)} disabled={i === 0} style={{
                  background: "transparent", border: "none", cursor: i === 0 ? "default" : "pointer",
                  color: i === 0 ? "#2a2a3a" : "#52525e", padding: "1px 4px", fontSize: 9, lineHeight: 1,
                }}>▲</button>
                <button onClick={() => onMoveSkill(i, 1)} disabled={i === skills.length - 1} style={{
                  background: "transparent", border: "none", cursor: i === skills.length - 1 ? "default" : "pointer",
                  color: i === skills.length - 1 ? "#2a2a3a" : "#52525e", padding: "1px 4px", fontSize: 9, lineHeight: 1,
                }}>▼</button>
              </div>
              {/* Input */}
              <div style={{
                flex: 1, display: "flex", alignItems: "center",
                background: "#12121c", border: "1px solid #1e1e2e", borderRadius: 8, overflow: "hidden",
              }}>
                <div style={{ padding: "0 8px", color: meta.color, fontSize: 11, flexShrink: 0 }}>◆</div>
                <input
                  value={sk.name}
                  onChange={e => onSkillChange(i, e.target.value)}
                  style={{ ...INPUT, border: "none", background: "transparent", borderRadius: 0, padding: "8px 8px 8px 0" }}
                  onFocus={e => (e.target.parentElement as HTMLElement).style.borderColor = meta.color}
                  onBlur={e  => (e.target.parentElement as HTMLElement).style.borderColor = "#1e1e2e"}
                />
              </div>
              {/* Sil */}
              <button onClick={() => onRemoveSkill(i)} style={{
                background: "#3f1010", border: "none", borderRadius: 7,
                color: "#fca5a5", cursor: "pointer",
                width: 30, height: 34, fontSize: 13, flexShrink: 0,
              }}>✕</button>
            </div>
          ))}
        </div>

        {/* Yeni beceri ekle */}
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <input
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }}
            style={{ ...INPUT, flex: 1 }}
            placeholder="Yeni beceri girin, Enter ile ekle…"
            onFocus={iFocus} onBlur={iBlur}
          />
          <button onClick={handleAdd} style={{
            background: meta.bg, border: `1px solid ${meta.color}40`,
            borderRadius: 8, color: meta.color,
            padding: "0 16px", fontSize: 18, cursor: "pointer",
            transition: "all 0.15s",
          }}>+</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ANA SAYFA
══════════════════════════════════════════════════════════ */
export default function SkillsPage() {
  const { locale } = useLocaleContext();
  const [data, setData]       = useState<SkillsData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/skills?locale=${locale}`)
      .then(r => r.json())
      .then(d => setData({
        title:    d.title    || "",
        subtitle: d.subtitle || "",
        categories: { ...DEFAULT.categories, ...(d.categories || {}) },
        skills: {
          programmingLanguages: Array.isArray(d.skills?.programmingLanguages) ? d.skills.programmingLanguages : [],
          frameworks:           Array.isArray(d.skills?.frameworks)           ? d.skills.frameworks           : [],
          concepts:             Array.isArray(d.skills?.concepts)             ? d.skills.concepts             : [],
          databases:            Array.isArray(d.skills?.databases)            ? d.skills.databases            : [],
        },
      }))
      .catch(() => setData(DEFAULT))
      .finally(() => setLoading(false));
  }, [locale]);

  function showToast(ok: boolean, text: string) { setToast({ ok, text }); setTimeout(() => setToast(null), 3000); }

  function setCatLabel(k: CategoryKey, v: string) { setData(d => ({ ...d, categories: { ...d.categories, [k]: v } })); }
  function setSkill(k: CategoryKey, i: number, name: string) {
    setData(d => { const a = [...d.skills[k]]; a[i] = { name }; return { ...d, skills: { ...d.skills, [k]: a } }; });
  }
  function addSkill(k: CategoryKey, name: string) {
    setData(d => ({ ...d, skills: { ...d.skills, [k]: [...d.skills[k], { name }] } }));
  }
  function removeSkill(k: CategoryKey, i: number) {
    setData(d => ({ ...d, skills: { ...d.skills, [k]: d.skills[k].filter((_, j) => j !== i) } }));
  }
  function moveSkill(k: CategoryKey, i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= data.skills[k].length) return;
    const a = [...data.skills[k]]; [a[i], a[j]] = [a[j], a[i]];
    setData(d => ({ ...d, skills: { ...d.skills, [k]: a } }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/skills?locale=${locale}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(true, `Kaydedildi [${locale.toUpperCase()}] ✓`);
    } catch (e: unknown) { showToast(false, (e as Error).message || "Hata"); }
    finally { setSaving(false); }
  }

  const total = CATEGORY_KEYS.reduce((a, k) => a + data.skills[k].length, 0);

  return (
    <div style={{ paddingBottom: 80 }}>
      {toast && <Toast {...toast} />}

      {/* ── Sayfa başlığı ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 3, height: 24, background: "#8750f7", borderRadius: 2, flexShrink: 0 }} />
            <h1 style={{ color: "#e2e2e8", fontSize: 24, fontWeight: 700, lineHeight: 1 }}>Beceriler</h1>
          </div>
          <div style={{ marginLeft: 13, display: "flex", alignItems: "center", gap: 10 }}>
            <code style={{ color: "#6d6d8a", fontSize: 12, background: "#12121c", padding: "3px 8px", borderRadius: 5, border: "1px solid #1e1e2e" }}>
              messages/skills/{locale}.json
            </code>
            <span style={{ color: "#52525e", fontSize: 12 }}>·</span>
            <span style={{ color: "#52525e", fontSize: 12 }}>{total} beceri</span>
            <span style={{ color: "#52525e", fontSize: 12 }}>·</span>
            <span style={{ color: "#52525e", fontSize: 12 }}>{CATEGORY_KEYS.length} kategori</span>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
              <Field label="Başlık">
                <input value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value }))}
                  style={INPUT} onFocus={iFocus} onBlur={iBlur} />
              </Field>
              <Field label="Alt Başlık">
                <input value={data.subtitle} onChange={e => setData(d => ({ ...d, subtitle: e.target.value }))}
                  style={INPUT} onFocus={iFocus} onBlur={iBlur} />
              </Field>
            </div>
          </div>

          {/* Kategori panelleri */}
          {CATEGORY_KEYS.map(key => (
            <CategoryPanel
              key={key}
              catKey={key}
              skills={data.skills[key]}
              label={data.categories[key]}
              onLabelChange={v => setCatLabel(key, v)}
              onSkillChange={(i, name) => setSkill(key, i, name)}
              onAddSkill={name => addSkill(key, name)}
              onRemoveSkill={i => removeSkill(key, i)}
              onMoveSkill={(i, dir) => moveSkill(key, i, dir)}
            />
          ))}

          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
            <SaveBtn onClick={save} loading={saving} />
          </div>
        </div>
      )}
    </div>
  );
}