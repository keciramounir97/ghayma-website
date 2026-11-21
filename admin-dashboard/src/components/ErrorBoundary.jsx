import React from "react";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ADMIN-BOUNDARY-ERROR]", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoDashboard = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-rose-50/50 dark:bg-[#100915] text-slate-900 dark:text-rose-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#1a1122] rounded-3xl p-8 border border-rose-200 dark:border-rose-900/60 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-editorial text-2xl font-bold text-slate-900 dark:text-white">
                Erreur dans le Dashboard Admin
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-rose-200/80 leading-relaxed">
                Une exception a été interceptée par le système de sécurité. La base Firestore et les commandes sont intactes.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Actualiser</span>
              </button>
              <button
                onClick={this.handleGoDashboard}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-rose-500/30 text-rose-600 dark:text-rose-300 hover:bg-rose-500/10 text-xs font-bold cursor-pointer transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Vue d'ensemble</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
