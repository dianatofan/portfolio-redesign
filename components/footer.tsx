"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"

const WIDTH = 32
const HEIGHT = 32

export function Footer() {
    const [copied, setCopied] = useState(false)
    const [hovered, setHovered] = useState(false)

    const email = "dianatofan.dt@gmail.com"
    const imagePath = "/images"

    const handleCopy = () => {
        navigator.clipboard.writeText(email).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    return (
        <footer className="bg-[var(--footer-bg)] text-[var(--footer-foreground)] py-16 md:py-24">
            <div className="mx-auto px-6">
                <div className="grid grid-cols-12 gap-6 items-start">
                    {/* Top row: headline */}
                    <div className="col-span-12 md:col-span-5">
                        <h2 className="text-3xl md:text-[48px] font-bold leading-tight text-[var(--footer-foreground)]">
                            {"Let's get in touch"}
                        </h2>
                    </div>

                    {/* Top row: right column */}
                    <div className="col-span-12 md:col-span-7 md:col-start-6 flex flex-col items-start justify-start z-10 gap-6">
                        {/* Email copy row */}
                        <div className="flex items-center gap-2 relative">
                            <Image
                                src={`${imagePath}/send.png`}
                                alt=""
                                className="send-icon"
                                width={WIDTH / 2}
                                height={HEIGHT / 2}
                            />
                            <span
                                className="text-base hover:underline cursor-pointer"
                                id="copyEmail"
                                onClick={handleCopy}
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                            >
                {email}
              </span>

                            {hovered && !copied && (
                                <span
                                    className="material-symbols-outlined text-[14px] leading-none opacity-50"
                                    aria-hidden="true"
                                >
                  content_copy
                </span>
                            )}

                            {copied && (
                                <span className="text-sm opacity-50 animate-[fadeOut_2s_ease-out_forwards]">
                  Copied!
                </span>
                            )}
                        </div>

                        {/* Links list */}
                        <nav aria-label="Footer links">
                            <ul className="flex flex-col gap-3">
                                <li>
                                    <Link
                                        href="https://www.linkedin.com/in/diana-tofan-43730013b/"
                                        className="underline hover:text-[var(--footer-foreground)] transition-colors duration-200"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Linkedin
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="https://github.com/dianatofan"
                                        className="underline hover:text-[var(--footer-foreground)] transition-colors duration-200"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Github
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/Diana-Tofan-Resume.pdf"
                                        className="underline hover:text-[var(--footer-foreground)] transition-colors duration-200"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                    >
                                        Resume
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Bottom row: copyright/build info on bottom right */}
                    <div className="col-span-12 md:col-span-7 md:col-start-6 flex flex-col gap-1 md:items-end md:text-right">
                        <p className="text-sm text-[var(--text-tertiary)]">{"©2026 Diana Tofan"}</p>
                        <p className="text-sm text-[var(--text-tertiary)]">
                            {"Designed and built with "}
                            <Link
                                href="https://nextjs.org"
                                className="underline hover:text-[var(--footer-foreground)] transition-colors duration-200"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Next.js
                            </Link>
                            {" and "}
                            <Link
                                href="https://tailwindcss.com"
                                className="underline hover:text-[var(--footer-foreground)] transition-colors duration-200"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Tailwind
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Keyframes for fade out */}
            <style jsx global>{`
        @keyframes fadeOut {
          0% {
            opacity: 0.5;
          }
          20% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
        </footer>
    )
}