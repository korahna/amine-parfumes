import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'

export default function PolitiqueExpedition() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '5.5rem', background: 'var(--bg-base)' }}>
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.28em', color: 'var(--gold-400)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            amine.parfume
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: 'var(--fg-primary)', marginBottom: '2.5rem', lineHeight: 1.1 }}>
            Politique d&apos;expédition
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-muted)', lineHeight: 1.85 }}>
              Chez Amine Parfumes, nous nous engageons à expédier vos commandes dans les meilleurs délais.
            </p>

            {[
              { title: '1. Délais d\'expédition', text: 'Nous expédions toutes les commandes dans un délai de 24 à 72 heures. Les délais peuvent légèrement varier selon votre emplacement.' },
              { title: '2. Frais de livraison', text: 'Les frais de livraison sont de 30 MAD. La livraison est gratuite pour toute commande supérieure à 500 MAD.' },
              { title: '3. Zone de livraison', text: 'Livraison disponible partout au Maroc.' },
              { title: '4. Paiement', text: 'Le paiement s\'effectue à la livraison (cash on delivery).' },
              { title: '5. Suivi', text: 'Une fois votre commande expédiée, vous recevrez un message de confirmation avec les détails de votre commande.' },
              { title: '6. Contact', text: `En cas de problème ou de retard de livraison, contactez notre service client au ${process.env.NEXT_PUBLIC_PHONE || '+212 769 045 089'}.` },
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
