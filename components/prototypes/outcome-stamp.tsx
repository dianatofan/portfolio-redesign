"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { PrototypeStatus } from "@/lib/prototypes/google-maps-prototypes"

const STAMP_STYLES: Record<PrototypeStatus, { color: string; shadow: string }> = {
  APPROVED: { color: "#22c55e", shadow: "rgba(34,197,94,0.45)" },
  REJECTED: { color: "#ef4444", shadow: "rgba(239,68,68,0.45)" },
}

/**
 * Rubber-stamp overlay that bounces onto the prototype when the outcome is
 * revealed. Positioned to overlap the device, never the content area.
 */
export function OutcomeStamp({ status }: { status: PrototypeStatus }) {
  const reduceMotion = useReducedMotion()
  const { color, shadow } = STAMP_STYLES[status]

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute right-1 -top-6 z-40 select-none"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.8, rotate: -28 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: -14 }}
      transition={
        reduceMotion
          ? { duration: 0.2 }
          : { type: "spring", stiffness: 360, damping: 12, mass: 0.7 }
      }
    >
      <div
        className="rounded-xl border-[4px] px-5 py-2 text-2xl font-extrabold uppercase tracking-[0.18em] md:text-3xl"
        style={{
          color,
          borderColor: color,
          boxShadow: `0 0 0 1px ${color} inset, 0 14px 30px -12px ${shadow}`,
          textShadow: `0 1px 0 rgba(0,0,0,0.15)`,
          opacity: 0.92,
        }}
      >
        {status}
      </div>
    </motion.div>
  )
}
