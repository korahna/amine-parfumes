'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function BrandStory() {
  return (
    <section className="bg-[#0a0805] py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative aspect-[4/5] overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=90"
              alt="L&apos;art de la parfumerie — flacon de luxe"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col justify-center"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#8a7d65] mb-4">
              Notre histoire
            </p>
            <h2 className="text-3xl md:text-4xl font-[Cormorant_Garamond] font-light tracking-[0.06em] text-[#f0ead8] leading-snug">
              L&apos;essence de la tradition,{' '}
              <span className="italic text-[#c9a84c]">sublimée</span>
            </h2>
            <p className="mt-6 text-[#8a7d65] text-base leading-relaxed max-w-md">
              Chaque fragrance est soigneusement sélectionnée pour capturer l&apos;héritage
              olfactif du Maroc et de la Méditerranée. Des notes d&apos;oud aux accords
              floraux les plus délicats, nous offrons une expérience sensorielle unique
              pour les connaisseurs les plus exigeants.
            </p>
            <p className="mt-4 text-[#8a7d65] text-base leading-relaxed max-w-md">
              Que vous cherchiez un flacon complet ou un échantillon pour découvrir,
              amine.parfume est votre destination pour l&apos;art du parfum.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
