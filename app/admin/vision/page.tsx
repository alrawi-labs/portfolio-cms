"use client";

import { useEffect, useState } from "react";
import { useLocaleContext } from "../_components/LocaleContext";

type Statement = { text:string; direction:string };

const DIRECTIONS = ["default","right","down"] as const;

const DIR_META: Record<string,{ color:string; bg:string; label:string }> = {
  default: { color:"#a78bfa", bg:"#8750f720", label:"Varsayılan" },
  right:   { color:"#38bdf8", bg:"#38bdf820", label:"Sağdan"    },
  down:    { color:"#34d399", bg:"#34d39920", label:"Aşağıdan"  },
};

const INPUT: React.CSSProperties = {
  width:"100%", background:"#12121c", border:"1px solid #252535",
  borderRadius:8, color:"#e2e2e8", fontSize:13,
  padding:"10px 14px", outline:"none", boxSizing:"border-box",
};
const TEXTAREA: React.CSSProperties = {
  ...INPUT, resize:"vertical" as const, minHeight:72, lineHeight:1.6,
};

function SaveBtn({ onClick, loading }: { onClick:()=>void; loading:boolean }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      background: loading ? "#6340b5" : "#8750f7",
      color:"#fff", border:"none", borderRadius:10,
      padding:"10px 22px", fontSize:13, fontWeight:600,
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1, whiteSpace:"nowrap" as const,
    }}>
      {loading ? "Kaydediliyor…" : "Kaydet"}
    </button>
  );
}

function Toast({ ok, text }: { ok:boolean; text:string }) {
  return (
    <div style={{
      position:"fixed", top:24, right:24, zIndex:9999,
      background: ok ? "#052e16" : "#1f0a0a",
      border:`1px solid ${ok ? "#14532d" : "#3f1010"}`,
      color: ok ? "#4ade80" : "#f87171",
      borderRadius:10, padding:"12px 20px", fontSize:13, fontWeight:500,
    }}>
      {text}
    </div>
  );
}

export default function VisionPage() {
  const { locale } = useLocaleContext();
  const [stmts,   setStmts]   = useState<Statement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState<{ok:boolean;text:string}|null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/vision?locale=${locale}`)
      .then(r => r.json())
      .then(d => setStmts(Array.isArray(d.statements) ? d.statements : []))
      .catch(() => setStmts([]))
      .finally(() => setLoading(false));
  }, [locale]);

  function showToast(ok:boolean, text:string) { setToast({ok,text}); setTimeout(()=>setToast(null),3000); }

  function set(i:number, k:keyof Statement, v:string) {
    setStmts(a => { const n=[...a]; n[i]={...n[i],[k]:v}; return n; });
  }
  function move(i:number, dir:-1|1) {
    const j=i+dir; if(j<0||j>=stmts.length) return;
    const a=[...stmts]; [a[i],a[j]]=[a[j],a[i]]; setStmts(a);
  }
  function remove(i:number) {
    if(!confirm("Silinsin mi?")) return;
    setStmts(a => a.filter((_,j) => j!==i));
  }
  function add() { setStmts(a => [...a, { text:"", direction:"default" }]); }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/vision?locale=${locale}`, {
        method:"PUT", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ statements: stmts }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(true, `Kaydedildi [${locale.toUpperCase()}] ✓`);
    } catch(e:unknown) { showToast(false,(e as Error).message||"Hata"); }
    finally { setSaving(false); }
  }

  return (
    <div style={{ paddingBottom:80 }}>
      {toast && <Toast {...toast}/>}

      {/* ── Sayfa başlığı ── */}
      <div style={{
        display:"flex", alignItems:"flex-start",
        justifyContent:"space-between", gap:16, marginBottom:32,
      }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
            <div style={{ width:3, height:24, background:"#8750f7", borderRadius:2, flexShrink:0 }} />
            <h1 style={{ color:"#e2e2e8", fontSize:24, fontWeight:700, lineHeight:1 }}>
              Vision Cümleleri
            </h1>
          </div>
          <div style={{ marginLeft:13, display:"flex", alignItems:"center", gap:10 }}>
            <code style={{
              color:"#6d6d8a", fontSize:12, background:"#12121c",
              padding:"3px 8px", borderRadius:5, border:"1px solid #1e1e2e",
            }}>
              messages/vision/{locale}.json
            </code>
            <span style={{ color:"#52525e", fontSize:12 }}>·</span>
            <span style={{ color:"#52525e", fontSize:12 }}>{stmts.length} cümle</span>
          </div>
        </div>
        <SaveBtn onClick={save} loading={saving}/>
      </div>

      {loading ? (
        <div style={{ color:"#52525e", fontSize:13, padding:"60px 0", textAlign:"center" as const }}>
          Yükleniyor…
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

          {/* Boş durum */}
          {stmts.length === 0 && (
            <div style={{
              background:"#10101a", border:"1px solid #1e1e2e",
              borderRadius:16, padding:"48px 24px", textAlign:"center" as const,
            }}>
              <div style={{ color:"#52525e", fontSize:32, marginBottom:12 }}>◌</div>
              <p style={{ color:"#52525e", fontSize:14 }}>Henüz cümle yok.</p>
              <p style={{ color:"#3a3a50", fontSize:12, marginTop:4 }}>Aşağıdan yeni bir cümle ekleyin.</p>
            </div>
          )}

          {/* Cümleler */}
          {stmts.map((s, i) => {
            const meta = DIR_META[s.direction] || DIR_META.default;
            return (
              <div key={i} style={{
                background:"#10101a", border:"1px solid #1e1e2e",
                borderLeft:`3px solid ${meta.color}`,
                borderRadius:16, overflow:"hidden",
              }}>
                {/* Kart başlığı */}
                <div style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"14px 20px", borderBottom:"1px solid #1a1a28",
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{
                      background:"#1e1e2e", color:"#52525e",
                      borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600,
                    }}>
                      #{i+1}
                    </span>
                    {s.text && (
                      <span style={{
                        color:"#6d6d8a", fontSize:12,
                        maxWidth:500, overflow:"hidden",
                        textOverflow:"ellipsis", whiteSpace:"nowrap" as const,
                      }}>
                        {s.text.slice(0, 70)}{s.text.length > 70 ? "…" : ""}
                      </span>
                    )}
                  </div>
                  <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                    <button onClick={()=>move(i,-1)} disabled={i===0} style={{
                      background:"transparent", border:"1px solid #1e1e2e",
                      borderRadius:7, color: i===0 ? "#2a2a3a" : "#9898a8",
                      padding:"4px 10px", fontSize:12,
                      cursor: i===0 ? "not-allowed" : "pointer",
                    }}>↑</button>
                    <button onClick={()=>move(i,1)} disabled={i===stmts.length-1} style={{
                      background:"transparent", border:"1px solid #1e1e2e",
                      borderRadius:7, color: i===stmts.length-1 ? "#2a2a3a" : "#9898a8",
                      padding:"4px 10px", fontSize:12,
                      cursor: i===stmts.length-1 ? "not-allowed" : "pointer",
                    }}>↓</button>
                    <button onClick={()=>remove(i)} style={{
                      background:"#7f1d1d", border:"none", borderRadius:7,
                      color:"#fca5a5", padding:"4px 11px", fontSize:12, cursor:"pointer",
                    }}>Sil</button>
                  </div>
                </div>

                {/* Kart içeriği */}
                <div style={{
                  padding:"20px 20px 22px",
                  display:"grid", gridTemplateColumns:"1fr 220px", gap:16,
                }}>
                  {/* Metin */}
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
                      <div style={{ width:2, height:12, background:"#8750f7", borderRadius:1 }} />
                      <label style={{ color:"#9898b8", fontSize:12, fontWeight:500 }}>Cümle metni</label>
                    </div>
                    <textarea
                      value={s.text}
                      onChange={e => set(i,"text",e.target.value)}
                      style={TEXTAREA}
                      placeholder="Vurgu cümlesi girin…"
                      onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = "#8750f7"}
                      onBlur={e  => (e.target as HTMLTextAreaElement).style.borderColor = "#252535"}
                    />
                  </div>

                  {/* Animasyon yönü */}
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
                      <div style={{ width:2, height:12, background:"#8750f7", borderRadius:1 }} />
                      <label style={{ color:"#9898b8", fontSize:12, fontWeight:500 }}>Animasyon yönü</label>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {DIRECTIONS.map(d => {
                        const m = DIR_META[d];
                        const active = s.direction === d;
                        return (
                          <button key={d} type="button" onClick={()=>set(i,"direction",d)} style={{
                            width:"100%", padding:"9px 14px", border:"none",
                            borderRadius:8, cursor:"pointer", fontSize:12,
                            fontWeight: active ? 600 : 400,
                            textAlign:"left" as const,
                            display:"flex", alignItems:"center", gap:8,
                            background: active ? m.bg : "#12121c",
                            color: active ? m.color : "#52525e",
                            outline: active ? `1px solid ${m.color}40` : "1px solid #1e1e2e",
                            transition:"all 0.15s",
                          }}>
                            <div style={{
                              width:7, height:7, borderRadius:"50%",
                              background: active ? m.color : "#2a2a3a",
                              flexShrink:0,
                            }}/>
                            {m.label}
                            <span style={{ marginLeft:"auto", color: active ? m.color : "#3a3a50", fontSize:11 }}>
                              {d}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Alt aksiyonlar */}
          <div style={{
            display:"flex", alignItems:"center",
            justifyContent:"space-between", paddingTop:4,
          }}>
            <button onClick={add} style={{
              background:"transparent", border:"1px solid #1e1e2e",
              borderRadius:10, color:"#9898a8", padding:"10px 18px",
              fontSize:13, cursor:"pointer",
              display:"flex", alignItems:"center", gap:8,
              transition:"all 0.15s",
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "#8750f7";
                el.style.color = "#a78bfa";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "#1e1e2e";
                el.style.color = "#9898a8";
              }}
            >
              <span style={{ fontSize:16, lineHeight:1 }}>+</span>
              Cümle Ekle
            </button>
            <SaveBtn onClick={save} loading={saving}/>
          </div>

        </div>
      )}
    </div>
  );
}