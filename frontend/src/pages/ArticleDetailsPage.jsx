import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import {
  Heart,
  MessageSquare,
  Clock,
  Calendar,
  Share2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Send,
  Feather,
  CheckCircle2,
  User,
  Image as ImageIcon
} from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";
import {
  subscribeArticle,
  subscribeArticleComments,
  addArticleComment,
  toggleLikeArticle
} from "../firebase.js";

export default function ArticleDetailsPage() {
  const { id } = useParams();
  const { articles, lang, dark, currentUser, setAuthModalOpen, addToast } = useAppContext();

  const initialFound = articles.find((a) => a.id === id) || null;
  const [article, setArticle] = useState(initialFound);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liked, setLiked] = useState(() => {
    return localStorage.getItem(`ghayma_liked_${id}`) === "true";
  });
  const [activePhotoModal, setActivePhotoModal] = useState(null);

  const isRtl = lang === "ar";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (!id) return;
    const unsubArt = subscribeArticle(id, (data) => {
      if (data) setArticle(data);
    });
    const unsubCom = subscribeArticleComments(id, (comms) => {
      setComments(comms || []);
    });
    return () => {
      unsubArt && unsubArt();
      unsubCom && unsubCom();
    };
  }, [id]);

  const handleLike = async () => {
    const res = await toggleLikeArticle(id, currentUser?.id);
    setLiked(res.liked);
    localStorage.setItem(`ghayma_liked_${id}`, String(res.liked));
    addToast(
      res.liked
        ? lang === "ar"
          ? "شكراً على إعجابكِ اللطيف! تم تسجيل محبتكِ للمقال ♡"
          : "Merci pour votre mention J'aime ! Votre soutien compte énormément ♡"
        : lang === "ar"
        ? "تم إلغاء الإعجاب بالمقال"
        : "Mention J'aime retirée"
    );
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const authorName = currentUser?.name || guestName.trim() || (lang === "ar" ? "قارئة غيمة" : "Lectrice Ghayma");
    const authorAvatar = currentUser?.avatar || "🌸";

    setSubmittingComment(true);
    try {
      await addArticleComment(id, {
        authorId: currentUser?.id || null,
        authorName,
        authorAvatar,
        content: commentText.trim()
      });
      setCommentText("");
      addToast(
        lang === "ar"
          ? "تم نشر تعليقكِ اللطيف بنجاح! شكراً على مشاركتكِ 🌸"
          : "Votre commentaire a été publié avec succès ! Merci pour votre partage 🌸"
      );
    } catch {
      addToast("Erreur lors de l'envoi du commentaire", "error");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.titleFr || "Article Ghayma",
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast(
        lang === "ar"
          ? "تم نسخ رابط المقال للمشاركة بنجاح! 🌸"
          : "Lien de l'article copié dans le presse-papier ! 🌸"
      );
    }
  };

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Sparkles className="w-8 h-8 text-rose-500 animate-spin" />
        <p className="text-sm font-bold text-slate-600 dark:text-rose-200">
          {lang === "ar" ? "جاري تحميل المقال..." : "Chargement de l'article..."}
        </p>
      </div>
    );
  }

  const title =
    lang === "ar"
      ? article.titleAr || article.titleFr
      : lang === "fr"
      ? article.titleFr
      : article.titleEn || article.titleFr;

  const content =
    lang === "ar"
      ? article.contentAr || article.contentFr
      : lang === "fr"
      ? article.contentFr
      : article.contentEn || article.contentFr;

  return (
    <div className="relative min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Floating Flowers in background */}
      <div className="absolute top-20 right-4 text-3xl opacity-30 select-none pointer-events-none">
        🌸
      </div>
      <div className="absolute top-80 left-4 text-2xl opacity-25 select-none pointer-events-none">
        ✨
      </div>

      {/* Back button */}
      <div>
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-all text-xs font-bold"
        >
          <BackArrow className="w-4 h-4" />
          <span>{lang === "ar" ? "العودة إلى المقالات" : "Retour aux articles"}</span>
        </Link>
      </div>

      {/* Article Header Card */}
      <Card
        elevation={dark ? 4 : 2}
        sx={{
          borderRadius: "32px",
          bgcolor: dark ? "#1a1121" : "#ffffff",
          overflow: "hidden"
        }}
        className="border border-rose-500/20 p-6 sm:p-10 space-y-6"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
              {article.category || "Inspiration"}
            </span>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-rose-300/70 font-semibold">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                <span>{article.readTime || "5 min"}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                <span>{article.date}</span>
              </span>
            </div>
          </div>

          <h1 className="font-editorial text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-rose-50 leading-tight">
            {title}
          </h1>

          {/* Author Badge */}
          <div className="flex items-center justify-between pt-2 border-t border-rose-500/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center shadow-md shadow-rose-500/20 font-bold">
                <Feather className="w-5 h-5 -rotate-12" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-rose-50">
                  {article.author || "ghayma_rd (R.Dahmane)"}
                </div>
                <div className="text-[11px] text-rose-500 font-semibold">
                  @ghayma_rd • Auteure de « Ma Vie Après la Satisfaction »
                </div>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-full border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
              title="Partager cet article"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Big Cover Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl max-h-[460px] bg-rose-500/10">
          <img
            src={article.coverImage || "/images/book-spread.jpg"}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Full Rich Content */}
        <div className="prose dark:prose-invert max-w-none space-y-5 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-rose-100 font-normal">
          {content.split("\n\n").map((para, idx) => (
            <p key={idx} className="leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {/* Gallery / Extra Pictures Posted With the Article */}
        {article.gallery && article.gallery.length > 0 && (
          <div className="pt-6 border-t border-rose-500/15 space-y-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400">
              <ImageIcon className="w-4 h-4" />
              <span>
                {lang === "ar"
                  ? "معرض صور المقال (اضغطي للتكبير) 📸"
                  : "Photos & Ambiance de l'Article (Cliquez pour agrandir) 📸"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {article.gallery.map((photo, i) => (
                <div
                  key={i}
                  onClick={() => setActivePhotoModal(photo)}
                  className="relative rounded-2xl overflow-hidden h-32 sm:h-40 border border-rose-500/20 cursor-pointer group shadow-sm"
                >
                  <img
                    src={photo}
                    alt={`Galerie ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Reaction & Engagement Bar */}
        <div className="pt-6 border-t border-rose-500/15 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer shadow-md ${
              liked
                ? "bg-rose-500 text-white scale-105 shadow-rose-500/35"
                : dark
                ? "bg-[#25172d] text-rose-300 hover:bg-rose-950 border border-rose-900/60"
                : "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${liked ? "fill-white text-white" : "text-rose-500"}`}
            />
            <span>
              {liked
                ? lang === "ar"
                  ? "أحببتِ هذا المقال ♡"
                  : "Vous aimez cet article ♡"
                : lang === "ar"
                ? "أعجبني المقال ♡"
                : "J'aime cet article ♡"}
            </span>
            <span className="ms-1 px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold">
              {article.likesCount || 0}
            </span>
          </button>

          <span className="text-xs text-slate-500 dark:text-rose-300/70 font-semibold flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-rose-500" />
            <span>
              {comments.length}{" "}
              {lang === "ar" ? "تعليقات ومشاركات" : "Commentaires & Échanges"}
            </span>
          </span>
        </div>
      </Card>

      {/* COMMENTS & INTERACTION SECTION */}
      <Card
        id="comments-section"
        elevation={dark ? 4 : 2}
        sx={{
          borderRadius: "32px",
          bgcolor: dark ? "#1a1121" : "#ffffff"
        }}
        className="border border-rose-500/20 p-6 sm:p-10 space-y-6"
      >
        <div className="space-y-1">
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-rose-50 flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-rose-500" />
            <span>
              {lang === "ar"
                ? "مساحة التعليقات وتبادل الخواطر 🌸"
                : "Commentaires & Échanges de Cœur 🌸"}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-rose-200/70">
            {lang === "ar"
              ? "شاركينا أثر هذه الكلمات على روحكِ، أو تجربتكِ مع الروتين الصباحي وقراءة كتب غيمة."
              : "Partagez vos impressions, vos pensées ou votre expérience de lecture avec l'auteure et la communauté."}
          </p>
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} className="space-y-3.5">
          {!currentUser && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
              <span className="text-xs text-rose-600 dark:text-rose-300 font-semibold">
                {lang === "ar"
                  ? "انضمي بعضوية غيمة للتعليق بهويتكِ وأيقونتكِ المفضلة ✨"
                  : "Connectez-vous pour commenter avec votre avatar girly et rejoindre les défis ✨"}
              </span>
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-colors shrink-0 cursor-pointer shadow-sm"
              >
                {lang === "ar" ? "تسجيل الدخول / حساب جديد" : "Connexion / Créer un Compte"}
              </button>
            </div>
          )}

          {!currentUser && (
            <div>
              <input
                type="text"
                placeholder={lang === "ar" ? "اسمكِ أو لقبكِ الأدبي" : "Votre Prénom ou Pseudo"}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  dark
                    ? "bg-[#25172d] border-rose-900/60 text-white placeholder-rose-300/40"
                    : "bg-slate-50 border-rose-200 text-slate-900"
                }`}
              />
            </div>
          )}

          <div className="relative">
            <textarea
              required
              rows={3}
              placeholder={
                lang === "ar"
                  ? "اكتبي كلماتكِ الطيبة هنا بكل حب وصدق..."
                  : "Laissez votre doux mot ici pour ghayma_rd et les lectrices..."
              }
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className={`w-full p-4 rounded-2xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed ${
                dark
                  ? "bg-[#25172d] border-rose-900/60 text-white placeholder-rose-300/40"
                  : "bg-slate-50 border-rose-200 text-slate-900"
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={submittingComment || !commentText.trim()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-500/25 cursor-pointer disabled:opacity-60 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>
              {submittingComment
                ? lang === "ar"
                  ? "جاري النشر..."
                  : "Publication..."
                : lang === "ar"
                ? "نشر التعليق 🌸"
                : "Envoyer mon commentaire 🌸"}
            </span>
          </button>
        </form>

        {/* Existing Comments List */}
        <div className="space-y-3.5 pt-4 border-t border-rose-500/15">
          {comments.length === 0 ? (
            <p className="text-center py-8 text-xs sm:text-sm text-slate-500 dark:text-rose-300/60">
              {lang === "ar"
                ? "كوني أول من يضع بصمتها الدافئة بتعليق هنا ♡"
                : "Soyez la première à laisser un mot doux sur cet article ♡"}
            </p>
          ) : (
            comments.map((com) => (
              <div
                key={com.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  dark
                    ? "bg-[#211428] border-rose-900/50 text-rose-50"
                    : "bg-rose-50/60 border-rose-200/80 text-slate-800"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-300 text-white flex items-center justify-center text-sm shadow-xs font-bold">
                      {com.authorAvatar || "🌸"}
                    </div>
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-rose-50">
                      {com.authorName}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 dark:text-rose-300/50">
                    {new Date(com.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-rose-100 ps-10">
                  {com.content}
                </p>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Photo Lightbox Modal */}
      {activePhotoModal && (
        <div
          onClick={() => setActivePhotoModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl">
            <img
              src={activePhotoModal}
              alt="Aperçu"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
