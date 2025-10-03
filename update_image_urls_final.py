import json
from pathlib import Path

def update_image_urls_by_id():
    """
    Update imageUrl in products_merged_4.json to point to local downloaded images
    Matches files by product ID prefix (e.g., 001_, 002_, etc.)
    Creates a new file: products_final.json
    """
    base_dir = Path(__file__).parent / "products"
    input_file = base_dir / "products_merged_4.json"
    output_file = base_dir / "products_final.json"
    images_dir = Path("c:/python/suncoast/public/products")
    
    print(f"Reading from: {input_file.name}")
    print(f"Will save to: {output_file.name}")
    print(f"Images directory: {images_dir}\n")
    
    # Load the products
    with open(input_file, 'r', encoding='utf-8') as f:
        products = json.load(f)
    print(f"Loaded {len(products)} products")
    
    # Get all image files and create a mapping by ID
    print("\nScanning image files...")
    image_files = {}
    for image_file in images_dir.glob("*.*"):
        # Extract ID from filename (e.g., "001_ProductName.jpg" -> 1)
        filename = image_file.name
        if filename.startswith(tuple(str(i).zfill(3) for i in range(1, 101))):
            product_id = int(filename[:3])
            image_files[product_id] = filename
    
    print(f"Found {len(image_files)} image files")
    
    # Track statistics
    updated = 0
    not_found = 0
    
    print("\nUpdating image URLs...")
    print("="*70)
    
    for product in products:
        product_id = product['id']
        product_name = product.get('product', product.get('name', ''))
        
        # Check if we have an image file for this product ID
        if product_id in image_files:
            filename = image_files[product_id]
            # Update to relative path format: public\products\filename
            new_url = f"public\\products\\{filename}"
            product['imageUrl'] = new_url
            print(f"Product {product_id:3d}: {filename} - UPDATED")
            updated += 1
        else:
            print(f"Product {product_id:3d}: No image file found - SKIPPED")
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
    
    # Show some examples
    print(f"\nSample updated products:")
    for i in range(min(5, len(products))):
        p = products[i]
        print(f"\n  Product {p['id']}: {p.get('product', p.get('name', 'N/A'))}")
        print(f"    Image URL: {p.get('imageUrl', 'N/A')}")

if __name__ == "__main__":
    update_image_urls_by_id()
