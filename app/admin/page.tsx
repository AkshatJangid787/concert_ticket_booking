"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

interface Show {
    id: string;
    title: string;
    description: string;
    showDate: string;
    price: number;
    totalSeats: number | null;
    liveEnabled: boolean;
    liveLink: string | null;
    _count?: {
        tickets: number;
    };
}

interface Ticket {
    id: string;
    status: string;
    user: {
        name: string;
        email: string;
    };
    paymentId: string;
    createdAt: string;
}

interface Stats {
    revenue: number;
    ticketsSold: number;
    recentSales: any[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState<{ [key: string]: Ticket[] }>({});
    const [viewingTickets, setViewingTickets] = useState<string | null>(null);

    // UI State
    const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);

    // Form State
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        showDate: "",
        price: "",
        totalSeats: "",
        liveEnabled: false,
        liveLink: ""
    });

    useEffect(() => {
        const init = async () => {
            await fetchStats();
            await fetchShows();
            setLoading(false);
        };
        init();
    }, []);

    async function fetchStats() {
        try {
            const res = await fetch("/api/admin/stats");
            const data = await res.json();
            if (data.success) setStats(data.stats);
        } catch (e) { console.error(e); }
    }

    async function fetchShows() {
        const res = await fetch("/api/admin/shows");
        const data = await res.json();
        if (data.success) {
            setShows(data.shows);
        }
    }

    async function fetchTickets(showId: string) {
        if (viewingTickets === showId) {
            setViewingTickets(null);
            return;
        }

        const res = await fetch(`/api/admin/shows/${showId}/tickets`);
        const data = await res.json();
        if (data.success) {
            setTickets(prev => ({ ...prev, [showId]: data.tickets }));
            setViewingTickets(showId);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const url = isEditing
            ? `/api/admin/shows/${isEditing}`
            : "/api/admin/shows";

        const method = isEditing ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...formData,
                price: Number(formData.price),
                totalSeats: formData.totalSeats ? Number(formData.totalSeats) : null
            })
        });

        if (res.ok) {
            toast.success(isEditing ? "Show Updated" : "Show Created");
            setFormData({
                title: "",
                description: "",
                showDate: "",
                price: "",
                totalSeats: "",
                liveEnabled: false,
                liveLink: ""
            });
            setIsEditing(null);
            setIsMobileFormOpen(false); // Close on success
            fetchShows();
        } else {
            toast.error("Failed to save show");
        }
    }

    async function deleteShow(id: string) {
        if (!confirm("Are you sure? This will delete the show.")) return;
        const res = await fetch(`/api/admin/shows/${id}`, { method: "DELETE" });
        if (res.ok) fetchShows();
    }

    function editShow(show: Show) {
        setFormData({
            title: show.title,
            description: show.description || "",
            showDate: new Date(show.showDate).toISOString().slice(0, 16),
            price: show.price.toString(),
            totalSeats: show.totalSeats?.toString() || "",
            liveEnabled: show.liveEnabled,
            liveLink: show.liveLink || ""
        });
        setIsEditing(show.id);
        setIsMobileFormOpen(true); // Open form to edit
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-bold uppercase tracking-widest">Loading Command Center...</div>;

    return (
        <div className="min-h-screen bg-white text-black pt-24 pb-20 px-4 md:px-8 font-sans">
            {/* Background Texture */}
            <div className="bg-grain fixed inset-0 opacity-20 pointer-events-none z-50"></div>

            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-4 border-black pb-8">
                    <div>
                        <h1 className="text-4xl md:text-7xl font-black font-display uppercase tracking-tighter leading-none">
                            Dashboard
                        </h1>
                        <p className="font-mono text-xs md:text-sm uppercase tracking-widest text-gray-500 mt-2">
                            System Admin Control
                        </p>
                    </div>
                    <Link href="/" className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                        View Site
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-6 bg-gray-50 border-2 border-black hover:-translate-y-1 transition-transform duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Total Revenue</p>
                        <p className="text-2xl md:text-4xl font-black font-display">₹{stats?.revenue.toLocaleString() || 0}</p>
                    </div>
                    <div className="p-6 bg-gray-50 border-2 border-black hover:-translate-y-1 transition-transform duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Total Tickets</p>
                        <p className="text-2xl md:text-4xl font-black font-display">{stats?.ticketsSold || 0}</p>
                    </div>
                    <div className="p-6 bg-gray-50 border-2 border-black hover:-translate-y-1 transition-transform duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Active Shows</p>
                        <p className="text-2xl md:text-4xl font-black font-display">{shows.length}</p>
                    </div>
                    <div className="p-6 bg-black text-white border-2 border-black hover:-translate-y-1 transition-transform duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Admin Status</p>
                        <p className="text-2xl md:text-4xl font-black font-display text-green-400">ONLINE</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT: Editor Form (4 cols) */}
                    {/* Mobile Toggle for Form */}
                    <div className="lg:hidden w-full">
                        <button
                            onClick={() => setIsMobileFormOpen(!isMobileFormOpen)}
                            className="w-full flex items-center justify-between bg-black text-white p-4 font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                            <span>{isEditing ? "Edit Show" : "Create New Show"}</span>
                            <span>{isMobileFormOpen ? "−" : "+"}</span>
                        </button>
                    </div>

                    <div className={`lg:col-span-4 h-fit lg:sticky lg:top-32 ${isMobileFormOpen ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white p-8 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-xl font-black font-display uppercase mb-6 flex items-center gap-2 border-b-2 border-gray-100 pb-4">
                                {isEditing && <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>}
                                {isEditing ? "Editing Show" : "Create New Show"}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-black">Show Title</label>
                                    <input
                                        className="w-full bg-gray-50 border-2 border-gray-200 p-3 font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder-gray-400"
                                        placeholder="E.g. SUMMER VIBES"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-black">Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full bg-gray-50 border-2 border-gray-200 p-3 font-mono text-sm focus:border-black focus:outline-none transition-colors rounded-none"
                                        value={formData.showDate}
                                        min={new Date().toISOString().slice(0, 16)}
                                        onChange={e => setFormData({ ...formData, showDate: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-black">Description</label>
                                    <textarea
                                        rows={3}
                                        className="w-full bg-gray-50 border-2 border-gray-200 p-3 font-medium text-sm focus:border-black focus:outline-none transition-colors rounded-none resize-none placeholder-gray-400"
                                        placeholder="Event details..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-black">Price (INR)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-gray-50 border-2 border-gray-200 p-3 font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder-gray-400"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            required
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-black">Seats Limit</label>
                                        <input
                                            type="number"
                                            className="w-full bg-gray-50 border-2 border-gray-200 p-3 font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder-gray-400"
                                            value={formData.totalSeats}
                                            onChange={e => setFormData({ ...formData, totalSeats: e.target.value })}
                                            placeholder="∞"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 border-2 border-gray-200 border-dashed">
                                    <label className="flex items-center space-x-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 text-black border-2 border-gray-400 rounded-none focus:ring-0 cursor-pointer"
                                            checked={formData.liveEnabled}
                                            onChange={e => setFormData({ ...formData, liveEnabled: e.target.checked })}
                                        />
                                        <span className="font-bold uppercase tracking-widest text-xs group-hover:text-black transition-colors">Enable Live Stream</span>
                                    </label>
                                    {formData.liveEnabled && (
                                        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                            <input
                                                className="w-full bg-white border-2 border-black p-2 font-mono text-xs focus:outline-none"
                                                placeholder="Paste Zoom/Meet link..."
                                                value={formData.liveLink}
                                                onChange={e => setFormData({ ...formData, liveLink: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 bg-black text-white py-4 px-6 text-sm font-black uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                                        {isEditing ? "Save Changes" : "Publish Show"}
                                    </button>
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => { setIsEditing(null); setFormData({ title: "", description: "", showDate: "", price: "", totalSeats: "", liveEnabled: false, liveLink: "" }); setIsMobileFormOpen(false); }}
                                            className="px-4 border-2 border-gray-300 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT: Show List (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-baseline justify-between border-b-2 border-gray-100 pb-4">
                            <h3 className="text-2xl font-black font-display uppercase">
                                Active Shows
                            </h3>
                            <span className="text-sm font-mono font-bold text-gray-400">{shows.length} Total</span>
                        </div>

                        {shows.length === 0 ? (
                            <div className="py-20 text-center border-4 border-dashed border-gray-200 text-gray-400 font-mono text-sm uppercase">
                                No shows active. Create one to get started.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {shows.map((show) => (
                                    <div key={show.id} className="group bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-300 relative overflow-hidden">

                                        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    {show.liveEnabled && (
                                                        <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full animate-pulse">
                                                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span> Live
                                                        </span>
                                                    )}
                                                    <h4 className="text-3xl font-black font-display uppercase leading-none break-words">
                                                        {show.title}
                                                    </h4>
                                                </div>

                                                <div className="flex flex-wrap gap-4 text-xs font-mono font-bold uppercase tracking-wider text-gray-500">
                                                    <span className="flex items-center gap-1">🗓 {new Date(show.showDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    <span className="flex items-center gap-1">⏰ {new Date(show.showDate).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}</span>
                                                    <span className="flex items-center gap-1 text-black bg-gray-100 px-2">💰 ₹{show.price}</span>
                                                    {show.totalSeats && (
                                                        <span className={`flex items-center gap-1 ${(show.totalSeats - (show._count?.tickets || 0)) < 10 ? 'text-red-500' : ''}`}>
                                                            💺 {show.totalSeats - (show._count?.tickets || 0)} / {show.totalSeats} Left
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1 text-green-600">
                                                        📈 ₹{((show._count?.tickets || 0) * show.price).toLocaleString()} Earned
                                                    </span>
                                                </div>

                                                {/* DESCRIPTION */}
                                                {show.description && (
                                                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                                        {show.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-row md:flex-col gap-2 min-w-[140px] border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                                <button onClick={() => fetchTickets(show.id)} className={`flex-1 py-3 px-4 text-[10px] font-bold uppercase tracking-widest border-2 transition-colors ${viewingTickets === show.id ? "bg-black text-white border-black" : "bg-white text-black border-black hover:bg-gray-100"}`}>
                                                    {viewingTickets === show.id ? "Hide Sales" : "View Sales"}
                                                </button>
                                                <button onClick={() => editShow(show)} className="flex-1 py-3 px-4 text-[10px] font-bold uppercase tracking-widest border-2 border-gray-200 hover:border-black text-gray-600 hover:text-black transition-colors">
                                                    Edit
                                                </button>
                                                <button onClick={() => deleteShow(show.id)} className="px-3 text-gray-300 hover:text-red-600 transition-colors" title="Delete Show">
                                                    🗑
                                                </button>
                                            </div>
                                        </div>

                                        {/* TICKET DATA TABLE */}
                                        {viewingTickets === show.id && (
                                            <div className="bg-gray-50 border-t-2 border-black p-4 md:p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h5 className="font-bold text-xs uppercase tracking-widest text-gray-500">Transactions ({tickets[show.id]?.length || 0})</h5>
                                                </div>

                                                {tickets[show.id]?.length === 0 ? (
                                                    <p className="font-mono text-xs text-center py-8 text-gray-400 italic">No tickets sold yet.</p>
                                                ) : (
                                                    <div className="overflow-x-auto max-h-80 overflow-y-auto border border-gray-200 bg-white">
                                                        <table className="w-full text-left border-collapse">
                                                            <thead className="bg-gray-100 sticky top-0">
                                                                <tr className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                                    <th className="p-3 border-b border-gray-200">User</th>
                                                                    <th className="p-3 border-b border-gray-200">Status</th>
                                                                    <th className="p-3 border-b border-gray-200 text-right">Payment ID</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="font-mono text-xs">
                                                                {tickets[show.id]?.map(t => (
                                                                    <tr key={t.id} className="border-b border-gray-50 hover:bg-yellow-50 transition-colors">
                                                                        <td className="p-3">
                                                                            <div className="font-bold text-black">{t.user?.name}</div>
                                                                            <div className="text-gray-400 text-[10px]">{t.user?.email}</div>
                                                                        </td>
                                                                        <td className="p-3">
                                                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${t.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                                <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'CONFIRMED' ? 'bg-green-600' : 'bg-yellow-600'}`}></span>
                                                                                {t.status}
                                                                            </span>
                                                                        </td>
                                                                        <td className="p-3 text-right text-gray-500">{t.paymentId ? t.paymentId.slice(-8) : "—"}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
