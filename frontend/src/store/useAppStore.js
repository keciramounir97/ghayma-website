import { create } from "zustand";
import {
  INITIAL_BOOKS,
  INITIAL_ABOUT,
  INITIAL_HOME,
  INITIAL_FOOTER
} from "../data/initialData.js";
import { WILAYAS_69 } from "../data/wilayas.js";
import { TRANSLATIONS } from "../data/i18n.js";

export const useAppStore = create((set, get) => ({
  lang: localStorage.getItem("ghayma_lang") || "ar",
  dark: localStorage.getItem("ghayma_theme") === "dark",
  books: INITIAL_BOOKS,
  about: INITIAL_ABOUT,
  homeContent: INITIAL_HOME,
  footerContent: INITIAL_FOOTER,
  wilayas: WILAYAS_69,
  deliveryEnabled: false, // Deactivated by default until admin checks it in settings
  drawerOpen: false,
  notifOpen: false,
  toasts: [],
  notifications: [
    {
      id: "welcome-1",
      textAr: "مرحبًا بكِ في الموقع الرسمي للكاتبة رميساء دحمان (@ghayma_rd) 🌸",
      textFr: "Bienvenue sur le site officiel de l'écrivaine Roumeyssa Dahmane (@ghayma_rd) 🌸",
      textEn: "Welcome to the official website of author Roumeyssa Dahmane (@ghayma_rd) 🌸",
      time: "الآن • Now",
      unread: true
    }
  ],

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
