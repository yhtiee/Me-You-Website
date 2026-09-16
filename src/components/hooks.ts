import { useEffect, useRef, useState } from 'react';

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

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/**
 * True while the element is on screen — used to pause demos nobody is watching.
 * With `once`, it latches: the first sighting stays true, for demos that play
 * a single time.
 */
export function useInView<T extends Element>({ once = false } = {}) {
  const ref = useRef<T>(null);
  // No observer (very old browsers): treat everything as visible.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');
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

function readStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem('meyou-theme');
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

/**
 * System theme by default; an explicit choice is remembered per browser. The
 * attribute is also set by an inline script in each page's <head> so there is
 * no flash of the wrong theme before React loads.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    return (
      readStoredTheme() ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );
  });

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('meyou-theme', next);
    } catch {
      /* private mode — the choice just won't persist */
    }
  };

  return { theme, toggle };
}
