import Link from 'next/link';
import Image from 'next/image';
import ChristmasDecorations from '@/components/ui/ChristmasDecorations';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative">
      <ChristmasDecorations />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gold-50/50 to-white dark:from-onyx-950 dark:via-onyx-900 dark:to-onyx-950" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gold-500/10 dark:bg-gold-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-600/5 dark:bg-gold-600/5 rounded-full blur-[80px]" />

        {/* Nav */}
        <nav className="absolute top-0 left-0 right-0 z-50 p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg font-display">O</span>
              </div>
              <span className="font-display text-xl font-semibold text-gold-500">OAK BIJOUX</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/pricing" className="text-muted-foreground dark:text-gray-300 hover:text-foreground dark:hover:text-white transition-colors">
                Tarifs
              </Link>
              <Link href="/login" className="text-muted-foreground dark:text-gray-300 hover:text-foreground dark:hover:text-white transition-colors">
                Connexion
              </Link>
              <ThemeToggle />
              <Link href="/register" className="btn-primary text-sm">
                Essayer Gratuitement
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-onyx-900 border border-onyx-200 dark:border-booking-800 shadow-sm mb-8">
            <span className="text-gold-500">✨</span>
            <span className="text-sm text-muted-foreground dark:text-gray-300">1 génération offerte à l&apos;inscription</span>
          </div>

          <h1 className="text-6xl lg:text-8xl font-display font-medium text-foreground dark:text-white mb-8 leading-tight drop-shadow-sm tracking-tight">
            Sublimez vos bijoux <br />
            <span className="text-4xl lg:text-5xl font-body font-light text-muted-foreground dark:text-gray-400 block mt-4">
              avec <span className="font-semibold text-gold-600">l&apos;Intelligence Artificielle</span>
            </span>
          </h1>

          <p className="text-xl text-muted-foreground dark:text-gray-300 max-w-2xl mx-auto mb-10">
            Générez des visuels publicitaires ultra-réalistes en quelques secondes.
            Uploadez, décrivez, laissez l&apos;IA créer.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-lg px-8 py-4">
              Commencer Gratuitement →
            </Link>
            <Link href="/pricing" className="btn-secondary text-lg px-8 py-4 bg-white border-onyx-200 text-foreground hover:bg-onyx-50 shadow-sm">
              Voir les tarifs
            </Link>
          </div>

          {/* Demo Preview */}
          {/* Showcase Gallery */}
          <div className="mt-16 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { src: '/images/showcase/ring.png', alt: 'Bague diamant sur soie', delay: 0 },
                { src: '/images/showcase/necklace.png', alt: 'Collier or porté par mannequin', delay: 0.1 },
                { src: '/images/showcase/earrings.png', alt: 'Boucles d\'oreilles saphir', delay: 0.2 },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative group rounded-xl overflow-hidden border border-onyx-200 shadow-xl aspect-[4/5] md:aspect-[3/4]"
                  style={{ animationDelay: `${item.delay}s` }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-semibold mb-4">
              Comment ça fonctionne
            </h2>
            <p className="text-xl text-muted-foreground">
              Trois étapes simples pour des visuels professionnels
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-luxe p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📸</span>
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">1. Uploadez</h3>
              <p className="text-muted-foreground">
                Glissez-déposez la photo de votre bijou (fond détouré pour un meilleur résultat)
              </p>
            </div>

            <div className="card-luxe p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">2. Décrivez</h3>
              <p className="text-muted-foreground">
                Configurez le mannequin et le décor souhaités avec nos suggestions IA
              </p>
            </div>

            <div className="card-luxe p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🖼️</span>
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">3. Générez</h3>
              <p className="text-muted-foreground">
                En moins d&apos;une minute, obtenez votre visuel publicitaire prêt à l&apos;emploi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-gold-500/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-display font-semibold mb-6">
            Prêt à révolutionner vos campagnes ?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Rejoignez des centaines de créateurs de bijoux qui utilisent <span className="text-gold-500">OAK BIJOUX</span>
          </p>
          <Link href="/register" className="btn-primary text-lg px-8 py-4">
            Créer mon compte gratuitement
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                {/* Existing OAK BIJOUX Logo */}
                <div className="w-8 h-8 rounded bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm font-display">O</span>
                </div>
                <span className="font-display font-semibold text-gold-500 text-lg">OAK BIJOUX</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>By</span>
                <a href="https://oakflowai.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <Image
                    src="/images/oakflow-logo.png"
                    alt="Oakflow AI"
                    width={240}
                    height={80}
                    className="h-20 w-auto object-contain"
                  />
                </a>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-[#4b5563] dark:text-[#d1d5db]">
              <Link href="/pricing" className="hover:text-gold-500 transition-colors">
                Tarifs
              </Link>
              <a href="mailto:contact@oakflowai.com" className="hover:text-gold-500 transition-colors">
                Contact
              </a>
              <Link href="/legal/mentions-legales" className="hover:text-gold-500 transition-colors">
                Mentions Légales
              </Link>
              <Link href="/legal/cgu" className="hover:text-gold-500 transition-colors">
                CGU / CGV
              </Link>
              <Link href="/legal/confidentialite" className="hover:text-gold-500 transition-colors">
                Politique de Confidentialité
              </Link>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8 text-center text-xs text-muted-foreground">
            <p className="mb-2">© 2024 OAK BIJOUX - Une marque de OAKFLOW AI.</p>
            <p>Tous droits réservés. Application conforme aux normes RGPD.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
