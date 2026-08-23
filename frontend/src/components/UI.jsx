import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "./Icon";

export function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    const revealVisible = () => nodes.forEach((node) => {
      const bounds = node.getBoundingClientRect();
      if (bounds.top < window.innerHeight + 160 && bounds.bottom > -160) node.classList.add("is-visible");
    });
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    revealVisible();
    const timeout = window.setTimeout(() => nodes.forEach((node) => node.classList.add("is-visible")), 700);
    return () => { window.clearTimeout(timeout); observer.disconnect(); };
  }, []);
}
export function Toast({ message, clear }) {
  useEffect(() => { if (!message) return undefined; const timeout = window.setTimeout(clear, 3600); return () => window.clearTimeout(timeout); }, [message, clear]);
  return <AnimatePresence>{message && <motion.div className="toast" role="status" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}><Icon name="shield" size={16} />{message}<button onClick={clear} aria-label="Dismiss notification"><Icon name="close" size={15} /></button></motion.div>}</AnimatePresence>;
}
export function RippleButton({ children, className = "", ...props }) {
  const [ripple, setRipple] = useState(null);
  return <button className={`ripple-button ${className}`} onClick={(event) => { const box = event.currentTarget.getBoundingClientRect(); setRipple({ x: event.clientX - box.left, y: event.clientY - box.top, id: Date.now() }); props.onClick?.(event); }} {...props}>{children}{ripple && <span key={ripple.id} className="ripple" style={{ left: ripple.x, top: ripple.y }} />}</button>;
}
