"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getConsent, serverConsent, setConsent, subscribeConsent } from "./consent-store";

/** Aviso de medición como ventana emergente centrada (antes, panel al pie de la página).
 *  <dialog> modal: foco atrapado, Escape cierra y el fondo queda inerte. Rechazar pesa lo mismo que Aceptar.
 *  Cerrar sin elegir solo lo oculta en esta página: sin respuesta no se mide nada. */
export function CookieConsent() {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, serverConsent);
  const dialog = useRef<HTMLDialogElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const pending = consent === null && !dismissed;

  // "Preferencias de cookies" vuelve a abrir el aviso aunque se haya cerrado sin elegir.
  useEffect(() => {
    const reopen = () => setDismissed(false);
    window.addEventListener("portfolio-consent-change", reopen);
    return () => window.removeEventListener("portfolio-consent-change", reopen);
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    // Al hidratar, el primer render usa la instantánea del servidor (null): se confirma con el valor real
    // para no abrir y cerrar el aviso a quien ya eligió (eso le robaba el foco a la página).
    if (pending && getConsent() === null && !element.open) element.showModal();
    if (!pending && element.open) element.close();
  }, [pending]);

  const hasAnalytics = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  return <dialog ref={dialog} className="consent-dialog" aria-labelledby="cookie-title" aria-describedby="cookie-text" onCancel={() => setDismissed(true)}>
    <h2 id="cookie-title" tabIndex={-1}>Tú decides sobre la medición</h2>
    <p id="cookie-text">{hasAnalytics ? "Con tu permiso, Google Analytics medirá las visitas y la interacción. Puedes rechazarlo y seguir navegando." : "La medición de visitas no está configurada. Puedes guardar tu preferencia para Google Analytics."}</p>
    <div className="consent-actions"><button type="button" className="button button-secondary" onClick={() => setConsent("false")}>Rechazar</button><button type="button" className="button" onClick={() => setConsent("true")}>Aceptar</button></div>
    <Link className="text-link text-label" href="/legal/cookies" onClick={() => { setDismissed(true); }}>Información sobre cookies</Link>
  </dialog>;
}

export function LinkPreferenciasCookies() {
  return <button type="button" className="text-link text-label" onClick={() => { setConsent(null); requestAnimationFrame(() => document.getElementById("cookie-title")?.focus()); }}>Preferencias de cookies</button>;
}
