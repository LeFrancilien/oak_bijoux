'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface JewelryUploaderProps {
    onUploadComplete: (data: {
        id: string;
        publicUrl: string;
        jewelryType: string;
    }) => void;
    jewelryType: 'ring' | 'necklace' | 'earring' | 'bracelet' | 'set';
    onJewelryTypeChange: (type: 'ring' | 'necklace' | 'earring' | 'bracelet' | 'set') => void;
}

const jewelryTypes = [
    { value: 'ring', label: 'Bague', icon: '💍' },
    { value: 'necklace', label: 'Collier', icon: '📿' },
    { value: 'earring', label: 'Boucle d\'oreille', icon: '✨' },
    { value: 'bracelet', label: 'Bracelet', icon: '⌚' },
    { value: 'set', label: 'Parure', icon: '💎' },
] as const;

export default function JewelryUploader({
    onUploadComplete,
    jewelryType,
    onJewelryTypeChange,
}: JewelryUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Veuillez uploader une image (PNG, JPG, WEBP)');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError('L\'image ne doit pas dépasser 10 Mo');
            return;
        }

        setError(null);
        setUploading(true);

        try {
            // Create FormData
            const formData = new FormData();
            formData.append('file', file);
            formData.append('jewelryType', jewelryType);

            // Upload to API
            const response = await fetch('/api/jewelry', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erreur lors de l\'upload');
            }

            const data = await response.json();

            // Show preview
            setUploadedImage(data.publicUrl);

            // Notify parent
            onUploadComplete({
                id: data.id,
                publicUrl: data.publicUrl,
                jewelryType,
            });
        } catch (err) {
            console.error('Upload error:', err);
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
        } finally {
            setUploading(false);
        }
    }, [jewelryType, onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
        },
        maxFiles: 1,
        disabled: uploading,
    });

    const removeImage = () => {
        setUploadedImage(null);
        setError(null);
    };

    return (
        <div className="space-y-6">
            {/* Jewelry Type Selector */}
            <div>
                <label className="block text-sm font-medium mb-3">Type de bijou</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {jewelryTypes.map((type) => (
                        <button
                            key={type.value}
                            type="button"
                            onClick={() => onJewelryTypeChange(type.value)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-200
                ${jewelryType === type.value
                                    ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                                    : 'border-border hover:border-gold-500/50 hover:bg-secondary'
                                }`}
                        >
                            <span className="text-2xl">{type.icon}</span>
                            <span className="text-sm font-medium">{type.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Upload Zone */}
            <div>
                <label className="block text-sm font-medium mb-3">
                    Image du bijou
                    <span className="text-muted-foreground font-normal ml-2">(fond détouré recommandé)</span>
                </label>

                {uploadedImage ? (
                    <div className="relative aspect-square max-w-sm mx-auto rounded-lg overflow-hidden border border-gold-500/50 bg-secondary/50">
                        <img
                            src={uploadedImage}
                            alt="Bijou uploadé"
                            className="w-full h-full object-contain"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background to-transparent">
                            <p className="text-sm text-gold-500 font-medium flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Image prête
                            </p>
                        </div>
                    </div>
                ) : (
                    <div
                        {...getRootProps()}
                        className={`relative aspect-[4/3] max-w-lg mx-auto border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer
              ${isDragActive
                                ? 'border-gold-500 bg-gold-500/5'
                                : 'border-border hover:border-gold-500/50 hover:bg-secondary/50'
                            }
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
              ${error ? 'border-error' : ''}`}
                    >
                        <input {...getInputProps()} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                            {uploading ? (
                                <>
                                    <div className="w-12 h-12 rounded-full border-2 border-gold-500 border-t-transparent animate-spin mb-4" />
                                    <p className="text-sm text-muted-foreground">Upload en cours...</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-medium mb-1">
                                        {isDragActive ? 'Déposez l\'image ici' : 'Glissez-déposez votre bijou'}
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-4">ou cliquez pour parcourir</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP • Max 10 Mo</p>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {error && (
                    <p className="mt-2 text-sm text-error text-center">{error}</p>
                )}
            </div>
        </div>
    );
}
