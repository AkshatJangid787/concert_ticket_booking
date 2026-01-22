"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Auth Step: 'register' | 'verify'
    const [step, setStep] = useState("register");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
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

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (data.success) {
                if (data.requireVerification) {
                    setStep("verify");
                    setTimer(60); // Start timer
                } else {
                    router.push("/login"); // Fallback if no verification
                }
            } else {
                setError(data.error || data.message || "Registration failed");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (data.success) {
                // Force full reload to update Navbar state
                window.location.href = "/dashboard";
            } else {
                setError(data.error || data.message || "Verification failed");
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
                    <h1 className="text-6xl md:text-8xl font-black font-display uppercase tracking-tighter leading-none mb-4">
                        {step === 'verify' ? 'Verify' : 'Join Us'}
                    </h1>
                    <p className="font-mono text-sm uppercase tracking-widest text-gray-500">
                        {step === 'verify' ? 'Check your email' : 'Create your Identity'}
                    </p>
                </div>

                <div className="border-y-4 border-black py-12">
                    {step === 'register' ? (
                        <form className="space-y-8" onSubmit={handleRegister}>
                            <div className="group">
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-400 group-focus-within:text-black transition-colors">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full border-b-2 border-gray-200 bg-transparent py-2 text-xl font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder-gray-200"
                                    placeholder="Your Name"
                                    disabled={loading}
                                />
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-400 group-focus-within:text-black transition-colors">Email</label>
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

                            <div className="group">
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-400 group-focus-within:text-black transition-colors">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full border-b-2 border-gray-200 bg-transparent py-2 text-xl font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder-gray-200"
                                    placeholder="••••••"
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
                                {loading ? "Sending Code..." : "Continue"}
                            </button>
                        </form>
                    ) : (
                        <form className="space-y-8" onSubmit={handleVerify}>
                            <div className="group">
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-400 group-focus-within:text-black transition-colors">Enter OTP</label>
                                <input
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="block w-full border-b-2 border-gray-200 bg-transparent py-2 text-3xl font-black tracking-[1em] text-center focus:border-black focus:outline-none transition-colors rounded-none placeholder-gray-200"
                                    placeholder="000000"
                                    maxLength={6}
                                    disabled={loading}
                                />
                                <div className="mt-2 flex justify-between items-center text-xs">
                                    <span className="text-gray-400">Code sent to {email}</span>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            setLoading(true);
                                            setError("");
                                            try {
                                                const res = await fetch("/api/auth/resend-otp", {
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
                                        className="font-bold uppercase tracking-widest text-gray-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {remaining === 0 ? "No attempts left" : timer > 0 ? `Resend (${timer}s)` : `Resend Code (${remaining !== null ? remaining : 3} left)`}
                                    </button>
                                </div>
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
                                {loading ? "Verifying..." : "Verify Identity"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep('register')}
                                disabled={loading}
                                className="w-full text-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black mt-4 disabled:opacity-50"
                            >
                                Incorrect Email? Back
                            </button>
                        </form>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm font-mono uppercase tracking-wider text-gray-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-black font-bold border-b-2 border-black hover:bg-black hover:text-white transition-all px-1">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>

            {/* Decorative big text */}
            <div className="absolute -bottom-20 -right-20 text-[15rem] font-black text-gray-100 opacity-50 pointer-events-none select-none z-0">
                {step === 'verify' ? 'Code' : 'Join'}
            </div>
        </div>
    );
}
