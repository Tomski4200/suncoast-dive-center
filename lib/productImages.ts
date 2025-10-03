// Client-side only image detection
// No file system access - uses predefined mapping
import { PLACEHOLDER_IMAGE } from './placeholderImage';

// Get the product ID formatted as 3-digit string
function formatProductId(id: number): string {
  return id.toString().padStart(3, '0');
}

// Static list of known images for client-side rendering
const KNOWN_IMAGES: { [key: number]: string[] } = {
  1: ['/products/001_2025_Suncoast_Dive_Center_SPF50_Shirts.jpeg'],
  2: ['/products/002_OPENWATER_GEAR_PACKAGE.jpg'],
  3: ['/products/003_Seac_Talent.jpg'],
  4: ['/products/004_H2O_Odyssey_D7_NOVA_2600_Lumens.jpg'],
  5: ['/products/005_Hollis_metal_pressure_gauge.jpg'],
  6: ['/products/006_Oceanic_2_gauge_console.jpg'],
  7: ['/products/007_Bare_53_hooded_vest.jpg'],
  8: ['/products/008_BARE_ECLIPS_HOODED_RASH_GAURD.jpg'],
  9: ['/products/009_50_ft_Hookah_hose.jpg'],
  10: ['/products/010_Lobster_bag_with_molded_handle.jpg'],
  11: ['/products/011_Green_lobster_snare.jpg'],
  12: ['/products/012_New_SUNTO_OCEAN_with_and_without_tank_pod.jpg'],
  13: ['/products/013_New_Atomic_B2X.jpg'],
  14: ['/products/014_Oceanic_slim_octo.jpg'],
  15: ['/products/015_Shearwater_Tern.png'],
  16: ['/products/016_Seac_Kobra_TOP_AND_BOTTOM.jpg'],
  17: ['/products/017_Oceanic_Iphone_housing_with_pro_max_upgrade_kit.jpg'],
  18: ['/products/018_Lobster_50_ft_long_hose_rig.jpg'],
  19: ['/products/019_Lobster_gauge.jpg'],
  20: ['/products/020_gear_bag__lobster_bag.jpg'],
  21: ['/products/021_Oceanic_V_iper_2.jpg'],
  22: ['/products/022_Fourth_Element_hydro_skin.jpg'],
  23: ['/products/023_Atomic_b2_colorkit.jpg'],
  24: ['/products/024_Shearwater_SWIFT_transmitter.jpg'],
  25: ['/products/025_Hollis_thigh_pocket.jpg'],
  26: ['/products/026_CURACAO_CLIPPER_CURACAO_CLIPPER_BLUE.jpg'],
  27: ['/products/027_Oceanic_Preadator.jpg'],
  28: ['/products/028_Atomic_weight_pocket.png'],
  29: ['/products/029_Oceanic_weight_pockets_Qlr4.jpg'],
  30: ['/products/030_resort_package_with_optional_computer.png'],
  31: ['/products/031_Professional_scuba_package.jpg'],
  32: ['/products/032_Atomic_M1.jpg'],
  33: ['/products/033_Seac_sting_65.jpg'],
  34: ['/products/034_Seac_Fire.jpg'],
  35: ['/products/035_Amara_comfort_glove.jpg'],
  36: ['/products/036_RASH_GUARD.jpg'],
  37: ['/products/037_Yoke_to_Din.jpg'],
  38: ['/products/038_Full_size_stainless_knife.png'],
  39: ['/products/039_Stilleto_spearfishing_knife.png'],
  40: ['/products/040_SEAC_3MM_wetsuit.jpg'],
  41: ['/products/041_used_gear.jpg'],
  42: ['/products/042_same_day_delivery.png'],
  43: ['/products/043_Scuba_Max_RG_201T.png'],
  44: ['/products/044_ZEAGLE_Womens_B.C..png'],
  45: ['/products/045_Atomic_B2_regulator.jpg'],
  46: ['/products/046_Oceanic_VEO_4.0_wrist_computer.png'],
  47: ['/products/047_Atomic_ST1.png'],
  48: ['/products/048_Oceanic_4.0_with_compass.jpg'],
  49: ['/products/049_Atomic_SS1_Octo.png'],
  50: ['/products/050_Oceanic_PRO_PPLUS_4.0.jpg'],
  51: ['/products/051_Oceanic_Alpha_8_regulator.jpg'],
  52: ['/products/052_Dive_Flag_20X24.png'],
  53: ['/products/053_Sunto_D5_wrist_computer.png'],
  54: ['/products/054_Oceanic_Delta_5.jpg'],
  55: ['/products/055_Atomic_Z3.png'],
  56: ['/products/056_Scuba_max_octo.png'],
  57: ['/products/057_Scuba_Maxadulty_shortie_2mm.jpg'],
  58: ['/products/058_retractor.png'],
  59: ['/products/059_Oceanic_Excursion.jpg'],
  60: ['/products/060_150_foot_dive_reel.png']
};

// Get product image for client-side rendering
export function getStaticProductImage(productId: number): string {
  // First try the known images mapping
  const images = KNOWN_IMAGES[productId];
  if (images && images[0]) {
    return images[0];
  }
  
  // Fallback: try to construct the expected filename
  // This allows for images beyond ID 60 to work if they follow the naming convention
  const formattedId = formatProductId(productId);
  
  // Try common extensions in order of preference
  const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
  
  // Return the most likely path - browser will try to load it
  // If it fails, the onError handler in the Image component will use placeholder
  return `/products/${formattedId}_product${extensions[0]}`;
}

// Get all images for client-side rendering
export function getStaticProductImages(productId: number): string[] {
  return KNOWN_IMAGES[productId] || [getStaticProductImage(productId)];
}

// Export these for backward compatibility
export const getProductImage = getStaticProductImage;
export const getProductImages = getStaticProductImages;