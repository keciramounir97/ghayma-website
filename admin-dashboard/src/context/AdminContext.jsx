import React, { createContext, useContext, useEffect, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useAdminStore } from "../store/useAdminStore.js";
import {
  ensureAdminAndSeedData,
  subscribeBooks,
  subscribeOrders,
  subscribeMessages,
  subscribeAbout,
  subscribeHome,
  subscribeFooter,
  subscribeDeliverySettings,
  setDeliveryEnabledInFirestore,
  subscribeChallenges,
  subscribeChallengePosts,
  subscribeChallengeComments,
  subscribeAnalytics,
  subscribeArticles,
  subscribeArticleComments,
  subscribeMemberDiscountSettings,
  saveMemberDiscountSettings
} from "../firebase.js";
import { ADMIN_TRANSLATIONS } from "../data/i18n.js";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const store = useAdminStore();
  const {
    lang,
    dark,
    setBooks,
    setOrders,
    setMessages,
    setAbout,
    setHomeContent,
    setFooterContent,
    setWilayas,
    setDeliveryEnabled,
    setChallenges,
    setChallengePosts,
    setChallengeComments,
    setArticles,
    setArticleComments,
    setAnalytics,
    setMemberDiscount,
    addToast
  } = store;

  const t = ADMIN_TRANSLATIONS[lang] || ADMIN_TRANSLATIONS.fr;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [lang, dark, t.dir]);

  useEffect(() => {
    ensureAdminAndSeedData();
    const unsubBooks = subscribeBooks(setBooks);
    const unsubOrders = subscribeOrders(setOrders);
    const unsubMessages = subscribeMessages(setMessages);
    const unsubAbout = subscribeAbout(setAbout);
    const unsubHome = subscribeHome(setHomeContent);
    const unsubFooter = subscribeFooter(setFooterContent);
    const unsubChallenges = subscribeChallenges(setChallenges);
    const unsubPosts = subscribeChallengePosts(setChallengePosts);
    const unsubChallengeComments = subscribeChallengeComments(setChallengeComments);
    const unsubArticles = subscribeArticles(setArticles);
    const unsubComments = subscribeArticleComments(setArticleComments);
    const unsubAnalytics = subscribeAnalytics(setAnalytics);
    const unsubDelivery = subscribeDeliverySettings((deliv) => {
      setDeliveryEnabled(deliv.deliveryEnabled);
      setWilayas(deliv.wilayas);
    });
    const unsubDiscount = subscribeMemberDiscountSettings(setMemberDiscount);
    return () => {
      unsubBooks && unsubBooks();
      unsubOrders && unsubOrders();
      unsubMessages && unsubMessages();
      unsubAbout && unsubAbout();
      unsubHome && unsubHome();
      unsubFooter && unsubFooter();
      unsubChallenges && unsubChallenges();
      unsubPosts && unsubPosts();
      unsubArticles && unsubArticles();
      unsubComments && unsubComments();
      unsubAnalytics && unsubAnalytics();
      unsubDelivery && unsubDelivery();
      unsubDiscount && unsubDiscount();
    };
  }, [
    setBooks,
    setOrders,
    setMessages,
    setAbout,
    setHomeContent,
    setFooterContent,
    setWilayas,
    setDeliveryEnabled,
    setMemberDiscount,
    setChallenges,
    setChallengePosts,
    setChallengeComments,
    setArticles,
    setArticleComments,
    setAnalytics
  ]);

  const updateMemberDiscount = async (settings) => {
    try {
      await saveMemberDiscountSettings(settings);
      addToast(
        lang === "ar"
          ? "تم حفظ إعدادات خصم العضوات بنجاح! 🌸"
          : "Paramètres de la remise membre enregistrés avec succès ! 🌸"
      );
    } catch (err) {
      console.error("Save discount error:", err);
      addToast("Erreur lors de la sauvegarde du discount", "error");
    }
  };

  const toggleDeliveryEnabled = async () => {
    const nextVal = !store.deliveryEnabled;
    try {
      await setDeliveryEnabledInFirestore(nextVal);
      if (nextVal) {
        addToast(
          lang === "ar"
            ? "تم تفعيل أسعار وطرق التوصيل (المنزل / الوكالة) للزبائن بنجاح! ✓"
            : "Tarifs de livraison activés avec succès pour les clients ! ✓"
        );
      } else {
        addToast(
          lang === "ar"
            ? "تم تعطيل أسعار التوصيل (مخفية الآن عن الزبائن). ○"
            : "Tarifs de livraison désactivés (masqués pour les clients). ○",
          "info"
        );
      }
      return nextVal;
    } catch (err) {
      console.error("Toggle delivery error:", err);
      addToast("Erreur lors de la mise à jour des paramètres", "error");
      return store.deliveryEnabled;
    }
  };

  const formatDzd = (amount) => {
    const num = Number(amount) || 0;
    return `${num.toLocaleString()} ${t.currency}`;
  };

  const muiTheme = useMemo(
    () =>
      createTheme({
        direction: t.dir,
        palette: {
          mode: dark ? "dark" : "light",
          primary: {
            main: "#f43f5e",
            light: "#fb7185",
            dark: "#e11d48",
            contrastText: "#ffffff"
          },
          secondary: {
            main: "#f59e0b",
            contrastText: "#ffffff"
          },
          background: {
            default: dark ? "#0f0913" : "#fdf8fa",
            paper: dark ? "#180f1f" : "#ffffff"
          },
          text: {
            primary: dark ? "#fff1f2" : "#0f172a",
            secondary: dark ? "#fda4af" : "#64748b"
          }
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              "*": {
                scrollbarWidth: "none !important",
                msOverflowStyle: "none !important",
                "&::-webkit-scrollbar": {
                  display: "none !important",
                  width: "0 !important",
                  height: "0 !important"
                }
              }
            }
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                transition: "box-shadow 250ms ease, border-color 250ms ease",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none"
                }
              }
            }
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                borderRadius: 24,
                backgroundImage: "none",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none"
                }
              }
            }
          }
        },
        shape: {
          borderRadius: 18
        },
        typography: {
          fontFamily:
            t.dir === "rtl"
              ? "'Tajawal', sans-serif"
              : "'Plus Jakarta Sans', sans-serif"
        }
      }),
    [dark, t.dir]
  );

  const contextValue = useMemo(
    () => ({
      ...store,
      t,
      formatDzd,
      toggleDeliveryEnabled,
      updateMemberDiscount
    }),
    [store, t, toggleDeliveryEnabled, updateMemberDiscount]
  );

  return (
    <AdminContext.Provider value={contextValue}>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdminContext must be used inside AdminProvider");
  }
  return ctx;
}
