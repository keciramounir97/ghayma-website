import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  onSnapshot,
  increment,
  arrayUnion
} from "firebase/firestore";
import {
  INITIAL_BOOKS,
  INITIAL_ABOUT,
  INITIAL_HOME,
  INITIAL_FOOTER,
  INITIAL_CHALLENGES,
  INITIAL_POSTS,
  INITIAL_ARTICLES,
  INITIAL_COMMENTS
} from "./data/initialData.js";
import { WILAYAS_69 } from "./data/wilayas.js";

// Your web app's Firebase configuration (ghayma-rd-books)
const firebaseConfig = {
  apiKey: "AIzaSyBmPZW39io1FpB36NwWKtahLKJIox2vYMg",
  authDomain: "ghayma-rd-books.firebaseapp.com",
  projectId: "ghayma-rd-books",
  storageBucket: "ghayma-rd-books.firebasestorage.app",
  messagingSenderId: "127963185711",
  appId: "1:127963185711:web:aada4f81868008931bfcda",
  measurementId: "G-9JEP5NQ80R"
};

// Also mirror orders/messages to admin-ghayma-rd-books Firestore
const adminFirebaseConfig = {
  apiKey: "AIzaSyBqnSB8lCjNWcKehwdQgV7IeoD7tmR9Bzc",
  authDomain: "admin-ghayma-rd-books.firebaseapp.com",
  projectId: "admin-ghayma-rd-books",
  storageBucket: "admin-ghayma-rd-books.firebasestorage.app",
  messagingSenderId: "193941402422",
  appId: "1:193941402422:web:8d8e089b28909f09073997",
  measurementId: "G-Q4SKM955RQ"
};

export const app = initializeApp(firebaseConfig);
export const adminApp = initializeApp(adminFirebaseConfig, "adminMirror");

export let analytics = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((yes) => {
      if (yes) analytics = getAnalytics(app);
    })
    .catch(() => {});
}

export const db = getFirestore(app);
export const adminDb = getFirestore(adminApp);

// Ensure initial seed data exists in Firestore
export async function ensureSeedData() {
  try {
    const booksSnap = await getDocs(collection(db, "books"));
    if (booksSnap.empty) {
      for (const book of INITIAL_BOOKS) {
        await setDoc(doc(db, "books", book.id), book);
        await setDoc(doc(adminDb, "books", book.id), book).catch(() => {});
      }
    }
    const aboutRef = doc(db, "settings", "about");
    const aboutSnap = await getDoc(aboutRef);
    if (!aboutSnap.exists()) {
      await setDoc(aboutRef, INITIAL_ABOUT);
      await setDoc(doc(adminDb, "settings", "about"), INITIAL_ABOUT).catch(() => {});
    }
    const homeRef = doc(db, "settings", "home");
    const homeSnap = await getDoc(homeRef);
    if (!homeSnap.exists()) {
      await setDoc(homeRef, INITIAL_HOME);
      await setDoc(doc(adminDb, "settings", "home"), INITIAL_HOME).catch(() => {});
    }
    const footerRef = doc(db, "settings", "footer");
    const footerSnap = await getDoc(footerRef);
    if (!footerSnap.exists()) {
      await setDoc(footerRef, INITIAL_FOOTER);
      await setDoc(doc(adminDb, "settings", "footer"), INITIAL_FOOTER).catch(() => {});
    }
    const deliveryRef = doc(db, "settings", "delivery");
    const deliverySnap = await getDoc(deliveryRef);
    if (!deliverySnap.exists()) {
      const initialDelivery = {
        enabled: false, // Deactivated by default until admin checks it in settings
        wilayas: WILAYAS_69,
        updatedAt: new Date().toISOString()
      };
      await setDoc(deliveryRef, initialDelivery);
      await setDoc(doc(adminDb, "settings", "delivery"), initialDelivery).catch(() => {});
    }

    // Seed / Ensure Primary Ghayma Challenge (November Fajr Challenge)
    const fajrDoc = doc(db, "challenges", "fajr-prayer-nov-2026");
    const fajrSnap = await getDoc(fajrDoc);
    if (!fajrSnap.exists()) {
      for (const ch of INITIAL_CHALLENGES) {
        await setDoc(doc(db, "challenges", ch.id), ch);
        await setDoc(doc(adminDb, "challenges", ch.id), ch).catch(() => {});
      }
    }

    // Seed Ghayma Challenge Posts / Interactive Blog
    const postsSnap = await getDocs(collection(db, "challenge_posts"));
    if (postsSnap.empty) {
      for (const p of INITIAL_POSTS) {
        await setDoc(doc(db, "challenge_posts", p.id), p);
        await setDoc(doc(adminDb, "challenge_posts", p.id), p).catch(() => {});
      }
    }

    // Seed Ghayma Articles & Initial Comments
    const articlesSnap = await getDocs(collection(db, "articles"));
    if (articlesSnap.empty) {
      for (const art of INITIAL_ARTICLES) {
        await setDoc(doc(db, "articles", art.id), art);
        await setDoc(doc(adminDb, "articles", art.id), art).catch(() => {});
      }
      for (const com of INITIAL_COMMENTS) {
        await setDoc(doc(db, "article_comments", com.id), com);
        await setDoc(doc(adminDb, "article_comments", com.id), com).catch(() => {});
      }
    }

    // Seed Analytics Overview
    const analyticsRef = doc(db, "analytics", "overview");
    const analyticsSnap = await getDoc(analyticsRef);
    if (!analyticsSnap.exists()) {
      const initialStats = {
        totalVisits: 3120,
        challengeClicks: 1460,
        challengeSubscribers: 820,
        activeVisitors: 14,
        updatedAt: new Date().toISOString()
      };
      await setDoc(analyticsRef, initialStats);
      await setDoc(doc(adminDb, "analytics", "overview"), initialStats).catch(() => {});
    }
  } catch (err) {
    console.warn("Seed check fallback:", err);
  }
}

export function subscribeBooks(callback) {
  return onSnapshot(
    collection(db, "books"),
    (snap) => {
      if (snap.empty) {
        callback(INITIAL_BOOKS);
      } else {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        callback(list);
      }
    },
    () => callback(INITIAL_BOOKS)
  );
}

export function subscribeAbout(callback) {
  return onSnapshot(
    doc(db, "settings", "about"),
    (snap) => {
      if (snap.exists()) {
        callback({ ...INITIAL_ABOUT, ...snap.data() });
      } else {
        callback(INITIAL_ABOUT);
      }
    },
    () => callback(INITIAL_ABOUT)
  );
}

export function subscribeHome(callback) {
  return onSnapshot(
    doc(db, "settings", "home"),
    (snap) => {
      if (snap.exists()) {
        callback({ ...INITIAL_HOME, ...snap.data() });
      } else {
        callback(INITIAL_HOME);
      }
    },
    () => callback(INITIAL_HOME)
  );
}

export function subscribeFooter(callback) {
  return onSnapshot(
    doc(db, "settings", "footer"),
    (snap) => {
      if (snap.exists()) {
        callback({ ...INITIAL_FOOTER, ...snap.data() });
      } else {
        callback(INITIAL_FOOTER);
      }
    },
    () => callback(INITIAL_FOOTER)
  );
}

export function subscribeDeliverySettings(callback) {
  return onSnapshot(
    doc(db, "settings", "delivery"),
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        callback({
          deliveryEnabled: Boolean(data.enabled), // false by default
          wilayas:
            Array.isArray(data.wilayas) && data.wilayas.length > 0
              ? data.wilayas
              : WILAYAS_69
        });
      } else {
        callback({
          deliveryEnabled: false,
          wilayas: WILAYAS_69
        });
      }
    },
    () => callback({ deliveryEnabled: false, wilayas: WILAYAS_69 })
  );
}

export function subscribeDeliveryWilayas(callback) {
  return onSnapshot(
    doc(db, "settings", "delivery"),
    (snap) => {
      if (
        snap.exists() &&
        Array.isArray(snap.data().wilayas) &&
        snap.data().wilayas.length > 0
      ) {
        callback(snap.data().wilayas);
      } else {
        callback(WILAYAS_69);
      }
    },
    () => callback(WILAYAS_69)
  );
}

export async function createOrder(orderData) {
  const payload = {
    ...orderData,
    status: "pending",
    createdAt: new Date().toISOString()
  };
  const docRef = await addDoc(collection(db, "orders"), payload);
  await setDoc(doc(adminDb, "orders", docRef.id), {
    id: docRef.id,
    ...payload
  }).catch(() => {});
  return docRef.id;
}

export async function createContactMessage(msgData) {
  const payload = {
    ...msgData,
    read: false,
    createdAt: new Date().toISOString()
  };
  const docRef = await addDoc(collection(db, "messages"), payload);
  await setDoc(doc(adminDb, "messages", docRef.id), {
    id: docRef.id,
    ...payload
  }).catch(() => {});
  return docRef.id;
}

export function subscribeChallenges(callback) {
  return onSnapshot(
    collection(db, "challenges"),
    (snap) => {
      if (snap.empty) {
        callback(INITIAL_CHALLENGES);
      } else {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        callback(list);
      }
    },
    () => callback(INITIAL_CHALLENGES)
  );
}

export function subscribeChallengePosts(callback) {
  return onSnapshot(
    collection(db, "challenge_posts"),
    (snap) => {
      if (snap.empty) {
        callback(INITIAL_POSTS);
      } else {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        callback(list);
      }
    },
    () => callback(INITIAL_POSTS)
  );
}

export function subscribeAnalytics(callback) {
  return onSnapshot(
    doc(db, "analytics", "overview"),
    (snap) => {
      if (snap.exists()) {
        callback(snap.data());
      } else {
        callback({ totalVisits: 3120, challengeClicks: 1460, challengeSubscribers: 820, activeVisitors: 14 });
      }
    },
    () => callback({ totalVisits: 3120, challengeClicks: 1460, challengeSubscribers: 820, activeVisitors: 14 })
  );
}

export async function trackWebsiteVisit() {
  try {
    const ref = doc(db, "analytics", "overview");
    await updateDoc(ref, {
      totalVisits: increment(1),
      updatedAt: new Date().toISOString()
    }).catch(() => {});
  } catch (_) {}
}

export async function recordChallengeClick(challengeId) {
  try {
    await updateDoc(doc(db, "challenges", challengeId), {
      clicksCount: increment(1)
    }).catch(() => {});
    await updateDoc(doc(adminDb, "challenges", challengeId), {
      clicksCount: increment(1)
    }).catch(() => {});
    await updateDoc(doc(db, "analytics", "overview"), {
      challengeClicks: increment(1)
    }).catch(() => {});
    await updateDoc(doc(adminDb, "analytics", "overview"), {
      challengeClicks: increment(1)
    }).catch(() => {});
  } catch (_) {}
}

export async function recordChallengeView(challengeId) {
  try {
    await updateDoc(doc(db, "challenges", challengeId), {
      viewsCount: increment(1)
    }).catch(() => {});
  } catch (_) {}
}

export async function joinChallengeSubscription(challengeId, subscriber) {
  const subData = {
    id: "sub-" + Date.now(),
    name: subscriber.name || "قارئة غيمة",
    wilaya: subscriber.wilaya || "الجزائر",
    phone: subscriber.phone || "",
    joinedAt: new Date().toISOString()
  };
  try {
    await updateDoc(doc(db, "challenges", challengeId), {
      subscribersCount: increment(1),
      clicksCount: increment(1),
      subscribers: arrayUnion(subData)
    });
    await updateDoc(doc(adminDb, "challenges", challengeId), {
      subscribersCount: increment(1),
      clicksCount: increment(1),
      subscribers: arrayUnion(subData)
    }).catch(() => {});
    await updateDoc(doc(db, "analytics", "overview"), {
      challengeSubscribers: increment(1),
      challengeClicks: increment(1)
    }).catch(() => {});
    await updateDoc(doc(adminDb, "analytics", "overview"), {
      challengeSubscribers: increment(1),
      challengeClicks: increment(1)
    }).catch(() => {});
  } catch (err) {
    console.warn("Join challenge error:", err);
  }
  return subData;
}

export async function reactToChallengePost(postId, reactionType = "like") {
  const field = reactionType === "spark" ? "sparksCount" : "likesCount";
  try {
    await updateDoc(doc(db, "challenge_posts", postId), {
      [field]: increment(1)
    });
    await updateDoc(doc(adminDb, "challenge_posts", postId), {
      [field]: increment(1)
    }).catch(() => {});
  } catch (_) {}
}

export function subscribeArticles(callback) {
  return onSnapshot(
    collection(db, "articles"),
    (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_ARTICLES);
      } else {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        callback(list);
      }
    },
    (err) => {
      console.warn("Articles sub error:", err);
      callback(INITIAL_ARTICLES);
    }
  );
}

export function subscribeArticle(articleId, callback) {
  return onSnapshot(
    doc(db, "articles", articleId),
    (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...snap.data() });
      } else {
        const fallback = INITIAL_ARTICLES.find((a) => a.id === articleId) || INITIAL_ARTICLES[0];
        callback(fallback);
      }
    },
    () => {
      const fallback = INITIAL_ARTICLES.find((a) => a.id === articleId) || INITIAL_ARTICLES[0];
      callback(fallback);
    }
  );
}

export function subscribeArticleComments(articleId, callback) {
  return onSnapshot(
    collection(db, "article_comments"),
    (snapshot) => {
      const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      const filtered = all
        .filter((c) => c.articleId === articleId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      callback(filtered);
    },
    (err) => {
      console.warn("Article comments sub error:", err);
      callback(INITIAL_COMMENTS.filter((c) => c.articleId === articleId));
    }
  );
}

export async function addArticleComment(articleId, commentData) {
  const newComment = {
    id: "com-" + Date.now(),
    articleId,
    authorName: commentData.authorName || "قارئة غيمة",
    authorAvatar: commentData.authorAvatar || "🌸",
    content: commentData.content || "",
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, "article_comments", newComment.id), newComment);
    await setDoc(doc(adminDb, "article_comments", newComment.id), newComment).catch(() => {});
    await updateDoc(doc(db, "articles", articleId), {
      commentsCount: increment(1)
    }).catch(() => {});
    await updateDoc(doc(adminDb, "articles", articleId), {
      commentsCount: increment(1)
    }).catch(() => {});
  } catch (err) {
    console.warn("Add comment error:", err);
  }
  return newComment;
}

export async function likeArticle(articleId) {
  try {
    await updateDoc(doc(db, "articles", articleId), {
      likesCount: increment(1)
    });
    await updateDoc(doc(adminDb, "articles", articleId), {
      likesCount: increment(1)
    }).catch(() => {});
  } catch (_) {}
}

export async function saveUserRoutine(userId, routineText) {
  if (!userId || !routineText) return null;
  const routine = {
    id: "rtn-" + Date.now(),
    userId,
    text: routineText,
    completed: false,
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, "user_routines", routine.id), routine);
  } catch (_) {}
  return routine;
}
