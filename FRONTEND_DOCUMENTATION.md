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

## 2. Nouvelles Fonctionnalités Majeures

### 📰 1. Journal & Articles de Blog (`/articles` & `/articles/:id`)
- **Catalogue des Articles** :
  - Filtres thématiques interactifs : *Tous*, *Spiritualité & Routine*, *Parcours Littéraire*, *Écriture & Poésie*.
  - Cartes élégantes avec photo de couverture, temps de lecture estimé, date de publication, compteurs de mentions J'aime et de commentaires.
- **Fiche Détails de l'Article** :
  - Lecture immersive grand format avec typographie soignée et mise en page éditoriale.
  - **Galerie Photos Complémentaire** : grille de clichés haute résolution attachés à l'article avec zoom plein écran (lightbox).
  - **Bouton J'aime Interactif** : incrémentation en temps réel dans Firebase Firestore avec persistance locale pour éviter les doubles clics.
  - **Espace Commentaires en Direct** :
    - Liste des commentaires en temps réel avec pseudo, avatar girly choisi et date.
    - Formulaire de publication instantané (accessible aux membres connectés et en mode invité).

### 🔐 2. Espace Membre & Authentification Lectrice (`AuthModal.jsx`)
- Inscription et connexion douces et sans friction :
  - Nom / Pseudo littéraire, Adresse Email, Mot de passe et Wilaya.
  - **Sélecteur d'Avatar Girly** : 🌸, 🌺, ✨, 🌙, 📖, ☕, 🕊️, 🪞.
  - Bouton d'accès rapide en 1 clic pour tester immédiatement sans attente.
- Affichage du profil dans la barre de navigation et le tiroir hamburger mobile.

### 🌙 3. Grand Défi Spirituel : Prière du Fajr jusqu'à fin Novembre (`/challenges`)
- **Accès Réservé aux Membres** :
  - Les visiteuses non connectées découvrent une carte d'accueil invitant à créer leur compte en 1 clic.
- **Compte à Rebours en Direct** :
  - Minuteur interactif (Jours, Heures, Minutes, Secondes) jusqu'au 30 novembre 2026 à minuit.
- **Intégration de l'API Aladhan (Horaires de Prière en Algérie)** :
  - Calcul en direct des 5 prières quotidiennes (Fajr, Chourouk, Dhuhr, Asr, Maghrib, Isha) selon la wilaya choisie (Alger, Oran, Constantine, Batna, Sétif...).
  - Mise en évidence de la prière du Fajr.
- **Notifications & Rappels Push (Web Push API)** :
  - Bouton d'activation des notifications système dans le navigateur (`Notification.requestPermission()`).
  - Bouton de test immédiat déclenchant un doux rappel sonore et visuel sur l'appareil.
- **Suivi d'Habitudes & Tâches Personnalisées** :
  - Les membres peuvent écrire leurs propres routines du matin (ex. *« 10 min de dhikr »*, *« Boire un verre d'eau tiède »*).
  - Liste de contrôle à cocher avec persistance locale et progression en pourcentage.
- **Calendrier des 30 Jours de Novembre** :
  - Pastilles circulaires interactives pour marquer chaque jour de Fajr accompli.

### 📍 4. Autocomplétion Dynamique des 69 Wilayas, Daïras et 1541 Communes
- Alimenté par le jeu de données officiel d'Algérie (`https://github.com/keciramounir97/wilayas-dairas-communes-api`).
- Dans le formulaire de commande :
  - L'utilisatrice commence à taper sa commune (ex. *« Hussein Dey »*).
  - Un menu déroulant suggère instantanément les communes correspondantes.
  - Dès la sélection, les champs **Wilaya (16 - Alger)**, **Daïra (Hussein Dey)** et **Code Postal (16017)** se remplissent automatiquement !
  - Les tarifs de livraison (Yalidine Express / ZR Express) et agences associées se synchronisent immédiatement.

### 🔔 5. Système de Notifications & Toasts
- **Toasts Flottants** :
  - Disparition automatique après 4,5 secondes.
  - Bouton de fermeture directe `✕` sur le corps de chaque notification.
  - **Double-clic pour fermer** immédiatement n'importe quelle notification.
- **Menu Déroulant de Notifications (Cloche Navbar)** :
  - Historique des notifications d'accueil, confirmations de commande et rappels.
  - Possibilité de marquer comme lu ou d'effacer l'historique.

---

## 3. Architecture Technique

- **Framework** : React 19 avec Vite 6.
- **Gestion d'état global** : Zustand (`src/store/useAppStore.js`) couplé à React Context (`src/context/AppContext.jsx`).
- **Styling** : Tailwind CSS v4, Material UI (MUI v6) thématisé, animations de pétales flottants (`animate-petal`).
- **Base de données temps réel** : Google Firebase Firestore (`ghayma-rd-books`).

---

## 4. Déploiement

```bash
# Compilation de production
npm run build

# Déploiement Hosting
npx firebase-tools deploy --only hosting
```
