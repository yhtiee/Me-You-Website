import type { ReactNode } from 'react';

import { Icon, type IconName } from './Icon';

/**
 * The phone every demo on the page lives in, so they read as screens from one
 * app rather than a collage of widgets. The screen is a flex column: content
 * stacks from the top, and anything in a `PhoneDock` sinks to the bottom where
 * the app keeps its composer and floating tab bar.
 */
export function PhoneFrame({
  label,
  hint,
  muted = false,
  className = '',
  children,
}: {
  label: string;
  hint?: ReactNode;
  /** Sunken screen background — the "without Me&u" evening. */
  muted?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`phone ${muted ? 'is-muted' : ''} ${className}`} role="group" aria-label={label}>
      <div className="phone-screen">
        <div className="phone-status" aria-hidden="true">
          <span>9:41</span>
          <span className="phone-island" />
          <span>100%</span>
        </div>
        {children}
      </div>
      {hint ? (
        <div className="phone-hint" aria-live="polite">
          {hint}
        </div>
      ) : null}
    </div>
  );
}

/** Pins its children to the bottom of the screen. */
export function PhoneDock({ children }: { children: ReactNode }) {
  return <div className="ph-dock">{children}</div>;
}

const TABS: { key: 'home' | 'coach' | 'calendar' | 'you'; icon: IconName }[] = [
  { key: 'home', icon: 'heart' },
  { key: 'coach', icon: 'chat' },
  { key: 'calendar', icon: 'calendar' },
  { key: 'you', icon: 'smile' },
];

/** The app's floating glass tab bar. Decorative: it doesn't navigate. */
export function PhoneTabs({ active }: { active: (typeof TABS)[number]['key'] }) {
  return (
    <div className="ph-tabs" aria-hidden="true">
      {TABS.map((t) => (
        <span key={t.key} className={t.key === active ? 'on' : ''}>
          <Icon name={t.icon} size={18} />
        </span>
      ))}
    </div>
  );
}

export function PhoneComposer({ placeholder }: { placeholder: string }) {
  return (
    <div className="ph-composer" aria-hidden="true">
      <span>{placeholder}</span>
      <span className="send">
        <Icon name="arrow" size={15} />
      </span>
    </div>
  );
}
