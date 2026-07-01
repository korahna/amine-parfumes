import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'

export default function PolitiqueConfidentialite() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '5.5rem', background: 'var(--bg-base)' }}>
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.28em', color: 'var(--gold-400)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            amine.parfume
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: 'var(--fg-primary)', marginBottom: '2.5rem', lineHeight: 1.1 }}>
            Politique de confidentialité
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-muted)', lineHeight: 1.85 }}>
              Chez Amine Parfumes, nous accordons une grande importance à la confidentialité de vos données personnelles.
            </p>

            {[
              { title: '1. Collecte des données', text: 'Nous collectons uniquement les informations nécessaires pour le traitement de vos commandes : nom, prénom, adresse de livraison, numéro de téléphone et adresse email.' },
              { title: '2. Utilisation des données', text: 'Vos informations sont utilisées pour traiter et expédier vos commandes, vous informer sur le statut de votre commande, et améliorer notre service client.' },
              { title: '3. Sécurité', text: 'Nous mettons en œuvre des mesures de sécurité pour protéger vos informations personnelles contre toute perte, accès non autorisé, ou utilisation abusive.' },
              { title: '4. Partage des données', text: 'Nous ne partageons jamais vos informations personnelles avec des tiers, sauf en cas d\'obligation légale.' },
              { title: '5. Cookies', text: 'Nous utilisons des cookies pour améliorer votre expérience sur notre site. Vous pouvez choisir de les désactiver dans les paramètres de votre navigateur.' },
              { title: '6. Vos droits', text: `Vous avez le droit de consulter, modifier ou supprimer vos informations personnelles. Pour toute demande, veuillez nous contacter par téléphone au ${process.env.NEXT_PUBLIC_PHONE || '+212 769 045 089'}.` },
              { title: '7. Contact', text: `Pour toute question concernant la confidentialité de vos informations, contactez-nous au ${process.env.NEXT_PUBLIC_PHONE || '+212 769 045 089'}.` },
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
