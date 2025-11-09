# Salefni

Plateforme SaaS de simulation et de gestion des demandes de crédit, pensée pour offrir une expérience fluide aux clients comme aux équipes internes. Le front est propulsé par React + Tailwind CSS, tandis que `json-server` fournit une API REST locale pour les environnements de développement.

## Fonctionnalités clés
- Expérience de simulation avancée : mensualité, coût total, TAEG et aperçu du tableau d’amortissement.
- Conversion directe d’une simulation validée en demande de crédit.
- Back-office sécurisé avec authentification, filtres, recherche et priorisation.
- Détail d’une demande enrichi : statut, historique, notes internes et récapitulatif financier.
- Notifications internes générées automatiquement pour les nouvelles demandes.

## Stack technique
- `React 18` + `react-router-dom` pour la navigation et la gestion d’état local.
- `Vite` pour le bundling, la DX et le proxy API.
- `Tailwind CSS` pour le design system et les micro-interactions.
- `json-server` (`db.json`) comme API REST locale (port 3001) et persistance mockée.

## Structure du projet
```
├─ index.html
├─ src
│  ├─ App.jsx                     # Déclaration des routes et layout global
│  ├─ main.jsx                    # Point d'entrée Vite/React
│  ├─ index.css                   # Styles globaux + Tailwind
│  ├─ components/layout           # Layout principal (header/footer)
│  ├─ contexts/AuthContext.jsx    # Gestion de l'authentification admin
│  ├─ pages
│  │  ├─ Home.jsx                 # Landing marketing
│  │  ├─ Simulation.jsx           # Calculateur de crédits
│  │  ├─ Application.jsx          # Formulaire de demande
│  │  └─ admin/                   # Back-office (login, liste, détail)
│  └─ services
│     ├─ api.js                   # Couche d’accès API
│     └─ creditCalculations.js    # Fonctions de calcul (mensualités, TAEG…)
├─ db.json                    # Source de données JSON Server
├─ package.json               # Dépendances & scripts npm
└─ vite.config.js             # Configuration Vite (port 3000, proxy /api)
```

## Prérequis
- Node.js ≥ 18
- npm ≥ 9

## Installation
```bash
npm install
```

## Lancer l’environnement local
1. **API locale** – dans un premier terminal :
   ```bash
   npm run server
   ```
   Le serveur JSON est disponible sur `http://localhost:3001`.

2. **Front-end** – dans un second terminal :
   ```bash
   npm run dev
   ```
   L’interface est accessible sur `http://localhost:3000`. Un proxy Vite est déjà configuré pour rediriger les requêtes `/api` vers le serveur JSON.

## Scripts npm
| Commande          | Description                                   |
|-------------------|-----------------------------------------------|
| `npm run dev`     | Démarre l’application en mode développement.  |
| `npm run build`   | Génère la version de production.              |
| `npm run preview` | Prévisualise le build de production.          |
| `npm run server`  | Lance `json-server` sur `db.json` (port 3001).|

## Points d’attention
- Identifiants d’accès admin par défaut : `admin@selefni.com` / `admin` (configurés dans `db.json`).
- Les données (types de crédit, professions, simulations, demandes, notifications) sont mockées dans `db.json`.
- `AuthContext` gère la session administrateur et la persiste en `localStorage`.
- L’ensemble des calculs financiers est factorisé dans `src/services/creditCalculations.js`.

## Gestion de projet
- La roadmap produit et la planification des sprints sont suivies dans Jira : [Board SEL](https://safaeettalhi1.atlassian.net/jira/software/projects/SEL/boards/101) [[1\]](https://safaeettalhi1.atlassian.net/jira/software/projects/SEL/boards/101)

## API locale (json-server)
- `GET /creditTypes`, `GET /jobs`, `GET /employmentTypes`
- `GET /simulations`, `POST /simulations`
- `GET /applications`, `POST /applications`, `PATCH /applications/:id`
- `GET /notifications`, `POST /notifications`, `PATCH /notifications/:id`
- `GET /admins` (utilisé pour la connexion admin)

## Licence
Projet éducatif. Adapter selon vos besoins avant diffusion.


