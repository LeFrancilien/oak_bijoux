import { createClient } from '@/lib/supabase/server';
import { Subscription } from '@/types/database.types';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata = {
    title: 'Abonnement | OAK BIJOUX',
    description: 'Gérez votre abonnement et vos crédits.',
};

const tierLabels = {
    freemium: { label: 'Découverte', color: 'bg-onyx-600', description: 'Idéal pour découvrir nos services' },
    pro: { label: 'Créateur', color: 'bg-gold-600', description: 'Pour les créateurs réguliers' },
    premium: { label: 'Agence', color: 'bg-gradient-to-r from-gold-500 to-gold-400', description: 'Pour les professionnels intensifs' },
};

export default async function SubscriptionPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

    const subscription = subscriptionData as Subscription | null;
    const currentTier = subscription?.tier || 'freemium';
    const tierInfo = tierLabels[currentTier];
    const monthlyCredits = subscription?.monthly_credits || 1;
    const creditsUsed = subscription?.credits_used || 0;
    const remainingCredits = Math.max(0, monthlyCredits - creditsUsed);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl lg:text-4xl font-display font-semibold mb-2">
                    Mon Abonnement
                </h1>
                <p className="text-muted-foreground">
                    Gérez votre forfait et suivez votre consommation de crédits
                </p>
            </div>

            {/* Current Plan Card */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="card-luxe p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-display font-semibold">Forfait Actuel</h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${tierInfo.color}`}>
                            {tierInfo.label}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <p className="text-4xl font-display font-bold text-gold-500">
                            {remainingCredits} <span className="text-lg text-muted-foreground font-body font-normal">crédits restants</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Sur {monthlyCredits === 9999 ? 'illimité' : monthlyCredits} crédits mensuels
                        </p>
                    </div>

                    <div className="pt-4 border-t border-border">
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span>Utilisation ({(creditsUsed / monthlyCredits * 100).toFixed(0)}%)</span>
                            <span>{creditsUsed} / {monthlyCredits === 9999 ? '∞' : monthlyCredits}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gold-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, (creditsUsed / Math.max(1, monthlyCredits)) * 100)}%` }}
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <Link href="/pricing" className="btn-primary w-full text-center block">
                            {currentTier === 'premium' ? 'Gérer mon abonnement' : 'Mettre à niveau'}
                        </Link>
                    </div>
                </div>

                {/* Benefits / Info Card */}
                <div className="card-luxe p-6 bg-secondary/30">
                    <h3 className="text-lg font-semibold mb-4">Détails du forfait</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Accès à toutes les fonctionnalités {tierInfo.label}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Support prioritaire</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Génération haute définition</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
