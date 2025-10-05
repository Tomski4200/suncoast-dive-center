import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface InventoryProduct {
  ID: number
  Price: string
  MSRP: string
  Product: string
}

async function populatePrices() {
  console.log('Reading inventory.json...')

  const inventoryPath = path.join(process.cwd(), 'inventory.json')
  const inventoryData: InventoryProduct[] = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8'))

  console.log(`Found ${inventoryData.length} products in inventory.json`)

  // First, check if msrp column exists
  const { data: sample, error: sampleError } = await supabase
    .from('products')
    .select('*')
    .limit(1)

  if (sampleError) {
    console.error('Error fetching sample:', sampleError)
    return
  }

  const hasMsrp = sample && sample[0] && 'msrp' in sample[0]
  console.log(`Database ${hasMsrp ? 'has' : 'does not have'} msrp column`)

  let successCount = 0
  let errorCount = 0

  for (const product of inventoryData) {
    // Parse price strings to numbers
    const price = product.Price ? parseFloat(product.Price.replace(/[$,]/g, '')) : null
    const msrp = product.MSRP ? parseFloat(product.MSRP.replace(/[$,]/g, '')) : null

    const updateData: any = {
      price: price
    }

    if (hasMsrp) {
      updateData.msrp = msrp
    }

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', product.ID)

    if (error) {
      console.error(`Error updating product ${product.ID} (${product.Product}):`, error.message)
      errorCount++
    } else {
      console.log(`✓ Updated product ${product.ID}: ${product.Product} - $${price}`)
      successCount++
    }
  }

  console.log(`\nComplete! Updated ${successCount} products, ${errorCount} errors`)
}

populatePrices().catch(console.error)
