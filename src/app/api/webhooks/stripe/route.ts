import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/server';
import { SUBSCRIPTION_TIERS } from '@/lib/subscription-tiers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Map Stripe price IDs to tier names
function getTierFromPriceId(priceId: string): 'pro' | 'premium' | null {
    if ([SUBSCRIPTION_TIERS.pro.stripePriceIdMonthly, SUBSCRIPTION_TIERS.pro.stripePriceIdYearly].includes(priceId)) return 'pro';
    if ([SUBSCRIPTION_TIERS.premium.stripePriceIdMonthly, SUBSCRIPTION_TIERS.premium.stripePriceIdYearly].includes(priceId)) return 'premium';
    return null;
}

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error('[Stripe] Webhook signature verification failed:', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = createAdminClient();

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const customerId = session.customer as string;
                const subscriptionId = session.subscription as string;
                const userId = session.metadata?.userId;

                if (!userId) {
                    console.error('[Stripe] No userId in session metadata');
                    break;
                }

                // Get subscription details to determine tier
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const priceId = subscription.items.data[0]?.price.id;
                const tier = getTierFromPriceId(priceId);

                if (!tier) {
                    console.error('[Stripe] Unknown price ID:', priceId);
                    break;
                }

                const tierConfig = SUBSCRIPTION_TIERS[tier];

                // Update user subscription
                await supabase
                    .from('subscriptions')
                    .update({
                        stripe_customer_id: customerId,
                        stripe_subscription_id: subscriptionId,
                        tier,
                        monthly_credits: tierConfig.monthlyCredits,
                        credits_used: 0,
                        status: 'active',
                        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                    })
                    .eq('user_id', userId);

                console.log(`[Stripe] User ${userId} upgraded to ${tier}`);
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                const priceId = subscription.items.data[0]?.price.id;
                const tier = getTierFromPriceId(priceId);

                if (!tier) {
                    console.error('[Stripe] Unknown price ID on update:', priceId);
                    break;
                }

                const tierConfig = SUBSCRIPTION_TIERS[tier];

                await supabase
                    .from('subscriptions')
                    .update({
                        tier,
                        monthly_credits: tierConfig.monthlyCredits,
                        status: subscription.status === 'active' ? 'active' : 'past_due',
                        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                    })
                    .eq('stripe_customer_id', customerId);

                console.log(`[Stripe] Subscription updated for customer ${customerId}`);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                // Downgrade to freemium
                await supabase
                    .from('subscriptions')
                    .update({
                        tier: 'freemium',
                        monthly_credits: 1,
                        credits_used: 0,
                        status: 'canceled',
                        stripe_subscription_id: null,
                        current_period_start: null,
                        current_period_end: null,
                    })
                    .eq('stripe_customer_id', customerId);

                console.log(`[Stripe] Subscription canceled for customer ${customerId}`);
                break;
            }

            case 'invoice.paid': {
                const invoice = event.data.object as Stripe.Invoice;
                const customerId = invoice.customer as string;
                const subscriptionId = invoice.subscription as string;

                // Reset credits for new billing period
                if (subscriptionId) {
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                    await supabase
                        .from('subscriptions')
                        .update({
                            credits_used: 0,
                            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                        })
                        .eq('stripe_customer_id', customerId);

                    console.log(`[Stripe] Credits reset for customer ${customerId}`);
                }
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                const customerId = invoice.customer as string;

                await supabase
                    .from('subscriptions')
                    .update({ status: 'past_due' })
                    .eq('stripe_customer_id', customerId);

                console.log(`[Stripe] Payment failed for customer ${customerId}`);
                break;
            }
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('[Stripe] Webhook handler error:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}
