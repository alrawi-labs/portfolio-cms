"use client";

import { useEffect, useState, useRef } from "react";

/* ══════════════════════════════════════════════════════════
   TİPLER
══════════════════════════════════════════════════════════ */
type BlogAuthor = { name: string; avatar?: string; title?: string };

type ContentBlock =
  | { type: 0; heading?: string; content: string }
  | { type: 1; imageUrl: string; caption?: string }
  | { type: 2; language: string; code: string }
  | { type: 3; quote: string };

type BlogPost = {
  id: string; slug: string; title: string; subtitle?: string;
  excerpt: string; category: string; tags: string[];
  coverImage: string; author: BlogAuthor;
  publishedAt: string; updatedAt?: string;
  readingTime: number; isFeatured?: boolean;
  contentBlocks: ContentBlock[];
};

const EMPTY_POST: Omit<BlogPost, "id"> = {
  slug: "", title: "", subtitle: "", excerpt: "",
  category: "webDevelopment", tags: [],
  coverImage: "", author: { name: "", avatar: "", title: "" },
  publishedAt: new Date().toISOString().split("T")[0],
  readingTime: 5, isFeatured: false, contentBlocks: [],
};

const CATEGORIES: Record<string, string> = {
  webDevelopment: "Web Dev", programming: "Programming",
  design: "Design", aiMl: "AI / ML", career: "Career",
};

/* ══════════════════════════════════════════════════════════
   STİL SABİTLERİ  (Projeler temasıyla aynı)
══════════════════════════════════════════════════════════ */
const INPUT: React.CSSProperties = {
  width: "100%", background: "#12121c", border: "1px solid #252535",
  borderRadius: 8, color: "#e2e2e8", fontSize: 13,
  padding: "10px 14px", outline: "none", boxSizing: "border-box",
};
const TEXTAREA: React.CSSProperties = { ...INPUT, resize: "vertical" as const, minHeight: 90, lineHeight: 1.6 };
const CODE_AREA: React.CSSProperties = { ...TEXTAREA, minHeight: 140, fontFamily: "monospace", fontSize: 12, lineHeight: 1.5 };

function iFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = "#8750f7";
}
function iBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = "#252535";
}

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

function Pill({ children, bg, color }: { children: React.ReactNode; bg: string; color: string }) {
  return (
    <span style={{ background: bg, color, borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>
      {children}
    </span>
  );
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
function ImgField({ value, onChange, label = "Görsel" }: {
  value: string; onChange: (v: string) => void; label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"url" | "upload">(
    value && !value.startsWith("http") ? "upload" : "url"
  );
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
          placeholder="https://…" onFocus={iFocus} onBlur={iBlur} />
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
            <div style={{maxWidth: "78vw", color: "#52525e", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{value}</div>
            <button type="button" onClick={() => onChange("")}
              style={{ background: "transparent", border: "none", color: "#f87171", fontSize: 11, cursor: "pointer", padding: 0, marginTop: 2 }}>
              Kaldır
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CONTENT BLOCKS EDİTÖRÜ
══════════════════════════════════════════════════════════ */
const BLOCK_TYPES = [
  { value: 0, label: "Metin",  icon: "¶",   color: "#6366f1" },
  { value: 1, label: "Görsel", icon: "⬜",   color: "#0891b2" },
  { value: 2, label: "Kod",    icon: "</>", color: "#059669" },
  { value: 3, label: "Alıntı", icon: "❝",   color: "#a78bfa" },
];
const bColor = (t: number) => BLOCK_TYPES.find(b => b.value === t)?.color ?? "#52525e";
const bLabel = (t: number) => { const b = BLOCK_TYPES.find(x => x.value === t); return b ? `${b.icon} ${b.label}` : `Tip ${t}`; };

function ContentBlocksEditor({ blocks, onChange }: {
  blocks: ContentBlock[]; onChange: (b: ContentBlock[]) => void;
}) {
  function add(type: number) {
    let nb: ContentBlock;
    if      (type === 0) nb = { type: 0, heading: "", content: "" };
    else if (type === 1) nb = { type: 1, imageUrl: "", caption: "" };
    else if (type === 2) nb = { type: 2, language: "javascript", code: "" };
    else                 nb = { type: 3, quote: "" };
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
        <div style={{ color: "#52525e", fontSize: 13, padding: "20px 0", textAlign: "center" as const }}>
          Henüz blok yok.
        </div>
      )}
      {blocks.map((block, i) => (
        <div key={i} style={{
          background: "#0d0d14", border: "1px solid #1e1e2e",
          borderLeft: `3px solid ${bColor(block.type)}`,
          borderRadius: 12, overflow: "hidden",
        }}>
          {/* Blok başlığı */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 16px", background: "#10101a", borderBottom: "1px solid #1a1a28",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: bColor(block.type), fontSize: 12, fontWeight: 700 }}>{bLabel(block.type)}</span>
              <span style={{ color: "#3a3a50", fontSize: 11 }}>#{i + 1}</span>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              <GhostBtn onClick={() => mv(i, -1)} small disabled={i === 0}>↑</GhostBtn>
              <GhostBtn onClick={() => mv(i, 1)}  small disabled={i === blocks.length - 1}>↓</GhostBtn>
              <GhostBtn onClick={() => rm(i)} danger small>Sil</GhostBtn>
            </div>
          </div>

          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {block.type === 0 && (<>
              <Field label="Başlık (opsiyonel)">
                <input value={block.heading || ""} onChange={e => upd(i, { heading: e.target.value })}
                  style={INPUT} placeholder="Bölüm başlığı" onFocus={iFocus} onBlur={iBlur} />
              </Field>
              <Field label="İçerik (** bold ** destekli)">
                <textarea value={block.content} onChange={e => upd(i, { content: e.target.value })}
                  style={{ ...TEXTAREA, minHeight: 160 }} onFocus={iFocus} onBlur={iBlur} />
              </Field>
            </>)}

            {block.type === 1 && (<>
              <Field label="Görsel URL">
                <input value={block.imageUrl} onChange={e => upd(i, { imageUrl: e.target.value })}
                  style={INPUT} onFocus={iFocus} onBlur={iBlur} />
              </Field>
              {block.imageUrl && (
                <img src={block.imageUrl} alt="önizleme"
                  style={{ maxHeight: 140, objectFit: "contain", borderRadius: 6, border: "1px solid #1e1e2e" }} />
              )}
              <Field label="Altyazı">
                <input value={block.caption || ""} onChange={e => upd(i, { caption: e.target.value })}
                  style={INPUT} onFocus={iFocus} onBlur={iBlur} />
              </Field>
            </>)}

            {block.type === 2 && (<>
              <Field label="Dil (syntax highlight)">
                <input value={block.language} onChange={e => upd(i, { language: e.target.value })}
                  style={INPUT} placeholder="javascript, python, java…" onFocus={iFocus} onBlur={iBlur} />
              </Field>
              <Field label="Kod">
                <textarea value={block.code} onChange={e => upd(i, { code: e.target.value })}
                  style={CODE_AREA} spellCheck={false} onFocus={iFocus} onBlur={iBlur} />
              </Field>
            </>)}

            {block.type === 3 && (
              <Field label="Alıntı metni">
                <textarea value={block.quote} onChange={e => upd(i, { quote: e.target.value })}
                  style={TEXTAREA} onFocus={iFocus} onBlur={iBlur} />
              </Field>
            )}
          </div>
        </div>
      ))}

      {/* Blok ekle */}
      <div style={{ background: "#0d0d14", border: "1px dashed #1e1e2e", borderRadius: 12, padding: "16px 18px" }}>
        <div style={{
          color: "#3a3a50", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 10,
        }}>
          Blok Ekle
        </div>
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
export default function BlogAdminPage() {
  const [posts, setPosts]     = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView]       = useState<"list" | "form">("list");
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm]       = useState<Omit<BlogPost, "id">>(EMPTY_POST);
  const [saving, setSaving]   = useState(false);
  const [search, setSearch]   = useState("");
  const [toast, setToast]     = useState<{ ok: boolean; text: string } | null>(null);
  const [tab, setTab]         = useState<"general" | "blocks">("general");

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/blog")
      .then(r => r.json())
      .then(d => setPosts(Array.isArray(d) ? d : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  function showToast(ok: boolean, text: string) {
    setToast({ ok, text });
    setTimeout(() => setToast(null), 3000);
  }

  function openNew() {
    setForm({ ...EMPTY_POST, publishedAt: new Date().toISOString().split("T")[0] });
    setEditing(null); setTab("general"); setView("form");
  }
  function openEdit(p: BlogPost) {
    const { id: _id, ...rest } = p;
    setForm({ ...EMPTY_POST, ...rest, contentBlocks: Array.isArray(rest.contentBlocks) ? rest.contentBlocks : [] });
    setEditing(p); setTab("general"); setView("form");
  }

  function setF<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }

  async function save() {
    if (!form.title.trim()) { showToast(false, "Başlık zorunlu."); return; }
    setSaving(true);
    try {
      const isEdit = editing !== null;
      const url    = isEdit ? `/api/admin/blog/${editing!.id}` : "/api/admin/blog";
      const res    = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const saved = await res.json();
      setPosts(p => isEdit ? p.map(x => x.id === editing!.id ? saved : x) : [...p, saved]);
      showToast(true, isEdit ? "Kaydedildi ✓" : "Yazı oluşturuldu ✓");
      setView("list");
    } catch (e: unknown) {
      showToast(false, (e as Error).message || "Hata");
    } finally {
      setSaving(false);
    }
  }

  async function del(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Bu yazıyı silmek istiyor musunuz?")) return;
    try {
      await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      setPosts(p => p.filter(x => x.id !== id));
      showToast(true, "Silindi.");
    } catch { showToast(false, "Silinemedi."); }
  }

  const filtered      = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(search.toLowerCase())
  );
  const featuredCount = posts.filter(p => p.isFeatured).length;

  /* ══════ LİSTE ══════ */
  if (view === "list") return (
    <div style={{ paddingBottom: 80 }}>
      {toast && <Toast {...toast} />}

      {/* Başlık */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 3, height: 24, background: "#8750f7", borderRadius: 2, flexShrink: 0 }} />
            <h1 style={{ color: "#e2e2e8", fontSize: 24, fontWeight: 700, lineHeight: 1 }}>Blog</h1>
          </div>
          <div style={{ marginLeft: 13 }}>
            <code style={{ color: "#6d6d8a", fontSize: 12, background: "#12121c", padding: "3px 8px", borderRadius: 5, border: "1px solid #1e1e2e" }}>
              data/blog.json
            </code>
          </div>
        </div>
        <button onClick={openNew} style={{
          background: "#8750f7", color: "#fff", border: "none", borderRadius: 10,
          padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" as const,
        }}>
          <span style={{ fontSize: 16 }}>+</span> Yeni Yazı
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
            placeholder="Yazı başlığı veya kategori ile ara…"
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
            <span style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>{posts.length} yazı</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ color: "#52525e", fontSize: 13, padding: "60px 0", textAlign: "center" as const }}>Yükleniyor…</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "48px 24px", textAlign: "center" as const }}>
          <p style={{ color: "#52525e", fontSize: 14 }}>{search ? "Arama sonucu yok." : "Henüz yazı yok."}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {filtered.map(p => (
            <div key={p.id} onClick={() => openEdit(p)} style={{
              background: "#10101a", border: "1px solid #1e1e2e",
              borderRadius: 16, overflow: "hidden", cursor: "pointer",
              transition: "border-color 0.15s, transform 0.1s",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#8750f750"; el.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#1e1e2e"; el.style.transform = "translateY(0)"; }}
            >
              {/* Kapak görseli */}
              <div style={{ width: "100%", height: 140, background: "#12121c", position: "relative", overflow: "hidden" }}>
                {p.coverImage ? (
                  <img src={p.coverImage} alt={p.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => (e.currentTarget as HTMLImageElement).style.display = "none"} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#2a2a3a", fontSize: 36 }}>✍</span>
                  </div>
                )}
                {p.isFeatured && (
                  <div style={{ position: "absolute", top: 10, left: 10, background: "#1e1b4b", color: "#a5b4fc", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 600 }}>
                    Öne Çıkan
                  </div>
                )}
                <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 6 }}
                  onClick={e => e.stopPropagation()}>
                  <button onClick={() => openEdit(p)} style={{
                    background: "#0d0d14cc", border: "1px solid #1e1e2e", borderRadius: 7,
                    color: "#9898a8", padding: "4px 9px", fontSize: 11, cursor: "pointer",
                    backdropFilter: "blur(4px)",
                  }}>Düzenle</button>
                  <button onClick={e => del(p.id, e)} style={{
                    background: "#7f1d1dcc", border: "none", borderRadius: 7,
                    color: "#fca5a5", padding: "4px 9px", fontSize: 11, cursor: "pointer",
                    backdropFilter: "blur(4px)",
                  }}>Sil</button>
                </div>
              </div>

              {/* Kart gövdesi */}
              <div style={{ padding: "14px 16px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" as const }}>
                  {p.category && <Pill bg="#0c1a1f" color="#67e8f9">{CATEGORIES[p.category] || p.category}</Pill>}
                  {p.contentBlocks?.length > 0 && <Pill bg="#0f2018" color="#4ade80">{p.contentBlocks.length} blok</Pill>}
                  {p.readingTime > 0 && <Pill bg="#12121c" color="#52525e">{p.readingTime} dk</Pill>}
                </div>
                <div style={{ color: "#e2e2e8", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  {p.title || "—"}
                </div>
                <div style={{
                  color: "#52525e", fontSize: 12, lineHeight: 1.5,
                  overflow: "hidden", display: "-webkit-box",
                  WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, marginBottom: 12,
                }}>
                  {p.excerpt || p.subtitle || "—"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 10, borderTop: "1px solid #1a1a28" }}>
                  {p.author?.name && <span style={{ color: "#3a3a50", fontSize: 11 }}>{p.author.name}</span>}
                  {p.author?.name && p.publishedAt && <span style={{ color: "#2a2a3a", fontSize: 11 }}>·</span>}
                  {p.publishedAt && <span style={{ color: "#3a3a50", fontSize: 11 }}>{p.publishedAt}</span>}
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
                {editing ? editing.title || "Yazıyı Düzenle" : "Yeni Yazı"}
              </h1>
            </div>
            <div style={{ marginLeft: 13 }}>
              <span style={{ color: "#52525e", fontSize: 12 }}>
                {editing ? "Mevcut yazıyı düzenliyorsunuz" : "Yeni bir blog yazısı oluşturuyorsunuz"}
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
          { key: "blocks"  as const, label: `◈ İçerik Blokları (${form.contentBlocks.length})` },
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
              <Field label="Başlık *">
                <input value={form.title} onChange={e => setF("title", e.target.value)} style={INPUT} onFocus={iFocus} onBlur={iBlur} />
              </Field>
              <Field label="Slug (URL)">
                <input value={form.slug} onChange={e => setF("slug", e.target.value)} style={INPUT} placeholder="auto-generated" onFocus={iFocus} onBlur={iBlur} />
              </Field>
              <Field label="Alt Başlık">
                <input value={form.subtitle || ""} onChange={e => setF("subtitle", e.target.value)} style={INPUT} onFocus={iFocus} onBlur={iBlur} />
              </Field>
              <Field label="Kategori">
                <select value={form.category} onChange={e => setF("category", e.target.value)}
                  style={{ ...INPUT, cursor: "pointer" }} onFocus={iFocus} onBlur={iBlur}>
                  {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </Field>
              <Field label="Yayın Tarihi">
                <input type="date" value={form.publishedAt} onChange={e => setF("publishedAt", e.target.value)} style={INPUT} onFocus={iFocus} onBlur={iBlur} />
              </Field>
              <Field label="Okuma Süresi (dk)">
                <input type="number" min={1} value={form.readingTime} onChange={e => setF("readingTime", Number(e.target.value))} style={INPUT} onFocus={iFocus} onBlur={iBlur} />
              </Field>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={!!form.isFeatured} onChange={e => setF("isFeatured", e.target.checked)}
                style={{ width: 14, height: 14, accentColor: "#8750f7" }} />
              <span style={{ color: "#9898a8", fontSize: 13 }}>Öne Çıkan Yazı</span>
            </label>
          </SCard>

          <SCard title="Kapak Görseli">
            <ImgField value={form.coverImage} onChange={v => setF("coverImage", v)} label="Kapak Görseli" />
          </SCard>

          <SCard title="Özet & Etiketler">
            <Field label="Kısa Özet (excerpt)">
              <textarea value={form.excerpt} onChange={e => setF("excerpt", e.target.value)} style={TEXTAREA} onFocus={iFocus} onBlur={iBlur} />
            </Field>
            <Field label="Etiketler (virgülle ayır)">
              <input
                value={form.tags.join(", ")}
                onChange={e => setF("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                style={INPUT} placeholder="Java, OOP, Backend" onFocus={iFocus} onBlur={iBlur} />
            </Field>
          </SCard>

          <SCard title="Yazar Bilgileri">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <Field label="Yazar Adı">
                <input value={form.author.name} onChange={e => setF("author", { ...form.author, name: e.target.value })} style={INPUT} onFocus={iFocus} onBlur={iBlur} />
              </Field>
              <Field label="Unvan">
                <input value={form.author.title || ""} onChange={e => setF("author", { ...form.author, title: e.target.value })} style={INPUT} placeholder="Full Stack Developer" onFocus={iFocus} onBlur={iBlur} />
              </Field>
              <Field label="Avatar URL">
                <input value={form.author.avatar || ""} onChange={e => setF("author", { ...form.author, avatar: e.target.value })} style={INPUT} onFocus={iFocus} onBlur={iBlur} />
              </Field>
            </div>
          </SCard>
        </>}

        {tab === "blocks" && (
          <SCard title="İçerik Blokları" accent>
            <ContentBlocksEditor blocks={form.contentBlocks} onChange={b => setF("contentBlocks", b)} />
          </SCard>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 4 }}>
          <GhostBtn onClick={() => setView("list")}>← Listeye Dön</GhostBtn>
          <SaveBtn onClick={save} loading={saving} label={editing ? "Kaydet" : "Oluştur"} />
        </div>
      </div>
    </div>
  );
}