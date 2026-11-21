import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Lazy-loaded pages for admin dashboard
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const OverviewPage = lazy(() => import("./pages/OverviewPage.jsx"));
const OrdersPage = lazy(() => import("./pages/OrdersPage.jsx"));
const BooksPage = lazy(() => import("./pages/BooksPage.jsx"));
const DeliveryWilayasPage = lazy(() => import("./pages/DeliveryWilayasPage.jsx"));
const SettingsPage = lazy(() => import("./pages/SettingsPage.jsx"));
const HeroEditorPage = lazy(() => import("./pages/HeroEditorPage.jsx"));
const AboutEditorPage = lazy(() => import("./pages/AboutEditorPage.jsx"));
const HomeSectionsEditorPage = lazy(() => import("./pages/HomeSectionsEditorPage.jsx"));
const FooterEditorPage = lazy(() => import("./pages/FooterEditorPage.jsx"));
const MessagesPage = lazy(() => import("./pages/MessagesPage.jsx"));
const ChallengesAdminPage = lazy(() => import("./pages/ChallengesAdminPage.jsx"));
const ArticlesAdminPage = lazy(() => import("./pages/ArticlesAdminPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

function AdminPageLoader() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 py-16">
      <div className="w-10 h-10 rounded-full border-3 border-rose-300 border-t-rose-600 animate-spin" />
      <span className="text-xs font-bold text-rose-500">
        Chargement de l'administration...
      </span>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AdminProvider>
        <Suspense fallback={<AdminPageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <OverviewPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <OrdersPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <BooksPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <DeliveryWilayasPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <SettingsPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/challenges"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <ChallengesAdminPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/articles"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <ArticlesAdminPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/home-hero"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <HeroEditorPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AboutEditorPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/home-sections"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <HomeSectionsEditorPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/footer"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <FooterEditorPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <MessagesPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AdminProvider>
    </ErrorBoundary>
  );
}
