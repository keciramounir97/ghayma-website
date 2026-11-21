import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Minus,
  Plus,
  Home as HomeIcon,
  Building2,
  ShieldCheck
} from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";
import { INITIAL_BOOKS } from "../data/initialData.js";
import {
  WILAYAS_69,
  searchCommunes,
  getCommunesByWilaya,
  getDairasByWilaya,
  getWilayaById
} from "../data/algeriaGeo.js";
import { createOrder } from "../firebase.js";
import { checkRateLimit } from "../utils/rateLimiter.js";

export default function BookDetailsPage() {
  const { id } = useParams();
  const {
    lang,
    t,
    dark,
    books,
    wilayas,
    deliveryEnabled,
    memberDiscount,
    currentUser,
    setAuthModalOpen,
    formatDzd,
    addToast,
    addNotification
  } = useAppContext();

  const book = useMemo(
    () => books.find((b) => b.id === id) || books[0] || INITIAL_BOOKS[0],
    [books, id]
  );

  const gallery = useMemo(() => {
    const arr =
      Array.isArray(book.gallery) && book.gallery.length > 0
        ? book.gallery
        : [book.coverImage || "/images/book-front.jpg"];
    return Array.from(new Set([book.coverImage, ...arr].filter(Boolean)));
  }, [book]);

  const [activeImg, setActiveImg] = useState(gallery[0]);

  useEffect(() => {
    setActiveImg(gallery[0]);
  }, [gallery]);

  const [selectedBookId, setSelectedBookId] = useState(book.id);
  const [quantity, setQuantity] = useState(1);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [selectedWilayaCode, setSelectedWilayaCode] = useState("16");
  const [daira, setDaira] = useState("Hussein Dey");
  const [baladiya, setBaladiya] = useState("Hussein Dey");
  const [postCode, setPostCode] = useState("16017");
  const [communeSuggestions, setCommuneSuggestions] = useState([]);
  const [autoFillNotice, setAutoFillNotice] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState("home");
  const [notes, setNotes] = useState("");
  const [orderConsent, setOrderConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderDone, setOrderDone] = useState(null);

  const handleCommuneInput = (val) => {
    setBaladiya(val);
    if (!val || val.trim().length < 2) {
      setCommuneSuggestions([]);
      return;
    }
    const matches = searchCommunes(val, 8);
    setCommuneSuggestions(matches);
  };

  const handleSelectCommune = (item) => {
    const communeName = lang === "ar" ? item.nameAr || item.nameFr : item.nameFr;
    const dairaName = lang === "ar" ? item.dairaAr || item.dairaFr : item.dairaFr;
    setBaladiya(communeName);
    setDaira(dairaName);
    setPostCode(item.postCode || "");
    setSelectedWilayaCode(item.wilayaCode);
    setCommuneSuggestions([]);
    setAutoFillNotice(
      lang === "ar"
        ? `✓ تم التحديد التلقائي: ولاية ${item.wilayaNameAr} (${item.wilayaCode}) • دائرة ${dairaName}`
        : `✓ Rempli automatiquement : ${item.wilayaNameFr} (${item.wilayaCode}) • Daïra : ${dairaName}`
    );
  };

  useEffect(() => {
    setSelectedBookId(book.id);
  }, [book.id]);

  const orderedBook = useMemo(
    () => books.find((b) => b.id === selectedBookId) || book,
    [books, selectedBookId, book]
  );

  const selectedWilaya = useMemo(
    () =>
      wilayas.find((w) => String(w.code) === String(selectedWilayaCode)) ||
      wilayas[15] ||
      WILAYAS_69[15],
    [wilayas, selectedWilayaCode]
  );

  const deliveryFee = useMemo(() => {
    if (!deliveryEnabled) return 0;
    if (!selectedWilaya) return 600;
    return deliveryType === "home"
      ? Number(selectedWilaya.homePrice) || 600
      : Number(selectedWilaya.agencyPrice) || 400;
  }, [deliveryEnabled, selectedWilaya, deliveryType]);

  const booksSubtotal = (Number(orderedBook.price) || 1500) * quantity;
  const isMember = Boolean(currentUser);
  const discountPercent =
    isMember && memberDiscount?.enabled !== false
      ? Number(memberDiscount?.discountPercent) || 5
      : 0;
  const memberDiscountAmount = Math.round(booksSubtotal * (discountPercent / 100));
  const discountedSubtotal = booksSubtotal - memberDiscountAmount;
  const totalAmount = deliveryEnabled
    ? discountedSubtotal + deliveryFee
    : discountedSubtotal;

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !baladiya.trim() || !address.trim()) {
      addToast(
        lang === "ar"
          ? "يرجى ملء جميع الحقول المطلوبة لتأكيد الطلب"
          : "Veuillez remplir tous les champs obligatoires",
        "error"
      );
      return;
    }

    if (!orderConsent) {
      addToast(
        lang === "ar"
          ? "يرجى الموافقة على شروط الطلب وسياسة الخصوصية للمتابعة"
          : "Veuillez accepter les conditions de commande pour continuer",
        "error"
      );
      return;
    }

    const rateCheck = checkRateLimit("order");
    if (!rateCheck.allowed) {
      addToast(rateCheck.message, "error");
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        bookId: orderedBook.id,
        bookTitle: orderedBook.title,
        bookCover: orderedBook.coverImage || "/images/book-front.jpg",
        bookUnitPrice: Number(orderedBook.price) || 1500,
        quantity: Number(quantity) || 1,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        wilayaCode: selectedWilaya.code,
        wilayaNameFr: selectedWilaya.nameFr,
        wilayaNameAr: selectedWilaya.nameAr,
        wilayaLabel: `${selectedWilaya.code} - ${selectedWilaya.nameFr} (${selectedWilaya.nameAr})`,
        daira: daira.trim(),
        baladiya: baladiya.trim(),
        postCode: postCode.trim(),
        address: address.trim(),
        deliveryMethod: deliveryEnabled ? deliveryType : "standard",
        deliveryMethodLabel: deliveryEnabled
          ? deliveryType === "home"
            ? "À la maison (للمنزل)"
            : "À l'agence (للوكالة/المكتب)"
          : "Standard",
        deliveryAgency: deliveryEnabled
          ? selectedWilaya.agency || "Yalidine Express"
          : "Standard",
        deliveryFee: deliveryEnabled ? deliveryFee : 0,
        isMember,
        memberEmail: currentUser?.email || null,
        memberDiscountPercent: discountPercent,
        memberDiscountAmount,
        originalSubtotal: booksSubtotal,
        subtotal: isMember ? discountedSubtotal : booksSubtotal,
        totalPrice: totalAmount,
        currency: "DZD",
        notes: notes.trim()
      };

      const orderId = await createOrder(orderPayload);
      setOrderDone({ id: orderId, ...orderPayload });
      addToast(t.orderForm.orderSuccessTitle);
      addNotification(
        `تم تسجيل طلبكِ لكتاب «${orderedBook.title}» (${totalAmount} د.ج) بنجاح! 🌸`,
        `Votre commande pour « ${orderedBook.title} » (${totalAmount} DZD) a été enregistrée ! 🌸`,
        `Your order for "${orderedBook.title}" (${totalAmount} DZD) has been placed! 🌸`
      );
    } catch (err) {
      console.error("Order error:", err);
      addToast("Error submitting order, please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const title =
    lang === "ar"
      ? book.title
      : lang === "fr"
      ? book.titleFr || book.title
      : book.titleEn || book.title;
  const subtitle =
    lang === "ar"
      ? book.subtitle
      : lang === "fr"
      ? book.subtitleFr || book.subtitle
      : book.subtitleEn || book.subtitle;
  const desc =
    lang === "ar"
      ? book.description
      : lang === "fr"
      ? book.descriptionFr || book.description
      : book.descriptionEn || book.description;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16">
      {/* Top Product Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left: Interactive Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <Card
            elevation={dark ? 6 : 2}
            sx={{
              borderRadius: "28px",
              bgcolor: dark ? "#1a1121" : "#fff1f2"
            }}
            className="aspect-[3/3.6] overflow-hidden border border-rose-500/20 flex items-center justify-center p-3 sm:p-4"
          >
            <img
              src={activeImg}
              alt={title}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-xl transition-all duration-300"
            />
          </Card>

          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
              {gallery.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImg(imgUrl)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImg === imgUrl
                      ? "border-rose-500 scale-105 shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${title} preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Book Details & Synopsis */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Chip
              label={book.badge || "Best Seller ✨"}
              color="primary"
              size="small"
              sx={{ fontWeight: 800 }}
            />
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 text-xs font-bold">
              {book.inStock !== false
                ? t.booksSection.inStock
                : t.booksSection.outOfStock}
            </span>
            <span className="text-xs opacity-70 font-medium">
              {book.author || "ghayma_rd (ر. دحمان) (@ghayma_rd)"}
            </span>
          </div>

          <div>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold">
              {title}
            </h1>
            <p className="text-sm sm:text-lg text-rose-500 font-medium mt-2">
              {subtitle}
            </p>
          </div>

          <div
            className={`inline-flex items-baseline gap-4 px-5 sm:px-6 py-3 rounded-2xl border ${
              dark
                ? "bg-[#211429] border-rose-900/50"
                : "bg-rose-50/80 border-rose-200/70"
            }`}
          >
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-500">
              {formatDzd(book.price)}
            </span>
            {book.oldPrice > book.price && (
              <span className="text-sm sm:text-base line-through opacity-50">
                {formatDzd(book.oldPrice)}
              </span>
            )}
          </div>

          {book.quote && (
            <blockquote
              className={`p-4 sm:p-5 rounded-2xl border-s-4 border-rose-500 italic text-xs sm:text-base ${
                dark ? "bg-[#1c1223] text-rose-200" : "bg-rose-50/60 text-rose-950"
              }`}
            >
              {book.quote}
            </blockquote>
          )}

          <div className="space-y-2">
            <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-rose-500">
              {t.booksSection.synopsis}
            </h3>
            <p
              className={`text-xs sm:text-base leading-relaxed whitespace-pre-line ${
                dark ? "text-rose-100/85" : "text-slate-700"
              }`}
            >
              {desc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div
              className={`p-3.5 rounded-2xl border ${
                dark ? "bg-[#1b1122] border-rose-950" : "bg-white border-rose-100"
              }`}
            >
              <span className="opacity-60 block">{t.booksSection.publisher}</span>
              <span className="font-bold mt-0.5 block">
                {book.publisher || "مؤسسة رنة للنشر والتوزيع"}
              </span>
            </div>
            <div
              className={`p-3.5 rounded-2xl border ${
                dark ? "bg-[#1b1122] border-rose-950" : "bg-white border-rose-100"
              }`}
            >
              <span className="opacity-60 block">{t.booksSection.pages}</span>
              <span className="font-bold mt-0.5 block">
                {book.pages || 216} {t.booksSection.pages}
              </span>
            </div>
            <div
              className={`p-3.5 rounded-2xl border ${
                dark ? "bg-[#1b1122] border-rose-950" : "bg-white border-rose-100"
              }`}
            >
              <span className="opacity-60 block">{t.booksSection.language}</span>
              <span className="font-bold mt-0.5 block">
                {book.language || "العربية"}
              </span>
            </div>
          </div>

          <a
            href="#direct-order-form"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-500/25 hover:opacity-95 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{t.orderForm.title}</span>
          </a>
        </div>
      </div>

      {/* DIRECT 69-WILAYA ORDER FORM */}
      <div
        id="direct-order-form"
        className={`rounded-3xl border p-5 sm:p-8 lg:p-10 shadow-2xl ${
          dark
            ? "bg-gradient-to-br from-[#1d1224] to-[#150d1b] border-rose-900/60"
            : "bg-gradient-to-br from-white via-rose-50/30 to-pink-50/40 border-rose-200"
        }`}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-2 mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold">
              <Truck className="w-3.5 h-3.5" />
              <span>69 Wilayas • Paiement à la livraison (DZD)</span>
            </span>
            <h2 className="font-editorial text-2xl sm:text-4xl font-bold">
              {t.orderForm.title}
            </h2>
            <p className={`text-xs sm:text-sm ${dark ? "text-rose-200/75" : "text-slate-600"}`}>
              {t.orderForm.subtitle}
            </p>
          </div>

          {orderDone ? (
            <div
              className={`p-6 sm:p-8 rounded-3xl border text-center space-y-5 ${
                dark
                  ? "bg-emerald-950/30 border-emerald-700/50"
                  : "bg-emerald-50/80 border-emerald-200"
              }`}
            >
              <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-emerald-500 mx-auto" />
              <h3 className="text-xl sm:text-2xl font-bold">
                {t.orderForm.orderSuccessTitle}
              </h3>
              <p className="text-xs sm:text-sm max-w-md mx-auto opacity-85">
                {t.orderForm.orderSuccessMsg}
              </p>
              <div
                className={`max-w-md mx-auto p-4 rounded-2xl text-xs sm:text-sm space-y-1.5 text-start ${
                  dark ? "bg-[#1a1120]" : "bg-white"
                }`}
              >
                <div className="flex justify-between gap-2">
                  <span className="opacity-70">{t.orderForm.selectedBook}:</span>
                  <span className="font-bold">
                    {orderDone.bookTitle} (x{orderDone.quantity})
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="opacity-70">{t.orderForm.fullName}:</span>
                  <span className="font-bold">{orderDone.clientName}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="opacity-70">{t.orderForm.wilaya}:</span>
                  <span className="font-bold">
                    {orderDone.wilayaLabel} — {orderDone.baladiya}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="opacity-70">{t.orderForm.deliveryMethod}:</span>
                  <span className="font-bold">
                    {orderDone.deliveryMethodLabel} ({orderDone.deliveryAgency})
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-rose-500/20 text-base font-extrabold text-rose-500">
                  <span>{t.orderForm.totalPrice}:</span>
                  <span>{formatDzd(orderDone.totalPrice)}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setOrderDone(null);
                  setClientName("");
                  setClientPhone("");
                  setAddress("");
                  setNotes("");
                }}
                className="px-6 py-3 rounded-full bg-rose-500 text-white text-xs sm:text-sm font-bold hover:bg-rose-600 transition-all cursor-pointer"
              >
                {t.orderForm.newOrder}
              </button>
            </div>
          ) : (
            <form onSubmit={handleOrderSubmit} className="space-y-5 sm:space-y-6">
              {/* Book Selector & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold mb-2">
                    {t.orderForm.selectedBook} *
                  </label>
                  <select
                    value={selectedBookId}
                    onChange={(e) => setSelectedBookId(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      dark
                        ? "bg-[#25172e] border-rose-900/60 text-white"
                        : "bg-white border-rose-200 text-slate-800"
                    }`}
                  >
                    {books.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title} — {formatDzd(b.price)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2">
                    {t.orderForm.quantity} *
                  </label>
                  <div
                    className={`flex items-center justify-between px-3 py-2 rounded-2xl border ${
                      dark
                        ? "bg-[#25172e] border-rose-900/60"
                        : "bg-white border-rose-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-extrabold text-base">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-1.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Client Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2">
                    {t.orderForm.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder={t.orderForm.fullNamePlaceholder}
                    className={`w-full px-4 py-3 rounded-2xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      dark
                        ? "bg-[#25172e] border-rose-900/60 text-white"
                        : "bg-white border-rose-200 text-slate-800"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2">
                    {t.orderForm.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder={t.orderForm.phonePlaceholder}
                    className={`w-full px-4 py-3 rounded-2xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      dark
                        ? "bg-[#25172e] border-rose-900/60 text-white"
                        : "bg-white border-rose-200 text-slate-800"
                    }`}
                  />
                </div>
              </div>

              {/* Dynamic 69 Wilayas, Daïra & Commune Selector with Instant Auto-Fill */}
              <div className="space-y-4">
                {autoFillNotice && (
                  <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                      <span>{autoFillNotice}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setAutoFillNotice("")}
                      className="text-xs opacity-60 hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Wilaya Selector */}
                  <div>
                    <label className="block text-xs font-bold mb-1.5">
                      {t.orderForm.wilaya} (69) *
                    </label>
                    <select
                      value={selectedWilayaCode}
                      onChange={(e) => {
                        setSelectedWilayaCode(e.target.value);
                        setAutoFillNotice("");
                      }}
                      className={`w-full px-3.5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        dark
                          ? "bg-[#25172e] border-rose-900/60 text-white"
                          : "bg-white border-rose-200 text-slate-800"
                      }`}
                    >
                      {wilayas
                        .filter((w) => w.active !== false)
                        .map((w) => (
                          <option key={w.code} value={w.code}>
                            {w.code} - {w.nameFr} ({w.nameAr})
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Daïra (Auto-filled / Dynamic) */}
                  <div>
                    <label className="block text-xs font-bold mb-1.5">
                      {lang === "ar" ? "الدائرة (Daïra) *" : "Daïra *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={daira}
                      onChange={(e) => setDaira(e.target.value)}
                      placeholder={lang === "ar" ? "مثال: حسين داي" : "Ex: Hussein Dey"}
                      className={`w-full px-3.5 py-3 rounded-2xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        dark
                          ? "bg-[#25172e] border-rose-900/60 text-white"
                          : "bg-white border-rose-200 text-slate-800"
                      }`}
                    />
                  </div>

                  {/* Commune / Baladiya with Instant Auto-complete */}
                  <div className="relative">
                    <label className="block text-xs font-bold mb-1.5">
                      {t.orderForm.baladiya} *
                    </label>
                    <input
                      type="text"
                      required
                      value={baladiya}
                      onChange={(e) => handleCommuneInput(e.target.value)}
                      placeholder={
                        lang === "ar"
                          ? "اكتبي البلدية (مثلاً: حسين داي)"
                          : "Tapez votre commune (ex: Hussein Dey)..."
                      }
                      className={`w-full px-3.5 py-3 rounded-2xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        dark
                          ? "bg-[#25172e] border-rose-900/60 text-white"
                          : "bg-white border-rose-200 text-slate-800"
                      }`}
                    />

                    {/* Interactive Dropdown Suggestions */}
                    {communeSuggestions.length > 0 && (
                      <div
                        className={`absolute z-30 left-0 right-0 mt-1.5 max-h-56 overflow-y-auto rounded-2xl border shadow-2xl p-1.5 space-y-1 ${
                          dark
                            ? "bg-[#1f1326] border-rose-900/80 text-rose-50"
                            : "bg-white border-rose-200 text-slate-800"
                        }`}
                      >
                        <div className="px-2.5 py-1 text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                          {lang === "ar"
                            ? "اضغطي لملء الولاية والدائرة تلقائياً:"
                            : "Cliquez pour remplir automatiquement :"}
                        </div>
                        {communeSuggestions.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleSelectCommune(item)}
                            className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors flex items-center justify-between ${
                              dark
                                ? "hover:bg-rose-950/60 text-rose-100"
                                : "hover:bg-rose-50 text-slate-800"
                            }`}
                          >
                            <div>
                              <span className="font-extrabold text-rose-600 dark:text-rose-400">
                                {item.nameFr} ({item.nameAr})
                              </span>
                              <div className="text-[11px] opacity-70">
                                Daïra: {item.dairaFr} ({item.dairaAr})
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-500">
                              {item.wilayaCode} - {item.wilayaNameFr}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Full Street Address */}
              <div>
                <label className="block text-xs font-bold mb-2">
                  {t.orderForm.address} *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t.orderForm.addressPlaceholder}
                  className={`w-full px-4 py-3 rounded-2xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                    dark
                      ? "bg-[#25172e] border-rose-900/60 text-white"
                      : "bg-white border-rose-200 text-slate-800"
                  }`}
                />
              </div>

              {/* Delivery Type: À la maison vs À l'agence (Only shown if deliveryEnabled is true in settings) */}
              {deliveryEnabled && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-bold">
                      {t.orderForm.deliveryMethod} *
                    </label>
                    <span className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      {t.orderForm.deliveryAgency}:{" "}
                      <strong>{selectedWilaya?.agency || "Yalidine Express"}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setDeliveryType("home")}
                      className={`p-4 rounded-2xl border-2 text-start transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        deliveryType === "home"
                          ? "border-rose-500 bg-rose-500/10 shadow-md"
                          : dark
                          ? "border-rose-950 bg-[#25172e]/60 opacity-75 hover:opacity-100"
                          : "border-rose-100 bg-white opacity-80 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
                          <HomeIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs sm:text-sm truncate">
                            {t.orderForm.homeDelivery}
                          </div>
                          <div className="text-[11px] opacity-70 truncate">
                            {selectedWilaya?.agency || "Yalidine Express"}
                          </div>
                        </div>
                      </div>
                      <span className="font-extrabold text-rose-500 text-xs sm:text-base shrink-0">
                        {formatDzd(selectedWilaya?.homePrice || 600)}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType("agency")}
                      className={`p-4 rounded-2xl border-2 text-start transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        deliveryType === "agency"
                          ? "border-rose-500 bg-rose-500/10 shadow-md"
                          : dark
                          ? "border-rose-950 bg-[#25172e]/60 opacity-75 hover:opacity-100"
                          : "border-rose-100 bg-white opacity-80 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs sm:text-sm truncate">
                            {t.orderForm.agencyDelivery}
                          </div>
                          <div className="text-[11px] opacity-70 truncate">
                            {selectedWilaya?.agency || "Yalidine Express"}
                          </div>
                        </div>
                      </div>
                      <span className="font-extrabold text-rose-500 text-xs sm:text-base shrink-0">
                        {formatDzd(selectedWilaya?.agencyPrice || 400)}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Optional Dedication Note */}
              <div>
                <label className="block text-xs font-bold mb-2">
                  {t.orderForm.notes}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.orderForm.notesPlaceholder}
                  className={`w-full px-4 py-3 rounded-2xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                    dark
                      ? "bg-[#25172e] border-rose-900/60 text-white"
                      : "bg-white border-rose-200 text-slate-800"
                  }`}
                />
              </div>

              {/* Member Discount Incentive Banner */}
              {isMember && memberDiscount?.enabled !== false ? (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm shadow-emerald-500/30">
                      %{discountPercent}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-extrabold text-emerald-800 dark:text-emerald-300">
                        {lang === "ar"
                          ? memberDiscount?.bannerTextAr || "تم تطبيق خصم 5% الخاص بعضوات مجتمع غيمة على طلبكِ! ✨"
                          : lang === "en"
                          ? memberDiscount?.bannerTextEn || "5% logged-in member discount applied to your order! 🌸"
                          : memberDiscount?.bannerTextFr || "Remise membre connecté de 5% appliquée sur votre commande ! 🌸"}
                      </div>
                      <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400 font-medium">
                        {lang === "ar"
                          ? `حساب العضوة: ${currentUser?.name || currentUser?.email}`
                          : `Compte membre : ${currentUser?.name || currentUser?.email}`}
                      </div>
                    </div>
                  </div>
                  <Chip
                    size="small"
                    label={`${discountPercent}% OFF`}
                    sx={{
                      bgcolor: "#10b981",
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: "10px"
                    }}
                  />
                </div>
              ) : memberDiscount?.enabled !== false ? (
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 border-dashed flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    dark
                      ? "bg-rose-950/20 border-rose-800/60 text-rose-100"
                      : "bg-rose-50/70 border-rose-300 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center text-sm shrink-0">
                      🌸
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold">
                        {lang === "ar"
                          ? `خصم ${memberDiscount?.discountPercent || 5}% فوري عند تسجيل الدخول!`
                          : `Bénéficiez de ${memberDiscount?.discountPercent || 5}% de remise immédiate !`}
                      </div>
                      <div className="text-[11px] opacity-75">
                        {lang === "ar"
                          ? "تطلبين كزائرة. يمكنكِ تسجيل الدخول للاستفادة من الخصم، أو إكمال الطلب كزائرة بحرية."
                          : "Vous commandez en tant qu'invité(e). Connectez-vous pour activer la remise ou commandez librement."}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-md shadow-rose-500/25 transition-all cursor-pointer shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === "ar" ? "تسجيل الدخول للخصم" : "Se connecter (-5%)"}</span>
                  </button>
                </div>
              ) : null}

              {/* Live Price Calculation Summary Box */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 ${
                  dark
                    ? "bg-[#261730] border-rose-800/50"
                    : "bg-rose-50/90 border-rose-200"
                }`}
              >
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="opacity-75">
                    {t.orderForm.booksSubtotal} ({quantity} ×{" "}
                    {formatDzd(orderedBook.price)}):
                  </span>
                  <span className="font-bold">{formatDzd(booksSubtotal)}</span>
                </div>

                {isMember && memberDiscountAmount > 0 && (
                  <div className="flex justify-between text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-extrabold animate-in fade-in">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {lang === "ar"
                          ? `خصم العضوة المسجلة (-${discountPercent}%):`
                          : `Remise Membre Connecté (-${discountPercent}%):`}
                      </span>
                    </span>
                    <span>- {formatDzd(memberDiscountAmount)}</span>
                  </div>
                )}

                {deliveryEnabled && (
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="opacity-75">
                      {t.orderForm.deliveryFee} ({selectedWilaya?.code} -{" "}
                      {selectedWilaya?.nameFr} •{" "}
                      {deliveryType === "home" ? "À la maison" : "À l'agence"}):
                    </span>
                    <span className="font-bold">{formatDzd(deliveryFee)}</span>
                  </div>
                )}

                <div className="border-t border-rose-500/20 pt-2.5 flex justify-between items-center text-sm sm:text-lg font-extrabold text-rose-500">
                  <span>{t.orderForm.totalPrice}:</span>
                  <span>{formatDzd(totalAmount)}</span>
                </div>
              </div>

              {/* Explicit Order Consent (Prompt One Requirement #6) */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="orderConsent"
                  checked={orderConsent}
                  onChange={(e) => setOrderConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-rose-300 text-rose-500 focus:ring-rose-400 cursor-pointer"
                />
                <label htmlFor="orderConsent" className="text-xs text-slate-600 dark:text-rose-200/80 cursor-pointer leading-relaxed">
                  {lang === "ar" ? (
                    <>
                      أوافق على{" "}
                      <Link to="/terms" target="_blank" className="text-rose-500 underline font-semibold">
                        شروط الاستخدام
                      </Link>{" "}
                      (الدفع عند الاستلام DZD)، وعلى معالجة بياناتي للشحن وفقاً لـ{" "}
                      <Link to="/privacy" target="_blank" className="text-rose-500 underline font-semibold">
                        سياسة الخصوصية
                      </Link>
                      .
                    </>
                  ) : (
                    <>
                      J'accepte les{" "}
                      <Link to="/terms" target="_blank" className="text-rose-500 underline font-semibold">
                        Conditions Générales
                      </Link>{" "}
                      (Paiement à la livraison) et le traitement de mes données pour l'expédition selon la{" "}
                      <Link to="/privacy" target="_blank" className="text-rose-500 underline font-semibold">
                        Politique de Confidentialité
                      </Link>
                      .
                    </>
                  )}
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-rose-500/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? t.orderForm.submitting : t.orderForm.submitOrder}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

