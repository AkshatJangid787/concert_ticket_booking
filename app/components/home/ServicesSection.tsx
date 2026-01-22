
export default function ServicesSection() {
    return (
        <section className="py-20 border-t-4 border-black bg-yellow-400 text-black relative overflow-hidden">
            {/* Texture */}
            <div className="bg-grain absolute inset-0 opacity-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <h2 className="text-5xl md:text-8xl font-black font-display uppercase mb-16 text-center leading-[0.9]">
                    Beyond the <span className="text-transparent text-stroke">Stage.</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {/* Service 1: Live Events */}
                    <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 transform">
                        <div className="bg-black text-white inline-block px-3 py-1 text-xs font-mono font-bold uppercase mb-4 tracking-widest">The Performer</div>
                        <h3 className="text-3xl md:text-4xl font-black font-display uppercase mb-4 leading-none">Parties & Weddings</h3>
                        <p className="font-medium leading-relaxed text-sm md:text-base border-b-2 border-gray-100 pb-4 mb-4">
                            Elevate your celebrations with soulful live music. From intimate weddings to high-energy corporate parties, my band and I deliver an unforgettable sonic experience tailored to your vibe.
                        </p>
                        <ul className="space-y-2 font-mono text-xs md:text-sm font-bold uppercase text-gray-600">
                            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Private Gigs</li>
                            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Wedding Ceremonies</li>
                            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Corporate Events</li>
                        </ul>
                    </div>

                    {/* Service 2: Production */}
                    <div className="bg-black text-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] md:mt-12 hover:translate-x-1 hover:translate-y-[3.25rem] hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all duration-300 transform">
                        <div className="bg-white text-black inline-block px-3 py-1 text-xs font-mono font-bold uppercase mb-4 tracking-widest">The Producer</div>
                        <h3 className="text-3xl md:text-4xl font-black font-display uppercase mb-4 leading-none">Music Production</h3>
                        <p className="font-medium leading-relaxed opacity-80 text-sm md:text-base border-b-2 border-gray-800 pb-4 mb-4">
                            Turning raw ideas into polished masterpieces. Whether you need a custom beat, mixing, or full-scale production, I bring professional studio quality to your vision.
                        </p>
                        <ul className="space-y-2 font-mono text-xs md:text-sm font-bold uppercase text-gray-400">
                            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-white rounded-full"></span> Beat Making</li>
                            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-white rounded-full"></span> Mixing & Mastering</li>
                            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-white rounded-full"></span> Arrangement</li>
                        </ul>
                    </div>

                    {/* Service 3: Teaching */}
                    <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 transform">
                        <div className="bg-black text-white inline-block px-3 py-1 text-xs font-mono font-bold uppercase mb-4 tracking-widest">The Mentor</div>
                        <h3 className="text-3xl md:text-4xl font-black font-display uppercase mb-4 leading-none">Music Education</h3>
                        <p className="font-medium leading-relaxed text-sm md:text-base border-b-2 border-gray-100 pb-4 mb-4">
                            Passing on the craft. I offer personalized lessons for aspiring musicians, covering vocals, instruments, and music theory to help you find your unique sound.
                        </p>
                        <ul className="space-y-2 font-mono text-xs md:text-sm font-bold uppercase text-gray-600">
                            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Vocal Training</li>
                            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Instrument Lessons</li>
                            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Music Theory</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
