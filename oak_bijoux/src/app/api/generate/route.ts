import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { triggerN8nGeneration } from '@/lib/n8n';
import { getTierConfig, canGenerate } from '@/lib/subscription-tiers';
import type { JewelryType, SubscriptionTier, Subscription, JewelryUpload, Generation } from '@/types/database.types';

interface GenerateRequestBody {
    jewelryId: string;
    promptModel: string;
    promptDecor: string;
    jewelryType: JewelryType;
}

export async function POST(request: NextRequest) {
    try {
        const supabase: any = await createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            );
        }

        // Parse request body
        const body: GenerateRequestBody = await request.json();
        const { jewelryId, promptModel, promptDecor, jewelryType } = body;

        if (!jewelryId || !promptModel || !promptDecor || !jewelryType) {
            return NextResponse.json(
                { error: 'Paramètres manquants' },
                { status: 400 }
            );
        }

        // Get user subscription
        const { data: subscriptionData, error: subError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .single();

        const subscription = subscriptionData as Subscription | null;

        if (subError || !subscription) {
            return NextResponse.json(
                { error: 'Abonnement non trouvé' },
                { status: 404 }
            );
        }

        // Check if user has credits
        if (!canGenerate(subscription.credits_used, subscription.monthly_credits)) {
            return NextResponse.json(
                { error: 'Crédits épuisés. Passez à un plan supérieur.' },
                { status: 403 }
            );
        }

        // Get jewelry details
        const { data: jewelryData, error: jewelryError } = await supabase
            .from('jewelry_uploads')
            .select('*')
            .eq('id', jewelryId)
            .eq('user_id', user.id)
            .single();

        const jewelry = jewelryData as JewelryUpload | null;

        if (jewelryError || !jewelry) {
            return NextResponse.json(
                { error: 'Bijou non trouvé' },
                { status: 404 }
            );
        }

        // Get tier config for watermark and resolution
        const tierConfig = getTierConfig(subscription.tier as SubscriptionTier);

        // Create generation record
        const { data: generationData, error: genError } = await supabase
            .from('generations')
            .insert({
                user_id: user.id,
                jewelry_id: jewelryId,
                prompt_model: promptModel,
                prompt_decor: promptDecor,
                status: 'pending',
                has_watermark: tierConfig.hasWatermark,
                resolution: tierConfig.resolution,
                metadata: { jewelryType },
            } as any)
            .select()
            .single();

        const generation = generationData as Generation | null;

        if (genError || !generation) {
            console.error('[Generate] Insert error:', genError);
            return NextResponse.json(
                { error: 'Erreur lors de la création de la génération' },
                { status: 500 }
            );
        }

        // Increment credits used
        const { error: updateError } = await supabase
            .from('subscriptions')
            .update({ credits_used: subscription.credits_used + 1 } as any)
            .eq('id', subscription.id);

        if (updateError) {
            console.error('[Generate] Credits update error:', updateError);
        }

        // Trigger n8n webhook
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const n8nResult = await triggerN8nGeneration({
            generationId: generation.id,
            jewelryUrl: jewelry.public_url,
            jewelryType,
            promptModel,
            promptDecor,
            callbackUrl: `${appUrl}/api/webhooks/n8n-callback`,
            hasWatermark: tierConfig.hasWatermark,
            resolution: tierConfig.resolution,
        });

        if (!n8nResult.success) {
            // Update generation status to failed
            await supabase
                .from('generations')
                .update({
                    status: 'failed',
                    error_message: n8nResult.error
                } as any)
                .eq('id', generation.id);

            // Refund the credit
            await supabase
                .from('subscriptions')
                .update({ credits_used: subscription.credits_used } as any)
                .eq('id', subscription.id);

            return NextResponse.json(
                { error: 'Erreur lors du déclenchement de la génération' },
                { status: 500 }
            );
        }

        // Update status to processing
        await supabase
            .from('generations')
            .update({ status: 'processing' } as any)
            .eq('id', generation.id);

        return NextResponse.json({
            generationId: generation.id,
            status: 'processing',
            estimatedTime: 45, // seconds
        });

    } catch (error) {
        console.error('[Generate] Unexpected error:', error);
        return NextResponse.json(
            { error: 'Erreur serveur inattendue' },
            { status: 500 }
        );
    }
}
