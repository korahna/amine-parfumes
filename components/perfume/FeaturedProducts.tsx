'use client'

import { motion } from 'framer-motion'
import { ProductCard } from './ProductCard'

interface Product {
  id: string
  slug: string
  name: string
  brand: string
  type: 'full' | 'decant'
  price: number
  image: string
  scentNotes: string[]
}

interface FeaturedProductsProps {
  products: Product[]
  title?: string
  subtitle?: string
}

export function FeaturedProducts({ products, title = 'Nos Meilleures Ventes', subtitle = 'Top Ventes' }: FeaturedProductsProps) {
  if (products.length === 0) return null

  return (
    <section style={{ background: 'var(--bg-surface)', padding: '4.5rem 0' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--gold-mid)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              {subtitle}
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2rem)', color: 'var(--fg-primary)' }}>
              {title}
            </h2>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))', gap: '1.1rem' }}>
          {products.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden' }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
