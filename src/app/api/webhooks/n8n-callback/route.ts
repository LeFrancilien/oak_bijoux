import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { validateN8nCallback, type N8nCallbackPayload } from '@/lib/n8n';

export async function POST(request: NextRequest) {
    try {
        // Get secret from header
        const secret = request.headers.get('X-Oak-Secret') || '';

        // Parse body
        const body = await request.json();

        // Validate callback
        if (!validateN8nCallback(body, secret)) {
            return NextResponse.json(
                { error: 'Invalid callback' },
                { status: 401 }
            );
        }

        const payload = body as N8nCallbackPayload;
        const supabase = createAdminClient();

        // Get the generation
        const { data: generation, error: fetchError } = await supabase
            .from('generations')
            .select('*, subscriptions!generations_user_id_fkey(id, credits_used)')
            .eq('id', payload.generationId)
            .single();

        if (fetchError || !generation) {
            console.error('[n8n-callback] Generation not found:', payload.generationId);
            return NextResponse.json(
                { error: 'Generation not found' },
                { status: 404 }
            );
        }

        // Update generation status
        const updateData: Record<string, unknown> = {
            status: payload.status,
            processing_time_ms: payload.processingTimeMs,
        };

        if (payload.status === 'completed' && payload.resultImageUrl) {
            updateData.result_image_url = payload.resultImageUrl;
        }

        if (payload.status === 'failed') {
            updateData.error_message = payload.errorMessage || 'Unknown error';

            // Refund the credit on failure
            const subscription = generation.subscriptions;
            if (subscription && subscription.credits_used > 0) {
                await supabase
                    .from('subscriptions')
                    .update({ credits_used: subscription.credits_used - 1 })
                    .eq('id', subscription.id);
            }
        }

        const { error: updateError } = await supabase
            .from('generations')
            .update(updateData)
            .eq('id', payload.generationId);

        if (updateError) {
            console.error('[n8n-callback] Update error:', updateError);
            return NextResponse.json(
                { error: 'Failed to update generation' },
                { status: 500 }
            );
        }

        console.log(`[n8n-callback] Generation ${payload.generationId} updated to ${payload.status}`);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[n8n-callback] Unexpected error:', error);
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}
