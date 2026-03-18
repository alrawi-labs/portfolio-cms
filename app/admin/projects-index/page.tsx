"use client";

import { useEffect, useState } from "react";
import { useLocaleContext } from "../_components/LocaleContext";

type PIData = {
  hero:{ badge:string; title:string; subtitle:string };
  search:{ placeholder:string; filterButton:string; showingResults:string; project:string; projects:string };
  categories:Record<string,string>;
  projectCard:{ technologiesUsed:string };
  noResults:{ title:string; description:string; clearButton:string };
  featuredProjects:{ title:string; subtitle:string; viewProject:string; allProjects:{ title:string; description:string; button:string; stats:{ projects:string; technologies:string; years:string } } };
};
const EMPTY: PIData = {
  hero:{badge:"",title:"",subtitle:""},
  search:{placeholder:"",filterButton:"",showingResults:"",project:"",projects:""},
  categories:{},
  projectCard:{technologiesUsed:""},
  noResults:{title:"",description:"",clearButton:""},
  featuredProjects:{title:"",subtitle:"",viewProject:"",allProjects:{title:"",description:"",button:"",stats:{projects:"",technologies:"",years:""}}},
};
const INPUT: React.CSSProperties = {background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:8,color:"#e5e7eb",fontSize:13,padding:"8px 11px",width:"100%",boxSizing:"border-box"};

function Btn({onClick,children,variant="primary",disabled=false,small=false}:{onClick?:()=>void;children:React.ReactNode;variant?:"primary"|"danger"|"ghost";disabled?:boolean;small?:boolean}){
  const s:Record<string,React.CSSProperties>={primary:{background:"#4f46e5",color:"#fff",border:"none"},danger:{background:"#7f1d1d",color:"#fca5a5",border:"none"},ghost:{background:"transparent",color:"#888",border:"1px solid #2a2a2a"}};
  return <button onClick={onClick} disabled={disabled} style={{...s[variant],borderRadius:8,padding:small?"4px 11px":"8px 16px",fontSize:small?12:13,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1}}>{children}</button>;
}
function Toast({ok,text}:{ok:boolean;text:string}){return <div style={{position:"fixed",top:24,right:24,zIndex:9999,background:ok?"#052e16":"#1f0a0a",border:`1px solid ${ok?"#14532d":"#3f1010"}`,color:ok?"#4ade80":"#f87171",borderRadius:10,padding:"11px 18px",fontSize:13}}>{text}</div>;}
function Card({title,children}:{title:string;children:React.ReactNode}){return <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:12,padding:"16px 18px"}}><div style={{color:"#555",fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase" as const,marginBottom:12}}>{title}</div><div style={{display:"flex",flexDirection:"column",gap:10}}>{children}</div></div>;}
function Grid({cols=2,children}:{cols?:number;children:React.ReactNode}){return <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:10}}>{children}</div>;}
function F({label,children}:{label:string;children:React.ReactNode}){return <div><label style={{color:"#666",fontSize:11,display:"block",marginBottom:4}}>{label}</label>{children}</div>;}

export default function ProjectsIndexPage() {
  const { locale, setLocale, locales, localesLoading: ll } = useLocaleContext();
  const [data,setData]       = useState<PIData>(EMPTY);
  const [loading,setLoading] = useState(true);
  const [saving,setSaving]   = useState(false);
  const [toast,setToast]     = useState<{ok:boolean;text:string}|null>(null);
  const [nKey,setNKey]       = useState("");
  const [nLabel,setNLabel]   = useState("");

  useEffect(()=>{
    setLoading(true);
    fetch(`/api/admin/projects-index?locale=${locale}`).then(r=>r.json()).then(d=>setData({
      hero:{...EMPTY.hero,...(d.hero||{})},
      search:{...EMPTY.search,...(d.search||{})},
      categories:typeof d.categories==="object"?d.categories:{},
      projectCard:{...EMPTY.projectCard,...(d.projectCard||{})},
      noResults:{...EMPTY.noResults,...(d.noResults||{})},
      featuredProjects:{...EMPTY.featuredProjects,...(d.featuredProjects||{}),allProjects:{...EMPTY.featuredProjects.allProjects,...(d.featuredProjects?.allProjects||{}),stats:{...EMPTY.featuredProjects.allProjects.stats,...(d.featuredProjects?.allProjects?.stats||{})}}},
    })).catch(()=>setData(EMPTY)).finally(()=>setLoading(false));
  },[locale]);

  function showToast(ok:boolean,text:string){setToast({ok,text});setTimeout(()=>setToast(null),3000);}
  function addCat(){const k=nKey.trim();const l=nLabel.trim();if(!k||!l)return;setData(d=>({...d,categories:{...d.categories,[k]:l}}));setNKey("");setNLabel("");}
  function removeCat(k:string){setData(d=>{const c={...d.categories};delete c[k];return{...d,categories:c};});}

  async function save(){
    setSaving(true);
    try{const res=await fetch(`/api/admin/projects-index?locale=${locale}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});if(!res.ok)throw new Error((await res.json()).error);showToast(true,`Kaydedildi [${locale.toUpperCase()}] ✓`);}
    catch(e:unknown){showToast(false,(e as Error).message||"Hata");}finally{setSaving(false);}
  }

  return (
    <div style={{maxWidth:760,paddingBottom:60}}>
      {toast&&<Toast {...toast}/>}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div><h1 style={{color:"#fff",fontSize:22,fontWeight:600}}>Projeler Sayfası Metinleri</h1><p style={{color:"#555",fontSize:13,marginTop:3}}>messages/projects/index/{"{locale}"}.json</p></div>
        <Btn onClick={save} disabled={saving}>{saving?"Kaydediliyor…":"Kaydet"}</Btn>
      </div>

      {loading?<p style={{color:"#555"}}>Yükleniyor…</p>:(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card title="Sayfa Başlığı (Hero)">
            <Grid cols={3}>
              <F label="badge"><input value={data.hero.badge} onChange={e=>setData(d=>({...d,hero:{...d.hero,badge:e.target.value}}))} style={INPUT}/></F>
              <F label="title"><input value={data.hero.title} onChange={e=>setData(d=>({...d,hero:{...d.hero,title:e.target.value}}))} style={INPUT}/></F>
              <F label="subtitle"><input value={data.hero.subtitle} onChange={e=>setData(d=>({...d,hero:{...d.hero,subtitle:e.target.value}}))} style={INPUT}/></F>
            </Grid>
          </Card>

          <Card title="Arama & Filtreleme">
            <Grid cols={3}>
              {(Object.keys(EMPTY.search) as (keyof typeof EMPTY.search)[]).map(k=>(
                <F key={k} label={k}><input value={data.search[k]} onChange={e=>setData(d=>({...d,search:{...d.search,[k]:e.target.value}}))} style={INPUT}/></F>
              ))}
            </Grid>
          </Card>

          <Card title="Filtre Kategorileri">
            <p style={{color:"#555",fontSize:12}}>Key, proje JSON'undaki <code style={{color:"#6366f1"}}>category</code> alanıyla eşleşmeli.</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {Object.entries(data.categories).map(([key,label])=>(
                <div key={key} style={{display:"grid",gridTemplateColumns:"1fr 2fr 36px",gap:8,alignItems:"center"}}>
                  <div style={{...INPUT,color:"#6366f1",fontFamily:"monospace",fontSize:12,padding:"8px 11px"}}>{key}</div>
                  <input value={label} onChange={e=>setData(d=>({...d,categories:{...d.categories,[key]:e.target.value}}))} style={INPUT}/>
                  <button onClick={()=>removeCat(key)} style={{background:"#3f1010",border:"none",borderRadius:6,color:"#fca5a5",cursor:"pointer",height:34,fontSize:14}}>✕</button>
                </div>
              ))}
            </div>
            <div style={{borderTop:"1px solid #1e1e1e",paddingTop:12,display:"grid",gridTemplateColumns:"1fr 2fr auto",gap:8}}>
              <input value={nKey} onChange={e=>setNKey(e.target.value)} style={INPUT} placeholder="anahtar (ör: aiMl)"/>
              <input value={nLabel} onChange={e=>setNLabel(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCat()} style={INPUT} placeholder="Görünen ad (ör: AI / ML)"/>
              <Btn onClick={addCat} variant="ghost" small>+ Ekle</Btn>
            </div>
          </Card>

          <Card title="Sonuç Bulunamadı">
            <Grid cols={3}>
              {(Object.keys(EMPTY.noResults) as (keyof typeof EMPTY.noResults)[]).map(k=>(
                <F key={k} label={k}><input value={data.noResults[k]} onChange={e=>setData(d=>({...d,noResults:{...d.noResults,[k]:e.target.value}}))} style={INPUT}/></F>
              ))}
            </Grid>
          </Card>

          <Card title="Öne Çıkan Projeler">
            <Grid cols={3}>
              <F label="title"><input value={data.featuredProjects.title} onChange={e=>setData(d=>({...d,featuredProjects:{...d.featuredProjects,title:e.target.value}}))} style={INPUT}/></F>
              <F label="subtitle"><input value={data.featuredProjects.subtitle} onChange={e=>setData(d=>({...d,featuredProjects:{...d.featuredProjects,subtitle:e.target.value}}))} style={INPUT}/></F>
              <F label="viewProject"><input value={data.featuredProjects.viewProject} onChange={e=>setData(d=>({...d,featuredProjects:{...d.featuredProjects,viewProject:e.target.value}}))} style={INPUT}/></F>
            </Grid>
            <div style={{borderTop:"1px solid #1e1e1e",paddingTop:10}}>
              <p style={{color:"#555",fontSize:11,marginBottom:8}}>Tüm Projeler Alt Bölümü</p>
              <Grid cols={3}>
                <F label="title"><input value={data.featuredProjects.allProjects.title} onChange={e=>setData(d=>({...d,featuredProjects:{...d.featuredProjects,allProjects:{...d.featuredProjects.allProjects,title:e.target.value}}}))} style={INPUT}/></F>
                <F label="button"><input value={data.featuredProjects.allProjects.button} onChange={e=>setData(d=>({...d,featuredProjects:{...d.featuredProjects,allProjects:{...d.featuredProjects.allProjects,button:e.target.value}}}))} style={INPUT}/></F>
                <F label="description"><input value={data.featuredProjects.allProjects.description} onChange={e=>setData(d=>({...d,featuredProjects:{...d.featuredProjects,allProjects:{...d.featuredProjects.allProjects,description:e.target.value}}}))} style={INPUT}/></F>
                <F label="stats.projects"><input value={data.featuredProjects.allProjects.stats.projects} onChange={e=>setData(d=>({...d,featuredProjects:{...d.featuredProjects,allProjects:{...d.featuredProjects.allProjects,stats:{...d.featuredProjects.allProjects.stats,projects:e.target.value}}}}))} style={INPUT}/></F>
                <F label="stats.technologies"><input value={data.featuredProjects.allProjects.stats.technologies} onChange={e=>setData(d=>({...d,featuredProjects:{...d.featuredProjects,allProjects:{...d.featuredProjects.allProjects,stats:{...d.featuredProjects.allProjects.stats,technologies:e.target.value}}}}))} style={INPUT}/></F>
                <F label="stats.years"><input value={data.featuredProjects.allProjects.stats.years} onChange={e=>setData(d=>({...d,featuredProjects:{...d.featuredProjects,allProjects:{...d.featuredProjects.allProjects,stats:{...d.featuredProjects.allProjects.stats,years:e.target.value}}}}))} style={INPUT}/></F>
              </Grid>
            </div>
          </Card>

          <div><Btn onClick={save} disabled={saving}>{saving?"Kaydediliyor…":"Değişiklikleri Kaydet"}</Btn></div>
        </div>
      )}
    </div>
  );
}