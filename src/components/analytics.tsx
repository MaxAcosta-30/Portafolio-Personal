"use client";
import { GoogleAnalytics } from "@next/third-parties/google";
import { useSyncExternalStore } from "react";
import { getConsent, serverConsent, subscribeConsent } from "./consent-store";

export function Analytics() {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, serverConsent);
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId || consent !== "true") return null;
  return <GoogleAnalytics gaId={measurementId} />;
}
