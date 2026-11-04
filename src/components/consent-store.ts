export const consentKey = "cookie_consent_v1";
const changeEvent = "portfolio-consent-change";
let fallback: string | null = null;
export function getConsent() {
  try { return localStorage.getItem(consentKey); } catch { return fallback; }
}
export const serverConsent = () => null;
export function subscribeConsent(callback: () => void) {
  window.addEventListener(changeEvent, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(changeEvent, callback); window.removeEventListener("storage", callback); };
}
export function setConsent(value: string | null) {
  fallback = value;
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const analyticsWindow = window as Window & { gtag?: (...args: unknown[]) => void } & Record<string, unknown>;
  if (measurementId) analyticsWindow[`ga-disable-${measurementId}`] = value !== "true";
  analyticsWindow.gtag?.("consent", "update", {
    analytics_storage: value === "true" ? "granted" : "denied",
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
  });
  try { if (value === null) localStorage.removeItem(consentKey); else localStorage.setItem(consentKey, value); } catch { /* Keep this visit usable when browser storage is disabled. */ }
  window.dispatchEvent(new Event(changeEvent));
}
