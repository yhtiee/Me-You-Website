import type { ReactNode } from 'react';

import { Icon } from '../components/Icon';
import { StoreButtons } from '../components/StoreButtons';
import { delay } from '../components/vars';
import { routes, site } from '../site';

const FREE = [
  'Daily check-ins and your shared streak',
  'Every game in Play',
  'Shared calendar, bucket list and gallery',
  'The details wiki about each other',
  `${site.coach.freePerDay} coach questions a day, plus up to ${site.coach.rewardedPerDay} more for watching a short ad`,
  'Small, clearly labelled ads',
];

const PREMIUM = [
  'Everything in Free',
  'No ads, anywhere in the app',
  'Unlimited coach questions',
  'One subscription covers both of you',
];

/** YourLovePage's two-card pricing, with Lovewick's "no subscription required" stance. */
export function Pricing() {
  return (
    <section id="pricing" className="section pricing">
      <div className="container">
        <div className="section-head center reveal">
          <span className="overline">Pricing</span>
          <h2 className="title1">Free for two. One small price if you want more.</h2>
          <p className="lead">No subscription required. Premium is optional, and one upgrade covers your whole hub.</p>
        </div>

        <div className="price-grid">
          <article className="price card reveal">
            <h3 className="title3">Free</h3>
            <p className="price-amount">
              <b>$0</b>
              <span>forever</span>
            </p>
            <p className="muted">Everything you need to show up for each other every day.</p>
            <ul className="ticks">
              {FREE.map((f) => (
                <li key={f}>
                  <Icon name="check" size={18} /> {f}
                </li>
              ))}
            </ul>
            <a className="btn btn-ghost" href="#download">
              Get started
            </a>
          </article>

          <article className="price card premium reveal" style={delay(100)}>
            <span className="price-flag">{site.premium.available ? 'For both of you' : 'Coming soon'}</span>
            <h3 className="title3">Premium</h3>
            <p className="price-amount">
              <b>{site.premium.price}</b>
              <span>/ {site.premium.period}</span>
            </p>
            <p>Less than a coffee, once a month. Cancel whenever.</p>
            <ul className="ticks">
              {PREMIUM.map((f) => (
                <li key={f}>
                  <Icon name="check" size={18} /> {f}
                </li>
              ))}
            </ul>
            <a className="btn btn-light" href="#download">
              {site.premium.available ? 'Upgrade in the app' : 'Start free today'}
            </a>
          </article>
        </div>
        <p className="price-fine muted">
          Subscriptions are billed through the App Store or Google Play and renew until cancelled in your store account
          settings.
        </p>
      </div>
    </section>
  );
}

const FAQ: { q: string; a: ReactNode }[] = [
  {
    q: 'Is Me&u free?',
    a: (
      <>
        Yes. Every core feature is free, with small ads. Premium ({site.premium.price}/{site.premium.period}) removes
        the ads and the daily limit on coach questions, and one upgrade covers both of you.
      </>
    ),
  },
  {
    q: 'Does my partner need the app too?',
    a: 'Yes. Me&u is built for two phones. One of you creates a hub and shares a six-letter code, and the other joins with it. It works across iPhone and Android.',
  },
  {
    q: 'Can my partner read my coach conversations or to-dos?',
    a: 'No. Your coach chats and to-dos are private to you, and that is enforced on our servers, not just hidden in the app. Check-ins, the calendar, the bucket list, the gallery, the details wiki and game results are shared.',
  },
  {
    q: 'Does it work for long-distance couples?',
    a: 'Yes, that’s a big part of it. Check-ins, game results and nudges reach your partner’s phone the moment they happen, wherever they are.',
  },
  {
    q: 'Is the coach a therapist?',
    a: (
      <>
        No. The coach is an AI that offers friendly, general guidance. It isn’t a licensed professional and can get
        things wrong. If you’re in crisis or feel unsafe, contact local emergency services or a crisis line in your
        country.
      </>
    ),
  },
  {
    q: 'Who can use Me&u?',
    a: `Me&u is for adults. You need to be at least ${site.minimumAge} to create an account.`,
  },
  {
    q: 'What do you do with my data?',
    a: (
      <>
        We use it to run the app for you and your partner, and we never sell what you write. Free accounts see ads
        from Google, which may use your device’s advertising ID, and you can choose how that works. The{' '}
        <a href={routes.privacy}>privacy policy</a> has the full detail.
      </>
    ),
  },
  {
    q: 'How do I delete my account?',
    a: (
      <>
        Follow the steps on our <a href={routes.deleteAccount}>account deletion page</a>. We remove your profile and
        private data, and anything you shared stops being linked to you.
      </>
    ),
  },
];

/** YourLovePage-style accordion. Native <details>, so it works before JS and with a keyboard. */
export function Faq() {
  return (
    <section id="faq" className="section faq-section">
      <div className="container faq-grid">
        <div className="section-head reveal">
          <span className="overline">FAQ</span>
          <h2 className="title1">Good questions.</h2>
          <p className="lead">
            Something else? <a href={routes.support}>Visit support</a> or email{' '}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
          </p>
        </div>
        <div className="faq">
          {FAQ.map((item, i) => (
            <details key={item.q} className="reveal" style={delay(i * 40)} name="faq">
              <summary>
                {item.q}
                <span className="faq-icon" aria-hidden="true">
                  <Icon name="plus" size={18} />
                </span>
              </summary>
              <div className="faq-body">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Cupla's closing call, on the app's own couple-banner gradient. */
export function FinalCta() {
  return (
    <section id="download" className="section final">
      <div className="container">
        <div className="final-card reveal">
          <div className="final-copy">
            <span className="overline on-color">Two people. One place.</span>
            <h2 className="title1">Start your streak tonight.</h2>
            <p>Download {site.name}, send your partner the code, and check in before bed.</p>
            <StoreButtons tone="onColor" />
          </div>
          <img className="final-art" src="/images/connect.png" alt="" width={410} height={210} loading="lazy" />
          <span className="final-heart h1" aria-hidden="true">♥</span>
          <span className="final-heart h2" aria-hidden="true">✦</span>
          <span className="final-heart h3" aria-hidden="true">♥</span>
        </div>
      </div>
    </section>
  );
}
