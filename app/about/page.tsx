import { Header } from "@/components/header"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"

export const metadata = {
    title: "About - Diana Tofan",
    description:
        "Learn more about Diana Tofan, a product designer specializing in complex systems and enterprise tools.",
}

export default function AboutPage() {
    return (
        <main>
            <Header />
            <section className="pt-28">
                <About />
            </section>
            <Footer />
        </main>
    )
}
