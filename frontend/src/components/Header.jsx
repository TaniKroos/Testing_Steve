import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export function Header({ basketCount, admin = false }) {
  return <header className="site-header"><Link className="brand" to="/"><span className="brand-mark">⌁</span>travel basket<span>.</span></Link><nav aria-label="Main navigation"><NavLink to="/">Discover</NavLink><a href="/#all-journeys">Journeys</a><a href="/#why-us">Our promise</a></nav><div className="header-actions">{!admin && <Link className="saved-link" to="/basket">⌑ Basket <motion.b key={basketCount} initial={{ scale: 1.4 }} animate={{ scale: 1 }}>{basketCount}</motion.b></Link>}<Link className="admin-link" to={admin ? "/" : "/admin"}>{admin ? "View traveller site" : "Admin portal"} <span>→</span></Link></div></header>;
}
