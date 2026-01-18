"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function BookTicketClient({ showId }: { showId: string }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function bookTicket() {
        if (!name || !email || !phone) {
            alert("All fields are required");
            return;
        }

        setLoading(true);

        try {
            // 1. Create Ticket
            const res = await fetch("/api/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    showId,
                    name,
                    email,
                    phone,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                alert(data.message);
                setLoading(false);
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
                alert("Failed to create payment order");
                setLoading(false);
                return;
            }

            // 3. Open Razorpay and Handle Payment
            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: "INR",
                name: "Concert Ticket",
                description: "Ticket Booking",
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
                        alert("Booking Successful!");
                        router.push(`/tickets/${ticketId}`); // Redirect to ticket page (if exists) or home
                    } else {
                        alert("Payment Verification Failed: " + verifyData.message);
                    }
                    setLoading(false);
                },
                prefill: {
                    name: name,
                    email: email,
                    contact: phone,
                },
                theme: {
                    color: "#3399cc",
                },
                modal: {
                    ondismiss: async function () {
                        setLoading(false);
                        console.log('Checkout form closed');

                        // If user cancels payment, delete the pending ticket
                        await fetch("/api/tickets/expire", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ticketId }),
                        });
                        alert("Payment cancelled. Ticket released.");
                    }
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error("Booking Error:", error);
            alert("Something went wrong");
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: 400 }}>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <input placeholder="Name" onChange={(e) => setName(e.target.value)} value={name} className="border p-2 mb-2 w-full" />

            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} className="border p-2 mb-2 w-full" />

            <input placeholder="Phone" onChange={(e) => setPhone(e.target.value)} value={phone} className="border p-2 mb-2 w-full" />

            <br /><br />

            <button onClick={bookTicket} disabled={loading} className="bg-blue-500 text-white p-2 w-full rounded disabled:bg-gray-400">
                {loading ? "Processing..." : "Pay & Book Ticket"}
            </button>
        </div>
    );
}
