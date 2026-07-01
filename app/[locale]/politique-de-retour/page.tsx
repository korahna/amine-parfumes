export default function PolitiqueRetour() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '5.5rem', background: 'var(--bg-base)' }}>
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: 'var(--fg-primary)', marginBottom: '2rem' }}>
          Politique de retour et de remboursement
        </h1>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--fg-muted)', lineHeight: 1.9 }}>
          <p style={{ marginBottom: '1.5rem' }}>Chez Amine Parfumes, votre satisfaction est notre priorité.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>1. Délai de retour</h2>
          <p style={{ marginBottom: '1.5rem' }}>Vous avez 7 jours après réception pour retourner un produit.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>2. Conditions</h2>
          <p style={{ marginBottom: '1.5rem' }}>Les retours sont acceptés uniquement si le parfum est dans son état d&apos;origine et n&apos;a pas été utilisé. Les produits qui ont été ouverts ou utilisés ne peuvent pas être retournés, sauf si le produit est endommagé ou défectueux.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>3. Procédure</h2>
          <p style={{ marginBottom: '1.5rem' }}>Contactez-nous par téléphone au {process.env.NEXT_PUBLIC_PHONE || '+212 769 045 089'} pour initier une demande de retour. Une fois votre demande approuvée, nous vous fournirons les instructions nécessaires.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>4. Remboursement</h2>
          <p style={{ marginBottom: '1.5rem' }}>Si vous choisissez un remboursement, celui-ci sera effectué dans les 7 jours suivant la réception du produit retourné. Vous pouvez également choisir un échange.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>5. Frais de retour</h2>
          <p style={{ marginBottom: '1.5rem' }}>Les frais de retour sont à la charge du client, sauf si le produit est défectueux ou non conforme.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>6. Contact</h2>
          <p>Pour toute question ou pour initier une demande de retour, contactez notre service client au {process.env.NEXT_PUBLIC_PHONE || '+212 769 045 089'}.</p>
        </div>
      </div>
    </div>
  )
}
