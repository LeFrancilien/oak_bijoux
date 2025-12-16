'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface SidebarProps {
    userName?: string;
    userEmail?: string;
    tier?: 'freemium' | 'pro' | 'premium';
    creditsUsed?: number;
    monthlyCredits?: number;
}

const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        name: 'Créer',
        href: '/dashboard/create',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
        ),
    },
    {
        name: 'Galerie',
        href: '/dashboard/gallery',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        name: 'Abonnement',
        href: '/dashboard/settings/subscription',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        ),
    },
];

const tierLabels = {
    freemium: { label: 'Découverte', color: 'bg-onyx-600' },
    pro: { label: 'Créateur', color: 'bg-gold-600' },
    premium: { label: 'Agence', color: 'bg-gradient-to-r from-gold-500 to-gold-400' },
};

export default function Sidebar({
    userName = 'Utilisateur',
    userEmail = 'email@example.com',
    tier = 'freemium',
    creditsUsed = 0,
    monthlyCredits = 1,
}: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.refresh();
        router.push('/');
    };

    const tierInfo = tierLabels[tier];
    const remainingCredits = Math.max(0, monthlyCredits - creditsUsed);
    const creditsPercentage = monthlyCredits > 0 ? (creditsUsed / monthlyCredits) * 100 : 100;

    return (
        <>
            {/* Mobile menu button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
            </button>

            {/* Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen w-72 bg-card border-r border-border transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-border">
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg font-display">O</span>
                            </div>
                            <div>
                                <h1 className="font-display text-xl font-semibold tracking-tight text-gold-500">OAK BIJOUX</h1>
                                <p className="text-xs text-muted-foreground">Studio IA</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive
                                            ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                        }`}
                                >
                                    {item.icon}
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Credits Card */}
                    <div className="p-4">
                        <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Crédits</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full text-white ${tierInfo.color}`}>
                                    {tierInfo.label}
                                </span>
                            </div>
                            <div className="text-2xl font-display font-semibold text-gold-500">
                                {remainingCredits}
                                <span className="text-sm text-muted-foreground font-normal ml-1">
                                    / {monthlyCredits === 9999 ? '∞' : monthlyCredits}
                                </span>
                            </div>
                            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gold-500 rounded-full transition-all duration-300"
                                    style={{ width: `${100 - creditsPercentage}%` }}
                                />
                            </div>
                            {tier === 'freemium' && (
                                <Link
                                    href="/pricing"
                                    className="block mt-3 text-center text-sm text-gold-500 hover:text-gold-400 font-medium"
                                >
                                    Passer à Pro →
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* User */}
                    <div className="p-4 border-t border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-semibold">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{userName}</p>
                                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
                                title="Se déconnecter"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
