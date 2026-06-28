import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'amine.parfume — L\'art du parfum au Maroc',
  description: 'Parfums de luxe et échantillons. Découvrez notre collection de fragrances exclusives.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <head />
      <body>{children}</body>
    </html>
  )
}
