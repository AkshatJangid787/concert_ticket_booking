
export default function Footer() {
    return (
        <footer className="bg-white text-black py-12 px-6 md:px-12 border-t-4 border-black">
            <div className="flex flex-col md:flex-row justify-between items-end">
                <div>
                    <h2 className="text-[10vw] font-black font-display uppercase leading-none opacity-10 select-none">Ashish</h2>
                </div>
                <div className="flex gap-8 text-sm font-mono uppercase tracking-widest mt-8 md:mt-0 mb-4 md:mb-8 font-bold">
                    <a href="#" className="hover:text-red-600 hover:line-through transition-colors">Instagram</a>
                    <a href="#" className="hover:text-red-600 hover:line-through transition-colors">YouTube</a>
                    <a href="#" className="hover:text-red-600 hover:line-through transition-colors">Spotify</a>
                </div>
            </div>
        </footer>
    );
}
