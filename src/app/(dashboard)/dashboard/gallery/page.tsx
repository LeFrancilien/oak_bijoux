import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function GalleryPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { data: generations } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-display font-semibold mb-2">
                        Galerie
                    </h1>
                    <p className="text-muted-foreground">
                        Toutes vos campagnes générées
                    </p>
                </div>
                <Link
                    href="/dashboard/create"
                    className="btn-primary inline-flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouvelle Création
                </Link>
            </div>

            {/* Gallery Grid */}
            {generations && generations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {generations.map((gen) => (
                        <div key={gen.id} className="card-luxe overflow-hidden group">
                            {/* Image */}
                            <div className="aspect-square relative">
                                {gen.result_image_url ? (
                                    <>
                                        <img
                                            src={gen.result_image_url}
                                            alt="Génération"
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-center gap-3">
                                                <a
                                                    href={gen.result_image_url}
                                                    download={`oak-bijoux-${gen.id}.png`}
                                                    className="p-2 rounded-full bg-background/80 hover:bg-gold-500 hover:text-white transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                        {/* Watermark badge */}
                                        {gen.has_watermark && (
                                            <div className="absolute top-3 right-3 px-2 py-1 rounded text-xs bg-warning/20 text-warning">
                                                Watermark
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                                        {gen.status === 'processing' ? (
                                            <div className="text-center">
                                                <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                                <p className="text-sm text-muted-foreground">En cours...</p>
                                            </div>
                                        ) : gen.status === 'failed' ? (
                                            <div className="text-center p-4">
                                                <svg className="w-10 h-10 text-error mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                <p className="text-sm text-error">Échec</p>
                                                {gen.error_message && (
                                                    <p className="text-xs text-muted-foreground mt-1">{gen.error_message}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                                            </svg>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className={`px-2 py-0.5 rounded text-xs ${gen.status === 'completed' ? 'bg-success/10 text-success' :
                                            gen.status === 'processing' ? 'bg-gold-500/10 text-gold-500' :
                                                gen.status === 'failed' ? 'bg-error/10 text-error' :
                                                    'bg-secondary text-muted-foreground'
                                        }`}>
                                        {gen.status === 'completed' ? 'Terminé' :
                                            gen.status === 'processing' ? 'En cours' :
                                                gen.status === 'failed' ? 'Échec' : 'En attente'}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {new Date(gen.created_at).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'short',
                                        })}
                                    </span>
                                </div>
                                {gen.processing_time_ms && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        ⏱️ {Math.round(gen.processing_time_ms / 1000)}s
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card-luxe p-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-display font-semibold mb-2">
                        Aucune création pour le moment
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Vos campagnes générées apparaîtront ici
                    </p>
                    <Link
                        href="/dashboard/create"
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        Créer votre première campagne →
                    </Link>
                </div>
            )}
        </div>
    );
}
