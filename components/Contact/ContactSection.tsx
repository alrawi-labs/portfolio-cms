"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Instagram,
  Github,
  Linkedin,
  Twitter,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { contactData } from "@/data/contacts";

const iconMap: Record<string, any> = {
  Instagram,
  Linkedin,
  Twitter,
  Github,
};

interface ContactInfo {
  icon: any;
  title: string;
  value: string;
  link: string;
}
interface SocialLink {
  icon: any;
  name: string;
  url: string;
}

/* ── Matematik CAPTCHA üretici ── */
function generateCaptcha(): { question: string; answer: number } {
  const ops = ["+", "-", "*"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;

  if (op === "+") {
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * 10) + 1;
    answer = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * 10) + 5;
    b = Math.floor(Math.random() * 5) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 5) + 2;
    b = Math.floor(Math.random() * 5) + 2;
    answer = a * b;
  }

  const opLabel = op === "*" ? "×" : op;
  return { question: `${a} ${opLabel} ${b} = ?`, answer };
}

export default function Contact() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  /* Güvenlik state'leri */
  const [honeypot, setHoneypot] = useState(""); // gizli alan
  const [formLoadedAt, setFormLoadedAt] = useState<number>(0); // yüklenme zamanı
  const [captcha, setCaptcha] = useState(() => generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const particlesRef = useRef<
    Array<{
      top: number;
      left: number;
      opacity: number;
      duration: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    setIsMounted(true);
    setFormLoadedAt(Date.now()); // form yüklenme zamanını kaydet

    if (particlesRef.current.length === 0) {
      particlesRef.current = [...Array(20)].map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.5,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 5,
      }));
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
    setCaptchaError(false);
  }, []);

  const handleSubmit = async () => {
    /* Client-side CAPTCHA kontrolü */
    if (Number(captchaInput) !== captcha.answer) {
      setCaptchaError(true);
      refreshCaptcha();
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      alert("Ad, e-posta ve mesaj alanları zorunludur.");
      return;
    }

    setIsSubmitting(true);
    setCaptchaError(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          website: honeypot, // honeypot
          formLoadedAt: formLoadedAt, // time check
          captchaAnswer: captchaInput, // matematik captcha cevabı
          captchaExpected: captcha.answer, // beklenen cevap
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Mesaj gönderilemedi.");

      setIsSubmitted(true);
      setTimeout(() => {
        setFormData({ name: "", email: "", subject: "", message: "" });
        setCaptchaInput("");
        setIsSubmitted(false);
        refreshCaptcha();
        setFormLoadedAt(Date.now());
      }, 3000);
    } catch (e: unknown) {
      alert((e as Error).message || "Bir hata oluştu. Lütfen tekrar deneyin.");
      refreshCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo: ContactInfo[] = [
    {
      icon: Mail,
      title: t("info.email.title"),
      value: contactData.email,
      link: `mailto:${contactData.email}`,
    },
    ...(contactData.phone
      ? [
          {
            icon: Phone,
            title: t("info.phone.title"),
            value: contactData.phone,
            link: `tel:${contactData.phone.replace(/\s/g, "")}`,
          },
        ]
      : []),
    ...(contactData.location
      ? [
          {
            icon: MapPin,
            title: t("info.location.title"),
            value: contactData.location,
            link: "#",
          },
        ]
      : []),
  ];

  const socialLinks: SocialLink[] = contactData.socialLinks.map((s) => ({
    icon: iconMap[s.icon],
    name: s.name,
    url: s.href,
  }));

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="min-h-screen flex items-center relative overflow-hidden px-4 sm:px-6 py-16 sm:py-20 md:py-24"
      style={{ backgroundColor: "#0e0714", scrollMarginTop: "20px" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-64 h-64 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(135, 80, 247, 0.2) 0%, transparent 70%)",
            top: "10%",
            left: "5%",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-48 h-48 sm:w-72 sm:h-72 md:w-[400px] md:h-[400px] rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(115, 67, 210, 0.15) 0%, transparent 70%)",
            bottom: "15%",
            right: "10%",
            animation: "float 10s ease-in-out infinite 2s",
          }}
        />
        <div
          className="absolute w-40 h-40 sm:w-60 sm:h-60 md:w-[300px] md:h-[300px] rounded-full blur-[60px] md:blur-[80px]"
          style={{
            background:
              "radial-gradient(circle, rgba(165, 116, 255, 0.1) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "float 12s ease-in-out infinite 4s",
          }}
        />
        {isMounted &&
          particlesRef.current.map((p, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: "#8750f7",
                top: `${p.top}%`,
                left: `${p.left}%`,
                opacity: p.opacity,
                animation: `twinkle ${p.duration}s ease-in-out infinite ${p.delay}s`,
              }}
            />
          ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(30px, -30px) scale(1.05);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.95);
          }
          75% {
            transform: translate(20px, 30px) scale(1.02);
          }
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.5);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(135, 80, 247, 0.3);
          }
          50% {
            box-shadow:
              0 0 40px rgba(135, 80, 247, 0.6),
              0 0 60px rgba(135, 80, 247, 0.3);
          }
        }
      `}</style>

      <div className="container mx-auto relative z-10 max-w-6xl">
        {/* Header */}
        <div
          className={`mb-12 sm:mb-16 md:mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ animation: isVisible ? "fadeInUp 1s ease-out" : "none" }}
        >
          <div
            className={`text-center mb-8 sm:mb-10 md:mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-wide bg-gradient-hero bg-clip-text text-transparent mb-3 sm:mb-4 px-4">
              {t("title")}
            </h2>
            <p className="text-text/90 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed px-4">
              {t("subtitle")}
            </p>
            <div
              className="inline-flex items-center gap-2 mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium relative overflow-hidden"
              style={{
                backgroundColor: "rgba(135, 80, 247, 0.1)",
                color: "#8750f7",
                border: "1px solid rgba(135, 80, 247, 0.2)",
              }}
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{t("badge")}</span>
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(135, 80, 247, 0.5), transparent)",
                  animation: "shimmer 3s infinite",
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 sm:gap-8">
          {/* ── Contact Form ── */}
          <div
            className={`lg:col-span-3 order-1 lg:order-2 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
            style={{
              animation: isVisible
                ? "slideInRight 1s ease-out 0.4s backwards"
                : "none",
            }}
          >
            <div
              className="p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl relative overflow-hidden"
              style={{
                backgroundColor: "rgba(20, 12, 28, 0.4)",
                border: "1px solid rgba(135, 80, 247, 0.2)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div
                className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(135, 80, 247, 0.3) 0%, transparent 50%, rgba(135, 80, 247, 0.3) 100%)",
                  animation: "pulse-glow 3s ease-in-out infinite",
                }}
              />

              {!isSubmitted ? (
                <div className="space-y-4 sm:space-y-6 relative z-10">
                  {/* 🍯 Honeypot — kullanıcıya görünmez */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{ display: "none" }}
                  />

                  {/* Ad + E-posta */}
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div
                      style={{
                        animation: "fadeInUp 0.5s ease-out 0.5s backwards",
                      }}
                    >
                      <label
                        className="block text-xs sm:text-sm mb-1.5 sm:mb-2 font-medium"
                        style={{ color: "rgba(221, 221, 221, 0.7)" }}
                      >
                        {t("form.name.label")}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl transition-all duration-300 focus:outline-none focus:scale-[1.02] text-sm sm:text-base"
                        style={{
                          backgroundColor: "rgba(14, 7, 20, 0.8)",
                          border: "1px solid rgba(135, 80, 247, 0.3)",
                          color: "rgb(221, 221, 221)",
                        }}
                        placeholder={t("form.name.placeholder")}
                      />
                    </div>
                    <div
                      style={{
                        animation: "fadeInUp 0.5s ease-out 0.6s backwards",
                      }}
                    >
                      <label
                        className="block text-xs sm:text-sm mb-1.5 sm:mb-2 font-medium"
                        style={{ color: "rgba(221, 221, 221, 0.7)" }}
                      >
                        {t("form.email.label")}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl transition-all duration-300 focus:outline-none focus:scale-[1.02] text-sm sm:text-base"
                        style={{
                          backgroundColor: "rgba(14, 7, 20, 0.8)",
                          border: "1px solid rgba(135, 80, 247, 0.3)",
                          color: "rgb(221, 221, 221)",
                        }}
                        placeholder={t("form.email.placeholder")}
                      />
                    </div>
                  </div>

                  {/* Konu */}
                  <div
                    style={{
                      animation: "fadeInUp 0.5s ease-out 0.7s backwards",
                    }}
                  >
                    <label
                      className="block text-xs sm:text-sm mb-1.5 sm:mb-2 font-medium"
                      style={{ color: "rgba(221, 221, 221, 0.7)" }}
                    >
                      {t("form.subject.label")}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl transition-all duration-300 focus:outline-none focus:scale-[1.02] text-sm sm:text-base"
                      style={{
                        backgroundColor: "rgba(14, 7, 20, 0.8)",
                        border: "1px solid rgba(135, 80, 247, 0.3)",
                        color: "rgb(221, 221, 221)",
                      }}
                      placeholder={t("form.subject.placeholder")}
                    />
                  </div>

                  {/* Mesaj */}
                  <div
                    style={{
                      animation: "fadeInUp 0.5s ease-out 0.8s backwards",
                    }}
                  >
                    <label
                      className="block text-xs sm:text-sm mb-1.5 sm:mb-2 font-medium"
                      style={{ color: "rgba(221, 221, 221, 0.7)" }}
                    >
                      {t("form.message.label")}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl transition-all duration-300 focus:outline-none resize-none focus:scale-[1.02] text-sm sm:text-base"
                      style={{
                        backgroundColor: "rgba(14, 7, 20, 0.8)",
                        border: "1px solid rgba(135, 80, 247, 0.3)",
                        color: "rgb(221, 221, 221)",
                      }}
                      placeholder={t("form.message.placeholder")}
                    />
                  </div>

                  {/* 🧮 Matematik CAPTCHA */}
                  <div
                    style={{
                      animation: "fadeInUp 0.5s ease-out 0.85s backwards",
                    }}
                  >
              
                    <div className="flex items-center gap-3">
                      {/* Soru kutusu */}
                      <div
                        className="flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-mono font-semibold flex-shrink-0"
                        style={{
                          backgroundColor: "rgba(135, 80, 247, 0.12)",
                          border: "1px solid rgba(135, 80, 247, 0.3)",
                          color: "#a78bfa",
                          minWidth: 90,
                        }}
                      >
                        {captcha.question}
                      </div>
                      {/* Cevap input */}
                      <input
                        type="number"
                        value={captchaInput}
                        onChange={(e) => {
                          setCaptchaInput(e.target.value);
                          setCaptchaError(false);
                        }}
                        className="flex-1 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:scale-[1.02] transition-all duration-300"
                        style={{
                          backgroundColor: "rgba(14, 7, 20, 0.8)",
                          border: `1px solid ${captchaError ? "rgba(248,113,113,0.6)" : "rgba(135, 80, 247, 0.3)"}`,
                          color: "rgb(221, 221, 221)",
                        }}
                        placeholder="000"
                      />
                      {/* Yenile butonu */}
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 hover:scale-110 flex-shrink-0"
                        style={{
                          backgroundColor: "rgba(135, 80, 247, 0.1)",
                          border: "1px solid rgba(135, 80, 247, 0.2)",
                          color: "#a78bfa",
                        }}
                        title="Yeni soru"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                    {captchaError && (
                      <p
                        className="mt-1.5 text-xs"
                        style={{ color: "rgba(248,113,113,0.9)" }}
                      >
                        Yanlış cevap, yeni bir soru oluşturuldu.
                      </p>
                    )}
                  </div>

                  {/* Gönder butonu */}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="group w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden text-sm sm:text-base"
                    style={{
                      background:
                        "linear-gradient(135deg, #8750f7 0%, #6b2fb5 100%)",
                      color: "#ffffff",
                      boxShadow: "0 8px 24px rgba(135, 80, 247, 0.3)",
                      animation: "fadeInUp 0.5s ease-out 0.9s backwards",
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                        animation: "shimmer 2s infinite",
                      }}
                    />
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full animate-spin border-2 border-white/30 border-t-white relative z-10" />
                        <span className="relative z-10">
                          {t("form.sending")}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">
                          {t("form.submit")}
                        </span>
                        <Send
                          className={`w-4 h-4 sm:w-5 sm:h-5 group-hover:transition-transform duration-300 relative z-10 ${isRTL ? "group-hover:-translate-x-2 rotate-180" : "group-hover:translate-x-2"}`}
                        />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center py-12 sm:py-16 text-center"
                  style={{ animation: "fadeInUp 0.6s ease-out" }}
                >
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 sm:mb-6 relative"
                    style={{
                      background:
                        "linear-gradient(135deg, #8750f7 0%, #6b2fb5 100%)",
                      animation: "pulse-glow 2s ease-in-out infinite",
                    }}
                  >
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-bounce" />
                  </div>
                  <h3
                    className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3"
                    style={{ color: "rgb(221, 221, 221)" }}
                  >
                    {t("success.title")}
                  </h3>
                  <p
                    className="text-sm sm:text-base px-4"
                    style={{ color: "rgba(221, 221, 221, 0.6)" }}
                  >
                    {t("success.message")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Contact Info Sidebar ── */}
          <div
            className={`lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1 transition-all duration-1000 delay-100 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
            style={{
              animation: isVisible
                ? "slideInLeft 1s ease-out 0.2s backwards"
                : "none",
            }}
          >
            <div className="space-y-3 sm:space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <a
                    key={index}
                    href={info.link}
                    className={`group block p-4 sm:p-5 rounded-xl sm:rounded-2xl transition-all duration-500 relative overflow-hidden ${isRTL ? "hover:-translate-x-2" : "hover:translate-x-2"}`}
                    style={{
                      backgroundColor: "rgba(20, 12, 28, 0.6)",
                      border: "1px solid rgba(135, 80, 247, 0.15)",
                      backdropFilter: "blur(10px)",
                      animation: `fadeInUp 0.6s ease-out ${0.3 + index * 0.1}s backwards`,
                    }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, rgba(135, 80, 247, 0.1), transparent)",
                          animation: "shimmer 2s infinite",
                        }}
                      />
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4 relative z-10">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
                        style={{ backgroundColor: "rgba(135, 80, 247, 0.15)" }}
                      >
                        <Icon
                          className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 group-hover:scale-110"
                          style={{ color: "#8750f7" }}
                        />
                      </div>
                      <div className="flex-1">
                        <div
                          className="text-[10px] sm:text-xs uppercase tracking-wider mb-1"
                          style={{ color: "rgba(221, 221, 221, 0.4)" }}
                        >
                          {info.title}
                        </div>
                        <div
                          className={`text-sm sm:text-base font-medium transition-all duration-300 break-all ${isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
                          style={{ color: "rgb(221, 221, 221)" }}
                          dir="ltr"
                        >
                          {info.value}
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Sosyal linkler */}
            <div
              className="pt-4 sm:pt-6"
              style={{
                animation: isVisible
                  ? "fadeInUp 0.6s ease-out 0.6s backwards"
                  : "none",
              }}
            >
              <div
                className="text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4"
                style={{ color: "rgba(221, 221, 221, 0.4)" }}
              >
                {t("social.title")}
              </div>
              <div className="flex gap-2 sm:gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-500 hover:scale-125 hover:rotate-12 relative overflow-hidden"
                      style={{
                        backgroundColor: "rgba(20, 12, 28, 0.6)",
                        border: "1px solid rgba(135, 80, 247, 0.15)",
                        animation: `fadeInUp 0.4s ease-out ${0.7 + index * 0.1}s backwards`,
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(135, 80, 247, 0.2) 0%, transparent 70%)",
                        }}
                      />
                      <Icon
                        className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 relative z-10 group-hover:scale-110"
                        style={{ color: "rgba(221, 221, 221, 0.5)" }}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
