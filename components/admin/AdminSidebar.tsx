'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, LayoutGrid, Home, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/accueil', label: 'Accueil', icon: Home },
  { href: '/admin/produits', label: 'Produits', icon: Package },
  { href: '/admin/commandes', label: 'Commandes', icon: ShoppingBag },
  { href: '/admin/categories', label: 'Catégories', icon: LayoutGrid },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 min-h-screen flex flex-col" style={{ background: 'var(--bg-surface)', borderRight: '1px solid var(--border)' }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <Link href="/admin" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontStyle: 'italic', color: 'var(--fg-primary)', textDecoration: 'none' }}>
          amine.parfume
        </Link>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-subtle)', marginTop: 4 }}>Admin</p>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1rem 0' }}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className="sidebar-item"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 1.5rem',
                fontFamily: 'var(--font-body)', fontSize: '0.82rem',
                color: isActive ? 'var(--gold-400)' : 'var(--fg-muted)',
                textDecoration: 'none',
                borderLeft: isActive ? '2px solid var(--gold-400)' : '2px solid transparent',
                background: isActive ? 'rgba(201,162,39,0.08)' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)' }}>
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--fg-muted)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: '0.82rem', transition: 'color 0.15s' }}
        >
          <LogOut size={18} />
          <span>Retour au site</span>
        </Link>
      </div>
    </aside>
  )
}
