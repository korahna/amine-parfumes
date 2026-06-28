'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, LayoutGrid, Settings, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produits', label: 'Produits', icon: Package },
  { href: '/admin/commandes', label: 'Commandes', icon: ShoppingBag },
  { href: '/admin/categories', label: 'Catégories', icon: LayoutGrid },
  { href: '/admin/settings', label: 'Paramètres', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-surface-container-lowest border-e border-outline-variant/30 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-outline-variant/30">
        <Link href="/admin" className="font-display-lg text-headline-md italic text-on-surface">
          amine.parfume
        </Link>
        <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">Admin</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 transition-colors duration-300 ${
                isActive
                  ? 'bg-surface-container text-on-surface border-s-2 border-primary'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <Icon size={20} />
              <span className="font-body-md text-body-md">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-outline-variant/30">
        <Link
          href="/"
          className="flex items-center gap-3 text-on-surface-variant hover:text-on-surface transition-colors duration-300"
        >
          <LogOut size={20} />
          <span className="font-body-md text-body-md">Retour au site</span>
        </Link>
      </div>
    </aside>
  )
}
