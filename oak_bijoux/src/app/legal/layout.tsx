import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ChristmasDecorations from '@/components/ui/ChristmasDecorations';

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-stone-50 dark:bg-onyx-950 font-sans text-onyx-900 dark:text-stone-100">
            <ChristmasDecorations />

            <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-500 transition-colors font-medium mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour à l&apos;accueil
                    </Link>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20">
                            <span className="text-white font-bold text-lg font-display">O</span>
                        </div>
                        <span className="font-display font-bold text-2xl text-gold-600">OAK BIJOUX</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#111827] rounded-xl shadow-xl shadow-gold-500/5 dark:shadow-none p-8 md:p-12 border border-gold-200/50 dark:border-gold-500/10">
                    <div className="
            text-[#000000] dark:text-[#f9fafb]
            [&_h1]:text-3xl [&_h1]:font-display [&_h1]:font-bold [&_h1]:text-gold-600 [&_h1]:mb-8
            [&_h2]:text-xl [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-gold-600 [&_h2]:mt-8 [&_h2]:mb-4
            [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-[#1f2937] dark:[&_p]:text-[#d1d5db]
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2 [&_ul]:text-[#1f2937] dark:[&_ul]:text-[#d1d5db]
            [&_li]:marker:text-gold-500
            [&_strong]:font-semibold [&_strong]:text-[#000000] dark:[&_strong]:text-white
            [&_a]:text-gold-600 hover:[&_a]:text-gold-500 [&_a]:underline [&_a]:decoration-gold-500/30 hover:[&_a]:decoration-gold-500
          ">
                        {children}
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} OAK BIJOUX - Une marque de OAKFLOW AI</p>
                </div>
            </div>
        </div>
    );
}
