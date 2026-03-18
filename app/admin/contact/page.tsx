"use client";

import { useEffect, useState, useRef } from "react";

type SocialLink  = { name: string; icon: string; href: string };
type ContactData = {
  email: string; phone: string; location: string;
  cvPath: string; projectsPath: string; socialLinks: SocialLink[];
};

const EMPTY: ContactData = {
  email: "", phone: "", location: "", cvPath: "", projectsPath: "", socialLinks: [],
};
const EMPTY_LINK: SocialLink = { name: "", icon: "", href: "" };
const POPULAR_ICONS = ["Github","Linkedin","Twitter","Instagram","Youtube","Facebook","Globe","Mail"];

const INPUT: React.CSSProperties = {
  width: "100%", background: "#12121c", border: "1px solid #252535",
  borderRadius: 8, color: "#e2e2e8", fontSize: 13,
  padding: "10px 14px", outline: "none", boxSizing: "border-box",
};

function iFocus(e: React.FocusEvent<HTMLInputElement|HTMLSelectElement>) { e.target.style.borderColor = "#8750f7"; }
function iBlur (e: React.FocusEvent<HTMLInputElement|HTMLSelectElement>) { e.target.style.borderColor = "#252535"; }

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

/* ── CV Yükleme Alanı ── */
function CvField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
      const res  = await fetch("/api/admin/cv-upload", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, base64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onChange(data.path);
    } catch (e: unknown) { alert((e as Error).message || "Yükleme hatası"); }
    finally { setUploading(false); }
  }

  const fileName = value ? value.split("/").pop() : "";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <div style={{ width: 2, height: 12, background: "#8750f7", borderRadius: 1, flexShrink: 0 }} />
        <label style={{ color: "#9898b8", fontSize: 12, fontWeight: 500 }}>CV Dosyası</label>
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
          placeholder="/assets/docs/cv.pdf veya https://…" onFocus={iFocus} onBlur={iBlur} />
      ) : (
        <div style={{ display: "flex", gap: 8 }}>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{
            ...INPUT, cursor: "pointer", textAlign: "left" as const,
            color: fileName ? "#e2e2e8" : "#6d6d8a",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
          }}>
            {uploading ? "Yükleniyor…" : fileName || "CV dosyası seç… (.pdf, .doc, .docx)"}
          </button>
        </div>
      )}

      {value && (
        <div style={{
          marginTop: 10, display: "flex", alignItems: "center", gap: 12,
          background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 10, padding: "10px 14px",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
            background: "#3f0f0f", border: "1px solid #7f1d1d",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>📄</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#e2e2e8", fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
              {fileName || value}
            </div>
            <div style={{ color: "#52525e", fontSize: 11, marginTop: 2 }}>{value}</div>
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <a href={value} target="_blank" rel="noreferrer" style={{
              background: "#1a1a2e", border: "1px solid #1e1e2e", borderRadius: 7,
              color: "#a78bfa", fontSize: 12, padding: "4px 12px", textDecoration: "none",
            }}>↗ Görüntüle</a>
            <button type="button" onClick={() => onChange("")} style={{
              background: "transparent", border: "1px solid #3f1010", borderRadius: 7,
              color: "#f87171", fontSize: 12, cursor: "pointer", padding: "4px 10px",
            }}>Kaldır</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══ ANA SAYFA ══ */
export default function ContactPage() {
  const [data, setData]       = useState<ContactData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/contact")
      .then(r => r.json())
      .then(d => setData({ ...EMPTY, ...d, socialLinks: Array.isArray(d.socialLinks) ? d.socialLinks : [] }))
      .catch(() => setData(EMPTY))
      .finally(() => setLoading(false));
  }, []);

  function showToast(ok: boolean, text: string) { setToast({ ok, text }); setTimeout(() => setToast(null), 3000); }

  function setField(k: keyof ContactData, v: string) { setData(d => ({ ...d, [k]: v })); }
  function setLink(i: number, k: keyof SocialLink, v: string) {
    setData(d => { const a = [...d.socialLinks]; a[i] = { ...a[i], [k]: v }; return { ...d, socialLinks: a }; });
  }
  function addLink()         { setData(d => ({ ...d, socialLinks: [...d.socialLinks, { ...EMPTY_LINK }] })); }
  function removeLink(i: number) { setData(d => ({ ...d, socialLinks: d.socialLinks.filter((_, j) => j !== i) })); }
  function moveLink(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= data.socialLinks.length) return;
    const a = [...data.socialLinks]; [a[i], a[j]] = [a[j], a[i]];
    setData(d => ({ ...d, socialLinks: a }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/contact", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(true, "İletişim bilgileri kaydedildi ✓");
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
            <h1 style={{ color: "#e2e2e8", fontSize: 24, fontWeight: 700, lineHeight: 1 }}>İletişim</h1>
          </div>
          <div style={{ marginLeft: 13, display: "flex", alignItems: "center", gap: 10 }}>
            <code style={{ color: "#6d6d8a", fontSize: 12, background: "#12121c", padding: "3px 8px", borderRadius: 5, border: "1px solid #1e1e2e" }}>
              data/contacts.ts
            </code>
            <span style={{ color: "#52525e", fontSize: 12 }}>·</span>
            <span style={{ color: "#52525e", fontSize: 12 }}>{data.socialLinks.length} sosyal bağlantı</span>
          </div>
        </div>
        <SaveBtn onClick={save} loading={saving} />
      </div>

      {loading ? (
        <div style={{ color: "#52525e", fontSize: 13, padding: "60px 0", textAlign: "center" as const }}>Yükleniyor…</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ── İletişim Bilgileri ── */}
          <div style={{ background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "24px 26px" }}>
            <div style={{
              color: "#52525e", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase" as const,
              marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #1a1a28",
            }}>
              İletişim Bilgileri
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <Field label="E-posta">
                <input value={data.email} onChange={e => setField("email", e.target.value)}
                  style={INPUT} placeholder="you@example.com" onFocus={iFocus} onBlur={iBlur} />
              </Field>
              <Field label="Telefon">
                <input value={data.phone} onChange={e => setField("phone", e.target.value)}
                  style={INPUT} placeholder="+90 555 000 00 00" onFocus={iFocus} onBlur={iBlur} />
              </Field>
              <Field label="Konum">
                <input value={data.location} onChange={e => setField("location", e.target.value)}
                  style={INPUT} placeholder="İstanbul, Türkiye" onFocus={iFocus} onBlur={iBlur} />
              </Field>
              <Field label="Projeler Sayfası Yolu">
                <input value={data.projectsPath} onChange={e => setField("projectsPath", e.target.value)}
                  style={INPUT} placeholder="/projects" onFocus={iFocus} onBlur={iBlur} />
              </Field>
            </div>
          </div>

          {/* ── CV Dosyası ── */}
          <div style={{ background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "24px 26px" }}>
            <div style={{
              color: "#52525e", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase" as const,
              marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #1a1a28",
            }}>
              CV Dosyası
            </div>
            <CvField value={data.cvPath} onChange={v => setField("cvPath", v)} />
            <div style={{ marginTop: 12, background: "#0d0d14", border: "1px solid #1a1a28", borderRadius: 8, padding: "10px 14px" }}>
              <p style={{ color: "#3a3a50", fontSize: 12 }}>
                💡 Yüklenen dosya <code style={{ color: "#6d6d8a" }}>public/assets/docs/</code> klasörüne kaydedilir.
              </p>
            </div>
          </div>

          {/* ── Sosyal Medya ── */}
          <div style={{ background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "24px 26px" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #1a1a28",
            }}>
              <div>
                <div style={{ color: "#e2e2e8", fontSize: 15, fontWeight: 600, marginBottom: 3 }}>Sosyal Medya</div>
                <div style={{ color: "#52525e", fontSize: 12 }}>İletişim sayfasında görünen bağlantılar</div>
              </div>
              {data.socialLinks.length > 0 && (
                <div style={{ background: "#8750f715", border: "1px solid #8750f730", borderRadius: 7, padding: "3px 10px" }}>
                  <span style={{ color: "#a78bfa", fontSize: 11, fontWeight: 600 }}>{data.socialLinks.length} bağlantı</span>
                </div>
              )}
            </div>

            {data.socialLinks.length === 0 && (
              <div style={{ textAlign: "center" as const, padding: "32px 0", marginBottom: 16 }}>
                <div style={{ color: "#52525e", fontSize: 28, marginBottom: 10 }}>◒</div>
                <p style={{ color: "#52525e", fontSize: 14 }}>Henüz bağlantı eklenmemiş.</p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {data.socialLinks.map((link, i) => (
                <div key={i} style={{
                  background: "#0d0d14", border: "1px solid #1e1e2e",
                  borderLeft: "3px solid #8750f7",
                  borderRadius: 12, overflow: "hidden",
                }}>
                  {/* Kart başlığı */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "11px 18px", background: "#10101a", borderBottom: "1px solid #1a1a28",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: "#3a3a50", fontSize: 11, fontWeight: 600 }}>#{i + 1}</span>
                      {link.icon && (
                        <span style={{ background: "#8750f720", color: "#a78bfa", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>
                          {link.icon}
                        </span>
                      )}
                      {link.name && <span style={{ color: "#9898a8", fontSize: 13 }}>{link.name}</span>}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {([[-1,"↑"],[1,"↓"]] as const).map(([dir,label]) => (
                        <button key={dir} onClick={() => moveLink(i, dir as -1|1)}
                          disabled={dir === -1 ? i === 0 : i === data.socialLinks.length - 1}
                          style={{
                            background: "transparent", border: "1px solid #1e1e2e", borderRadius: 7,
                            color: (dir === -1 ? i === 0 : i === data.socialLinks.length - 1) ? "#2a2a3a" : "#9898a8",
                            padding: "4px 10px", fontSize: 12,
                            cursor: (dir === -1 ? i === 0 : i === data.socialLinks.length - 1) ? "not-allowed" : "pointer",
                          }}>{label}</button>
                      ))}
                      <button onClick={() => removeLink(i)} style={{
                        background: "#7f1d1d", border: "none", borderRadius: 7,
                        color: "#fca5a5", padding: "4px 11px", fontSize: 12, cursor: "pointer",
                      }}>Sil</button>
                    </div>
                  </div>

                  {/* Kart içeriği */}
                  <div style={{ padding: "16px 18px", display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 16 }}>
                    <Field label="Platform Adı">
                      <input value={link.name} onChange={e => setLink(i, "name", e.target.value)}
                        style={INPUT} placeholder="LinkedIn" onFocus={iFocus} onBlur={iBlur} />
                    </Field>
                    <Field label="İkon (Lucide)">
                      <select value={link.icon} onChange={e => setLink(i, "icon", e.target.value)}
                        style={{ ...INPUT, cursor: "pointer" }} onFocus={iFocus} onBlur={iBlur}>
                        <option value="">Seç…</option>
                        {POPULAR_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                      </select>
                    </Field>
                    <Field label="URL">
                      <input value={link.href} onChange={e => setLink(i, "href", e.target.value)}
                        style={INPUT} placeholder="https://linkedin.com/in/…" onFocus={iFocus} onBlur={iBlur} />
                      {link.href && (
                        <a href={link.href} target="_blank" rel="noreferrer" style={{
                          display: "inline-block", marginTop: 6, color: "#8750f7", fontSize: 11, textDecoration: "none",
                        }}>↗ Önizle</a>
                      )}
                    </Field>
                  </div>
                </div>
              ))}
            </div>

            {/* Ekle butonu */}
            <div style={{ marginTop: data.socialLinks.length > 0 ? 14 : 0 }}>
              <button onClick={addLink} style={{
                background: "transparent", border: "1px solid #1e1e2e",
                borderRadius: 10, color: "#9898a8", padding: "9px 18px",
                fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#8750f7"; el.style.color = "#a78bfa"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#1e1e2e"; el.style.color = "#9898a8"; }}
              >
                <span style={{ fontSize: 16 }}>+</span> Bağlantı Ekle
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