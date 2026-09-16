import { Footer, Nav } from './components/Chrome';
import { routes } from './site';

export default function NotFound() {
  return (
    <>
      <Nav variant="page" />
      <main id="main" className="not-found">
        <img src="/images/details.png" alt="" width={450} height={380} />
        <h1 className="title1">This page wandered off.</h1>
        <p className="lead">It isn’t here, but the two of you still are.</p>
        <a className="btn btn-primary" href={routes.home}>
          Back to Me&amp;u
        </a>
      </main>
      <Footer />
    </>
  );
}
