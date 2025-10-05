import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixMissingWebp() {
  // Special handling for the two that were already uploaded as webp
  const specialCases = [
    { id: 9, filename: '009_50_ft_Hookah_hose.webp' },
    { id: 44, filename: '044_ZEAGLE_Womens_B.C..webp' }
  ]

  for (const { id, filename } of specialCases) {
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filename)

    // Update the product record
    const { error } = await supabase
      .from('products')
      .update({ image_url: publicUrl })
      .eq('id', id)

    if (!error) {
      console.log(`✓ Fixed product ${id} with webp image`)
    } else {
      console.error(`Error updating product ${id}:`, error)
    }
  }
}

fixMissingWebp().catch(console.error)