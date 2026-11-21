import React from "react";
import { Link } from "react-router-dom";
import { Instagram, MapPin, Mail, Phone } from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";
import GhaymaLogo from "./GhaymaLogo.jsx";

export default function Footer() {
  const { lang, t, dark, footerContent } = useAppContext();

  const subtitle =
    lang === "ar"
      ? footerContent.brandSubAr
      : lang === "fr"
      ? footerContent.brandSubFr
      : footerContent.brandSubEn;

  const description =
    lang === "ar"
      ? footerContent.descriptionAr
      : lang === "fr"
      ? footerContent.descriptionFr
      : footerContent.descriptionEn;

  const addressText =
    lang === "ar"
      ? footerContent.addressAr
      : lang === "fr"
      ? footerContent.addressFr
      : footerContent.addressEn;

  const madeWithLove =
    lang === "ar"
      ? footerContent.madeWithLoveAr
      : lang === "fr"
      ? footerContent.madeWithLoveFr
      : footerContent.madeWithLoveEn;

  const copyright =
    lang === "ar"
      ? footerContent.copyrightAr
      : lang === "fr"
      ? footerContent.copyrightFr
      : footerContent.copyrightEn;

  return (
    <footer
      className={`border-t mt-16 sm:mt-24 ${
        dark
          ? "bg-[#0e0911] border-rose-950/60 text-rose-200/80"
          : "bg-rose-50/60 border-rose-200/60 text-slate-600"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-start">
          {/* Column 1: Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <GhaymaLogo dark={dark} subtitle={subtitle} />
            <p className="text-xs sm:text-sm max-w-xs leading-relaxed opacity-85">
              {description}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs opacity-75 pt-1">
              {addressText && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {addressText}
                </span>
              )}
              {footerContent.email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-rose-500" />
                  {footerContent.email}
                </span>
              )}
            </div>
          </div>

          {/* Column 2: Quick Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold">
            <Link to="/" className="hover:text-rose-500 transition-colors">
              {t.nav.home}
            </Link>
            <Link to="/books" className="hover:text-rose-500 transition-colors">
              {t.nav.books}
            </Link>
            <Link to="/challenges" className="hover:text-rose-500 transition-colors">
              {t.nav.challenges}
            </Link>
            <Link to="/about" className="hover:text-rose-500 transition-colors">
              {t.nav.about}
            </Link>
            <Link
              to="/contact"
              className="hover:text-rose-500 transition-colors"
            >
              {t.nav.contact}
            </Link>
          </div>

          {/* Column 3: Instagram & Signature */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <a
              href={
                footerContent.instagramUrl ||
                "https://www.instagram.com/ghayma_rd/"
              }
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-95 transition-all"
            >
              <Instagram className="w-4 h-4" />
              <span>
                Follow {footerContent.instagramHandle || "@ghayma_rd"}
              </span>
            </a>
            <span className="text-xs opacity-75">{madeWithLove}</span>
          </div>
        </div>

        <div className="border-t border-rose-500/10 mt-8 pt-6 text-center text-xs opacity-70">
          © {new Date().getFullYear()} {copyright}
        </div>
      </div>
    </footer>
  );
}
