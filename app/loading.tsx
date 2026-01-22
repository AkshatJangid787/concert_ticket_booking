export default function Loading() {
    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white text-black">
            {/* Background Texture */}
            <div className="bg-grain fixed inset-0 opacity-20 pointer-events-none z-10"></div>

            <div className="relative z-20 flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] font-bold animate-pulse">
                    Loading
                </p>
            </div>
        </div>
    );
}
