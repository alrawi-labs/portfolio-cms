"use client";

import { useEffect, useState } from "react";
import { useLocaleContext } from "../_components/LocaleContext";

type HeaderTexts = { home:string; stats:string; services:string; work:string; projects:string; resume:string; about:string; skills:string; languages:string; volunteering:string; certificates:string; contact:string; startAProject:string };
type HeroTexts   = { greeting:string; name:string; titleLine1:string; titleLine2:string; description:string; downloadCV:string; viewWork:string; follow:string };
type StatsTexts  = { title:string; subtitle:string; yearsLabel:string; yearsDesc:string; projectsLabel:string; projectsDesc:string; clientsLabel:string; clientsDesc:string; awardsLabel:string; awardsDesc:string; trustedBy:string; yearsExp:string; projects:string; k:string };
type MainData    = { header:HeaderTexts; home:{ hero:HeroTexts; stats:StatsTexts }; [key:string]:unknown };

const EMPTY: MainData = {
  header:{ home:"",stats:"",services:"",work:"",projects:"",resume:"",about:"",skills:"",languages:"",volunteering:"",certificates:"",contact:"",startAProject:"" },
  home:{
    hero:{ greeting:"",name:"",titleLine1:"",titleLine2:"",description:"",downloadCV:"",viewWork:"",follow:"" },
    stats:{ title:"",subtitle:"",yearsLabel:"",yearsDesc:"",projectsLabel:"",projectsDesc:"",clientsLabel:"",clientsDesc:"",awardsLabel:"",awardsDesc:"",trustedBy:"",yearsExp:"",projects:"",k:"" },
  },
};

const INPUT: React.CSSProperties = {
  width:"100%", background:"#12121c", border:"1px solid #252535",
  borderRadius:8, color:"#e2e2e8", fontSize:13,
  padding:"10px 14px", outline:"none",
  boxSizing:"border-box",
};
const TEXTAREA: React.CSSProperties = {
  ...INPUT, resize:"vertical" as const, minHeight:90, lineHeight:1.6,
};

function SaveBtn({ onClick, loading }: { onClick:()=>void; loading:boolean }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      background: loading ? "#6340b5" : "#8750f7",
      color:"#fff", border:"none", borderRadius:10,
      padding:"10px 22px", fontSize:13, fontWeight:600,
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
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

function Field({ label, badge, children }: { label:string; badge?:string; children:React.ReactNode }) {
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
        <div style={{ width:2, height:12, background:"#8750f7", borderRadius:1, flexShrink:0 }} />
        <label style={{ color:"#9898b8", fontSize:12, fontWeight:500, letterSpacing:"0.02em" }}>
          {label}
        </label>
        {badge && (
          <span style={{
            background:"#8750f715", color:"#a78bfa",
            fontSize:10, borderRadius:4, padding:"1px 6px", fontWeight:600,
          }}>
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function SectionCard({ title, desc, count, children }: { title:string; desc:string; count?:number; children:React.ReactNode }) {
  return (
    <div style={{
      background:"#10101a", border:"1px solid #1e1e2e",
      borderRadius:16, padding:"28px 28px 32px",
    }}>
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:24, paddingBottom:16, borderBottom:"1px solid #1a1a28",
      }}>
        <div>
          <div style={{ color:"#e2e2e8", fontSize:15, fontWeight:600, marginBottom:3 }}>{title}</div>
          <div style={{ color:"#52525e", fontSize:12 }}>{desc}</div>
        </div>
        {count !== undefined && (
          <div style={{ background:"#8750f715", border:"1px solid #8750f730", borderRadius:7, padding:"3px 10px" }}>
            <span style={{ color:"#a78bfa", fontSize:11, fontWeight:600 }}>{count} alan</span>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

export default function MainTextsPage() {
  const { locale } = useLocaleContext();
  const [data, setData]       = useState<MainData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState<{ok:boolean;text:string}|null>(null);
  const [tab, setTab]         = useState<"header"|"hero"|"stats">("header");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/main-texts?locale=${locale}`)
      .then(r => r.json())
      .then(d => setData({
        ...d,
        header: { ...EMPTY.header, ...(d.header||{}) },
        home: {
          ...d.home,
          hero:  { ...EMPTY.home.hero,  ...(d.home?.hero||{})  },
          stats: { ...EMPTY.home.stats, ...(d.home?.stats||{}) },
        },
      }))
      .catch(() => setData(EMPTY))
      .finally(() => setLoading(false));
  }, [locale]);

  function showToast(ok:boolean, text:string) { setToast({ok,text}); setTimeout(()=>setToast(null),3000); }
  function setHeader(k:keyof HeaderTexts, v:string) { setData(d=>({...d,header:{...d.header,[k]:v}})); }
  function setHero(k:keyof HeroTexts, v:string)     { setData(d=>({...d,home:{...d.home,hero:{...d.home.hero,[k]:v}}})); }
  function setStats(k:keyof StatsTexts, v:string)   { setData(d=>({...d,home:{...d.home,stats:{...d.home.stats,[k]:v}}})); }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/main-texts?locale=${locale}`, {
        method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(true, `Kaydedildi [${locale.toUpperCase()}] ✓`);
    } catch(e:unknown) { showToast(false,(e as Error).message||"Hata"); }
    finally { setSaving(false); }
  }

  /* focus/blur handler'ları */
  function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.target.style.borderColor = "#8750f7";
  }
  function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.target.style.borderColor = "#252535";
  }

  const TABS = [
    { key:"header" as const, label:"Menü" },
    { key:"hero"   as const, label:"Hero" },
    { key:"stats"  as const, label:"İstatistikler" },
  ];

  return (
    <div style={{ paddingBottom:80 }}>
      {toast && <Toast {...toast}/>}

      {/* Sayfa başlığı */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:36 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
            <div style={{ width:3, height:22, background:"#8750f7", borderRadius:2 }} />
            <h1 style={{ color:"#e2e2e8", fontSize:22, fontWeight:700 }}>Ana Sayfa Metinleri</h1>
          </div>
          <div style={{ marginLeft:13 }}>
            <code style={{
              color:"#6d6d8a", fontSize:12, background:"#12121c",
              padding:"3px 8px", borderRadius:5, border:"1px solid #1e1e2e",
            }}>
              messages/{locale}.json
            </code>
          </div>
        </div>
        <SaveBtn onClick={save} loading={saving}/>
      </div>

      {/* Sekme çubuğu */}
      <div style={{
        display:"flex", gap:6, marginBottom:28,
        background:"#0a0a12", border:"1px solid #1a1a28",
        borderRadius:12, padding:5,
      }}>
        {TABS.map(t => {
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={()=>setTab(t.key)} style={{
              flex:1, padding:"10px 16px", border:"none", cursor:"pointer",
              fontSize:13, fontWeight: active ? 600 : 400,
              borderRadius:8,
              background: active ? "#8750f7" : "transparent",
              color: active ? "#fff" : "#52525e",
            }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ color:"#52525e", fontSize:13, padding:"40px 0", textAlign:"center" as const }}>
          Yükleniyor…
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* ── MENÜ ── */}
          {tab === "header" && (
            <SectionCard
              title="Navigasyon Menüsü"
              desc="Üst menüde görünen bağlantı yazıları"
              count={Object.keys(EMPTY.header).length}
            >
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:20 }}>
                {(Object.keys(EMPTY.header) as (keyof HeaderTexts)[]).map(k => (
                  <Field
                    key={k}
                    label={k}
                    badge={k === "startAProject" ? "Buton metni" : undefined}
                  >
                    <input
                      value={data.header[k]}
                      onChange={e => setHeader(k, e.target.value)}
                      style={INPUT}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </Field>
                ))}
              </div>
            </SectionCard>
          )}

          {/* ── HERO ── */}
          {tab === "hero" && (
            <SectionCard
              title="Hero Bölümü"
              desc="Ana sayfanın üst kısmındaki tanıtım metinleri"
              count={Object.keys(EMPTY.home.hero).length}
            >
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20 }}>
                {(["greeting","name","titleLine1","titleLine2","downloadCV","viewWork","follow"] as (keyof HeroTexts)[]).map(k => (
                  <Field key={k} label={k}>
                    <input
                      value={data.home.hero[k]}
                      onChange={e => setHero(k, e.target.value)}
                      style={INPUT}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </Field>
                ))}
              </div>
              <div style={{ marginTop:20 }}>
                <Field label="description" badge="Uzun metin">
                  <textarea
                    value={data.home.hero.description}
                    onChange={e => setHero("description", e.target.value)}
                    style={TEXTAREA}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </Field>
              </div>
            </SectionCard>
          )}

          {/* ── İSTATİSTİKLER ── */}
          {tab === "stats" && (
            <SectionCard
              title="İstatistik Bölümü"
              desc="Stats bölümünde görünen başlık ve etiketler"
              count={Object.keys(EMPTY.home.stats).length}
            >
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20 }}>
                {(Object.keys(EMPTY.home.stats) as (keyof StatsTexts)[]).map(k => (
                  <Field key={k} label={k}>
                    <input
                      value={data.home.stats[k]}
                      onChange={e => setStats(k, e.target.value)}
                      style={INPUT}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </Field>
                ))}
              </div>
            </SectionCard>
          )}

          <div style={{ display:"flex", justifyContent:"flex-end", paddingTop:4 }}>
            <SaveBtn onClick={save} loading={saving}/>
          </div>

        </div>
      )}
    </div>
  );
}