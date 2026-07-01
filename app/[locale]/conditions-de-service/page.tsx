import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'

export default function ConditionsService() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '5.5rem', background: 'var(--bg-base)' }}>
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.28em', color: 'var(--gold-400)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            amine.parfume
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: 'var(--fg-primary)', marginBottom: '2.5rem', lineHeight: 1.1 }}>
            Conditions d&apos;utilisation
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-muted)', lineHeight: 1.85 }}>
              Bienvenue sur Amine Parfumes. En passant commande sur notre site, vous acceptez les conditions suivantes.
            </p>

            {[
              { title: '1. Commandes', text: 'En passant commande, vous vous engagez à acheter les produits au prix indiqué et à fournir des informations correctes pour le traitement et la livraison. Les commandes sont confirmées une fois que le paiement est validé (paiement à la livraison).' },
              { title: '2. Prix et paiement', text: 'Tous les prix sont indiqués en dirhams marocains (MAD). Le paiement se fait à la livraison (cash on delivery).' },
              { title: '3. Livraison', text: 'La livraison est effectuée dans un délai de 24 à 72 heures. Nous livrons partout au Maroc avec des frais fixes de 30 MAD (gratuite à partir de 500 MAD).' },
              { title: '4. Retours', text: 'Vous disposez de 7 jours pour retourner un produit. Les frais de retour sont à la charge du client sauf si le produit est défectueux.' },
              { title: '5. Qualité', text: 'Nous nous engageons à fournir des produits de haute qualité et authentiques.' },
              { title: '6. Contact', text: `Pour toute question ou réclamation, contactez-nous par téléphone au ${process.env.NEXT_PUBLIC_PHONE || '+212 769 045 089'}.` },
            ].map((item) => (
              <div key={item.title}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--gold-400)', marginBottom: '0.5rem' }}>{item.title}</h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-muted)', lineHeight: 1.85 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
