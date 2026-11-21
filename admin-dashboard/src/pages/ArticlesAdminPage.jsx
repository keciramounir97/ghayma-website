import React, { useState } from "react";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import {
  Feather,
  Plus,
  Edit3,
  Trash2,
  Heart,
  MessageSquare,
  Clock,
  Calendar,
  Image as ImageIcon,
  Save,
  X,
  Eye,
  CheckCircle2,
  Upload
} from "lucide-react";
import { useAdminContext } from "../context/AdminContext.jsx";
import {
  saveArticleToFirestore,
  deleteArticleFromFirestore,
  deleteArticleComment
} from "../firebase.js";

// Helper image compressor
function compressImage(file, maxWidth = 1000) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ArticlesAdminPage() {
  const {
    articles,
    articleComments,
    dark,
    lang,
    addToast
  } = useAdminContext();

  const [activeTab, setActiveTab] = useState("articles"); // 'articles' | 'comments'
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [titleFr, setTitleFr] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [excerptFr, setExcerptFr] = useState("");
  const [excerptAr, setExcerptAr] = useState("");
  const [contentFr, setContentFr] = useState("");
  const [contentAr, setContentAr] = useState("");
  const [category, setCategory] = useState("Spiritualité & Routine");
  const [readTime, setReadTime] = useState("5 min");
  const [coverImage, setCoverImage] = useState("");
  const [gallery, setGallery] = useState([]);
  const [published, setPublished] = useState(true);

  const handleOpenNew = () => {
    setEditingArticle(null);
    setTitleFr("");
    setTitleAr("");
    setExcerptFr("");
    setExcerptAr("");
    setContentFr("");
    setContentAr("");
    setCategory("Spiritualité & Routine");
    setReadTime("5 min");
    setCoverImage("");
    setGallery([]);
    setPublished(true);
    setEditorOpen(true);
  };

  const handleOpenEdit = (art) => {
    setEditingArticle(art);
    setTitleFr(art.titleFr || "");
    setTitleAr(art.titleAr || "");
    setExcerptFr(art.excerptFr || "");
    setExcerptAr(art.excerptAr || "");
    setContentFr(art.contentFr || "");
    setContentAr(art.contentAr || "");
    setCategory(art.category || "Spiritualité & Routine");
    setReadTime(art.readTime || "5 min");
    setCoverImage(art.coverImage || "");
    setGallery(art.gallery || []);
    setPublished(art.published !== false);
    setEditorOpen(true);
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 1200);
      setCoverImage(dataUrl);
      addToast("Photo de couverture importée avec succès ! 📸");
    } catch {
      addToast("Erreur lors de l'import de la photo", "error");
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      const urls = [];
      for (const f of files) {
        const u = await compressImage(f, 900);
        urls.push(u);
      }
      setGallery((prev) => [...prev, ...urls]);
      addToast(`${urls.length} photos ajoutées à la galerie de l'article ! 🌸`);
    } catch {
      addToast("Erreur lors de l'import des photos", "error");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!titleFr.trim() && !titleAr.trim()) {
      addToast("Veuillez renseigner au moins un titre", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...(editingArticle || {}),
        id: editingArticle?.id || "art-" + Date.now(),
        titleFr: titleFr.trim() || titleAr.trim(),
        titleAr: titleAr.trim() || titleFr.trim(),
        excerptFr: excerptFr.trim(),
        excerptAr: excerptAr.trim(),
        contentFr: contentFr.trim(),
        contentAr: contentAr.trim(),
        category,
        readTime,
        coverImage: coverImage || "/images/book-front.jpg",
        gallery,
        published,
        author: "ghayma_rd (R.Dahmane)",
        date: editingArticle?.date || new Date().toISOString().slice(0, 10),
        likesCount: editingArticle?.likesCount || 0,
        commentsCount: editingArticle?.commentsCount || 0
      };
      await saveArticleToFirestore(payload);
      addToast("Article enregistré et publié sur le site avec succès ! 🌸");
      setEditorOpen(false);
    } catch {
      addToast("Erreur lors de l'enregistrement de l'article", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm("Êtes-vous sûre de vouloir supprimer cet article ?")) return;
    try {
      await deleteArticleFromFirestore(id);
      addToast("Article supprimé avec succès.");
    } catch {
      addToast("Erreur lors de la suppression", "error");
    }
  };

  const handleDeleteComment = async (comId) => {
    if (!window.confirm("Supprimer ce commentaire ?")) return;
    try {
      await deleteArticleComment(comId);
      addToast("Commentaire supprimé.");
    } catch {
      addToast("Erreur lors de la suppression du commentaire", "error");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header */}
      <Card
        elevation={dark ? 5 : 2}
        sx={{
          borderRadius: "28px",
          bgcolor: dark ? "#1a1121" : "#ffffff"
        }}
        className="border border-rose-500/20 p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 shrink-0">
            <Feather className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-rose-50">
              {lang === "ar" ? "إدارة المقالات والخواطر 🌸" : "Gestion des Articles & Blog 🌸"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-rose-200/70 mt-1">
              {lang === "ar"
                ? "انشري مقالات جديدة، أرفقي الصور، وتتبعي تفاعلات وتعليقات القارئات."
                : "Rédigez de nouveaux articles, attachez des photos et gérez les retours des lectrices."}
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-pink-700 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === "ar" ? "مقال جديد" : "Nouvel Article"}</span>
        </button>
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab("articles")}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === "articles"
              ? "bg-rose-500 text-white shadow-md shadow-rose-500/25"
              : dark
              ? "bg-[#1f1326] text-rose-200 hover:bg-rose-950 border border-rose-900/60"
              : "bg-white text-slate-700 hover:bg-rose-50 border border-rose-200"
          }`}
        >
          {lang === "ar" ? "قائمة المقالات" : "Articles Publiés"} ({articles.length})
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === "comments"
              ? "bg-rose-500 text-white shadow-md shadow-rose-500/25"
              : dark
              ? "bg-[#1f1326] text-rose-200 hover:bg-rose-950 border border-rose-900/60"
              : "bg-white text-slate-700 hover:bg-rose-50 border border-rose-200"
          }`}
        >
          {lang === "ar" ? "تعليقات القارئات" : "Commentaires des Lectrices"} ({articleComments.length})
        </button>
      </div>

      {/* TAB 1: ARTICLES LIST */}
      {activeTab === "articles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <Card
              key={art.id}
              elevation={dark ? 4 : 2}
              sx={{
                borderRadius: "28px",
                bgcolor: dark ? "#1a1121" : "#ffffff",
                overflow: "hidden"
              }}
              className="border border-rose-500/20 p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Cover Preview */}
                <div className="relative h-44 rounded-2xl overflow-hidden bg-rose-500/10">
                  <img
                    src={art.coverImage || "/images/book-front.jpg"}
                    alt={art.titleFr}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/90 text-rose-600 shadow-md">
                      {art.category || "Inspiration"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] text-slate-500 dark:text-rose-300/70 flex items-center justify-between">
                    <span>{art.date}</span>
                    <span>{art.readTime || "5 min"}</span>
                  </div>
                  <h3 className="font-editorial text-lg font-bold text-slate-900 dark:text-rose-50 line-clamp-2">
                    {art.titleFr || art.titleAr}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-rose-200/80 line-clamp-2">
                    {art.excerptFr || art.excerptAr}
                  </p>
                </div>
              </div>

              {/* Likes, Comments & Action Buttons */}
              <div className="pt-3 border-t border-rose-500/15 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-rose-200">
                  <span className="flex items-center gap-1 text-rose-500">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>{art.likesCount || 0}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{art.commentsCount || 0}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(art)}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Modifier"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteArticle(art.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 2: COMMENTS MODERATION */}
      {activeTab === "comments" && (
        <Card
          elevation={dark ? 4 : 2}
          sx={{
            borderRadius: "28px",
            bgcolor: dark ? "#1a1121" : "#ffffff"
          }}
          className="border border-rose-500/20 p-6 space-y-4"
        >
          <h2 className="font-editorial text-xl font-bold text-slate-900 dark:text-rose-50">
            {lang === "ar" ? "جميع تعليقات ومشاركات القارئات" : "Tous les Commentaires des Lectrices"}
          </h2>

          <div className="space-y-3">
            {articleComments.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500 dark:text-rose-300/60">
                Aucun commentaire pour le moment.
              </p>
            ) : (
              articleComments.map((com) => (
                <div
                  key={com.id}
                  className={`p-4 rounded-2xl border flex items-start justify-between gap-4 ${
                    dark ? "bg-[#22142a] border-rose-900/50" : "bg-rose-50/60 border-rose-200"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{com.authorAvatar || "🌸"}</span>
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-rose-50">
                        {com.authorName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(com.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-rose-100 ps-6">
                      {com.content}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteComment(com.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/15 transition-colors cursor-pointer shrink-0"
                    title="Supprimer ce commentaire"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* ARTICLE EDITOR MODAL */}
      <Dialog
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "32px",
            bgcolor: dark ? "#190f22" : "#ffffff",
            color: dark ? "#fff1f2" : "#0f172a",
            border: dark ? "1px solid rgba(244,63,94,0.3)" : "1px solid #fecdd3",
            p: { xs: 2.5, sm: 4 }
          }
        }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-rose-500/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center">
              <Feather className="w-5 h-5" />
            </div>
            <h2 className="font-editorial text-xl sm:text-2xl font-bold">
              {editingArticle ? "Modifier l'Article" : "Créer un Nouvel Article"}
            </h2>
          </div>
          <button
            onClick={() => setEditorOpen(false)}
            className="p-2 rounded-full text-rose-500 hover:bg-rose-500/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">Titre (Français) *</label>
              <input
                type="text"
                required
                value={titleFr}
                onChange={(e) => setTitleFr(e.target.value)}
                placeholder="Ex: Bâtir un matin de paix..."
                className={`w-full px-4 py-2.5 rounded-2xl border text-xs sm:text-sm ${
                  dark ? "bg-[#25172d] border-rose-900/60 text-white" : "bg-slate-50 border-rose-200"
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">العنوان (بالعربية)</label>
              <input
                type="text"
                dir="rtl"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: بناء صباح يفيض بالسكينة..."
                className={`w-full px-4 py-2.5 rounded-2xl border text-xs sm:text-sm ${
                  dark ? "bg-[#25172d] border-rose-900/60 text-white" : "bg-slate-50 border-rose-200"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold ${
                  dark ? "bg-[#25172d] border-rose-900/60 text-white" : "bg-slate-50 border-rose-200"
                }`}
              >
                <option value="Spiritualité & Routine">Spiritualité & Routine</option>
                <option value="Parcours Littéraire">Parcours Littéraire</option>
                <option value="Écriture & Poésie">Écriture & Poésie</option>
                <option value="Bien-Être & Sérénité">Bien-Être & Sérénité</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Temps de lecture</label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="Ex: 5 min"
                className={`w-full px-4 py-2.5 rounded-2xl border text-xs sm:text-sm ${
                  dark ? "bg-[#25172d] border-rose-900/60 text-white" : "bg-slate-50 border-rose-200"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Extrait / Résumé (Français)</label>
            <textarea
              rows={2}
              value={excerptFr}
              onChange={(e) => setExcerptFr(e.target.value)}
              placeholder="Courte phrase d'accroche..."
              className={`w-full px-4 py-2 rounded-2xl border text-xs sm:text-sm ${
                dark ? "bg-[#25172d] border-rose-900/60 text-white" : "bg-slate-50 border-rose-200"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Contenu Complet de l'Article (Français) *</label>
            <textarea
              rows={6}
              required
              value={contentFr}
              onChange={(e) => setContentFr(e.target.value)}
              placeholder="Rédigez votre article ici..."
              className={`w-full p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                dark ? "bg-[#25172d] border-rose-900/60 text-white" : "bg-slate-50 border-rose-200"
              }`}
            />
          </div>

          {/* Photo de couverture & Galerie */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-rose-500/15">
            <div>
              <label className="block text-xs font-bold mb-1.5">Photo de Couverture</label>
              <div className="flex items-center gap-3">
                {coverImage && (
                  <img src={coverImage} alt="Cover" className="w-16 h-16 rounded-xl object-cover border" />
                )}
                <label className="px-4 py-2.5 rounded-2xl border border-rose-500/30 text-rose-500 text-xs font-bold cursor-pointer hover:bg-rose-500/10 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Importer Couverture</span>
                  <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">Galerie Photos Complémentaires</label>
              <div className="flex flex-wrap items-center gap-2">
                {gallery.map((img, i) => (
                  <img key={i} src={img} alt="Gal" className="w-12 h-12 rounded-xl object-cover border" />
                ))}
                <label className="px-4 py-2.5 rounded-2xl border border-rose-500/30 text-rose-500 text-xs font-bold cursor-pointer hover:bg-rose-500/10 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Ajouter Photos</span>
                  <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-rose-500/15">
            <button
              type="button"
              onClick={() => setEditorOpen(false)}
              className="px-5 py-2.5 rounded-full border border-slate-300 dark:border-rose-900 text-xs font-bold cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-7 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Enregistrement..." : "Enregistrer & Publier"}</span>
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
