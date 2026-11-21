import React, { useEffect, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext.jsx";
import Navbar from "./components/Navbar.jsx";
import BreadcrumbsBar from "./components/BreadcrumbsBar.jsx";
import ToastContainer from "./components/ToastContainer.jsx";
import Footer from "./components/Footer.jsx";
import AuthModal from "./components/AuthModal.jsx";
import CookieBanner from "./components/CookieBanner.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Lazy-loaded routes for optimal loading speed and code-splitting
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const BooksCatalogPage = lazy(() => import("./pages/BooksCatalogPage.jsx"));
const BookDetailsPage = lazy(() => import("./pages/BookDetailsPage.jsx"));
const AboutAuthorPage = lazy(() => import("./pages/AboutAuthorPage.jsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.jsx"));
const GhaymaChallengesPage = lazy(() => import("./pages/GhaymaChallengesPage.jsx"));
const ArticlesPage = lazy(() => import("./pages/ArticlesPage.jsx"));
const ArticleDetailsPage = lazy(() => import("./pages/ArticleDetailsPage.jsx"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage.jsx"));
const TermsPage = lazy(() => import("./pages/TermsPage.jsx"));
const RefundPolicyPage = lazy(() => import("./pages/RefundPolicyPage.jsx"));
const CookiePolicyPage = lazy(() => import("./pages/CookiePolicyPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 py-16">
      <div className="w-12 h-12 rounded-full border-3 border-rose-300 border-t-rose-600 animate-spin" />
      <span className="text-xs font-bold text-rose-500 animate-pulse">
        غيمة • Ghayma RD 🌸
      </span>
    </div>
  );
}

function FrontendShell() {
  const { t, dark, setDrawerOpen, setNotifOpen } = useAppContext();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setDrawerOpen(false);
    setNotifOpen(false);
  }, [location.pathname, setDrawerOpen, setNotifOpen]);

  return (
    <div
      dir={t.dir}
      className={`min-h-screen flex flex-col transition-colors duration-300 overflow-x-hidden ${
        dark ? "bg-[#120b16] text-rose-50" : "bg-[#fffafb] text-slate-800"
      }`}
    >
      <Navbar />
      <BreadcrumbsBar />
      <ToastContainer />
      <AuthModal />
      <CookieBanner />

      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BooksCatalogPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:id" element={<ArticleDetailsPage />} />
            <Route path="/challenges" element={<GhaymaChallengesPage />} />
            <Route path="/book/:id" element={<BookDetailsPage />} />
            <Route path="/about" element={<AboutAuthorPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Legal / Policy Routes (Prompt One Compliance) */}
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/refunds" element={<RefundPolicyPage />} />
            <Route path="/cookies" element={<CookiePolicyPage />} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <FrontendShell />
      </AppProvider>
    </ErrorBoundary>
  );
}
