'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store'

interface ProductCardProps {
  id: string
  slug: string
  name: string
  brand: string
  type: 'full' | 'decant'
  price: number
  image: string
  scentNotes?: string[]
}

export function ProductCard({ id, slug, name, brand, type, price, image, scentNotes = [] }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ productId: id, name, brand, price, image, type })
    openCart()
  }

  return (
    <div className="product-card group" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-gold)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
      <Link href={`/produit/${slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Image with rounded top */}
        <div className="card-img relative" style={{ aspectRatio: '3/4', background: 'var(--bg-raised)', overflow: 'hidden', borderRadius: 'var(--r-lg) var(--r-lg) 0 0' }}>
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width:768px) 50vw, 25vw"
            style={{ transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)' }}
          />

          {/* Hover overlay with CTA */}
          <div className="overlay" style={{ borderRadius: 'var(--r-lg) var(--r-lg) 0 0' }}>
            <button onClick={handleAddToCart}
              className="btn-gold-filled flex items-center gap-2"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.65rem', borderRadius: 'var(--r-sm)' }}>
              <ShoppingBag size={12} />
              Ajouter au panier
            </button>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '0.9rem 0.85rem 0.75rem' }}>
          {brand && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--gold-dark)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              {brand}
            </p>
          )}
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--fg-primary)', lineHeight: 1.2, marginBottom: '0.5rem', transition: 'color 0.3s' }}
            className="group-hover:text-[var(--gold-mid)]">
            {name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--gold-mid)', fontSize: '0.9rem' }}>
              {price.toFixed(2)} MAD
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--fg-subtle)', marginTop: '0.25rem' }}>
            {type === 'decant' ? 'Échantillon' : 'Flacon complet'}
          </p>
        </div>
      </Link>
    </div>
  )
}
