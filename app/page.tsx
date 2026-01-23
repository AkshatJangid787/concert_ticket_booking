
"use client";

import HeroSection from "./components/home/HeroSection";
import MarqueeSection from "./components/home/MarqueeSection";
import GallerySection from "./components/home/GallerySection";
import ServicesSection from "./components/home/ServicesSection";
import FooterCTA from "./components/home/FooterCTA";
import Footer from "./components/shared/Footer";

export default function HomePage() {
    return (
        // Main Container
        // We use 'relative' so we can position the background grain absolutely inside it.
        // 'overflow-hidden' prevents horizontal scrollbars if animations go off-screen.
        <div className="relative min-h-screen bg-white text-black overflow-hidden selection:bg-black selection:text-white">

            {/* 
              Background Grain Effect 
              - This 'fixed' div covers the screen and adds a texture overlay.
              - 'pointer-events-none' ensures clicks pass through to the buttons below.
            */}
            <div className="bg-grain fixed inset-0 opacity-20 pointer-events-none z-10"></div>

            {/* 1. Hero Section: Top part with the main image/video */}
            <HeroSection />

            {/* 2. Marquee Section: Scrolling text banner */}
            <MarqueeSection />

            {/* 3. Gallery / Vibe Section: Grid of images */}
            <GallerySection />

            {/* 4. Services Section: What we offer */}
            <ServicesSection />

            {/* 5. Footer Call-to-Action: "Let's work together" */}
            <FooterCTA />

            {/* 6. Footer: Standard bottom links */}
            <Footer />
        </div>
    );
}
