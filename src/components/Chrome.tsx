import { useEffect, useState } from 'react';

import { routes, site } from '../site';
import { Icon } from './Icon';
import { useTheme } from './hooks';

const HOME_LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#play', label: 'Play' },
  { href: '#privacy', label: 'Privacy' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

export function Logo() {
  return (
    <a className="logo" href={routes.home} aria-label={`${site.name} home`}>
      <img src="/images/icon.png" alt="" width={36} height={36} />
      <span>
        Me<span className="logo-amp">&amp;</span>u
      </span>
    </a>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
    >
      <Icon name={dark ? 'sun' : 'moon'} size={20} />
    </button>
  );
}

/**
 * The app's floating tab bar, reused as the site nav: a glass capsule inset
 * from the edges with the page running underneath it. It gains its shadow only
 * once the page has scrolled, so at rest it sits flat on the wash.
 */
export function Nav({ variant = 'home' }: { variant?: 'home' | 'page' }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = variant === 'home' ? HOME_LINKS : HOME_LINKS.map((l) => ({ ...l, href: `/${l.href}` }));

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`nav-wrap ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <nav className="nav" aria-label="Main">
        <Logo />
        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <ThemeToggle />
          <a className="btn btn-primary nav-cta" href={variant === 'home' ? '#download' : '/#download'}>
            Get the app
          </a>
          <button
            type="button"
            className="icon-btn nav-menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </nav>
      <div id="mobile-menu" className={`mobile-menu ${open ? 'is-open' : ''}`} hidden={!open}>
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a
          className="btn btn-primary"
          href={variant === 'home' ? '#download' : '/#download'}
          onClick={() => setOpen(false)}
        >
          Get the app
        </a>
      </div>
    </header>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p className="muted">{site.tagline} Check-ins, games and the little details, kept for the two of you.</p>
        </div>
        <div>
          <h4>Product</h4>
          <a href="/#features">Features</a>
          <a href="/#play">Play</a>
          <a href="/#pricing">Pricing</a>
          <a href="/#faq">FAQ</a>
        </div>
        <div>
          <h4>Help</h4>
          <a href={routes.support}>Support</a>
          <a href={`mailto:${site.contactEmail}`}>Contact us</a>
          <a href={routes.deleteAccount}>Delete your account</a>
        </div>
        <div>
          <h4>Legal</h4>
          <a href={routes.privacy}>Privacy policy</a>
          <a href={routes.terms}>Terms of service</a>
          <a href={`${routes.privacy}#cookies`}>Cookies</a>
          <a href={`${routes.privacy}#choices`}>Ad choices</a>
        </div>
      </div>
      <div className="container footer-base">
        <span>
          © {year} {site.legalName}
        </span>
        <span>Made for two, with care.</span>
      </div>
    </footer>
  );
}
