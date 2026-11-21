import { create } from "zustand";
import {
  INITIAL_BOOKS,
  INITIAL_ABOUT,
  INITIAL_HOME,
  INITIAL_FOOTER,
  INITIAL_CHALLENGES,
  INITIAL_POSTS
} from "../data/initialData.js";
import { WILAYAS_69 } from "../data/wilayas.js";
import { ADMIN_TRANSLATIONS } from "../data/i18n.js";

const getInitialUser = () => {
  try {
    const raw = localStorage.getItem("ghayma_admin_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAdminStore = create((set, get) => ({
  lang: localStorage.getItem("ghayma_admin_lang") || "fr",
  dark: localStorage.getItem("ghayma_admin_theme") === "dark",
  adminUser: getInitialUser(),
  sidebarOpen: false,
  sidebarCollapsed: false,
  notifOpen: false,
  toasts: [],

  // Firestore Collections State
  books: INITIAL_BOOKS,
  orders: [],
  messages: [],
  about: INITIAL_ABOUT,
  homeContent: INITIAL_HOME,
  footerContent: INITIAL_FOOTER,
  wilayas: WILAYAS_69,
  deliveryEnabled: false, // Deactivated by default until admin checks it in settings
  challenges: INITIAL_CHALLENGES,
  challengePosts: INITIAL_POSTS,
  challengeComments: [],
  articles: INITIAL_ARTICLES,
  articleComments: INITIAL_COMMENTS,
  analytics: { totalVisits: 3120, challengeClicks: 1460, challengeSubscribers: 820, activeVisitors: 14 },

  // Interactive Ticket Modals State
  selectedOrderTicket: null,
  selectedMessageTicket: null,
  selectedWilayaTicket: null,
  selectedChallenge: null,
  selectedPost: null,
  selectedArticle: null,

  setLang: (lang) => {
    localStorage.setItem("ghayma_admin_lang", lang);
    const dir = (ADMIN_TRANSLATIONS[lang] || ADMIN_TRANSLATIONS.fr).dir;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    set({ lang });
  },

  setDark: (darkVal) => {
    const next = typeof darkVal === "function" ? darkVal(get().dark) : darkVal;
    localStorage.setItem("ghayma_admin_theme", next ? "dark" : "light");
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    set({ dark: next });
  },

  setAdminUser: (user) => {
    if (user) {
      localStorage.setItem("ghayma_admin_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("ghayma_admin_user");
    }
    set({ adminUser: user });
  },

  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setNotifOpen: (notifOpen) => set({ notifOpen }),

  setBooks: (books) => set({ books }),
  setOrders: (orders) => {
    const currentTicket = get().selectedOrderTicket;
    const updatedTicket = currentTicket
      ? orders.find((o) => o.id === currentTicket.id) || null
      : null;
    set({ orders, selectedOrderTicket: updatedTicket });
  },
  setMessages: (messages) => {
    const currentMsg = get().selectedMessageTicket;
    const updatedMsg = currentMsg
      ? messages.find((m) => m.id === currentMsg.id) || null
      : null;
    set({ messages, selectedMessageTicket: updatedMsg });
  },
  setAbout: (about) => set({ about }),
  setHomeContent: (homeContent) => set({ homeContent }),
  setFooterContent: (footerContent) => set({ footerContent }),
  setWilayas: (wilayasVal) => {
    const next =
      typeof wilayasVal === "function" ? wilayasVal(get().wilayas) : wilayasVal;
    set({ wilayas: next });
  },
  setDeliveryEnabled: (deliveryEnabled) => set({ deliveryEnabled }),
  setChallenges: (challenges) => set({ challenges }),
  setChallengePosts: (challengePosts) => set({ challengePosts }),
  setChallengeComments: (challengeComments) => set({ challengeComments }),
  setArticles: (articles) => set({ articles }),
  setArticleComments: (articleComments) => set({ articleComments }),
  setAnalytics: (analytics) => set({ analytics }),
  setSelectedChallenge: (selectedChallenge) => set({ selectedChallenge }),
  setSelectedPost: (selectedPost) => set({ selectedPost }),
  setSelectedArticle: (selectedArticle) => set({ selectedArticle }),

  setSelectedOrderTicket: (selectedOrderTicket) => set({ selectedOrderTicket }),
  setSelectedMessageTicket: (selectedMessageTicket) => set({ selectedMessageTicket }),
  setSelectedWilayaTicket: (selectedWilayaTicket) => set({ selectedWilayaTicket }),

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) }));
  },

  addToast: (message, type = "success") => {
    const id = Date.now() + Math.random();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) }));
    }, 4200);
  }
}));
