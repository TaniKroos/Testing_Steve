import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header, MobileTabs } from "./Header";
import { Footer } from "./Footer";
import { money, salePrice } from "./Card";
import { api } from "../api";

const bookingSchema = z.object({ name: z.string().min(2, "Name must be at least 2 characters"), email: z.string().email("Please enter a valid email"), travellers: z.coerce.number().min(1, "At least 1 traveller is required"), notes: z.string().optional() });
export function Basket({ basket, packages, toggleBasket, clearItems, savedCount }) {
  const [notice, setNotice] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, watch } = useForm({ resolver: zodResolver(bookingSchema), defaultValues: { name: "", email: "", travellers: 1, notes: "" } });
  const travellers = watch("travellers") || 1;
  const total = basket.reduce((sum, line) => sum + salePrice(packages.find((pkg) => pkg.id === line.packageId) || { price: 0, discount: 0 }) * travellers, 0);
  const submit = async (form) => {
    try {
      const submittedItems = [...basket];
      await api.submitBooking({ ...form, items: submittedItems });
      clearItems(submittedItems);
      reset();
      setNotice("Request received — our travel team will be in touch shortly.");
    } catch (error) { setNotice(error.message); }
  };
  return <><Header savedCount={savedCount} basketCount={basket.length} /><main className="basket-page" id="main-content"><p className="kicker">YOUR TRAVEL BASKET</p><h1>Ready when <em>you are.</em></h1>{notice && !basket.length ? <div className="empty-state"><h2>Request received.</h2><p>{notice}</p><Link className="outline-button" to="/">Browse more journeys</Link></div> : basket.length ? <div className="basket-layout"><section className="basket-lines">{basket.map((line) => { const item = packages.find((pkg) => pkg.id === line.packageId); if (!item) return null; const departure = item.departures?.find((date) => date.id === line.departureId); return <article key={line.packageId} className="basket-line"><img src={item.image} alt="" /><div><h3>{item.title}</h3><p>{item.location} · {departure ? new Date(`${departure.date}T12:00`).toLocaleDateString() : "Choose dates later"}</p><strong>{money.format(salePrice(item))} <small>per person</small></strong></div><button onClick={() => toggleBasket(item)}>Remove</button></article>; })}</section><form className="booking-form" onSubmit={handleSubmit(submit)} noValidate><h2>Request to book</h2><label>Name<input {...register("name")} aria-invalid={!!errors.name} />{errors.name && <small className="field-error">{errors.name.message}</small>}</label><label>Email<input type="email" {...register("email")} aria-invalid={!!errors.email} />{errors.email && <small className="field-error">{errors.email.message}</small>}</label><label>Travellers<input min="1" type="number" {...register("travellers")} aria-invalid={!!errors.travellers} />{errors.travellers && <small className="field-error">{errors.travellers.message}</small>}</label><label>Notes<textarea {...register("notes")} /></label><p className="total">Estimated total <b>{money.format(total)}</b></p>{notice && <p className="notice" aria-live="polite">{notice}</p>}<button className="primary-button" disabled={isSubmitting}>{isSubmitting ? "Sending request…" : "Send booking request →"}</button></form></div> : <div className="empty-state"><h2>Your basket is waiting.</h2><p>Add a journey when you are ready to request your place.</p><Link className="outline-button" to="/">Browse journeys</Link></div>}</main><Footer /><MobileTabs basketCount={basket.length} /></>;
}
