/**
 * Everything about the business that the pages quote.
 *
 * The privacy policy, terms and support pages all read from here, so a change of
 * address or contact inbox is one edit rather than a search through legal copy.
 *
 * Values in [square brackets] are placeholders and render as-is, on purpose: a
 * policy that quietly shows a made-up company name is worse than one that
 * visibly isn't finished. Replace every one before the site goes live — the
 * App Store and Play reviewers both read these pages.
 */
export const site = {
  name: 'Me&u',
  tagline: 'Two people, one place.',

  /** Canonical origin, no trailing slash. Must match the store listings' developer website. */
  url: 'https://www.meandyou.tech',

  /** The person or company that publishes the app — the "we" in the policies. */
  legalName: 'Me&You Technologies',
  /** Postal address. Required in the privacy policy for GDPR (Art. 13). */
  address: 'Golf view estate, lemma road, Calabar, Cross River State, Nigeria',
  /** Jurisdiction whose law governs the terms. */
  governingLaw: 'Nigeria / Cross River State',

  contactEmail: 'internettrap69@meandyou.tech',
  /**
   * Where child safety reports go. Google Play requires a contact who can
   * answer for the app's CSAE practices, and asks for that person by name in
   * the Console. Point this at a dedicated alias if you make one.
   */
  safetyEmail: 'internettrap69@meandyou.tech',
  privacyEmail: 'internettrap69@meandyou.tech',

  /** Date the current versions of the policies took effect. */
  policiesUpdated: '16 September 2026',

  /**
   * Store listings. `live: false` renders the badge as "Coming soon" and
   * unlinked, so nobody lands on a 404 before the app is approved.
   */
  stores: {
    ios: { url: 'https://apps.apple.com/app/id[APP_STORE_ID]', live: false },
    android: { url: 'https://play.google.com/store/apps/details?id=tech.meandyou.app', live: false },
  },

  premium: {
    price: '$1',
    period: 'month',
    /** Billing is not wired in the app yet; flip once it is. */
    available: false,
  },

  coach: {
    /** Mirrors `coach_free_allowance()` and `coach_rewarded_daily_cap()` in the app's database. */
    freePerDay: 3,
    rewardedPerDay: 3,
  },

  /** Minimum age. The store listings' target audience must agree with this. */
  minimumAge: 18,

  /**
   * Whether the app has its own "Delete account" button. Both stores require
   * one; the deletion page only describes the in-app path once this is true,
   * so it never sends someone looking for a button that isn't there.
   */
  inAppDeletion: true,

  /** Where the app's servers run, for the international transfers section. */
  dataRegion: 'the European Union (Ireland)',
} as const;

export const routes = {
  home: '/',
  privacy: '/privacy/',
  terms: '/terms/',
  support: '/support/',
  childSafety: '/child-safety/',
  deleteAccount: '/delete-account/',
} as const;
