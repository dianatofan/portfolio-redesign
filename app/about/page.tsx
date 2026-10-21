import { Header } from "@/components/header"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"

export const metadata = {
    title: "About - Diana Tofan",
    description:
        "Diana Tofan is a product designer at 3Shape who designs in code. Before that: Tactile, Google, Famly and Maersk.",
}

export default function AboutPage() {
    return (
        <main>
            <Header />
            <About />
            <Footer />
        </main>
    )
}
