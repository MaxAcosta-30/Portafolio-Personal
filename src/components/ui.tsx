import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes } from "react";

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }) {
  return <button type={type} className={`button ${variant === "secondary" ? "button-secondary" : ""} ${className}`} {...props} />;
}

export function Tag({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={`tag ${className}`} {...props} />;
}

export function Field({
  label,
  helper,
  error,
  id,
  className = "",
  ...props
}: { label?: string; helper?: string; error?: string; id?: string; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const hasError = error ? true : props["aria-invalid"] === true || props["aria-invalid"] === "true";
  return (
    <div className={`group space-y-[0.5rem] ${className}`}>
      {label && <label htmlFor={id} className="text-label font-semibold group-focus-within:text-accent">{label}</label>}
      <input
        id={id}
        {...props}
        className="field"
        aria-invalid={hasError || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {helper && <p id={`${id}-helper`} className="text-label text-muted">{helper}</p>}
      {error && (
        <p id={`${id}-error`} className="text-label" role="alert" style={{ color: "var(--color-accent)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`field ${className}`} {...props} />;
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`bg-surface animate-pulse motion-reduce:animate-none ${className}`} />;
}

export function Icon({ name }: { name: "arrow" | "check" | "external" | "error" }) {
  const paths = {
    arrow: <path d="M4 10h12m-5-5 5 5-5 5" />,
    check: <path d="m4 10 4 4 8-8" />,
    external: <><path d="M11 3h6v6M17 3l-8 8" /><path d="M8 4H4v12h12v-4" /></>,
    error: <><circle cx="10" cy="10" r="7" /><path d="M10 6v5m0 2v1" /></>,
  };
  return <svg className="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}
