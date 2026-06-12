"use client"

import { motion, useReducedMotion } from "framer-motion"

/**
 * Renders the autoplaying, looping prototype media. For now this is a
 * placeholder surface labelled with the intended media filename. When a real
 * asset exists, render a <video autoPlay loop muted playsInline> or an <img>
 * instead — the surrounding device frame stays the same.
 */
export function PrototypeMedia({ media }: { media: string; label?: string }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#f4f4f5]">
      {/* Ambient looping shimmer (composited transform, no per-frame paint). */}
      {!reduceMotion && (
        <motion.div
          aria-hidden
          className="absolute inset-y-0 left-0 w-1/2 will-change-transform"
          style={{
            background: "linear-gradient(115deg, transparent, rgba(0,0,0,0.05), transparent)",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />
      )}

      {/* Faux map grid so the placeholder reads as a product surface. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-medium uppercase tracking-widest text-[var(--text-tertiary)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#34C759]" />
          </span>
          Looping preview
        </span>
        <span className="font-mono text-xs text-[var(--text-tertiary)]">{media}</span>
      </div>
    </div>
  )
}
