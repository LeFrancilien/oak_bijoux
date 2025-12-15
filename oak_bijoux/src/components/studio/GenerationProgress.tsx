'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Generation } from '@/types/database.types';


interface GenerationProgressProps {
    generationId: string;
    onComplete: (result: { id: string; imageUrl: string; hasWatermark: boolean }) => void;
    onError: (error: string) => void;
}

const tips = [
    'L\'IA analyse la structure de votre bijou...',
    'Génération du mannequin en cours...',
    'Création du décor personnalisé...',
    'Positionnement du bijou sur le mannequin...',
    'Application des effets d\'éclairage...',
    'Finalisation des détails...',
];

export default function GenerationProgress({
    generationId,
    onComplete,
    onError,
}: GenerationProgressProps) {
    const [progress, setProgress] = useState(0);
    const [tipIndex, setTipIndex] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);

    // Poll for generation status
    const checkStatus = useCallback(async () => {
        const supabase = createClient();

        const { data: rawData, error } = await supabase
            .from('generations')
            .select('status, result_image_url, error_message, has_watermark')
            .eq('id', generationId)
            .single();

        const data = rawData as Generation | null;

        if (error) {
            console.error('Status check error:', error);
            return;
        }

        if (!data) return;

        if (data.status === 'completed' && data.result_image_url) {
            onComplete({
                id: generationId,
                imageUrl: data.result_image_url,
                hasWatermark: data.has_watermark,
            });
        } else if (data.status === 'failed') {
            onError(data.error_message || 'La génération a échoué');
        }
    }, [generationId, onComplete, onError]);

    // Progress animation
    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                // Slow down as we approach 90%
                if (prev >= 90) return prev;
                if (prev >= 80) return prev + 0.5;
                if (prev >= 60) return prev + 1;
                return prev + 2;
            });
        }, 1000);

        return () => clearInterval(progressInterval);
    }, []);

    // Tip rotation
    useEffect(() => {
        const tipInterval = setInterval(() => {
            setTipIndex((prev) => (prev + 1) % tips.length);
        }, 8000);

        return () => clearInterval(tipInterval);
    }, []);

    // Elapsed time counter
    useEffect(() => {
        const timeInterval = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timeInterval);
    }, []);

    // Status polling
    useEffect(() => {
        const pollInterval = setInterval(checkStatus, 3000);
        checkStatus(); // Initial check

        return () => clearInterval(pollInterval);
    }, [checkStatus]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="py-12 text-center">
            {/* Animated Ring */}
            <div className="relative w-40 h-40 mx-auto mb-8">
                {/* Background ring */}
                <svg className="w-full h-full -rotate-90">
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-secondary"
                    />
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="url(#goldGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * progress) / 100}
                        className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#d4a574" />
                            <stop offset="100%" stopColor="#b8860b" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-display font-semibold text-gold-500">
                        {Math.round(progress)}%
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                        {formatTime(elapsedTime)}
                    </span>
                </div>
            </div>

            {/* Status Text */}
            <h2 className="text-xl font-display font-semibold mb-2">
                Génération en cours...
            </h2>
            <p className="text-muted-foreground mb-8 animate-pulse">
                {tips[tipIndex]}
            </p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full progress-gold rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Info */}
            <p className="mt-8 text-sm text-muted-foreground">
                ⏱️ Temps estimé : 30-60 secondes
            </p>
            <p className="text-xs text-muted-foreground mt-2">
                Ne fermez pas cette page pendant la génération
            </p>
        </div>
    );
}
