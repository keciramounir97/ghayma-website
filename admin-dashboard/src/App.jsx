import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import BooksPage from "./pages/BooksPage.jsx";
import DeliveryWilayasPage from "./pages/DeliveryWilayasPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import HeroEditorPage from "./pages/HeroEditorPage.jsx";
import AboutEditorPage from "./pages/AboutEditorPage.jsx";
import HomeSectionsEditorPage from "./pages/HomeSectionsEditorPage.jsx";
import FooterEditorPage from "./pages/FooterEditorPage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import ChallengesAdminPage from "./pages/ChallengesAdminPage.jsx";
import ArticlesAdminPage from "./pages/ArticlesAdminPage.jsx";

export default function App() {
  return (
    <AdminProvider>
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminProvider>
  );
}
