# 🛡️ Documentation Technique & Guide Administrateur — Admin Studio Ghayma RD

> **Panneau d'Administration Officiel pour ghayma_rd (R.Dahmane)**  
> Hébergé en production sur Firebase Hosting : [https://admin-ghayma-rd-books.web.app](https://admin-ghayma-rd-books.web.app)  
> Identifiants d'accès : `ghaymard@admin.dz` / `adminghaymard`

---

## 1. Vue d'Ensemble & Fonctionnalités Clés

Le studio d'administration permet à l'auteure `ghayma_rd (R.Dahmane)` et à son équipe de gérer l'intégralité du site vitrine et de la boutique en temps réel :
1. **Gestion des Commandes des 69 Wilayas** avec modal ticket interactif.
2. **Gestion du Catalogue de Livres** (titres, résumés multilingues, photos, prix, stocks).
3. **Bouton Coché Vert pour l'Activation des Tarifs de Livraison** et configuration des 69 Wilayas.
4. **Gestion des Défis Ghayma (Challenges)** (24h, semaine, mois, annuel ou personnalisé).
5. **Blog Pinterest & Publication d'Inspirations** avec compteurs de réactions (Cœurs, Étincelles).
6. **Statistiques en Temps Réel** : visiteuses du site, clics sur les défis, abonnées inscrites, chiffre d'affaires DZD.
7. **Éditeurs avec Aperçu en Direct** pour la section Hero, la page À Propos, les avis et le Footer.
8. **Boîte de Réception des Messages Contact**.

---

## 2. Architecture & Double Synchronisation Firestore

L'administration est reliée simultanément à deux projets Firebase Firestore :
- **`storeDb` (`ghayma-rd-books`)** : La base de données en direct du site public. Toute modification effectuée depuis l'admin s'applique immédiatement pour les visiteurs.
- **`adminDb` (`admin-ghayma-rd-books`)** : La base miroir dédiée à la persistance et à la sécurisation des données administratives et des comptes d'accès.

---

## 3. Guide Page par Page

### 📊 1. Vue d'Ensemble (`OverviewPage.jsx`)
- Cartes KPI réactives :
  - **Total Commandes** (avec montant total du chiffre d'affaires en DZD).
  - **Livres Publiés** dans le catalogue.
  - **Messages Non Lus** du formulaire de contact.
  - **Wilayas Actives** sur les 69 wilayas algériennes.
- Raccourcis directs vers les éditeurs visuels avec aperçu en direct.

---

### 📦 2. Commandes Clients (`OrdersPage.jsx`)
- **Affichage Adaptatif Intelligent** :
  - **Sur Ordinateur (Desktop)** : Tableau Material complet avec colonnes Ticket, Livre, Client, Wilaya, Mode de livraison, Total DZD, Statut et Actions.
  - **Sur Smartphone & Tablette** : Cartes tactiles interactives au format ticket (`#CMD-XXXXX`). Un simple toucher ouvre le **Modal Ticket de Commande**.
- **Modal Ticket (`OrderTicketModal.jsx`)** :
  - Impression directe du ticket pour le colis.
  - Modification du statut de commande : *En attente*, *Confirmée*, *Expédiée*, *Livrée*, *Annulée*.
  - Bouton d'appel téléphonique direct et suppression sécurisée.

---

### 📚 3. Gestion des Livres (`BooksPage.jsx`)
- Permet d'ajouter ou modifier un ou plusieurs livres.
- **Téléversement & Optimisation d'Images** :
  - Les photos sont automatiquement redimensionnées et compressées en Canvas JPEG haute fidélité côté client avant sauvegarde, évitant tout souci de quota ou de CORS.
- Champs multilingues complets : Titre (AR/FR/EN), Sous-titre, Synopsis, Citation poétique, Prix DZD, Ancien Prix, Nombre de pages, ISBN, Maison d'édition, Catégorie et Badge.

---

### 🚚 4. Paramètres & Tarifs de Livraison (`SettingsPage.jsx` & `DeliveryWilayasPage.jsx`)

#### Le Bouton Coché Vert :
- **Si Coché en Vert (ACTIVÉ)** :
  - La page des tarifs des 69 Wilayas est active.
  - Les clientes voient sur la fiche produit le choix entre **Livraison à Domicile (À la maison)** et **Récupération en Agence (À l'agence / Stop Desk)**.
  - Le calcul des frais de livraison s'effectue automatiquement selon la wilaya choisie et s'ajoute au total.
- **Si Non Coché (DÉSACTIVÉ - الوضع الافتراضي)** :
  - Le choix entre domicile et agence est masqué aux clientes.
  - Aucun frais de livraison n'est calculé ni affiché dans le total (Total = Prix Livre × Quantité).
- **Remplissage Rapide en Vrac** :
  - Permet d'appliquer en un clic une agence par défaut (ex. *Yalidine Express*) et des prix standards pour les 69 wilayas avant d'ajuster individuellement.

---

### 🌸 5. Gestion des Défis Ghayma & Blog Visuel (`ChallengesAdminPage.jsx`)
- **Onglet 1 : Tableau des Défis** :
  - Création de défis avec type au choix : **24 Heures Chrono**, **1 Semaine**, **1 Mois**, **1 An (Annuel)** ou **Dates Personnalisées**.
  - Interrupteur pour activer le **Compte à Rebours (Minuteur/Chrono)**.
  - Interrupteur pour activer le **Calendrier Interactif Jour par Jour**.
  - Définition de la liste des rituels et habitudes quotidiens.
- **Onglet 2 : Publication dans le Blog Pinterest / Journal** :
  - Rédaction de pensées, citations, coulisses d'écriture.
  - Sélection de stickers émojis (🌸, ✨, 📖, 🕯️, ☕, 🌙).
  - Téléversement de photos et ajout de hashtags.
  - Suivi des compteurs d'amour (Cœurs) et d'inspiration (Étincelles).
- **Onglet 3 : Répertoire des Abonnées** :
  - Liste nominative de toutes les lectrices inscrites aux défis avec leur prénom, leur wilaya, leur contact et leur date d'inscription.

---

### ✍️ 6. Éditeurs de Contenu avec Aperçu en Direct
- **Hero Accueil (`HeroEditorPage.jsx`)** : Titres poétiques, badges, boutons d'action et aperçu 3D.
- **Section L'Écrivaine (`AboutEditorPage.jsx`)** : Biographie de `ghayma_rd (R.Dahmane)`, photo portrait, liens Instagram et statistiques.
- **Sections Accueil & Avis (`HomeSectionsEditorPage.jsx`)** : Bannière de citation poétique et gestion des avis vérifiés de lectrices.
- **Pied de Page (`FooterEditorPage.jsx`)** : Ruban d'annonce, coordonnées de contact, réseaux sociaux et mentions légales.

---

### 📬 7. Boîte de Messages (`MessagesPage.jsx`)
- Réception en temps réel des messages envoyés depuis la page Contact du site public avec modal ticket de lecture et actions rapides.

---

## 4. Maintenance & Déploiement

```bash
# Lancer le tableau de bord en local
cd admin-dashboard
npm run dev

# Compiler pour la production
npm run build

# Déployer sur Firebase Hosting
npx firebase-tools deploy --only hosting
```
