import { routes, site } from '../site';
import { Callout, LegalLayout, type LegalSection } from './LegalLayout';

const mail = (addr: string) => <a href={`mailto:${addr}`}>{addr}</a>;

const sections: LegalSection[] = [
  {
    id: 'agreement',
    title: 'The agreement',
    body: (
      <p>
        These terms are an agreement between you and {site.legalName} (“we”, “us”) for your use of the {site.name}{' '}
        apps and website (the “service”). By creating an account or using the service, you agree to them and to our{' '}
        <a href={routes.privacy}>privacy policy</a>. If you don’t agree, please don’t use the service.
      </p>
    ),
  },
  {
    id: 'eligibility',
    title: 'Who can use Me&u',
    body: (
      <ul>
        <li>You must be at least {site.minimumAge} years old.</li>
        <li>You must be able to enter a binding contract where you live.</li>
        <li>You can belong to one hub at a time, and a hub has at most two members.</li>
        <li>You must not use the service if we have previously banned you, or where the law doesn’t allow it.</li>
      </ul>
    ),
  },
  {
    id: 'account',
    title: 'Your account',
    body: (
      <p>
        Give us accurate information and keep your password to yourself. You are responsible for what happens on your
        account. Tell us straight away at {mail(site.contactEmail)} if you think someone else has accessed it.
      </p>
    ),
  },
  {
    id: 'hub',
    title: 'Your hub and your partner',
    body: (
      <>
        <p>
          A hub is shared by two people. Anything you add to a shared part of the app, such as check-ins, the
          calendar, the bucket list, the gallery, the details wiki or game results, can be seen and in some cases
          changed by your partner. Your to-dos and coach conversations are private to you.
        </p>
        <p>
          Only invite someone you know and trust. Invite codes are single-use. Don’t post them publicly.
        </p>
        <p>
          Either of you can unpair at any time. Unpairing ends the hub for both of you: everything shared in it is
          deleted, and each of you keeps your account and private data. Deleting your account is different: shared
          items you created stay in the hub for your partner, without your name, as explained on the{' '}
          <a href={routes.deleteAccount}>account deletion page</a>.
        </p>
      </>
    ),
  },
  {
    id: 'content',
    title: 'Your content',
    body: (
      <>
        <p>
          You own what you create in {site.name}: your text, photos and answers (“your content”). You give us a
          worldwide, non-exclusive, royalty-free licence to host, store, copy, process and display your content only to
          run and improve the service for you and your partner. This licence ends when your content is deleted from our
          systems.
        </p>
        <p>
          You confirm you have the right to share everything you upload, and that it doesn’t break the law or anyone
          else’s rights. That includes photos of other people.
        </p>
      </>
    ),
  },
  {
    id: 'conduct',
    title: 'Acceptable use',
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>use the service to harass, threaten, stalk, control or monitor anyone without their consent;</li>
          <li>
            upload content that is illegal, sexually exploits anyone, promotes violence, or infringes someone’s
            rights — see our <a href={routes.childSafety}>child safety standards</a> for how we handle child sexual
            abuse and exploitation;
          </li>
          <li>impersonate someone or create an account for another person;</li>
          <li>try to access data that isn’t yours, or get around security, rate limits or usage limits;</li>
          <li>reverse engineer, scrape, overload or disrupt the service, except where the law allows it;</li>
          <li>click your own ads, or use any automated or fraudulent way of earning ad rewards;</li>
          <li>use the service to build a competing product, or to train AI models.</li>
        </ul>
        <p>
          If you’re worried about your safety in a relationship, please contact local support services or emergency
          services.
        </p>
      </>
    ),
  },
  {
    id: 'coach',
    title: 'The AI coach',
    body: (
      <>
        <p>
          The coach uses artificial intelligence to offer general relationship guidance. Its answers are generated
          automatically, may be inaccurate or incomplete, and are not reviewed by a person.
        </p>
        <Callout tone="iris" title="Not professional advice">
          The coach is not a therapist, counsellor, doctor or lawyer, and it isn’t a crisis service. Don’t rely on it
          for decisions about your health, safety, legal or financial matters. If you or someone else is in danger,
          contact local emergency services straight away.
        </Callout>
        <p>
          Free accounts get a limited number of coach questions each day, and can earn a limited number more by
          watching ads. We may change these limits.
        </p>
      </>
    ),
  },
  {
    id: 'play',
    title: 'Games',
    body: (
      <p>
        Play is for fun. Coin flips, the wheel and the date setter produce random results. What you do with them is up
        to you and your partner. Movie information is provided by TMDB. This product uses the TMDB API but is not
        endorsed or certified by TMDB.
      </p>
    ),
  },
  {
    id: 'ads',
    title: 'Ads and rewards',
    body: (
      <p>
        The free version shows ads. Watching an optional rewarded ad can unlock a small in-app benefit, such as an
        extra coach question. Rewards have no cash value, can’t be transferred, are subject to daily limits, and are
        only granted once the ad network confirms the ad was watched. We may change or end rewards at any time.
      </p>
    ),
  },
  {
    id: 'premium',
    title: 'Premium subscriptions',
    body: (
      <ul>
        <li>
          Premium costs {site.premium.price} per {site.premium.period} (or the local equivalent shown in your app
          store). It is billed through the Apple App Store or Google Play, under their terms.
        </li>
        <li>
          Premium is per person. Your subscription covers your account only — it doesn’t unlock anything for your
          partner, who can subscribe separately.
        </li>
        <li>
          Subscriptions renew automatically at the end of each period unless you cancel at least 24 hours before it
          ends. Manage or cancel in your App Store or Google Play account settings. Deleting the app doesn’t cancel a
          subscription.
        </li>
        <li>
          Refunds are handled by Apple or Google under their refund policies. Where the law gives you a right to cancel
          or a refund, nothing in these terms limits it.
        </li>
        <li>
          We may change the price. Any change applies from your next renewal, and your store will tell you in advance
          where required.
        </li>
        <li>
          Premium follows you, not your hub. It stays with your account if you unpair or join a different hub.
        </li>
      </ul>
    ),
  },
  {
    id: 'ip',
    title: 'Our service',
    body: (
      <p>
        The service, including its design, code, illustrations and brand, belongs to us or our licensors. Subject to
        these terms, we give you a personal, non-transferable, revocable licence to use the app on devices you own or
        control. If you send us feedback, we may use it without owing you anything.
      </p>
    ),
  },
  {
    id: 'termination',
    title: 'Ending things',
    body: (
      <p>
        You can stop using the service and delete your account at any time. We may suspend or close your account if
        you seriously or repeatedly break these terms, if the law requires it, or to protect other people. Where
        reasonable, we’ll tell you why first. Sections that by their nature should continue, such as ownership,
        disclaimers and limits of liability, survive termination.
      </p>
    ),
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    body: (
      <p>
        We work hard to keep {site.name} reliable, but the service is provided “as is” and “as available”. To the
        extent the law allows, we make no warranties, express or implied, including of merchantability, fitness for a
        particular purpose or non-infringement. We don’t promise that the service will be uninterrupted or error-free,
        or that notifications will always arrive. Some places don’t allow these exclusions, so they may not all apply to
        you.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Limits of liability',
    body: (
      <p>
        To the extent the law allows, we aren’t liable for indirect, incidental, special, consequential or punitive
        damages, or for loss of data, profits or goodwill. Our total liability for any claim relating to the service is
        limited to the greater of the amount you paid us in the 12 months before the claim or US$50. Nothing in these
        terms limits liability for death or personal injury caused by negligence, for fraud, or for anything else that
        can’t be limited by law.
      </p>
    ),
  },
  {
    id: 'indemnity',
    title: 'Indemnity',
    body: (
      <p>
        If you break these terms or the law, and a third party makes a claim against us as a result, you agree to cover
        our reasonable losses and costs from that claim, to the extent the law allows.
      </p>
    ),
  },
  {
    id: 'stores',
    title: 'App Store and Google Play',
    body: (
      <>
        <p>If you got the app from Apple’s App Store:</p>
        <ul>
          <li>
            these terms are between you and us, not Apple, and we, not Apple, are responsible for the app and its
            content;
          </li>
          <li>Apple has no obligation to provide maintenance or support for the app;</li>
          <li>
            if the app fails to meet an applicable warranty, you may notify Apple for a refund of the purchase price (if
            any), and Apple has no other warranty obligation;
          </li>
          <li>
            Apple isn’t responsible for any product claims, including consumer protection, legal compliance or
            intellectual property claims relating to the app;
          </li>
          <li>you confirm you aren’t in a sanctioned country or on a restricted-party list;</li>
          <li>
            Apple and its subsidiaries are third-party beneficiaries of these terms and may enforce them against you.
          </li>
        </ul>
        <p>Your use of Google Play is also subject to Google Play’s terms of service.</p>
      </>
    ),
  },
  {
    id: 'law',
    title: 'Governing law',
    body: (
      <p>
        These terms are governed by the laws of {site.governingLaw}. Disputes will be heard in its courts, but if you
        are a consumer you keep the protection of the mandatory laws of the country where you live, and you may bring
        claims there.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes',
    body: (
      <p>
        We may update these terms. If a change is material, we’ll tell you in the app or by email at least 14 days
        before it takes effect. If you keep using the service after that, the new terms apply. If you don’t agree, you
        can delete your account.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <p>
        {site.legalName}, {site.address}. Email {mail(site.contactEmail)}.
      </p>
    ),
  },
];

export default function Terms() {
  return (
    <LegalLayout
      eyebrow="Terms of service"
      title="The ground rules, for both of you."
      intro={
        <p>
          These terms apply when you use {site.name}. We’ve kept them as readable as we can. Please read them, as they
          affect your rights.
        </p>
      }
      sections={sections}
    />
  );
}
