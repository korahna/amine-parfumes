'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Minus, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/lib/store'

interface Product {
  id: string
  slug: string
  name_fr: string
  name_ar: string
  description_fr: string
  brand: string
  type: 'full' | 'decant'
  price: number
  volume: number | null
  variants: { volume: number; price: number }[] | null
  images: string[]
  scent_notes: { top: string[]; heart: string[]; base: string[] }
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<{ volume: number; price: number } | null>(null)
  const [selectedImg, setSelectedImg] = useState(0)
  const [qty, setQty] = useState(1)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('products').select('*').eq('slug', params.slug).single()
      if (data) {
        setProduct(data)
        const v = data.variants?.length ? data.variants : (data.volume ? [{ volume: data.volume, price: data.price }] : [])
        if (v.length > 0) setSelectedVariant(v[0])
      }
      setLoading(false)
    }
    fetchProduct()
  }, [params.slug])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '5.5rem', background: 'var(--bg-base)' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div style={{ aspectRatio: '1', background: 'var(--bg-surface)', borderRadius: 8, animation: 'shimmer 2s ease-in-out infinite', backgroundSize: '200% 100%' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ height: 20, background: 'var(--bg-surface)', borderRadius: 4, animation: 'shimmer 2s ease-in-out infinite', backgroundSize: '200% 100%' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '5.5rem', background: 'var(--bg-base)' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <span style={{ fontSize: 36, display: 'block', marginBottom: '1rem', opacity: 0.25 }}>🌹</span>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--fg-subtle)', fontSize: '0.88rem' }}>Ce parfum n&apos;existe pas...</p>
          <Link href="/boutique" className="btn-gold" style={{ marginTop: '1rem', display: 'inline-block' }}><span>Retour à la boutique</span></Link>
        </div>
      </div>
    )
  }

  const images = product.images?.length ? product.images : []
  const variants = product.variants?.length ? product.variants : (product.volume ? [{ volume: product.volume, price: product.price }] : [])

  const handleAdd = () => {
    if (!selectedVariant) return
    for (let i = 0; i < qty; i++) {
      addItem({ productId: product.id, name: product.name_fr, brand: product.brand, price: selectedVariant.price, volume: selectedVariant.volume, image: images[0] ?? '/images/placeholder.jpg', type: product.type })
    }
    openCart()
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '5.5rem', background: 'var(--bg-base)' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2rem', fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)' }}>
          <Link href="/" className="hover:text-[var(--gold-400)] transition-colors" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
          <span>/</span>
          <Link href="/boutique" className="hover:text-[var(--gold-400)] transition-colors" style={{ color: 'inherit', textDecoration: 'none' }}>Catalogue</Link>
          <span>/</span>
          <span style={{ color: 'var(--fg-muted)' }}>{product.name_fr}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <div>
            <div className="relative aspect-square overflow-hidden mb-4" style={{ background: 'var(--bg-raised)', borderRadius: 8 }}>
              {images[selectedImg] ? (
                <Image src={images[selectedImg]} alt={product.name_fr} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center" style={{ fontSize: 64, opacity: 0.1 }}>🌹</div>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)}
                    style={{ width: 64, height: 64, position: 'relative', overflow: 'hidden', border: `1px solid ${selectedImg === i ? 'var(--gold-400)' : 'var(--border)'}`, borderRadius: 4, cursor: 'pointer', transition: 'border-color 0.2s' }}>
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {product.brand && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold-600)' }}>{product.brand}</p>
            )}
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: 'var(--fg-primary)', lineHeight: 1.1 }}>{product.name_fr}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--gold-400)' }}>
                {selectedVariant ? selectedVariant.price.toFixed(2) : Number(product.price).toFixed(2)} <span style={{ fontSize: '0.9rem' }}>MAD</span>
              </span>
            </div>

            {/* Meta */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {selectedVariant?.volume && <span className="glass-card" style={{ padding: '4px 12px', fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--fg-muted)' }}>{selectedVariant.volume} ml</span>}
              <span className="glass-card" style={{ padding: '4px 12px', fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--fg-muted)' }}>{product.type === 'decant' ? 'Échantillon' : 'Flacon'}</span>
            </div>

            {product.description_fr && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-muted)', lineHeight: 1.85, borderLeft: '1px solid var(--border-mid)', paddingLeft: '1rem' }}>{product.description_fr}</p>
            )}

            {/* Scent notes */}
            {(product.scent_notes?.top?.length > 0 || product.scent_notes?.heart?.length > 0 || product.scent_notes?.base?.length > 0) && (
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-600)', marginBottom: '1rem' }}>Composition olfactive</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { key: 'top', notes: product.scent_notes?.top, icon: '🌸', label: 'Notes de tête' },
                    { key: 'heart', notes: product.scent_notes?.heart, icon: '🌹', label: 'Notes de cœur' },
                    { key: 'base', notes: product.scent_notes?.base, icon: '🪵', label: 'Notes de fond' },
                  ].filter((n) => n.notes?.length).map((n) => (
                    <div key={n.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <span style={{ fontSize: 14, marginTop: 2 }}>{n.icon}</span>
                      <div>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', color: 'var(--gold-700)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>{n.label}</p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--fg-muted)' }}>{n.notes?.join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Variant selector */}
            {variants.length > 1 && (
              <div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold-400)', marginBottom: '0.5rem', display: 'block' }}>Format</span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {variants.map((v) => (
                    <button key={v.volume} onClick={() => setSelectedVariant(v)}
                      style={{ flex: 1, minWidth: 80, padding: '0.6rem', fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: selectedVariant?.volume === v.volume ? 'var(--gold-400)' : 'var(--fg-muted)', background: selectedVariant?.volume === v.volume ? 'rgba(201,162,39,0.09)' : 'transparent', border: `1px solid ${selectedVariant?.volume === v.volume ? 'var(--gold-400)' : 'var(--border)'}`, borderRadius: 4, cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {v.volume} ML
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add to cart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="glass-card" style={{ display: 'flex', alignItems: 'center' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><Minus size={14} /></button>
                <span style={{ width: 40, textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-primary)' }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><Plus size={14} /></button>
              </div>
              <button onClick={handleAdd} disabled={!selectedVariant}
                className="btn-gold-filled" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: !selectedVariant ? 0.45 : 1 }}>
                <ShoppingBag size={16} />
                Ajouter au panier
              </button>
            </div>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)' }}>
              ✓ En stock
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
