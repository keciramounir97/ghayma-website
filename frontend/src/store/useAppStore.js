import { create } from "zustand";
import {
  INITIAL_BOOKS,
  INITIAL_ABOUT,
  INITIAL_HOME,
  INITIAL_FOOTER,
  INITIAL_CHALLENGES,
  INITIAL_POSTS,
  INITIAL_ARTICLES
} from "../data/initialData.js";
import { WILAYAS_69 } from "../data/wilayas.js";
import { TRANSLATIONS } from "../data/i18n.js";

const getSavedUser = () => {
  try {
    const raw = localStorage.getItem("ghayma_user");
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
};

export const useAppStore = create((set, get) => ({
  lang: localStorage.getItem("ghayma_lang") || "ar",
  dark: localStorage.getItem("ghayma_theme") === "dark",
  currentUser: getSavedUser(),
  authModalOpen: false,
  books: INITIAL_BOOKS,
  about: INITIAL_ABOUT,
  homeContent: INITIAL_HOME,
  footerContent: INITIAL_FOOTER,
  wilayas: WILAYAS_69,
  deliveryEnabled: false, // Deactivated by default until admin checks it in settings
  challenges: INITIAL_CHALLENGES,
  challengePosts: INITIAL_POSTS,
  articles: INITIAL_ARTICLES,
  analytics: { totalVisits: 3120, challengeClicks: 1460, challengeSubscribers: 820, activeVisitors: 14 },
  drawerOpen: false,
  notifOpen: false,
  toasts: [],
  notifications: [
    {
      id: "welcome-1",
      textAr: "مرحبًا بكِ في الموقع الرسمي للكاتبة ghayma_rd (ر. دحمان) (@ghayma_rd) 🌸",
      textFr: "Bienvenue sur le site officiel de l'ghayma_rd (R.Dahmane) (@ghayma_rd) 🌸",
      textEn: "Welcome to the official website of ghayma_rd (R.Dahmane) (@ghayma_rd) 🌸",
      time: "الآن • Now",
      unread: true
    }
  ],

  setAuthModalOpen: (authModalOpen) => set({ authModalOpen }),

  loginUser: (user) => {
    localStorage.setItem("ghayma_user", JSON.stringify(user));
    set({ currentUser: user, authModalOpen: false });
  },

  registerUser: (user) => {
    localStorage.setItem("ghayma_user", JSON.stringify(user));
    set({ currentUser: user, authModalOpen: false });
  },

  logoutUser: () => {
    localStorage.removeItem("ghayma_user");
    set({ currentUser: null });
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) }));
  },

  setLang: (lang) => {
    localStorage.setItem("ghayma_lang", lang);
    const dir = (TRANSLATIONS[lang] || TRANSLATIONS.ar).dir;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    set({ lang });
  },

  setDark: (darkVal) => {
    const next = typeof darkVal === "function" ? darkVal(get().dark) : darkVal;
    localStorage.setItem("ghayma_theme", next ? "dark" : "light");
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    set({ dark: next });
  },

  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  setNotifOpen: (notifOpen) => set({ notifOpen }),
  setBooks: (books) => set({ books }),
  setAbout: (about) => set({ about }),
  setHomeContent: (homeContent) => set({ homeContent }),
  setFooterContent: (footerContent) => set({ footerContent }),
  setWilayas: (wilayas) => set({ wilayas }),
  setDeliveryEnabled: (deliveryEnabled) => set({ deliveryEnabled }),
  setChallenges: (challenges) => set({ challenges }),
  setChallengePosts: (challengePosts) => set({ challengePosts }),
  setArticles: (articles) => set({ articles }),
  setAnalytics: (analytics) => set({ analytics }),

  addToast: (message, type = "success") => {
    const id = Date.now() + Math.random();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) }));
    }, 4500);
  },

  addNotification: (textAr, textFr, textEn) => {
    set((state) => ({
      notifications: [
        {
          id: "notif-" + Date.now(),
          textAr,
          textFr,
          textEn,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          }),
          unread: true
        },
        ...state.notifications
      ]
    }));
  },

  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, unread: false }))
    }));
  },

  clearNotifications: () => set({ notifications: [] })
}));
