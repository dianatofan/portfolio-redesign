"use client"

import { useEffect } from "react"
import posthog from "posthog-js"

export function PostHogInit() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key) return

    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      defaults: "2026-01-30",
      capture_pageview: true,
      capture_pageleave: true,
      persistence: "localStorage+cookie",
    })
  }, [])

  return null
}

