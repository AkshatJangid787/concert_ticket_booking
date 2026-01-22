"use client";

import { useState, useEffect } from "react";

export default function TicketCountdown({ showDate }: { showDate: string }) {
    const calculateTimeLeft = () => {
        const difference = +new Date(showDate) - +new Date();
        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return null;
    };

    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [showDate]);

    if (!timeLeft) {
        return <div className="text-xl font-bold uppercase text-red-500 animate-pulse">Event has Started / Ended</div>;
    }

    return (
        <div className="grid grid-cols-4 gap-2 md:gap-4 text-center mt-6">
            <div className="bg-black text-white p-2">
                <span className="block text-2xl md:text-4xl font-black font-display">{timeLeft.days}</span>
                <span className="text-xs font-mono uppercase">Days</span>
            </div>
            <div className="bg-black text-white p-2">
                <span className="block text-2xl md:text-4xl font-black font-display">{timeLeft.hours}</span>
                <span className="text-xs font-mono uppercase">Hrs</span>
            </div>
            <div className="bg-black text-white p-2">
                <span className="block text-2xl md:text-4xl font-black font-display">{timeLeft.minutes}</span>
                <span className="text-xs font-mono uppercase">Mins</span>
            </div>
            <div className="bg-red-600 text-white p-2 animate-pulse">
                <span className="block text-2xl md:text-4xl font-black font-display">{timeLeft.seconds}</span>
                <span className="text-xs font-mono uppercase">Secs</span>
            </div>
        </div>
    );
}
