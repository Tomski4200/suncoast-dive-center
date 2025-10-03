import json
from pathlib import Path
import re

def sanitize_filename(filename):
    """Remove invalid characters from filename"""
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    if len(filename) > 200:
        filename = filename[:200]
    return filename

def update_image_urls_to_local():
    """
    Update imageUrl in products_merged_4.json to point to local downloaded images
    Creates a new file: products_with_local_images.json
    """
    base_dir = Path(__file__).parent / "products"
    input_file = base_dir / "products_merged_4.json"
    output_file = base_dir / "products_with_local_images.json"
    images_dir = Path("c:/python/suncoast/public/products")
    
    print(f"Reading from: {input_file.name}")
    print(f"Will save to: {output_file.name}")
    print(f"Images directory: {images_dir}\n")
    
    # Load the products
    with open(input_file, 'r', encoding='utf-8') as f:
        products = json.load(f)
    print(f"Loaded {len(products)} products")
    
    # Track statistics
    updated = 0
    not_found = 0
    no_url = 0
    
    print("\nUpdating image URLs...")
    print("="*70)
    
    for product in products:
        product_id = product['id']
        product_name = product.get('product', product.get('name', ''))
        old_url = product.get('imageUrl', '')
        
        # Skip if no image URL
        if not old_url:
            print(f"Product {product_id}: No image URL - SKIPPED")
            no_url += 1
            continue
        
        # Construct the expected filename based on product ID and name
        # Match the format used in download script: 001_ProductName.ext
        
        # Get the extension from the original URL
        parsed_url = old_url.lower()
        if '.jpeg' in parsed_url or '.jpg' in parsed_url:
            extension = '.jpg'
        elif '.png' in parsed_url:
            extension = '.png'
        elif '.webp' in parsed_url:
            extension = '.webp'
        else:
            extension = '.jpg'  # default
        
        # Create filename - same logic as download script
        safe_product_name = sanitize_filename(product_name)[:50]
        safe_product_name = safe_product_name.replace(' ', '_')
        filename = f"{product_id:03d}_{safe_product_name}{extension}"
        
        # Check if file exists
        local_file_path = images_dir / filename
        
        if local_file_path.exists():
            # Update to relative path format: public\products\filename
            new_url = f"public\\products\\{filename}"
            product['imageUrl'] = new_url
            print(f"Product {product_id}: {filename} - UPDATED")
            updated += 1
        else:
            print(f"Product {product_id}: {filename} - FILE NOT FOUND")
            not_found += 1
    
    # Save the updated products to new file
    print(f"\n{'='*70}")
    print("Saving updated products...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*70}")
    print("UPDATE COMPLETE")
    print(f"{'='*70}")
    print(f"Input file:  {input_file.name}")
    print(f"Output file: {output_file.name}")
    print(f"\nStatistics:")
    print(f"  Total products:     {len(products)}")
    print(f"  URLs updated:       {updated}")
    print(f"  Files not found:    {not_found}")
    print(f"  No image URL:       {no_url}")
    
    # Show some examples
    print(f"\nSample updated products:")
    for i in range(min(3, len(products))):
        p = products[i]
        print(f"\n  Product {p['id']}: {p.get('product', p.get('name', 'N/A'))}")
        print(f"    Image URL: {p.get('imageUrl', 'N/A')}")

if __name__ == "__main__":
    update_image_urls_to_local()
