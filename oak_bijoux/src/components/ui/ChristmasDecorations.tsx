'use client';

import { useEffect, useState } from 'react';

export default function ChristmasDecorations() {
    const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number; color: string }>>([]);

    useEffect(() => {
        const count = 50;
        const newSnowflakes = Array.from({ length: count }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 10 + Math.random() * 10,
            size: 0.5 + Math.random() * 1.5,
            color: Math.random() > 0.8 ? 'text-red-500/30' : 'text-gold-500/40' // 20% Red
        }));
        setSnowflakes(newSnowflakes);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className={`absolute ${flake.color} top-[-20px] animate-fall`}
                    style={{
                        left: `${flake.left}%`,
                        animationDelay: `${flake.delay}s`,
                        animationDuration: `${flake.duration}s`,
                        fontSize: `${flake.size}rem`,
                    }}
                >
                    ❄
                </div>
            ))}
            {/* Golden Shine Effect */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-gold-500/5 to-transparent z-0" />
            {/* Top Festive Garland Border */}
            <div className="fixed top-0 inset-x-0 h-2 z-50 bg-gradient-to-r from-red-600 via-gold-500 to-red-600 shadow-lg" />
            <div className="fixed top-0 inset-x-0 h-12 z-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
        </div>
    );
}
