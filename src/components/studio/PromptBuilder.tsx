'use client';

interface PromptBuilderProps {
    prompts: { model: string; decor: string };
    onPromptsChange: (prompts: { model: string; decor: string }) => void;
    jewelryType: string;
}

const modelPresets = [
    { label: 'Femme élégante', prompt: 'Femme élégante de 30 ans, peau parfaite, maquillage subtil et sophistiqué, cheveux bruns ondulés, regard confiant et serein' },
    { label: 'Femme moderne', prompt: 'Jeune femme moderne de 25 ans, peau mate, cheveux noirs lisses, style contemporain et minimaliste, expression naturelle' },
    { label: 'Femme glamour', prompt: 'Femme glamour de 35 ans, peau lumineuse, cheveux blonds platine, maquillage hollywoodien, regard intense' },
    { label: 'Homme distingué', prompt: 'Homme distingué de 40 ans, barbe soignée, cheveux gris poivre et sel, allure raffinée et confiante' },
];

const decorPresets = [
    { label: 'Studio luxe', prompt: 'Studio photo professionnel, fond gris neutre avec dégradé subtil, éclairage studio doux et flatteur, ambiance haut de gamme' },
    { label: 'Marbre doré', prompt: 'Intérieur luxueux avec murs en marbre blanc veiné d\'or, lumière naturelle douce, touches dorées subtiles' },
    { label: 'Jardin romantique', prompt: 'Jardin à la française au coucher du soleil, lumière dorée naturelle, fleurs blanches en arrière-plan flou' },
    { label: 'Boudoir chic', prompt: 'Boudoir parisien élégant, velours bordeaux, miroir ancien doré, lumière tamisée et romantique' },
];

export default function PromptBuilder({
    prompts,
    onPromptsChange,
    jewelryType,
}: PromptBuilderProps) {
    const handleModelChange = (value: string) => {
        onPromptsChange({ ...prompts, model: value });
    };

    const handleDecorChange = (value: string) => {
        onPromptsChange({ ...prompts, decor: value });
    };

    const applyPreset = (type: 'model' | 'decor', preset: string) => {
        if (type === 'model') {
            handleModelChange(preset);
        } else {
            handleDecorChange(preset);
        }
    };

    const getPlacementTip = () => {
        switch (jewelryType) {
            case 'ring':
                return 'La bague sera placée naturellement sur le doigt du mannequin';
            case 'necklace':
                return 'Le collier sera positionné autour du cou du mannequin';
            case 'earring':
                return 'La boucle d\'oreille sera visible à l\'oreille du mannequin';
            case 'bracelet':
                return 'Le bracelet sera porté au poignet du mannequin';
            case 'set':
                return 'La parure complète sera harmonieusement disposée sur le mannequin';
            default:
                return '';
        }
    };

    return (
        <div className="space-y-8">
            {/* Placement Tip */}
            <div className="p-4 rounded-lg bg-gold-500/10 border border-gold-500/20">
                <p className="text-sm text-gold-500">
                    <span className="font-medium">💡 Tip :</span> {getPlacementTip()}
                </p>
            </div>

            {/* Model Prompt */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Description du mannequin
                    </label>
                    <textarea
                        value={prompts.model}
                        onChange={(e) => handleModelChange(e.target.value)}
                        placeholder="Décrivez le mannequin souhaité : apparence, style, expression..."
                        className="w-full h-32 px-4 py-3 rounded-lg bg-secondary border border-border focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                        {prompts.model.length}/10 caractères minimum
                    </p>
                </div>

                {/* Model Presets */}
                <div>
                    <p className="text-xs text-muted-foreground mb-2">Suggestions rapides :</p>
                    <div className="flex flex-wrap gap-2">
                        {modelPresets.map((preset) => (
                            <button
                                key={preset.label}
                                type="button"
                                onClick={() => applyPreset('model', preset.prompt)}
                                className="px-3 py-1.5 text-xs rounded-full bg-secondary hover:bg-gold-500/20 hover:text-gold-500 transition-colors"
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Decor Prompt */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Description du décor
                    </label>
                    <textarea
                        value={prompts.decor}
                        onChange={(e) => handleDecorChange(e.target.value)}
                        placeholder="Décrivez l'ambiance et le décor souhaités : lieu, lumière, style..."
                        className="w-full h-32 px-4 py-3 rounded-lg bg-secondary border border-border focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                        {prompts.decor.length}/10 caractères minimum
                    </p>
                </div>

                {/* Decor Presets */}
                <div>
                    <p className="text-xs text-muted-foreground mb-2">Suggestions rapides :</p>
                    <div className="flex flex-wrap gap-2">
                        {decorPresets.map((preset) => (
                            <button
                                key={preset.label}
                                type="button"
                                onClick={() => applyPreset('decor', preset.prompt)}
                                className="px-3 py-1.5 text-xs rounded-full bg-secondary hover:bg-gold-500/20 hover:text-gold-500 transition-colors"
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
