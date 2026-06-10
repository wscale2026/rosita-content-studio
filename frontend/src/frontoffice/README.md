# Intégration du Front-Office (Espace pour le Collègue)

Ce dossier est le **point de chute** ("drop zone") pour le travail de votre collègue.

Puisque le but est de **facilement réutiliser ses composants et informations** dans le Back-Office (et inversement), il est impératif que son code soit intégré à l'intérieur du projet React existant, plutôt que d'être un projet totalement séparé qui bloquerait le partage.

## ⚠️ Instructions pour le collègue (Lors de l'importation de son code)

Quand tu auras terminé de développer le front-office de ton côté, voici comment importer ton code ici **sans casser le projet principal** :

### 1. CE QU'IL FAUT COPIER ICI :
Prends uniquement le contenu de ton dossier `src/` (ou l'équivalent où se trouvent tes composants) et colle-le dans ce dossier (`frontend/src/frontoffice/`).
- ✅ Tes composants (ex: `Header.tsx`, `HeroSection.tsx`)
- ✅ Tes pages (ex: `Home.tsx`, `About.tsx`)
- ✅ Tes hooks, utils, et fichiers CSS.

### 2. CE QU'IL NE FAUT ABSOLUMENT PAS COPIER :
Ne remplace pas les fichiers de configuration du projet principal. **Ne copie pas** les fichiers suivants ici :
- ❌ `package.json` ou `package-lock.json`
- ❌ `node_modules/`
- ❌ `vite.config.ts` ou `tsconfig.json`
- ❌ `index.html`

### 3. GESTION DES DÉPENDANCES (Packages NPM)
Si, de ton côté, tu as installé de nouvelles librairies (par exemple `framer-motion`, `axios`, ou une librairie de slider), **transmets simplement la liste de ces librairies à ton collègue** (qui gère le back-office). Il se chargera de faire un `npm install` sur le projet global pour que ton code fonctionne parfaitement.

---

## 🛠️ Pourquoi procéder ainsi ?

En mettant tout le code front-office dans `src/frontoffice/` :
1. **Partage facile** : Le Back-Office pourra importer une carte ou un bouton du Front-Office avec un simple `import { Card } from './frontoffice/components/Card'`.
2. **Même Build** : Un seul projet Vite à faire tourner (`npm run dev`) et à héberger.
3. **Même Design System** : Vous partagez la même configuration Tailwind et les mêmes couleurs définies dans le projet principal.
