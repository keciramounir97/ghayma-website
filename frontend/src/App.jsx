import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext.jsx";
import Navbar from "./components/Navbar.jsx";
import BreadcrumbsBar from "./components/BreadcrumbsBar.jsx";
import ToastContainer from "./components/ToastContainer.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import BooksCatalogPage from "./pages/BooksCatalogPage.jsx";
import BookDetailsPage from "./pages/BookDetailsPage.jsx";
import AboutAuthorPage from "./pages/AboutAuthorPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import GhaymaChallengesPage from "./pages/GhaymaChallengesPage.jsx";
import ArticlesPage from "./pages/ArticlesPage.jsx";
import ArticleDetailsPage from "./pages/ArticleDetailsPage.jsx";
import AuthModal from "./components/AuthModal.jsx";

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

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BooksCatalogPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<ArticleDetailsPage />} />
          <Route path="/challenges" element={<GhaymaChallengesPage />} />
          <Route path="/book/:id" element={<BookDetailsPage />} />
          <Route path="/about" element={<AboutAuthorPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <FrontendShell />
    </AppProvider>
  );
}
