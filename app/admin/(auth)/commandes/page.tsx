'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Order {
  id: string
  customer_name: string
  customer_phone: string
  address: string
  city: string
  wilaya: string
  items: { productId: string; name: string; brand: string; price: number; quantity: number }[]
  total: number
  status: string
  payment_method: string
  created_at: string
}

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

const nextStatus: Record<string, string> = {
  pending: 'confirmed', confirmed: 'shipped', shipped: 'delivered',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const fetchOrders = async () => {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      setOrders(data ?? [])
      setLoading(false)
    }
    fetchOrders()

    const channel = supabase
      .channel('orders_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.eventType === 'INSERT') setOrders((prev) => [payload.new as Order, ...prev])
        else if (payload.eventType === 'UPDATE') setOrders((prev) => prev.map((o) => (o.id === (payload.new as Order).id ? (payload.new as Order) : o)))
        else if (payload.eventType === 'DELETE') setOrders((prev) => prev.filter((o) => o.id !== (payload.old as { id: string }).id))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const updateStatus = async (orderId: string, newStatus: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    if (!error) setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
  }

  const filtered = filter ? orders.filter((o) => o.status === filter) : orders
  const card: React.CSSProperties = { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '1.5rem' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <section>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--fg-primary)' }}>Commandes</h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-muted)' }}>
          {orders.length} commande{orders.length !== 1 ? 's' : ''} au total
        </p>
      </section>

      {/* Filter tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {[null, 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button key={status ?? 'all'} onClick={() => setFilter(status)}
            style={{
              padding: '0.4rem 1rem', borderRadius: 100, cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              border: filter === status ? '1px solid var(--gold-400)' : '1px solid var(--border)',
              color: filter === status ? 'var(--gold-400)' : 'var(--fg-muted)',
              background: filter === status ? 'rgba(201,162,39,0.1)' : 'transparent',
              transition: 'all 0.15s',
            }}>
            {status === null ? 'Toutes' : statusLabels[status]}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ ...card, height: 100, animation: 'shimmer 2s ease-in-out infinite', backgroundSize: '200% 100%' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-muted)', padding: '2rem 0', textAlign: 'center' }}>Aucune commande trouvée.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((order) => (
            <div key={order.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--fg-primary)' }}>{order.customer_name}</h3>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '2px 8px', borderRadius: 100, ...statusStyles[order.status] }}>
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--fg-muted)' }}>{order.customer_phone}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--fg-muted)' }}>{order.address}, {order.city}, {order.wilaya}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--fg-subtle)', marginTop: 4 }}>
                    {new Date(order.created_at).toLocaleDateString('fr-MA', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--gold-400)' }}>
                    {Number(order.total).toLocaleString('fr-MA')} MAD
                  </span>
                  {nextStatus[order.status] && (
                    <button onClick={() => updateStatus(order.id, nextStatus[order.status])}
                      className="btn-gold" style={{ fontSize: '0.6rem', padding: '0.4rem 1rem' }}>
                      <span>{nextStatus[order.status] === 'confirmed' ? 'Confirmer' : nextStatus[order.status] === 'shipped' ? 'Expédier' : 'Marquer livrée'}</span>
                    </button>
                  )}
                  {order.status === 'pending' && (
                    <button onClick={() => updateStatus(order.id, 'cancelled')}
                      style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' }}
                      className="hover:text-red-400">
                      Annuler
                    </button>
                  )}
                </div>
              </div>

              {/* Items */}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBottom: 8 }}>Articles</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {order.items?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--fg-muted)' }}>
                      <span>{item.name} × {item.quantity}</span>
                      <span>{(item.price * item.quantity).toLocaleString('fr-MA')} MAD</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
