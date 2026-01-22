
export default function MarqueeSection() {
    return (
        <section className="py-8 bg-yellow-400 border-y-8 border-black overflow-hidden relative">
            {/* Texture overlay on marquee */}
            <div className="absolute inset-0 bg-grain opacity-50 pointer-events-none z-10"></div>

            <div className="relative flex overflow-hidden z-20">
                <div className="animate-marquee whitespace-nowrap flex items-center">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center">
                            <span className="text-6xl md:text-8xl font-black font-display uppercase mx-4 text-black leading-none pb-2">Live in Concert</span>
                            <span className="h-6 w-6 bg-red-600 rounded-full mx-4"></span>
                            <span className="text-6xl md:text-8xl font-black font-display uppercase mx-4 text-transparent text-stroke leading-none pb-2">Unplugged</span>
                            <span className="h-6 w-6 bg-black rounded-full mx-4"></span>
                        </div>
                    ))}
                </div>
                <div className="absolute top-0 animate-marquee whitespace-nowrap flex items-center hidden md:flex" style={{ animationDelay: '5s' }}> {/* Offset duplicate for smooth loop if needed, but often CSS just loops one wide div */}
                    {/* Usually marquee animation needs duplicate content inline. Let's stick to standard practice: 
                         Just putting content twice in a flex container is usually cleaner than absolute positioning if width isn't exact.
                         Actually, my current CSS 'animate-marquee' probably translates -50%. So I need content to be double wide.
                     */}
                </div>
            </div>
        </section>
    );
}
