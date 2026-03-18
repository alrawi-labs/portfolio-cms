"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocaleContext } from "./_components/LocaleContext";

type CountData = {
  projects: number; services: number; certificates: number;
  volunteering: number; languages: number;
};

const CONTENT_SECTIONS = [
  { href: "/admin/main-texts",     label: "Ana Sayfa Metinleri",  icon: "✦", color: "#8750f7", bg: "#8750f715", desc: "Hero, menü, stats metinleri" },
  { href: "/admin/vision",         label: "Vision Cümleleri",     icon: "◌", color: "#a78bfa", bg: "#a78bfa15", desc: "Anasayfa vurgulu cümleler" },
  { href: "/admin/projects",       label: "Projeler",             icon: "⬡", color: "#38bdf8", bg: "#38bdf815", desc: "Tüm proje kartları", countKey: "projects" },
  { href: "/admin/projects-index", label: "Proje Sayfası",        icon: "⬢", color: "#22d3ee", bg: "#22d3ee15", desc: "Projeler sayfası metinleri" },
  { href: "/admin/services",       label: "Servisler",            icon: "◎", color: "#34d399", bg: "#34d39915", desc: "Hizmet kartları", countKey: "services" },
  { href: "/admin/skills",         label: "Beceriler",            icon: "◆", color: "#c084fc", bg: "#c084fc15", desc: "Teknoloji & araçlar" },
  { href: "/admin/resume",         label: "Deneyim & Eğitim",     icon: "◇", color: "#f472b6", bg: "#f472b615", desc: "CV bilgileri" },
  { href: "/admin/certificates",   label: "Sertifikalar",         icon: "◉", color: "#fb923c", bg: "#fb923c15", desc: "Sertifika listesi", countKey: "certificates" },
  { href: "/admin/volunteering",   label: "Gönüllülük",           icon: "○", color: "#2dd4bf", bg: "#2dd4bf15", desc: "Gönüllü etkinlikler", countKey: "volunteering" },
  { href: "/admin/languages",      label: "Diller",               icon: "◐", color: "#818cf8", bg: "#818cf815", desc: "Dil seviyeleri", countKey: "languages" },
];

const SETTINGS_SECTIONS = [
  { href: "/admin/personal",  label: "Kişisel & Stats", icon: "◑", color: "#8750f7", bg: "#8750f715", desc: "Profil fotoğrafı, istatistikler" },
  { href: "/admin/contact",   label: "İletişim",        icon: "◒", color: "#38bdf8", bg: "#38bdf815", desc: "E-posta, sosyal medya" },
  { href: "/admin/logo",      label: "Logo",            icon: "◓", color: "#34d399", bg: "#34d39915", desc: "Site logosu" },
  { href: "/admin/locales",   label: "Dil Yönetimi",    icon: "⊕", color: "#f472b6", bg: "#f472b615", desc: "Dil ekle / sil" },
];

const STAT_CARDS = [
  { key: "projects",     label: "Projeler",     icon: "⬡", color: "#38bdf8", href: "/admin/projects" },
  { key: "services",     label: "Servisler",    icon: "◎", color: "#34d399", href: "/admin/services" },
  { key: "certificates", label: "Sertifikalar", icon: "◉", color: "#fb923c", href: "/admin/certificates" },
  { key: "volunteering", label: "Gönüllülük",   icon: "○", color: "#2dd4bf", href: "/admin/volunteering" },
  { key: "languages",    label: "Diller",       icon: "◐", color: "#818cf8", href: "/admin/languages" },
] as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      color: "#52525e", fontSize: 11, fontWeight: 600,
      letterSpacing: "0.08em", textTransform: "uppercase" as const,
      marginBottom: 14, display: "flex", alignItems: "center", gap: 10,
    }}>
      <div style={{ flex: 1, height: 1, background: "#1e1e2e" }} />
      <span>{children}</span>
      <div style={{ flex: 1, height: 1, background: "#1e1e2e" }} />
    </div>
  );
}

export default function DashboardPage() {
  const { locale } = useLocaleContext();
  const [counts, setCounts]   = useState<Partial<CountData>>({});
  const [loading, setLoading] = useState(true);
  const [time, setTime]       = useState("");

  /* Saat */
  useEffect(() => {
    function tick() {
      setTime(new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* Sayılar */
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [projects, services, certs, vol, langs] = await Promise.allSettled([
          fetch("/api/admin/projects").then(r => r.json()),
          fetch(`/api/admin/services?locale=${locale}`).then(r => r.json()),
          fetch(`/api/admin/certificates?locale=${locale}`).then(r => r.json()),
          fetch(`/api/admin/volunteering?locale=${locale}`).then(r => r.json()),
          fetch(`/api/admin/languages?locale=${locale}`).then(r => r.json()),
        ]);
        setCounts({
          projects:     projects.status === "fulfilled" && Array.isArray(projects.value)                    ? projects.value.length                  : 0,
          services:     services.status === "fulfilled" && Array.isArray(services.value?.items)             ? services.value.items.length            : 0,
          certificates: certs.status    === "fulfilled" && Array.isArray(certs.value?.certificates)         ? certs.value.certificates.length        : 0,
          volunteering: vol.status      === "fulfilled" && Array.isArray(vol.value?.volunteering)           ? vol.value.volunteering.length          : 0,
          languages:    langs.status    === "fulfilled" && Array.isArray(langs.value?.languages)            ? langs.value.languages.length           : 0,
        });
      } catch { /* sessiz */ }
      finally { setLoading(false); }
    }
    load();
  }, [locale]);

  const totalItems = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);

  return (
    <div style={{ paddingBottom: 80 }}>

      {/* ══ Hero başlık ══ */}
      <div style={{
        background: "linear-gradient(135deg, #8750f710 0%, #111118 60%)",
        border: "1px solid #1e1e2e",
        borderRadius: 16, padding: "28px 28px 24px",
        marginBottom: 28, position: "relative", overflow: "hidden",
      }}>
        {/* Dekoratif halka */}
        <div style={{
          position: "absolute", right: -40, top: -40,
          width: 200, height: 200, borderRadius: "50%",
          border: "1px solid #8750f720", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: -10, top: -10,
          width: 120, height: 120, borderRadius: "50%",
          border: "1px solid #8750f730", pointerEvents: "none",
        }} />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#8750f7",
                boxShadow: "0 0 0 3px #8750f730",
              }} />
              <span style={{ color: "#52525e", fontSize: 12 }}>Portfolio CMS</span>
            </div>
            <h1 style={{ color: "#e2e2e8", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
              Dashboard
            </h1>
            <p style={{ color: "#52525e", fontSize: 14 }}>
              Portfolio içeriklerinizi yönetin.{" "}
              <span style={{ color: "#8750f7" }}>{totalItems} içerik</span> mevcut.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
            {/* Saat */}
            <div style={{
              background: "#111118", border: "1px solid #1e1e2e", borderRadius: 10,
              padding: "6px 14px", color: "#e2e2e8", fontSize: 18, fontWeight: 600,
              fontFamily: "monospace", letterSpacing: "0.05em",
            }}>
              {time || "—:—"}
            </div>
            {/* Aktif dil */}
            <div style={{
              background: "#8750f720", border: "1px solid #8750f740",
              borderRadius: 8, padding: "4px 12px",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8750f7" }} />
              <span style={{ color: "#a78bfa", fontSize: 12, fontWeight: 600 }}>
                {locale.toUpperCase()} aktif
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Özet sayaçlar ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 36 }}>
        {STAT_CARDS.map(stat => (
          <Link key={stat.href} href={stat.href} style={{ textDecoration: "none" }}>
            <div style={{
              background: "#16161f", border: "1px solid #1e1e2e",
              borderRadius: 12, padding: "16px 18px",
              transition: "border-color 0.2s, transform 0.15s",
              cursor: "pointer",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = stat.color + "60";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#1e1e2e";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: stat.color + "20",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: stat.color, fontSize: 15,
                }}>
                  {stat.icon}
                </div>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: loading ? "#52525e" : stat.color,
                  transition: "background 0.3s",
                }} />
              </div>
              <div style={{ color: "#e2e2e8", fontSize: 26, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>
                {loading ? "—" : (counts[stat.key] ?? 0)}
              </div>
              <div style={{ color: "#52525e", fontSize: 12 }}>{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* ══ İçerik Yönetimi ══ */}
      <div style={{ marginBottom: 32 }}>
        <SectionLabel>İçerik Yönetimi</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 10 }}>
          {CONTENT_SECTIONS.map(s => (
            <Link key={s.href} href={s.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: "#16161f", border: "1px solid #1e1e2e",
                borderRadius: 12, padding: "16px 18px",
                display: "flex", flexDirection: "column", gap: 12,
                height: "100%", boxSizing: "border-box" as const,
                transition: "border-color 0.2s, transform 0.15s",
                cursor: "pointer",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = s.color + "50";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#1e1e2e";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {/* İkon + sayaç */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: s.bg, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    color: s.color, fontSize: 17, flexShrink: 0,
                  }}>
                    {s.icon}
                  </div>
                  {s.countKey && (
                    <div style={{
                      background: s.bg, color: s.color,
                      borderRadius: 6, padding: "2px 8px",
                      fontSize: 12, fontWeight: 600,
                    }}>
                      {loading ? "—" : (counts[s.countKey as keyof CountData] ?? 0)}
                    </div>
                  )}
                </div>

                {/* Metin */}
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#e2e2e8", fontSize: 13, fontWeight: 600, marginBottom: 3 }}>
                    {s.label}
                  </div>
                  <div style={{ color: "#52525e", fontSize: 12, lineHeight: 1.4 }}>
                    {s.desc}
                  </div>
                </div>

                {/* Ok */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 4,
                  color: s.color, fontSize: 12, fontWeight: 500,
                }}>
                  <span>Düzenle</span>
                  <span style={{ fontSize: 14 }}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ══ Site Ayarları ══ */}
      <div>
        <SectionLabel>Site Ayarları</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {SETTINGS_SECTIONS.map(s => (
            <Link key={s.href} href={s.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: "#16161f", border: "1px solid #1e1e2e",
                borderRadius: 12, padding: "18px 20px",
                display: "flex", alignItems: "center", gap: 14,
                transition: "border-color 0.2s, transform 0.15s",
                cursor: "pointer",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = s.color + "50";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#1e1e2e";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: s.bg, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  color: s.color, fontSize: 18, flexShrink: 0,
                }}>
                  {s.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#e2e2e8", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                    {s.label}
                  </div>
                  <div style={{ color: "#52525e", fontSize: 12 }}>{s.desc}</div>
                </div>
                <span style={{ color: "#52525e", fontSize: 16, flexShrink: 0 }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}