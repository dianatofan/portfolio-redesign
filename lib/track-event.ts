"use client"

import { track as vercelTrack } from "@vercel/analytics"
import posthog from "posthog-js"

type AnalyticsPrimitive = string | number | boolean | null | undefined

export function trackEvent(eventName: string, properties?: Record<string, AnalyticsPrimitive>) {
  vercelTrack(eventName, properties)

  if (typeof window === "undefined") return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return

  posthog.capture(eventName, properties)
}

