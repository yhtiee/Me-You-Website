import { StrictMode, Suspense, type ComponentType } from 'react';
import { renderToString } from 'react-dom/server';

import NotFound from './NotFound';
import Landing from './landing/Landing';
import ChildSafety from './legal/ChildSafety';
import DeleteAccount from './legal/DeleteAccount';
import Privacy from './legal/Privacy';
import Support from './legal/Support';
import Terms from './legal/Terms';

/**
 * Build-time renderer. `scripts/prerender.mjs` calls this for every page and
 * writes the markup into its HTML file, so the text is in the page source
 * rather than drawn by JavaScript. Store reviewers and crawlers read the
 * source; Google Play rejected the child safety page when it was empty.
 *
 * Keys match `data-page` on each HTML file's <body>, as in `main.tsx`.
 */
// Build-only entry; it never runs under Fast Refresh.
// eslint-disable-next-line react-refresh/only-export-components
const PAGES: Record<string, ComponentType> = {
  home: Landing,
  privacy: Privacy,
  terms: Terms,
  support: Support,
  'child-safety': ChildSafety,
  'delete-account': DeleteAccount,
  'not-found': NotFound,
};

export function render(page: string): string {
  const Page = PAGES[page] ?? NotFound;
  // Same tree as main.tsx, Suspense included, so the markup hydrates cleanly.
  return renderToString(
    <StrictMode>
      <Suspense fallback={null}>
        <Page />
      </Suspense>
    </StrictMode>,
  );
}
