import { site } from '../site';
import { AppleMark, PlayMark } from './Icon';

/**
 * Plain store buttons, not Apple's and Google's badge artwork. Swap in the
 * official badges once the listings are live — both stores have usage rules for
 * those, and a "coming soon" state is not something either badge allows.
 */
export function StoreButtons({ tone = 'default' }: { tone?: 'default' | 'onColor' }) {
  const stores = [
    { key: 'ios', label: 'App Store', kicker: 'Download on the', mark: <AppleMark />, ...site.stores.ios },
    { key: 'android', label: 'Google Play', kicker: 'Get it on', mark: <PlayMark />, ...site.stores.android },
  ];

  return (
    <div className={`store-buttons ${tone === 'onColor' ? 'on-color' : ''}`}>
      {stores.map((s) =>
        s.live ? (
          <a key={s.key} className="store-btn" href={s.url} target="_blank" rel="noopener">
            {s.mark}
            <span>
              <small>{s.kicker}</small>
              {s.label}
            </span>
          </a>
        ) : (
          <span key={s.key} className="store-btn is-soon" aria-label={`${s.label}, coming soon`}>
            {s.mark}
            <span>
              <small>Coming soon to</small>
              {s.label}
            </span>
          </span>
        ),
      )}
    </div>
  );
}
