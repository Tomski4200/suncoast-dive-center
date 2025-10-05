import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateToWebp() {
  // Get all products
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .order('id')

  if (fetchError) {
    console.error('Error fetching products:', fetchError)
    return
  }

  console.log(`Updating ${products?.length} products to use webp images...`)

  for (const product of products || []) {
    // Create the webp filename based on the product ID and name
    const paddedId = product.id.toString().padStart(3, '0')
    const nameForFile = product.name
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '_')
    
    const webpFileName = `${paddedId}_${nameForFile}.webp`
    
    // Get the public URL for the webp image
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(webpFileName)

    // Update the product record with the webp URL
    const { error: updateError } = await supabase
      .from('products')
      .update({ image_url: publicUrl })
      .eq('id', product.id)

    if (updateError) {
      console.error(`Error updating product ${product.id}:`, updateError)
    } else {
      console.log(`✓ Product ${product.id}: ${product.name} updated to webp`)
    }
  }

  console.log('Update complete!')
}

updateToWebp().catch(console.error)