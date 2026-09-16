# Me&u website

The landing page and policy pages for the Me&u app: a React and Vite multi-page site with no backend.

| Route | Purpose |
|---|---|
| `/` | Landing page with interactive demos |
| `/privacy/` | Privacy policy (App Store, Google Play, AdMob consent message) |
| `/terms/` | Terms of service |
| `/support/` | Support URL for the store listings |
| `/delete-account/` | Account deletion URL (required by Google Play) |
| `/app-ads.txt` | AdMob authorised sellers file |

## Develop

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs to dist/
npm run preview   # serves dist/
npm run assets    # regenerates icons and the share image
```

## Before going live

1. **Fill in `src/site.ts`.** Every value in `[brackets]` renders as-is until you replace it: legal name, address, contact emails, domain, governing law, data region and App Store ID.
2. **Fill in `public/app-ads.txt`.** Replace `pub-0000000000000000` with your AdMob publisher ID and delete the comment lines.
3. **Flip the flags in `src/site.ts` when the time comes:**
   - `stores.*.live` once each listing is approved;
   - `premium.available` once billing ships;
   - `inAppDeletion` once the app has a Delete account button.
4. **Set the site URL.** Fill in `url` in `src/site.ts`, or set `SITE_URL=https://your-domain` in your host's build settings. Without it, the build prints a warning and leaves out canonical links, absolute share images, structured data and `sitemap.xml`.
5. **Deploy `dist/` to the domain** you list as the developer website in both stores. `app-ads.txt` must be served from the root of that domain.
6. **Submit the sitemap.** Add `https://your-domain/sitemap.xml` in Google Search Console once the site is live.

## SEO, icons and sharing

- **Page metadata** (title, description, whether the page is indexed) lives in `src/seo.ts`. At build time, `vite-plugin-seo.ts` writes it into each page's `<head>`, together with:
  - canonical links and Open Graph / Twitter share tags;
  - icons and theme colours;
  - JSON-LD structured data: Organization, WebSite and MobileApplication on the home page, and a breadcrumb trail on the other pages.
- **Build output:** `robots.txt` and `sitemap.xml` are generated from the same page list. Adding a page means adding it there; the build fails if a page has no entry.
- **Icons and the share image** are generated into `public/` by `npm run assets`, from these sources:
  - `public/favicon.svg` for tab icons and `favicon.ico`;
  - `public/images/icon.png`, the app icon, for the Apple touch icon and manifest icons;
  - `scripts/og-image.html` for the 1200×630 share image, which renders in your installed Chrome (set `CHROME_PATH` if the script can't find it).

  Re-run it only when one of those sources changes; the generated files are committed.
- **App Store banner:** once `stores.ios.live` is `true` and the App Store URL has a real id, the home page also gets Safari's banner.

## Hosting

Every route is a real `index.html` inside its own folder, so no rewrite rules are needed. Configure your host to serve `404.html` for unknown paths; Netlify, Vercel, Cloudflare Pages and GitHub Pages all do this by default.

## Design

The colours, radii, shadows and motion curves in `src/styles/tokens.css` are copied from the app's `constants/tokens.ts`. Change a value in the app first, then copy it here. The fonts (Plus Jakarta Sans and Manrope) are bundled from `@fontsource`, so the site makes no third-party requests. The privacy policy relies on that.
