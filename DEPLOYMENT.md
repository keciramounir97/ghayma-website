# Blue-Green & Zero-Downtime Deployment Strategy for Ghayma RD

This document details the release, blue-green deployment, and rollback strategy implemented for the Ghayma RD ecosystem (Public Site & Admin Dashboard) hosted on Firebase Hosting.

---

## 1. Architecture Overview

- **Public Production (Green)**: `https://ghayma-rd-books.web.app` (Target: `ghayma-rd-books`)
- **Admin Production (Green)**: `https://admin-ghayma-rd-books.web.app` (Target: `admin-ghayma-rd-books`)
- **Staging / Preview Channels (Blue)**:
  - Frontend: `firebase hosting:channel:deploy staging`
  - Admin: `firebase hosting:channel:deploy staging`

---

## 2. Blue-Green Workflow

1. **Step 1: Build & Validate**
   - Run production optimized Vite build with tree-shaking, code-splitting, and asset hashing.
   ```bash
   npm run build
   ```
2. **Step 2: Deploy to Blue Channel (Preview / Staging)**
   - Deploys the new version to an isolated URL without touching live user traffic:
   ```bash
   firebase hosting:channel:deploy staging --expires 7d
   ```
3. **Step 3: Verification & Automated Smoke Testing**
   - Verify HTTP 200, CSP security headers, asset loading, Firestore read/write permissions, and order placement on the staging URL.
4. **Step 4: Atomic Switch to Green (Live Production)**
   - Clone or promote the preview version to live channel instantaneously with zero downtime:
   ```bash
   firebase hosting:clone ghayma-rd-books:staging ghayma-rd-books:live
   ```
   Or deploy directly:
   ```bash
   firebase deploy --only hosting
   ```
5. **Step 5: Instant Rollback Capability**
   - Firebase Hosting stores versioned releases. In case of anomaly:
   ```bash
   firebase hosting:rollback
   ```

---

## 3. Database & Rules Versioning
- Firestore security rules are version-controlled in `firestore.rules`.
- Firestore composite indexes are version-controlled in `firestore.indexes.json`.
