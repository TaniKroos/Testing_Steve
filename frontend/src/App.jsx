import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import { useQuery } from "@tanstack/react-query";
import { Route, Routes, useNavigate } from "react-router-dom";
import { api } from "./api";
import { useBasketStore } from "./stores/basketStore";
import { Discover } from "./components/Discover";
import { Details } from "./components/Details";
import { Basket } from "./components/Basket";
import { Admin } from "./components/Admin";
import { AboutPage, DestinationPage, SavedPage } from "./components/ContentPages";
import { Toast } from "./components/UI";
import { ErrorPage, NotFound } from "./components/ErrorPage";
function usePackages() { return useQuery({ queryKey: ["packages"], queryFn: api.listPackages, staleTime: 300000 }); }
function TravellerPage() { const [selected, setSelected] = useState(null); const [toast, setToast] = useState(""); const basket = useBasketStore((state) => state.items); const toggle = useBasketStore((state) => state.toggleItem); const { data: packages = [], isLoading, isError } = usePackages(); if (isError) return <ErrorPage error={{ message: "Travel Basket API is offline. Start the server and try again." }} resetErrorBoundary={() => window.location.reload()} />; return <><Discover packages={packages} isLoading={isLoading} onSelect={setSelected} basket={basket} toggle={toggle} toast={setToast} /><AnimatePresence>{selected && <Details item={selected} close={() => setSelected(null)} basket={basket} toggle={toggle} />}</AnimatePresence><Toast message={toast} clear={() => setToast("")} /></>; }
function BasketPage() { const basket = useBasketStore((state) => state.items); const toggle = useBasketStore((state) => state.toggleItem); const { data: packages = [] } = usePackages(); return <Basket basket={basket} packages={packages} toggle={toggle} />; }
function SavedRoute() { const basket = useBasketStore((state) => state.items); const toggle = useBasketStore((state) => state.toggleItem); const { data: packages = [] } = usePackages(); const [toast, setToast] = useState(""); return <><SavedPage basket={basket} packages={packages} toggle={toggle} toast={setToast} /><Toast message={toast} clear={() => setToast("")} /></>; }
function DestinationRoute() { const basket = useBasketStore((state) => state.items); const toggle = useBasketStore((state) => state.toggleItem); const { data: packages = [] } = usePackages(); const [toast, setToast] = useState(""); return <><DestinationPage packages={packages} basket={basket} toggle={toggle} toast={setToast} /><Toast message={toast} clear={() => setToast("")} /></>; }
function AboutRoute() { const count = useBasketStore((state) => state.items.length); return <AboutPage basketCount={count} />; }
function AdminPage() { const { data: packages = [], isError } = useQuery({ queryKey: ["admin-packages"], queryFn: api.listAdminPackages }); if (isError) return <ErrorPage error={{ message: "The admin inventory could not be loaded." }} resetErrorBoundary={() => window.location.reload()} />; return <Admin packages={packages} />; }
export default function App() { return <><a className="skip-link" href="#main-content">Skip to content</a><ErrorBoundary FallbackComponent={ErrorPage}><Routes><Route path="/" element={<TravellerPage />} /><Route path="/packages/:id" element={<DestinationRoute />} /><Route path="/saved" element={<SavedRoute />} /><Route path="/basket" element={<BasketPage />} /><Route path="/about" element={<AboutRoute />} /><Route path="/admin" element={<AdminPage />} /><Route path="*" element={<NotFound />} /></Routes></ErrorBoundary></>; }
