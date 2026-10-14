import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import './styles/base.css';
import './styles/landing.css';
import './styles/legal.css';

import { StrictMode, lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

/**
 * One bundle entry for every page. Each HTML file names its page on <body>,
 * and only that page's code is fetched — the legal pages never download the
 * landing page's demos, and vice versa.
 */
// The entry file renders pages; it has nothing for Fast Refresh to preserve.
// eslint-disable-next-line react-refresh/only-export-components
const PAGES: Record<string, LazyExoticComponent<ComponentType>> = {
  home: lazy(() => import('./landing/Landing')),
  privacy: lazy(() => import('./legal/Privacy')),
  terms: lazy(() => import('./legal/Terms')),
  support: lazy(() => import('./legal/Support')),
  'child-safety': lazy(() => import('./legal/ChildSafety')),
  'delete-account': lazy(() => import('./legal/DeleteAccount')),
  'not-found': lazy(() => import('./NotFound')),
};

const Page = PAGES[document.body.dataset.page ?? 'home'] ?? PAGES['not-found'];

const app = (
  <StrictMode>
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  </StrictMode>
);

// The build prerenders every page (scripts/prerender.mjs), so in production
// the markup is already there to hydrate. The dev server serves it empty.
const container = document.getElementById('root')!;
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
