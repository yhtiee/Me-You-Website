import { Icon } from '../components/Icon';
import { routes, site } from '../site';
import { Callout, LegalLayout, type LegalSection } from './LegalLayout';

const mail = (addr: string) => <a href={`mailto:${addr}`}>{addr}</a>;

/*
 * Google Play requires apps with social features to publish their standards
 * against child sexual abuse and exploitation, and to link that page in the
 * Console (App content → Child safety standards). Play's checks are that the
 * page loads, that it is about CSAE, and that it names the app or the
 * developer — all three are covered below. The Console separately asks for an
 * in-app reporting route and a named contact; both are described here so the
 * answers and the page agree.
 */
const sections: LegalSection[] = [
  {
    id: 'commitment',
    title: 'Our commitment',
    body: (
      <>
        <p>
          {site.name} is published by {site.legalName}. We have zero tolerance for child sexual abuse and
          exploitation (CSAE), and for child sexual abuse material (CSAM). There is no version of our service in
          which this content or behaviour is acceptable.
        </p>
        <p>
          {site.name} is an app for two adults in a relationship with each other. It is not a place to meet
          strangers, and it is not for anyone under {site.minimumAge}. These standards explain what we prohibit, how
          the app is built to prevent it, how to report a concern, and what we do about reports.
        </p>
      </>
    ),
  },
  {
    id: 'prohibited',
    title: 'What is prohibited',
    body: (
      <>
        <p>The following are banned everywhere in {site.name}, including in private hubs and coach conversations:</p>
        <ul>
          <li>
            <b>Child sexual abuse material.</b> Any image, video or other depiction of a minor in a sexual context,
            whether real, edited or generated.
          </li>
          <li>
            <b>Sexualisation of minors.</b> Sexual commentary about a minor, or material that presents a minor as an
            object of sexual interest.
          </li>
          <li>
            <b>Grooming and solicitation.</b> Building a relationship with a minor for sexual purposes, requesting
            sexual material from a minor, or arranging to meet a minor for sexual purposes.
          </li>
          <li>
            <b>Sextortion.</b> Threatening to share someone's intimate images to obtain money, further images or
            anything else.
          </li>
          <li>
            <b>Trafficking and off-platform harm.</b> Advertising, recruiting or facilitating the sexual exploitation
            of a minor, including linking to it elsewhere.
          </li>
          <li>
            <b>Accounts held by minors.</b> Using the app while under {site.minimumAge}, or creating an account for
            someone under {site.minimumAge}.
          </li>
        </ul>
        <p>
          These rules are part of our <a href={routes.terms}>terms of service</a>, which every account agrees to.
        </p>
      </>
    ),
  },
  {
    id: 'design',
    title: 'How the app is built to prevent it',
    body: (
      <>
        <p>Most of the risk in a social app comes from strangers finding each other. {site.name} has none of that:</p>
        <ul>
          <li>
            <b>Adults only.</b> The app is for people aged {site.minimumAge} and over, and the store listing is rated
            for adults.
          </li>
          <li>
            <b>No discovery of strangers.</b> There is no public profile, no feed, no search for other people, no
            friend suggestions and no way to message anyone outside your own hub.
          </li>
          <li>
            <b>Two people, by invitation only.</b> A hub holds exactly two members. The second person joins with a
            single-use code shared privately by the first, and the code stops working the moment it is used.
          </li>
          <li>
            <b>Nothing is public.</b> Photos, messages and everything else exist only inside a hub, visible to its
            two members.
          </li>
          <li>
            <b>Anyone can leave.</b> Either member can end the hub, and anyone can delete their account and data from
            the app or from our <a href={routes.deleteAccount}>deletion page</a>.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'report',
    title: 'How to report a concern',
    body: (
      <>
        <p>
          If you believe a {site.name} account is being used to harm a child, tell us. You do not need an account to
          report, and you may report anonymously.
        </p>
        <div className="split-cards">
          <div className="split-card shared">
            <strong>
              <Icon name="mail" size={16} /> Email us
            </strong>
            <ul>
              <li>
                Write to {mail(site.safetyEmail)} with “Child safety” in the subject line.
              </li>
              <li>Include anything that helps us find the account: the email address on it, and what happened.</li>
            </ul>
          </div>
          <div className="split-card mine">
            <strong>
              <Icon name="chat" size={16} /> From inside the app
            </strong>
            <ul>
              <li>
                Open <b>You → Settings → Help &amp; support</b>, which reaches the same team.
              </li>
              <li>Reports from inside the app are treated exactly the same way.</li>
            </ul>
          </div>
        </div>
        <Callout tone="rose" title="If a child is in immediate danger">
          Contact your local emergency services first. In the United States you can also report to the National
          Center for Missing &amp; Exploited Children at report.cybertip.org or 1-800-843-5678. Elsewhere, contact
          your national child protection hotline or police.
        </Callout>
      </>
    ),
  },
  {
    id: 'response',
    title: 'What we do about reports',
    body: (
      <>
        <ul>
          <li>
            <b>We review promptly.</b> We aim to assess every child safety report within 24 hours of receiving it,
            ahead of anything else in our queue.
          </li>
          <li>
            <b>We remove and disable.</b> Confirmed CSAE content is removed, and the accounts involved are terminated
            without a further warning. We also close the hub so nothing remains shared.
          </li>
          <li>
            <b>We preserve evidence.</b> Where the law requires or permits it, we retain the relevant material and
            account records so investigators can use them, rather than deleting everything at once.
          </li>
          <li>
            <b>We report to the authorities.</b> We report apparent CSAM to the appropriate authorities, which may
            include the National Center for Missing &amp; Exploited Children (NCMEC) and law enforcement in the
            country concerned, and we cooperate with their requests.
          </li>
          <li>
            <b>We act on underage accounts.</b> An account we believe belongs to someone under {site.minimumAge} is
            closed and its data deleted.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'compliance',
    title: 'Legal compliance',
    body: (
      <p>
        We comply with applicable laws on child sexual abuse and exploitation in the places we operate, and with
        Google Play's Child Safety Standards policy and Apple's App Store guidelines. We keep these standards under
        review and update them as our app and the law change.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Point of contact',
    body: (
      <p>
        Questions about these standards, our CSAM prevention practices, or a specific report go to{' '}
        {mail(site.safetyEmail)}. That address reaches the person at {site.legalName} responsible for child safety,
        who is named in our Google Play Console declaration and is available to speak with platforms and
        authorities.
        <br />
        <br />
        {site.legalName}
        <br />
        {site.address}
      </p>
    ),
  },
];

export default function ChildSafety() {
  return (
    <LegalLayout
      eyebrow="Child safety standards"
      title="Our standards against child sexual abuse and exploitation"
      intro={
        <p>
          {site.name} is built for two adults in a relationship. We do not tolerate child sexual abuse or
          exploitation, and this page explains what that means in practice.
        </p>
      }
      sections={sections}
    />
  );
}
