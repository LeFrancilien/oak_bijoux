'use client';

import { useState } from 'react';
import JewelryUploader from '@/components/studio/JewelryUploader';
import PromptBuilder from '@/components/studio/PromptBuilder';
import GenerationProgress from '@/components/studio/GenerationProgress';
import ResultDisplay from '@/components/studio/ResultDisplay';

type Step = 'upload' | 'configure' | 'generating' | 'result';

interface UploadedJewelry {
    id: string;
    publicUrl: string;
    jewelryType: string;
}

interface GenerationResult {
    id: string;
    imageUrl: string;
    hasWatermark: boolean;
}

export default function CreatePage() {
    const [step, setStep] = useState<Step>('upload');
    const [jewelryType, setJewelryType] = useState<'ring' | 'necklace' | 'earring' | 'bracelet' | 'set'>('necklace');
    const [uploadedJewelry, setUploadedJewelry] = useState<UploadedJewelry | null>(null);
    const [prompts, setPrompts] = useState({ model: '', decor: '' });
    const [generationId, setGenerationId] = useState<string | null>(null);
    const [result, setResult] = useState<GenerationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleUploadComplete = (data: UploadedJewelry) => {
        setUploadedJewelry(data);
    };

    const handlePromptsChange = (newPrompts: { model: string; decor: string }) => {
        setPrompts(newPrompts);
    };

    const handleGenerate = async () => {
        if (!uploadedJewelry) return;

        setError(null);
        setStep('generating');

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jewelryId: uploadedJewelry.id,
                    promptModel: prompts.model,
                    promptDecor: prompts.decor,
                    jewelryType,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la génération');
            }

            setGenerationId(data.generationId);
        } catch (err) {
            console.error('Generation error:', err);
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
            setStep('configure');
        }
    };

    const handleGenerationComplete = (resultData: GenerationResult) => {
        setResult(resultData);
        setStep('result');
    };

    const handleGenerationError = (errorMessage: string) => {
        setError(errorMessage);
        setStep('configure');
    };

    const handleReset = () => {
        setStep('upload');
        setUploadedJewelry(null);
        setPrompts({ model: '', decor: '' });
        setGenerationId(null);
        setResult(null);
        setError(null);
    };

    const handleGenerateVariant = () => {
        setStep('configure');
        setResult(null);
        setGenerationId(null);
    };

    const canProceedToGenerate = uploadedJewelry && prompts.model.length >= 10 && prompts.decor.length >= 10;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-display font-semibold mb-2">
                    Studio de Création
                </h1>
                <p className="text-muted-foreground">
                    Générez des visuels publicitaires ultra-réalistes pour vos bijoux
                </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-8">
                {['upload', 'configure', 'generating', 'result'].map((s, i) => {
                    const stepNumber = i + 1;
                    const isActive = s === step;
                    const isCompleted =
                        (s === 'upload' && (step === 'configure' || step === 'generating' || step === 'result')) ||
                        (s === 'configure' && (step === 'generating' || step === 'result')) ||
                        (s === 'generating' && step === 'result');

                    return (
                        <div key={s} className="flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                  ${isActive ? 'bg-gold-500 text-white' : ''}
                  ${isCompleted ? 'bg-gold-500/20 text-gold-500' : ''}
                  ${!isActive && !isCompleted ? 'bg-secondary text-muted-foreground' : ''}`}
                            >
                                {isCompleted ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    stepNumber
                                )}
                            </div>
                            {i < 3 && (
                                <div className={`w-12 h-0.5 mx-2 ${isCompleted ? 'bg-gold-500' : 'bg-secondary'}`} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 rounded-lg bg-error/10 border border-error/20 text-error">
                    <p className="font-medium">Erreur</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Step Content */}
            <div className="card-luxe p-6 lg:p-8">
                {step === 'upload' && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-display font-semibold mb-2">Étape 1 : Votre bijou</h2>
                            <p className="text-muted-foreground text-sm">
                                Uploadez une photo de votre bijou (idéalement avec le fond détouré pour un meilleur résultat)
                            </p>
                        </div>

                        <JewelryUploader
                            onUploadComplete={handleUploadComplete}
                            jewelryType={jewelryType}
                            onJewelryTypeChange={setJewelryType}
                        />

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={() => setStep('configure')}
                                disabled={!uploadedJewelry}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                Continuer →
                            </button>
                        </div>
                    </div>
                )}

                {step === 'configure' && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-display font-semibold mb-2">Étape 2 : Configuration IA</h2>
                            <p className="text-muted-foreground text-sm">
                                Décrivez le mannequin et le décor souhaités pour votre campagne
                            </p>
                        </div>

                        {/* Preview of uploaded jewelry */}
                        {uploadedJewelry && (
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                                <img
                                    src={uploadedJewelry.publicUrl}
                                    alt="Bijou sélectionné"
                                    className="w-16 h-16 object-contain rounded-lg"
                                />
                                <div>
                                    <p className="font-medium">Bijou sélectionné</p>
                                    <p className="text-sm text-muted-foreground capitalize">{uploadedJewelry.jewelryType}</p>
                                </div>
                                <button
                                    onClick={() => setStep('upload')}
                                    className="ml-auto text-sm text-gold-500 hover:text-gold-400"
                                >
                                    Changer
                                </button>
                            </div>
                        )}

                        <PromptBuilder
                            prompts={prompts}
                            onPromptsChange={handlePromptsChange}
                            jewelryType={jewelryType}
                        />

                        <div className="flex justify-between pt-4">
                            <button
                                onClick={() => setStep('upload')}
                                className="btn-secondary"
                            >
                                ← Retour
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={!canProceedToGenerate}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                ✨ Générer la Campagne
                            </button>
                        </div>
                    </div>
                )}

                {step === 'generating' && generationId && (
                    <GenerationProgress
                        generationId={generationId}
                        onComplete={handleGenerationComplete}
                        onError={handleGenerationError}
                    />
                )}

                {step === 'result' && result && (
                    <ResultDisplay
                        result={result}
                        onGenerateVariant={handleGenerateVariant}
                        onReset={handleReset}
                    />
                )}
            </div>
        </div>
    );
}
