
import TicketCountdown from "@/app/components/TicketCountdown";

interface TicketProps {
    ticket: {
        id: string;
        show: {
            title: string;
            price: number;
            showDate: Date;
        };
        user?: {
            name: string | null;
        } | null;
        status: string;
    };
}

export default function TicketVisual({ ticket }: TicketProps) {
    return (
        <div className="relative mt-10 w-full max-w-sm md:max-w-3xl bg-white text-black border-4 border-white flex flex-col md:flex-row shadow-[0px_0px_50px_rgba(255,255,255,0.2)]">
            {/* Left: Main Ticket Info */}
            <div className="flex-1 p-8 border-r-4 border-black border-dashed relative">
                {/* Cutout circles */}
                <div className="absolute -top-6 -right-6 h-12 w-12 bg-black rounded-full z-10"></div>
                <div className="absolute -bottom-6 -right-6 h-12 w-12 bg-black rounded-full z-10"></div>

                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Event</p>
                        <h2 className="text-3xl md:text-5xl font-black font-display uppercase leading-none">{ticket.show.title}</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Price</p>
                        <p className="text-3xl font-black font-display text-transparent text-stroke">₹{ticket.show.price}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Date & Time</p>
                        <p className="text-xl font-bold font-mono uppercase">
                            {new Date(ticket.show.showDate).toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-lg font-mono uppercase text-gray-400">
                            {new Date(ticket.show.showDate).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })} IST
                        </p>
                        <TicketCountdown showDate={ticket.show.showDate.toISOString()} />
                    </div>

                    <div className="flex gap-8">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Holder</p>
                            <p className="font-bold uppercase">{ticket.user?.name || "Unknown"}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Status</p>
                            <p className={`font-bold uppercase ${ticket.status === 'CONFIRMED' ? 'text-green-600' : 'text-yellow-600'}`}>{ticket.status}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Stub / QC */}
            <div className="w-full md:w-64 bg-gray-100 p-8 flex flex-col justify-center items-center relative">
                {/* Cutout circles matching left side */}
                <div className="hidden md:block absolute -top-6 -left-6 h-12 w-12 bg-black rounded-full z-20"></div>
                <div className="hidden md:block absolute -bottom-6 -left-6 h-12 w-12 bg-black rounded-full z-20"></div>

                <div className="w-32 h-32 bg-white border-2 border-black mb-4 flex items-center justify-center p-2">
                    {/* Placeholder QR */}
                    <div className="w-full h-full bg-black pattern-grid-lg opacity-20"></div>
                    <span className="absolute font-mono text-xs font-bold">SCAN_ME</span>
                </div>
                <p className="font-mono text-[10px] text-center uppercase tracking-widest break-all">
                    ID: {ticket.id}
                </p>
                <p className="mt-4 font-black font-display text-2xl rotate-0 md:-rotate-90 md:absolute md:right-[-20px]">
                    ADMIT ONE
                </p>
            </div>
        </div>
    );
}
