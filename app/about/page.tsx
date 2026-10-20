import { Header } from "@/components/header"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"

export const metadata = {
    title: "About - Diana Tofan",
    description:
        "Diana Tofan is a product designer who designs in code, joining 3Shape in November. Before that: Tactile, Google, Famly and Maersk.",
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
