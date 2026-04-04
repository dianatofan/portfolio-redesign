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
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
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
