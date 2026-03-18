"use client";

import { useEffect, useState, useRef } from "react";
import { useLocaleContext } from "../_components/LocaleContext";
import * as LucideIcons from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconComponent = React.ComponentType<any>;

const ICON_MAP: Record<string, IconComponent> = Object.keys(LucideIcons)
  .filter(key => /^[A-Z]/.test(key) && key !== "LucideProps" && key !== "IconAliases")
  .reduce((acc, key) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    acc[key] = (LucideIcons as Record<string, any>)[key];
    return acc;
  }, {} as Record<string, IconComponent>);

const ALL_ICONS = Object.keys(ICON_MAP).sort();

type ServiceItem  = { title: string; description: string; icon: string };
type ServicesData = { title: string; subtitle: string; items: ServiceItem[] };

const EMPTY: ServicesData     = { title: "", subtitle: "", items: [] };
const EMPTY_ITEM: ServiceItem = { title: "", description: "", icon: "" };

/* ── Stil sabitleri ── */
const INPUT: React.CSSProperties = {
  width: "100%", background: "#12121c", border: "1px solid #252535",
  borderRadius: 8, color: "#e2e2e8", fontSize: 13,
  padding: "10px 14px", outline: "none", boxSizing: "border-box",
};
const TEXTAREA: React.CSSProperties = { ...INPUT, resize: "vertical" as const, minHeight: 90, lineHeight: 1.6 };

function iFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) { e.target.style.borderColor = "#8750f7"; }
function iBlur (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) { e.target.style.borderColor = "#252535"; }

/* ── Lucide ikon bileşeni ── */
function LucideIcon({ name, size = 18, color = "currentColor" }: { name: string; size?: number; color?: string }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return <span style={{ fontSize: 12, color, opacity: 0.4 }}>•</span>;
  return <Icon size={size} color={color} strokeWidth={1.5} />;
}

/* ── İkon seçici ── */
function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const wrapRef             = useRef<HTMLDivElement>(null);
  const searchRef           = useRef<HTMLInputElement>(null);

  const filtered = search
    ? ALL_ICONS.filter(n => n.toLowerCase().includes(search.toLowerCase()))
    : ALL_ICONS;

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  function popupPos(): React.CSSProperties {
    const rect   = wrapRef.current?.getBoundingClientRect();
    const bottom = (rect?.bottom ?? 0) + 6;
    const left   = Math.min(rect?.left ?? 0, window.innerWidth - 316);
    const flipUp = bottom + 360 > window.innerHeight;
    return {
      position: "fixed" as const,
      top:  flipUp ? (rect?.top ?? 0) - 366 : bottom,
      left, width: 312, maxHeight: 360,
      background: "#111118", border: "1px solid #2a1454",
      borderRadius: 12, zIndex: 99999,
      display: "flex", flexDirection: "column" as const,
      boxShadow: "0 12px 40px rgba(0,0,0,0.8)",
    };
  }

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 14px",
        background: open ? "#1a1827" : "#12121c",
        border: `1px solid ${open ? "#8750f7" : "#252535"}`,
        borderRadius: 8, cursor: "pointer", color: "#e2e2e8",
        fontSize: 13, width: "100%", textAlign: "left" as const,
        transition: "all 0.15s",
      }}>
        {value
          ? <><LucideIcon name={value} size={15} color="#a78bfa" /><span style={{ flex: 1 }}>{value}</span></>
          : <span style={{ color: "#52525e", flex: 1 }}>İkon seç…</span>
        }
        <span style={{ color: "#52525e", fontSize: 10 }}>▾</span>
      </button>

      {open && (
        <div style={popupPos()}>
          <div style={{ padding: "8px 8px 6px", borderBottom: "1px solid #1e1e2e" }}>
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`${ALL_ICONS.length} ikon içinde ara…`}
              style={{ ...INPUT, fontSize: 12, padding: "7px 10px" }}
            />
          </div>
          <div style={{
            flex: 1, overflowY: "auto", padding: 6,
            display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2,
          }}>
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center" as const, color: "#52525e", fontSize: 12, padding: "24px 0" }}>
                Bulunamadı
              </div>
            )}
            {filtered.map(name => (
              <button key={name} type="button" title={name}
                onClick={() => { onChange(name); setOpen(false); setSearch(""); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 7, borderRadius: 7, border: "none", cursor: "pointer",
                  background: value === name ? "#8750f720" : "transparent",
                  outline: value === name ? "1px solid #8750f760" : "none",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => { if (value !== name) (e.currentTarget as HTMLElement).style.background = "#1a1827"; }}
                onMouseLeave={e => { if (value !== name) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <LucideIcon name={name} size={17} color={value === name ? "#8750f7" : "#9898a8"} />
              </button>
            ))}
          </div>
          {value && (
            <div style={{ padding: "7px 10px", borderTop: "1px solid #1e1e2e", display: "flex", alignItems: "center", gap: 8 }}>
              <LucideIcon name={value} size={14} color="#8750f7" />
              <span style={{ color: "#9898a8", fontSize: 12, flex: 1 }}>{value}</span>
              <button type="button" onClick={() => { onChange(""); setOpen(false); }} style={{
                background: "transparent", border: "none", color: "#52525e", cursor: "pointer", fontSize: 12,
              }}>✕</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Field bileşeni ── */
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

/* ══════════════════════════════════════════════════════════
   ANA SAYFA
══════════════════════════════════════════════════════════ */
export default function ServicesPage() {
  const { locale } = useLocaleContext();
  const [data, setData]       = useState<ServicesData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/services?locale=${locale}`)
      .then(r => r.json())
      .then(d => setData({ ...EMPTY, ...d, items: Array.isArray(d.items) ? d.items : [] }))
      .catch(() => setData(EMPTY))
      .finally(() => setLoading(false));
  }, [locale]);

  function showToast(ok: boolean, text: string) { setToast({ ok, text }); setTimeout(() => setToast(null), 3000); }

  function setItem(i: number, k: keyof ServiceItem, v: string) {
    setData(d => { const items = [...d.items]; items[i] = { ...items[i], [k]: v }; return { ...d, items }; });
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= data.items.length) return;
    const items = [...data.items]; [items[i], items[j]] = [items[j], items[i]];
    setData(d => ({ ...d, items }));
  }
  function remove(i: number) {
    if (!confirm("Silinsin mi?")) return;
    setData(d => ({ ...d, items: d.items.filter((_, j) => j !== i) }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/services?locale=${locale}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(true, `Kaydedildi [${locale.toUpperCase()}] ✓`);
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
            <h1 style={{ color: "#e2e2e8", fontSize: 24, fontWeight: 700, lineHeight: 1 }}>Servisler</h1>
          </div>
          <div style={{ marginLeft: 13, display: "flex", alignItems: "center", gap: 10 }}>
            <code style={{ color: "#6d6d8a", fontSize: 12, background: "#12121c", padding: "3px 8px", borderRadius: 5, border: "1px solid #1e1e2e" }}>
              messages/services/{locale}.json
            </code>
            <span style={{ color: "#52525e", fontSize: 12 }}>·</span>
            <span style={{ color: "#52525e", fontSize: 12 }}>{data.items.length} kart</span>
            <span style={{ color: "#52525e", fontSize: 12 }}>·</span>
            <span style={{ color: "#52525e", fontSize: 12 }}>{ALL_ICONS.length} ikon mevcut</span>
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
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span>Bölüm Metinleri</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
              <Field label="Başlık">
                <input value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value }))}
                  style={INPUT} onFocus={iFocus} onBlur={iBlur} />
              </Field>
              <Field label="Alt Başlık">
                <textarea value={data.subtitle} onChange={e => setData(d => ({ ...d, subtitle: e.target.value }))}
                  style={{ ...TEXTAREA, minHeight: 60 }} onFocus={iFocus} onBlur={iBlur} />
              </Field>
            </div>
          </div>

          {/* Servis kartları */}
          <div style={{ background: "#10101a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "24px 26px" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #1a1a28",
            }}>
              <div style={{ color: "#52525e", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
                Servis Kartları
              </div>
              <button onClick={() => setData(d => ({ ...d, items: [...d.items, { ...EMPTY_ITEM }] }))} style={{
                background: "transparent", border: "1px solid #1e1e2e",
                borderRadius: 8, color: "#9898a8", padding: "6px 14px",
                fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#8750f7"; el.style.color = "#a78bfa"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#1e1e2e"; el.style.color = "#9898a8"; }}
              >
                <span style={{ fontSize: 14 }}>+</span> Kart Ekle
              </button>
            </div>

            {data.items.length === 0 && (
              <div style={{ color: "#52525e", fontSize: 13, textAlign: "center" as const, padding: "32px 0" }}>
                Henüz servis kartı yok.
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {data.items.map((item, i) => (
                <div key={i} style={{
                  background: "#0d0d14", border: "1px solid #1e1e2e",
                  borderLeft: "3px solid #8750f7",
                  borderRadius: 14, overflow: "visible",
                }}>
                  {/* Kart başlığı */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 18px", background: "#10101a",
                    borderBottom: "1px solid #1a1a28",
                    borderRadius: "11px 11px 0 0",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: "#3a3a50", fontSize: 11, fontWeight: 600 }}>#{i + 1}</span>
                      {item.icon && (
                        <span style={{ display: "flex", alignItems: "center", gap: 5, background: "#8750f720", borderRadius: 6, padding: "3px 8px" }}>
                          <LucideIcon name={item.icon} size={13} color="#a78bfa" />
                          <span style={{ color: "#a78bfa", fontSize: 11, fontWeight: 500 }}>{item.icon}</span>
                        </span>
                      )}
                      {item.title && <span style={{ color: "#9898a8", fontSize: 13 }}>{item.title}</span>}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => move(i, -1)} disabled={i === 0} style={{
                        background: "transparent", border: "1px solid #1e1e2e", borderRadius: 7,
                        color: i === 0 ? "#2a2a3a" : "#9898a8",
                        padding: "4px 10px", fontSize: 12, cursor: i === 0 ? "not-allowed" : "pointer",
                      }}>↑</button>
                      <button onClick={() => move(i, 1)} disabled={i === data.items.length - 1} style={{
                        background: "transparent", border: "1px solid #1e1e2e", borderRadius: 7,
                        color: i === data.items.length - 1 ? "#2a2a3a" : "#9898a8",
                        padding: "4px 10px", fontSize: 12, cursor: i === data.items.length - 1 ? "not-allowed" : "pointer",
                      }}>↓</button>
                      <button onClick={() => remove(i)} style={{
                        background: "#7f1d1d", border: "none", borderRadius: 7,
                        color: "#fca5a5", padding: "4px 11px", fontSize: 12, cursor: "pointer",
                      }}>Sil</button>
                    </div>
                  </div>

                  {/* Kart içeriği */}
                  <div style={{ padding: "18px 18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <Field label="Başlık">
                        <input value={item.title} onChange={e => setItem(i, "title", e.target.value)}
                          style={INPUT} onFocus={iFocus} onBlur={iBlur} />
                      </Field>
                      <Field label="İkon (Lucide)">
                        <IconPicker value={item.icon} onChange={v => setItem(i, "icon", v)} />
                      </Field>
                    </div>
                    <Field label="Açıklama">
                      <textarea value={item.description} onChange={e => setItem(i, "description", e.target.value)}
                        style={TEXTAREA} onFocus={iFocus} onBlur={iBlur} />
                    </Field>
                  </div>
                </div>
              ))}
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