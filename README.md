# Artify — React + Vite

Live demo: https://artify-store.netlify.app/

Artify is a responsive React app (Vite) for browsing, adding, and favoriting artworks. This README highlights the most important features and quick steps to run the project locally.

Important features

- Live demo deployed on Netlify (link above)
- Responsive gallery with artwork cards and details view
- Add Artwork page (create new artwork entries)
- Favorites: save artworks you like
- Authentication (Login / Register) using Firebase (see `src/firebase/config.js`)
- Private routes for protected pages (`routes/PrivateRoute.jsx`)
- Theme switcher (light/dark) and UI components: slider, featured artworks

Project layout (key files)

- `src/pages/` — main pages: `Home`, `Explore`, `Gallery`, `AddArtwork`, `Details`, `Favorites`, `Login`, `Register`
- `src/components/` — reusable UI parts: `NavBar`, `Slider`, `FeaturedArtworks`, `ThemeSwitcher`, `Footer`
- `src/providers/AuthProvider.jsx` — authentication context
- `src/firebase/config.js` — Firebase settings (ensure your own .env keys for local dev)
- `routes/PrivateRoute.jsx` — protects routes that need auth

Quick start (local)

1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Open the app in your browser (usually http://localhost:5173)

Build for production

```bash
npm run build
npm run preview
```

Notes and assumptions

- The project uses Firebase for backend features (auth/read/write). For local dev, set your Firebase config in environment variables or `src/firebase/config.js` as appropriate.
- The live demo is deployed at the Netlify URL above. If you update environment-dependent features, redeploy to Netlify for the changes to appear.

Contributing / next steps

- Add more tests for pages and components.
- Add CI (lint, test, build) and a deploy pipeline if needed.

Thanks for checking out Artify — try the live demo and run locally to explore the app!

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
