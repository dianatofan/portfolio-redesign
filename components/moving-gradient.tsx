"use client"

import { motion, useReducedMotion } from "framer-motion"

const blobs = [
  {
    className: "left-[4%] top-[4%]",
    color: "rgba(177,158,239,0.45)",
    anim: { x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.12, 1] },
    duration: 20,
  },
  {
    className: "right-[2%] top-[38%]",
    color: "rgba(129,140,248,0.38)",
    anim: { x: [0, -55, 0], y: [0, 50, 0], scale: [1, 1.08, 1] },
    duration: 24,
  },
  {
    className: "left-[18%] bottom-[4%]",
    color: "rgba(177,158,239,0.35)",
    anim: { x: [0, 45, 0], y: [0, -45, 0], scale: [1, 1.1, 1] },
    duration: 26,
  },
]

/**
 * Soft, slowly drifting purple/indigo gradient backdrop (same palette as the
 * Google prototypes page). Animates transforms only, so it stays composited.
 */
export function MovingGradient() {
  const reduceMotion = useReducedMotion()

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #f5f3fc 0%, #f7f7fb 100%)" }}
      />
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute h-[55vh] w-[55vh] rounded-full blur-[80px] will-change-transform ${blob.className}`}
          style={{ background: `radial-gradient(circle, ${blob.color}, transparent 70%)` }}
          animate={reduceMotion ? undefined : blob.anim}
          transition={{ duration: blob.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Soft fade so the gradient eases in from the top instead of a hard edge */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent" />
    </div>
  )
}
