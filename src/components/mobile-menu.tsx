"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { navigation } from "@/content/site";
import { isCurrent } from "./home-navigation";

/** Menú a pantalla completa para < 768px. <dialog> aporta foco atrapado, Escape y fondo inerte. */
export function MobileMenu() {
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
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
        <ol>{[{ label: "Inicio", href: "/" }, ...navigation.items].map((item, index) => <li key={item.href}>
          <Link href={item.href} onClick={close} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{item.label}</Link>
        </li>)}</ol>
      </nav>
      <Link className="cta-link mobile-menu-cta" href={navigation.cta.href} onClick={close}>{navigation.cta.label}<span className="button-arrow" aria-hidden="true">→</span></Link>
    </dialog>
  </>;
}
