
interface Show {
    id: string;
    title: string;
    showDate: string;
    price: number;
    totalSeats: number | null;
    _count?: {
        tickets: number;
    };
}

export default function ShowCard({ show }: { show: Show }) {
    const soldTickets = show._count?.tickets || 0;
    const remainingSeats = show.totalSeats !== null ? show.totalSeats - soldTickets : null;
    const isSoldOut = remainingSeats !== null && remainingSeats <= 0;

    return (
        <div key={show.id} className="group relative border-b-2 border-black py-10 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-black hover:text-white transition-colors duration-300 px-4">
            <div className="md:w-1/2">
                <h3 className="text-4xl md:text-6xl font-black font-display uppercase leading-none mb-2">
                    {show.title}
                </h3>
                <div className="flex gap-4 items-center">
                    <p className="text-lg font-mono uppercase opacity-70">
                        {new Date(show.showDate).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })} @ {new Date(show.showDate).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {remainingSeats !== null && !isSoldOut && (
                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 uppercase tracking-widest animate-pulse">
                            {remainingSeats} Tickets Left
                        </span>
                    )}
                </div>
            </div>

            <div className="md:w-1/4 mt-4 md:mt-0 text-right md:text-center">
                <p className="text-3xl font-bold font-display">₹{show.price}</p>
            </div>

            <div className="mt-6 md:mt-0">
                {isSoldOut ? (
                    <span className="inline-block bg-red-600 text-white px-8 py-3 text-lg font-bold uppercase tracking-widest border-2 border-red-600 cursor-not-allowed">
                        Sold Out
                    </span>
                ) : (
                    <a
                        href={`/shows/${show.id}`}
                        className="inline-block bg-black text-white px-8 py-3 text-lg font-bold uppercase tracking-widest border-2 border-black group-hover:bg-white group-hover:text-black transition-all"
                    >
                        Book Seat
                    </a>
                )}
            </div>
        </div>
    );
}
