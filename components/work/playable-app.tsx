"use client"

import { useState } from "react"

/*
 * A Lab post's hero: a web app across the full width, shown as a still under a
 * "Tap to play" pill (as on Money Jenga's phone) until someone taps it, so the
 * app only loads for people who want it.
 */
export function PlayableApp({ src, poster, title }: { src: string; poster: string; title: string }) {
  const [on, setOn] = useState(false)
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] bg-ink">
      {on ? (
        <iframe src={src} title={title} allow="fullscreen" className="absolute inset-0 h-full w-full border-0 bg-black" />
      ) : (
        <button type="button" onClick={() => setOn(true)} aria-label={`Play: ${title}`} className="group absolute inset-0 block w-full cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute inset-0 flex items-center justify-center transition-colors duration-300 group-hover:bg-black/10">
            <span className="flex items-center gap-2 rounded-full bg-[#c8372d] px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
              Tap to play
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
