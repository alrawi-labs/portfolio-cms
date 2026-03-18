"use client";

import { useEffect, useState, useRef } from "react";
import { useLocaleContext } from "../_components/LocaleContext";

type CertItem = { title: string; issuer: string; date: string; category: string; img: string; link: string };
type CertData  = { title: string; subtitle: string; certificatesCount: string; viewCertificate: string; of: string; categories: Record<string, string>; certificates: CertItem[] };

const EMPTY: CertData      = { title: "", subtitle: "", certificatesCount: "Certificates", viewCertificate: "View Certificate", of: "/", categories: {}, certificates: [] };
const EMPTY_CERT: CertItem = { title: "", issuer: "", date: "", category: "", img: "", link: "" };

const INPUT: React.CSSProperties = {
  width: "100%", background: "#12121c", border: "1px solid #252535",
  borderRadius: 8, color: "#e2e2e8", fontSize: 13,
  padding: "10px 14px", outline: "none", boxSizing: "border-box",
};

function iFocus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) { e.target.style.borderColor = "#8750f7"; }
function iBlur (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) { e.target.style.borderColor = "#252535"; }

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

/* ── ImgField ── */
function ImgField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"url" | "upload">(value && !value.startsWith("http") ? "upload" : "url");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((res, rej) => {
        reader.onload  = e => res((e.target?.result as string).split(",")[1]);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      const res  = await fetch("/api/admin/certificates-upload", {
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
          <label style={{ color: "#9898b8", fontSize: 12, fontWeight: 500 }}>Sertifika Görseli</label>
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
          placeholder="https://… veya /assets/images/Certificates/…"
          onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#8750f7"}
          onBlur={e  => (e.target as HTMLInputElement).style.borderColor = "#252535"} />
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
            style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: "1px solid #1e1e2e" }}
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

/* ── LinkField ── */
function LinkField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <div style={{ width: 2, height: 12, background: "#8750f7", borderRadius: 1 }} />
        <label style={{ color: "#9898b8", fontSize: 12, fontWeight: 500 }}>Sertifika Linki</label>
      </div>
      <input value={value} onChange={e => onChange(e.target.value)} style={INPUT} placeholder="https://… veya #"
        onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#8750f7"}
        onBlur={e  => (e.target as HTMLInputElement).style.borderColor = "#252535"} />
      {value && value !== "#" && (
        <a href={value} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 6, color: "#8750f7", fontSize: 11, textDecoration: "none" }}>
          ↗ Linki önizle
        </a>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ANA SAYFA
══════════════════════════════════════════════════════════ */
export default function CertificatesPage() {
  const { locale } = useLocaleContext();
  const [data, setData]     = useState<CertData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState<{ ok: boolean; text: string } | null>(null);
  const [tab, setTab]         = useState<"certs" | "categories">("certs");
  const [search, setSearch]   = useState("");
  const [nKey, setNKey]       = useState("");
  const [nLabel, setNLabel]   = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/certificates?locale=${locale}`)
      .then(r => r.json())
      .then(d => setData({
        ...EMPTY, ...d,
        categories:   typeof d.categories === "object" ? d.categories : {},
        certificates: Array.isArray(d.certificates) ? d.certificates : [],
      }))
      .catch(() => setData(EMPTY))
      .finally(() => setLoading(false));
  }, [locale]);

  function showToast(ok: boolean, text: string) { setToast({ ok, text }); setTimeout(() => setToast(null), 3000); }
  function setCert(i: number, k: keyof CertItem, v: string) {
    setData(d => { const a = [...d.certificates]; a[i] = { ...a[i], [k]: v }; return { ...d, certificates: a }; });
  }
  function moveCert(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= data.certificates.length) return;
    const a = [...data.certificates]; [a[i], a[j]] = [a[j], a[i]];
    setData(d => ({ ...d, certificates: a }));
  }
  function removeCert(i: number) {
    if (!confirm("Silinsin mi?")) return;
    setData(d => ({ ...d, certificates: d.certificates.filter((_, j) => j !== i) }));
  }
  function addCat() {
    const k = nKey.trim(), l = nLabel.trim();
    if (!k || !l) return;
    setData(d => ({ ...d, categories: { ...d.categories, [k]: l } }));
    setNKey(""); setNLabel("");
  }
  function removeCat(k: string) {
    setData(d => { const c = { ...d.categories }; delete c[k]; return { ...d, categories: c }; });
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/certificates?locale=${locale}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(true, `Kaydedildi [${locale.toUpperCase()}] ✓`);
    } catch (e: unknown) { showToast(false, (e as Error).message || "Hata"); }
    finally { setSaving(false); }
  }

  const filtered = data.certificates.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: 80 }}>
      {toast && <Toast {...toast} />}

      {/* ── Sayfa başlığı ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 3, height: 24, background: "#8750f7", borderRadius: 2, flexShrink: 0 }} />
            <h1 style={{ color: "#e2e2e8", fontSize: 24, fontWeight: 700, lineHeight: 1 }}>Sertifikalar</h1>
          </div>
          <div style={{ marginLeft: 13, display: "flex", alignItems: "center", gap: 10 }}>
            <code style={{ color: "#6d6d8a", fontSize: 12, background: "#12121c", padding: "3px 8px", borderRadius: 5, border: "1px solid #1e1e2e" }}>
              messages/certificates/{locale}.json
            </code>
            <span style={{ color: "#52525e", fontSize: 12 }}>·</span>
            <span style={{ color: "#52525e", fontSize: 12 }}>{data.certificates.length} sertifika</span>
            <span style={{ color: "#52525e", fontSize: 12 }}>·</span>
            <span style={{ color: "#52525e", fontSize: 12 }}>{Object.keys(data.categories).length} kategori</span>
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
              {(["title", "subtitle", "viewCertificate"] as const).map(k => (
                <Field key={k} label={k}>
                  <input value={data[k]} onChange={e => setData(d => ({ ...d, [k]: e.target.value }))}
                    style={INPUT} onFocus={iFocus} onBlur={iBlur} />
                </Field>
              ))}
            </div>
          </div>

          {/* Sekme çubuğu */}
          <div style={{ display: "flex", gap: 4, background: "#0a0a12", border: "1px solid #1a1a28", borderRadius: 12, padding: 4 }}>
            {(["certs", "categories"] as const).map(t => {
              const active = tab === t;
              const count  = t === "certs" ? data.certificates.length : Object.keys(data.categories).length;
              return (
                <button key={t} onClick={() => setTab(t)} style={{
                  flex: 1, padding: "10px 16px", border: "none", cursor: "pointer",
                  borderRadius: 8, fontSize: 13, fontWeight: active ? 600 : 400,
                  background: active ? "#8750f7" : "transparent",
                  color: active ? "#fff" : "#52525e",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  {t === "certs" ? "◉ Sertifikalar" : "◈ Kategoriler"}
                  <span style={{
                    background: active ? "#ffffff25" : "#1e1e2e",
                    color: active ? "#fff" : "#52525e",
                    borderRadius: 5, padding: "1px 7px", fontSize: 11, fontWeight: 600,
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── SERTİFİKALAR ── */}
          {tab === "certs" && (
            <div style={{ background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "24px 26px" }}>
              {/* Arama + ekle */}
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
                  <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                    width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#52525e" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Ara…" style={{ ...INPUT, paddingLeft: 36 }}
                    onFocus={iFocus} onBlur={iBlur} />
                </div>
                <button onClick={() => setData(d => ({ ...d, certificates: [{ ...EMPTY_CERT }, ...d.certificates] }))} style={{
                  background: "transparent", border: "1px solid #1e1e2e", borderRadius: 8,
                  color: "#9898a8", padding: "0 16px", fontSize: 13, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#8750f7"; el.style.color = "#a78bfa"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#1e1e2e"; el.style.color = "#9898a8"; }}
                >
                  <span style={{ fontSize: 14 }}>+</span> Ekle
                </button>
              </div>

              {filtered.length === 0 && (
                <div style={{ color: "#52525e", fontSize: 13, textAlign: "center" as const, padding: "32px 0" }}>
                  {search ? "Arama sonucu yok." : "Henüz sertifika yok."}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filtered.map((c, idx) => {
                  const i = data.certificates.indexOf(c);
                  return (
                    <div key={i} style={{
                      background: "#0d0d14", border: "1px solid #1e1e2e",
                      borderLeft: "3px solid #8750f7", borderRadius: 14, overflow: "hidden",
                    }}>
                      {/* Kart başlığı */}
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "12px 18px", background: "#10101a", borderBottom: "1px solid #1a1a28",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ color: "#3a3a50", fontSize: 11, fontWeight: 600 }}>#{idx + 1}</span>
                          {c.title && <span style={{ color: "#9898a8", fontSize: 13 }}>{c.title}</span>}
                          {c.category && (
                            <span style={{ background: "#8750f720", color: "#a78bfa", borderRadius: 5, padding: "1px 8px", fontSize: 11, fontWeight: 600 }}>
                              {data.categories[c.category] || c.category}
                            </span>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => moveCert(i, -1)} disabled={i === 0} style={{
                            background: "transparent", border: "1px solid #1e1e2e", borderRadius: 7,
                            color: i === 0 ? "#2a2a3a" : "#9898a8",
                            padding: "4px 10px", fontSize: 12, cursor: i === 0 ? "not-allowed" : "pointer",
                          }}>↑</button>
                          <button onClick={() => moveCert(i, 1)} disabled={i === data.certificates.length - 1} style={{
                            background: "transparent", border: "1px solid #1e1e2e", borderRadius: 7,
                            color: i === data.certificates.length - 1 ? "#2a2a3a" : "#9898a8",
                            padding: "4px 10px", fontSize: 12, cursor: i === data.certificates.length - 1 ? "not-allowed" : "pointer",
                          }}>↓</button>
                          <button onClick={() => removeCert(i)} style={{
                            background: "#7f1d1d", border: "none", borderRadius: 7,
                            color: "#fca5a5", padding: "4px 11px", fontSize: 12, cursor: "pointer",
                          }}>Sil</button>
                        </div>
                      </div>

                      {/* Kart içeriği */}
                      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
                        {/* Temel alanlar */}
                        <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr", gap: 14 }}>
                          <Field label="Başlık">
                            <input value={c.title} onChange={e => setCert(i, "title", e.target.value)}
                              style={INPUT} onFocus={iFocus} onBlur={iBlur} />
                          </Field>
                          <Field label="Veren Kurum">
                            <input value={c.issuer} onChange={e => setCert(i, "issuer", e.target.value)}
                              style={INPUT} onFocus={iFocus} onBlur={iBlur} />
                          </Field>
                          <Field label="Tarih">
                            <input value={c.date} onChange={e => setCert(i, "date", e.target.value)}
                              style={INPUT} onFocus={iFocus} onBlur={iBlur} />
                          </Field>
                          <Field label="Kategori">
                            <select value={c.category} onChange={e => setCert(i, "category", e.target.value)}
                              style={{ ...INPUT, cursor: "pointer" }}
                              onFocus={iFocus} onBlur={iBlur}>
                              <option value="">Seç…</option>
                              {Object.entries(data.categories).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                              ))}
                            </select>
                          </Field>
                        </div>

                        {/* Görsel + Link */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          <ImgField value={c.img} onChange={v => setCert(i, "img", v)} />
                          <LinkField value={c.link} onChange={v => setCert(i, "link", v)} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── KATEGORİLER ── */}
          {tab === "categories" && (
            <div style={{ background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "24px 26px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {Object.keys(data.categories).length === 0 && (
                  <div style={{ color: "#52525e", fontSize: 13, textAlign: "center" as const, padding: "20px 0" }}>
                    Henüz kategori yok.
                  </div>
                )}
                {Object.entries(data.categories).map(([key, label]) => (
                  <div key={key} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 36px", gap: 10, alignItems: "center" }}>
                    <div style={{
                      ...INPUT, color: "#a78bfa", fontFamily: "monospace", fontSize: 12,
                      display: "flex", alignItems: "center",
                    }}>
                      {key}
                    </div>
                    <input value={label}
                      onChange={e => setData(d => ({ ...d, categories: { ...d.categories, [key]: e.target.value } }))}
                      style={INPUT} onFocus={iFocus} onBlur={iBlur} />
                    <button onClick={() => removeCat(key)} style={{
                      background: "#3f1010", border: "none", borderRadius: 8,
                      color: "#fca5a5", cursor: "pointer", height: 40, fontSize: 14,
                    }}>✕</button>
                  </div>
                ))}
              </div>

              {/* Yeni kategori */}
              <div style={{ borderTop: "1px solid #1a1a28", paddingTop: 16, display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: 10 }}>
                <Field label="Anahtar">
                  <input value={nKey} onChange={e => setNKey(e.target.value)}
                    style={INPUT} placeholder="ai" onFocus={iFocus} onBlur={iBlur} />
                </Field>
                <Field label="Görünen Ad">
                  <input value={nLabel} onChange={e => setNLabel(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addCat()}
                    style={INPUT} placeholder="Artificial Intelligence"
                    onFocus={iFocus} onBlur={iBlur} />
                </Field>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button onClick={addCat} style={{
                    background: "transparent", border: "1px solid #1e1e2e", borderRadius: 8,
                    color: "#9898a8", padding: "10px 16px", fontSize: 13, cursor: "pointer",
                    whiteSpace: "nowrap" as const,
                  }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#8750f7"; el.style.color = "#a78bfa"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#1e1e2e"; el.style.color = "#9898a8"; }}
                  >
                    + Ekle
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
            <SaveBtn onClick={save} loading={saving} />
          </div>
        </div>
      )}
    </div>
  );
}