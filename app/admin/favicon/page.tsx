"use client";

import { useEffect, useState, useRef } from "react";

const INPUT: React.CSSProperties = {
  background: "#16161f", border: "1px solid #1e1e2e", borderRadius: 8,
  color: "#e2e2e8", fontSize: 13, padding: "8px 11px",
  width: "100%", boxSizing: "border-box",
};

function Btn({ onClick, children, variant = "primary", disabled = false }: {
  onClick?: () => void; children: React.ReactNode;
  variant?: "primary" | "ghost" | "danger"; disabled?: boolean;
}) {
  const s: Record<string, React.CSSProperties> = {
    primary: { background: "#8750f7", color: "#fff", border: "none" },
    ghost:   { background: "transparent", color: "#9898a8", border: "1px solid #1e1e2e" },
    danger:  { background: "transparent", color: "#f87171", border: "1px solid #f8717140" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...s[variant], borderRadius: 8, padding: "8px 16px", fontSize: 13,
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
    }}>{children}</button>
  );
}

function Toast({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
      background: ok ? "#052e16" : "#1f0a0a",
      border: `1px solid ${ok ? "#14532d" : "#3f1010"}`,
      color: ok ? "#4ade80" : "#f87171",
      borderRadius: 10, padding: "11px 18px", fontSize: 13,
    }}>{text}</div>
  );
}

const SLOTS = [
  {
    filename:  "favicon.ico",
    appFile:   "app/favicon.ico",
    label:     "favicon.ico",
    desc:      "Ana favicon — tüm tarayıcılar",
    accept:    ".ico",
    hint:      "16×16, 32×32 veya 48×48 px",
    preview:   "/favicon.ico",
  },
  {
    filename:  "favicon.png",
    appFile:   "app/icon.png",
    label:     "favicon.png → icon.png",
    desc:      "PNG favicon (modern tarayıcılar)",
    accept:    ".png",
    hint:      "32×32 veya 64×64 px",
    preview:   "/favicon.png",
  },
  {
    filename:  "apple-touch-icon.png",
    appFile:   "app/apple-icon.png",
    label:     "apple-touch-icon.png",
    desc:      "iOS / macOS ana ekran ikonu",
    accept:    ".png",
    hint:      "180×180 px önerilir",
    preview:   "/apple-touch-icon.png",
  },
  {
    filename:  "icon.svg",
    appFile:   "app/icon.svg",
    label:     "icon.svg",
    desc:      "SVG favicon (Chrome, Firefox, Edge)",
    accept:    ".svg",
    hint:      "Vektör, herhangi bir boyut",
    preview:   "/icon.svg",
  },
];

type SlotState = { preview: string | null; file: File | null; uploading: boolean };

export default function FaviconPage() {
  const [slots, setSlots]     = useState<Record<string, boolean>>({});
  const [toast, setToast]     = useState<{ ok: boolean; text: string } | null>(null);
  const [ts, setTs]           = useState(Date.now());
  const [states, setStates]   = useState<Record<string, SlotState>>(
    Object.fromEntries(SLOTS.map(s => [s.filename, { preview: null, file: null, uploading: false }]))
  );
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetch("/api/admin/favicon")
      .then(r => r.json())
      .then(d => setSlots(d.slots || {}))
      .catch(() => {});
  }, []);

  function showToast(ok: boolean, text: string) {
    setToast({ ok, text }); setTimeout(() => setToast(null), 3500);
  }

  function handleFile(filename: string, file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setStates(s => ({
      ...s, [filename]: { ...s[filename], file, preview: e.target?.result as string },
    }));
    reader.readAsDataURL(file);
  }

  async function upload(filename: string) {
    const state = states[filename];
    if (!state.file) return;
    setStates(s => ({ ...s, [filename]: { ...s[filename], uploading: true } }));
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((res, rej) => {
        reader.onload  = e => res((e.target?.result as string).split(",")[1]);
        reader.onerror = rej;
        reader.readAsDataURL(state.file!);
      });
      const resp = await fetch("/api/admin/favicon", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, base64 }),
      });
      if (!resp.ok) throw new Error((await resp.json()).error);
      showToast(true, `${filename} yüklendi ✓ — sitenizde aktif`);
      setSlots(s => ({ ...s, [filename]: true }));
      setStates(s => ({ ...s, [filename]: { ...s[filename], file: null, preview: null } }));
      setTs(Date.now());
    } catch (e: unknown) {
      showToast(false, (e as Error).message || "Hata");
    } finally {
      setStates(s => ({ ...s, [filename]: { ...s[filename], uploading: false } }));
    }
  }

  async function remove(filename: string) {
    if (!confirm(`${filename} silinsin mi?`)) return;
    try {
      await fetch("/api/admin/favicon", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      setSlots(s => ({ ...s, [filename]: false }));
      setTs(Date.now());
      showToast(true, `${filename} silindi.`);
    } catch { showToast(false, "Silinemedi."); }
  }

  return (
    <div style={{ maxWidth: 680, paddingBottom: 60 }}>
      {toast && <Toast {...toast} />}

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: "#e2e2e8", fontSize: 22, fontWeight: 600 }}>Favicon Yönetimi</h1>
        <p style={{ color: "#52525e", fontSize: 13, marginTop: 4 }}>
          Yüklenen dosyalar <code style={{ color: "#8750f7" }}>app/</code> klasörüne kaydedilir — Next.js otomatik olarak siteye uygular.
        </p>
      </div>

      {/* Next.js favicon açıklaması */}
      <div style={{
        background: "#8750f710", border: "1px solid #8750f730",
        borderRadius: 10, padding: "12px 16px", marginBottom: 24,
        display: "flex", gap: 12, alignItems: "flex-start",
      }}>
        <span style={{ color: "#8750f7", fontSize: 18, flexShrink: 0 }}>ℹ</span>
        <div style={{ color: "#9898a8", fontSize: 12, lineHeight: 1.7 }}>
          Next.js App Router, <code style={{ color: "#a78bfa" }}>app/favicon.ico</code> ve <code style={{ color: "#a78bfa" }}>app/icon.png</code> dosyalarını
          otomatik olarak <code style={{ color: "#a78bfa" }}>&lt;head&gt;</code> kısmına ekler.
          Yükledikten sonra dev sunucusunu <strong style={{ color: "#e2e2e8" }}>yeniden başlatmanız</strong> gerekebilir.
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {SLOTS.map(slot => {
          const state  = states[slot.filename];
          const exists = slots[slot.filename];

          return (
            <div key={slot.filename} style={{
              background: "#16161f",
              border: `1px solid ${state.preview ? "#8750f760" : "#1e1e2e"}`,
              borderRadius: 12, padding: "16px 18px",
              transition: "border-color 0.2s",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>

                {/* Önizleme kutusu */}
                <div
                  onClick={() => fileRefs.current[slot.filename]?.click()}
                  style={{
                    width: 72, height: 72, flexShrink: 0,
                    background: "#111118",
                    border: `2px dashed ${state.preview ? "#8750f7" : exists ? "#4ade8040" : "#1e1e2e"}`,
                    borderRadius: 12,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", overflow: "hidden", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#8750f7"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = state.preview ? "#8750f7" : exists ? "#4ade8040" : "#1e1e2e"}
                >
                  {state.preview ? (
                    <img src={state.preview} alt="önizleme"
                      style={{ width: 48, height: 48, objectFit: "contain" }} />
                  ) : exists ? (
                    <img src={`${slot.preview}?t=${ts}`} alt={slot.filename}
                      style={{ width: 40, height: 40, objectFit: "contain" }}
                      onError={e => (e.currentTarget as HTMLImageElement).style.display = "none"} />
                  ) : (
                    <span style={{ color: "#2a2a3a", fontSize: 26 }}>+</span>
                  )}
                </div>

                {/* Bilgi */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ color: "#e2e2e8", fontSize: 14, fontWeight: 500 }}>{slot.label}</span>
                    {exists && !state.preview && (
                      <span style={{ background: "#052e16", color: "#4ade80", borderRadius: 5, padding: "1px 7px", fontSize: 10 }}>
                        ✓ Aktif
                      </span>
                    )}
                    {state.preview && (
                      <span style={{ background: "#8750f720", color: "#a78bfa", borderRadius: 5, padding: "1px 7px", fontSize: 10 }}>
                        Hazır
                      </span>
                    )}
                  </div>
                  <div style={{ color: "#52525e", fontSize: 12, marginBottom: 1 }}>{slot.desc}</div>
                  <div style={{ color: "#3a3a4a", fontSize: 11, marginBottom: 12 }}>
                    {slot.hint} · {slot.accept}
                    <span style={{ marginLeft: 8, color: "#2a2a3a" }}>→ {slot.appFile}</span>
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" as const }}>
                    <input
                      ref={el => { fileRefs.current[slot.filename] = el; }}
                      type="file" accept={slot.accept}
                      onChange={e => handleFile(slot.filename, e.target.files?.[0] ?? null)}
                      style={{ display: "none" }}
                    />
                    <button
                      onClick={() => fileRefs.current[slot.filename]?.click()}
                      style={{
                        ...INPUT, cursor: "pointer", textAlign: "left" as const,
                        color: state.file ? "#e2e2e8" : "#52525e",
                        width: "auto", flex: 1, maxWidth: 220,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
                      }}
                    >
                      {state.file ? state.file.name : "Dosya seç…"}
                    </button>

                    {state.preview && (
                      <Btn onClick={() => upload(slot.filename)} disabled={state.uploading}>
                        {state.uploading ? "Yükleniyor…" : "Yükle & Uygula"}
                      </Btn>
                    )}
                    {state.preview && (
                      <Btn variant="ghost"
                        onClick={() => setStates(s => ({ ...s, [slot.filename]: { ...s[slot.filename], preview: null, file: null } }))}>
                        İptal
                      </Btn>
                    )}
                    {exists && !state.preview && (
                      <Btn variant="danger" onClick={() => remove(slot.filename)}>Sil</Btn>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Not */}
      <div style={{
        marginTop: 20, background: "#111118", border: "1px solid #1e1e2e",
        borderRadius: 10, padding: "12px 16px",
      }}>
        <p style={{ color: "#52525e", fontSize: 12, lineHeight: 1.7 }}>
          💡 Yükledikten sonra tarayıcıda görmek için: dev sunucusunu <strong style={{ color: "#9898a8" }}>yeniden başlatın</strong> (<code style={{ color: "#8750f7" }}>Ctrl+C → npm run dev</code>),
          ardından <strong style={{ color: "#9898a8" }}>Ctrl+Shift+R</strong> ile hard reload yapın.
        </p>
      </div>
    </div>
  );
}