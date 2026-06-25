import { createClient } from './server'

export async function cacheRemoteImage(imageUrl: string, fileName: string) {
  const supabase = createClient()
  const blob = await fetch(imageUrl).then((r) => r.blob())

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(`products/${fileName}.jpg`, blob, {
      contentType: 'image/jpeg',
      upsert: true,
    })

  if (error) throw error

  const {
    data: { publicUrl },
  } = supabase.storage.from('product-images').getPublicUrl(data.path)

  return publicUrl
}
