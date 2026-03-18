"use client";

import { useEffect, useState, useRef } from "react";
import { useLocaleContext } from "../_components/LocaleContext";

type LangItem = { name:string; nativeName:string; level:string; flag:string; backward:string };
type LangData  = { title:string; subtitle:string; levels:Record<string,string>; languages:LangItem[] };

const LEVELS = ["native","professional","intermediate"];
const LEVEL_COLORS: Record<string,{border:string;bg:string;text:string}> = {
  native:       { border:"#4ade80", bg:"#052e16",  text:"#4ade80" },
  professional: { border:"#67e8f9", bg:"#0c1a2e",  text:"#67e8f9" },
  intermediate: { border:"#a5b4fc", bg:"#1e1b4b",  text:"#a5b4fc" },
};
const EMPTY: LangData      = { title:"", subtitle:"", levels:{ native:"Native", professional:"Professional", intermediate:"Intermediate" }, languages:[] };
const EMPTY_LANG: LangItem = { name:"", nativeName:"", level:"professional", flag:"", backward:"" };

const INPUT: React.CSSProperties = {
  width:"100%", background:"#12121c", border:"1px solid #252535",
  borderRadius:8, color:"#e2e2e8", fontSize:13,
  padding:"10px 14px", outline:"none", boxSizing:"border-box",
};

function iFocus(e: React.FocusEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) {
  e.target.style.borderColor = "#8750f7";
}
function iBlur(e: React.FocusEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) {
  e.target.style.borderColor = "#252535";
}

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
    }}>{text}</div>
  );
}

function Field({ label, children }: { label:string; children:React.ReactNode }) {
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
        <div style={{ width:2, height:12, background:"#8750f7", borderRadius:1, flexShrink:0 }}/>
        <label style={{ color:"#9898b8", fontSize:12, fontWeight:500 }}>{label}</label>
      </div>
      {children}
    </div>
  );
}

/* ── Arka plan görseli: URL veya dosya yükleme ── */
function BackwardField({ value, onChange }: { value:string; onChange:(v:string)=>void }) {
  const [tab, setTab]       = useState<"url"|"upload">("url");
  const [uploading, setUpl] = useState(false);
  const fileRef             = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUpl(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((res,rej) => {
        reader.onload  = e => res((e.target?.result as string).split(",")[1]);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      const resp = await fetch("/api/admin/certificates-upload", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ filename: file.name, base64 }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);
      onChange(data.path);
    } catch(e:unknown) { alert((e as Error).message || "Yükleme hatası"); }
    finally { setUpl(false); }
  }

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
        <div style={{ width:2, height:12, background:"#8750f7", borderRadius:1, flexShrink:0 }}/>
        <label style={{ color:"#9898b8", fontSize:12, fontWeight:500 }}>Arka Plan Görseli</label>
        {/* URL / Dosya toggle */}
        <div style={{ marginLeft:"auto", display:"flex", gap:2, background:"#0d0d14", borderRadius:6, padding:2 }}>
          {(["url","upload"] as const).map(t=>(
            <button key={t} type="button" onClick={()=>setTab(t)} style={{
              padding:"2px 9px", borderRadius:5, border:"none", cursor:"pointer", fontSize:11,
              background: tab===t ? "#8750f720" : "transparent",
              color:      tab===t ? "#a78bfa"   : "#52525e",
              fontWeight: tab===t ? 600 : 400,
            }}>
              {t==="url" ? "URL" : "Dosya"}
            </button>
          ))}
        </div>
      </div>

      {tab==="url" ? (
        <input value={value} onChange={e=>onChange(e.target.value)} style={INPUT}
          placeholder="/assets/images/…" onFocus={iFocus} onBlur={iBlur}/>
      ) : (
        <div style={{ display:"flex", gap:8 }}>
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display:"none" }}
            onChange={e=>{ const f=e.target.files?.[0]; if(f) handleFile(f); }}/>
          <button type="button" onClick={()=>fileRef.current?.click()} disabled={uploading} style={{
            ...INPUT, cursor:"pointer", textAlign:"left" as const,
            color: value ? "#e2e2e8" : "#6d6d8a",
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" as const,
          }}>
            {uploading ? "Yükleniyor…" : value || "Dosya seç…"}
          </button>
        </div>
      )}

      {value && (
        <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:10 }}>
          <img src={value} alt="" style={{ width:48, height:28, objectFit:"cover", borderRadius:5, border:"1px solid #1e1e2e" }}
            onError={e=>(e.currentTarget as HTMLImageElement).style.display="none"}/>
          <button type="button" onClick={()=>onChange("")} style={{
            background:"transparent", border:"none", color:"#f87171", fontSize:12, cursor:"pointer", padding:0,
          }}>Kaldır</button>
        </div>
      )}
    </div>
  );
}

/* ── Tek dil kartı ── */
function LangCard({ lang, index, total, onUpdate, onMove, onDelete }: {
  lang: LangItem; index: number; total: number;
  onUpdate:(k:keyof LangItem,v:string)=>void;
  onMove:(dir:-1|1)=>void;
  onDelete:()=>void;
}) {
  const [open, setOpen] = useState(index === 0);
  const lc = LEVEL_COLORS[lang.level] || { border:"#52525e", bg:"#1e1e2e", text:"#9898a8" };

  return (
    <div style={{
      background:"#0d0d14", border:"1px solid #1e1e2e",
      borderLeft:`3px solid ${lc.border}`,
      borderRadius:12, overflow:"hidden",
    }}>
      {/* Başlık */}
      <div
        onClick={()=>setOpen(o=>!o)}
        style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"12px 18px", cursor:"pointer",
          background:"#10101a", borderBottom: open ? "1px solid #1a1a28" : "none",
          transition:"opacity 0.15s",
        }}
      >
        <div style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0 }}>
          {lang.flag
            ? <span style={{ fontSize:22, lineHeight:1, flexShrink:0 }}>{lang.flag}</span>
            : <div style={{ width:28, height:28, borderRadius:6, background:"#1e1e2e", flexShrink:0 }}/>
          }
          <div style={{ minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" as const }}>
              <span style={{ color:"#e2e2e8", fontSize:14, fontWeight:600 }}>
                {lang.name || <span style={{ color:"#3a3a50", fontWeight:400 }}>Yeni Dil</span>}
              </span>
              {lang.nativeName && (
                <span style={{ color:"#52525e", fontSize:12 }}>{lang.nativeName}</span>
              )}
              <span style={{ background:lc.bg, color:lc.text, borderRadius:5, padding:"1px 8px", fontSize:11, fontWeight:600, flexShrink:0 }}>
                {lang.level}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0 }}>
          <span style={{ color:"#3a3a50", fontSize:11 }}>{open ? "▲" : "▼"}</span>
          <div onClick={e=>e.stopPropagation()} style={{ display:"flex", gap:4 }}>
            {([-1,1] as const).map(dir=>(
              <button key={dir} onClick={()=>onMove(dir)}
                disabled={dir===-1?index===0:index===total-1}
                style={{
                  background:"transparent", border:"1px solid #1e1e2e", borderRadius:7,
                  color: (dir===-1?index===0:index===total-1) ? "#2a2a3a" : "#9898a8",
                  padding:"4px 10px", fontSize:12,
                  cursor: (dir===-1?index===0:index===total-1) ? "not-allowed" : "pointer",
                }}>
                {dir===-1?"↑":"↓"}
              </button>
            ))}
            <button onClick={()=>{ if(!confirm("Silinsin mi?")) return; onDelete(); }} style={{
              background:"#7f1d1d", border:"none", borderRadius:7,
              color:"#fca5a5", padding:"4px 11px", fontSize:12, cursor:"pointer",
            }}>Sil</button>
          </div>
        </div>
      </div>

      {/* İçerik */}
      {open && (
        <div style={{ padding:"20px 20px 22px", display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
            <Field label="Ad (İngilizce)">
              <input value={lang.name} onChange={e=>onUpdate("name",e.target.value)}
                style={INPUT} placeholder="Arabic" onFocus={iFocus} onBlur={iBlur}/>
            </Field>
            <Field label="Özgün Ad">
              <input value={lang.nativeName} onChange={e=>onUpdate("nativeName",e.target.value)}
                style={INPUT} placeholder="العربية" onFocus={iFocus} onBlur={iBlur}/>
            </Field>
            <Field label="Seviye">
              <select value={lang.level} onChange={e=>onUpdate("level",e.target.value)}
                style={{ ...INPUT, cursor:"pointer" }} onFocus={iFocus} onBlur={iBlur}>
                {LEVELS.map(lv=><option key={lv} value={lv}>{lv}</option>)}
              </select>
            </Field>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"80px 1fr", gap:16 }}>
            <Field label="Bayrak">
              <input value={lang.flag} onChange={e=>onUpdate("flag",e.target.value)}
                style={{ ...INPUT, fontSize:22, textAlign:"center" as const, padding:"8px" }}
                placeholder="🇸🇦" onFocus={iFocus} onBlur={iBlur}/>
            </Field>
            <BackwardField value={lang.backward} onChange={v=>onUpdate("backward",v)}/>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══ ANA SAYFA ══ */
export default function LanguagesPage() {
  const { locale } = useLocaleContext();
  const [data,setData]       = useState<LangData>(EMPTY);
  const [loading,setLoading] = useState(true);
  const [saving,setSaving]   = useState(false);
  const [toast,setToast]     = useState<{ok:boolean;text:string}|null>(null);

  useEffect(()=>{
    setLoading(true);
    fetch(`/api/admin/languages?locale=${locale}`)
      .then(r=>r.json())
      .then(d=>setData({ title:d.title||"", subtitle:d.subtitle||"", levels:{...EMPTY.levels,...(d.levels||{})}, languages:Array.isArray(d.languages)?d.languages:[] }))
      .catch(()=>setData(EMPTY))
      .finally(()=>setLoading(false));
  },[locale]);

  function showToast(ok:boolean,text:string){ setToast({ok,text}); setTimeout(()=>setToast(null),3000); }
  function updateLang(i:number,k:keyof LangItem,v:string){ setData(d=>{ const a=[...d.languages]; a[i]={...a[i],[k]:v}; return{...d,languages:a}; }); }
  function move(i:number,dir:-1|1){ const j=i+dir; if(j<0||j>=data.languages.length) return; const a=[...data.languages]; [a[i],a[j]]=[a[j],a[i]]; setData(d=>({...d,languages:a})); }
  function remove(i:number){ setData(d=>({...d,languages:d.languages.filter((_,j)=>j!==i)})); }

  async function save(){
    setSaving(true);
    try{
      const res=await fetch(`/api/admin/languages?locale=${locale}`,{ method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
      if(!res.ok) throw new Error((await res.json()).error);
      showToast(true,`Kaydedildi [${locale.toUpperCase()}] ✓`);
    }catch(e:unknown){ showToast(false,(e as Error).message||"Hata"); }
    finally{ setSaving(false); }
  }

  return (
    <div style={{ paddingBottom:80 }}>
      {toast && <Toast {...toast}/>}

      {/* ── Sayfa başlığı ── */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, marginBottom:32 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
            <div style={{ width:3, height:24, background:"#8750f7", borderRadius:2, flexShrink:0 }}/>
            <h1 style={{ color:"#e2e2e8", fontSize:24, fontWeight:700, lineHeight:1 }}>Diller</h1>
          </div>
          <div style={{ marginLeft:13, display:"flex", alignItems:"center", gap:10 }}>
            <code style={{ color:"#6d6d8a", fontSize:12, background:"#12121c", padding:"3px 8px", borderRadius:5, border:"1px solid #1e1e2e" }}>
              messages/languages/{locale}.json
            </code>
            <span style={{ color:"#52525e", fontSize:12 }}>·</span>
            <span style={{ color:"#52525e", fontSize:12 }}>{data.languages.length} dil</span>
          </div>
        </div>
        <SaveBtn onClick={save} loading={saving}/>
      </div>

      {loading ? (
        <div style={{ color:"#52525e", fontSize:13, padding:"60px 0", textAlign:"center" as const }}>Yükleniyor…</div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* ── Bölüm Ayarları ── */}
          <div style={{ background:"#10101a", border:"1px solid #1e1e2e", borderRadius:16, padding:"24px 26px" }}>
            <div style={{ color:"#52525e", fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" as const, marginBottom:20, paddingBottom:14, borderBottom:"1px solid #1a1a28" }}>
              Bölüm Ayarları
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
              <Field label="Başlık">
                <input value={data.title} onChange={e=>setData(d=>({...d,title:e.target.value}))} style={INPUT} onFocus={iFocus} onBlur={iBlur}/>
              </Field>
              <Field label="Alt Başlık">
                <input value={data.subtitle} onChange={e=>setData(d=>({...d,subtitle:e.target.value}))} style={INPUT} onFocus={iFocus} onBlur={iBlur}/>
              </Field>
            </div>

            {/* Seviye etiketleri */}
            <div style={{ borderTop:"1px solid #1a1a28", paddingTop:20 }}>
              <div style={{ color:"#52525e", fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" as const, marginBottom:16 }}>
                Seviye Etiketleri
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20 }}>
                {LEVELS.map(lv=>{
                  const c=LEVEL_COLORS[lv];
                  return (
                    <div key={lv}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
                        <div style={{ width:2, height:12, background:c.border, borderRadius:1, flexShrink:0 }}/>
                        <span style={{ background:c.bg, color:c.text, borderRadius:4, padding:"1px 8px", fontSize:11, fontWeight:600 }}>{lv}</span>
                      </div>
                      <input value={data.levels[lv]||""} onChange={e=>setData(d=>({...d,levels:{...d.levels,[lv]:e.target.value}}))} style={INPUT} onFocus={iFocus} onBlur={iBlur}/>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Dil Listesi ── */}
          <div style={{ background:"#10101a", border:"1px solid #1e1e2e", borderRadius:16, padding:"24px 26px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, paddingBottom:14, borderBottom:"1px solid #1a1a28" }}>
              <div>
                <div style={{ color:"#e2e2e8", fontSize:15, fontWeight:600, marginBottom:3 }}>Dil Listesi</div>
                <div style={{ color:"#52525e", fontSize:12 }}>Konuşulan diller ve yetkinlik seviyeleri</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                {data.languages.length > 0 && (
                  <div style={{ background:"#8750f715", border:"1px solid #8750f730", borderRadius:7, padding:"3px 10px" }}>
                    <span style={{ color:"#a78bfa", fontSize:11, fontWeight:600 }}>{data.languages.length} dil</span>
                  </div>
                )}
                <button onClick={()=>setData(d=>({...d,languages:[...d.languages,{...EMPTY_LANG}]}))} style={{
                  background:"transparent", border:"1px solid #1e1e2e",
                  borderRadius:10, color:"#9898a8", padding:"8px 16px",
                  fontSize:13, cursor:"pointer",
                  display:"flex", alignItems:"center", gap:8, transition:"all 0.15s",
                }}
                  onMouseEnter={e=>{ const el=e.currentTarget as HTMLElement; el.style.borderColor="#8750f7"; el.style.color="#a78bfa"; }}
                  onMouseLeave={e=>{ const el=e.currentTarget as HTMLElement; el.style.borderColor="#1e1e2e"; el.style.color="#9898a8"; }}
                >
                  <span style={{ fontSize:16 }}>+</span> Dil Ekle
                </button>
              </div>
            </div>

            {data.languages.length===0 ? (
              <div style={{ textAlign:"center" as const, padding:"48px 24px" }}>
                <div style={{ color:"#52525e", fontSize:32, marginBottom:12 }}>◐</div>
                <p style={{ color:"#52525e", fontSize:14 }}>Henüz dil eklenmemiş.</p>
                <p style={{ color:"#3a3a50", fontSize:12, marginTop:4, marginBottom:20 }}>İlk dili ekleyerek başlayın.</p>
                <button onClick={()=>setData(d=>({...d,languages:[{...EMPTY_LANG}]}))} style={{
                  background:"#8750f7", border:"none", borderRadius:10,
                  color:"#fff", padding:"10px 22px", fontSize:13, fontWeight:600, cursor:"pointer",
                }}>
                  İlk Dili Ekle
                </button>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {data.languages.map((lang,i)=>(
                  <LangCard
                    key={i} lang={lang} index={i} total={data.languages.length}
                    onUpdate={(k,v)=>updateLang(i,k,v)}
                    onMove={dir=>move(i,dir)}
                    onDelete={()=>remove(i)}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={{ display:"flex", justifyContent:"flex-end", paddingTop:4 }}>
            <SaveBtn onClick={save} loading={saving}/>
          </div>
        </div>
      )}
    </div>
  );
}