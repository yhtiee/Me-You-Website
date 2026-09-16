// Extension included: this file is also loaded by the Vite config under Node's resolver.
import { routes, site } from './site.ts';

/**
 * Search and sharing metadata for every page.
 *
 * Read at build time by `vite-plugin-seo.ts`, which writes it into each page's
 * <head> as real HTML — crawlers and link previews never run JavaScript, so
 * none of this can be set from React.
 *
 * Titles stay under ~60 characters and descriptions under ~155, the lengths
 * Google shows before truncating.
 */
export type PageSeo = {
  /** The HTML entry, relative to the project root, without `.html`. */
  entry: string;
  path: string;
  title: string;
  description: string;
  /** False keeps the page out of search results and the sitemap. */
  index: boolean;
  /** Label in the breadcrumb trail; the home page has none. */
  breadcrumb?: string;
  priority?: number;
  changefreq?: 'weekly' | 'monthly' | 'yearly';
};

export const pages: PageSeo[] = [
  {
    entry: 'index',
    path: routes.home,
    title: `${site.name} — The everyday app for couples`,
    description:
      'Check in daily, build a streak together, settle the small stuff with a coin flip, and never forget the details. One shared place for two.',
    index: true,
    priority: 1,
    changefreq: 'weekly',
  },
  {
    entry: 'privacy/index',
    path: routes.privacy,
    title: `Privacy policy · ${site.name}`,
    description:
      'What Me&u collects, why, who it is shared with, what your partner can see, and the choices you have over ads and your data.',
    index: true,
    breadcrumb: 'Privacy policy',
    priority: 0.5,
    changefreq: 'monthly',
  },
  {
    entry: 'terms/index',
    path: routes.terms,
    title: `Terms of service · ${site.name}`,
    description:
      'The terms for using Me&u: your hub and your partner, your content, the AI coach, ads, Premium subscriptions and more.',
    index: true,
    breadcrumb: 'Terms of service',
    priority: 0.4,
    changefreq: 'monthly',
  },
  {
    entry: 'support/index',
    path: routes.support,
    title: `Help & support · ${site.name}`,
    description:
      'Help with pairing, notifications, the coach, Premium and your account — and how to reach a real person on the Me&u team.',
    index: true,
    breadcrumb: 'Support',
    priority: 0.6,
    changefreq: 'monthly',
  },
  {
    entry: 'delete-account/index',
    path: routes.deleteAccount,
    title: `Delete your account · ${site.name}`,
    description:
      'How to delete your Me&u account and data, from the app or by email — what is removed, what is kept, and for how long.',
    index: true,
    breadcrumb: 'Delete your account',
    priority: 0.3,
    changefreq: 'yearly',
  },
  {
    entry: '404',
    path: '/404.html',
    title: `Page not found · ${site.name}`,
    description: 'This page doesn’t exist.',
    index: false,
  },
];

export const seo = {
  locale: 'en_US',
  language: 'en',
  ogImage: { path: '/og-image.png', width: 1200, height: 630, alt: 'Me&u — You check in. They check in. The streak grows.' },
  /** Matches `--bg` in each theme, so the browser chrome blends with the page. */
  themeColor: { light: '#FBF8FA', dark: '#161119' },
  appDescription:
    'Me&u is a shared space for couples: daily mood and battery check-ins, a streak you build together, games that settle small decisions, a wiki of the details that matter, and a private AI coach.',
};
