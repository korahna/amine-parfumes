'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/lib/store'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const cartCount = useCartStore((s) => s.totalItems())

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/boutique', label: 'Boutique' },
    { href: '/boutique?type=decant', label: 'Décants' },
  ]

  return (
    <>
      <nav className="fixed top-0 z-50 w-full h-16 bg-[#0a0805]/80 backdrop-blur-md border-b border-[#2a2218]/50">
        <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between px-6">
          {/* Left — Logo */}
          <Link href="/" className="font-[Cormorant_Garamond] italic text-xl tracking-[0.15em] text-[#f0ead8]">
            amine.parfume
          </Link>

          {/* Center — Links */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] tracking-[0.2em] uppercase text-[#8a7d65] hover:text-[#f0ead8] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right — Cart + Mobile menu */}
          <div className="flex items-center gap-4">
            <Link href="/panier" className="relative p-2" aria-label="Panier">
              <ShoppingBag className="w-5 h-5 text-[#8a7d65] hover:text-[#f0ead8] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c9a84c] text-[#0a0805] text-[9px] font-medium rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 text-[#f0ead8]" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#0a0805] flex flex-col items-center justify-center"
          >
            <button
              className="absolute top-5 right-6 p-2"
              onClick={() => setMobileOpen(false)}
              aria-label="Fermer"
            >
              <X className="w-6 h-6 text-[#f0ead8]" />
            </button>
            <div className="flex flex-col items-center gap-8">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl font-[Cormorant_Garamond] tracking-[0.15em] text-[#f0ead8] hover:text-[#c9a84c] transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
