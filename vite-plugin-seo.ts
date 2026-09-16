import { relative } from 'node:path';

import type { HtmlTagDescriptor, Plugin } from 'vite';

import { pages, seo, type PageSeo } from './src/seo.ts';
import { site } from './src/site.ts';

/**
 * Writes each page's <head> metadata at build time, and emits `sitemap.xml`
 * and `robots.txt`.
 *
 * Everything absolute — canonical URLs, `og:url`, the share image, the
 * sitemap — needs the site's origin. It comes from the `SITE_URL` environment
 * variable, or `site.url` once that placeholder is filled in. Without one the
 * build still works but leaves those out and says so, rather than publishing
 * links to `https://[your-domain]`.
 */

const isPlaceholder = (value: string) => /\[[^\]]*\]/.test(value);

function siteOrigin(): string | null {
  const raw = (process.env.SITE_URL || site.url).trim().replace(/\/+$/, '');
  if (!raw || isPlaceholder(raw) || !/^https?:\/\//.test(raw)) return null;
  return raw;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({ tag: 'meta', attrs, injectTo: 'head' });
const link = (attrs: Record<string, string>): HtmlTagDescriptor => ({ tag: 'link', attrs, injectTo: 'head' });

/** App Store id from the listing URL, once there is a real one. */
function appStoreId(): string | null {
  if (!site.stores.ios.live) return null;
  return site.stores.ios.url.match(/id(\d+)/)?.[1] ?? null;
}

function structuredData(page: PageSeo, origin: string | null): object | null {
  if (!origin) return null;
  const url = (path: string) => `${origin}${path}`;

  if (page.entry === 'index') {
    const downloads = [site.stores.ios, site.stores.android].filter((s) => s.live).map((s) => s.url);
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': url('/#organization'),
          name: isPlaceholder(site.legalName) ? site.name : site.legalName,
          url: url('/'),
          logo: url('/icon-512.png'),
          ...(isPlaceholder(site.contactEmail) ? {} : { email: site.contactEmail }),
        },
        {
          '@type': 'WebSite',
          '@id': url('/#website'),
          name: site.name,
          url: url('/'),
          inLanguage: seo.language,
          publisher: { '@id': url('/#organization') },
        },
        {
          '@type': 'MobileApplication',
          name: site.name,
          description: seo.appDescription,
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'iOS, Android',
          image: url(seo.ogImage.path),
          url: url('/'),
          publisher: { '@id': url('/#organization') },
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          ...(downloads.length ? { downloadUrl: downloads } : {}),
        },
      ],
    };
  }

  if (!page.index || !page.breadcrumb) return null;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: page.title,
        description: page.description,
        url: url(page.path),
        inLanguage: seo.language,
        isPartOf: { '@id': url('/#website') },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: site.name, item: url('/') },
          { '@type': 'ListItem', position: 2, name: page.breadcrumb, item: url(page.path) },
        ],
      },
    ],
  };
}

function headTags(page: PageSeo, origin: string | null): HtmlTagDescriptor[] {
  const abs = (path: string) => (origin ? `${origin}${path}` : path);
  const tags: HtmlTagDescriptor[] = [
    { tag: 'title', children: escapeHtml(page.title), injectTo: 'head' },
    meta({ name: 'description', content: page.description }),
    meta({ name: 'robots', content: page.index ? 'index, follow, max-image-preview:large' : 'noindex, follow' }),
    meta({ name: 'color-scheme', content: 'light dark' }),
    meta({ name: 'theme-color', content: seo.themeColor.light, media: '(prefers-color-scheme: light)' }),
    meta({ name: 'theme-color', content: seo.themeColor.dark, media: '(prefers-color-scheme: dark)' }),
    meta({ name: 'application-name', content: site.name }),
    meta({ name: 'apple-mobile-web-app-title', content: site.name }),
    meta({ name: 'format-detection', content: 'telephone=no' }),

    // Icons: the .ico for anything that asks for /favicon.ico, the SVG for
    // browsers that take it, the real app icon for home screens.
    link({ rel: 'icon', href: '/favicon.ico', sizes: '48x48' }),
    link({ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }),
    link({ rel: 'icon', href: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' }),
    link({ rel: 'icon', href: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' }),
    link({ rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }),
    link({ rel: 'manifest', href: '/site.webmanifest' }),

    // Link previews.
    meta({ property: 'og:type', content: 'website' }),
    meta({ property: 'og:site_name', content: site.name }),
    meta({ property: 'og:locale', content: seo.locale }),
    meta({ property: 'og:title', content: page.title }),
    meta({ property: 'og:description', content: page.description }),
    meta({ property: 'og:image', content: abs(seo.ogImage.path) }),
    meta({ property: 'og:image:type', content: 'image/png' }),
    meta({ property: 'og:image:width', content: String(seo.ogImage.width) }),
    meta({ property: 'og:image:height', content: String(seo.ogImage.height) }),
    meta({ property: 'og:image:alt', content: seo.ogImage.alt }),
    meta({ name: 'twitter:card', content: 'summary_large_image' }),
    meta({ name: 'twitter:title', content: page.title }),
    meta({ name: 'twitter:description', content: page.description }),
    meta({ name: 'twitter:image', content: abs(seo.ogImage.path) }),
    meta({ name: 'twitter:image:alt', content: seo.ogImage.alt }),
  ];

  if (origin && page.index) {
    tags.push(link({ rel: 'canonical', href: `${origin}${page.path}` }));
    tags.push(meta({ property: 'og:url', content: `${origin}${page.path}` }));
  }

  // iOS Safari's "Open in App Store" banner, once there is a listing to open.
  const iosId = appStoreId();
  if (iosId && page.entry === 'index') tags.push(meta({ name: 'apple-itunes-app', content: `app-id=${iosId}` }));

  const data = structuredData(page, origin);
  if (data) {
    tags.push({
      tag: 'script',
      attrs: { type: 'application/ld+json' },
      // `<` escaped so a string in the data can never close the script tag.
      children: JSON.stringify(data).replace(/</g, '\\u003c'),
      injectTo: 'head',
    });
  }

  return tags;
}

function sitemap(origin: string, lastmod: string): string {
  const urls = pages
    .filter((p) => p.index)
    .map(
      (p) =>
        `  <url>\n    <loc>${origin}${p.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n` +
        (p.changefreq ? `    <changefreq>${p.changefreq}</changefreq>\n` : '') +
        (p.priority !== undefined ? `    <priority>${p.priority.toFixed(1)}</priority>\n` : '') +
        '  </url>'
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function seoPlugin(): Plugin {
  let root = process.cwd();
  const origin = siteOrigin();

  return {
    name: 'meyou-seo',
    configResolved(config) {
      root = config.root;
      if (!origin && config.command === 'build') {
        config.logger.warn(
          '\n[seo] No site URL. Set SITE_URL (or fill in site.url in src/site.ts) — canonical links, ' +
            'absolute share images, structured data and sitemap.xml are left out of this build.\n'
        );
      }
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const entry = relative(root, ctx.filename).replace(/\\/g, '/').replace(/\.html$/, '');
        const page = pages.find((p) => p.entry === entry);
        if (!page) throw new Error(`[seo] No metadata for ${entry}.html — add it to src/seo.ts.`);
        return { html, tags: headTags(page, origin) };
      },
    },
    generateBundle() {
      const robots = origin
        ? `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
        : 'User-agent: *\nAllow: /\n';
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });

      if (origin) {
        const lastmod = new Date().toISOString().slice(0, 10);
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap(origin, lastmod) });
      }
    },
  };
}
