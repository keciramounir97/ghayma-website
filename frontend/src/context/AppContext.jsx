import React, { createContext, useContext, useEffect, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useAppStore } from "../store/useAppStore.js";
import {
  ensureSeedData,
  subscribeBooks,
  subscribeAbout,
  subscribeHome,
  subscribeFooter,
  subscribeDeliverySettings,
  subscribeChallenges,
  subscribeChallengePosts,
  subscribeAnalytics,
  subscribeArticles,
  subscribeMemberDiscountSettings,
  trackWebsiteVisit
} from "../firebase.js";
import { TRANSLATIONS } from "../data/i18n.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const store = useAppStore();
  const {
    lang,
    dark,
    setBooks,
    setAbout,
    setHomeContent,
    setFooterContent,
    setWilayas,
    setDeliveryEnabled,
    setChallenges,
    setChallengePosts,
    setArticles,
    setAnalytics,
    setMemberDiscount
  } = store;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ar;

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
    ensureSeedData();
    trackWebsiteVisit();
    const unsubBooks = subscribeBooks(setBooks);
    const unsubAbout = subscribeAbout(setAbout);
    const unsubHome = subscribeHome(setHomeContent);
    const unsubFooter = subscribeFooter(setFooterContent);
    const unsubChallenges = subscribeChallenges(setChallenges);
    const unsubPosts = subscribeChallengePosts(setChallengePosts);
    const unsubArticles = subscribeArticles(setArticles);
    const unsubAnalytics = subscribeAnalytics(setAnalytics);
    const unsubDelivery = subscribeDeliverySettings((deliv) => {
      setDeliveryEnabled(deliv.deliveryEnabled);
      setWilayas(deliv.wilayas);
    });
    const unsubDiscount = subscribeMemberDiscountSettings(setMemberDiscount);
    return () => {
      unsubBooks && unsubBooks();
      unsubAbout && unsubAbout();
      unsubHome && unsubHome();
      unsubFooter && unsubFooter();
      unsubChallenges && unsubChallenges();
      unsubPosts && unsubPosts();
      unsubArticles && unsubArticles();
      unsubAnalytics && unsubAnalytics();
      unsubDelivery && unsubDelivery();
      unsubDiscount && unsubDiscount();
    };
  }, [
    setBooks,
    setAbout,
    setHomeContent,
    setFooterContent,
    setWilayas,
    setDeliveryEnabled,
    setMemberDiscount,
    setChallenges,
    setChallengePosts,
    setArticles,
    setAnalytics
  ]);

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
            default: dark ? "#0f0913" : "#fff8fa",
            paper: dark ? "#180f1f" : "#ffffff"
          },
          text: {
            primary: dark ? "#fff1f2" : "#0f172a",
            secondary: dark ? "#fda4af" : "#64748b"
          }
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                transition: "box-shadow 250ms ease, border-color 250ms ease"
              }
            }
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                borderRadius: 24,
                backgroundImage: "none"
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
      formatDzd
    }),
    [store, t]
  );

  return (
    <AppContext.Provider value={contextValue}>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return ctx;
}
