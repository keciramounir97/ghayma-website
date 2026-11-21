# 🌸 Documentation Technique & Guide Utilisateur — Frontend Ghayma RD

> **Application Web Officielle de l'Écrivaine ghayma_rd (R.Dahmane) • غيمة (ر. دحمان)**  
> Hébergée en production sur Firebase Hosting : [https://ghayma-rd-books.web.app](https://ghayma-rd-books.web.app)  
> Dépôt Git : `git@github.com:keciramounir97/ghayma-website.git`

---

## 1. Vue d'Ensemble & Identité

Le frontend de **ghayma_rd** est une application web élégante, féminine (*girly stylish*), ultra-réactive et optimisée pour tous les appareils (smartphones Android & iOS, tablettes, iPad, ordinateurs portables, écrans de bureau et Mac).

### 🖋️ Règles de Branding & Naming
- **Nom officiel** : `ghayma_rd` et `R.Dahmane` (en arabe : `غيمة` et `ر. دحمان`).
- **Signature littéraire** : `ghayma_rd (R.Dahmane) • L'Écrivaine` / `ghayma_rd (ر. دحمان) • الكاتبة`.
- **Réseau social principal** : Instagram [@ghayma_rd](https://www.instagram.com/ghayma_rd/).
- **Ouvrage vedette** : *« حياتي بعد الرضا »* (*Ma Vie Après la Satisfaction*), 216 pages, Éditions Ranna.

---

## 2. Architecture Technique

- **Framework** : React 18 avec Vite 6.
- **Gestion d'état global** : Zustand (`src/store/useAppStore.js`) couplé à React Context (`src/context/AppContext.jsx`).
- **Styling** :
  - **Tailwind CSS v4** avec variant sur mesure : `@custom-variant dark (&:where(.dark, .dark *));`.
  - **Material UI (MUI v6)** thématisé pour les tiroirs (`Drawer`), cartes (`Card`), badges (`Chip`, `Badge`) et dialogues (`Dialog`).
  - **Lucide React** pour des icônes douces et vectorielles.
- **Base de données en temps réel** : Google Firebase Firestore (`ghayma-rd-books`).

---

## 3. Pages & Fonctionnalités

### 🏠 1. Page d'Accueil (`HomePage.jsx`)
- **Section Hero** :
  - Accroche littéraire poétique, badges décoratifs avec micro-animations.
  - Image de livre 3D avec ombrage flottant (`animate-float`).
  - Bouton de commande rapide et réassurance (69 wilayas, paiement à la livraison en DZD).
- **Section Présentation de l'Écrivaine** :
  - Biographie inspirante de `ghayma_rd (R.Dahmane)`.
  - Statistiques en direct (livres publiés, milliers de lectrices, note 4.9/5).
- **Vitrine des Livres** :
  - Cartes produits réactives avec note étoiles, prix normal et prix barré en DZD.
- **Bannière de Citation Poétique** :
  - Citation coup de cœur en dégradé rose & or.
- **Témoignages & Avis Lectrices** :
  - Avis vérifiés de lectrices avec wilayas d'Algérie.

---

### 📖 2. Fiche Produit & Commande 69 Wilayas (`BookDetailsPage.jsx`)
- **Galerie d'Images Interactive** :
  - Changement instantané entre la photo de couverture, la 4ème de couverture, les pages intérieures et la vue étagère.
- **Contrôle Dynamique des Frais de Livraison** :
  - **Si le bouton vert est activé côté admin** : le client choisit entre « Livraison à Domicile (À la maison) » et « Récupération en Agence (À l'agence / Stop Desk) » avec calcul immédiat des frais selon sa wilaya parmi les 69 wilayas d'Algérie.
  - **Si le bouton vert est désactivé** : le formulaire masque les modes de livraison et le total est calculé sans frais de livraison (Total = Prix Livre × Quantité).
- **Sélecteur Intelligent des 69 Wilayas d'Algérie** :
  - Code et nom de wilaya (FR/AR) avec suggestion automatique des communes (`<datalist>`).
- **Sécurité & Enregistrement** :
  - Enregistre la commande dans Firestore et génère un ticket de commande numéroté (`#CMD-XXXXX`).

---

### 🌸 3. Page « Ghayma Challenges & Journal » (`GhaymaChallengesPage.jsx`)
Une expérience interactive unique de type Pinterest pour la communauté des lectrices :
- **Minuteurs & Chronos en Direct** :
  - Compte à rebours animé en direct (jours, heures, minutes, secondes) pour les défis 24 heures, hebdomadaires, mensuels ou annuels.
- **Calendrier Interactif (Streak Tracker)** :
  - Calendrier jour par jour (Jour 1 à Jour 30) où chaque lectrice clique pour cocher son accomplissement quotidien. Sauvegarde locale de la progression.
- **Rituels & Habitudes Quotidiennes** :
  - Liste de prompts (ex. 10 minutes de lecture, gratitude, déconnexion).
- **Bouton d'Inscription (« Je participe ✨ »)** :
  - Modal d'inscription rapide (prénom, wilaya, contact optionnel).
  - Déclenche un compteur de clics et d'abonnées enregistré dans Firestore.
- **Moodboard & Journal Style Pinterest** :
  - Cartes visuelles avec photos inspirantes, citations d'écriture, stickers émotionnels (🌸, ✨, 📖, 🕯️, ☕, 🌙).
  - Boutons de réaction interactifs : **Cœur d'Amour ♡** et **Étincelle Magique ✨** synchronisés en direct avec Firestore.

---

### 👤 4. Page « À Propos de l'Écrivaine » (`AboutAuthorPage.jsx`)
- Biographie complète de `ghayma_rd (R.Dahmane)`.
- Liens directs vers Instagram [@ghayma_rd](https://www.instagram.com/ghayma_rd/).
- Galerie de photos et citations inspirantes.

---

### 💌 5. Page Contact (`ContactPage.jsx`)
- Formulaire direct avec validation (Nom, Email/Téléphone, Sujet, Message).
- Stocke les messages dans Firestore pour consultation instantanée dans le tableau de bord admin.

---

## 4. Système Multilingue (i18n) & Thème

| Langue | Direction | Typographie Primaire |
| :--- | :--- | :--- |
| **العربية (Arabe)** | RTL (`dir="rtl"`) | `Tajawal`, `Amiri` |
| **Français** | LTR (`dir="ltr"`) | `Plus Jakarta Sans`, `Cormorant Garamond` |
| **English** | LTR (`dir="ltr"`) | `Plus Jakarta Sans`, `Cormorant Garamond` |

- **Bascule de Thème** :
  - Mode Clair : Fond ivoire poudré `#fffafb`, cartes blanches `#ffffff`, texte ardoise `#0f172a`.
  - Mode Sombre : Fond prune d'obsidienne `#120b16`, cartes nuit `#1a1121`, texte doux `#fff1f2`.

---

## 5. Commandes de Développement & Déploiement

```bash
# Lancer le serveur de développement local
npm run dev

# Compiler pour la production
npm run build

# Déployer sur Firebase Hosting
npx firebase-tools deploy --only hosting
```
