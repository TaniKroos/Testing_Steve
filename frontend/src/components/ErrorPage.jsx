import { Link } from "react-router-dom";

export function ErrorPage({ error, resetErrorBoundary }) {
  return <main className="error-page" id="main-content"><p className="kicker">SOMETHING WENT AWRY</p><h1>We could not load this journey.</h1><p>{error?.message || "Please try again or return to the homepage."}</p><div><button className="primary-button" onClick={resetErrorBoundary}>Try again</button> <Link className="outline-button" to="/">Return home</Link></div></main>;
}
export function NotFound() { return <main className="error-page" id="main-content"><p className="kicker">404</p><h1>This path has wandered off.</h1><p>The page you requested does not exist.</p><Link className="primary-button" to="/">Discover journeys →</Link></main>; }
