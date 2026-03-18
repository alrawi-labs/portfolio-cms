"use client";

import { useEffect, useState, useRef } from "react";
import { useLocaleContext } from "../_components/LocaleContext";

/* ══════════════════════════════════════════════════════════
   TİPLER
══════════════════════════════════════════════════════════ */
type Technology = { name: string; description: string };
type ResultItem = { metric: string; value: string; description: string };
type ImageItem  = { url: string; alt: string; caption: string };
type CodeBlock  = { language: string; label: string; code: string };

type ContentBlock =
  | { type: 0; heading: string; subheading?: string; content: string }
  | { type: 1; heading: string; imageUrl: string; caption: string }
  | { type: 2; heading: string; videoUrl: string; posterUrl: string; caption: string }
  | { type: 3; heading: string; images: ImageItem[] }
  | { type: 4; heading: string; codeBlocks: CodeBlock[]; defaultTab: number };

type Project = {
  id: number;
  title: string; subtitle: string; category: string; isFeatured: boolean;
  date: string; description: string; longDescription: string;
  tags: string[]; image: string; techLogos: string[];
  duration: string; teamSize: number; role: string;
  demoLink: string | null; githubLink: string | null;
  technologies: Technology[];
  contentBlocks: ContentBlock[];
  challenges: string[]; solutions: string[];
  results: ResultItem[];
  _file?: string;
};

const EMPTY: Omit<Project, "id" | "_file"> = {
  title: "", subtitle: "", category: "", isFeatured: false,
  date: "", description: "", longDescription: "", tags: [],
  image: "", techLogos: [], duration: "", teamSize: 1, role: "",
  demoLink: null, githubLink: null,
  technologies: [], contentBlocks: [], challenges: [], solutions: [], results: [],
};

/* ══════════════════════════════════════════════════════════
   STİL SABİTLERİ
══════════════════════════════════════════════════════════ */
const INPUT: React.CSSProperties = {
  width: "100%", background: "#12121c", border: "1px solid #252535",
  borderRadius: 8, color: "#e2e2e8", fontSize: 13,
  padding: "10px 14px", outline: "none", boxSizing: "border-box",
};
const TEXTAREA: React.CSSProperties = { ...INPUT, resize: "vertical" as const, minHeight: 80, lineHeight: 1.6 };
const CODE_AREA: React.CSSProperties = { ...TEXTAREA, minHeight: 120, fontFamily: "monospace", fontSize: 12, lineHeight: 1.5 };

function iFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) { e.target.style.borderColor = "#8750f7"; }
function iBlur (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) { e.target.style.borderColor = "#252535"; }

/* ══════════════════════════════════════════════════════════
   KÜÇÜK BİLEŞENLER
══════════════════════════════════════════════════════════ */
function SaveBtn({ onClick, loading, label = "Kaydet" }: { onClick: () => void; loading: boolean; label?: string }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      background: loading ? "#6340b5" : "#8750f7", color: "#fff",
      border: "none", borderRadius: 10, padding: "10px 22px",
      fontSize: 13, fontWeight: 600,
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1, whiteSpace: "nowrap" as const,
    }}>
      {loading ? "Kaydediliyor…" : label}
    </button>
  );
}

function GhostBtn({ onClick, children, danger = false, small = false, disabled = false }: {
  onClick?: () => void; children: React.ReactNode;
  danger?: boolean; small?: boolean; disabled?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: danger ? "#7f1d1d" : "transparent",
      border: danger ? "none" : "1px solid #1e1e2e",
      borderRadius: 7, color: danger ? "#fca5a5" : "#9898a8",
      padding: small ? "5px 10px" : "8px 16px",
      fontSize: small ? 12 : 13,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
    }}>
      {children}
    </button>
  );
}

function TealBtn({ onClick, children, small = false }: { onClick?: () => void; children: React.ReactNode; small?: boolean }) {
  return (
    <button onClick={onClick} style={{
      background: "#0f2e2e", border: "1px solid #134040",
      borderRadius: 8, color: "#5eead4",
      padding: small ? "4px 10px" : "8px 14px",
      fontSize: small ? 12 : 13, cursor: "pointer",
    }}>
      {children}
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
    }}>
      {text}
    </div>
  );
}

function Pill({ children, bg, color }: { children: React.ReactNode; bg: string; color: string }) {
  return <span style={{ background: bg, color, borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{children}</span>;
}

function Field({ label, children, span }: { label: string; children: React.ReactNode; span?: boolean }) {
  return (
    <div style={{ gridColumn: span ? "1 / -1" : undefined }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <div style={{ width: 2, height: 12, background: "#8750f7", borderRadius: 1, flexShrink: 0 }} />
        <label style={{ color: "#9898b8", fontSize: 12, fontWeight: 500 }}>{label}</label>
      </div>
      {children}
    </div>
  );
}

function SCard({ title, accent, children }: { title: string; accent?: boolean; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#10101a",
      border: `1px solid ${accent ? "#1e3a2a" : "#1e1e2e"}`,
      borderRadius: 16, padding: "22px 24px",
    }}>
      <div style={{
        color: accent ? "#4ade80" : "#52525e", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 16,
      }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ImgField
══════════════════════════════════════════════════════════ */
function ImgField({ value, onChange, label = "Görsel" }: { value: string; onChange: (v: string) => void; label?: string }) {
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"url" | "upload">(value && !value.startsWith("http") ? "upload" : "url");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((res, rej) => {
        reader.onload = e => res((e.target?.result as string).split(",")[1]);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      const res = await fetch("/api/admin/projects-upload", {
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 2, height: 12, background: "#8750f7", borderRadius: 1 }} />
          <label style={{ color: "#9898b8", fontSize: 12, fontWeight: 500 }}>{label}</label>
        </div>
        <div style={{ display: "flex", gap: 2, background: "#0a0a12", borderRadius: 6, padding: 2 }}>
          {(["url", "upload"] as const).map(t => (
            <button key={t} type="button" onClick={() => setTab(t)} style={{
              padding: "2px 10px", borderRadius: 5, border: "none", cursor: "pointer", fontSize: 11,
              background: tab === t ? "#8750f730" : "transparent",
              color: tab === t ? "#a78bfa" : "#52525e",
            }}>
              {t === "url" ? "🔗 URL" : "📁 Dosya"}
            </button>
          ))}
        </div>
      </div>
      {tab === "url" ? (
        <input value={value} onChange={e => onChange(e.target.value)} style={INPUT}
          placeholder="https://… veya /assets/images/…" onFocus={iFocus} onBlur={iBlur} />
      ) : (
        <div>
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.gif" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{
            ...INPUT, cursor: "pointer", textAlign: "left" as const,
            color: value && !value.startsWith("http") ? "#e2e2e8" : "#52525e",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
          }}>
            {uploading ? "Yükleniyor…" : value && !value.startsWith("http") ? value : "Dosya seç…"}
          </button>
        </div>
      )}
      {value && (
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
          <img src={value} alt="önizleme"
            style={{ width: 64, height: 44, objectFit: "cover", borderRadius: 6, border: "1px solid #1e1e2e", flexShrink: 0 }}
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

/* ══════════════════════════════════════════════════════════
   LinkField
══════════════════════════════════════════════════════════ */
function LinkField({ value, onChange, label, placeholder }: {
  value: string | null; onChange: (v: string | null) => void; label: string; placeholder?: string;
}) {
  const val = value ?? "";
  return (
    <Field label={label}>
      <input value={val} onChange={e => onChange(e.target.value || null)}
        style={INPUT} placeholder={placeholder ?? "https://…"} onFocus={iFocus} onBlur={iBlur} />
      {val && val !== "#" && (
        <a href={val} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 5, color: "#8750f7", fontSize: 11, textDecoration: "none" }}>↗ Önizle</a>
      )}
    </Field>
  );
}

/* ══════════════════════════════════════════════════════════
   CONTENT BLOCKS
══════════════════════════════════════════════════════════ */
const BLOCK_TYPES = [
  { value: 0, label: "Metin",        icon: "¶",   color: "#6366f1" },
  { value: 1, label: "Tek Görsel",   icon: "⬜",   color: "#0891b2" },
  { value: 2, label: "Video",        icon: "▶",   color: "#be185d" },
  { value: 3, label: "Çoklu Görsel", icon: "⬛",   color: "#7c3aed" },
  { value: 4, label: "Kod",          icon: "</>", color: "#059669" },
];
const bColor = (t: number) => BLOCK_TYPES.find(b => b.value === t)?.color ?? "#444";
const bLabel = (t: number) => { const b = BLOCK_TYPES.find(x => x.value === t); return b ? `${b.icon} ${b.label}` : `Tip ${t}`; };

function ContentBlocksEditor({ blocks, onChange }: { blocks: ContentBlock[]; onChange: (b: ContentBlock[]) => void }) {
  function add(type: number) {
    let nb: ContentBlock;
    if      (type === 0) nb = { type: 0, heading: "", subheading: "", content: "" };
    else if (type === 1) nb = { type: 1, heading: "", imageUrl: "", caption: "" };
    else if (type === 2) nb = { type: 2, heading: "", videoUrl: "", posterUrl: "", caption: "" };
    else if (type === 3) nb = { type: 3, heading: "", images: [{ url: "", alt: "", caption: "" }] };
    else                 nb = { type: 4, heading: "", codeBlocks: [{ language: "javascript", label: "JS", code: "" }], defaultTab: 0 };
    onChange([...blocks, nb]);
  }
  function rm(i: number) { if (!confirm("Silinsin mi?")) return; onChange(blocks.filter((_, j) => j !== i)); }
  function mv(i: number, dir: -1 | 1) {
    const a = [...blocks], j = i + dir;
    if (j < 0 || j >= a.length) return;
    [a[i], a[j]] = [a[j], a[i]]; onChange(a);
  }
  function upd(i: number, patch: Partial<ContentBlock>) {
    const a = [...blocks]; a[i] = { ...a[i], ...patch } as ContentBlock; onChange(a);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {blocks.length === 0 && (
        <div style={{ color: "#52525e", fontSize: 13, padding: "20px 0", textAlign: "center" as const }}>Henüz blok yok.</div>
      )}
      {blocks.map((block, i) => (
        <div key={i} style={{
          background: "#0d0d14", border: "1px solid #1e1e2e",
          borderLeft: `3px solid ${bColor(block.type)}`,
          borderRadius: 12, overflow: "hidden",
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 16px", background: "#10101a", borderBottom: "1px solid #1a1a28",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: bColor(block.type), fontSize: 12, fontWeight: 700 }}>{bLabel(block.type)}</span>
              <span style={{ color: "#3a3a50", fontSize: 11 }}>#{i + 1}</span>
              {(block as { heading?: string }).heading && (
                <span style={{ color: "#52525e", fontSize: 11, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                  — {(block as { heading?: string }).heading}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              <GhostBtn onClick={() => mv(i, -1)} small disabled={i === 0}>↑</GhostBtn>
              <GhostBtn onClick={() => mv(i, 1)}  small disabled={i === blocks.length - 1}>↓</GhostBtn>
              <GhostBtn onClick={() => rm(i)} danger small>Sil</GhostBtn>
            </div>
          </div>
          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            <Field label="Başlık">
              <input value={(block as { heading: string }).heading}
                onChange={e => upd(i, { heading: e.target.value } as Partial<ContentBlock>)}
                style={INPUT} onFocus={iFocus} onBlur={iBlur} />
            </Field>
            {block.type === 0 && (<>
              <Field label="Alt Başlık"><input value={block.subheading || ""} onChange={e => upd(i, { subheading: e.target.value })} style={INPUT} onFocus={iFocus} onBlur={iBlur} /></Field>
              <Field label="İçerik"><textarea value={block.content} onChange={e => upd(i, { content: e.target.value })} style={{ ...TEXTAREA, minHeight: 140 }} onFocus={iFocus} onBlur={iBlur} /></Field>
            </>)}
            {block.type === 1 && (<>
              <Field label="Görsel URL"><input value={block.imageUrl} onChange={e => upd(i, { imageUrl: e.target.value })} style={INPUT} onFocus={iFocus} onBlur={iBlur} /></Field>
              {block.imageUrl && <img src={block.imageUrl} alt="önizleme" style={{ maxHeight: 140, objectFit: "contain", borderRadius: 6, border: "1px solid #1e1e2e" }} />}
              <Field label="Altyazı"><input value={block.caption} onChange={e => upd(i, { caption: e.target.value })} style={INPUT} onFocus={iFocus} onBlur={iBlur} /></Field>
            </>)}
            {block.type === 2 && (<>
              <Field label="Video URL"><input value={block.videoUrl} onChange={e => upd(i, { videoUrl: e.target.value })} style={INPUT} onFocus={iFocus} onBlur={iBlur} /></Field>
              <Field label="Poster URL"><input value={block.posterUrl} onChange={e => upd(i, { posterUrl: e.target.value })} style={INPUT} onFocus={iFocus} onBlur={iBlur} /></Field>
              {block.posterUrl && <img src={block.posterUrl} alt="poster" style={{ maxHeight: 100, objectFit: "contain", borderRadius: 6, border: "1px solid #1e1e2e" }} />}
              <Field label="Altyazı"><input value={block.caption} onChange={e => upd(i, { caption: e.target.value })} style={INPUT} onFocus={iFocus} onBlur={iBlur} /></Field>
            </>)}
            {block.type === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {block.images.map((img, j) => (
                  <div key={j} style={{ background: "#12121c", border: "1px solid #1e1e2e", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ color: "#52525e", fontSize: 11 }}>Görsel #{j + 1}</span>
                      <GhostBtn onClick={() => upd(i, { images: block.images.filter((_, k) => k !== j) })} danger small>Sil</GhostBtn>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8, marginBottom: 8 }}>
                      <Field label="URL"><input value={img.url} onChange={e => { const imgs = [...block.images]; imgs[j] = { ...imgs[j], url: e.target.value }; upd(i, { images: imgs }); }} style={INPUT} onFocus={iFocus} onBlur={iBlur} /></Field>
                      <Field label="Alt Text"><input value={img.alt} onChange={e => { const imgs = [...block.images]; imgs[j] = { ...imgs[j], alt: e.target.value }; upd(i, { images: imgs }); }} style={INPUT} onFocus={iFocus} onBlur={iBlur} /></Field>
                    </div>
                    <Field label="Altyazı"><input value={img.caption} onChange={e => { const imgs = [...block.images]; imgs[j] = { ...imgs[j], caption: e.target.value }; upd(i, { images: imgs }); }} style={INPUT} onFocus={iFocus} onBlur={iBlur} /></Field>
                    {img.url && <img src={img.url} alt="önizleme" style={{ marginTop: 8, maxHeight: 80, objectFit: "contain", borderRadius: 5, border: "1px solid #1e1e2e" }} />}
                  </div>
                ))}
                <TealBtn onClick={() => upd(i, { images: [...block.images, { url: "", alt: "", caption: "" }] })} small>+ Görsel Ekle</TealBtn>
              </div>
            )}
            {block.type === 4 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {block.codeBlocks.map((cb, j) => (
                  <div key={j} style={{ background: "#0a0a12", border: "1px solid #1e1e2e", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ color: "#059669", fontSize: 11, fontFamily: "monospace" }}>Tab #{j + 1}</span>
                      <GhostBtn onClick={() => upd(i, { codeBlocks: block.codeBlocks.filter((_, k) => k !== j), defaultTab: 0 })} danger small>Sil</GhostBtn>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                      <Field label="Dil"><input value={cb.language} onChange={e => { const cbs = [...block.codeBlocks]; cbs[j] = { ...cbs[j], language: e.target.value }; upd(i, { codeBlocks: cbs }); }} style={INPUT} onFocus={iFocus} onBlur={iBlur} /></Field>
                      <Field label="Etiket"><input value={cb.label} onChange={e => { const cbs = [...block.codeBlocks]; cbs[j] = { ...cbs[j], label: e.target.value }; upd(i, { codeBlocks: cbs }); }} style={INPUT} onFocus={iFocus} onBlur={iBlur} /></Field>
                    </div>
                    <Field label="Kod">
                      <textarea value={cb.code} onChange={e => { const cbs = [...block.codeBlocks]; cbs[j] = { ...cbs[j], code: e.target.value }; upd(i, { codeBlocks: cbs }); }} style={CODE_AREA} spellCheck={false} onFocus={iFocus} onBlur={iBlur} />
                    </Field>
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <TealBtn onClick={() => upd(i, { codeBlocks: [...block.codeBlocks, { language: "javascript", label: "Tab", code: "" }] })} small>+ Tab Ekle</TealBtn>
                  <Field label="Varsayılan Tab">
                    <input type="number" min={0} max={block.codeBlocks.length - 1} value={block.defaultTab}
                      onChange={e => upd(i, { defaultTab: Number(e.target.value) })}
                      style={{ ...INPUT, width: 70 }} onFocus={iFocus} onBlur={iBlur} />
                  </Field>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      <div style={{ background: "#0d0d14", border: "1px dashed #1e1e2e", borderRadius: 12, padding: "16px 18px" }}>
        <div style={{ color: "#3a3a50", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 10 }}>Blok Ekle</div>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
          {BLOCK_TYPES.map(bt => (
            <button key={bt.value} onClick={() => add(bt.value)} style={{
              background: "transparent", border: `1px solid ${bt.color}40`,
              borderRadius: 8, padding: "7px 14px",
              color: bt.color, fontSize: 12, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ fontFamily: "monospace" }}>{bt.icon}</span>{bt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ANA SAYFA
══════════════════════════════════════════════════════════ */
export default function ProjectsPage() {
  const { locale } = useLocaleContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [view, setView]         = useState<"list" | "form">("list");
  const [editing, setEditing]   = useState<Project | null>(null);
  const [form, setForm]         = useState<Omit<Project, "id" | "_file">>(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState("");
  const [toast, setToast]       = useState<{ ok: boolean; text: string } | null>(null);
  const [tab, setTab]           = useState<"general" | "blocks" | "meta">("general");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/projects?locale=${locale}`)
      .then(r => r.json())
      .then(d => setProjects(Array.isArray(d) ? d : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, [locale]);

  function showToast(ok: boolean, text: string) { setToast({ ok, text }); setTimeout(() => setToast(null), 3000); }

  function openNew() { setForm(EMPTY); setEditing(null); setTab("general"); setView("form"); }
  function openEdit(p: Project) {
    const { id: _id, _file: _f, ...rest } = p;
    setForm({
      ...EMPTY, ...rest,
      tags: Array.isArray(rest.tags) ? rest.tags : [],
      techLogos: Array.isArray(rest.techLogos) ? rest.techLogos : [],
      technologies: Array.isArray(rest.technologies) ? rest.technologies : [],
      contentBlocks: Array.isArray(rest.contentBlocks) ? rest.contentBlocks : [],
      challenges: Array.isArray(rest.challenges) ? rest.challenges : [],
      solutions: Array.isArray(rest.solutions) ? rest.solutions : [],
      results: Array.isArray(rest.results) ? rest.results : [],
    });
    setEditing(p); setTab("general"); setView("form");
  }

  function setF<K extends keyof typeof form>(k: K, v: (typeof form)[K]) { setForm(f => ({ ...f, [k]: v })); }
  function splitLines(v: string) { return v.split("\n").map(s => s.trim()).filter(Boolean); }

  async function save() {
    if (!form.title.trim()) { showToast(false, "Başlık zorunlu."); return; }
    setSaving(true);
    try {
      const isEdit = editing !== null;
      const res = await fetch(
        isEdit ? `/api/admin/projects/${editing!.id}?locale=${locale}` : `/api/admin/projects?locale=${locale}`,
        { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }
      );
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(true, isEdit ? "Kaydedildi ✓" : "Proje oluşturuldu ✓");
      fetch(`/api/admin/projects?locale=${locale}`).then(r => r.json()).then(d => setProjects(Array.isArray(d) ? d : []));
      if (!isEdit) setView("list");
    } catch (e: unknown) { showToast(false, (e as Error).message || "Hata"); }
    finally { setSaving(false); }
  }

  async function del(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Bu projeyi silmek istiyor musunuz?")) return;
    try {
      await fetch(`/api/admin/projects/${id}?locale=${locale}`, { method: "DELETE" });
      showToast(true, "Silindi.");
      setProjects(p => p.filter(x => x.id !== id));
    } catch { showToast(false, "Silinemedi."); }
  }

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(search.toLowerCase())
  );

  const featuredCount = projects.filter(p => p.isFeatured).length;

  /* ══════ LİSTE — GRID KARTI ══════ */
  if (view === "list") return (
    <div style={{ paddingBottom: 80 }}>
      {toast && <Toast {...toast} />}

      {/* Başlık */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 3, height: 24, background: "#8750f7", borderRadius: 2, flexShrink: 0 }} />
            <h1 style={{ color: "#e2e2e8", fontSize: 24, fontWeight: 700, lineHeight: 1 }}>Projeler</h1>
          </div>
          <div style={{ marginLeft: 13, display: "flex", alignItems: "center", gap: 10 }}>
            <code style={{ color: "#6d6d8a", fontSize: 12, background: "#12121c", padding: "3px 8px", borderRadius: 5, border: "1px solid #1e1e2e" }}>
              messages/projects/details/{locale}/
            </code>
          </div>
        </div>
        <button onClick={openNew} style={{
          background: "#8750f7", color: "#fff", border: "none", borderRadius: 10,
          padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" as const,
        }}>
          <span style={{ fontSize: 16 }}>+</span> Yeni Proje
        </button>
      </div>

      {/* Arama + istatistik */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, gap: 12 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#52525e" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Proje adı veya kategori ile ara…"
            style={{ ...INPUT, paddingLeft: 38 }} onFocus={iFocus} onBlur={iBlur} />
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {featuredCount > 0 && (
            <div style={{ background: "#8750f715", border: "1px solid #8750f730", borderRadius: 8, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#a78bfa" }} />
              <span style={{ color: "#a78bfa", fontSize: 12, fontWeight: 600 }}>{featuredCount} öne çıkan</span>
            </div>
          )}
          <div style={{ background: "#0f2018", border: "1px solid #14532d30", borderRadius: 8, padding: "6px 14px" }}>
            <span style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>{projects.length} toplam</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ color: "#52525e", fontSize: 13, padding: "60px 0", textAlign: "center" as const }}>Yükleniyor…</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "48px 24px", textAlign: "center" as const }}>
          <p style={{ color: "#52525e", fontSize: 14 }}>{search ? "Arama sonucu yok." : "Henüz proje yok."}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {filtered.map(p => (
            <div key={p.id}
              onClick={() => openEdit(p)}
              style={{
                background: "#10101a", border: "1px solid #1e1e2e",
                borderRadius: 16, overflow: "hidden", cursor: "pointer",
                transition: "border-color 0.15s, transform 0.1s",
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#8750f750"; el.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#1e1e2e"; el.style.transform = "translateY(0)"; }}
            >
              {/* Görsel / Thumbnail */}
              <div style={{ width: "100%", height: 140, background: "#12121c", position: "relative", overflow: "hidden" }}>
                {p.image ? (
                  <img src={p.image} alt={p.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => (e.currentTarget as HTMLImageElement).style.display = "none"} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#2a2a3a", fontSize: 36 }}>⬡</span>
                  </div>
                )}
                {/* Öne çıkan badge */}
                {p.isFeatured && (
                  <div style={{ position: "absolute", top: 10, left: 10, background: "#1e1b4b", color: "#a5b4fc", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 600 }}>
                    Öne Çıkan
                  </div>
                )}
                {/* Aksiyon butonları */}
                <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 6 }}
                  onClick={e => e.stopPropagation()}>
                  <button onClick={() => openEdit(p)} style={{
                    background: "#0d0d14cc", border: "1px solid #1e1e2e", borderRadius: 7,
                    color: "#9898a8", padding: "4px 9px", fontSize: 11, cursor: "pointer",
                    backdropFilter: "blur(4px)",
                  }}>
                    Düzenle
                  </button>
                  <button onClick={e => del(p.id, e)} style={{
                    background: "#7f1d1dcc", border: "none", borderRadius: 7,
                    color: "#fca5a5", padding: "4px 9px", fontSize: 11, cursor: "pointer",
                    backdropFilter: "blur(4px)",
                  }}>
                    Sil
                  </button>
                </div>
              </div>

              {/* Kart gövdesi */}
              <div style={{ padding: "14px 16px 16px" }}>
                {/* Etiketler */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" as const }}>
                  {p.category && <Pill bg="#0c1a1f" color="#67e8f9">{p.category}</Pill>}
                  {p.contentBlocks?.length > 0 && <Pill bg="#0f2018" color="#4ade80">{p.contentBlocks.length} blok</Pill>}
                </div>

                {/* Başlık */}
                <div style={{ color: "#e2e2e8", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  {p.title || "—"}
                </div>

                {/* Açıklama */}
                <div style={{
                  color: "#52525e", fontSize: 12, lineHeight: 1.5,
                  overflow: "hidden", display: "-webkit-box",
                  WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const,
                  marginBottom: 12,
                }}>
                  {p.subtitle || p.description || "—"}
                </div>

                {/* Meta bilgiler */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 10, borderTop: "1px solid #1a1a28" }}>
                  {p.date && <span style={{ color: "#3a3a50", fontSize: 11 }}>{p.date}</span>}
                  {p.date && p.duration && <span style={{ color: "#2a2a3a", fontSize: 11 }}>·</span>}
                  {p.duration && <span style={{ color: "#3a3a50", fontSize: 11 }}>{p.duration}</span>}
                  {(p.date || p.duration) && p.role && <span style={{ color: "#2a2a3a", fontSize: 11 }}>·</span>}
                  {p.role && <span style={{ color: "#3a3a50", fontSize: 11 }}>{p.role}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* ══════ FORM ══════ */
  return (
    <div style={{ paddingBottom: 80 }}>
      {toast && <Toast {...toast} />}

      {/* Form başlığı */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setView("list")} style={{
            background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 10,
            color: "#9898a8", cursor: "pointer", fontSize: 18, padding: "6px 12px", lineHeight: 1,
          }}>←</button>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 3, height: 24, background: "#8750f7", borderRadius: 2, flexShrink: 0 }} />
              <h1 style={{ color: "#e2e2e8", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
                {editing ? editing.title || "Proje Düzenle" : "Yeni Proje"}
              </h1>
            </div>
            <div style={{ marginLeft: 13 }}>
              <span style={{ color: "#52525e", fontSize: 12 }}>
                {editing ? "Mevcut projeyi düzenliyorsunuz" : "Yeni bir proje oluşturuyorsunuz"}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <GhostBtn onClick={() => setView("list")}>İptal</GhostBtn>
          <SaveBtn onClick={save} loading={saving} label={editing ? "Kaydet" : "Oluştur"} />
        </div>
      </div>

      {/* Sekmeler */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#0a0a12", border: "1px solid #1a1a28", borderRadius: 12, padding: 4 }}>
        {([
          { key: "general" as const, label: "⚙ Genel" },
          { key: "blocks"  as const, label: `◈ Bloklar (${form.contentBlocks.length})` },
          { key: "meta"    as const, label: "◆ Meta" },
        ]).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: "10px 16px", border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: tab === t.key ? 600 : 400, borderRadius: 8,
            background: tab === t.key ? "#8750f7" : "transparent",
            color: tab === t.key ? "#fff" : "#52525e",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {tab === "general" && <>
          <SCard title="Temel Bilgiler">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              <Field label="Başlık *"><input value={form.title} onChange={e => setF("title", e.target.value)} style={INPUT} onFocus={iFocus} onBlur={iBlur} /></Field>
              <Field label="Alt Başlık"><input value={form.subtitle} onChange={e => setF("subtitle", e.target.value)} style={INPUT} onFocus={iFocus} onBlur={iBlur} /></Field>
              <Field label="Kategori"><input value={form.category} onChange={e => setF("category", e.target.value)} style={INPUT} placeholder="webDevelopment" onFocus={iFocus} onBlur={iBlur} /></Field>
              <Field label="Tarih"><input value={form.date} onChange={e => setF("date", e.target.value)} style={INPUT} placeholder="2025-03" onFocus={iFocus} onBlur={iBlur} /></Field>
              <Field label="Süre"><input value={form.duration} onChange={e => setF("duration", e.target.value)} style={INPUT} placeholder="3 ay" onFocus={iFocus} onBlur={iBlur} /></Field>
              <Field label="Ekip"><input type="number" min={1} value={form.teamSize} onChange={e => setF("teamSize", Number(e.target.value))} style={INPUT} onFocus={iFocus} onBlur={iBlur} /></Field>
              <Field label="Rol"><input value={form.role} onChange={e => setF("role", e.target.value)} style={INPUT} onFocus={iFocus} onBlur={iBlur} /></Field>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={form.isFeatured} onChange={e => setF("isFeatured", e.target.checked)} style={{ width: 14, height: 14, accentColor: "#8750f7" }} />
              <span style={{ color: "#9898a8", fontSize: 13 }}>Öne Çıkan Proje</span>
            </label>
          </SCard>

          <SCard title="Görsel & Bağlantılar">
            <ImgField value={form.image} onChange={v => setF("image", v)} label="Proje Görseli" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <LinkField value={form.demoLink} onChange={v => setF("demoLink", v)} label="Demo Link" placeholder="https://demo.example.com" />
              <LinkField value={form.githubLink} onChange={v => setF("githubLink", v)} label="GitHub Link" placeholder="https://github.com/…" />
            </div>
          </SCard>

          <SCard title="Açıklamalar">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Kısa Açıklama"><textarea value={form.description} onChange={e => setF("description", e.target.value)} style={TEXTAREA} onFocus={iFocus} onBlur={iBlur} /></Field>
              <Field label="Uzun Açıklama"><textarea value={form.longDescription} onChange={e => setF("longDescription", e.target.value)} style={{ ...TEXTAREA, minHeight: 120 }} onFocus={iFocus} onBlur={iBlur} /></Field>
            </div>
          </SCard>

          <SCard title="Etiketler & Logolar">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Etiketler (her satıra bir tane)"><textarea value={form.tags.join("\n")} onChange={e => setF("tags", splitLines(e.target.value))} style={TEXTAREA} onFocus={iFocus} onBlur={iBlur} /></Field>
              <Field label="Tech Logo Adları (her satıra bir tane)"><textarea value={form.techLogos.join("\n")} onChange={e => setF("techLogos", splitLines(e.target.value))} style={TEXTAREA} onFocus={iFocus} onBlur={iBlur} /></Field>
            </div>
          </SCard>

          <SCard title="Kullanılan Teknolojiler">
            {form.technologies.map((t, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 32px", gap: 8 }}>
                <input value={t.name} onChange={e => { const a = [...form.technologies]; a[i] = { ...a[i], name: e.target.value }; setF("technologies", a); }} style={INPUT} placeholder="Teknoloji" onFocus={iFocus} onBlur={iBlur} />
                <input value={t.description} onChange={e => { const a = [...form.technologies]; a[i] = { ...a[i], description: e.target.value }; setF("technologies", a); }} style={INPUT} placeholder="Nasıl kullanıldı" onFocus={iFocus} onBlur={iBlur} />
                <button onClick={() => setF("technologies", form.technologies.filter((_, j) => j !== i))} style={{ background: "#3f1010", border: "none", borderRadius: 8, color: "#fca5a5", cursor: "pointer", fontSize: 14 }}>✕</button>
              </div>
            ))}
            <GhostBtn onClick={() => setF("technologies", [...form.technologies, { name: "", description: "" }])} small>+ Ekle</GhostBtn>
          </SCard>
        </>}

        {tab === "blocks" && (
          <SCard title="İçerik Blokları" accent>
            <ContentBlocksEditor blocks={form.contentBlocks} onChange={b => setF("contentBlocks", b)} />
          </SCard>
        )}

        {tab === "meta" && <>
          <SCard title="Zorluklar & Çözümler">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Zorluklar (her satıra bir tane)"><textarea value={form.challenges.join("\n")} onChange={e => setF("challenges", splitLines(e.target.value))} style={TEXTAREA} onFocus={iFocus} onBlur={iBlur} /></Field>
              <Field label="Çözümler (her satıra bir tane)"><textarea value={form.solutions.join("\n")} onChange={e => setF("solutions", splitLines(e.target.value))} style={TEXTAREA} onFocus={iFocus} onBlur={iBlur} /></Field>
            </div>
          </SCard>

          <SCard title="Sonuçlar / Metrikler">
            {form.results.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 2fr 32px", gap: 8 }}>
                <input value={r.metric} onChange={e => { const a = [...form.results]; a[i] = { ...a[i], metric: e.target.value }; setF("results", a); }} style={INPUT} placeholder="Metrik" onFocus={iFocus} onBlur={iBlur} />
                <input value={r.value} onChange={e => { const a = [...form.results]; a[i] = { ...a[i], value: e.target.value }; setF("results", a); }} style={INPUT} placeholder="92%" onFocus={iFocus} onBlur={iBlur} />
                <input value={r.description} onChange={e => { const a = [...form.results]; a[i] = { ...a[i], description: e.target.value }; setF("results", a); }} style={INPUT} placeholder="Açıklama" onFocus={iFocus} onBlur={iBlur} />
                <button onClick={() => setF("results", form.results.filter((_, j) => j !== i))} style={{ background: "#3f1010", border: "none", borderRadius: 8, color: "#fca5a5", cursor: "pointer", fontSize: 14 }}>✕</button>
              </div>
            ))}
            <GhostBtn onClick={() => setF("results", [...form.results, { metric: "", value: "", description: "" }])} small>+ Ekle</GhostBtn>
          </SCard>
        </>}

        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 4 }}>
          <GhostBtn onClick={() => setView("list")}>← Listeye Dön</GhostBtn>
          <SaveBtn onClick={save} loading={saving} label={editing ? "Kaydet" : "Oluştur"} />
        </div>
      </div>
    </div>
  );
}