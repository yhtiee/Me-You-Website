import { Footer, Nav } from '../components/Chrome';
import { useRevealOnScroll } from '../components/hooks';
import { Faq, FinalCta, Pricing } from './Close';
import { Hero, Ribbon } from './Hero';
import { PlaySection } from './Play';
import {
  CheckInRow,
  CoachRow,
  DetailsRow,
  FeatureGrid,
  HowItWorks,
  Pillars,
  PrivacySplit,
  TogetherCounter,
  TwoWays,
} from './Story';

export default function Landing() {
  useRevealOnScroll();
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Ribbon />
        <TwoWays />
        <HowItWorks />
        <FeatureGrid />
        <CheckInRow />
        <PlaySection />
        <DetailsRow />
        <CoachRow />
        <TogetherCounter />
        <PrivacySplit />
        <Pillars />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
