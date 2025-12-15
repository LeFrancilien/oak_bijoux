// Subscription tier configuration for OAK BIJOUX

export const SUBSCRIPTION_TIERS = {
    freemium: {
        name: 'Découverte',
        monthlyCredits: 1,
        hasWatermark: true,
        resolution: 'low' as const,
        priceMonthly: 0,
        priceYearly: 0,
        features: [
            '1 génération unique',
            'Watermark sur l\'image',
            'Basse résolution',
        ],
    },
    pro: {
        name: 'Créateur',
        monthlyCredits: 45,
        hasWatermark: false,
        resolution: 'high' as const,
        priceMonthly: 14.99,
        priceYearly: 9.99,
        stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
        stripePriceIdYearly: process.env.STRIPE_PRICE_PRO_YEARLY!,
        features: [
            '45 générations/mois',
            'Haute résolution',
            'Sans watermark',
            'Support prioritaire',
        ],
    },
    premium: {
        name: 'Agence',
        monthlyCredits: 9999, // Considered "unlimited"
        hasWatermark: false,
        resolution: 'high' as const,
        priceMonthly: 79.99,
        priceYearly: 54.99,
        stripePriceIdMonthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY!,
        stripePriceIdYearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY!,
        features: [
            'Générations illimitées',
            'Haute résolution',
            'Sans watermark',
            'Accès prioritaire',
            'Parures multi-bijoux',
            'Support dédié',
        ],
    },
} as const;

export type TierKey = keyof typeof SUBSCRIPTION_TIERS;

export function getTierConfig(tier: TierKey) {
    return SUBSCRIPTION_TIERS[tier];
}

export function canGenerate(credits_used: number, monthly_credits: number): boolean {
    return credits_used < monthly_credits;
}

export function getRemainingCredits(credits_used: number, monthly_credits: number): number {
    return Math.max(0, monthly_credits - credits_used);
}
