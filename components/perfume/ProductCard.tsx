'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="group relative cursor-pointer"
    >
      <Link href={`/produit/${slug}`}>
        {/* Image — no border, no container, sits directly on bg */}
        <div className="relative aspect-square overflow-hidden bg-[#13100c]">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
          {/* Hover ring */}
          <div className="absolute inset-0 ring-0 group-hover:ring-1 ring-[#c9a84c]/30 transition-all duration-500 pointer-events-none" />
        </div>

        {/* Info — centered, no card container */}
        <div className="mt-4 text-center">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#8a7d65]">
            {brand} · {type === 'decant' ? 'Échantillon' : 'Flacon'}
          </p>
          <h3 className="mt-1 text-lg font-[Cormorant_Garamond] font-normal text-[#f0ead8] group-hover:text-[#c9a84c] transition-colors">
            {name}
          </h3>

          {/* Scent pills */}
          {scentNotes.length > 0 && (
            <div className="mt-2 flex items-center justify-center gap-1.5 flex-wrap">
              {scentNotes.map((note) => (
                <span
                  key={note}
                  className="text-[10px] border border-[#2a2218] text-[#8a7d65] px-2 py-0.5 rounded-full"
                >
                  {note}
                </span>
              ))}
            </div>
          )}

          {/* Price + CTA */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xl text-[#c9a84c] font-medium font-[DM_Sans]">
              {price.toLocaleString('fr-MA')} MAD
            </span>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase"
            >
              <ShoppingBag className="w-3 h-3" />
              Panier
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
