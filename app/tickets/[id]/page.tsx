import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const ticket = await prisma.ticket.findUnique({
        where: { id },
        include: { show: true },
    });

    if (!ticket) return notFound();

    return (
        <div className="p-10 text-center container mx-auto">
            <h1 className="text-3xl font-bold text-green-600 mb-6">Booking Confirmed!</h1>

            <div className="border border-gray-200 p-8 rounded-lg shadow-lg max-w-md mx-auto bg-white">
                <h2 className="text-2xl font-bold mb-2">{ticket.show.title}</h2>
                <p className="text-gray-600 mb-4">{new Date(ticket.show.showDate).toLocaleString()}</p>

                <hr className="my-4" />

                <div className="text-left space-y-2">
                    <p><strong className="text-gray-700">Name:</strong> {ticket.name}</p>
                    <p><strong className="text-gray-700">Email:</strong> {ticket.email}</p>
                    <p><strong className="text-gray-700">Ticket ID:</strong> <span className="font-mono text-sm bg-gray-100 p-1 rounded">{ticket.id}</span></p>
                    <p>
                        <strong className="text-gray-700">Status:</strong>{' '}
                        <span className={`px-2 py-1 rounded text-sm ${ticket.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {ticket.status}
                        </span>
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <a href="/" className="text-blue-500 hover:underline">Mock Back to Home</a>
            </div>
        </div>
    );
}
