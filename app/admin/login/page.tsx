"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kullanıcı adı veya şifre hatalı.");
        return;
      }
      router.push(from);
      router.refresh();
    } catch {
      setError("Sunucuya bağlanılamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        html, body { background: #0a0a10 !important; margin: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.7; }
        }
        .login-input { transition: border-color 0.2s, box-shadow 0.2s; }
        .login-input:focus { border-color: #8750f7 !important; box-shadow: 0 0 0 3px #8750f718 !important; }
        .login-btn:hover:not(:disabled) { background: #9960ff !important; transform: translateY(-1px); box-shadow: 0 8px 24px #8750f750 !important; }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn { transition: all 0.2s !important; }
      `}</style>

      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          background: "#0a0a10",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Sol panel (sadece geniş ekranda) ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 80px",
            position: "relative",
          }}
          className="login-left"
        >
          {/* Arka plan dokusu */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "linear-gradient(135deg, #8750f708 0%, transparent 60%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "10%",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #8750f712 0%, transparent 70%)",
              animation: "glow 6s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "15%",
              right: "5%",
              width: 280,
              height: 280,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #6340b510 0%, transparent 70%)",
              animation: "glow 8s ease-in-out infinite 2s",
            }}
          />

          {/* Sol içerik */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 420,
              animation: "fadeUp 0.6s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 48,
              }}
            >
              <img
                src="/assets/images/adminLogo.png"
                alt=""
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  flexShrink: 0,
                }}
              />

              <span
                style={{
                  color: "#e2e2e8",
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                Admin CMS
              </span>
            </div>

            <h2
              style={{
                color: "#e2e2e8",
                fontSize: 38,
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                margin: "0 0 20px",
              }}
            >
              Portfolio'nuzü
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #8750f7, #c084fc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                yönetin.
              </span>
            </h2>
            <p
              style={{
                color: "#52525e",
                fontSize: 15,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              İçerik yönetimi, çok dil desteği ve gerçek zamanlı düzenleme tek
              bir panelde.
            </p>

            {/* Feature badges */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginTop: 40,
              }}
            >
              {[
                { icon: "◈", text: "Çok dilli içerik yönetimi" },
                { icon: "⊞", text: "Proje ve portföy düzenleme" },
                { icon: "✦", text: "Anlık değişiklikler" },
              ].map((f) => (
                <div
                  key={f.text}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "#8750f712",
                      border: "1px solid #8750f720",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#8750f7",
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    {f.icon}
                  </div>
                  <span style={{ color: "#6b6b7a", fontSize: 14 }}>
                    {f.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Dikey ayırıcı ── */}
        <div
          style={{
            width: 1,
            background:
              "linear-gradient(180deg, transparent, #1e1e2e 20%, #1e1e2e 80%, transparent)",
            flexShrink: 0,
          }}
          className="login-divider"
        />

        {/* ── Sağ panel: Form ── */}
        <div
          style={{
            width: 480,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 56px",
            background: "#0d0d13",
            animation: "fadeUp 0.6s ease-out 0.1s both",
          }}
          className="login-right"
        >
          {/* Form başlığı */}
          <div style={{ marginBottom: 40 }}>
            <h1
              style={{
                color: "#e2e2e8",
                fontSize: 26,
                fontWeight: 700,
                margin: "0 0 8px",
                letterSpacing: "-0.02em",
              }}
            >
              Oturum Aç
            </h1>
            <p style={{ color: "#52525e", fontSize: 14, margin: 0 }}>
              Yönetim paneline erişmek için giriş yapın.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  color: "#9898b8",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase" as const,
                  marginBottom: 8,
                }}
              >
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocused("u")}
                onBlur={() => setFocused(null)}
                required
                autoFocus
                placeholder="Kullanıcı adınızı girin"
                className="login-input"
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  background: "#12121c",
                  border: `1px solid ${focused === "u" ? "#8750f7" : "#1e1e2e"}`,
                  borderRadius: 10,
                  color: "#e2e2e8",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box" as const,
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  color: "#9898b8",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase" as const,
                  marginBottom: 8,
                }}
              >
                Şifre
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("p")}
                  onBlur={() => setFocused(null)}
                  required
                  placeholder="••••••••"
                  className="login-input"
                  style={{
                    width: "100%",
                    padding: "13px 44px 13px 16px",
                    background: "#12121c",
                    border: `1px solid ${focused === "p" ? "#8750f7" : "#1e1e2e"}`,
                    borderRadius: 10,
                    color: "#e2e2e8",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box" as const,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "#52525e",
                    cursor: "pointer",
                    fontSize: 14,
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  {showPass ? "○" : "●"}
                </button>
              </div>
            </div>

            {error && (
              <div
                style={{
                  background: "#1a0808",
                  border: "1px solid #3f1010",
                  borderRadius: 10,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    color: "#f87171",
                    fontSize: 15,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  ⚠
                </span>
                <span
                  style={{ color: "#fca5a5", fontSize: 13, lineHeight: 1.5 }}
                >
                  {error}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="login-btn"
              style={{
                marginTop: 4,
                padding: "14px",
                background:
                  loading || !username || !password ? "#2a1a4a" : "#8750f7",
                color: loading || !username || !password ? "#6340b5" : "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor:
                  loading || !username || !password ? "not-allowed" : "pointer",
                boxShadow:
                  loading || !username || !password
                    ? "none"
                    : "0 4px 20px #8750f740",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid #ffffff30",
                      borderTop: "2px solid #fff",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  Doğrulanıyor…
                </>
              ) : (
                <>
                  Giriş Yap
                  <span style={{ fontSize: 16 }}>→</span>
                </>
              )}
            </button>
          </form>

          {/* Alt bilgi */}
          <div
            style={{
              marginTop: 36,
              paddingTop: 24,
              borderTop: "1px solid #1a1a28",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#1e1e2e",
              }}
            />
            <span style={{ color: "#3a3a50", fontSize: 12 }}>
              Yalnızca yetkili personel erişebilir.
            </span>
          </div>
        </div>
      </div>

      {/* Responsive — mobilde sol paneli gizle */}
      <style>{`
        @media (max-width: 860px) {
          .login-left   { display: none !important; }
          .login-divider { display: none !important; }
          .login-right  {
            width: 100% !important;
            padding: 40px 24px !important;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
