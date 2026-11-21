import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";
import {
  INITIAL_BOOKS,
  INITIAL_ABOUT,
  INITIAL_HOME,
  INITIAL_FOOTER
} from "./data/initialData.js";
import { WILAYAS_69 } from "./data/wilayas.js";

// Your web app's Firebase configuration (admin-ghayma-rd-books)
const firebaseConfig = {
  apiKey: "AIzaSyBqnSB8lCjNWcKehwdQgV7IeoD7tmR9Bzc",
  authDomain: "admin-ghayma-rd-books.firebaseapp.com",
  projectId: "admin-ghayma-rd-books",
  storageBucket: "admin-ghayma-rd-books.firebasestorage.app",
  messagingSenderId: "193941402422",
  appId: "1:193941402422:web:8d8e089b28909f09073997",
  measurementId: "G-Q4SKM955RQ"
};

// Shared Frontend Firebase project (ghayma-rd-books)
const storeFirebaseConfig = {
  apiKey: "AIzaSyBmPZW39io1FpB36NwWKtahLKJIox2vYMg",
  authDomain: "ghayma-rd-books.firebaseapp.com",
  projectId: "ghayma-rd-books",
  storageBucket: "ghayma-rd-books.firebasestorage.app",
  messagingSenderId: "127963185711",
  appId: "1:127963185711:web:aada4f81868008931bfcda",
  measurementId: "G-9JEP5NQ80R"
};

export const app = initializeApp(firebaseConfig);
export const storeApp = initializeApp(storeFirebaseConfig, "storeShared");

export let analytics = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((yes) => {
      if (yes) analytics = getAnalytics(app);
    })
    .catch(() => {});
}

export const adminDb = getFirestore(app);
export const storeDb = getFirestore(storeApp);

export const DEFAULT_ADMIN = {
  email: "ghaymard@admin.dz",
  password: "adminghaymard",
  name: "Roumeyssa Dahmane (@ghayma_rd)",
  role: "super_admin"
};

export async function ensureAdminAndSeedData() {
  try {
    const adminDocRef = doc(adminDb, "admins", "ghaymard@admin.dz");
    const adminSnap = await getDoc(adminDocRef);
    if (!adminSnap.exists()) {
      await setDoc(adminDocRef, {
        ...DEFAULT_ADMIN,
        createdAt: new Date().toISOString()
      });
      await setDoc(doc(storeDb, "admins", "ghaymard@admin.dz"), {
        ...DEFAULT_ADMIN,
        createdAt: new Date().toISOString()
      }).catch(() => {});
    }

    const booksSnap = await getDocs(collection(storeDb, "books"));
    if (booksSnap.empty) {
      for (const b of INITIAL_BOOKS) {
        await setDoc(doc(storeDb, "books", b.id), b);
        await setDoc(doc(adminDb, "books", b.id), b).catch(() => {});
      }
    }

    const aboutRef = doc(storeDb, "settings", "about");
    const aboutSnap = await getDoc(aboutRef);
    if (!aboutSnap.exists()) {
      await setDoc(aboutRef, INITIAL_ABOUT);
      await setDoc(doc(adminDb, "settings", "about"), INITIAL_ABOUT).catch(() => {});
    }

    const homeRef = doc(storeDb, "settings", "home");
    const homeSnap = await getDoc(homeRef);
    if (!homeSnap.exists()) {
      await setDoc(homeRef, INITIAL_HOME);
      await setDoc(doc(adminDb, "settings", "home"), INITIAL_HOME).catch(() => {});
    }

    const footerRef = doc(storeDb, "settings", "footer");
    const footerSnap = await getDoc(footerRef);
    if (!footerSnap.exists()) {
      await setDoc(footerRef, INITIAL_FOOTER);
      await setDoc(doc(adminDb, "settings", "footer"), INITIAL_FOOTER).catch(() => {});
    }

    const delivRef = doc(storeDb, "settings", "delivery");
    const delivSnap = await getDoc(delivRef);
    if (!delivSnap.exists()) {
      const initialDelivery = {
        enabled: false, // Deactivated by default until admin checks it in settings
        wilayas: WILAYAS_69,
        updatedAt: new Date().toISOString()
      };
      await setDoc(delivRef, initialDelivery);
      await setDoc(doc(adminDb, "settings", "delivery"), initialDelivery).catch(() => {});
    }
  } catch (err) {
    console.warn("Admin seed warning:", err);
  }
}

export async function verifyAdminLogin(email, password) {
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPass = (password || "").trim();

  if (
    cleanEmail === DEFAULT_ADMIN.email &&
    cleanPass === DEFAULT_ADMIN.password
  ) {
    return {
      email: DEFAULT_ADMIN.email,
      name: DEFAULT_ADMIN.name,
      role: "super_admin"
    };
  }

  try {
    const snap = await getDoc(doc(adminDb, "admins", cleanEmail));
    if (snap.exists() && snap.data().password === cleanPass) {
      return snap.data();
    }
  } catch (_) {}

  return null;
}

export function subscribeBooks(callback) {
  return onSnapshot(
    collection(storeDb, "books"),
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

export async function saveBookToFirestore(bookData) {
  const id = bookData.id || "book-" + Date.now();
  const payload = {
    ...bookData,
    id,
    price: Number(bookData.price) || 1500,
    oldPrice: Number(bookData.oldPrice) || 0,
    pages: Number(bookData.pages) || 200,
    updatedAt: new Date().toISOString()
  };
  await setDoc(doc(storeDb, "books", id), payload);
  await setDoc(doc(adminDb, "books", id), payload).catch(() => {});
  return payload;
}

export async function deleteBookFromFirestore(bookId) {
  await deleteDoc(doc(storeDb, "books", bookId));
  await deleteDoc(doc(adminDb, "books", bookId)).catch(() => {});
}

export function subscribeOrders(callback) {
  return onSnapshot(
    collection(storeDb, "orders"),
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      callback(list);
    },
    () => callback([])
  );
}

export async function updateOrderStatus(orderId, status) {
  await updateDoc(doc(storeDb, "orders", orderId), {
    status,
    updatedAt: new Date().toISOString()
  });
  await updateDoc(doc(adminDb, "orders", orderId), {
    status,
    updatedAt: new Date().toISOString()
  }).catch(() => {});
}

export async function deleteOrderFromFirestore(orderId) {
  await deleteDoc(doc(storeDb, "orders", orderId));
  await deleteDoc(doc(adminDb, "orders", orderId)).catch(() => {});
}

export function subscribeMessages(callback) {
  return onSnapshot(
    collection(storeDb, "messages"),
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      callback(list);
    },
    () => callback([])
  );
}

export async function markMessageRead(msgId, read = true) {
  await updateDoc(doc(storeDb, "messages", msgId), { read });
  await updateDoc(doc(adminDb, "messages", msgId), { read }).catch(() => {});
}

export async function deleteMessageFromFirestore(msgId) {
  await deleteDoc(doc(storeDb, "messages", msgId));
  await deleteDoc(doc(adminDb, "messages", msgId)).catch(() => {});
}

export function subscribeAbout(callback) {
  return onSnapshot(
    doc(storeDb, "settings", "about"),
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

export async function saveAboutToFirestore(aboutData) {
  const payload = { ...aboutData, updatedAt: new Date().toISOString() };
  await setDoc(doc(storeDb, "settings", "about"), payload);
  await setDoc(doc(adminDb, "settings", "about"), payload).catch(() => {});
}

export function subscribeHome(callback) {
  return onSnapshot(
    doc(storeDb, "settings", "home"),
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

export async function saveHomeToFirestore(homeData) {
  const payload = { ...homeData, updatedAt: new Date().toISOString() };
  await setDoc(doc(storeDb, "settings", "home"), payload);
  await setDoc(doc(adminDb, "settings", "home"), payload).catch(() => {});
}

export function subscribeFooter(callback) {
  return onSnapshot(
    doc(storeDb, "settings", "footer"),
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

export async function saveFooterToFirestore(footerData) {
  const payload = { ...footerData, updatedAt: new Date().toISOString() };
  await setDoc(doc(storeDb, "settings", "footer"), payload);
  await setDoc(doc(adminDb, "settings", "footer"), payload).catch(() => {});
}

export function subscribeDeliverySettings(callback) {
  return onSnapshot(
    doc(storeDb, "settings", "delivery"),
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
    doc(storeDb, "settings", "delivery"),
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

export async function setDeliveryEnabledInFirestore(enabled) {
  const delivRef = doc(storeDb, "settings", "delivery");
  let existing = {};
  try {
    const snap = await getDoc(delivRef);
    if (snap.exists()) {
      existing = snap.data();
    }
  } catch (_) {}

  const payload = {
    ...existing,
    enabled: Boolean(enabled),
    wilayas:
      Array.isArray(existing.wilayas) && existing.wilayas.length > 0
        ? existing.wilayas
        : WILAYAS_69,
    updatedAt: new Date().toISOString()
  };
  await setDoc(delivRef, payload);
  await setDoc(doc(adminDb, "settings", "delivery"), payload).catch(() => {});
  return payload;
}

export async function saveDeliveryWilayasToFirestore(wilayasArray, enabledVal) {
  const delivRef = doc(storeDb, "settings", "delivery");
  let currentEnabled = enabledVal;
  if (currentEnabled === undefined) {
    try {
      const snap = await getDoc(delivRef);
      if (snap.exists() && typeof snap.data().enabled === "boolean") {
        currentEnabled = snap.data().enabled;
      } else {
        currentEnabled = false;
      }
    } catch {
      currentEnabled = false;
    }
  }
  const payload = {
    enabled: Boolean(currentEnabled),
    wilayas: wilayasArray,
    updatedAt: new Date().toISOString()
  };
  await setDoc(delivRef, payload);
  await setDoc(doc(adminDb, "settings", "delivery"), payload).catch(() => {});
}

export function compressImageFile(file, maxWidth = 720, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
