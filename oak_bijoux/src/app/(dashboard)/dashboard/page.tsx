import { createClient } from '@/lib/supabase/server';
import { Generation, Subscription } from '@/types/database.types';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Get user stats
    const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('tier, credits_used, monthly_credits')
        .eq('user_id', user.id)
        .single();

    const subscription = subscriptionData as Subscription | null;

    const { data: generationsData, count: totalGenerations } = await supabase
        .from('generations')
        .select('*', { count: 'exact', head: false })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(4);

    const generations = generationsData as Generation[] | null;

    const remainingCredits = subscription
        ? Math.max(0, subscription.monthly_credits - subscription.credits_used)
        : 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-display font-semibold mb-2">
                        Tableau de Bord
                    </h1>
                    <p className="text-muted-foreground">
                        Bienvenue dans votre studio de création AI
                    </p>
                </div>
                <Link
                    href="/dashboard/create"
                    className="btn-primary inline-flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouvelle Création
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-luxe p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Crédits Restants</p>
                            <p className="text-2xl font-display font-semibold text-gold-500">
                                {remainingCredits}
                                <span className="text-sm text-muted-foreground font-normal ml-1">
                                    / {subscription?.monthly_credits === 9999 ? '∞' : subscription?.monthly_credits || 1}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card-luxe p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Campagnes Générées</p>
                            <p className="text-2xl font-display font-semibold">{totalGenerations || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="card-luxe p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Plan Actuel</p>
                            <p className="text-2xl font-display font-semibold capitalize">
                                {subscription?.tier === 'freemium' ? 'Découverte' :
                                    subscription?.tier === 'pro' ? 'Créateur' :
                                        subscription?.tier === 'premium' ? 'Agence' : 'Découverte'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Start */}
            {(!generations || generations.length === 0) && (
                <div className="card-luxe p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-display font-semibold mb-2">
                        Créez votre première campagne
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Uploadez la photo de votre bijou, décrivez le mannequin et le décor souhaités,
                        et laissez l'IA générer votre visuel publicitaire.
                    </p>
                    <Link
                        href="/dashboard/create"
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        Commencer →
                    </Link>
                </div>
            )}

            {/* Recent Generations */}
            {generations && generations.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-display font-semibold">Créations Récentes</h2>
                        <Link
                            href="/dashboard/gallery"
                            className="text-sm text-gold-500 hover:text-gold-400"
                        >
                            Voir tout →
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {generations.map((gen) => (
                            <div key={gen.id} className="card-luxe overflow-hidden group">
                                {gen.result_image_url ? (
                                    <div className="aspect-square relative">
                                        <img
                                            src={gen.result_image_url}
                                            alt="Génération"
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {gen.has_watermark && (
                                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center">
                                                <svg className="w-3 h-3 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="aspect-square bg-secondary flex items-center justify-center">
                                        {gen.status === 'processing' ? (
                                            <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                                        ) : gen.status === 'failed' ? (
                                            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        ) : (
                                            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                                            </svg>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
