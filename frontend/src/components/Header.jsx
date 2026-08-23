import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon } from "./Icon";

export function Header({ basketCount }) {
  const [open, setOpen] = useState(false); const [dark, setDark] = useState(() => localStorage.getItem("travel-basket-theme") === "dark" || (!localStorage.getItem("travel-basket-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches));
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; localStorage.setItem("travel-basket-theme", dark ? "dark" : "light"); }, [dark]);
  const close = () => setOpen(false);
  return <header className="site-header"><Link className="brand" to="/" onClick={close}><span className="brand-mark">⌁</span>travel basket<span>.</span></Link><nav className={open ? "nav-open" : ""} aria-label="Main navigation"><NavLink to="/" onClick={close}>Discover</NavLink><a href="/#all-journeys" onClick={close}>Journeys</a><Link to="/about" onClick={close}>Our story</Link><a href="/#why-us" onClick={close}>Our promise</a></nav><div className="header-actions"><button className="theme-toggle" onClick={() => setDark(!dark)} aria-label={`Switch to ${dark ? "light" : "dark"} theme`}><Icon name={dark ? "sun" : "moon"} size={17} /></button><Link className="saved-link" to="/saved"><Icon name="bookmark" size={15} /> Saved <motion.b key={basketCount} initial={{ scale: 1.4 }} animate={{ scale: 1 }}>{basketCount}</motion.b></Link><button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation"><Icon name={open ? "close" : "menu"} size={23} /></button></div></header>;
}
export function MobileTabs({ basketCount }) { return <nav className="mobile-tabs" aria-label="Mobile navigation"><Link to="/"><Icon name="home" size={18} />Discover</Link><Link to="/saved"><Icon name="bookmark" size={18} />Saved</Link><Link to="/basket"><Icon name="bag" size={18} />Basket{basketCount ? <b>{basketCount}</b> : null}</Link></nav>; }
