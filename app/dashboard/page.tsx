"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Ticket {
    id: string;
    status: string;
    createdAt: string;
    show: {
        title: string;
        showDate: string;
        price: number;
        liveEnabled: boolean;
        liveLink: string | null;
    };
    paymentId: string | null;
}

export default function DashboardPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchTickets() {
            try {
                const res = await fetch("/api/users/me/tickets");
                if (res.status === 401) {
                    router.push("/login");
                    return;
                }
                const data = await res.json();
                if (data.success) {
                    setTickets(data.tickets);
                }
            } catch (error) {
                console.error("Failed to fetch tickets", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTickets();
    }, [router]);

    if (loading) return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white text-black">
            <div className="bg-grain fixed inset-0 opacity-20 pointer-events-none z-10"></div>
            <div className="relative z-20 flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] font-bold animate-pulse">
                    Loading Assets
                </p>
            </div>
        </div>
    );

    return (

        <div className="bg-white text-black min-h-screen relative flex flex-col">
            <div className="bg-grain fixed inset-0 opacity-20 pointer-events-none z-50"></div>

            {/* Header - White */}
            <div className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end">
                    <h1 className="text-6xl md:text-8xl font-black font-display uppercase tracking-tighter leading-none">
                        Your <br /> Access
                    </h1>
                    <p className="text-xl font-mono uppercase tracking-widest mt-6 md:mt-0 font-bold">
                        Digital Wallet | {tickets.length} Items
                    </p>
                </div>
            </div>

            {/* Content - Yellow */}
            <div className="bg-yellow-400 border-t-4 border-black flex-1 py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {tickets.length === 0 ? (
                        <div className="text-center py-32 border-4 border-dashed border-black">
                            <h2 className="text-4xl font-bold uppercase text-black font-display mb-8">No Active Passes</h2>
                            <Link href="/shows" className="inline-block bg-black text-white px-8 py-4 text-xl font-bold uppercase tracking-widest hover:bg-white hover:text-black hover:border-black border-4 border-transparent transition-all">
                                Browse Events
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                            {tickets.map((ticket) => (
                                <div key={ticket.id} className="relative group perspective-1000">
                                    <div className="border-4 border-black bg-white p-0 flex flex-col md:flex-row shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-[15px_15px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-2 transition-all duration-300">

                                        {/* Left stub (Visual) */}
                                        <div className="md:w-1/3 bg-black text-white p-6 flex flex-col justify-between border-b-4 md:border-b-0 md:border-r-4 border-white relative overflow-hidden">
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>
                                            <span className="relative z-10 text-xs font-mono uppercase tracking-widest text-gray-400">Admit One</span>
                                            <div className="relative z-10 my-4 text-center">
                                                <div className="text-4xl font-black font-display">
                                                    {new Date(ticket.show.showDate).getDate()}
                                                </div>
                                                <div className="text-xl font-bold uppercase">
                                                    {new Date(ticket.show.showDate).toLocaleString('default', { month: 'short' })}
                                                </div>
                                            </div>
                                            <div className="relative z-10 font-mono text-[10px] uppercase text-center opacity-50 break-all">
                                                ID: {ticket.id.split('-')[0]}
                                            </div>
                                        </div>

                                        {/* Right Content */}
                                        <div className="flex-1 p-8 flex flex-col justify-between relative bg-white">
                                            {/* Status Badge */}
                                            <div className="absolute top-4 right-4">
                                                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest border border-black ${ticket.status === 'CONFIRMED' ? 'bg-green-400' : 'bg-yellow-400'}`}>
                                                    {ticket.status}
                                                </span>
                                            </div>

                                            <div>
                                                <h3 className="text-2xl font-black font-display uppercase leading-tight mb-2 pr-12">{ticket.show.title}</h3>
                                                <p className="text-sm font-mono opacity-60">
                                                    {new Date(ticket.show.showDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} | Virtual Arena
                                                </p>
                                            </div>

                                            <div className="mt-8">
                                                {ticket.status === "CONFIRMED" && ticket.show.liveEnabled && ticket.show.liveLink ? (
                                                    <a
                                                        href={ticket.show.liveLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block w-full text-center bg-red-600 text-white font-bold uppercase tracking-widest py-3 border-2 border-transparent hover:bg-white hover:text-red-600 hover:border-red-600 transition-colors animate-pulse"
                                                    >
                                                        Tap to Join Live
                                                    </a>
                                                ) : (
                                                    <div className="w-full bg-gray-100 text-gray-400 font-bold uppercase tracking-widest py-3 text-center border-2 border-gray-100 cursor-not-allowed text-xs">
                                                        {ticket.status === "PENDING"
                                                            ? "Finish Payment..."
                                                            : new Date(ticket.show.showDate) < new Date()
                                                                ? "Event Ended"
                                                                : "Awaiting Broadcast"}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Rip Effect (Visual Decoration) */}
                                        <div className="absolute top-1/2 -left-2 w-4 h-4 bg-white rounded-full border-r-4 border-black z-20 hidden md:block transform -translate-y-1/2"></div>
                                        <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white rounded-full border-l-4 border-black z-20 hidden md:block transform -translate-y-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
