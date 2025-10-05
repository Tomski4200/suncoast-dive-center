import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runSchema() {
  console.log('Creating products table and policies...')
  
  const queries = [
    // Create products table
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price DECIMAL(10, 2),
      category TEXT,
      brand TEXT,
      in_stock BOOLEAN DEFAULT true,
      image_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Create indexes
    `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`,
    `CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand)`,
    
    // Enable RLS
    `ALTER TABLE products ENABLE ROW LEVEL SECURITY`,
    
    // Create policies
    `CREATE POLICY IF NOT EXISTS "Public products are viewable by everyone" 
      ON products FOR SELECT 
      USING (true)`,
    
    `CREATE POLICY IF NOT EXISTS "Authenticated users can update products" 
      ON products FOR ALL 
      USING (auth.role() = 'authenticated')`
  ]
  
  for (const query of queries) {
    const { error } = await supabase.rpc('exec_sql', { query })
    
    if (error) {
      // Try direct approach if exec_sql doesn't exist
      console.log('Note: Direct SQL execution not available via client, trying alternative...')
      break
    }
  }
  
  // Test if table was created by trying to query it
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(1)
  
  if (error && error.message.includes('relation "public.products" does not exist')) {
    console.log('\n⚠️  Table not created yet. Please run the SQL manually in Supabase Dashboard:')
    console.log('1. Go to your Supabase Dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Copy and run the contents of supabase/schema.sql')
  } else if (error) {
    console.log('Error checking table:', error.message)
  } else {
    console.log('✅ Products table exists and is accessible!')
  }
}

runSchema().catch(console.error)