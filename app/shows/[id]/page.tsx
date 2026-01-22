import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import TicketCountdown from "@/app/components/TicketCountdown";
import BookTicketClient from "./BookTicketClient";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import Link from "next/link";

export default async function ShowPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const show = await prisma.show.findUnique({
        where: { id },
        include: {
            _count: {
                select: {
                    tickets: {
                        where: { status: "CONFIRMED" }
                    }
                }
            }
        }
    });

    if (!show) {
        return notFound();
    }

    // Check if current user has purchased
    let isPurchased = false;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (token) {
        try {
            const decoded = verifyToken(token);
            if (decoded && decoded.userId) {
                const userTicket = await prisma.ticket.findFirst({
                    where: {
                        showId: id,
                        userId: decoded.userId,
                        status: "CONFIRMED"
                    }
                });
                if (userTicket) {
                    isPurchased = true;
                }
            }
        } catch (e) {
            // Token invalid, ignore
        }
    }

    const soldTickets = show._count?.tickets || 0;
    const remainingSeats = show.totalSeats !== null ? show.totalSeats - soldTickets : null;
    const isSoldOut = remainingSeats !== null && remainingSeats <= 0;

    return (
        <div className="min-h-screen bg-white text-black pt-32 pb-20 px-4 flex justify-center items-center">
            {/* Background Texture */}
            <div className="bg-grain fixed inset-0 opacity-20 pointer-events-none z-50"></div>

            <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border-4 border-black bg-white shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] relative z-10">
                {/* Left: Visual/Info */}
                <div className="bg-black text-white p-12 flex flex-col justify-between min-h-[500px] relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="border-b-2 border-white pb-6 mb-6">
                            <h1 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tighter leading-none mb-2">
                                {show.title}
                            </h1>
                            <p className="font-mono text-sm text-gray-400">
                                {new Date(show.showDate).toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>

                        <div className="mb-8">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Access Begins In</p>
                            <TicketCountdown showDate={show.showDate.toISOString()} />
                        </div>

                        {show.description && (
                            <div className="mb-8">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">About Event</p>
                                <p className="font-medium text-sm md:text-base opacity-90 leading-relaxed font-mono">
                                    {show.description}
                                </p>
                            </div>
                        )}

                        {remainingSeats !== null && !isSoldOut && !isPurchased && (
                            <div className="mt-4">
                                <p className="text-xs font-bold uppercase tracking-widest text-red-500 animate-pulse">
                                    Hurry! Only {remainingSeats} Left
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-4 border-l-4 border-red-600 pl-4 bg-white/10 p-4">
                            <div className="text-4xl">🎫</div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Transaction Type</p>
                                <p className="font-bold text-lg uppercase">Virtually Live Pass - ₹{show.price}</p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative */}
                    {/* Decorative */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] font-black text-white opacity-5 pointer-events-none leading-none select-none">
                        ×
                    </div>
                </div>

                {/* Right: Action */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    {new Date(show.showDate) < new Date() ? (
                        <div className="text-center p-8 border-4 border-gray-300 bg-gray-50">
                            <h2 className="text-3xl md:text-5xl font-black font-display uppercase mb-4 text-gray-400">
                                Show Expired
                            </h2>
                            <p className="font-mono text-sm uppercase tracking-widest text-gray-500 mb-8">
                                This event has concluded.
                            </p>
                            <Link href="/shows" className="inline-block bg-black text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                                Browse Upcoming
                            </Link>
                        </div>
                    ) : isPurchased ? (
                        <div className="text-center p-8 border-4 border-black bg-green-50">
                            <h2 className="text-3xl md:text-5xl font-black font-display uppercase mb-4 text-green-700">
                                Access Granted
                            </h2>
                            <p className="font-mono text-sm uppercase tracking-widest text-black mb-8">
                                You have already purchased a ticket for this event.
                            </p>
                            <Link href="/dashboard" className="inline-block bg-black text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-black border-4 border-transparent hover:border-black transition-all">
                                View My Tickets
                            </Link>
                        </div>
                    ) : isSoldOut ? (
                        <div className="text-center p-8 border-4 border-red-600 bg-white">
                            <h2 className="text-4xl md:text-6xl font-black font-display uppercase mb-4 text-red-600">
                                Sold Out
                            </h2>
                            <p className="font-mono text-sm uppercase tracking-widest text-black mb-8">
                                All tickets for this event have been claimed.
                            </p>
                            <Link href="/shows" className="inline-block bg-black text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-black hover:border-black border-4 border-transparent transition-all">
                                View Other Shows
                            </Link>
                        </div>
                    ) : (
                        <BookTicketClient showId={id} />
                    )}
                </div>
            </div>
        </div>
    );
}
