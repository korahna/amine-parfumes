'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell, Wallet, ShoppingBag, Package, ArrowRight, User } from 'lucide-react'

interface Order {
  id: string
  customer_name: string
  total: number
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, pending: 0, products: 0 })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [newOrderAlert, setNewOrderAlert] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const fetchData = async () => {
      const { data: orders } = await supabase
        .from('orders')
        .select('id, customer_name, total, status, created_at')
        .order('created_at', { ascending: false })

      if (orders) {
        const revenue = orders.reduce((sum, o) => sum + Number(o.total), 0)
        const pending = orders.filter((o) => o.status === 'pending').length
        setStats((prev) => ({ ...prev, revenue, orders: orders.length, pending }))
        setRecentOrders(orders.slice(0, 5))
      }

      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      setStats((prev) => ({ ...prev, products: count ?? 0 }))
      setLoading(false)
    }
    fetchData()

    const channel = supabase
      .channel('dashboard_orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        const newOrder = payload.new as Order
        setRecentOrders((prev) => [newOrder, ...prev].slice(0, 5))
        setStats((prev) => ({
          ...prev,
          orders: prev.orders + 1,
          pending: prev.pending + 1,
          revenue: prev.revenue + Number(newOrder.total),
        }))
        setNewOrderAlert(`Nouvelle commande de ${newOrder.customer_name} — ${Number(newOrder.total).toLocaleString('fr-MA')} MAD`)
        setTimeout(() => setNewOrderAlert(null), 5000)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const statusStyles: Record<string, React.CSSProperties> = {
    pending:   { background: 'rgba(201,162,39,0.1)', color: '#c9a227', border: '1px solid rgba(201,162,39,0.2)' },
    confirmed: { background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' },
    shipped:   { background: 'rgba(168,85,247,0.1)', color: '#a78bfa', border: '1px solid rgba(168,85,247,0.2)' },
    delivered: { background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' },
    cancelled: { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' },
  }

  const statusLabels: Record<string, string> = {
    pending: 'En attente', confirmed: 'Confirmée', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée',
  }

  const card: React.CSSProperties = { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '1.5rem' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Alert */}
      {newOrderAlert && (
        <div style={{ background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 'var(--r-md)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Bell size={20} style={{ color: 'var(--gold-400)' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--gold-400)' }}>{newOrderAlert}</span>
        </div>
      )}

      {/* Header */}
      <section>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--fg-primary)' }}>Overview</h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-muted)' }}>Aperçu de votre boutique</p>
      </section>

      {/* Stats */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg-muted)', marginBottom: '0.75rem' }}>
            <Wallet size={18} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Revenue</span>
          </div>
          {loading ? <div style={{ height: 32, width: 128, background: 'var(--bg-raised)', borderRadius: 4 }} /> : (
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--gold-400)' }}>{stats.revenue.toLocaleString('fr-MA')} MAD</div>
          )}
        </div>
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg-muted)', marginBottom: '0.75rem' }}>
            <ShoppingBag size={18} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Commandes</span>
          </div>
          {loading ? <div style={{ height: 32, width: 64, background: 'var(--bg-raised)', borderRadius: 4 }} /> : (
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--gold-400)' }}>{stats.orders}</div>
          )}
          {!loading && stats.pending > 0 && (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--fg-muted)', marginTop: 4 }}>{stats.pending} en attente</div>
          )}
        </div>
        <div style={{ ...card, gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg-muted)', marginBottom: '0.5rem' }}>
                <Package size={18} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Produits en catalogue</span>
              </div>
              {loading ? <div style={{ height: 32, width: 64, background: 'var(--bg-raised)', borderRadius: 4 }} /> : (
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--fg-primary)' }}>{stats.products}</div>
              )}
            </div>
            <Link href="/admin/produits" style={{ color: 'var(--gold-400)', opacity: 0.5 }} className="hover:opacity-80 transition-opacity">
              <ArrowRight size={28} />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Orders */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--fg-primary)' }}>Commandes récentes</h3>
          <Link href="/admin/commandes" style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-400)', textDecoration: 'none' }} className="hover:opacity-70 transition-opacity">
            VOIR TOUT
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {loading ? (
            [0, 1, 2].map((i) => (
              <div key={i} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-raised)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ height: 16, width: 80, background: 'var(--bg-raised)', borderRadius: 4 }} />
                    <div style={{ height: 12, width: 64, background: 'var(--bg-raised)', borderRadius: 4 }} />
                  </div>
                </div>
              </div>
            ))
          ) : recentOrders.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-muted)', padding: '1rem 0' }}>Aucune commande pour le moment.</p>
          ) : (
            recentOrders.map((order) => (
              <Link key={order.id} href="/admin/commandes" style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.15s' }} className="hover:border-[var(--border-mid)]">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-subtle)' }}>
                    <User size={20} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-primary)' }}>{order.customer_name}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--fg-subtle)' }}>
                      {new Date(order.created_at).toLocaleDateString('fr-MA', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-primary)' }}>{Number(order.total).toLocaleString('fr-MA')} MAD</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '2px 8px', borderRadius: 100, ...statusStyles[order.status] }}>
                    {statusLabels[order.status] ?? order.status}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
