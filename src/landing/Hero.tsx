import { useState } from 'react';

import { Icon } from '../components/Icon';
import { PhoneDock, PhoneFrame, PhoneTabs } from '../components/Phone';
import { StoreButtons } from '../components/StoreButtons';
import { delay, vars } from '../components/vars';
import { site } from '../site';

const MOODS = [
  { key: 'happy', label: 'Happy', face: '😊', color: 'var(--mood-happy)' },
  { key: 'neutral', label: 'Okay', face: '😐', color: 'var(--mood-neutral)' },
  { key: 'sad', label: 'Low', face: '😔', color: 'var(--mood-sad)' },
  { key: 'stressed', label: 'Stressed', face: '😣', color: 'var(--mood-stressed)' },
] as const;

type MoodKey = (typeof MOODS)[number]['key'];

const WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/**
 * The home screen, rebuilt in HTML so it can be used rather than looked at.
 * Picking a mood checks you in: today's dot fills and the streak ticks over,
 * which is the one loop the whole app is built around.
 */
function PhoneHome() {
  const [mood, setMood] = useState<MoodKey | null>(null);
  const streak = mood ? 13 : 12;
  const picked = MOODS.find((m) => m.key === mood);

  return (
    <PhoneFrame
      label="Interactive preview of the Me&u home screen"
      hint={
        picked ? (
          <>
            <Icon name="check" size={14} /> Sam sees you’re feeling {picked.label.toLowerCase()}
          </>
        ) : (
          'Tap a mood to try it'
        )
      }
    >
      <div className="ph-header">
        <div>
          <small>Good evening</small>
          <strong>Ada</strong>
        </div>
        <span className="ph-bell">
          <Icon name="bell" size={16} />
        </span>
      </div>

      <div className="ph-banner">
        <div className="ph-avatars" aria-hidden="true">
          <span className="av you">A</span>
          <span className="av partner">S</span>
        </div>
        <div>
          <small>TOGETHER</small>
          <strong>Ada &amp; Sam</strong>
          <span>3 years, 2 months</span>
        </div>
      </div>

      <div className="ph-card ph-streak">
        <div className="ph-streak-top">
          <span className="ph-flame">
            <Icon name="flame" size={16} />
          </span>
          <strong key={streak} className="pop">
            {streak}-day streak
          </strong>
        </div>
        <div className="ph-week">
          {WEEK.map((d, i) => {
            const done = i < 3 || (i === 3 && mood);
            return (
              <span key={i} className={`ph-day ${done ? 'done' : ''} ${i === 3 ? 'today' : ''}`}>
                <i />
                {d}
              </span>
            );
          })}
        </div>
      </div>

      <div className="ph-card">
        <strong className="ph-q">{mood ? 'Checked in — nice.' : 'How are you, really?'}</strong>
        <div className="ph-moods" role="group" aria-label="Pick a mood to check in">
          {MOODS.map((m) => (
            <button
              key={m.key}
              type="button"
              aria-pressed={mood === m.key}
              className={mood === m.key ? 'on' : ''}
              style={vars({ '--mood': m.color })}
              onClick={() => setMood(mood === m.key ? null : m.key)}
            >
              <span aria-hidden="true">{m.face}</span>
              {m.label}
            </button>
          ))}
        </div>
        <div className="ph-partner">
          <span className="av partner sm">S</span>
          <span>
            Sam checked in · <b>😊 Happy</b>
          </span>
          <span className="ph-batt" aria-label="Battery 62 percent">
            <i style={{ width: '62%' }} />
          </span>
        </div>
      </div>

      <PhoneDock>
        <PhoneTabs active="home" />
      </PhoneDock>
    </PhoneFrame>
  );
}

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="chip reveal">
            <Icon name="heart" size={14} /> The everyday app for couples
          </span>
          <h1 className="display reveal" style={delay(60)}>
            You check in.
            <br />
            They check in.
            <br />
            <span className="duo-text">The streak grows.</span>
          </h1>
          <p className="lead reveal" style={delay(120)}>
            {site.name} is one shared place for two people: a daily check-in, games that settle the small stuff, and
            every detail worth remembering about each other.
          </p>
          <div className="reveal" style={delay(180)}>
            <StoreButtons />
          </div>
          <ul className="hero-facts reveal" style={delay(240)}>
            <li>
              <Icon name="check" size={16} /> Free to use
            </li>
            <li>
              <Icon name="check" size={16} /> iPhone &amp; Android
            </li>
            <li>
              <Icon name="check" size={16} /> Premium is {site.premium.price}/{site.premium.period} for both of you
            </li>
          </ul>
        </div>

        <div className="hero-visual reveal" style={delay(120)}>
          <PhoneHome />
          <div className="float-chip fc-1" aria-hidden="true">
            <span className="fc-dot" style={{ background: 'var(--accent-coin)' }} />
            Coin says: <b>you pick dinner</b>
          </div>
          <div className="float-chip fc-2" aria-hidden="true">
            <span className="fc-dot" style={{ background: 'var(--iris)' }} />
            Date night · <b>Fri 7pm</b>
          </div>
          <div className="float-chip fc-3" aria-hidden="true">
            <span className="fc-dot" style={{ background: 'var(--rose)' }} />
            <b>Kyoto</b> added to your list
          </div>
          <span className="sparkle s1" aria-hidden="true">
            ✦
          </span>
          <span className="sparkle s2" aria-hidden="true">
            ♥
          </span>
          <span className="sparkle s3" aria-hidden="true">
            ✦
          </span>
        </div>
      </div>
    </section>
  );
}

export function Ribbon() {
  const items = [
    'Built for exactly two',
    'No subscription required',
    'Private where it matters',
    'Live updates, even miles apart',
    'Coin flips settle it',
    'Never forget the details',
  ];
  // Rendered twice so the loop has no seam; the copy is hidden from readers.
  return (
    <div className="ribbon" aria-label="Highlights">
      <div className="ribbon-track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1}>
            {items.map((t) => (
              <li key={t}>
                {t}
                <span className="ribbon-sep" aria-hidden="true">
                  ✦
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
