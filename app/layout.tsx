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
                <PostHogInit />
                <CursorProvider>
                    <GlassCursor />
                    {children}
                </CursorProvider>
                <Analytics />
            </body>
        </html>
    )
}
