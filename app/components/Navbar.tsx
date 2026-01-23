
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
    // Hooks
    const pathname = usePathname(); // Get current URL path
    const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Effect: Check if user is logged in on component mount
    useEffect(() => {
        setIsLoading(true);
        fetch("/api/auth/me")
            .then((res) => res.json())
            .then((data) => {
                if (data.authenticated) {
                    setUser(data.user);
                }
            })
            .catch(() => {
                // If fetch fails, we just assume user is not logged in.
                // We typically ignore this error in the UI.
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        // We use window.location.href to force a hard refresh.
        // This ensures all client-side memory/cache is cleared after logout.
        window.location.href = "/login";
    };

    // Helper to check if a link is active
    const isActive = (path: string) => pathname === path;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Don't show Navbar on Login/Register pages
    if (pathname === "/login" || pathname === "/register") return null;

    return (
        <>
            {/* 
              Top Navigation Bar 
              - We use `mix-blend-difference` when the menu is CLOSED. 
                This makes the white text readable on both dark and light backgrounds.
              - When OPEN, we use `mix-blend-normal` so it looks standard.
            */}
            <nav className={`fixed w-full top-0 z-[100] text-white transition-all duration-300 ${isMenuOpen ? 'mix-blend-normal' : 'mix-blend-difference'}`}>
                <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-4 md:py-8 flex justify-between items-center relative z-[101]">
                    {/* Logo Section */}
                    <Link href="/" className="text-2xl md:text-3xl font-black tracking-tighter hover:opacity-70 transition-opacity font-display uppercase relative z-[102]" onClick={() => setIsMenuOpen(false)}>
                        Ashish Soni
                    </Link>

                    {/* Desktop Menu (Hidden on mobile) */}
                    <div className="hidden md:flex items-center space-x-12 relative z-[102]">
                        {isLoading ? (
                            // Loading State - Simple placeholder to prevent layout jumping
                            <div className="h-6 w-32 bg-white/20 animate-pulse rounded"></div>
                        ) : (
                            <>
                                {/* Public Links */}
                                {(!user || user.role === "USER") && (
                                    <>
                                        <Link
                                            href="/"
                                            className={`text-sm font-bold uppercase tracking-[0.2em] hover:scale-110 transform transition-transform ${isActive("/") ? "line-through text-red-500" : ""}`}
                                        >
                                            Home
                                        </Link>
                                        <Link
                                            href="/shows"
                                            className={`text-sm font-bold uppercase tracking-[0.2em] hover:scale-110 transform transition-transform ${isActive("/shows") ? "line-through text-red-500" : ""}`}
                                        >
                                            Shows
                                        </Link>
                                        <Link
                                            href="/contact"
                                            className={`text-sm font-bold uppercase tracking-[0.2em] hover:scale-110 transform transition-transform ${isActive("/contact") ? "line-through text-red-500" : ""}`}
                                        >
                                            Contact
                                        </Link>
                                    </>
                                )}

                                {/* User Specific Links */}
                                {user?.role === "USER" && (
                                    <Link
                                        href="/dashboard"
                                        className={`text-sm font-bold uppercase tracking-[0.2em] hover:scale-110 transform transition-transform ${isActive("/dashboard") ? "line-through text-red-500" : ""}`}
                                    >
                                        Tickets
                                    </Link>
                                )}

                                {/* Admin Specific Links */}
                                {user?.role === "ADMIN" && (
                                    <Link href="/admin" className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
                                        Command Center
                                    </Link>
                                )}

                                {/* Login / Logout Button */}
                                {user ? (
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm font-bold uppercase tracking-widest border border-white px-6 py-2 hover:bg-white hover:text-black transition-colors"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="text-sm font-bold uppercase tracking-widest border border-white px-6 py-2 hover:bg-white hover:text-black transition-colors"
                                    >
                                        Login
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle Button (Hamburger) */}
                    <button
                        className="md:hidden flex flex-col gap-2 relative z-[102] group"
                        onClick={toggleMenu}
                        aria-label="Toggle Menu"
                    >
                        {/* We animate these spans to form an 'X' when open */}
                        <span className={`w-8 h-[2px] bg-white transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2.5" : ""}`}></span>
                        <span className={`w-8 h-[2px] bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}></span>
                        <span className={`w-8 h-[2px] bg-white transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2.5" : ""}`}></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {/* This slides in from the right when toggled */}
            <div className={`fixed inset-0 bg-black/80 backdrop-blur-md text-white z-[90] flex flex-col justify-center items-center gap-8 transition-transform duration-500 ease-in-out md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>

                {/* Background Texture/Grain */}
                <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none"></div>

                {isLoading ? (
                    <div className="h-8 w-48 bg-white/20 animate-pulse rounded"></div>
                ) : (
                    <>
                        {/* Mobile Links */}
                        {(!user || user.role === "USER") && (
                            <>
                                <Link
                                    href="/"
                                    onClick={toggleMenu}
                                    className={`text-4xl font-black font-display uppercase tracking-widest hover:text-red-500 transition-colors ${isActive("/") ? "text-red-500 line-through" : ""}`}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/shows"
                                    onClick={toggleMenu}
                                    className={`text-4xl font-black font-display uppercase tracking-widest hover:text-red-500 transition-colors ${isActive("/shows") ? "text-red-500 line-through" : ""}`}
                                >
                                    Shows
                                </Link>
                                <Link
                                    href="/contact"
                                    onClick={toggleMenu}
                                    className={`text-4xl font-black font-display uppercase tracking-widest hover:text-red-500 transition-colors ${isActive("/contact") ? "text-red-500 line-through" : ""}`}
                                >
                                    Contact
                                </Link>
                            </>
                        )}

                        {user?.role === "USER" && (
                            <Link
                                href="/dashboard"
                                onClick={toggleMenu}
                                className={`text-4xl font-black font-display uppercase tracking-widest hover:text-red-500 transition-colors ${isActive("/dashboard") ? "text-red-500 line-through" : ""}`}
                            >
                                Tickets
                            </Link>
                        )}

                        {user?.role === "ADMIN" && (
                            <Link
                                href="/admin"
                                onClick={toggleMenu}
                                className="text-4xl font-black font-display uppercase tracking-widest text-red-500 hover:text-white transition-colors"
                            >
                                Admin
                            </Link>
                        )}

                        <div className="mt-8">
                            {user ? (
                                <button
                                    onClick={() => { handleLogout(); toggleMenu(); }}
                                    className="text-xl font-bold uppercase tracking-widest border-2 border-white px-8 py-4 hover:bg-white hover:text-black transition-colors"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={toggleMenu}
                                    className="text-xl font-bold uppercase tracking-widest border-2 border-white px-8 py-4 hover:bg-white hover:text-black transition-colors"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
