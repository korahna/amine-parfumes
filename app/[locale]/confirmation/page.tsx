import Link from 'next/link'

export default function ConfirmationPage() {
  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl flex justify-between items-center px-gutter py-4">
        <div className="w-6 h-6" />
        <Link href="/" className="font-display-lg text-display-lg-mobile italic text-on-surface">
          amine.parfume
        </Link>
        <div className="w-6 h-6" />
      </header>

      <main className="flex-grow pt-24 pb-section-padding px-gutter max-w-container-max mx-auto w-full">
        <div className="text-center py-24 max-w-lg mx-auto">
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
          </div>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-4">
            Merci pour votre commande
          </h1>
          <p className="font-body-md text-body-lg text-on-surface-variant mb-8 leading-relaxed">
            Votre commande a été enregistrée avec succès. Nous vous contacterons très bientôt pour confirmer la livraison.
          </p>
          <div className="p-6 bg-surface-container-low rounded-sm border border-outline-variant/30 mb-12">
            <div className="flex items-center gap-3 justify-center">
              <span className="material-symbols-outlined text-primary">local_shipping</span>
              <p className="font-body-md text-body-md text-on-surface">
                Paiement à la livraison — Livraison gratuite
              </p>
            </div>
          </div>
          <Link
            href="/boutique"
            className="inline-block bg-primary text-on-primary font-label-caps text-label-caps py-4 px-12 hover:bg-primary-fixed transition-colors duration-300 tracking-widest uppercase"
          >
            Continuer vos achats
          </Link>
        </div>
      </main>
    </>
  )
}
