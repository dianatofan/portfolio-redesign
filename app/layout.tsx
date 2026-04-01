import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { CursorProvider } from "@/context/CursorContext"
import { GlassCursor } from "@/components/GlassCursor"
import "./globals.css"

export const metadata: Metadata = {
    title: "Diana Tofan",
    description:
        "Senior product designer untangling complex systems. Infrastructure, internal tools, observability systems, and platform workflows.",
    icons: {
        icon: "/favicon-logo.svg",
        shortcut: "/favicon-logo.svg",
        apple: "/apple-icon.png",
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
                <CursorProvider>
                    <GlassCursor />
                    {children}
                </CursorProvider>
                <Analytics />
            </body>
        </html>
    )
}
