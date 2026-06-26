'use server'

import { createClient } from '@/lib/supabase/server'

interface OrderItem {
  productId: string
  name: string
  brand: string
  price: number
  quantity: number
}

interface OrderInput {
  items: OrderItem[]
  customerName: string
  customerPhone: string
  address: string
  city: string
  wilaya: string
  total: number
}

export async function placeOrder(input: OrderInput) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders')
    .insert({
      items: input.items,
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      address: input.address,
      city: input.city,
      wilaya: input.wilaya,
      total: input.total,
      status: 'pending',
      payment_method: 'cod',
    })
    .select('id')
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, orderId: data.id }
}
