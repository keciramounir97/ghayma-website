# Ghayma RD Bookstore & Author Platform

Official website and admin studio for Algerian author **Roumeyssa Dahmane (رميساء دحمان)**, known as **@ghayma_rd**, and her acclaimed books including *« حياتي بعد الرضا »*.

---

## 🚀 Live Applications

- **Client Store & Author Website:** [https://ghayma-rd-books.web.app](https://ghayma-rd-books.web.app)
- **Admin Studio Dashboard:** [https://admin-ghayma-rd-books.web.app](https://admin-ghayma-rd-books.web.app)

---

## 📁 Repository Structure

```
.
├── frontend/             # Client-facing bookstore and author web app
│   ├── public/           # Static assets, book covers, photos
│   ├── src/
│   │   ├── components/   # UI components (Navbar, Footer, Logo, Modals...)
│   │   ├── context/      # AppContext (Language, Theme, Data)
│   │   ├── data/         # Initial data, translations (AR/FR/EN), 69 Wilayas
│   │   ├── pages/        # Home, Books, Book Details, About, Contact
│   │   ├── store/        # Zustand application store
│   │   └── firebase.js   # Firebase initialization & real-time sync
│   └── package.json
│
├── admin-dashboard/      # Protected administration dashboard
│   ├── public/
│   ├── src/
│   │   ├── components/   # Admin UI, layout, ticket modals
│   │   ├── context/      # AdminContext
│   │   ├── data/         # Translations & 69 Wilayas data
│   │   ├── pages/        # Overview, Orders, Books, Delivery (69 Wilayas), Settings, Section Editors
│   │   ├── store/        # Zustand admin store
│   │   └── firebase.js   # Cloud Firestore synchronization & image compression
│   └── package.json
│
├── images/               # Project images and assets
└── inspiration/          # Design inspiration references
```

---

## ✨ Features

- **Multilingual Support:** Arabic (RTL), French (LTR), and English (LTR).
- **Themes:** Dark and Light mode support with automatic persistence.
- **Algerian Delivery System:** Full coverage across all 69 wilayas with customizable pricing for home delivery (*À la maison*) and agency pickup (*À l'agence*).
- **Settings Toggle:** Delivery fees and options can be enabled/disabled via a single green-check button in the admin dashboard.
- **Order Management:** Interactive order tickets with status tracking (Pending, Confirmed, Shipped, Delivered, Cancelled).
- **Content Management:** Live preview editors for Home Hero, Author Bio, Quotes, Testimonials, and Footer.

---

## 🛠️ Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Admin Dashboard
```bash
cd admin-dashboard
npm install
npm run dev
```

### Build & Deploy
```bash
# Build frontend
cd frontend
npm run build
npx firebase-tools deploy --only hosting --project ghayma-rd-books

# Build admin dashboard
cd ../admin-dashboard
npm run build
npx firebase-tools deploy --only hosting --project admin-ghayma-rd-books
```
