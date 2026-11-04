"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getConsent, serverConsent, setConsent, subscribeConsent } from "./consent-store";

export function CookieConsent() {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, serverConsent);
  if (consent !== null) return null;
  const hasAnalytics = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  return <aside className="consent-area" aria-labelledby="cookie-title"><div className="consent-panel">
    <h2 id="cookie-title" tabIndex={-1}>Tú decides sobre la medición</h2>
    <p>{hasAnalytics ? "Con tu permiso, Google Analytics medirá las visitas y la interacción. Puedes rechazarlo y seguir navegando." : "La medición de visitas no está configurada. Puedes guardar tu preferencia para Google Analytics."}</p>
    <div className="mt-4 flex flex-wrap gap-3"><button className="button button-secondary" onClick={() => setConsent("false")}>Rechazar</button><button className="button" onClick={() => setConsent("true")}>Aceptar</button></div>
    <Link className="text-link mt-2 text-label" href="/legal/cookies">Información sobre cookies</Link>
  </div></aside>;
}
export function LinkPreferenciasCookies() {
  return <button className="text-link text-label" onClick={() => { setConsent(null); requestAnimationFrame(() => document.getElementById("cookie-title")?.focus()); }}>Preferencias de cookies</button>;
}
