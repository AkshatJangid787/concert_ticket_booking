
"use client";

import HeroSection from "./components/home/HeroSection";
import MarqueeSection from "./components/home/MarqueeSection";
import GallerySection from "./components/home/GallerySection";
import ServicesSection from "./components/home/ServicesSection";
import FooterCTA from "./components/home/FooterCTA";
import Footer from "./components/shared/Footer";

export default function HomePage() {
    return (
        <div className="relative min-h-screen bg-white text-black overflow-hidden selection:bg-black selection:text-white">
            {/* Background Grain */}
            <div className="bg-grain fixed inset-0 opacity-20 pointer-events-none z-10"></div>

            {/* Hero Section */}
            <HeroSection />

            {/* Marquee Section */}
            <MarqueeSection />

            {/* Gallery / Vibe Section */}
            <GallerySection />

            {/* Services Section */}
            <ServicesSection />

            {/* Footer CTA */}
            <FooterCTA />

            {/* Footer */}
            <Footer />
        </div>
    );
}
