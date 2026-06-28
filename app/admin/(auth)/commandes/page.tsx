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

const statusStyles: Record<string, string> = {
  pending: 'bg-primary/10 text-primary border-primary/20',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

const nextStatus: Record<string, string> = {
  pending: 'confirmed',
  confirmed: 'shipped',
  shipped: 'delivered',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const fetchOrders = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      setOrders(data ?? [])
      setLoading(false)
    }
    fetchOrders()

    // Realtime subscription for order changes
    const channel = supabase
      .channel('orders_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setOrders((prev) => [payload.new as Order, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setOrders((prev) =>
            prev.map((o) => (o.id === (payload.new as Order).id ? (payload.new as Order) : o))
          )
        } else if (payload.eventType === 'DELETE') {
          setOrders((prev) => prev.filter((o) => o.id !== (payload.old as { id: string }).id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const updateStatus = async (orderId: string, newStatus: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    }
  }

  const filtered = filter ? orders.filter((o) => o.status === filter) : orders

  return (
    <div className="flex flex-col gap-stack-lg">
      <section className="flex flex-col gap-stack-sm">
        <h2 className="font-headline-md text-headline-md text-on-surface">Commandes</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {orders.length} commande{orders.length !== 1 ? 's' : ''} au total
        </p>
      </section>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 font-label-caps text-label-caps">
        {[null, 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status ?? 'all'}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 border rounded-full transition-colors duration-300 ${
              filter === status
                ? 'border-primary text-primary bg-primary/10'
                : 'border-on-surface-variant/30 text-on-surface-variant hover:border-primary'
            }`}
          >
            {status === null ? 'Toutes' : statusLabels[status]}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container-low p-6 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-5 w-32 skeleton rounded" />
                  <div className="h-4 w-48 skeleton rounded" />
                  <div className="h-3 w-24 skeleton rounded" />
                </div>
                <div className="h-6 w-20 skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-on-surface-variant font-body-md text-body-md py-8 text-center">
          Aucune commande trouvée.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="bg-surface-container-low p-6 rounded-lg">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-body-lg text-body-lg text-on-surface">{order.customer_name}</h3>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded border ${statusStyles[order.status] ?? ''}`}>
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant">{order.customer_phone}</p>
                  <p className="text-sm text-on-surface-variant">{order.address}, {order.city}, {order.wilaya}</p>
                  <p className="text-sm text-on-surface-variant mt-1">
                    {new Date(order.created_at).toLocaleDateString('fr-MA', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className="font-headline-md text-headline-md text-primary">
                    {Number(order.total).toLocaleString('fr-MA')} MAD
                  </span>
                  {nextStatus[order.status] && (
                    <button
                      onClick={() => updateStatus(order.id, nextStatus[order.status])}
                      className="font-label-caps text-label-caps text-primary border border-primary px-4 py-2 hover:bg-primary/10 transition-colors duration-300"
                    >
                      {nextStatus[order.status] === 'confirmed' ? 'Confirmer' :
                       nextStatus[order.status] === 'shipped' ? 'Expédier' : 'Marquer livrée'}
                    </button>
                  )}
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(order.id, 'cancelled')}
                      className="font-label-caps text-label-caps text-on-surface-variant hover:text-red-400 transition-colors"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>

              {/* Order items */}
              <div className="mt-4 pt-4 border-t border-outline-variant/30">
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Articles</p>
                <div className="space-y-1">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-on-surface-variant">
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
