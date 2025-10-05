import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixImageUrls() {
  console.log('Fetching all files from products storage bucket...')

  // List all files in the products bucket
  const { data: files, error: listError } = await supabase.storage
    .from('products')
    .list()

  if (listError) {
    console.error('Error listing files:', listError)
    return
  }

  console.log(`Found ${files?.length || 0} files in storage`)

  // Create a map of product IDs to file names
  const fileMap = new Map<number, string>()
  files?.forEach(file => {
    const match = file.name.match(/^(\d{3})_/)
    if (match) {
      const id = parseInt(match[1], 10)
      fileMap.set(id, file.name)
    }
  })

  console.log(`\nMapped ${fileMap.size} products to files\n`)

  // Get all products from database
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, image_url')

  if (productsError) {
    console.error('Error fetching products:', productsError)
    return
  }

  let updatedCount = 0
  let errorCount = 0

  for (const product of products || []) {
    const fileName = fileMap.get(product.id)

    if (!fileName) {
      console.log(`⚠️  No file found for product ${product.id}: ${product.name}`)
      continue
    }

    const correctUrl = `${supabaseUrl}/storage/v1/object/public/products/${fileName}`

    // Check if URL needs updating
    if (product.image_url !== correctUrl) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: correctUrl })
        .eq('id', product.id)

      if (updateError) {
        console.error(`✗ Error updating product ${product.id}:`, updateError.message)
        errorCount++
      } else {
        console.log(`✓ Updated product ${product.id}: ${product.name}`)
        console.log(`  Old: ${product.image_url}`)
        console.log(`  New: ${correctUrl}`)
        updatedCount++
      }
    } else {
      console.log(`✓ Product ${product.id} already has correct URL`)
    }
  }

  console.log(`\n✅ Complete! Updated ${updatedCount} products, ${errorCount} errors`)
}

fixImageUrls().catch(console.error)
