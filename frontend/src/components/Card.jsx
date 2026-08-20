import { motion } from "framer-motion";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const salePrice = (item) => Math.round(item.price * (1 - item.discount / 100));

export function Card({ item, isSaved, onToggle, onSelect, index }) {
  return <motion.article className="package-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.05, 0.35) }}><div className="card-image"><img loading="lazy" src={item.image} alt={`${item.title} in ${item.location}`} />{item.discount > 0 && <span className="offer-badge">Save {item.discount}%</span>}<motion.button whileTap={{ scale: [1, 1.3, 1] }} className={`heart ${isSaved ? "is-saved" : ""}`} onClick={() => onToggle(item)} aria-label={`${isSaved ? "Remove" : "Add"} ${item.title} ${isSaved ? "from" : "to"} basket`} aria-pressed={isSaved}>{isSaved ? "♥" : "♡"}</motion.button></div><div className="card-body"><div className="eyebrow"><span>⌖ {item.location}</span><span>★ {item.rating} <small>({item.reviews})</small></span></div><h3>{item.title}</h3><p className="duration">◷ {item.duration} · {item.difficulty}</p><div className="card-footer"><div><strong>{money.format(salePrice(item))}</strong>{item.discount > 0 && <del>{money.format(item.price)}</del>}<small>per person</small></div><button className="round-button" onClick={() => onSelect(item)} aria-label={`View details for ${item.title}`}>→</button></div></div></motion.article>;
}
export { money, salePrice };
