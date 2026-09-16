import { useState, type FormEvent } from 'react';

import { Icon } from '../components/Icon';
import { site } from '../site';
import { Callout, LegalLayout } from './LegalLayout';

const DELETED = [
  'Your login: email address and password',
  'Your profile: name and photo',
  'Your check-ins, streak history and marked nudges',
  'Your to-dos',
  'Your coach conversations and attachments',
  'Everything written about you in the details wiki',
  'Your game answers, movie swipes and love languages',
  'Your push tokens, notification settings and notification history',
];

const KEPT = [
  'Shared items you created, such as calendar events, bucket list items, gallery photos and wiki entries about your partner, stay in the hub for your partner. They are no longer linked to your name. If no one is left in the hub, the hub and everything in it is deleted.',
  'Copies in encrypted backups, for up to 30 more days, until they are overwritten.',
  'Records we must keep by law, such as financial records. Purchase records are held by Apple or Google.',
];

/**
 * Google Play requires a public web page where users can request deletion
 * without reinstalling the app. It must name the app, give the steps, and say
 * what is deleted, what is kept and for how long.
 */
export default function DeleteAccount() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const subject = encodeURIComponent(`Delete my ${site.name} account`);
    const body = encodeURIComponent(
      `Please delete my ${site.name} account and its data.\n\nAccount email: ${email.trim()}\n\nI understand this can't be undone.`,
    );
    window.location.href = `mailto:${site.privacyEmail}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <LegalLayout
      eyebrow={`${site.name} · Account deletion`}
      title="Delete your Me&u account"
      intro={
        <p>
          You can ask us to delete your {site.name} account and its data at any time, without reinstalling the app.
          Here’s how, and exactly what happens.
        </p>
      }
    >
      <section className="delete-steps">
        <h2>How to request deletion</h2>

        {site.inAppDeletion ? (
          <div className="option card">
            <span className="option-tag">Fastest</span>
            <strong className="title3">In the app</strong>
            <ol>
              <li>Open {site.name} and sign in.</li>
              <li>
                Go to <b>You → Settings → Delete account</b>.
              </li>
              <li>Confirm. Your account is closed straight away.</li>
            </ol>
          </div>
        ) : null}

        <div className="option card">
          {site.inAppDeletion ? null : <span className="option-tag">Available now</span>}
          <strong className="title3">By email</strong>
          <ol>
            <li>Enter the email address you use to sign in to {site.name}.</li>
            <li>
              We’ll open an email to {site.privacyEmail} for you. Send it <b>from that same address</b> so we know it’s
              you.
            </li>
            <li>We’ll confirm, then delete your account within 30 days.</li>
          </ol>
          <form className="delete-form" onSubmit={submit}>
            <label htmlFor="del-email">Account email</label>
            <div>
              <input
                id="del-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                placeholder="you@example.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSent(false);
                }}
              />
              <button type="submit" className="btn btn-primary" disabled={!valid}>
                <Icon name="mail" size={18} /> Request deletion
              </button>
            </div>
            <p className="muted small" aria-live="polite">
              {sent
                ? `If your email app didn't open, email ${site.privacyEmail} from your account address with the subject "Delete my ${site.name} account".`
                : 'Nothing is sent from this page. It only prepares the email for you.'}
            </p>
          </form>
        </div>

        <Callout tone="amber" title="Before you go">
          If you have Premium, cancel it in your App Store or Google Play settings. Deleting your account doesn’t stop
          store billing. Deletion can’t be undone, and your partner will see that you’ve left the hub.
        </Callout>
      </section>

      <div className="split-cards">
        <div className="split-card mine">
          <strong>
            <Icon name="trash" size={16} /> What we delete
          </strong>
          <ul>
            {DELETED.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="split-card shared">
          <strong>
            <Icon name="clock" size={16} /> What stays, and for how long
          </strong>
          <ul>
            {KEPT.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </div>

      <section className="delete-steps">
        <h2>Only want to remove some data?</h2>
        <p>
          You can delete many items yourself in the app, including calendar events, gallery photos, to-dos, wheel options and your own trivia questions. For
          anything else, email <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a> and tell us what you’d
          like removed. You don’t have to close your account.
        </p>
      </section>
    </LegalLayout>
  );
}
