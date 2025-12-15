export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-onyx-900 via-onyx-950 to-black p-12 flex-col justify-between relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold-600/5 rounded-full blur-2xl" />

                {/* Logo */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xl font-display">O</span>
                        </div>
                        <div>
                            <h1 className="font-display text-2xl font-semibold tracking-tight text-gold-500">OAK BIJOUX</h1>
                            <p className="text-sm text-onyx-400">Studio IA</p>
                        </div>
                    </div>
                </div>

                {/* Tagline */}
                <div className="relative z-10 max-w-md">
                    <h2 className="text-4xl font-display font-semibold text-white mb-6 leading-tight">
                        Sublimez vos créations avec l'intelligence artificielle
                    </h2>
                    <p className="text-onyx-300 text-lg">
                        Générez des visuels publicitaires ultra-réalistes pour vos bijoux en quelques clics.
                    </p>
                </div>

                {/* Testimonial */}
                <div className="relative z-10 p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                    <p className="text-onyx-200 italic mb-4">
                        "OAK BIJOUX a révolutionné notre façon de créer des campagnes. Les visuels sont d'une qualité impressionnante."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 font-semibold">
                            M
                        </div>
                        <div>
                            <p className="text-white font-medium">Marie Dupont</p>
                            <p className="text-sm text-onyx-400">Créatrice de bijoux</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
