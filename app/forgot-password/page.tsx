"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState("request"); // 'request' | 'reset'
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [remaining, setRemaining] = useState<number | null>(null);
    const [timer, setTimer] = useState(0);
    const router = useRouter();
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    async function handleRequest(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage(data.message);
                if (data.remaining !== undefined) setRemaining(data.remaining);
                setStep("reset");
                setTimer(60); // Start timer
            } else {
                setError(data.error || data.message || "Request failed");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    async function handleReset(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Password reset successfully. Please login.");
                router.push("/login");
            } else {
                setError(data.error || data.message || "Reset failed");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-white text-black flex flex-col justify-center items-center relative overflow-hidden px-4">
            {/* Background Texture */}
            <div className="bg-grain fixed inset-0 opacity-20 pointer-events-none z-10"></div>

            <div className="w-full max-w-lg relative z-20">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter leading-none mb-4">
                        Recover
                    </h1>
                    <p className="font-mono text-sm uppercase tracking-widest text-gray-500">
                        {step === 'request' ? 'Restore Access' : 'Secure New Credentials'}
                    </p>
                </div>

                <div className="border-y-4 border-black py-12">
                    {step === 'request' ? (
                        <form className="space-y-8" onSubmit={handleRequest}>
                            <div className="group">
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-400 group-focus-within:text-black transition-colors">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full border-b-2 border-gray-200 bg-transparent py-2 text-xl font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder-gray-200"
                                    placeholder="name@example.com"
                                    disabled={loading}
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-red-100 border border-red-500 text-red-600 font-bold text-sm uppercase tracking-wider text-center">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white h-16 text-xl font-black uppercase tracking-widest hover:bg-white hover:text-black border-4 border-transparent hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Sending..." : "Send Code"}
                            </button>
                        </form>
                    ) : (
                        <form className="space-y-8" onSubmit={handleReset}>
                            <div className="bg-gray-100 p-4 font-mono text-xs mb-8">
                                Code sent to: <b>{email}</b>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-400 group-focus-within:text-black transition-colors">Verification Code</label>
                                <input
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="block w-full border-b-2 border-gray-200 bg-transparent py-2 text-3xl font-black tracking-[1em] text-center focus:border-black focus:outline-none transition-colors rounded-none placeholder-gray-200"
                                    placeholder="000000"
                                    maxLength={6}
                                    disabled={loading}
                                    autoComplete="one-time-code"
                                />
                                <div className="mt-2 text-right">
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            setLoading(true);
                                            setMessage("");
                                            setError("");
                                            try {
                                                const res = await fetch("/api/auth/forgot-password", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ email }),
                                                });
                                                const data = await res.json();
                                                if (data.success) {
                                                    toast.success("Code resent successfully");
                                                    if (data.remaining !== undefined) setRemaining(data.remaining);
                                                    setTimer(60);
                                                } else {
                                                    setError(data.message || "Failed to resend");
                                                }
                                            } catch (err) {
                                                setError("Failed to resend");
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        disabled={loading || remaining === 0 || timer > 0}
                                        className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {remaining === 0 ? "No attempts left" : timer > 0 ? `Resend (${timer}s)` : `Resend Code (${remaining !== null ? remaining : 3} left)`}
                                    </button>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-400 group-focus-within:text-black transition-colors">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="block w-full border-b-2 border-gray-200 bg-transparent py-2 text-xl font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder-gray-200"
                                    placeholder="New Secure Password"
                                    disabled={loading}
                                    autoComplete="new-password"
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-red-100 border border-red-500 text-red-600 font-bold text-sm uppercase tracking-wider text-center">
                                    {error}
                                </div>
                            )}

                            {message && !error && (
                                <div className="p-4 bg-green-100 border border-green-500 text-green-800 font-bold text-sm uppercase tracking-wider text-center">
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white h-16 text-xl font-black uppercase tracking-widest hover:bg-white hover:text-black border-4 border-transparent hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <Link href="/login" className="text-black font-bold text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-all px-2 py-1">
                        &larr; Return to Login
                    </Link>
                </div>
            </div>

            {/* Decorative big text */}
            <div className="absolute -bottom-20 -right-20 text-[15rem] font-black text-gray-100 opacity-50 pointer-events-none select-none z-0">
                Key
            </div>
        </div>
    );
}
