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
  onSnapshot
} from "firebase/firestore";
import {
  INITIAL_BOOKS,
  INITIAL_ABOUT,
  INITIAL_HOME,
  INITIAL_FOOTER
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
