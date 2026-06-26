'use client'

import { motion } from 'framer-motion'
import { ProductCard } from './ProductCard'
import { SkeletonGrid } from './SkeletonCard'

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
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="bg-[#13100c] py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#8a7d65] mb-3">
            Collection
          </p>
          <h2 className="text-4xl md:text-5xl font-[Cormorant_Garamond] font-light tracking-[0.08em] text-[#f0ead8]">
            Nos signatures
          </h2>
        </motion.div>

        {/* Product grid — 2 cols mobile, 3 cols desktop */}
        {products.length === 0 ? (
          <SkeletonGrid count={6} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
            {products.map((product, i) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
