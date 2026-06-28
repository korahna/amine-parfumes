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
  const [stats, setStats] = useState({ revenue: 0, orders: 0, pending: 0 })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const [newOrderAlert, setNewOrderAlert] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const fetchData = async () => {
      // Fetch orders
      const { data: orders } = await supabase
        .from('orders')
        .select('id, customer_name, total, status, created_at')
        .order('created_at', { ascending: false })

      if (orders) {
        const revenue = orders.reduce((sum, o) => sum + Number(o.total), 0)
        const pending = orders.filter((o) => o.status === 'pending').length
        setStats({ revenue, orders: orders.length, pending })
        setRecentOrders(orders.slice(0, 5))
      }

      // Fetch product count
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      setStats((prev) => ({ ...prev, products: count ?? 0 } as typeof prev))
      setLoading(false)
    }
    fetchData()

    // Realtime subscription for new orders
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
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        const updated = payload.new as Order
        setRecentOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const statusStyles: Record<string, string> = {
    pending: 'bg-primary/10 text-primary border border-primary/20',
    confirmed: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    shipped: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    delivered: 'bg-green-500/10 text-green-400 border border-green-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
  }

  const statusLabels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
  }

  return (
    <div className="flex flex-col gap-stack-lg">
      {/* New order alert */}
      {newOrderAlert && (
        <div className="bg-primary/10 border border-primary/30 rounded-lg px-6 py-4 flex items-center gap-3 animate-in fade-in duration-300">
          <Bell size={20} className="text-primary" />
          <span className="font-body-md text-body-md text-primary">{newOrderAlert}</span>
        </div>
      )}

      {/* Welcome Section */}
      <section className="flex flex-col gap-stack-sm">
        <h2 className="font-headline-md text-headline-md text-on-surface">Overview</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Aperçu de votre boutique</p>
      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-2 gap-4">
        {/* Revenue Card */}
        <div className="bg-surface-container-low p-6 rounded-lg flex flex-col gap-4">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Wallet size={20} />
            <span className="font-label-caps text-label-caps">Revenue</span>
          </div>
          {loading ? (
            <div className="h-8 w-32 skeleton rounded" />
          ) : (
            <div className="font-headline-md text-headline-md text-primary">
              {stats.revenue.toLocaleString('fr-MA')} MAD
            </div>
          )}
        </div>

        {/* Orders Card */}
        <div className="bg-surface-container-low p-6 rounded-lg flex flex-col gap-4">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <ShoppingBag size={20} />
            <span className="font-label-caps text-label-caps">Commandes</span>
          </div>
          {loading ? (
            <div className="h-8 w-16 skeleton rounded" />
          ) : (
            <div className="font-headline-md text-headline-md text-primary">{stats.orders}</div>
          )}
          {!loading && stats.pending > 0 && (
            <div className="text-sm text-on-surface-variant">
              {stats.pending} en attente
            </div>
          )}
        </div>

        {/* Products Card (Full width) */}
        <div className="bg-surface-container-low p-6 rounded-lg flex flex-col gap-4 col-span-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-surface-container-highest opacity-20 skeleton z-0" />
          <div className="relative z-10 flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Package size={20} />
                <span className="font-label-caps text-label-caps">Produits en catalogue</span>
              </div>
              {loading ? (
                <div className="h-8 w-16 skeleton rounded" />
              ) : (
                <div className="font-headline-md text-headline-md text-on-surface">
                  {(stats as { products?: number }).products ?? 0}
                </div>
              )}
            </div>
            <Link href="/admin/produits" className="text-primary opacity-50 hover:opacity-80 transition-opacity">
              <ArrowRight size={32} />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="flex flex-col gap-stack-md">
        <div className="flex justify-between items-end">
          <h3 className="font-body-lg text-body-lg text-on-surface">Commandes récentes</h3>
          <Link href="/admin/commandes" className="font-label-caps text-label-caps text-primary hover:opacity-70 transition-opacity">
            VOIR TOUT
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {loading ? (
            <>
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-surface-container p-4 flex justify-between items-center rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full skeleton" />
                    <div className="flex flex-col gap-2">
                      <div className="h-4 w-20 skeleton rounded" />
                      <div className="h-3 w-16 skeleton rounded" />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="h-4 w-16 skeleton rounded" />
                    <div className="h-5 w-14 skeleton rounded" />
                  </div>
                </div>
              ))}
            </>
          ) : recentOrders.length === 0 ? (
            <p className="text-on-surface-variant font-body-md text-body-md py-4">Aucune commande pour le moment.</p>
          ) : (
            recentOrders.map((order) => (
              <Link key={order.id} href="/admin/commandes" className="bg-surface-container p-4 flex justify-between items-center rounded-lg hover:bg-surface-container-highest transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container-highest rounded-full flex items-center justify-center text-on-surface-variant">
                    <User size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-md text-body-md text-on-surface">{order.customer_name}</span>
                    <span className="text-sm text-on-surface-variant">
                      {new Date(order.created_at).toLocaleDateString('fr-MA', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-body-md text-body-md text-on-surface">
                    {Number(order.total).toLocaleString('fr-MA')} MAD
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded ${statusStyles[order.status] ?? ''}`}>
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
