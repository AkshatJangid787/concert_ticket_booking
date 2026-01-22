"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            window.location.href = "/";
        } else {
            setError(data.error || data.message || "Login failed");
        }
    }

    return (
        <div className="min-h-screen bg-white text-black flex flex-col justify-center items-center relative overflow-hidden px-4">
            {/* Background Texture */}
            <div className="bg-grain fixed inset-0 opacity-20 pointer-events-none z-10"></div>

            <div className="w-full max-w-lg relative z-20">
                <div className="text-center mb-12">
                    <h1 className="text-6xl md:text-8xl font-black font-display uppercase tracking-tighter leading-none mb-4">
                        Login
                    </h1>
                    <p className="font-mono text-sm uppercase tracking-widest text-gray-500">
                        Continue to Portal
                    </p>
                </div>

                <div className="border-y-4 border-black py-12">
                    <form className="space-y-8" onSubmit={handleLogin}>
                        <div className="group">
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-400 group-focus-within:text-black transition-colors">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full border-b-2 border-gray-200 bg-transparent py-2 text-xl font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder-gray-200"
                                placeholder="name@example.com"
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
                            />
                            <div className="text-right mt-2">
                                <Link href="/forgot-password" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-100 border border-red-500 text-red-600 font-bold text-sm uppercase tracking-wider text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-black text-white h-16 text-xl font-black uppercase tracking-widest hover:bg-white hover:text-black border-4 border-transparent hover:border-black transition-all duration-300"
                        >
                            Sign In
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm font-mono uppercase tracking-wider text-gray-500">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-black font-bold border-b-2 border-black hover:bg-black hover:text-white transition-all px-1">
                            Register Now
                        </Link>
                    </p>
                </div>
            </div>

            {/* Decorative big text */}
            <div className="absolute -bottom-20 -left-20 text-[15rem] font-black text-gray-100 opacity-50 pointer-events-none select-none z-0">
                Login
            </div>
        </div>
    );
}
