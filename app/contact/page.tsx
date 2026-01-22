"use client";

export default function ContactPage() {
    return (
        <div className="bg-white text-black min-h-screen relative overflow-hidden flex flex-col">
            {/* Background Texture */}
            <div className="bg-grain fixed inset-0 opacity-20 pointer-events-none z-10"></div>

            {/* Header Section - WHITE */}
            <div className="pt-40 pb-20 px-6 relative z-20">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-[12vw] leading-[0.8] font-black font-display uppercase tracking-tighter mb-4 text-black cursor-default select-none">
                        Let&apos;s Talk
                    </h1>
                    <p className="font-mono text-sm md:text-base uppercase tracking-[0.3em] font-bold">
                        Bookings • Collaborations • Inquiries
                    </p>
                </div>
            </div>

            {/* Content Section - YELLOW */}
            <div className="flex-1 bg-yellow-400 border-t-4 border-black w-full px-6 py-20 relative z-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

                    {/* Left Column: Email CTA */}
                    <div className="flex flex-col justify-center h-full">
                        <div className="relative group perspective">
                            <div className="absolute inset-0 bg-black translate-x-4 translate-y-4 transition-transform group-hover:translate-x-6 group-hover:translate-y-6 duration-300"></div>
                            <a
                                href="mailto:contact@ashishsoni.com"
                                className="relative block border-4 border-black bg-white p-12 lg:p-16 hover:-translate-y-2 hover:-translate-x-2 transition-transform duration-300"
                            >
                                <h2 className="text-xl md:text-2xl font-bold font-mono uppercase tracking-widest mb-4 text-gray-400">Direct Email</h2>
                                <span className="block text-4xl md:text-6xl lg:text-7xl font-black font-display uppercase break-words leading-none group-hover:text-red-600 transition-colors">
                                    contact@<br />ashishsoni.com
                                </span>
                                <div className="mt-8 flex items-center gap-4">
                                    <span className="w-12 h-1 bg-black group-hover:w-24 transition-all duration-300"></span>
                                    <span className="font-bold uppercase tracking-widest">Send mail</span>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Social Links */}
                    <div className="flex flex-col gap-6">
                        {[
                            { name: "Instagram", handle: "@ashishsonimusic", url: "#", delay: "0" },
                            { name: "YouTube", handle: "Ashish Soni Official", url: "#", delay: "100" },
                            { name: "Spotify", handle: "Ashish Soni", url: "#", delay: "200" }
                        ].map((social, idx) => (
                            <a
                                key={idx}
                                href={social.url}
                                className="group flex items-center justify-between border-b-2 border-black py-8 hover:bg-black hover:text-white hover:px-8 transition-all duration-300 cursor-pointer"
                            >
                                <div>
                                    <span className="block text-4xl md:text-5xl font-black font-display uppercase mb-1">{social.name}</span>
                                    <span className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-60">{social.handle}</span>
                                </div>
                                <span className="text-2xl md:text-4xl opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    ↗
                                </span>
                            </a>
                        ))}
                    </div>

                </div>
            </div>

            {/* Decorative giant text bg */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-[20vw] font-black font-display text-gray-100 opacity-50 pointer-events-none select-none z-0 whitespace-nowrap">
                REACH OUT
            </div>
        </div>
    );
}
