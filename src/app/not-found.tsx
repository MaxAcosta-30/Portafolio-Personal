import Link from "next/link";
import { SiteHeader } from "@/components/portfolio";
import { Logo } from "@/components/brand/logo";

export const metadata = { title: "Página no encontrada" };

export default function NotFound() {
  return <>
    <SiteHeader homeLinks />
    <main id="contenido" className="page-container not-found">
      <Logo variant="spin" size={120} />
      <p className="mono-label">Error 404</p>
      <h1>Esta ruta no está desplegada.</h1>
      <p>La página que buscas no existe o cambió de dirección.</p>
      <Link className="button" href="/">Volver al inicio<span className="button-arrow" aria-hidden="true">→</span></Link>
    </main>
  </>;
}
