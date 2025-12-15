'use client';

import { SUBSCRIPTION_TIERS } from '@/lib/subscription-tiers';
import Link from 'next/link';
import { useState } from 'react';

import Image from 'next/image';
import ChristmasDecorations from '@/components/ui/ChristmasDecorations'; // Assuming cn utility exists, usually does in shadcn/next setups. If not I will use template literals.

export default function PricingPage() {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const handleCheckout = async (priceId: string, tierName: string) => {
        setIsLoading(tierName);

        try {
            const response = await fetch('/api/subscription/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId }),
            });

            const data = await response.json();

            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }
        } catch (error) {
            console.error('Checkout error:', error);
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-background py-16 px-6 relative">
            <ChristmasDecorations />
            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <Link href="/" className="inline-flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xl font-display">O</span>
                        </div>
                        <span className="font-display text-2xl font-semibold text-gold-500">OAK BIJOUX</span>
                    </Link>
                    <h1 className="text-4xl lg:text-5xl font-display font-semibold mb-4">
                        Choisissez votre plan
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Des visuels publicitaires ultra-réalistes pour sublimer vos créations joaillières
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                            Mensuel
                        </span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="relative w-20 h-10 rounded-full border-2 border-gold-500 bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none hover:shadow-[0_0_15px_rgba(212,165,116,0.3)]"
                        >
                            {/* Red Bubble Cursor */}
                            <div
                                className={`absolute top-1/2 -translate-y-1/2 left-1.5 w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-lg transform transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${billingCycle === 'yearly' ? 'translate-x-10' : 'translate-x-0'
                                    }`}
                            >
                                {/* Sparkle effect on the bubble */}
                                <div className="absolute top-1 right-1.5 w-2 h-2 bg-white/40 rounded-full blur-[1px]" />
                            </div>
                        </button>
                        <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                            Annuel <span className="text-gold-500 text-xs ml-1">(Noël offert)</span>
                        </span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {/* Freemium */}
                    <div className="card-luxe p-8 flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-muted-foreground mb-1">
                                {SUBSCRIPTION_TIERS.freemium.name}
                            </h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-display font-semibold">Gratuit</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">Pour tester la qualité</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {SUBSCRIPTION_TIERS.freemium.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/register"
                            className="block w-full text-center btn-secondary mt-auto"
                        >
                            Commencer gratuitement
                        </Link>
                    </div>

                    {/* Pro - Highlighted */}
                    <div className="card-luxe p-8 border-gold-500 relative flex flex-col">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-white text-sm font-medium">
                            Populaire
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-muted-foreground mb-1">
                                {SUBSCRIPTION_TIERS.pro.name}
                            </h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-display font-semibold">
                                    {billingCycle === 'monthly' ? SUBSCRIPTION_TIERS.pro.priceMonthly : SUBSCRIPTION_TIERS.pro.priceYearly}€
                                </span>
                                <span className="text-muted-foreground">/mois</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                {billingCycle === 'yearly' ? (
                                    <span>
                                        Facturé <span className="text-red-500 font-bold">110€</span> par an <span className="text-red-500 font-bold">(1 mois offert)</span>
                                    </span>
                                ) : (
                                    'Facturation mensuelle sans engagement'
                                )}
                            </p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {SUBSCRIPTION_TIERS.pro.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleCheckout(
                                billingCycle === 'monthly'
                                    ? SUBSCRIPTION_TIERS.pro.stripePriceIdMonthly
                                    : SUBSCRIPTION_TIERS.pro.stripePriceIdYearly,
                                'pro'
                            )}
                            disabled={isLoading !== null}
                            className="w-full btn-primary disabled:opacity-50 mt-auto"
                        >
                            {isLoading === 'pro' ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Redirection...
                                </span>
                            ) : (
                                'Choisir Créateur'
                            )}
                        </button>
                    </div>

                    {/* Premium */}
                    <div className="card-luxe p-8 bg-gradient-to-b from-card to-gold-500/5 flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gold-500 mb-1">
                                {SUBSCRIPTION_TIERS.premium.name}
                            </h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-display font-semibold">
                                    {billingCycle === 'monthly' ? SUBSCRIPTION_TIERS.premium.priceMonthly : SUBSCRIPTION_TIERS.premium.priceYearly}€
                                </span>
                                <span className="text-muted-foreground">/mois</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                {billingCycle === 'yearly' ? (
                                    <span>
                                        Facturé <span className="text-red-500 font-bold">604.89€</span> par an <span className="text-red-500 font-bold">(1 mois offert)</span>
                                    </span>
                                ) : (
                                    'Facturation mensuelle sans engagement'
                                )}
                            </p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {SUBSCRIPTION_TIERS.premium.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleCheckout(
                                billingCycle === 'monthly'
                                    ? SUBSCRIPTION_TIERS.premium.stripePriceIdMonthly
                                    : SUBSCRIPTION_TIERS.premium.stripePriceIdYearly,
                                'premium'
                            )}
                            disabled={isLoading !== null}
                            className="w-full btn-secondary border-gold-500 hover:bg-gold-500/10 disabled:opacity-50 mt-auto"
                        >
                            {isLoading === 'premium' ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                                    Redirection...
                                </span>
                            ) : (
                                'Choisir Agence'
                            )}
                        </button>
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-display font-semibold text-center mb-8">
                        Questions fréquentes
                    </h2>
                    <div className="space-y-6">
                        <div className="card-luxe p-6">
                            <h3 className="font-medium mb-2">Comment fonctionne le crédit unique du plan Découverte ?</h3>
                            <p className="text-muted-foreground text-sm">
                                À l&apos;inscription, vous recevez 1 crédit de génération. Ce crédit est unique et n&apos;est pas
                                renouvelé mensuellement. L&apos;image générée contiendra un watermark et sera en basse
                                résolution.        </p>
                        </div>
                        <div className="card-luxe p-6">
                            <h3 className="font-medium mb-2">Puis-je annuler mon abonnement à tout moment ?</h3>
                            <p className="text-muted-foreground text-sm">
                                Oui, vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord.
                                Vous conserverez l&apos;accès jusqu&apos;à la fin de votre période de facturation en cours.
                            </p>
                        </div>
                        <div className="card-luxe p-6">
                            <h3 className="font-medium mb-2">Qu&apos;est-ce que la fonctionnalité &quot;Parures&quot; du plan Agence ?</h3>
                            <p className="text-muted-foreground text-sm">
                                Le plan Agence permet d&apos;uploader plusieurs bijoux (collier + boucles d&apos;oreilles, par exemple)
                                pour créer un visuel harmonieux avec une parure complète sur le mannequin.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="border-t border-border/50 pt-12 mt-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="font-medium">OAK BIJOUX</span>
                                <span>By</span>
                                <a href="https://oakflowai.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                                    <Image
                                        src="/images/oakflow-logo.png"
                                        alt="Oakflow AI"
                                        width={240}
                                        height={80}
                                        className="h-20 w-auto object-contain"
                                    />
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                            <Link href="/legal/mentions-legales" className="hover:text-gold-500 transition-colors">
                                Mentions Légales
                            </Link>
                            <Link href="/legal/cgu" className="hover:text-gold-500 transition-colors">
                                CGU / CGV
                            </Link>
                            <Link href="/legal/confidentialite" className="hover:text-gold-500 transition-colors">
                                Politique de Confidentialité
                            </Link>
                        </div>
                    </div>
                    <div className="text-center text-xs text-muted-foreground">
                        <p>© 2024 OAK BIJOUX - Une marque de OAKFLOW AI. Tous droits réservés.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
