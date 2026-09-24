import { Icon, type IconName } from '../components/Icon';
import { routes, site } from '../site';
import { LegalLayout } from './LegalLayout';

const TOPICS: { icon: IconName; title: string; items: { q: string; a: string }[] }[] = [
  {
    icon: 'heart',
    title: 'Pairing',
    items: [
      {
        q: 'My partner’s code isn’t working',
        a: 'Codes are six characters, work once, and expire if they aren’t used. Check for mix-ups like O and 0 (codes never use O, I, 0 or 1). If it still fails, email us and we’ll sort it out.',
      },
      {
        q: 'Can we use Me&u on an iPhone and an Android phone?',
        a: 'Yes. Hubs work across both.',
      },
    ],
  },
  {
    icon: 'bell',
    title: 'Notifications',
    items: [
      {
        q: 'I’m not getting notifications',
        a: 'Make sure notifications are allowed for Me&u in your phone’s settings, and that the type you want is switched on in the app’s notification settings. Signing out and back in registers your device again.',
      },
      {
        q: 'My partner’s updates are slow to appear',
        a: 'Updates arrive live while the app is open. If they don’t, check your connection, then close and reopen the app.',
      },
    ],
  },
  {
    icon: 'chat',
    title: 'Coach',
    items: [
      {
        q: 'Why can’t I ask another question?',
        a: `Free accounts get ${site.coach.freePerDay} coach questions a day, and can unlock up to ${site.coach.rewardedPerDay} more by watching a short ad. The count resets daily. Premium has no limit.`,
      },
      {
        q: 'Can my partner see my coach chats?',
        a: 'No. Coach conversations are only visible to you.',
      },
    ],
  },
  {
    icon: 'sparkle',
    title: 'Premium and ads',
    items: [
      {
        q: 'How do I cancel Premium?',
        a: 'Subscriptions are managed by your app store. On iPhone go to Settings → your name → Subscriptions. On Android open Google Play → Profile → Payments & subscriptions → Subscriptions.',
      },
      {
        q: 'How do I change my ad choices?',
        a: 'Use the privacy options in the app’s settings. On iPhone you can also change tracking in Settings → Privacy & Security → Tracking.',
      },
    ],
  },
];

export default function Support() {
  const subject = encodeURIComponent(`${site.name} support`);
  const body = encodeURIComponent(
    'What happened:\n\n\nWhat you expected:\n\n\nPhone model and OS version:\nApp version (if you know it):\n',
  );

  return (
    <LegalLayout
      eyebrow="Support"
      title="How can we help?"
      intro={<p>Quick answers below. If you’re still stuck, write to us. A real person reads every message.</p>}
      showUpdated={false}
    >
      <div className="support-contact card">
        <div>
          <strong className="title3">Contact us</strong>
          <p className="muted">We usually reply within two working days.</p>
        </div>
        <a className="btn btn-primary" href={`mailto:${site.contactEmail}?subject=${subject}&body=${body}`}>
          <Icon name="mail" size={18} /> Email {site.contactEmail}
        </a>
      </div>

      {TOPICS.map((t) => (
        <section key={t.title} className="support-topic">
          <h2>
            <span className="topic-icon">
              <Icon name={t.icon} size={18} />
            </span>
            {t.title}
          </h2>
          <div className="faq">
            {t.items.map((it) => (
              <details key={it.q}>
                <summary>
                  {it.q}
                  <span className="faq-icon" aria-hidden="true">
                    <Icon name="plus" size={18} />
                  </span>
                </summary>
                <div className="faq-body">
                  <p>{it.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      ))}

      <section className="support-topic">
        <h2>
          <span className="topic-icon">
            <Icon name="shield" size={18} />
          </span>
          Account and privacy
        </h2>
        <ul className="link-cards">
          <li>
            <a href={routes.deleteAccount}>
              <strong>Delete your account</strong>
              <span>What gets removed, and how to ask</span>
              <Icon name="arrow" size={18} />
            </a>
          </li>
          <li>
            <a href={routes.childSafety}>
              <strong>Child safety standards</strong>
              <span>Reporting abuse of a child</span>
              <Icon name="arrow" size={18} />
            </a>
          </li>
          <li>
            <a href={routes.privacy}>
              <strong>Privacy policy</strong>
              <span>What we collect and why</span>
              <Icon name="arrow" size={18} />
            </a>
          </li>
          <li>
            <a href={routes.terms}>
              <strong>Terms of service</strong>
              <span>The ground rules</span>
              <Icon name="arrow" size={18} />
            </a>
          </li>
        </ul>
        <p className="muted small">
          Reporting abuse or a safety concern? Email {site.contactEmail} with “Safety” in the subject line and we’ll
          prioritise it. For anything involving a child, see our{' '}
          <a href={routes.childSafety}>child safety standards</a>. If anyone is in immediate danger, contact local
          emergency services first.
        </p>
      </section>
    </LegalLayout>
  );
}
