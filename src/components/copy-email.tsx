"use client";

import { useState } from "react";
import { Logo } from "./brand/logo";

export function CopyEmail({ email }: { email: string }) {
  const [message, setMessage] = useState("");
  const [copying, setCopying] = useState(false);

  async function copy() {
    if (copying) return;
    setMessage("");
    setCopying(true);
    try {
      // Pausa mínima para que el estado "desplegando" se perciba (la copia es instantánea).
      await Promise.all([navigator.clipboard.writeText(email), new Promise(resolve => setTimeout(resolve, 600))]);
      setMessage("Correo copiado.");
    } catch {
      setMessage(`No se pudo copiar. Puedes seleccionar el correo: ${email}`);
    } finally {
      setCopying(false);
    }
  }

  return <div className="copy-email">
    <button type="button" className="button button-secondary" onClick={copy} aria-disabled={copying || undefined} aria-label="Copiar correo">{copying ? <Logo variant="deploy" size={18} label="copiando…" /> : "Copiar correo"}</button>
    <p role="status" aria-live="polite" aria-atomic="true">{message}</p>
  </div>;
}
