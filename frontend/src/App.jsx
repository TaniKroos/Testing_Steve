import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import { useQuery } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import { api } from "./api";
import { useBasketStore } from "./stores/basketStore";
import { Discover } from "./components/Discover";
import { Details } from "./components/Details";
import { Basket } from "./components/Basket";
import { Admin } from "./components/Admin";
import { ErrorPage, NotFound } from "./components/ErrorPage";

function TravellerPage() {
  const [selected, setSelected] = useState(null); const basket = useBasketStore((state) => state.items); const toggle = useBasketStore((state) => state.toggleItem);
  const { data: packages = [], isLoading, isError } = useQuery({ queryKey: ["packages"], queryFn: api.listPackages, staleTime: 300000 });
  if (isError) return <ErrorPage error={{ message: "Travel Basket API is offline. Start the server and try again." }} resetErrorBoundary={() => window.location.reload()} />;
  return <><Discover packages={packages} isLoading={isLoading} onSelect={setSelected} basket={basket} toggle={toggle} /><AnimatePresence>{selected && <Details item={selected} close={() => setSelected(null)} basket={basket} toggle={toggle} />}</AnimatePresence></>;
}
function BasketPage() { const basket = useBasketStore((state) => state.items); const toggle = useBasketStore((state) => state.toggleItem); const { data: packages = [] } = useQuery({ queryKey: ["packages"], queryFn: api.listPackages, staleTime: 300000 }); return <Basket basket={basket} packages={packages} toggle={toggle} />; }
function AdminPage() { const { data: packages = [], isError } = useQuery({ queryKey: ["admin-packages"], queryFn: api.listAdminPackages }); if (isError) return <ErrorPage error={{ message: "The admin inventory could not be loaded." }} resetErrorBoundary={() => window.location.reload()} />; return <Admin packages={packages} />; }
export default function App() { return <><a className="skip-link" href="#main-content">Skip to content</a><ErrorBoundary FallbackComponent={ErrorPage}><Routes><Route path="/" element={<TravellerPage />} /><Route path="/basket" element={<BasketPage />} /><Route path="/admin" element={<AdminPage />} /><Route path="*" element={<NotFound />} /></Routes></ErrorBoundary></>; }
