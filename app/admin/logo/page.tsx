"use client";

import { useEffect, useState, useRef } from "react";

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

/* ── Sürükle & Bırak + URL + Dosya Yükleme ── */
function LogoUploadArea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [tab, setTab]             = useState<"url" | "upload">("upload");
  const [dragging, setDragging]   = useState(false);
  const fileRef                   = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.match(/image\/(svg|png|jpeg|webp)/)) {
      alert("Sadece SVG, PNG, JPG veya WEBP dosyaları kabul edilir.");
      return;
    }
    setUploading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((res, rej) => {
        reader.onload  = e => res((e.target?.result as string).split(",")[1]);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      const res  = await fetch("/api/admin/logo-upload", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, base64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onChange(data.path);
    } catch (e: unknown) { alert((e as Error).message || "Yükleme hatası"); }
    finally { setUploading(false); }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Tab seçici */}
      <div style={{ display: "flex", gap: 2, background: "#0d0d14", border: "1px solid #1a1a28", borderRadius: 8, padding: 3 }}>
        {(["upload","url"] as const).map(t => (
          <button key={t} type="button" onClick={() => setTab(t)} style={{
            flex: 1, padding: "8px 0", borderRadius: 6, border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: tab === t ? 600 : 400, transition: "all 0.15s",
            background: tab === t ? "#8750f7" : "transparent",
            color:      tab === t ? "#fff"    : "#52525e",
          }}>
            {t === "upload" ? "📁 Dosya Yükle" : "🔗 URL ile Ekle"}
          </button>
        ))}
      </div>

      {tab === "upload" ? (
        <div>
          {/* Sürükle & Bırak alanı */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? "#8750f7" : uploading ? "#6340b5" : "#252535"}`,
              borderRadius: 12, padding: "40px 24px", cursor: "pointer",
              background: dragging ? "#8750f708" : "#0d0d14",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
              transition: "all 0.2s",
            }}
          >
            <input ref={fileRef} type="file" accept=".svg,.png,.jpg,.jpeg,.webp" style={{ display: "none" }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

            {uploading ? (
              <>
                <div style={{ fontSize: 32 }}>⏳</div>
                <span style={{ color: "#a78bfa", fontSize: 13 }}>Yükleniyor…</span>
              </>
            ) : (
              <>
                <div style={{
                  width: 52, height: 52, borderRadius: 12,
                  background: dragging ? "#8750f720" : "#1a1a28",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, transition: "all 0.2s",
                }}>
                  {dragging ? "⬇" : "◓"}
                </div>
                <div style={{ textAlign: "center" as const }}>
                  <div style={{ color: dragging ? "#a78bfa" : "#9898b8", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                    {dragging ? "Dosyayı bırakın" : "Dosyayı sürükleyin veya tıklayın"}
                  </div>
                  <div style={{ color: "#3a3a50", fontSize: 12 }}>SVG · PNG · JPG · WEBP</div>
                </div>
              </>
            )}
          </div>

          {/* Mevcut yol */}
          {value && (
            <div style={{
              marginTop: 10, display: "flex", alignItems: "center", gap: 10,
              background: "#0d0d14", border: "1px solid #1a1a28", borderRadius: 8, padding: "8px 12px",
            }}>
              <code style={{ color: "#6d6d8a", fontSize: 11, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                {value}
              </code>
              <button type="button" onClick={() => onChange("")} style={{
                background: "transparent", border: "none", color: "#f87171",
                fontSize: 11, cursor: "pointer", padding: 0, flexShrink: 0,
              }}>Kaldır</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div style={{ width: 2, height: 12, background: "#8750f7", borderRadius: 1 }} />
            <label style={{ color: "#9898b8", fontSize: 12, fontWeight: 500 }}>Logo URL veya Yol</label>
          </div>
          <input value={value} onChange={e => onChange(e.target.value)} style={INPUT}
            placeholder="/assets/images/logoLight.svg veya https://…"
            onFocus={iFocus} onBlur={iBlur} />
          {value && (
            <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
              <button type="button" onClick={() => onChange("")} style={{
                background: "transparent", border: "none", color: "#f87171", fontSize: 12, cursor: "pointer",
              }}>Kaldır</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══ ANA SAYFA ══ */
export default function LogoPage() {
  const [logo, setLogo]       = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/logo")
      .then(r => r.json())
      .then(d => setLogo(d.logo || ""))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function showToast(ok: boolean, text: string) { setToast({ ok, text }); setTimeout(() => setToast(null), 3000); }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/logo", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logo }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(true, "Logo güncellendi ✓");
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
            <h1 style={{ color: "#e2e2e8", fontSize: 24, fontWeight: 700, lineHeight: 1 }}>Logo</h1>
          </div>
          <div style={{ marginLeft: 13 }}>
            <code style={{ color: "#6d6d8a", fontSize: 12, background: "#12121c", padding: "3px 8px", borderRadius: 5, border: "1px solid #1e1e2e" }}>
              data/techIcons.ts → SiteLogo
            </code>
          </div>
        </div>
        <SaveBtn onClick={save} loading={saving} />
      </div>

      {loading ? (
        <div style={{ color: "#52525e", fontSize: 13, padding: "60px 0", textAlign: "center" as const }}>Yükleniyor…</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ── İki kolonlu layout ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, alignItems: "start" }}>

            {/* Sol: Önizleme */}
            <div style={{ background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "24px 26px" }}>
              <div style={{
                color: "#52525e", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.08em", textTransform: "uppercase" as const,
                marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #1a1a28",
              }}>
                Önizleme
              </div>

              {/* Koyu tema */}
              <div style={{ marginBottom: 4 }}>
                <div style={{ color: "#3a3a50", fontSize: 10, marginBottom: 6, letterSpacing: "0.06em" }}>KOYU TEMA</div>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 10,
                  padding: "24px 16px", minHeight: 96,
                }}>
                  {logo ? (
                    <img src={logo} alt="Logo" style={{ maxHeight: 56, maxWidth: "100%", objectFit: "contain" }}
                      onError={e => (e.currentTarget as HTMLImageElement).style.display = "none"} />
                  ) : (
                    <div style={{ textAlign: "center" as const }}>
                      <div style={{ color: "#252535", fontSize: 24, marginBottom: 6 }}>◓</div>
                      <span style={{ color: "#3a3a50", fontSize: 11 }}>Logo yüklenmedi</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Açık tema */}
              <div style={{ marginTop: 10 }}>
                <div style={{ color: "#3a3a50", fontSize: 10, marginBottom: 6, letterSpacing: "0.06em" }}>AÇIK TEMA</div>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#f5f5f7", border: "1px solid #e5e5e5", borderRadius: 10,
                  padding: "18px 16px", minHeight: 72,
                }}>
                  {logo ? (
                    <img src={logo} alt="Logo (açık)" style={{ maxHeight: 40, maxWidth: "100%", objectFit: "contain" }}
                      onError={e => (e.currentTarget as HTMLImageElement).style.display = "none"} />
                  ) : (
                    <span style={{ color: "#ccc", fontSize: 11 }}>Logo yüklenmedi</span>
                  )}
                </div>
              </div>

              {/* Boyut bilgisi */}
              {logo && (
                <div style={{ marginTop: 12, textAlign: "center" as const }}>
                  <span style={{ color: "#3a3a50", fontSize: 11 }}>
                    {logo.endsWith(".svg") ? "✓ SVG — vektör" : "Raster görüntü"}
                  </span>
                </div>
              )}
            </div>

            {/* Sağ: Yükleme */}
            <div style={{ background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "24px 26px" }}>
              <div style={{
                color: "#52525e", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.08em", textTransform: "uppercase" as const,
                marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #1a1a28",
              }}>
                Logo Dosyası
              </div>
              <LogoUploadArea value={logo} onChange={setLogo} />
            </div>
          </div>

          {/* Bilgi notu */}
          <div style={{ background: "#0d0d14", border: "1px solid #1a1a28", borderRadius: 10, padding: "12px 16px" }}>
            <p style={{ color: "#3a3a50", fontSize: 12, lineHeight: 1.6 }}>
              💡 <strong style={{ color: "#52525e" }}>SVG önerilir</strong> — tüm boyutlarda keskin görünür ve tema renklerine uyum sağlar.
              Yüklenen dosya <code style={{ color: "#6d6d8a" }}>public/assets/images/</code> klasörüne kaydedilir.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
            <SaveBtn onClick={save} loading={saving} />
          </div>
        </div>
      )}
    </div>
  );
}