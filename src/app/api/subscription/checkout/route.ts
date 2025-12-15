import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { SUBSCRIPTION_TIERS } from '@/lib/subscription-tiers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia',
});

interface CheckoutRequestBody {
    priceId: string;
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            );
        }

        const body: CheckoutRequestBody = await request.json();
        const { priceId } = body;

        // Validate price ID
        const validPriceIds = [
            SUBSCRIPTION_TIERS.pro.stripePriceIdMonthly,
            SUBSCRIPTION_TIERS.pro.stripePriceIdYearly,
            SUBSCRIPTION_TIERS.premium.stripePriceIdMonthly,
            SUBSCRIPTION_TIERS.premium.stripePriceIdYearly,
        ];

        if (!priceId || !validPriceIds.includes(priceId)) {
            return NextResponse.json(
                { error: 'Prix invalide' },
                { status: 400 }
            );
        }

        // Get user subscription to check for existing Stripe customer
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .single();

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // Create checkout session
        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${appUrl}/dashboard?checkout=success`,
            cancel_url: `${appUrl}/pricing?checkout=canceled`,
            metadata: {
                userId: user.id,
            },
        };

        // Use existing customer if available
        if (subscription?.stripe_customer_id) {
            sessionParams.customer = subscription.stripe_customer_id;
        } else {
            sessionParams.customer_email = user.email;
        }

        const session = await stripe.checkout.sessions.create(sessionParams);

        return NextResponse.json({
            checkoutUrl: session.url,
        });

    } catch (error) {
        console.error('[Checkout] Error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création de la session de paiement' },
            { status: 500 }
        );
    }
}
