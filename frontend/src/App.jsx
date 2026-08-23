import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import { useQuery } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import { api } from "./api";
import { useBasketStore } from "./stores/basketStore";
import { useSavedStore } from "./stores/savedStore";
import { useAuthStore } from "./stores/authStore";
import { Discover } from "./components/Discover";
import { Details } from "./components/Details";
import { Basket } from "./components/Basket";
import { AboutPage, DestinationPage, SavedPage } from "./components/ContentPages";
import { Toast } from "./components/UI";
import { ErrorPage, NotFound } from "./components/ErrorPage";
import { useDocumentMeta } from "./hooks/useDocumentMeta";
import { RequireAdmin } from "./components/admin/RequireAdmin";

const AdminLogin = lazy(() => import("./components/admin/AdminLogin"));
const AdminRoute = lazy(() => import("./components/admin/AdminRoute"));

function usePackages() { return useQuery({ queryKey: ["packages"], queryFn: api.listPackages, staleTime: 300000 }); }
function AuthSession() {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setAnonymous = useAuthStore((state) => state.setAnonymous);
  const { data, isError } = useQuery({ queryKey: ["auth-session"], queryFn: api.me, retry: false, staleTime: Infinity });
  useEffect(() => {
    if (data) setAuthenticated(data);
    else if (isError) setAnonymous();
  }, [data, isError, setAnonymous, setAuthenticated]);
  return null;
}
function TravellerPage() {
  useDocumentMeta({ title: "Expedition Console" });
  const [selected, setSelected] = useState(null); const [toast, setToast] = useState("");
  const basket = useBasketStore((state) => state.items); const toggleBasket = useBasketStore((state) => state.toggleItem);
  const saved = useSavedStore((state) => state.items); const toggleSaved = useSavedStore((state) => state.toggleItem);
  const { data: packages = [], isLoading, isError, refetch } = usePackages();
  return <><Discover packages={packages} isLoading={isLoading} isError={isError} retry={refetch} onSelect={setSelected} basket={basket} saved={saved} toggleSaved={toggleSaved} toast={setToast} /><AnimatePresence>{selected && <Details item={selected} close={() => setSelected(null)} basket={basket} toggleBasket={toggleBasket} saved={saved} toggleSaved={toggleSaved} />}</AnimatePresence><Toast message={toast} clear={() => setToast("")} /></>;
}
function BasketPage() {
  useDocumentMeta({ title: "Basket" });
  const basket = useBasketStore((state) => state.items); const toggleBasket = useBasketStore((state) => state.toggleItem); const clearItems = useBasketStore((state) => state.clearItems);
  const savedCount = useSavedStore((state) => state.items.length); const { data: packages = [] } = usePackages();
  return <Basket basket={basket} packages={packages} toggleBasket={toggleBasket} clearItems={clearItems} savedCount={savedCount} />;
}
function SavedRoute() {
  useDocumentMeta({ title: "Saved journeys" });
  const saved = useSavedStore((state) => state.items); const toggleSaved = useSavedStore((state) => state.toggleItem);
  const basket = useBasketStore((state) => state.items); const toggleBasket = useBasketStore((state) => state.toggleItem);
  const { data: packages = [] } = usePackages(); const [toast, setToast] = useState("");
  return <><SavedPage saved={saved} packages={packages} toggleSaved={toggleSaved} basket={basket} toggleBasket={toggleBasket} toast={setToast} /><Toast message={toast} clear={() => setToast("")} /></>;
}
function DestinationRoute() {
  useDocumentMeta({ title: "Journey details" });
  const basket = useBasketStore((state) => state.items); const toggleBasket = useBasketStore((state) => state.toggleItem);
  const saved = useSavedStore((state) => state.items); const toggleSaved = useSavedStore((state) => state.toggleItem);
  const { data: packages = [] } = usePackages(); const [toast, setToast] = useState("");
  return <><DestinationPage packages={packages} basket={basket} toggleBasket={toggleBasket} saved={saved} toggleSaved={toggleSaved} toast={setToast} /><Toast message={toast} clear={() => setToast("")} /></>;
}
function AboutRoute() { useDocumentMeta({ title: "Our story" }); const savedCount = useSavedStore((state) => state.items.length); const basketCount = useBasketStore((state) => state.items.length); return <AboutPage savedCount={savedCount} basketCount={basketCount} />; }
export default function App() { return <><AuthSession /><a className="skip-link" href="#main-content">Skip to content</a><ErrorBoundary FallbackComponent={ErrorPage}><Routes><Route path="/" element={<TravellerPage />} /><Route path="/packages/:id" element={<DestinationRoute />} /><Route path="/saved" element={<SavedRoute />} /><Route path="/basket" element={<BasketPage />} /><Route path="/about" element={<AboutRoute />} /><Route path="/admin/login" element={<Suspense fallback={null}><AdminLogin /></Suspense>} /><Route path="/admin" element={<Suspense fallback={null}><RequireAdmin><AdminRoute /></RequireAdmin></Suspense>} /><Route path="*" element={<NotFound />} /></Routes></ErrorBoundary></>; }
