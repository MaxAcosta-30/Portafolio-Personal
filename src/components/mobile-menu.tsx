"use client";

import { useRef } from "react";
import { navigation } from "@/content/site";

/** Menú a pantalla completa para < 768px. <dialog> aporta foco atrapado, Escape y fondo inerte. */
export function MobileMenu({ homeLinks = false }: { homeLinks?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();
  return <>
    <button type="button" className="menu-button" aria-label="Abrir menú" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
      <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3 6h14M3 14h14" /></svg>
    </button>
    <dialog ref={dialog} className="mobile-menu" aria-label="Menú">
      <div className="mobile-menu-top">
        <span className="mono-label">Menú</span>
        <button type="button" className="menu-button" aria-label="Cerrar menú" onClick={close}>
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M5 5l10 10M15 5L5 15" /></svg>
        </button>
      </div>
      <nav aria-label="Menú principal">
        <ol>{navigation.items.map((item, index) => <li key={item.sectionId}>
          <a href={`${homeLinks ? "/" : ""}#${item.sectionId}`} onClick={close}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{item.label}</a>
        </li>)}</ol>
      </nav>
      <a className="cta-link mobile-menu-cta" href={`${homeLinks ? "/" : ""}#${navigation.cta.sectionId}`} onClick={close}>{navigation.cta.label}<span className="button-arrow" aria-hidden="true">→</span></a>
    </dialog>
  </>;
}
