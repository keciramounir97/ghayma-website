# 🛡️ Documentation Technique & Guide Administrateur — Admin Studio Ghayma RD

> **Panneau d'Administration Officiel pour ghayma_rd (R.Dahmane)**  
> Hébergé en production sur Firebase Hosting : [https://admin-ghayma-rd-books.web.app](https://admin-ghayma-rd-books.web.app)  
> Identifiants d'accès : `ghaymard@admin.dz` / `adminghaymard`

---

## 1. Vue d'Ensemble & Fonctionnalités Clés

Le studio d'administration permet à l'auteure `ghayma_rd (R.Dahmane)` et à son équipe de gérer l'intégralité du site vitrine et de la boutique en temps réel :
1. **Gestion des Commandes des 69 Wilayas** avec modal ticket interactif.
2. **Gestion du Catalogue de Livres** (titres, résumés multilingues, photos, prix, stocks).
3. **Gestion des Articles de Blog & Récits** (`ArticlesAdminPage.jsx`) avec import de photos multiples et galerie.
4. **Modération des Commentaires des Lectrices** sur les articles de blog.
5. **Bouton Coché Vert pour l'Activation des Tarifs de Livraison** et configuration des 69 Wilayas.
6. **Gestion des Défis Ghayma (Challenges)** avec modèles prêts en 1 clic (Prière du Fajr fin Novembre, 24h Détox, 30 jours gratitude).
7. **Blog Pinterest & Publication d'Inspirations** avec compteurs de réactions (Cœurs, Étincelles).
8. **Statistiques en Temps Réel** : visiteuses du site, clics sur les défis, abonnées inscrites, chiffre d'affaires DZD.
9. **Éditeurs avec Aperçu en Direct** pour la section Hero, la page À Propos, les avis et le Footer.
10. **Boîte de Réception des Messages Contact**.

---

## 2. Architecture & Double Synchronisation Firestore

L'administration est reliée simultanément à deux projets Firebase Firestore :
- **`storeDb` (`ghayma-rd-books`)** : La base de données en direct du site public. Toute modification effectuée depuis l'admin s'applique immédiatement pour les visiteurs.
- **`adminDb` (`admin-ghayma-rd-books`)** : La base miroir dédiée à la persistance et à la sécurisation des données administratives et des comptes d'accès.

---

## 3. Guide des Nouvelles Pages & Outils

### ✍️ 1. Gestion des Articles de Blog (`ArticlesAdminPage.jsx`)
- **Nouvel Article / Édition** :
  - Titre (Français & Arabe), Catégorie (*Spiritualité & Routine*, *Parcours Littéraire*, *Écriture & Poésie*), Temps de lecture estimé.
  - Extrait accrocheur et Contenu complet éditorial.
  - **Import de Couverture** : Compression automatique à la volée en Canvas JPEG.
  - **Galerie Photos Multiples** : Possibilité d'attacher plusieurs photos d'ambiance à l'article.
  - Interrupteur Publié / Brouillon.
- **Modération des Commentaires** :
  - Onglet dédié répertoriant tous les avis et commentaires laissés par les lectrices avec leur pseudo et avatar.
  - Suppression immédiate en 1 clic pour maintenir un espace bienveillant.

### 🏆 2. Gestion des Défis Ghayma & Templates Prêts (`ChallengesAdminPage.jsx`)
- **Modèles Prêts en 1 Clic (Templates)** :
  - 🤲 **Prière du Fajr (Fin Novembre)** : pré-remplit les titres, les habitudes clés, le compte à rebours et le calendrier 30 jours.
  - ⚡ **24h Chrono Détox** : pré-remplit le défi court avec minuteur actif.
  - 🌸 **30 Jours de Gratitude** : pré-remplit les rituels de satisfaction quotidienne.
- **Indicateurs Clés en Direct** :
  - Nombre total d'abonnées au défi, clics générés, taux d'engagement.
- **Annuaire des Abonnées** :
  - Liste des lectrices inscrites avec nom, wilaya et date.

### ⚙️ 3. Contrôle des Frais de Livraison & Simulation Client (`SettingsPage.jsx`)
- Bouton tactile clair et vert contrasté pour activer ou masquer instantanément les options de livraison à domicile et en agence.
- Résolution complète des contrastes en mode blanc et sombre.

---

## 4. Déploiement

```bash
# Compilation de production
npm run build

# Déploiement Hosting
npx firebase-tools deploy --only hosting
```
