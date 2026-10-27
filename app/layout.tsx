import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { CursorProvider } from "@/context/CursorContext"
import { GlassCursor } from "@/components/GlassCursor"
import { PostHogInit } from "@/components/posthog-init"
import "./globals.css"

export const metadata: Metadata = {
    title: "Diana Tofan",
    description:
        "I'm Diana, a design engineer untangling complex systems.",
    metadataBase: new URL("https://dianatofan.net"),
    icons: {
        // PNGs after the SVG for browsers and home screens that don't take SVG icons.
        icon: [
            { url: "/favicon-logo.svg", type: "image/svg+xml" },
            { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
            { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        shortcut: "/favicon-logo.svg",
        apple: "/apple-icon.png",
    },
    openGraph: {
        title: "Diana Tofan",
        description:
            "I'm Diana, a design engineer untangling complex systems.",
        url: "https://dianatofan.net",
        siteName: "Diana Tofan",
        images: [
            {
                url: "/images/share-preview.png",
                width: 1200,
                height: 630,
                alt: "Diana Tofan: I'm Diana, a design engineer untangling complex systems.",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Diana Tofan",
        description:
            "I'm Diana, a design engineer untangling complex systems.",
        images: ["/images/share-preview.png"],
    },
}

// Read by search engines and AI screeners, which can't see the hero graph.
// Keep in step with public/llms.txt.
const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Diana Tofan",
    url: "https://dianatofan.net",
    jobTitle: "Design Engineer",
    worksFor: { "@type": "Organization", name: "Tactile Games" },
    address: { "@type": "PostalAddress", addressLocality: "Copenhagen", addressCountry: "DK" },
    knowsAbout: ["Product design", "Prototyping in code", "Internal tools", "Observability", "Design systems"],
    sameAs: ["https://www.linkedin.com/in/diana-tofan-43730013b/", "https://github.com/dianatofan"],
}

export const viewport: Viewport = {
    themeColor: "#FFFFFF",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <head>
                {/* The case-study images come from Cloudinary. Without this the
                    browser cannot start one until it has done DNS + TLS to a new
                    origin, which happens after the HTML is already on screen. */}
                <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
                {/*
                 * Material Symbols is self-hosted from /public/fonts and declared in
                 * globals.css — see the note there before adding an icon, since the
                 * file is subset to twenty specific names. It used to be a
                 * render-blocking <link> to fonts.googleapis.com, which measured as
                 * the last thing gating first paint on the live site.
                 *
                 * Preloaded because it is declared in a stylesheet the browser has
                 * to fetch and parse first; without this the font request only
                 * starts after that round trip.
                 */}
                <link
                    rel="preload"
                    href="/fonts/material-symbols-subset.woff2?v=22"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
                {/* The two weights above the fold: 400 for body copy, 500 for the
                    h1 and the nav. SemiBold is left out on purpose — it is only
                    used inside the deferred sections, so preloading it would
                    compete with the hero for bandwidth. */}
                <link
                    rel="preload"
                    href="/fonts/Saans-Regular.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preload"
                    href="/fonts/Saans-Medium.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
            </head>
            {/* Extensions like ColorZilla add attributes to <body> before React loads. */}
            <body className="font-sans" suppressHydrationWarning>
                {/*
                 * Paints the Copenhagen clock during HTML parse, roughly when the
                 * hero text appears, instead of leaving "..." on screen until
                 * React has downloaded and hydrated — most of a second later on a
                 * real connection. Hero seeds its state with the same formatter,
                 * so React hydrating changes nothing on screen.
                 *
                 * Kept in sync with lib/copenhagen-time.ts by hand: this runs
                 * before any module has loaded, so it cannot import it.
                 */}
                <PostHogInit />
                <CursorProvider>
                    <GlassCursor />
                    {children}
                </CursorProvider>
                {/* After {children}, so the element it fills has been parsed. */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var el=document.getElementById('copenhagen-clock');if(!el)return;var t=new Date().toLocaleTimeString('en-US',{timeZone:'Europe/Copenhagen',hour:'numeric',minute:'2-digit',hour12:true});el.textContent=t;}catch(e){}})();`,
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
                />
                <Analytics />
            </body>
        </html>
    )
}
