import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const productData: Record<number, { name: string; category: string; brand?: string; price?: number }> = {
  1: { name: '2025 Suncoast Dive Center SPF50 Shirts', category: 'Apparel' },
  2: { name: 'Openwater Gear Package', category: 'Packages' },
  3: { name: 'Seac Talent', category: 'Fins', brand: 'Seac' },
  4: { name: 'H2O Odyssey D7 NOVA 2600 Lumens', category: 'Lights', brand: 'H2O Odyssey' },
  5: { name: 'Hollis Metal Pressure Gauge', category: 'Gauges', brand: 'Hollis' },
  6: { name: 'Oceanic 2 Gauge Console', category: 'Gauges', brand: 'Oceanic' },
  7: { name: 'Bare 5/3 Hooded Vest', category: 'Wetsuits', brand: 'Bare' },
  8: { name: 'Bare Eclips Hooded Rash Guard', category: 'Apparel', brand: 'Bare' },
  9: { name: '50 ft Hookah Hose', category: 'Accessories' },
  10: { name: 'Lobster Bag with Molded Handle', category: 'Bags' },
  11: { name: 'Green Lobster Snare', category: 'Accessories' },
  12: { name: 'Suunto Ocean with/without Tank Pod', category: 'Computers', brand: 'Suunto' },
  13: { name: 'Atomic B2X', category: 'Regulators', brand: 'Atomic' },
  14: { name: 'Oceanic Slim Octo', category: 'Regulators', brand: 'Oceanic' },
  15: { name: 'Shearwater Tern', category: 'Computers', brand: 'Shearwater' },
  16: { name: 'Seac Kobra Top and Bottom', category: 'Wetsuits', brand: 'Seac' },
  17: { name: 'Oceanic iPhone Housing with Pro Max Upgrade Kit', category: 'Accessories', brand: 'Oceanic' },
  18: { name: 'Lobster 50 ft Long Hose Rig', category: 'Accessories' },
  19: { name: 'Lobster Gauge', category: 'Gauges' },
  20: { name: 'Gear Bag / Lobster Bag', category: 'Bags' },
  21: { name: 'Oceanic Viper 2', category: 'Fins', brand: 'Oceanic' },
  22: { name: 'Fourth Element Hydro Skin', category: 'Wetsuits', brand: 'Fourth Element' },
  23: { name: 'Atomic B2 Color Kit', category: 'Regulators', brand: 'Atomic' },
  24: { name: 'Shearwater SWIFT Transmitter', category: 'Accessories', brand: 'Shearwater' },
  25: { name: 'Hollis Thigh Pocket', category: 'Accessories', brand: 'Hollis' },
  26: { name: 'Curacao Clipper Blue', category: 'Accessories' },
  27: { name: 'Oceanic Predator', category: 'BCDs', brand: 'Oceanic' },
  28: { name: 'Atomic Weight Pocket', category: 'Accessories', brand: 'Atomic' },
  29: { name: 'Oceanic Weight Pockets QLR4', category: 'Accessories', brand: 'Oceanic' },
  30: { name: 'Resort Package with Optional Computer', category: 'Packages' },
  31: { name: 'Professional Scuba Package', category: 'Packages' },
  32: { name: 'Atomic M1', category: 'Regulators', brand: 'Atomic' },
  33: { name: 'Seac Sting 65', category: 'Spearguns', brand: 'Seac' },
  34: { name: 'Seac Fire', category: 'Fins', brand: 'Seac' },
  35: { name: 'Amara Comfort Glove', category: 'Gloves' },
  36: { name: 'Rash Guard', category: 'Apparel' },
  37: { name: 'Yoke to DIN Adapter', category: 'Accessories' },
  38: { name: 'Full Size Stainless Knife', category: 'Knives' },
  39: { name: 'Stilleto Spearfishing Knife', category: 'Knives' },
  40: { name: 'SEAC 3MM Wetsuit', category: 'Wetsuits', brand: 'Seac' },
  41: { name: 'Used Gear', category: 'Used' },
  42: { name: 'Same Day Delivery', category: 'Services' },
  43: { name: 'Scuba Max RG 201T', category: 'Regulators', brand: 'Scuba Max' },
  44: { name: "Zeagle Women's BC", category: 'BCDs', brand: 'Zeagle' },
  45: { name: 'Atomic B2 Regulator', category: 'Regulators', brand: 'Atomic' },
  46: { name: 'Oceanic VEO 4.0 Wrist Computer', category: 'Computers', brand: 'Oceanic' },
  47: { name: 'Atomic ST1', category: 'Regulators', brand: 'Atomic' },
  48: { name: 'Oceanic 4.0 with Compass', category: 'Computers', brand: 'Oceanic' },
  49: { name: 'Atomic SS1 Octo', category: 'Regulators', brand: 'Atomic' },
  50: { name: 'Oceanic PRO PLUS 4.0', category: 'Computers', brand: 'Oceanic' },
  51: { name: 'Oceanic Alpha 8 Regulator', category: 'Regulators', brand: 'Oceanic' },
  52: { name: 'Dive Flag 20x24', category: 'Accessories' },
  53: { name: 'Suunto D5 Wrist Computer', category: 'Computers', brand: 'Suunto' },
  54: { name: 'Oceanic Delta 5', category: 'Regulators', brand: 'Oceanic' },
  55: { name: 'Atomic Z3', category: 'Regulators', brand: 'Atomic' },
  56: { name: 'Scuba Max Octo', category: 'Regulators', brand: 'Scuba Max' },
  57: { name: 'Scuba Max Adult Shortie 2mm', category: 'Wetsuits', brand: 'Scuba Max' },
  58: { name: 'Retractor', category: 'Accessories' },
  59: { name: 'Oceanic Excursion', category: 'BCDs', brand: 'Oceanic' },
  60: { name: '150 Foot Dive Reel', category: 'Accessories' },
  88: { name: 'Oceanic Enzo Mask', category: 'Masks', brand: 'Oceanic' },
  89: { name: 'Oceanic Cyanea Mask', category: 'Masks', brand: 'Oceanic' },
  90: { name: 'Oceanic Ultra Dry 2 Snorkel', category: 'Snorkels', brand: 'Oceanic' },
  91: { name: 'Oceanic Shadow and Mini Shadow', category: 'Masks', brand: 'Oceanic' },
  92: { name: 'Atomic X1 Fin', category: 'Fins', brand: 'Atomic' },
  93: { name: 'Oceanic Alpha 8 Octo', category: 'Regulators', brand: 'Oceanic' },
  94: { name: 'Atomic Venom', category: 'Masks', brand: 'Atomic' },
  95: { name: 'Atomic SV2 Snorkel', category: 'Snorkels', brand: 'Atomic' },
  96: { name: 'Atomic Split Fins', category: 'Fins', brand: 'Atomic' },
}

async function uploadImageAndCreateProduct(id: number, imagePath: string) {
  try {
    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath)
    const fileName = path.basename(imagePath)
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, imageBuffer, {
        contentType: imagePath.endsWith('.png') ? 'image/png' : 
                     imagePath.endsWith('.webp') ? 'image/webp' : 'image/jpeg',
        upsert: true
      })

    if (uploadError) {
      console.error(`Error uploading ${fileName}:`, uploadError)
      return
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(fileName)

    // Insert product record
    const productInfo = productData[id]
    if (!productInfo) {
      console.log(`No product data for ID ${id}, skipping database insert`)
      return
    }

    const { error: insertError } = await supabase
      .from('products')
      .upsert({
        id,
        name: productInfo.name,
        category: productInfo.category,
        brand: productInfo.brand || null,
        price: productInfo.price || null,
        image_url: publicUrl,
        in_stock: true
      })

    if (insertError) {
      console.error(`Error inserting product ${id}:`, insertError)
    } else {
      console.log(`✓ Product ${id}: ${productInfo.name} uploaded and created`)
    }
  } catch (error) {
    console.error(`Error processing product ${id}:`, error)
  }
}

async function setupProducts() {
  const productsDir = path.join(process.cwd(), 'public', 'products')
  
  // Get all image files (excluding webp folder and placeholders)
  const files = fs.readdirSync(productsDir)
    .filter(file => {
      return !file.includes('placeholder') && 
             !file.includes('New folder') &&
             (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'))
    })
    .sort()

  console.log(`Found ${files.length} product images to process`)

  for (const file of files) {
    const match = file.match(/^(\d{3})_/)
    if (match) {
      const id = parseInt(match[1], 10)
      const imagePath = path.join(productsDir, file)
      await uploadImageAndCreateProduct(id, imagePath)
    }
  }

  console.log('Product setup complete!')
}

// Run the setup
setupProducts().catch(console.error)