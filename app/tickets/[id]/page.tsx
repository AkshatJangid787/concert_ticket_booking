import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import TicketVisual from "../../components/tickets/TicketVisual";


export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const ticket = await prisma.ticket.findUnique({
        where: { id },
        include: { show: true, user: true },
    });

    if (!ticket) return notFound();

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Texture */}
            <div className="bg-grain fixed inset-0 opacity-20 pointer-events-none z-50"></div>

            {/* Success Message */}
            <div className="absolute top-10 left-0 w-full text-center">
                <h1 className="text-4xl md:text-6xl font-black font-display uppercase tracking-widest text-green-500 animate-pulse">
                    Access Granted
                </h1>
            </div>

            {/* Ticket Visualization */}
            <TicketVisual ticket={ticket} />

            <div className="mt-12 flex gap-4">
                <Link href="/dashboard" className="px-8 py-3 bg-white text-black font-bold uppercase hover:bg-gray-200 transition-colors">
                    Save to Wallet
                </Link>
                <Link href="/" className="px-8 py-3 border-2 border-white text-white font-bold uppercase hover:bg-white hover:text-black transition-colors">
                    Back Home
                </Link>
            </div>
        </div>
    );
}
