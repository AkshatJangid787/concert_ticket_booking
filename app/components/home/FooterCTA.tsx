
import Link from "next/link";

export default function FooterCTA() {
    return (
        <section className="py-20 bg-black text-white text-center">
            <h2 className="text-4xl md:text-6xl font-black font-display uppercase mb-12">Ready to vibe?</h2>
            <Link href="/contact" className="inline-block border-4 border-white px-12 py-6 text-2xl font-bold uppercase hover:bg-white hover:text-black transition-colors">
                Book Now
            </Link>
        </section>
    );
}
