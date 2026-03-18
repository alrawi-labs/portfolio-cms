"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/Shared/LanguageSwitcher";
import { systemLanguageCodes } from "@/data/systemLanguages";
import { contactData } from "@/data/contacts";
import { SiteLogo } from "@/data/techIcons";
export default function Header() {
  const t = useTranslations("header");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const pathSegments = pathname.split("/").filter(Boolean);

    // Ana sayfada mı kontrol et
    // pathname: '/' veya '/en' veya '/tr' veya '/ar' gibi olabilir
    const isHomePage =
      pathSegments.length === 0 ||
      (pathSegments.length === 1 &&
        systemLanguageCodes.includes(pathSegments[0]));

    if (!isHomePage) {
      // Başka bir sayfadaysak (örn: /projects veya /ar/projects), ana sayfaya yönlendir
      router.push(`/#${sectionId}`);
      setIsMenuOpen(false);
      setOpenDropdown(null);
      return;
    }

    // Ana sayfadaysak, smooth scroll yap
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  const goToHome = () => {
    router.push("/");
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent ${
        isScrolled ? "backdrop-blur-sm py-5 bg-dark/60" : "py-8 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={goToHome}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <img
              src={SiteLogo}
              alt="Logo"
              width={60}
              height={60}
              className="fill-text"
            />
            <span className="hidden lg:flex items-center ps-3 text-text hover:text-text-hover transition-colors text-base font-medium tracking-wide">
              {contactData.email}
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8" ref={dropdownRef}>
            <button
              onClick={goToHome}
              className="text-text hover:text-text-hover transition-colors relative group text-base font-semibold tracking-wide"
            >
              {t("home")}
              <span className="absolute -bottom-1 start-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-700"></span>
            </button>

            <button
              onClick={() => scrollToSection("stats")}
              className="text-text hover:text-text-hover transition-colors relative group text-base font-semibold tracking-wide"
            >
              {t("stats")}
              <span className="absolute -bottom-1 start-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-700"></span>
            </button>

            <button
              onClick={() => scrollToSection("services")}
              className="text-text hover:text-text-hover transition-colors relative group text-base font-semibold tracking-wide"
            >
              {t("services")}
              <span className="absolute -bottom-1 start-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-700"></span>
            </button>

            {/* Work Dropdown */}
            <div className="relative group/dropdown">
              <button
                onClick={() => toggleDropdown("work")}
                className="text-text hover:text-text-hover transition-colors relative text-base font-semibold tracking-wide flex items-center gap-1"
              >
                {t("work")}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-500 ${openDropdown === "work" ? "rotate-180" : ""}`}
                />
                <span className="absolute -bottom-1 start-0 w-0 h-0.5 bg-gradient-primary group-hover/dropdown:w-full transition-all duration-700"></span>
              </button>

              <div
                className={`absolute top-full start-0 mt-4 w-56 origin-top transition-all duration-500 ${openDropdown === "work" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}
              >
                <div className="bg-dark/95 backdrop-blur-xl border border-border/30 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="h-1 bg-gradient-primary"></div>
                  <div className="p-2">
                    <button
                      onClick={() => router.push("/projects")}
                      className="w-full text-start px-5 py-3.5 text-text hover:text-text-hover transition-all duration-300 text-base rounded-xl hover:bg-primary/10 relative group/item"
                    >
                      <span className="relative z-10">{t("projects")}</span>
                      <span className="absolute start-0 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-gradient-primary group-hover/item:w-4 transition-all duration-500 ms-1"></span>
                    </button>
                    <button
                      onClick={() => scrollToSection("resume")}
                      className="w-full text-start px-5 py-3.5 text-text hover:text-text-hover transition-all duration-300 text-base rounded-xl hover:bg-primary/10 relative group/item"
                    >
                      <span className="relative z-10">{t("resume")}</span>
                      <span className="absolute start-0 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-gradient-primary group-hover/item:w-4 transition-all duration-500 ms-1"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* About Dropdown */}
            <div className="relative group/dropdown">
              <button
                onClick={() => toggleDropdown("about")}
                className="text-text hover:text-text-hover transition-colors relative text-base font-semibold tracking-wide flex items-center gap-1"
              >
                {t("about")}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-500 ${openDropdown === "about" ? "rotate-180" : ""}`}
                />
                <span className="absolute -bottom-1 start-0 w-0 h-0.5 bg-gradient-primary group-hover/dropdown:w-full transition-all duration-700"></span>
              </button>

              <div
                className={`absolute top-full start-0 mt-4 w-56 origin-top transition-all duration-500 ${openDropdown === "about" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}
              >
                <div className="bg-dark/95 backdrop-blur-xl border border-border/30 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="h-1 bg-gradient-primary"></div>
                  <div className="p-2">
                    <button
                      onClick={() => scrollToSection("skills")}
                      className="w-full text-start px-5 py-3.5 text-text hover:text-text-hover transition-all duration-300 text-base rounded-xl hover:bg-primary/10 relative group/item"
                    >
                      <span className="relative z-10">{t("skills")}</span>
                      <span className="absolute start-0 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-gradient-primary group-hover/item:w-4 transition-all duration-500 ms-1"></span>
                    </button>
                    <button
                      onClick={() => scrollToSection("languages")}
                      className="w-full text-start px-5 py-3.5 text-text hover:text-text-hover transition-all duration-300 text-base rounded-xl hover:bg-primary/10 relative group/item"
                    >
                      <span className="relative z-10">{t("languages")}</span>
                      <span className="absolute start-0 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-gradient-primary group-hover/item:w-4 transition-all duration-500 ms-1"></span>
                    </button>
                    <button
                      onClick={() => scrollToSection("volunteering")}
                      className="w-full text-start px-5 py-3.5 text-text hover:text-text-hover transition-all duration-300 text-base rounded-xl hover:bg-primary/10 relative group/item"
                    >
                      <span className="relative z-10">{t("volunteering")}</span>
                      <span className="absolute start-0 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-gradient-primary group-hover/item:w-4 transition-all duration-500 ms-1"></span>
                    </button>
                    <button
                      onClick={() => scrollToSection("certificates")}
                      className="w-full text-start px-5 py-3.5 text-text hover:text-text-hover transition-all duration-300 text-base rounded-xl hover:bg-primary/10 relative group/item"
                    >
                      <span className="relative z-10">{t("certificates")}</span>
                      <span className="absolute start-0 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-gradient-primary group-hover/item:w-4 transition-all duration-500 ms-1"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => scrollToSection("contact")}
              className="text-text hover:text-text-hover transition-colors relative group text-base font-semibold tracking-wide"
            >
              {t("contact")}
              <span className="absolute -bottom-1 start-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-700"></span>
            </button>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => scrollToSection("contact")}
              className="px-8 py-3 rounded-full bg-gradient-to-br from-primary-950 to-primary relative overflow-hidden group text-white font-bold text-base tracking-wide"
            >
              <span className="relative z-10">{t("startAProject")}</span>
              <span className="absolute inset-0 bg-gradient-to-br from-primary to-primary-950 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></span>
            </button>
          </div>

          {/* Mobile Right Side */}
          <div className="lg:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => scrollToSection("contact")}
              className="px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-br from-primary-950 to-primary text-white tracking-wide"
            >
              {t("startAProject")}
            </button>

            <button
              className="menu-bar-button relative w-12 h-12 flex items-center justify-end"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="flex flex-col gap-2 items-end">
                <span
                  className={`block h-0.5 bg-text transition-all duration-300 ${isMenuOpen ? "w-7 rotate-45 translate-y-2.5" : "w-6"}`}
                ></span>
                <span
                  className={`block h-0.5 bg-text transition-all duration-300 ${isMenuOpen ? "w-7 opacity-0" : "w-7"}`}
                ></span>
                <span
                  className={`block h-0.5 bg-text transition-all duration-300 ${isMenuOpen ? "w-7 -rotate-45 -translate-y-2.5" : "w-5"}`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full start-0 w-full backdrop-blur-sm border-t border-border bg-dark/95">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={goToHome}
                className="text-text hover:text-text-hover transition-colors py-2 text-base font-semibold tracking-wide text-start"
              >
                {t("home")}
              </button>
              <button
                onClick={() => scrollToSection("stats")}
                className="text-text hover:text-text-hover transition-colors py-2 text-base font-semibold tracking-wide text-start"
              >
                {t("stats")}
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-text hover:text-text-hover transition-colors py-2 text-base font-semibold tracking-wide text-start"
              >
                {t("services")}
              </button>

              <div className="relative ps-6 py-2">
                <div className="absolute start-0 top-0 bottom-0 w-0.5 bg-gradient-primary"></div>
                <p className="text-text/60 text-xs font-bold mb-3 tracking-widest">
                  {t("work").toUpperCase()}
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push("/projects")}
                    className="text-text hover:text-text-hover transition-colors py-1.5 text-base font-semibold tracking-wide text-start block w-full"
                  >
                    {t("projects")}
                  </button>
                  <button
                    onClick={() => scrollToSection("resume")}
                    className="text-text hover:text-text-hover transition-colors py-1.5 text-base font-semibold tracking-wide text-start block w-full"
                  >
                    {t("resume")}
                  </button>
                </div>
              </div>

              <div className="relative ps-6 py-2">
                <div className="absolute start-0 top-0 bottom-0 w-0.5 bg-gradient-primary"></div>
                <p className="text-text/60 text-xs font-bold mb-3 tracking-widest">
                  {t("about").toUpperCase()}
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => scrollToSection("skills")}
                    className="text-text hover:text-text-hover transition-colors py-1.5 text-base font-semibold tracking-wide text-start block w-full"
                  >
                    {t("skills")}
                  </button>
                  <button
                    onClick={() => scrollToSection("languages")}
                    className="text-text hover:text-text-hover transition-colors py-1.5 text-base font-semibold tracking-wide text-start block w-full"
                  >
                    {t("languages")}
                  </button>
                  <button
                    onClick={() => scrollToSection("volunteering")}
                    className="text-text hover:text-text-hover transition-colors py-1.5 text-base font-semibold tracking-wide text-start block w-full"
                  >
                    {t("volunteering")}
                  </button>
                  <button
                    onClick={() => scrollToSection("certificates")}
                    className="text-text hover:text-text-hover transition-colors py-1.5 text-base font-semibold tracking-wide text-start block w-full"
                  >
                    {t("certificates")}
                  </button>
                </div>
              </div>

              <button
                onClick={() => scrollToSection("contact")}
                className="text-text hover:text-text-hover transition-colors py-2 text-base font-semibold tracking-wide text-start"
              >
                {t("contact")}
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
