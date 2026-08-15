import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { CursorProvider } from "@/context/CursorContext"
import { GlassCursor } from "@/components/GlassCursor"
import { PostHogInit } from "@/components/posthog-init"
import "./globals.css"

export const metadata: Metadata = {
    title: "Diana Tofan",
    description:
        "Senior product designer untangling complex systems. Infrastructure, internal tools, observability systems, and platform workflows.",
    metadataBase: new URL("https://dianatofan.net"),
    icons: {
        icon: "/favicon-logo.svg",
        shortcut: "/favicon-logo.svg",
        apple: "/apple-icon.png",
    },
    openGraph: {
        title: "Diana Tofan",
        description:
            "Senior product designer untangling complex systems. Infrastructure, internal tools, observability systems, and platform workflows.",
        url: "https://dianatofan.net",
        siteName: "Diana Tofan",
        images: [
            {
                url: "/images/preview-image.png",
                width: 1200,
                height: 630,
                alt: "Diana Tofan portfolio preview",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Diana Tofan",
        description:
            "Senior product designer untangling complex systems. Infrastructure, internal tools, observability systems, and platform workflows.",
        images: ["/images/preview-image.png"],
    },
}

export const viewport: Viewport = {
    themeColor: "#F5F5F5",
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
                    href="/fonts/material-symbols-subset.woff2"
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
            <body className="font-sans antialiased">
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
                        __html: `(function(){try{var el=document.getElementById('copenhagen-clock');if(!el)return;var t=new Date().toLocaleTimeString('en-US',{timeZone:'Europe/Copenhagen',hour:'numeric',minute:'2-digit',hour12:true}).replace(/\\s?(AM|PM)$/,'$1');el.textContent=t;}catch(e){}})();`,
                    }}
                />
                <Analytics />
            </body>
        </html>
    )
}
