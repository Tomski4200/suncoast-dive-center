import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkImageCoverage() {
  console.log('Fetching all products...')

  const { data, error } = await supabase
    .from('products')
    .select('id, name, image_url, price')

  if (error) {
    console.error('Error:', error)
    return
  }

  if (!data) {
    console.log('No products found')
    return
  }

  const totalProducts = data.length
  const withImages = data.filter(p => p.image_url !== null)
  const withoutImages = data.filter(p => p.image_url === null)
  const withPrice = data.filter(p => p.price !== null)
  const withoutPrice = data.filter(p => p.price === null)

  console.log(`\n=== Product Image Coverage ===`)
  console.log(`Total products: ${totalProducts}`)
  console.log(`Products with images: ${withImages.length}`)
  console.log(`Products without images: ${withoutImages.length}`)
  console.log(`\nProducts with price: ${withPrice.length}`)
  console.log(`Products without price: ${withoutPrice.length}`)

  if (withoutImages.length > 0) {
    console.log(`\n=== Products Missing Images ===`)
    withoutImages.forEach(p => {
      console.log(`ID ${p.id}: ${p.name}`)
    })
  }

  if (withoutPrice.length > 0) {
    console.log(`\n=== Products Missing Price ===`)
    withoutPrice.forEach(p => {
      console.log(`ID ${p.id}: ${p.name}`)
    })
  }
}

checkImageCoverage().catch(console.error)
