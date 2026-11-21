import React, { useState } from "react";
import Card from "@mui/material/Card";
import { Plus, X, Upload, Save, Edit3, Trash2 } from "lucide-react";
import { useAdminContext } from "../context/AdminContext.jsx";
import {
  saveBookToFirestore,
  deleteBookFromFirestore,
  compressImageFile
} from "../firebase.js";

export default function BooksPage() {
  const { t, dark, books, formatDzd, addToast } = useAdminContext();

  const emptyBook = {
    id: "",
    title: "",
    titleFr: "",
    titleEn: "",
    subtitle: "",
    subtitleFr: "",
    subtitleEn: "",
    author: "ghayma_rd (ر. دحمان) (ghayma_rd)",
    publisher: "مؤسسة رنة للنشر والتوزيع والطباعة",
    price: 1500,
    oldPrice: 1850,
    pages: 216,
    isbn: "",
    category: "تطوير الذات / سرد وجداني",
    badge: "Nouveau ✨",
    coverImage: "/images/book-front.jpg",
    gallery: ["/images/book-front.jpg"],
    quote: "",
    description: "",
    descriptionFr: "",
    descriptionEn: "",
    inStock: true,
    featured: false
  };

  const [editingBook, setEditingBook] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 720, 0.82);
      setEditingBook((prev) => ({
        ...prev,
        coverImage: dataUrl,
        gallery: [dataUrl, ...(prev.gallery || []).filter((g) => g !== dataUrl)]
      }));
      addToast("Cover picture uploaded & optimized ✨");
    } catch {
      addToast("Failed to process image", "error");
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      const compressed = [];
      for (const file of files) {
        const dataUrl = await compressImageFile(file, 720, 0.8);
        compressed.push(dataUrl);
      }
      setEditingBook((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...compressed]
      }));
      addToast(`${compressed.length} gallery image(s) added ✨`);
    } catch {
      addToast("Error uploading gallery image", "error");
    }
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    if (!editingBook.title.trim()) return;
    setSaving(true);
    try {
      await saveBookToFirestore(editingBook);
      addToast(t.books.savedToast);
      setEditingBook(null);
    } catch {
      addToast("Error saving book", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <Card
        elevation={dark ? 5 : 2}
        sx={{
          borderRadius: "28px",
          bgcolor: dark ? "#1a1121" : "#ffffff"
        }}
        className="border border-rose-500/20 p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold">
            {t.books.title}
          </h2>
          <p className="text-xs sm:text-sm opacity-75 mt-1">
            {t.books.subtitle}
          </p>
        </div>

        <button
          onClick={() =>
            setEditingBook({
              ...emptyBook,
              id: "book-" + Date.now()
            })
          }
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-500/25 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.books.addBookBtn}</span>
        </button>
      </Card>

      {editingBook && (
        <form
          onSubmit={handleSaveBook}
          className={`rounded-3xl border p-5 sm:p-8 space-y-6 shadow-2xl ${
            dark
              ? "bg-[#201329] border-rose-500/40"
              : "bg-white border-rose-200"
          }`}
        >
          <div className="flex items-center justify-between border-b border-rose-500/15 pb-4">
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-rose-500">
              {books.some((b) => b.id === editingBook.id)
                ? t.books.editBookTitle
                : t.books.newBookTitle}
            </h3>
            <button
              type="button"
              onClick={() => setEditingBook(null)}
              className="p-2 rounded-full hover:bg-rose-500/10 text-rose-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                {t.books.bookTitleAr} *
              </label>
              <input
                type="text"
                required
                value={editingBook.title}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, title: e.target.value })
                }
                className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm ${
                  dark
                    ? "bg-[#2a1936] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">
                {t.books.bookTitleFr}
              </label>
              <input
                type="text"
                value={editingBook.titleFr || ""}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, titleFr: e.target.value })
                }
                className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm ${
                  dark
                    ? "bg-[#2a1936] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">
                {t.books.bookTitleEn}
              </label>
              <input
                type="text"
                value={editingBook.titleEn || ""}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, titleEn: e.target.value })
                }
                className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm ${
                  dark
                    ? "bg-[#2a1936] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                {t.books.subtitleAr}
              </label>
              <input
                type="text"
                value={editingBook.subtitle || ""}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, subtitle: e.target.value })
                }
                className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm ${
                  dark
                    ? "bg-[#2a1936] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                {t.books.subtitleFr}
              </label>
              <input
                type="text"
                value={editingBook.subtitleFr || ""}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    subtitleFr: e.target.value
                  })
                }
                className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm ${
                  dark
                    ? "bg-[#2a1936] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                {t.books.subtitleEn}
              </label>
              <input
                type="text"
                value={editingBook.subtitleEn || ""}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    subtitleEn: e.target.value
                  })
                }
                className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm ${
                  dark
                    ? "bg-[#2a1936] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                {t.books.priceDzd} *
              </label>
              <input
                type="number"
                required
                value={editingBook.price}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    price: Number(e.target.value)
                  })
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold text-rose-500 ${
                  dark
                    ? "bg-[#2a1936] border-rose-900/60"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">
                {t.books.oldPriceDzd}
              </label>
              <input
                type="number"
                value={editingBook.oldPrice || 0}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    oldPrice: Number(e.target.value)
                  })
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm ${
                  dark
                    ? "bg-[#2a1936] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">
                {t.books.pages}
              </label>
              <input
                type="number"
                value={editingBook.pages || 200}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    pages: Number(e.target.value)
                  })
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm ${
                  dark
                    ? "bg-[#2a1936] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">
                {t.books.publisher}
              </label>
              <input
                type="text"
                value={editingBook.publisher || ""}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, publisher: e.target.value })
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm ${
                  dark
                    ? "bg-[#2a1936] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold mb-1.5">
                {t.books.badge}
              </label>
              <input
                type="text"
                value={editingBook.badge || ""}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, badge: e.target.value })
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm ${
                  dark
                    ? "bg-[#2a1936] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`p-4 rounded-2xl border space-y-3 ${
                dark
                  ? "bg-[#261731] border-rose-900/50"
                  : "bg-rose-50/40 border-rose-200"
              }`}
            >
              <label className="block text-xs font-bold">
                {t.books.coverUpload}
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={editingBook.coverImage || "/images/book-front.jpg"}
                  alt="Cover preview"
                  className="w-20 h-28 rounded-xl object-cover border-2 border-rose-500 shadow shrink-0"
                />
                <div className="flex-1 space-y-2 min-w-0">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold cursor-pointer hover:bg-rose-600 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={editingBook.coverImage || ""}
                    onChange={(e) =>
                      setEditingBook({
                        ...editingBook,
                        coverImage: e.target.value
                      })
                    }
                    placeholder="Or paste image URL..."
                    className={`w-full px-3 py-1.5 rounded-lg border text-xs ${
                      dark
                        ? "bg-[#1d1126] border-rose-900 text-white"
                        : "bg-white border-rose-200"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border space-y-3 ${
                dark
                  ? "bg-[#261731] border-rose-900/50"
                  : "bg-rose-50/40 border-rose-200"
              }`}
            >
              <label className="block text-xs font-bold">
                {t.books.galleryUpload}
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {(editingBook.gallery || []).map((gUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group w-14 h-16 rounded-lg overflow-hidden border border-rose-400"
                  >
                    <img
                      src={gUrl}
                      alt="Gallery"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditingBook({
                          ...editingBook,
                          gallery: editingBook.gallery.filter(
                            (_, i) => i !== idx
                          )
                        })
                      }
                      className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <label className="w-14 h-16 rounded-lg border-2 border-dashed border-rose-400 flex flex-col items-center justify-center text-rose-500 cursor-pointer hover:bg-rose-500/10">
                  <Plus className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                {t.books.descAr}
              </label>
              <textarea
                rows={5}
                value={editingBook.description || ""}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    description: e.target.value
                  })
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs leading-relaxed ${
                  dark
                    ? "bg-[#2a1936] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">
                {t.books.descFr}
              </label>
              <textarea
                rows={5}
                value={editingBook.descriptionFr || ""}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    descriptionFr: e.target.value
                  })
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs leading-relaxed ${
                  dark
                    ? "bg-[#2a1936] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">
                {t.books.descEn}
              </label>
              <textarea
                rows={5}
                value={editingBook.descriptionEn || ""}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    descriptionEn: e.target.value
                  })
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs leading-relaxed ${
                  dark
                    ? "bg-[#2a1936] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingBook(null)}
              className="px-6 py-3 rounded-full border border-rose-500/30 text-xs font-bold cursor-pointer"
            >
              {t.books.cancel}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs sm:text-sm font-bold shadow-lg cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t.books.saveBook}</span>
            </button>
          </div>
        </form>
      )}

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {books.map((book) => (
          <Card
            key={book.id}
            elevation={dark ? 5 : 2}
            sx={{
              borderRadius: "28px",
              bgcolor: dark ? "#1a1121" : "#ffffff"
            }}
            className="border border-rose-500/20 p-5 sm:p-6 flex flex-col xs:flex-row items-center gap-5"
          >
            <img
              src={book.coverImage || "/images/book-front.jpg"}
              alt={book.title}
              className="w-28 h-40 rounded-2xl object-cover shadow-md shrink-0"
            />
            <div className="flex-1 space-y-2 min-w-0 text-center xs:text-start">
              <div className="flex items-center justify-center xs:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-500 text-[11px] font-bold">
                  {book.badge || "Book"}
                </span>
                <span className="text-xs font-extrabold text-rose-500">
                  {formatDzd(book.price)}
                </span>
              </div>
              <h3 className="font-editorial text-xl sm:text-2xl font-bold truncate">
                {book.title}
              </h3>
              <p className="text-xs opacity-75 line-clamp-2">{book.subtitle}</p>
              <div className="flex items-center justify-center xs:justify-start gap-2 pt-2">
                <button
                  onClick={() => setEditingBook(book)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500 text-white text-xs font-bold cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                {books.length > 1 && (
                  <button
                    onClick={async () => {
                      await deleteBookFromFirestore(book.id);
                      addToast("Book removed");
                    }}
                    className="p-2 rounded-full text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

