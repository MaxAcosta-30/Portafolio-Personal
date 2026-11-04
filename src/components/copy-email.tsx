"use client";

import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [message, setMessage] = useState("");
  const [copying, setCopying] = useState(false);

  async function copy() {
    setMessage("");
    setCopying(true);
    try {
      await navigator.clipboard.writeText(email);
      setMessage("Correo copiado.");
    } catch {
      setMessage(`No se pudo copiar. Puedes seleccionar el correo: ${email}`);
    } finally {
      setCopying(false);
    }
  }

  return <div className="copy-email">
    <button type="button" className="button button-secondary" onClick={copy} disabled={copying}>Copiar correo</button>
    <p role="status" aria-live="polite" aria-atomic="true">{message}</p>
  </div>;
}
