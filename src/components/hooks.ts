import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

/**
 * Adds `is-in` to every `.reveal` element once it scrolls into view. One
 * observer for the page rather than one per element — there are dozens.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)');
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}

const noSubscribe = () => () => {};

/** False in the prerendered HTML and while hydrating, true from then on. */
export function useHydrated() {
  return useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
}

const REDUCED_MOTION ='(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/** False on the server (and while hydrating) so the prerendered HTML matches. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

/**
 * True while the element is on screen — used to pause demos nobody is watching.
 * With `once`, it latches: the first sighting stays true, for demos that play
 * a single time.
 */
export function useInView<T extends Element>({ once = false } = {}) {
  const ref = useRef<T>(null);
  // Starts false everywhere, server included, so prerendered HTML matches the
  // first client render. Every browser that runs React 19 has the observer.
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setInView((prev) => (once ? prev || entry.isIntersecting : entry.isIntersecting)),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  return [ref, inView] as const;
}

type Theme = 'light' | 'dark';

const themeListeners = new Set<() => void>();

/** A saved choice is on <html> already (the inline <head> script puts it there). */
function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function subscribeTheme(onChange: () => void) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  themeListeners.add(onChange);
  mq.addEventListener('change', onChange);
  return () => {
    themeListeners.delete(onChange);
    mq.removeEventListener('change', onChange);
  };
}

/**
 * System theme by default; an explicit choice is remembered per browser. The
 * attribute is also set by an inline script in each page's <head> so there is
 * no flash of the wrong theme before React loads.
 *
 * Pages are prerendered, and the server can't know the visitor's theme, so the
 * first render says 'light' to match the HTML and React swaps in the real value
 * straight after hydrating.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, currentTheme, (): Theme => 'light');

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    themeListeners.forEach((notify) => notify());
    try {
      localStorage.setItem('meyou-theme', next);
    } catch {
      /* private mode — the choice just won't persist */
    }
  };

  return { theme, toggle };
}
