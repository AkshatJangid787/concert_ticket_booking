
export default function GallerySection() {
    return (
        <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="mb-20">
                <h2 className="text-6xl md:text-8xl font-black font-display uppercase leading-[0.85] mb-8">
                    Raw.<br />Real.<br /><span className="text-transparent text-stroke">Rhythm.</span>
                </h2>
                <p className="text-xl md:text-2xl font-medium leading-relaxed font-mono max-w-2xl">
                    From the first strum to the last chord, every performance is a journey. Join me in exploring the depths of melody and emotion.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {/* 1. Keyboard */}
                <div className="w-full h-[500px] border-4 border-black relative shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-300">
                    <img
                        src="/images/ashish-keyboard.png"
                        alt="Ashish on Keyboard"
                        className="w-full h-full object-cover object-top grayscale contrast-125 hover:grayscale-0 active:grayscale-0 transition-all duration-500 select-none"
                        draggable="false"
                        onContextMenu={(e) => e.preventDefault()}
                        style={{ WebkitTouchCallout: 'none' }}
                    />
                </div>

                {/* 2. Vocals (New) */}
                <div className="w-full h-[500px] border-4 border-black relative shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] md:mt-20 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-300 hover:z-10 bg-gray-100">
                    <img
                        src="/images/ashish-vocals.png"
                        alt="Ashish Vocals"
                        className="w-full h-full object-cover object-top grayscale contrast-125 hover:grayscale-0 active:grayscale-0 transition-all duration-500 select-none"
                        draggable="false"
                        onContextMenu={(e) => e.preventDefault()}
                        style={{ WebkitTouchCallout: 'none' }}
                    />
                </div>

                {/* 3. Guitar */}
                <div className="relative mt-12 md:mt-0">
                    <div className="relative z-10 w-full h-[500px] bg-gray-100 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rotate-3 hover:rotate-0 transition-transform duration-500">
                        <img
                            src="/images/ashish-guitar.png"
                            alt="Ashish Playing Guitar"
                            className="w-full h-full object-cover object-top grayscale contrast-125 hover:grayscale-0 active:grayscale-0 transition-all duration-500 select-none"
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                            style={{ WebkitTouchCallout: 'none' }}
                        />
                        <div className="absolute bottom-0 left-0 bg-black text-white p-4 font-mono text-xs uppercase tracking-widest">
                            Live Session #044
                        </div>
                    </div>
                    {/* Decorative BG for Guitar */}
                    <div className="absolute top-6 -right-6 w-full h-full border-4 border-dashed border-gray-300 -z-10"></div>
                </div>
            </div>
        </section>
    );
}
