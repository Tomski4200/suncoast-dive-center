import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Product data mapping (same as before)
const productData: Record<number, string> = {
  1: '001_2025_Suncoast_Dive_Center_SPF50_Shirts.webp',
  2: '002_OPENWATER_GEAR_PACKAGE.webp',
  3: '003_Seac_Talent.webp',
  4: '004_H2O_Odyssey_D7_NOVA_2600_Lumens.webp',
  5: '005_Hollis_metal_pressure_gauge.webp',
  6: '006_Oceanic_2_gauge_console.webp',
  7: '007_Bare_53_hooded_vest.webp',
  8: '008_BARE_ECLIPS_HOODED_RASH_GAURD.webp',
  9: '009_50_ft_Hookah_hose.webp',
  10: '010_Lobster_bag_with_molded_handle.webp',
  11: '011_Green_lobster_snare.webp',
  12: '012_New_SUNTO_OCEAN_with_and_without_tank_pod.webp',
  13: '013_New_Atomic_B2X.webp',
  14: '014_Oceanic_slim_octo.webp',
  15: '015_Shearwater_Tern.webp',
  16: '016_Seac_Kobra_TOP_AND_BOTTOM.webp',
  17: '017_Oceanic_Iphone_housing_with_pro_max_upgrade_kit.webp',
  18: '018_Lobster_50_ft_long_hose_rig.webp',
  19: '019_Lobster_gauge.webp',
  20: '020_gear_bag__lobster_bag.webp',
  21: '021_Oceanic_V_iper_2.webp',
  22: '022_Fourth_Element_hydro_skin.webp',
  23: '023_Atomic_b2_colorkit.webp',
  24: '024_Shearwater_SWIFT_transmitter.webp',
  25: '025_Hollis_thigh_pocket.webp',
  26: '026_CURACAO_CLIPPER_CURACAO_CLIPPER_BLUE.webp',
  27: '027_Oceanic_Preadator.webp',
  28: '028_Atomic_weight_pocket.webp',
  29: '029_Oceanic_weight_pockets_Qlr4.webp',
  30: '030_resort_package_with_optional_computer.webp',
  31: '031_Professional_scuba_package.webp',
  32: '032_Atomic_M1.webp',
  33: '033_Seac_sting_65.webp',
  34: '034_Seac_Fire.webp',
  35: '035_Amara_comfort_glove.webp',
  36: '036_RASH_GUARD.webp',
  37: '037_Yoke_to_Din.webp',
  38: '038_Full_size_stainless_knife.webp',
  39: '039_Stilleto_spearfishing_knife.webp',
  40: '040_SEAC_3MM_wetsuit.webp',
  41: '041_used_gear.webp',
  42: '042_same_day_delivery.webp',
  43: '043_Scuba_Max_RG_201T.webp',
  44: '044_ZEAGLE_Womens_B.C..webp',
  45: '045_Atomic_B2_regulator.webp',
  46: '046_Oceanic_VEO_4.0_wrist_computer.webp',
  47: '047_Atomic_ST1.webp',
  48: '048_Oceanic_4.0_with_compass.webp',
  49: '049_Atomic_SS1_Octo.webp',
  50: '050_Oceanic_PRO_PPLUS_4.0.webp',
  51: '051_Oceanic_Alpha_8_regulator.webp',
  52: '052_Dive_Flag_20X24.webp',
  53: '053_Sunto_D5_wrist_computer.webp',
  54: '054_Oceanic_Delta_5.webp',
  55: '055_Atomic_Z3.webp',
  56: '056_Scuba_max_octo.webp',
  57: '057_Scuba_Maxadulty_shortie_2mm.webp',
  58: '058_retractor.webp',
  59: '059_Oceanic_Excursion.webp',
  60: '060_150_foot_dive_reel.webp',
  88: '088_Oceanic_Enzo_mask.webp',
  89: '089_Oceanic_Cyanea_mask.webp',
  90: '090_Oceanic_Ultra_Dry_2_snorkel.webp',
  91: '091_Oceanic_Shadow_and_Mini_shadow.webp',
  92: '092_Atomicx_X1_fin.webp',
  93: '093_Oceanic_Alpha_8_octo.webp',
  94: '094_Atomic_venom.webp',
  95: '095_Atomic_SV2_snorkel.webp',
  96: '096_Atomic_splitfins.webp',
}

async function updateToWebp() {
  console.log('Listing files in products bucket...')
  
  // List all files in the bucket to see what's there
  const { data: files, error: listError } = await supabase.storage
    .from('products')
    .list()

  if (listError) {
    console.error('Error listing files:', listError)
    return
  }

  console.log(`Found ${files?.length} files in bucket:`)
  const webpFiles = files?.filter(f => f.name.endsWith('.webp')) || []
  console.log(`${webpFiles.length} are webp files`)

  // Get all products
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .order('id')

  if (fetchError) {
    console.error('Error fetching products:', fetchError)
    return
  }

  console.log(`\nUpdating ${products?.length} products to use webp images...`)

  for (const product of products || []) {
    const webpFileName = productData[product.id]
    
    if (!webpFileName) {
      console.log(`⚠ No webp mapping for product ${product.id}`)
      continue
    }

    // Check if this file exists in the bucket
    const fileExists = webpFiles.some(f => f.name === webpFileName)
    
    if (!fileExists) {
      console.log(`⚠ Webp file not found in bucket: ${webpFileName}`)
      continue
    }

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
      console.log(`✓ Product ${product.id}: ${product.name} → ${webpFileName}`)
    }
  }

  console.log('\nUpdate complete!')
}

updateToWebp().catch(console.error)