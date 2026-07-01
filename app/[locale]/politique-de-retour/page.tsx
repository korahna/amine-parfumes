import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'

export default function PolitiqueRetour() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '5.5rem', background: 'var(--bg-base)' }}>
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.28em', color: 'var(--gold-400)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            amine.parfume
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: 'var(--fg-primary)', marginBottom: '2.5rem', lineHeight: 1.1 }}>
            Politique de retour et de remboursement
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-muted)', lineHeight: 1.85 }}>
              Chez Amine Parfumes, votre satisfaction est notre priorité.
            </p>

            {[
              { title: '1. Délai de retour', text: 'Vous avez 7 jours après réception pour retourner un produit.' },
              { title: '2. Conditions', text: 'Les retours sont acceptés uniquement si le parfum est dans son état d\'origine et n\'a pas été utilisé. Les produits ouverts ou utilisés ne peuvent pas être retournés, sauf si le produit est endommagé ou défectueux.' },
              { title: '3. Procédure', text: `Contactez-nous par téléphone au ${process.env.NEXT_PUBLIC_PHONE || '+212 769 045 089'} pour initier une demande de retour. Une fois approuvée, nous vous fournirons les instructions nécessaires.` },
              { title: '4. Remboursement', text: 'Si vous choisissez un remboursement, celui-ci sera effectué dans les 7 jours suivant la réception du produit retourné. Vous pouvez également choisir un échange.' },
              { title: '5. Frais de retour', text: 'Les frais de retour sont à la charge du client, sauf si le produit est défectueux ou non conforme.' },
              { title: '6. Contact', text: `Pour toute question ou pour initier une demande de retour, contactez notre service client au ${process.env.NEXT_PUBLIC_PHONE || '+212 769 045 089'}.` },
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
