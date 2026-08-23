import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Header, MobileTabs } from "./Header";
import { Footer } from "./Footer";
import { Card, salePrice } from "./Card";
import { Icon } from "./Icon";
import { useDebounce } from "../hooks/useDebounce";
import { RippleButton, useReveal } from "./UI";

const styles = [
  ["01", "Slow escapes", "Unhurried stays and soulful places.", "SLOW · STAY · NOTICE"],
  ["02", "Wild routes", "Fresh air, big views, and a little grit.", "WALK · CLIMB · EXHALE"],
  ["03", "Culture close-up", "Meet makers, cooks, and local stories.", "EAT · LEARN · LISTEN"],
];
const steps = [
  ["01", "Find", "Browse journeys shaped around the pace and places you love.", "QUERY · PLACE · PACE"],
  ["02", "Save", "Keep your favourites close while you decide.", "SAVE · DATES · REQUEST"],
  ["03", "Book", "Choose a departure and send a simple booking request.", "CONFIRM · CONNECT · PACK"],
  ["04", "Go", "Meet local hosts and leave with stories that stay generous.", "DEPART · NOTICE · RETURN"],
];
const faqs = [
  ["How small are your groups?", "Most departures have 8–14 travellers. Every journey lists its group size and remaining seats before you request a place."],
  ["What is included in the price?", "Each itinerary clearly lists accommodation, hosted experiences, and meals. Flights and personal extras are always called out separately."],
  ["How do you choose local partners?", "We look for long-term local knowledge, thoughtful working conditions, and a real connection to the places we visit."],
  ["When do I pay?", "A booking request starts a conversation with our team. We will confirm availability and payment timing before you are committed."],
];

export function Discover({ packages, isLoading, isError, retry, onSelect, basket, saved, toggleSaved, toast }) {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");
  const [word, setWord] = useState("wonder");
  const deferredSearch = useDebounce(search);
  useReveal();

  useEffect(() => {
    const words = ["wonder", "the wild", "stories", "sunshine"];
    let index = 0;
    const timer = setInterval(() => { index = (index + 1) % words.length; setWord(words[index]); }, 2200);
    return () => clearInterval(timer);
  }, []);

  const filters = useMemo(() => ({ country: params.get("country") || "", category: params.get("category") || "", sort: params.get("sort") || "recommended" }), [params]);
  const update = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next);
  };
  const countries = [...new Set(packages.map((pkg) => pkg.country))];
  const categories = [...new Set(packages.map((pkg) => pkg.category))];
  const shown = useMemo(() => packages
    .filter((pkg) => `${pkg.title} ${pkg.location}`.toLowerCase().includes(deferredSearch.toLowerCase()) && (!filters.country || pkg.country === filters.country) && (!filters.category || pkg.category === filters.category))
    .sort((a, b) => (filters.sort === "low" ? salePrice(a) - salePrice(b) : filters.sort === "high" ? salePrice(b) - salePrice(a) : filters.sort === "rating" ? b.rating - a.rating : Number(b.featured) - Number(a.featured))), [packages, deferredSearch, filters]);
  const featured = packages.find((item) => item.featured) || packages[0];
  const clearFilters = () => { setSearch(""); setParams({}); };
  const searchFor = (value) => { setSearch(value); update("search", value); document.querySelector("#all-journeys")?.scrollIntoView({ behavior: "smooth" }); };

  return <><Header savedCount={saved.length} basketCount={basket.length} /><main id="main-content">
    <section className="hero">
      <div className="hero-copy"><p className="kicker">EXPEDITION CONSOLE · EST. 2026</p><motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>Fill your basket with <em className="type-word">{word}.</em></motion.h1><p className="hero-text">Thoughtful journeys into the world’s wild, beautiful places — selected for the stories you will bring home.</p><div className="search-bar"><Icon name="search" size={20} /><label className="sr-only" htmlFor="destination-search">Search destinations</label><input id="destination-search" value={search} onChange={(event) => { setSearch(event.target.value); update("search", event.target.value); }} placeholder="Search a destination" /><a className="search-submit" href="#all-journeys">Explore <Icon name="arrow" size={16} /></a></div><div className="search-chips"><span>POPULAR:</span>{["Japan", "Iceland", "Costa Rica"].map((place) => <button key={place} onClick={() => searchFor(place)}>{place}</button>)}</div><div className="hero-ctas"><a className="primary-button" href="#all-journeys">Explore journeys <Icon name="arrow" size={15} /></a><a className="outline-button" href="#how-it-works">How it works</a></div><div className="trust-row"><span>01 · CURATED STAYS</span><span>02 · SMALL GROUPS</span><span>03 · LIGHTER FOOTPRINTS</span></div></div>
      <aside className="hero-console" aria-label="Featured journey">
        <div className="console-top"><span>TRIP CODE / FEATURED ROUTE</span><span className="console-lights"><i /><i /><i /></span></div><div className="console-body"><p>$ travel-basket route --open</p><h2>{featured?.title || "A route worth taking"}</h2><div className="trip-code"><span><strong>{featured ? `JRN-${featured.country.slice(0, 3).toUpperCase()}-${String(featured.duration).replace(/\D/g, "").padStart(2, "0")}D` : "JRN-ROUTE-01"}</strong><br />{featured ? `${featured.location} · ${featured.rating}★ · ${featured.duration}` : "Waiting for the next departure"}</span><button onClick={() => window.navigator.clipboard?.writeText(featured?.title || "Travel Basket")}>COPY</button></div><div className="trip-code"><span>STATUS<br /><strong>{featured ? `${featured.departures?.[0]?.seats ?? "—"} SEATS LEFT` : "ROUTES LOADING"}</strong></span><span>FROM<br /><strong>{featured ? `$${salePrice(featured).toLocaleString()}` : "—"}</strong></span></div></div>
      </aside>
    </section>

    <section id="all-journeys" className="destinations" aria-busy={isLoading} data-reveal><div className="section-heading"><div><p className="kicker">CURATED FOR THE CURIOUS</p><h2>Pick your next <em>good kind of lost.</em></h2></div><p className="result-count" aria-live="polite">{isLoading ? "LOADING JOURNEYS" : `${shown.length} ROUTES FOUND`}</p></div>{isError && <div className="connection-error" role="status"><span>ROUTE INDEX UNAVAILABLE · The rest of the expedition is still open. Check your connection, then retry.</span><button onClick={() => retry()}>RETRY INDEX</button></div>}<div className="filters"><div className="filter-group"><span className="filter-label">DESTINATION</span><button className={`filter-chip ${!filters.country ? "is-active" : ""}`} onClick={() => update("country", "")}>EVERYWHERE</button>{countries.map((country) => <button key={country} className={`filter-chip ${filters.country === country ? "is-active" : ""}`} onClick={() => update("country", country)}>{country}</button>)}</div><div className="filter-group"><span className="filter-label">STYLE</span><button className={`filter-chip ${!filters.category ? "is-active" : ""}`} onClick={() => update("category", "")}>ALL</button>{categories.map((category) => <button key={category} className={`filter-chip ${filters.category === category ? "is-active" : ""}`} onClick={() => update("category", category)}>{category}</button>)}</div><div className="sort-control" aria-label="Sort journeys">{[["recommended", "TOP"], ["low", "LOW $"], ["high", "HIGH $"], ["rating", "RATING"]].map(([value, label]) => <button key={value} className={filters.sort === value ? "is-active" : ""} onClick={() => update("sort", value)}>{label}</button>)}</div><button className="clear-filters" onClick={clearFilters}>RESET</button></div>{isLoading ? <div className="card-grid" role="status" aria-label="Loading journeys">{Array.from({ length: 6 }, (_, index) => <div className="skeleton-card" key={index}><div className="skeleton image" /><div className="skeleton text" /><div className="skeleton text short" /></div>)}</div> : shown.length ? <div className="card-grid">{shown.map((item, index) => <Card key={item.id} item={item} index={index} isSaved={saved.some((line) => line.packageId === item.id)} onToggle={(journey) => { toggleSaved(journey); toast(saved.some((line) => line.packageId === journey.id) ? "Removed from saved journeys." : "Saved for later."); }} onSelect={onSelect} />)}</div> : <div className="empty-state"><h3>No journeys found</h3><p>Try resetting the route index or searching another destination.</p><button className="outline-button" onClick={clearFilters}>Reset filters</button></div>}</section>

    <section className="travel-styles" data-reveal><div><p className="kicker">FIND YOUR PACE</p><h2>What kind of <em>traveller</em> are you?</h2><p>Begin with the feeling you want to bring home.</p></div><div className="style-grid">{styles.map(([number, title, text, code]) => <article key={title}><i>{number}</i><h3>{title}</h3><p>{text}</p><a href="#all-journeys">{code} <Icon name="arrow" size={13} /></a></article>)}</div></section>
    <section id="how-it-works" className="how-it-works" data-reveal><div className="how-copy"><p className="kicker">A SIMPLE PROTOCOL</p><h2>Travel that feels <em>like you.</em></h2><p>Everything you need to go farther, with less friction.</p><div className="step-grid">{steps.map(([number, title, text, code]) => <article key={title}><i>STEP {number}</i><h3>{title}</h3><p>{text}</p><small>{code}</small></article>)}</div></div></section>
    <section id="why-us" className="promise" data-reveal><p className="kicker">THE TRAVEL BASKET WAY</p><h2>Good for your soul.<br /><em>Gentler on the world.</em></h2><div><span>01<br /><b>Locally rooted</b></span><span>02<br /><b>Thoughtfully paced</b></span><span>03<br /><b>Nature first</b></span></div></section>
    <section className="traveller-notes" data-reveal><p className="kicker">POSTCARDS FROM THE ROAD</p><div className="section-heading"><h2>Traveller <em>notes.</em></h2><span className="quote-mark">“</span></div><div className="note-grid">{[["I came home with a quieter mind and a camera roll full of people, not just places.", "Nina, London", "Costa Rica"], ["The whole week had room to breathe. It was exactly the reset I didn’t know I needed.", "Marcus, Melbourne", "Japan"], ["Every detail felt considered, but never over-planned. Pure magic.", "Aisha, Toronto", "Iceland"]].map(([quote, name, place]) => <article key={name}><p>“{quote}”</p><footer><b>{name}</b><span>{place.toUpperCase()} · JOURNEY</span></footer></article>)}</div></section>
    <section className="journal" data-reveal><div><p className="kicker">FROM THE JOURNAL</p><h2>Stories worth <em>lingering over.</em></h2><p>Field notes, slow travel guides, and the people changing the way we go.</p><Link className="outline-button" to="/about">Read our story</Link></div><article className="journal-card"><img src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=700&q=80" alt="Colourful seaside homes" /><div><span>FIELD NOTES · 6 MIN READ</span><h3>Why a slower itinerary makes a richer trip</h3><a href="#all-journeys">READ THE JOURNAL <Icon name="arrow" size={14} /></a></div></article></section>
    <section className="newsletter" data-reveal><div><p className="kicker">A LITTLE ESCAPE, IN YOUR INBOX</p><h2>Notes from <em>somewhere good.</em></h2></div><form onSubmit={(event) => { event.preventDefault(); toast("You’re on the list — welcome aboard."); event.currentTarget.reset(); }}><label htmlFor="newsletter-email">Fresh routes, thoughtful stays, and stories from the road.</label><div><input id="newsletter-email" type="email" required placeholder="Your email address" /><RippleButton className="primary-button">Sign me up</RippleButton></div><small>OCCASIONAL · CONSIDERED · ALWAYS WORTH OPENING</small></form></section>
    <section className="faq" data-reveal><div className="faq-heading"><p className="kicker">FIELD QUESTIONS</p><h2>Before you <em>go.</em></h2></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
  </main><Footer /><MobileTabs basketCount={basket.length} /></>;
}
