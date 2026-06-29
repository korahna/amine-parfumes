import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Amine Parfumes – Créations d\'Exception',
  description: 'Découvrez notre collection exclusive de parfums de luxe. Livraison à domicile au Maroc.',
  keywords: 'parfums, fragrances, luxe, Maroc, Agadir, Amine Parfumes',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" dir="ltr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
