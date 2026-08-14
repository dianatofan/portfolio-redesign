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
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/*
                 * Material Symbols, subset to the icons this site actually draws.
                 *
                 * Without `icon_names` Google serves the whole variable font — all
                 * 3,000+ glyphs across every axis range — which is 3,874 KB, more
                 * than every image on the homepage combined. The same request
                 * subset to these twenty icons is 11 KB.
                 *
                 * IMPORTANT: adding an icon anywhere in the codebase means adding
                 * its name here, alphabetically, or it renders as its own name in
                 * plain text. The axis ranges are likewise narrowed to what the
                 * components ask for (opsz 20-24, wght 500, FILL 0 and 1, GRAD 0);
                 * widen them here if a component starts asking for more.
                 *
                 * `display=block` rather than swap: a swapped icon font briefly
                 * paints the ligature text, so you'd see the word "ads_click"
                 * before the glyph arrives.
                 */}
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..24,400..500,0..1,0&icon_names=ads_click,arrow_back,attach_file,auto_awesome,autorenew,bedtime,check,close,cloud_sync,edit,expand_more,lock,menu,pause,play_arrow,quickreply,replay,stop,subdirectory_arrow_right,sunny&display=block"
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
