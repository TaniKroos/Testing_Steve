import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const emptyPackage = { location: "", country: "", title: "", duration: "", price: "", discount: 0, rating: 4.8, reviews: 0, image: "", description: "", highlights: "", featured: false };
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function discountedPrice(travelPackage) {
  return Math.round(travelPackage.price * (1 - travelPackage.discount / 100));
}

function PackageCard({ travelPackage }) {
  return <article className="package-card">
    <div className="card-image">
      <img src={travelPackage.image} alt={travelPackage.location} />
      {travelPackage.discount > 0 && <span className="offer-badge">Save {travelPackage.discount}%</span>}
      <span className="heart">♡</span>
    </div>
    <div className="card-body">
      <div className="eyebrow"><span>⌖ {travelPackage.location}</span><span>★ {travelPackage.rating} <small>({travelPackage.reviews})</small></span></div>
      <h3>{travelPackage.title}</h3>
      <p className="duration">◷ {travelPackage.duration}</p>
      <div className="card-footer"><div><strong>{money.format(discountedPrice(travelPackage))}</strong>{travelPackage.discount > 0 && <del>{money.format(travelPackage.price)}</del>}<small> per person</small></div><button className="round-button" aria-label={`View ${travelPackage.title}`}>→</button></div>
    </div>
  </article>;
}

function Discover({ packages }) {
  const [search, setSearch] = useState("");
  const featured = packages.filter((item) => item.featured);
  const displayed = useMemo(() => (featured.length ? featured : packages).filter((item) => `${item.location} ${item.country} ${item.title}`.toLowerCase().includes(search.toLowerCase())), [featured, packages, search]);
  return <>
    <header className="site-header"><a className="brand" href="#discover"><span className="brand-mark">⌁</span>verdant<span>.</span></a><nav><a href="#discover">Discover</a><a href="#why-us">Why Verdant</a><a href="#stories">Stories</a></nav><a className="admin-link" href="#admin">Admin portal <span>→</span></a></header>
    <main id="discover">
      <section className="hero"><div className="hero-copy"><p className="kicker">✦ Travel lighter. Feel deeper.</p><h1>Find your <em>way back</em> to wonder.</h1><p className="hero-text">Thoughtful journeys into the world’s wild, beautiful places — designed to leave you changed, not the planet.</p><div className="search-bar"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Where do you want to go?" /><button>Explore escapes <span>→</span></button></div><div className="trust-row"><span>✦ Curated stays</span><span>✦ Small groups</span><span>✦ Lighter footprints</span></div></div><div className="hero-art"><div className="sun" /><div className="arch"><img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85" alt="Misty green mountain landscape" /></div><div className="trip-note"><span className="note-leaf">⌇</span><p>Nature has a way<br />of making room<br />for what matters.</p></div></div></section>
      <section className="destinations"><div className="section-heading"><div><p className="kicker">CURATED FOR THE CURIOUS</p><h2>Go where the <em>wild things are.</em></h2></div><a href="#all">See all journeys <span>→</span></a></div>{displayed.length ? <div className="card-grid">{displayed.map((item) => <PackageCard travelPackage={item} key={item.id} />)}</div> : <div className="empty-state">No escapes match that search yet. Try another destination.</div>}</section>
      <section id="why-us" className="promise"><p className="kicker">THE VERDANT WAY</p><h2>Good for your soul.<br /><em>Gentler on the world.</em></h2><div><span>01<br /><b>Locally rooted</b></span><span>02<br /><b>Thoughtfully paced</b></span><span>03<br /><b>Nature first</b></span></div></section>
    </main>
  </>;
}

function Admin({ packages, reload }) {
  const [form, setForm] = useState(emptyPackage);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState("");
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const edit = (travelPackage) => { setEditingId(travelPackage.id); setForm({ ...travelPackage, highlights: travelPackage.highlights.join(", ") }); setNotice(""); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const submit = async (event) => { event.preventDefault(); setNotice(""); try { const response = await fetch(`${API_URL}/admin/packages${editingId ? `/${editingId}` : ""}`, { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const data = await response.json(); if (!response.ok) throw new Error(data.message); setNotice(editingId ? "Package updated and ready for travellers." : "New package published for travellers."); setForm(emptyPackage); setEditingId(null); reload(); } catch (error) { setNotice(error.message || "Something went wrong."); } };
  return <><header className="site-header admin-header"><a className="brand" href="#discover"><span className="brand-mark">⌁</span>verdant<span>.</span></a><span className="portal-label">Admin portal</span><a className="admin-link" href="#discover">View traveller site <span>→</span></a></header><main className="admin-page"><div className="admin-intro"><p className="kicker">CONTENT STUDIO</p><h1>Shape the next <em>great escape.</em></h1><p>Create, edit, and set offers for the journeys your travellers see.</p></div><section className="admin-layout"><form className="package-form" onSubmit={submit}><div className="form-title"><h2>{editingId ? "Edit package" : "Add a package"}</h2>{editingId && <button type="button" className="text-button" onClick={() => { setEditingId(null); setForm(emptyPackage); }}>Cancel editing</button>}</div><div className="form-grid"><label>Package title<input required value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Wild coast reset" /></label><label>Location<input required value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Cornwall" /></label><label>Country<input required value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="e.g. United Kingdom" /></label><label>Duration<input required value={form.duration} onChange={(e) => update("duration", e.target.value)} placeholder="e.g. 4 days · 3 nights" /></label><label>Base price (USD)<input required min="0" type="number" value={form.price} onChange={(e) => update("price", e.target.value)} /></label><label>Discount (%)<input min="0" max="100" type="number" value={form.discount} onChange={(e) => update("discount", e.target.value)} /></label><label>Rating<input min="0" max="5" step="0.1" type="number" value={form.rating} onChange={(e) => update("rating", e.target.value)} /></label><label>Review count<input min="0" type="number" value={form.reviews} onChange={(e) => update("reviews", e.target.value)} /></label><label className="full">Image URL<input required type="url" value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://..." /></label><label className="full">Description<textarea required value={form.description} onChange={(e) => update("description", e.target.value)} /></label><label className="full">Highlights <small>Separate with commas</small><input value={form.highlights} onChange={(e) => update("highlights", e.target.value)} placeholder="Forest bathing, Local food, Guided hike" /></label></div><label className="checkbox"><input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} /> Feature on the traveller homepage</label>{notice && <p className="notice">{notice}</p>}<button className="primary-button" type="submit">{editingId ? "Save package changes" : "Publish package"} <span>→</span></button></form><aside className="inventory"><div><p className="kicker">LIVE INVENTORY</p><h2>{packages.length} journeys</h2></div>{packages.map((item) => <button className="inventory-item" key={item.id} onClick={() => edit(item)}><img src={item.image} alt="" /><span><b>{item.title}</b><small>{item.location} · {item.discount}% off</small></span><i>→</i></button>)}</aside></section></main></>;
}

function App() { const [packages, setPackages] = useState([]); const [error, setError] = useState(""); const load = () => fetch(`${API_URL}/packages`).then((response) => { if (!response.ok) throw new Error(); return response.json(); }).then(setPackages).catch(() => setError("The travel service is offline. Start the API with npm run server.")); useEffect(load, []); const admin = window.location.hash === "#admin"; useEffect(() => { const hashChange = () => window.location.reload(); window.addEventListener("hashchange", hashChange); return () => window.removeEventListener("hashchange", hashChange); }, []); if (error) return <div className="connection-error">{error}</div>; return admin ? <Admin packages={packages} reload={load} /> : <Discover packages={packages} />; }

createRoot(document.getElementById("root")).render(<App />);
