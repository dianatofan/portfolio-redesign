"use client"

import type { ReactNode } from "react"
import type { PrototypeDevice } from "@/lib/prototypes/google-maps-prototypes"

/**
 * Wraps prototype media in either a phone or a browser chrome. The media fills
 * the screen area; everything else is non-interactive chrome. Styling mirrors
 * the device mockups used elsewhere in the case studies (black-bezel phone,
 * light browser chrome).
 */
export function DeviceFrame({
  device,
  children,
}: {
  device: PrototypeDevice
  children: ReactNode
}) {
  if (device === "desktop") {
    return (
      <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_50px_-24px_rgba(0,0,0,0.25)]">
        <div className="flex items-center gap-2 border-b border-border bg-[#f3f3f4] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <div className="mx-auto flex h-6 w-1/2 items-center justify-center rounded-md border border-border bg-white text-[10px] text-[var(--text-tertiary)]">
            google.com/search
          </div>
        </div>
        <div className="relative aspect-[16/10] w-full">{children}</div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[220px] rounded-[2.5rem] bg-black p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)]">
      <div className="relative overflow-hidden rounded-[2.1rem] bg-black">
        {/* Dynamic island */}
        <div className="absolute left-1/2 top-3 z-20 h-7 w-24 -translate-x-1/2 rounded-full bg-black" />
        <div className="relative aspect-[9/19.5] w-full">{children}</div>
      </div>
    </div>
  )
}
