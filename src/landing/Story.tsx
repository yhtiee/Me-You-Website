import { useEffect, useState } from 'react';

import { Icon, type IconName } from '../components/Icon';
import { PhoneComposer, PhoneDock, PhoneFrame, PhoneTabs } from '../components/Phone';
import { useInView, usePrefersReducedMotion } from '../components/hooks';
import { delay, vars } from '../components/vars';

type Bubble = { from: 'me' | 'them' | 'app'; text: string; meta?: string };

const THREADS: Record<'without' | 'with', Bubble[]> = {
  without: [
    { from: 'them', text: 'what do you want for dinner', meta: '6:12 pm' },
    { from: 'me', text: 'idk, you pick' },
    { from: 'them', text: 'you always say that' },
    { from: 'me', text: 'fine. anything' },
    { from: 'them', text: 'k', meta: 'Read 7:40 pm' },
  ],
  with: [
    { from: 'app', text: 'Sam checked in · 😔 Low · battery 20%', meta: '6:02 pm' },
    { from: 'me', text: 'Rough day? I’ll sort dinner 🫶' },
    { from: 'app', text: 'Wheel says: Ramen 🍜' },
    { from: 'them', text: 'you’re the best. ramen + sofa?' },
    { from: 'me', text: 'Already on it ❤️', meta: 'Streak · 13 days' },
  ],
};

/** Agapé's "which couple would you rather be" idea, as a toggle between two evenings. */
export function TwoWays() {
  const [mode, setMode] = useState<'without' | 'with'>('with');
  const thread = THREADS[mode];

  return (
    <section className="section two-ways">
      <div className="container two-ways-grid">
        <div className="reveal">
          <span className="overline">Same evening</span>
          <h2 className="title1">Two ways tonight could go.</h2>
          <p className="lead">
            Most arguments aren’t about dinner. They’re about not knowing the other person had a rough day. A ten-second
            check-in fixes more than it looks like it should.
          </p>
          <div className="segmented big" role="radiogroup" aria-label="Choose an evening">
            <button
              type="button"
              role="radio"
              aria-checked={mode === 'without'}
              className={mode === 'without' ? 'on' : ''}
              onClick={() => setMode('without')}
            >
              Without Me&amp;u
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mode === 'with'}
              className={mode === 'with' ? 'on' : ''}
              onClick={() => setMode('with')}
            >
              With Me&amp;u
            </button>
          </div>
        </div>

        <div className="phone-col reveal" style={delay(100)}>
          <PhoneFrame
            label={mode === 'with' ? 'The evening with Me&u' : 'The evening without Me&u'}
            muted={mode === 'without'}
            hint={
              mode === 'with' ? (
                <>
                  <Icon name="heart" size={14} /> Same dinner. Better evening.
                </>
              ) : (
                'Nobody knew it was a rough day.'
              )
            }
          >
            <div className="ph-chat-head">
              <span className="av partner sm">S</span>
              <span>
                <strong>Sam</strong>
                <small>{mode === 'with' ? 'Checked in · 😔 Low' : 'Last seen 6:12 pm'}</small>
              </span>
              <span className={`mood-dot ${mode}`}>{mode === 'with' ? 'In the loop' : 'No idea'}</span>
            </div>
            <ol key={mode} className="ph-thread" aria-live="polite">
              {thread.map((b, i) => (
                <li key={i} className={`bubble ${b.from}`} style={vars({ '--i': i })}>
                  <span>{b.text}</span>
                  {b.meta ? <small>{b.meta}</small> : null}
                </li>
              ))}
            </ol>
            <PhoneDock>
              <PhoneComposer placeholder="Message Sam…" />
            </PhoneDock>
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    title: 'Create your hub',
    body: 'Sign up, then tell us how long you’ve been together. That’s the whole form.',
  },
  {
    title: 'Share your code',
    body: 'Your partner types in a six-letter code. It works once, then it’s gone.',
  },
  {
    title: 'Check in together',
    body: 'Tap once for your mood and once for your battery. The streak only grows when you both show up.',
  },
];

const STEP_MS = 4200;

function StepScreen({ step }: { step: number }) {
  const [copied, setCopied] = useState(false);
  const code = 'K7QM2P';

  if (step === 0) {
    return (
      <div className="step-screen">
        <small className="overline">New hub</small>
        <strong className="ss-title">Let’s set you up</strong>
        <label className="ss-field">
          <span>Your name</span>
          <b>Ada</b>
        </label>
        <label className="ss-field">
          <span>Together for</span>
          <b>
            3 years <i className="caret" />
          </b>
        </label>
        <span className="ss-btn">Create hub</span>
      </div>
    );
  }
  if (step === 1) {
    return (
      <div className="step-screen">
        <small className="overline">Invite Sam</small>
        <strong className="ss-title">Your code</strong>
        <div className="code-tiles" aria-label={`Code ${code.split('').join(' ')}`}>
          {code.split('').map((c, i) => (
            <span key={i} style={vars({ '--i': i })}>
              {c}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="ss-btn ghost"
          onClick={() => {
            navigator.clipboard?.writeText(code).catch(() => {});
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          }}
        >
          <Icon name={copied ? 'check' : 'copy'} size={14} /> {copied ? 'Copied' : 'Copy code'}
        </button>
        <small className="muted">Works once. Expires if unused.</small>
      </div>
    );
  }
  return (
    <div className="step-screen">
      <small className="overline">Today</small>
      <strong className="ss-title">You’re both in</strong>
      <div className="both-in">
        <span className="av you">A</span>
        <span className="both-heart">
          <Icon name="heart" size={18} />
        </span>
        <span className="av partner">S</span>
      </div>
      <span className="ss-streak">
        <Icon name="flame" size={14} /> Day 1 of your streak
      </span>
    </div>
  );
}

/** YourLovePage's numbered steps with Agapé's auto-advancing frame. */
export function HowItWorks() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused || reduced) return;
    const t = window.setTimeout(() => setStep((s) => (s + 1) % STEPS.length), STEP_MS);
    return () => window.clearTimeout(t);
  }, [step, inView, paused, reduced]);

  return (
    <section id="how" className="section how">
      <div className="container">
        <div className="section-head center reveal">
          <span className="overline">How it works</span>
          <h2 className="title1">Two phones. One hub. About two minutes.</h2>
        </div>

        <div
          ref={ref}
          className="how-grid"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="reveal" style={delay(i * 80)}>
                <button
                  type="button"
                  className={`step ${step === i ? 'on' : ''}`}
                  aria-current={step === i ? 'step' : undefined}
                  onClick={() => setStep(i)}
                >
                  <span className="step-num">{i + 1}</span>
                  <span>
                    <strong>{s.title}</strong>
                    <span className="muted">{s.body}</span>
                  </span>
                  {step === i && !paused && !reduced && inView ? (
                    <span className="step-progress" key={`p${step}`} style={vars({ '--ms': `${STEP_MS}ms` })} />
                  ) : null}
                </button>
              </li>
            ))}
          </ol>

          <div className="phone-col reveal" style={delay(120)}>
            <PhoneFrame label={`Step ${step + 1}: ${STEPS[step].title}`} hint={`Step ${step + 1} of ${STEPS.length}`}>
              <div key={step} className="step-stage">
                <StepScreen step={step} />
              </div>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}

const FEATURES: { icon: IconName; title: string; body: string; tint: string }[] = [
  {
    icon: 'flame',
    title: 'Daily check-ins',
    body: 'Mood and battery, once a day, with a streak you build together.',
    tint: 'rose',
  },
  {
    icon: 'dice',
    title: 'Play',
    body: 'Coin flip, spin the wheel, date setter, trivia and movie matching.',
    tint: 'amber',
  },
  {
    icon: 'book',
    title: 'The details',
    body: 'Sizes, allergies, favourite flowers — the things worth getting right.',
    tint: 'iris',
  },
  {
    icon: 'calendar',
    title: 'Shared calendar',
    body: 'Date nights and anniversaries, with reminders for both of you.',
    tint: 'picker',
  },
  {
    icon: 'list',
    title: 'Bucket list',
    body: 'Turn “we should do that someday” into a list you tick off.',
    tint: 'success',
  },
  { icon: 'image', title: 'Gallery', body: 'Your photos, in a space only the two of you can see.', tint: 'trivia' },
  {
    icon: 'chat',
    title: 'Private coach',
    body: 'An AI coach for the conversations you’re not sure how to start.',
    tint: 'iris',
  },
  {
    icon: 'bell',
    title: 'Live nudges',
    body: 'Know the moment they check in or finish a game, wherever they are.',
    tint: 'rose',
  },
];

/** Cupla's everything-at-a-glance grid. */
export function FeatureGrid() {
  return (
    <section id="features" className="section features">
      <div className="container">
        <div className="section-head center reveal">
          <span className="overline">Everything in one place</span>
          <h2 className="title1">All the small things that make a relationship feel looked after.</h2>
        </div>
        <ul className="feature-grid">
          {FEATURES.map((f, i) => (
            <li key={f.title} className={`feature-card card tint-${f.tint} reveal`} style={delay(i * 55)}>
              <span className="feature-icon">
                <Icon name={f.icon} size={22} />
              </span>
              <h3>{f.title}</h3>
              <p className="muted">{f.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function batteryLine(v: number) {
  if (v <= 20) return 'Running on empty. A quiet night in, maybe?';
  if (v <= 50) return 'Getting by. Something low-key sounds good.';
  if (v <= 80) return 'Doing alright. Up for a little something.';
  return 'Fully charged. Plan the date.';
}

/** Lovewick-style row: benefit headline, illustration, and a working widget. */
export function CheckInRow() {
  const [battery, setBattery] = useState(35);
  const hue = battery <= 20 ? 'var(--danger)' : battery <= 50 ? 'var(--amber)' : 'var(--success)';

  return (
    <section className="section">
      <div className="container feature-row">
        <div className="feature-copy reveal">
          <span className="overline">Check-ins</span>
          <h2 className="title1">Know how they’re really doing, without twenty questions.</h2>
          <p className="lead">
            Mood and social battery, once a day. It takes ten seconds, and it tells your partner whether tonight is for
            going out or staying in.
          </p>
          <ul className="ticks">
            <li>
              <Icon name="check" size={18} /> A streak that grows only when you both check in
            </li>
            <li>
              <Icon name="check" size={18} /> A nudge sheet for when you want to say something but don’t know what
            </li>
            <li>
              <Icon name="check" size={18} /> Your partner finds out the moment you check in
            </li>
          </ul>
        </div>

        <div className="feature-visual reveal" style={delay(100)}>
          <img className="illo" src="/images/streak.png" alt="" width={450} height={380} loading="lazy" />
          <div className="battery-card card">
            <label htmlFor="battery" className="battery-label">
              <span>
                <Icon name="battery" size={18} /> Your social battery
              </span>
              <b>{battery}%</b>
            </label>
            <div className="battery-shell" aria-hidden="true">
              <i style={{ width: `${battery}%`, background: hue }} />
            </div>
            <input
              id="battery"
              type="range"
              min={0}
              max={100}
              step={5}
              value={battery}
              onChange={(e) => setBattery(Number(e.target.value))}
            />
            <p className="battery-line" aria-live="polite">
              {batteryLine(battery)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const DETAILS = [
  { label: 'Ring size', value: 'US 6½', emoji: '💍' },
  { label: 'Coffee order', value: 'Oat flat white, extra hot', emoji: '☕' },
  { label: 'Favourite flower', value: 'Peonies — never lilies', emoji: '🌸' },
  { label: 'Dream trip', value: 'Kyoto in autumn', emoji: '✈️' },
  { label: 'Allergies', value: 'Shellfish', emoji: '🩺' },
  { label: 'Comfort meal', value: 'Mum’s jollof', emoji: '🍲' },
];

export function DetailsRow() {
  const [flipped, setFlipped] = useState<Set<number>>(() => new Set([1]));
  const toggle = (i: number) =>
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section className="section details-section">
      <div className="container feature-row reverse">
        <div className="feature-copy reveal">
          <span className="overline">The details</span>
          <h2 className="title1">Get the ring size right. And the coffee order.</h2>
          <p className="lead">
            A little wiki about each other: sizes, allergies, favourites, the dream trip. You fill in theirs, they fill
            in yours, and the home screen tells you how much you know.
          </p>
          <p className="hint-line">
            <Icon name="sparkle" size={16} /> Tap a card to reveal what Sam wrote down.
          </p>
        </div>

        <div className="detail-cards reveal" style={delay(100)}>
          {DETAILS.map((d, i) => {
            const on = flipped.has(i);
            return (
              <button
                key={d.label}
                type="button"
                className={`flip ${on ? 'on' : ''}`}
                aria-pressed={on}
                aria-label={on ? `${d.label}: ${d.value}` : `Reveal ${d.label}`}
                onClick={() => toggle(i)}
              >
                <span className="flip-inner">
                  <span className="flip-front">
                    <span className="flip-emoji" aria-hidden="true">
                      {d.emoji}
                    </span>
                    <strong>{d.label}</strong>
                    <small>Tap to reveal</small>
                  </span>
                  <span className="flip-back">
                    <small>{d.label}</small>
                    <strong>{d.value}</strong>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const COACH_Q = 'We keep arguing about chores. How do I bring it up without it turning into a fight?';
const COACH_A =
  'Start with how it feels, not who does what: “I’ve been feeling stretched thin — can we look at the week together?” Pick a calm evening, not the moment you spot the dishes. And ask what they’d change too.';

export function CoachRow() {
  const [ref, started] = useInView<HTMLDivElement>({ once: true });
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  // Reduced motion shows the whole reply at once rather than typing it out.
  const typed = reduced ? COACH_A.length : progress;

  useEffect(() => {
    if (!started || reduced || progress >= COACH_A.length) return;
    const t = window.setTimeout(() => setProgress((n) => Math.min(COACH_A.length, n + 3)), progress === 0 ? 900 : 22);
    return () => window.clearTimeout(t);
  }, [started, progress, reduced]);

  const done = typed >= COACH_A.length;

  return (
    <section className="section">
      <div className="container feature-row">
        <div className="feature-copy reveal">
          <span className="overline">Coach</span>
          <h2 className="title1">A coach that’s only yours.</h2>
          <p className="lead">
            For the conversation you’re not sure how to start. Ask an AI coach, attach a screenshot if it helps, and
            keep the whole thread to yourself.
          </p>
          <ul className="ticks">
            <li>
              <Icon name="lock" size={18} /> Your partner can never see your coach chats
            </li>
            <li>
              <Icon name="check" size={18} /> Free questions every day, unlimited with Premium
            </li>
            <li>
              <Icon name="shield" size={18} /> Friendly guidance, not therapy
            </li>
          </ul>
        </div>

        <div ref={ref} className="phone-col reveal" style={delay(100)}>
          <PhoneFrame
            label="Preview of a private coach conversation"
            hint={
              done && !reduced ? (
                <button type="button" className="hint-btn" onClick={() => setProgress(0)}>
                  <Icon name="sparkle" size={14} /> Replay
                </button>
              ) : (
                <>
                  <Icon name="lock" size={14} /> Only you can see this
                </>
              )
            }
          >
            <div className="ph-chat-head">
              <span className="chat-avatar">
                <Icon name="sparkle" size={15} />
              </span>
              <span>
                <strong>Coach</strong>
                <small>2 free questions left today</small>
              </span>
              <span className="private-pill">
                <Icon name="lock" size={11} /> Only you
              </span>
            </div>
            <div className="ph-thread">
              <p className="bubble me">
                <span>{COACH_Q}</span>
              </p>
              {started ? (
                <p className="bubble coach" aria-live="polite">
                  {typed === 0 ? (
                    <span className="typing" aria-label="Coach is typing">
                      <i />
                      <i />
                      <i />
                    </span>
                  ) : (
                    <span>
                      {COACH_A.slice(0, typed)}
                      {!done ? <i className="cursor" /> : null}
                    </span>
                  )}
                </p>
              ) : null}
            </div>
            <PhoneDock>
              <PhoneComposer placeholder="Ask anything…" />
              <PhoneTabs active="coach" />
            </PhoneDock>
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}

function diffParts(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

function nextAnniversary(from: Date, now: Date) {
  const next = new Date(now.getFullYear(), from.getMonth(), from.getDate());
  if (next.getTime() <= now.getTime()) next.setFullYear(now.getFullYear() + 1);
  return next;
}

const pad = (n: number) => String(n).padStart(2, '0');
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

function defaultDate() {
  const now = new Date();
  // Three years and two months ago, on the 14th — a date whose next
  // anniversary is always comfortably in the future.
  const d = new Date(now.getFullYear() - 3, now.getMonth() - 2, 14);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** YourLovePage's live countdown, pointed at the app's "together since" date. */
export function TogetherCounter() {
  const [value, setValue] = useState(defaultDate);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const since = value ? new Date(`${value}T00:00:00`) : null;
  const valid = since && !Number.isNaN(since.getTime()) && since.getTime() <= now.getTime();
  const parts = valid ? diffParts(since, now) : null;
  const totalDays = valid ? Math.floor((now.getTime() - since.getTime()) / 86_400_000) : 0;
  const next = valid ? nextAnniversary(since, now) : null;
  const left = next ? Math.max(0, next.getTime() - now.getTime()) : 0;
  const cd = {
    d: Math.floor(left / 86_400_000),
    h: Math.floor(left / 3_600_000) % 24,
    m: Math.floor(left / 60_000) % 60,
    s: Math.floor(left / 1000) % 60,
  };
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  return (
    <section className="section counter-section">
      <div className="container">
        <div className="counter card reveal">
          <div className="counter-copy">
            <span className="overline">Together since</span>
            <h2 className="title1">Every day counts. So we count them.</h2>
            <p className="muted">Add the day you got together and it lives on your home screen. Try yours:</p>
            <label className="date-field">
              <span className="visually-hidden">Date you got together</span>
              <Icon name="calendar" size={18} />
              <input type="date" value={value} max={today} onChange={(e) => setValue(e.target.value)} />
            </label>
          </div>

          <div className="counter-out" aria-live="polite">
            {parts ? (
              <>
                <p className="counter-big">
                  {parts.years > 0 ? <span>{plural(parts.years, 'year')}</span> : null}
                  <span>{plural(parts.months, 'month')}</span>
                  <span>{plural(parts.days, 'day')}</span>
                </p>
                <p className="counter-sub">
                  That’s <b>{totalDays.toLocaleString()}</b> days, and roughly{' '}
                  <b>{Math.floor(totalDays / 7).toLocaleString()}</b> weekends.
                </p>
                <div className="countdown" aria-label="Time until your next anniversary">
                  {(
                    [
                      ['days', cd.d],
                      ['hrs', cd.h],
                      ['min', cd.m],
                      ['sec', cd.s],
                    ] as const
                  ).map(([k, v]) => (
                    <span key={k}>
                      <b>{k === 'days' ? v : pad(v)}</b>
                      <small>{k}</small>
                    </span>
                  ))}
                </div>
                <p className="counter-foot">until your next anniversary</p>
              </>
            ) : (
              <p className="counter-sub">Pick a date in the past to see your count.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const ITEMS: { label: string; icon: IconName; shared: boolean }[] = [
  { label: 'Daily check-ins & streak', icon: 'flame', shared: true },
  { label: 'Calendar & reminders', icon: 'calendar', shared: true },
  { label: 'Bucket list', icon: 'list', shared: true },
  { label: 'Gallery', icon: 'image', shared: true },
  { label: 'Details about each other', icon: 'book', shared: true },
  { label: 'Game results', icon: 'dice', shared: true },
  { label: 'Your to-dos', icon: 'check', shared: false },
  { label: 'Your coach conversations', icon: 'chat', shared: false },
];

/** Cupla's "built for two" argument, made concrete: look at the hub as either person. */
export function PrivacySplit() {
  const [viewer, setViewer] = useState<'ada' | 'sam'>('sam');

  return (
    <section id="privacy" className="section privacy">
      <div className="container privacy-grid">
        <div className="reveal">
          <span className="overline">Built for exactly two</span>
          <h2 className="title1">Shared where it helps. Private where it matters.</h2>
          <p className="lead">
            Generic planners assume a team. Family apps assume five people. {'Me&u'} assumes two, and knows that some
            things belong to just one of you.
          </p>
          <ul className="promises">
            <li>
              <Icon name="shield" size={20} />
              <span>
                <b>We don’t sell what you write.</b> Check-ins, photos and messages are never shared with advertisers.
              </span>
            </li>
            <li>
              <Icon name="lock" size={20} />
              <span>
                <b>Only your hub can see your hub.</b> Every shared item is locked to the two of you on our servers.
              </span>
            </li>
            <li>
              <Icon name="trash" size={20} />
              <span>
                <b>Leave whenever.</b> You can delete your account and data at any time.
              </span>
            </li>
          </ul>
        </div>

        <div className="viewer card reveal" style={delay(100)}>
          <div className="viewer-head">
            <span>Viewing the hub as</span>
            <div className="segmented" role="radiogroup" aria-label="View the hub as">
              <button
                type="button"
                role="radio"
                aria-checked={viewer === 'ada'}
                className={viewer === 'ada' ? 'on' : ''}
                onClick={() => setViewer('ada')}
              >
                <span className="av you xs">A</span> Ada
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={viewer === 'sam'}
                className={viewer === 'sam' ? 'on' : ''}
                onClick={() => setViewer('sam')}
              >
                <span className="av partner xs">S</span> Sam
              </button>
            </div>
          </div>
          <p className="viewer-caption muted">Ada’s hub, as {viewer === 'ada' ? 'Ada sees it' : 'Sam sees it'}:</p>
          <ul className="viewer-list">
            {ITEMS.map((it) => {
              const hidden = !it.shared && viewer === 'sam';
              return (
                <li key={it.label} className={hidden ? 'hidden-item' : ''}>
                  <span className={`vi-icon ${it.shared ? 'shared' : 'mine'}`}>
                    <Icon name={it.icon} size={16} />
                  </span>
                  <span className="vi-label">{hidden ? 'Private to Ada' : it.label}</span>
                  <span className={`vi-tag ${it.shared ? 'shared' : 'mine'}`}>
                    {it.shared ? (
                      <>
                        <Icon name="heart" size={12} /> Both
                      </>
                    ) : (
                      <>
                        <Icon name={hidden ? 'lock' : 'eye'} size={12} /> {hidden ? 'Locked' : 'Only Ada'}
                      </>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

const PILLARS: { icon: IconName; title: string; body: string }[] = [
  { icon: 'clock', title: 'Under a minute a day', body: 'A check-in is two taps. The rest is there when you want it.' },
  { icon: 'dice', title: 'Playful, not preachy', body: 'Games and nudges, not homework and worksheets.' },
  { icon: 'lock', title: 'Private by default', body: 'Your hub is for two. Some things are for one.' },
  { icon: 'heart', title: 'No guilt trips', body: 'Reminders nudge. They never nag or keep score against each other.' },
];

/** Agapé's four "why" pillars. */
export function Pillars() {
  return (
    <section className="section pillars-section">
      <div className="container">
        <div className="section-head center reveal">
          <span className="overline">Why Me&amp;u</span>
          <h2 className="title1">Small habits, done together.</h2>
        </div>
        <ul className="pillars">
          {PILLARS.map((p, i) => (
            <li key={p.title} className="reveal" style={delay(i * 70)}>
              <span className="pillar-icon">
                <Icon name={p.icon} size={24} />
              </span>
              <h3 className="title3">{p.title}</h3>
              <p className="muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
