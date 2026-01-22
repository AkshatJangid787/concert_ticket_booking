"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function BookTicketClient({ showId }: { showId: string }) {
    const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true); // Initial load for auth check
    const [processing, setProcessing] = useState(false); // Processing payment
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();
                if (data.authenticated) {
                    setUser(data.user);
                }
            } catch (err) {
                console.error("Auth check failed", err);
            } finally {
                setLoading(false);
            }
        }
        checkAuth();
    }, []);

    async function bookTicket() {
        if (!user) {
            router.push("/login");
            return;
        }

        setProcessing(true);

        try {
            // 1. Create Ticket
            const res = await fetch("/api/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    showId
                }),
            });

            const data = await res.json();

            if (!data.success) {
                toast.error(data.message);
                setProcessing(false);
                return;
            }

            const ticketId = data.ticketId;

            // 2. Create Razorpay Order
            const orderRes = await fetch("/api/payments/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketID: ticketId }),
            });

            const orderData = await orderRes.json();

            if (!orderData.success) {
                toast.error("Failed to create payment order");
                setProcessing(false);
                return;
            }

            // 3. Open Razorpay and Handle Payment
            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: "INR",
                name: "Ashish Soni Live",
                description: "Concert Access",
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    // 4. Verify Payment on Success
                    const verifyRes = await fetch("/api/payments/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ticketId: ticketId,
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                        }),
                    });

                    const verifyData = await verifyRes.json();

                    if (verifyData.success) {
                        toast.success("Ticket booked successfully!");
                        router.push("/dashboard");
                    } else {
                        toast.error("Payment Verification Failed: " + verifyData.message);
                    }
                    setProcessing(false);
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#000000",
                },
                modal: {
                    ondismiss: async function () {
                        setProcessing(false);
                        console.log('Checkout form closed');

                        // If user cancels payment, delete the pending ticket
                        await fetch("/api/tickets/expire", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ticketId }),
                        });
                        toast.info("Payment cancelled. Ticket released.");
                    }
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error("Booking Error:", error);
            toast.error("Something went wrong");
            setProcessing(false);
        }
    }

    if (loading) return <div className="animate-pulse font-black uppercase text-xl text-center">Identifying User...</div>;

    return (
        <div className="w-full">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            {user ? (
                user.role === "ADMIN" ? (
                    <div className="text-center p-8 border-4 border-red-600 bg-red-50">
                        <p className="text-red-600 font-black text-2xl mb-4 font-display uppercase">Restricted Access</p>
                        <p className="font-bold uppercase tracking-widest mb-6 text-xs">Admin Privilege Active</p>
                        <Link href="/admin" className="inline-block bg-red-600 text-white px-6 py-3 font-bold uppercase hover:bg-black transition-colors">
                            Return to Command
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-black font-display uppercase mb-4">Confirm Identity</h2>
                            <div className="border-2 border-black p-4 bg-gray-50 flex items-center gap-4">
                                <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-lg uppercase leading-none">{user.name}</p>
                                    <p className="text-xs font-mono text-gray-500">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-black font-display uppercase mb-4">Order Summary</h2>
                            <div className="border-2 border-black p-4 border-dashed">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold uppercase text-sm">Item</span>
                                    <span className="font-bold uppercase text-sm">Qty</span>
                                </div>
                                <div className="flex justify-between items-center text-xl font-black">
                                    <span>General Admission</span>
                                    <span>01</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={bookTicket}
                            disabled={processing}
                            className="w-full bg-black text-white h-20 text-2xl font-black uppercase tracking-widest hover:bg-red-600 hover:scale-[1.02] active:scale-95 transition-all duration-300 border-4 border-transparent disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {processing ? "Starting Protocol..." : "Initiate Payment"}
                        </button>

                        <p className="text-center text-xs font-mono uppercase text-gray-400">
                            Secured by Razorpay Encryption
                        </p>
                    </div>
                )
            ) : (
                <div className="text-center space-y-8">
                    <h2 className="text-4xl font-black font-display uppercase">Authentication Required</h2>
                    <p className="text-lg font-mono uppercase opacity-60">You must implement identification protocol to proceed.</p>

                    <div className="space-y-4">
                        <Link href="/login" className="block w-full text-center bg-black text-white font-bold uppercase tracking-widest py-4 hover:bg-gray-800 transition-colors">
                            Login Access
                        </Link>
                        <Link href="/register" className="block w-full text-center bg-transparent text-black font-bold uppercase tracking-widest py-4 border-4 border-black hover:bg-black hover:text-white transition-colors">
                            Register Identity
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
