import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MoneyJengaPost } from "@/components/work/money-jenga-post"

// A static route, like /work/release-timeline: the post needs its own page
// layout, so it takes precedence over the dynamic [slug] template.

export const metadata: Metadata = {
  title: "Money Jenga - Diana Tofan",
  description:
    "An iPhone budget app where every purchase pulls a block out of a tower of cash. No bank details needed. Built in SwiftUI with Claude Code.",
}

export default function MoneyJengaPage() {
  return (
    <main className="min-h-screen bg-white text-ink">
      <Header />
      <MoneyJengaPost />
      <Footer />
    </main>
  )
}
