'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Full-bleed background image */}
      <Image
        src="https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=1440&q=90"
        alt="Parfums de luxe — composition florale"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Gradient overlay — dark from bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0805] via-[#0a0805]/60 to-transparent" />

      {/* Content — staggered reveal */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-5xl sm:text-6xl md:text-8xl font-[Cormorant_Garamond] font-light tracking-[0.3em] text-[#f0ead8] italic"
        >
          amine.parfume
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className="mt-4 text-base md:text-lg text-[#8a7d65] font-[DM_Sans] tracking-[0.1em]"
        >
          L&apos;art du parfum au Maroc
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="mt-8"
        >
          <Link
            href="/boutique"
            className="inline-block text-[#8a7d65] hover:text-[#f0ead8] text-xs tracking-[0.2em] uppercase underline underline-offset-4 transition-colors"
          >
            Découvrir la boutique →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
