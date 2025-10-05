import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkSchema() {
  console.log('Fetching sample product to see schema...')

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(20)

  if (error) {
    console.error('Error:', error)
    return
  }

  if (data && data.length > 0) {
    console.log('\nSample product data (first 5):')
    data.forEach((product, i) => {
      console.log(`\nProduct ${i + 1} (ID: ${product.id}):`)
      console.log(`  Name: ${product.name}`)
      console.log(`  Price: ${product.price}`)
      console.log(`  Brand: ${product.brand}`)
      console.log(`  Category: ${product.category}`)
    })

    console.log('\nAll column names:')
    console.log(Object.keys(data[0]))

    console.log('\nChecking for products WITH price:')
    const withPrice = data.filter(p => p.price !== null)
    console.log(`Found ${withPrice.length} products with price out of ${data.length}`)
    if (withPrice.length > 0) {
      console.log('Example:', withPrice[0])
    }
  } else {
    console.log('No products found')
  }
}

checkSchema().catch(console.error)
