"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const EMAIL = "dianatofan.dt@gmail.com"

function ExternalArrow() {
    return (
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="block">
            <path
                d="M3 1.5h5.5V7M8.5 1.5 1.5 8.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export function Footer() {
    const [copied, setCopied] = useState(false)
    const timer = useRef<number | undefined>(undefined)

    useEffect(() => () => window.clearTimeout(timer.current), [])

    const copyEmail = () => {
        const fallback = () => {
            const field = document.createElement("textarea")
            field.value = EMAIL
            field.style.cssText = "position:fixed;opacity:0"
            document.body.appendChild(field)
            field.select()
            try {
                document.execCommand("copy")
            } catch {}
            field.remove()
        }
        if (navigator.clipboard) navigator.clipboard.writeText(EMAIL).catch(fallback)
        else fallback()

        setCopied(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setCopied(false), 1800)
    }

    return (
        <footer id="contact" className="mt-20 flex flex-col gap-7 border-t border-ink px-gutter pt-10 pb-8">
            <div className="flex flex-wrap items-baseline justify-between gap-6">
                <button
                    type="button"
                    onClick={copyEmail}
                    className="link-ink text-left text-[clamp(26px,2.8vw,40px)] font-medium tracking-[-0.03em]"
                >
                    {EMAIL}{" "}
                    <span
                        aria-live="polite"
                        className={`text-[13px] font-normal tracking-normal ${copied ? "text-ink" : "text-ink-meta"}`}
                    >
                        {copied ? "Copied" : "Click to copy"}
                    </span>
                </button>
                <nav aria-label="Elsewhere" className="flex gap-6 text-[15px]">
                    <a
                        href="https://www.linkedin.com/in/diana-tofan-43730013b/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-ink inline-flex items-center gap-1"
                    >
                        LinkedIn
                        <ExternalArrow />
                    </a>
                    <a
                        href="https://github.com/dianatofan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-ink inline-flex items-center gap-1"
                    >
                        GitHub
                        <ExternalArrow />
                    </a>
                </nav>
            </div>
            <div className="flex flex-wrap justify-between gap-6 border-t border-hairline pt-4 text-[13px] text-ink-meta">
                <span>©2026 Diana Tofan</span>
                <Link href="/colophon" className="text-ink-muted transition-colors hover:text-brand">
                    How this site was made →
                </Link>
            </div>
        </footer>
    )
}
