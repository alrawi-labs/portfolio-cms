"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { LocaleProvider, useLocaleContext } from "./LocaleContext";

const NAV_GROUPS = [
  {
    label: "Genel",
    items: [
      { href: "/admin",                label: "Dashboard",    icon: "▦", desc: "Genel bakış"      },
    ],
  },
  {
    label: "İçerik",
    items: [
      { href: "/admin/main-texts",     label: "Ana Sayfa",    icon: "⌂", desc: "Hero, menü, stats"  },
      { href: "/admin/vision",         label: "Vision",       icon: "◎", desc: "Vurgulu cümleler"   },
      { href: "/admin/projects",       label: "Projeler",     icon: "⊞", desc: "Proje kartları"     },
      { href: "/admin/projects-index", label: "Proje Sayfası",icon: "⊟", desc: "Sayfa metinleri"   },
      { href: "/admin/services",       label: "Servisler",    icon: "⊙", desc: "Hizmet kartları"    },
            { href: "/admin/blog", label: "Bloglar", icon: "◈", desc: "Tüm Bloglar" },

      { href: "/admin/skills",         label: "Beceriler",    icon: "◈", desc: "Teknolojiler"       },
      { href: "/admin/resume",         label: "CV",           icon: "◇", desc: "Deneyim & eğitim"  },
      { href: "/admin/certificates",   label: "Sertifikalar", icon: "◉", desc: "Belgeler"           },
      { href: "/admin/volunteering",   label: "Gönüllülük",   icon: "○", desc: "Etkinlikler"        },
      { href: "/admin/languages",      label: "Diller",       icon: "◐", desc: "Dil seviyeleri"     },
    ],
  },
  {
    label: "Ayarlar",
    items: [
      { href: "/admin/personal", label: "Kişisel",      icon: "◑", desc: "Profil & istatistik" },
      { href: "/admin/contact",  label: "İletişim",     icon: "◒", desc: "E-posta & sosyal"    },
      { href: "/admin/logo",     label: "Logo",         icon: "◓", desc: "Site logosu"         },
      { href: "/admin/locales",  label: "Dil Yönetimi", icon: "⊕", desc: "Dil ekle / sil"      },
      { href: "/admin/favicon",  label: "Favicon",      icon: "◔", desc: "Site ikonları"       },
    ],
  },
];

const C = {
  bg:         "#111118",
  sidebar:    "#0d0d13",
  sidebarBdr: "#1e1e2e",
  surface:    "#16161f",
  surfaceHov: "#1c1c28",
  activeNav:  "#1a1827",
  accent:     "#8750f7",
  accentSoft: "#a78bfa",
  text:       "#e2e2e8",
  textSub:    "#9898a8",
  textDim:    "#52525e",
  textNav:    "#b0b0c0",
  border:     "#1e1e2e",
  borderMid:  "#2a2a3a",
  red:        "#f87171",
};

const SIDEBAR_W   = 236;
const COLLAPSED_W = 62;

function SidebarLocaleSelector() {
  const { locale, setLocale, locales, localesLoading } = useLocaleContext();
  if (localesLoading) return null;
  return (
    <div style={{ margin: "6px 10px 4px", background: C.surface, border: `1px solid ${C.borderMid}`, borderRadius: 10, padding: "10px 12px" }}>
      <div style={{ color: C.textDim, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 9 }}>
        Düzenleme Dili
      </div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" as const }}>
        {locales.map(l => (
          <button key={l.code} onClick={() => setLocale(l.code)} title={l.name} style={{
            padding: "5px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600,
            cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.15s",
            border: locale === l.code ? `1px solid ${C.accent}70` : `1px solid ${C.borderMid}`,
            background: locale === l.code ? C.accent : "transparent",
            color: locale === l.code ? "#fff" : C.textSub,
          }}>{l.code.toUpperCase()}</button>
        ))}
      </div>
      <div style={{ marginTop: 8, color: C.textDim, fontSize: 11 }}>
        ↳ {locales.find(l => l.code === locale)?.name}
      </div>
    </div>
  );
}

function SidebarContent({
  collapsed, pathname, onClose, onToggleCollapse, loggingOut, onLogout,
}: {
  collapsed: boolean; pathname: string;
  onClose?: () => void;
  onToggleCollapse: () => void;
  loggingOut: boolean;
  onLogout: () => void;
}) {
  return (
    <>
      {/* Logo */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        padding: collapsed ? "16px 0" : "16px 14px",
        borderBottom: `1px solid ${C.sidebarBdr}`,
        minHeight: 60, flexShrink: 0,
      }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/assets/images/adminLogo.png" alt="" style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0 }} />
            <div>
              <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>Admin CMS</div>
              <div style={{ color: C.textDim, fontSize: 10, marginTop: 1 }}>Portfolio Yönetimi</div>
            </div>
          </div>
        )}
        {collapsed && (
          <img src="/assets/images/adminLogo.png" alt="" style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0 }} />
        )}
        {!collapsed && (
          <button onClick={onClose || onToggleCollapse} style={{
            background: "transparent", border: "none", color: C.textDim,
            cursor: "pointer", fontSize: 18, padding: "2px 6px", borderRadius: 6, lineHeight: 1,
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.textSub}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = C.textDim}
          >‹</button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: collapsed ? "8px 0" : "8px 8px", scrollbarWidth: "none" as const }}>
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label} style={{ marginBottom: collapsed ? 2 : 4 }}>
            {!collapsed && (
              <div style={{ color: C.textDim, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: gi === 0 ? "4px 12px 4px" : "12px 12px 4px" }}>
                {group.label}
              </div>
            )}
            {collapsed && gi > 0 && <div style={{ height: 1, background: C.sidebarBdr, margin: "6px 10px" }} />}
            {group.items.map(item => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} title={collapsed ? item.label : ""}
                  onClick={onClose}
                  style={{
                    display: "flex", alignItems: "center", gap: 9,
                    padding: collapsed ? "9px 0" : "8px 11px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    marginBottom: 1, textDecoration: "none",
                    background: active && !collapsed ? C.activeNav : "transparent",
                    color: active ? C.accentSoft : C.textNav,
                    borderRadius: collapsed ? 0 : active ? "0 8px 8px 0" : 8,
                    transition: "all 0.12s",
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; if (!active) { el.style.background = C.surfaceHov; el.style.color = C.text; } }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; if (!active) { el.style.background = "transparent"; el.style.color = C.textNav; } }}
                >
                  <span style={{ fontSize: 14, flexShrink: 0, color: active ? C.accent : "inherit", opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                  {!collapsed && (
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: active ? 500 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{item.label}</div>
                      {active && <div style={{ color: C.textDim, fontSize: 10, marginTop: 1 }}>{item.desc}</div>}
                    </div>
                  )}
                  {!collapsed && active && <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.accent, flexShrink: 0 }} />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {!collapsed && <SidebarLocaleSelector />}

      {collapsed && (
        <button onClick={onToggleCollapse} style={{
          background: "transparent", border: "none", color: C.textDim, cursor: "pointer",
          fontSize: 16, padding: "10px 0", textAlign: "center" as const,
          borderTop: `1px solid ${C.sidebarBdr}`, transition: "color 0.15s",
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.textSub}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = C.textDim}
        >›</button>
      )}

      {/* Logout */}
      <div style={{ padding: collapsed ? "10px 0" : "8px 8px 12px", borderTop: collapsed ? "none" : `1px solid ${C.sidebarBdr}`, flexShrink: 0 }}>
        <button onClick={onLogout} disabled={loggingOut} style={{
          width: "100%", padding: collapsed ? "10px 0" : "9px 11px",
          background: "transparent", border: collapsed ? "none" : `1px solid ${C.borderMid}`,
          borderRadius: collapsed ? 0 : 8, color: C.textSub, fontSize: 13,
          cursor: loggingOut ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start",
          gap: 9, transition: "all 0.15s",
        }}
          onMouseEnter={e => { if (!loggingOut) { const el = e.currentTarget as HTMLElement; el.style.color = C.red; el.style.borderColor = `${C.red}40`; el.style.background = `${C.red}08`; } }}
          onMouseLeave={e => { if (!loggingOut) { const el = e.currentTarget as HTMLElement; el.style.color = C.textSub; el.style.borderColor = C.borderMid; el.style.background = "transparent"; } }}
        >
          <span style={{ fontSize: 15 }}>⊗</span>
          {!collapsed && (loggingOut ? "Çıkılıyor…" : "Çıkış Yap")}
        </button>
      </div>
    </>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [isMobile, setIsMobile]     = useState(false);
  const [mounted, setMounted]       = useState(false);

  /* Hydration tamamlanana kadar isMobile false kalır */
  useEffect(() => {
    setMounted(true);
    function check() { setIsMobile(window.innerWidth < 768); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (pathname === "/admin/login") return <>{children}</>;

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const allItems   = NAV_GROUPS.flatMap(g => g.items);
  const activeItem = allItems.find(item =>
    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
  );

  /* mounted olana kadar desktop gibi davran → hydration mismatch yok */
  const effectiveMobile = mounted && isMobile;
  const sidebarW = collapsed ? COLLAPSED_W : SIDEBAR_W;

  return (
    <div style={{ display: "flex", minHeight: "100dvh", background: C.bg, flex: 1 }}>

      {/* ══ DESKTOP Sidebar ══ */}
      {!effectiveMobile && (
        <aside style={{
          width: sidebarW,
          background: C.sidebar,
          borderRight: `1px solid ${C.sidebarBdr}`,
          display: "flex", flexDirection: "column",
          position: "fixed", top: 0, left: 0,
          height: "100vh", zIndex: 100,
          transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
        }}>
          <SidebarContent
            collapsed={collapsed}
            pathname={pathname}
            onToggleCollapse={() => setCollapsed(c => !c)}
            loggingOut={loggingOut}
            onLogout={handleLogout}
          />
        </aside>
      )}

      {/* ══ MOBİL Overlay ══ */}
      {effectiveMobile && mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{
          position: "fixed", inset: 0, zIndex: 199,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        }} />
      )}

      {/* ══ MOBİL Sidebar Drawer ══ */}
      {effectiveMobile && (
        <aside style={{
          width: SIDEBAR_W,
          background: C.sidebar,
          borderRight: `1px solid ${C.sidebarBdr}`,
          display: "flex", flexDirection: "column",
          position: "fixed", top: 0, left: 0,
          height: "100vh", zIndex: 200,
          transform: mobileOpen ? "translateX(0)" : `translateX(-${SIDEBAR_W}px)`,
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
        }}>
          <SidebarContent
            collapsed={false}
            pathname={pathname}
            onClose={() => setMobileOpen(false)}
            onToggleCollapse={() => setMobileOpen(false)}
            loggingOut={loggingOut}
            onLogout={handleLogout}
          />
        </aside>
      )}

      {/* ══ İçerik ══ */}
      <div style={{
        flex: 1,
        marginLeft: effectiveMobile ? 0 : sidebarW,
        transition: "margin-left 0.22s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column", minHeight: "100vh",
      }}>

        {/* Topbar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 50,
          background: scrolled ? `${C.bg}f5` : C.bg,
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: `1px solid ${scrolled ? C.sidebarBdr : "transparent"}`,
          transition: "all 0.2s",
          height: 52,
          display: "flex", alignItems: "center",
          padding: effectiveMobile ? "0 16px" : "0 36px",
          gap: 12,
        }}>
          {effectiveMobile && (
            <button onClick={() => setMobileOpen(o => !o)} style={{
              background: "transparent", border: "none",
              color: C.textSub, cursor: "pointer",
              width: 36, height: 36, borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0, transition: "background 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.surfaceHov}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          )}

          {effectiveMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src="/assets/images/adminLogo.png" alt="" style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0 }} />
              <span style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>Admin CMS</span>
            </div>
          )}

          {!effectiveMobile && activeItem && (
            <>
              <span style={{ color: C.accent, fontSize: 14 }}>{activeItem.icon}</span>
              <span style={{ color: C.text, fontSize: 13, fontWeight: 500 }}>{activeItem.label}</span>
              <span style={{ color: C.textDim }}>·</span>
              <span style={{ color: C.textDim, fontSize: 12 }}>{activeItem.desc}</span>
            </>
          )}

          {effectiveMobile && activeItem && (
            <span style={{ color: C.textSub, fontSize: 13, marginLeft: "auto" }}>
              {activeItem.label}
            </span>
          )}
        </div>

        {/* Ana içerik */}
        <main
          id="admin-main"
          onScroll={e => setScrolled((e.currentTarget as HTMLElement).scrollTop > 8)}
          style={{
            flex: 1,
            padding: effectiveMobile ? "16px 16px 60px" : "24px 36px 60px",
            color: C.text, overflowY: "auto", overflowX: "hidden",
          }}
        >
          {children}
        </main>
      </div>

      <style>{`
        html, body { background: #111118 !important; min-height: 100%; }
        #admin-main::-webkit-scrollbar { width: 5px; }
        #admin-main::-webkit-scrollbar-track { background: transparent; }
        #admin-main::-webkit-scrollbar-thumb { background: ${C.borderMid}; border-radius: 10px; }
        #admin-main::-webkit-scrollbar-thumb:hover { background: ${C.accent}; }
        nav::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <Shell>{children}</Shell>
    </LocaleProvider>
  );
}