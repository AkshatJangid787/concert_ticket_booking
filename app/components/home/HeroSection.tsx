

import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex flex-col justify-start md:justify-center items-center px-4 pt-32 md:pt-20">
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10 relative">
                {/* Left: Text */}
                <div className="text-left relative z-50">
                    <h1 className="text-[18vw] md:text-[12vw] leading-[0.8] font-black font-display uppercase tracking-tighter text-black select-none drop-shadow-[4px_4px_0_rgba(255,255,255,1)] mix-blend-normal">
                        Ashish<br />Soni
                    </h1>
                </div>

                {/* Right: Image */}
                <div className="relative flex justify-center md:justify-end z-20">
                    <div className="w-72 h-96 md:w-[35rem] md:h-[45rem] rotate-[-5deg] hover:rotate-0 transition-transform duration-700 ease-out border-4 border-black bg-gray-200 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] relative">
                        {/* Clutcher/Chip */}
                        <img
                            src="/images/clutcher.png"
                            alt="Clip"
                            className="absolute -top-12 -left-12 w-32 h-auto z-30 drop-shadow-xl select-none"
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                            style={{ WebkitTouchCallout: 'none' }}
                        />

                        <img
                            src="/images/ashish-portrait.png"
                            alt="Ashish Soni Portrait"
                            className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 active:grayscale-0 transition-all duration-500 select-none"
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                            style={{ WebkitTouchCallout: 'none' }}
                        />
                    </div>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="hidden md:block absolute bottom-10 left-20 max-w-xs z-30">
                <p className="font-mono text-xs uppercase tracking-widest mb-2 bg-black text-white inline-block px-1">Vocalist / Performer</p>
                <p className="text-sm font-bold bg-white border border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    &quot;Music is the space between the notes.&quot;
                </p>
            </div>

            <div className="absolute bottom-10 right-10 md:right-20 z-30">
                <Link href="/shows" className="group flex items-center gap-4 bg-black text-white px-8 py-4 hover:bg-red-600 transition-colors shadow-[8px_8px_0px_0px_rgba(255,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2">
                    <span className="font-black font-display text-xl uppercase tracking-widest">View Shows</span>
                    <span className="h-3 w-3 bg-white rounded-full animate-pulse"></span>
                </Link>
            </div>
        </section>
    );
}
