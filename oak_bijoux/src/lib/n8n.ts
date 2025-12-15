// n8n webhook integration

interface N8nWebhookPayload {
    generationId: string;
    jewelryUrl: string;
    jewelryType: string;
    promptModel: string;
    promptDecor: string;
    callbackUrl: string;
    hasWatermark: boolean;
    resolution: 'low' | 'high';
}

interface N8nCallbackPayload {
    generationId: string;
    status: 'completed' | 'failed';
    resultImageUrl?: string;
    errorMessage?: string;
    processingTimeMs?: number;
}

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;
const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET!;

export async function triggerN8nGeneration(payload: N8nWebhookPayload): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Oak-Secret': N8N_WEBHOOK_SECRET,
            },
            body: JSON.stringify({
                ...payload,
                startTime: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[n8n] Webhook call failed:', errorText);
            return { success: false, error: `n8n webhook failed: ${response.status}` };
        }

        return { success: true };
    } catch (error) {
        console.error('[n8n] Webhook call error:', error);
        return { success: false, error: 'Failed to connect to n8n webhook' };
    }
}

export function validateN8nCallback(
    payload: unknown,
    secret: string
): payload is N8nCallbackPayload {
    // Validate secret
    if (secret !== N8N_WEBHOOK_SECRET) {
        return false;
    }

    // Validate payload structure
    if (!payload || typeof payload !== 'object') {
        return false;
    }

    const p = payload as Record<string, unknown>;
    return (
        typeof p.generationId === 'string' &&
        (p.status === 'completed' || p.status === 'failed')
    );
}

export type { N8nWebhookPayload, N8nCallbackPayload };
