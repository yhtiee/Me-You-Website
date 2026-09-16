import { useState, type FormEvent } from 'react';

import { Icon } from '../components/Icon';
import { usePrefersReducedMotion } from '../components/hooks';
import { delay } from '../components/vars';

/** The app's darkened wheel fills — each one clears 4.5:1 under white labels. */
const WHEEL_FILLS = ['#D63C58', '#6E5AC8', '#A35F00', '#4E74B0', '#3B7F5C', '#B04E33'];
const MAX_OPTIONS = 8;
const SPIN_MS = 2600;
const FLIP_MS = 1150;

function CoinFlip() {
  const reduced = usePrefersReducedMotion();
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<'Ada' | 'Sam' | null>(null);
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(0);

  const flip = () => {
    if (busy) return;
    const winner = Math.random() < 0.5 ? 'Ada' : 'Sam';
    // Always forward, at least five turns, ending on the winner's face.
    const base = rotation - (rotation % 360) + 1800;
    const target = base + (winner === 'Sam' ? 180 : 0);
    setBusy(true);
    setResult(null);
    setRotation(target);
    window.setTimeout(
      () => {
        setResult(winner);
        setBusy(false);
        setCount((c) => c + 1);
      },
      reduced ? 0 : FLIP_MS,
    );
  };

  return (
    <div className="game">
      <div className="coin-stage">
        <div
          className="coin"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transitionDuration: reduced ? '0ms' : `${FLIP_MS}ms`,
          }}
        >
          <div className="coin-face front">
            <small>YOU</small>Ada
          </div>
          <div className="coin-face back">
            <small>PARTNER</small>Sam
          </div>
        </div>
        <div className="coin-shadow" />
      </div>
      <p className="game-result" aria-live="polite">
        {result ? (
          <>
            <b>{result}</b> picks tonight’s dinner.
          </>
        ) : busy ? (
          'Flipping…'
        ) : (
          'Who picks dinner?'
        )}
      </p>
      <button type="button" className="btn btn-primary" onClick={flip} disabled={busy}>
        {count ? 'Flip again' : 'Flip the coin'}
      </button>
      <p className="game-note">
        <Icon name="lock" size={14} /> In the app, one of you holds the coin per session, so nobody re-rolls until
        they win.
      </p>
    </div>
  );
}

function wedgePath(i: number, n: number, r: number) {
  const a0 = (i / n) * 2 * Math.PI - Math.PI / 2;
  const a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
  const large = n === 1 ? 1 : 0;
  if (n === 1) return `M ${r} 0 A ${r} ${r} 0 1 1 ${r - 0.01} 0 Z`;
  return `M 0 0 L ${r * Math.cos(a0)} ${r * Math.sin(a0)} A ${r} ${r} 0 ${large} 1 ${r * Math.cos(a1)} ${r * Math.sin(a1)} Z`;
}

function SpinWheel() {
  const reduced = usePrefersReducedMotion();
  const [options, setOptions] = useState(['Tacos', 'Sushi', 'Pasta', 'Pizza', 'Curry', 'Ramen']);
  const [draft, setDraft] = useState('');
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const n = options.length;
  const seg = 360 / n;

  const spin = () => {
    if (busy || n < 2) return;
    const k = Math.floor(Math.random() * n);
    // Land the middle of wedge k under the pointer at 12 o'clock, with a
    // little jitter so it doesn't always stop dead centre.
    const jitter = (Math.random() - 0.5) * seg * 0.6;
    const want = (((-(k * seg + seg / 2 + jitter)) % 360) + 360) % 360;
    const current = ((rotation % 360) + 360) % 360;
    const target = rotation + 360 * 5 + ((want - current + 360) % 360);
    setBusy(true);
    setWinner(null);
    setRotation(target);
    window.setTimeout(
      () => {
        setWinner(options[k]);
        setBusy(false);
      },
      reduced ? 0 : SPIN_MS,
    );
  };

  const add = (e: FormEvent) => {
    e.preventDefault();
    const v = draft.trim().slice(0, 14);
    if (!v || n >= MAX_OPTIONS || options.some((o) => o.toLowerCase() === v.toLowerCase())) return;
    setOptions([...options, v]);
    setDraft('');
    setWinner(null);
  };

  const remove = (o: string) => {
    if (busy || n <= 2) return;
    setOptions(options.filter((x) => x !== o));
    setWinner(null);
  };

  return (
    <div className="game">
      <div className="wheel-stage">
        <span className="wheel-pointer" aria-hidden="true" />
        <svg
          className="wheel"
          viewBox="-104 -104 208 208"
          role="img"
          aria-label={`Wheel with ${n} options: ${options.join(', ')}`}
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: reduced ? '0ms' : `${SPIN_MS}ms`,
          }}
        >
          <circle r="103" fill="var(--amber)" />
          {options.map((o, i) => {
            const mid = (i + 0.5) * seg;
            return (
              <g key={o}>
                <path d={wedgePath(i, n, 96)} fill={WHEEL_FILLS[i % WHEEL_FILLS.length]} />
                <text
                  transform={`rotate(${mid - 90}) translate(58 0)`}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#fff"
                  fontSize={n > 6 ? 10 : 12}
                  fontWeight={700}
                  fontFamily="Manrope, sans-serif"
                >
                  {o}
                </text>
              </g>
            );
          })}
          <circle r="18" fill="#fff" />
          <path
            d="M6.5 -1.2 0 5.3-6.5-1.2a3.9 3.9 0 0 1 6.5-4.4 3.9 3.9 0 0 1 6.5 4.4Z"
            fill="var(--rose)"
          />
        </svg>
      </div>
      <p className="game-result" aria-live="polite">
        {winner ? (
          <>
            The wheel says: <b>{winner}</b>
          </>
        ) : busy ? (
          'Spinning…'
        ) : (
          'Can’t decide? Let it decide.'
        )}
      </p>
      <button type="button" className="btn btn-primary" onClick={spin} disabled={busy}>
        Spin the wheel
      </button>

      <div className="wheel-edit">
        <ul aria-label="Wheel options">
          {options.map((o, i) => (
            <li key={o}>
              <span className="swatch" style={{ background: WHEEL_FILLS[i % WHEEL_FILLS.length] }} />
              {o}
              <button
                type="button"
                onClick={() => remove(o)}
                disabled={busy || n <= 2}
                aria-label={`Remove ${o}`}
              >
                <Icon name="close" size={12} />
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={add}>
          <label className="visually-hidden" htmlFor="wheel-add">
            Add an option
          </label>
          <input
            id="wheel-add"
            value={draft}
            maxLength={14}
            placeholder={n >= MAX_OPTIONS ? 'Wheel is full' : 'Add your own…'}
            disabled={n >= MAX_OPTIONS || busy}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="submit" className="icon-btn" aria-label="Add option" disabled={!draft.trim() || n >= MAX_OPTIONS}>
            <Icon name="plus" size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

const TABS = [
  { key: 'coin', label: 'Coin flip', tint: 'amber' },
  { key: 'wheel', label: 'Spin the wheel', tint: 'rose' },
] as const;

export function PlaySection() {
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('coin');

  return (
    <section id="play" className="section play-section">
      <div className="container feature-row reverse">
        <div className="feature-copy reveal">
          <span className="overline">Play</span>
          <h2 className="title1">Settle it. Don’t sweat it.</h2>
          <p className="lead">
            A coin for who’s being the bigger person. A wheel for where you’re eating. A date setter for when neither
            of you can choose, and a trivia game that proves who was actually listening.
          </p>
          <ul className="ticks">
            <li>
              <Icon name="check" size={18} /> Results land on both phones, live
            </li>
            <li>
              <Icon name="check" size={18} /> Write your own “How well do you know me?” questions
            </li>
            <li>
              <Icon name="check" size={18} /> Swipe on movies together until you match
            </li>
          </ul>
        </div>

        <div className="arcade card reveal" style={delay(100)}>
          <div className="segmented" role="tablist" aria-label="Try a game">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                id={`tab-${t.key}`}
                aria-selected={tab === t.key}
                aria-controls={`panel-${t.key}`}
                className={tab === t.key ? 'on' : ''}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
            {tab === 'coin' ? <CoinFlip /> : <SpinWheel />}
          </div>
        </div>
      </div>
    </section>
  );
}
