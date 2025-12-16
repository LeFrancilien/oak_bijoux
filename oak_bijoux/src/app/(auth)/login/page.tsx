'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const supabase = createClient();

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError('Email ou mot de passe incorrect');
            setLoading(false);
            return;
        }

        router.push('/dashboard');
        router.refresh();
    };

    const handleGoogleLogin = async () => {
        const supabase = createClient();

        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?redirectTo=/dashboard`,
            },
        });
    };

    return (
        <div>
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xl font-display">O</span>
                    </div>
                </div>
                <h1 className="font-display text-2xl font-semibold text-gold-500">OAK BIJOUX</h1>
            </div>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-semibold mb-2">Bon retour !</h2>
                <p className="text-muted-foreground">Connectez-vous pour accéder à votre espace</p>
            </div>

            {/* Google Signup */}
            <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-border hover:bg-secondary transition-colors mb-6"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continuer avec Google</span>
            </button>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Ou</span>
                </div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                        placeholder="vous@example.com"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium">Mot de passe</label>
                        <Link href="/forgot-password" className="text-sm text-gold-500 hover:text-gold-400">
                            Mot de passe oublié ?
                        </Link>
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Connexion...
                        </span>
                    ) : (
                        'Se connecter'
                    )}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-gold-500 hover:text-gold-400 font-medium">
                    S&apos;inscrire
                </Link>
            </p>
        </div>
    );
}
