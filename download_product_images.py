import json
import requests
from pathlib import Path
import time
import re
from urllib.parse import urlparse

def sanitize_filename(filename):
    """Remove invalid characters from filename"""
    # Remove or replace invalid characters
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    # Limit length
    if len(filename) > 200:
        filename = filename[:200]
    return filename

def download_product_images():
    """
    Download all product images from products_with_descriptions.json
    Saves to c:/python/suncoast/public/products
    """
    # Setup paths
    base_dir = Path(__file__).parent
    products_file = base_dir / "products" / "products_with_descriptions.json"
    images_dir = Path("c:/python/suncoast/public/products")
    
    # Create images directory if it doesn't exist
    images_dir.mkdir(parents=True, exist_ok=True)
    print(f"Images will be saved to: {images_dir}")
    print(f"Created directory: {images_dir.exists()}")
    
    # Load products
    print(f"\nLoading products from {products_file.name}...")
    with open(products_file, 'r', encoding='utf-8') as f:
        products = json.load(f)
    print(f"Loaded {len(products)} products")
    
    # Track statistics
    downloaded = 0
    skipped = 0
    failed = 0
    already_exist = 0
    
    print(f"\n{'='*70}")
    print("Starting image downloads...")
    print(f"{'='*70}\n")
    
    for i, product in enumerate(products, 1):
        product_id = product['id']
        product_name = product['name']
        image_url = product.get('imageUrl')
        
        print(f"[{i}/{len(products)}] Product {product_id}: {product_name}")
        
        # Skip if no image URL
        if not image_url:
            print(f"  No image URL - SKIPPED")
            skipped += 1
            continue
        
        # Parse the URL to get the filename
        parsed_url = urlparse(image_url)
        url_path = parsed_url.path
        
        # Extract the image ID and extension from the URL
        # Wix URLs typically have format: /media/ID~mv2.ext or /media/ID.ext
        match = re.search(r'/media/([a-f0-9_]+(?:~mv2)?\.[a-z]+)', url_path)
        if match:
            original_filename = match.group(1)
        else:
            # Fallback to just the last part of the path
            original_filename = Path(url_path).name
        
        # Create a filename: productID_originalfilename
        file_extension = Path(original_filename).suffix or '.jpg'
        safe_product_name = sanitize_filename(product_name)[:50]  # Limit name length
        filename = f"{product_id:03d}_{safe_product_name}{file_extension}"
        
        # Clean up the filename further
        filename = filename.replace(' ', '_')
        output_path = images_dir / filename
        
        # Skip if file already exists
        if output_path.exists():
            file_size = output_path.stat().st_size / 1024  # Size in KB
            print(f"  {filename} ({file_size:.1f} KB) - ALREADY EXISTS")
            already_exist += 1
            continue
        
        # Download the image
        try:
            response = requests.get(image_url, timeout=30)
            response.raise_for_status()
            
            # Save the image
            with open(output_path, 'wb') as f:
                f.write(response.content)
            
            file_size = len(response.content) / 1024  # Size in KB
            print(f"  {filename} ({file_size:.1f} KB) - DOWNLOADED")
            downloaded += 1
            
            # Small delay to be respectful to the server
            time.sleep(0.5)
            
        except requests.exceptions.RequestException as e:
            print(f"  FAILED - {str(e)}")
            failed += 1
        except Exception as e:
            print(f"  ERROR - {str(e)}")
            failed += 1
    
    # Print summary
    print(f"\n{'='*70}")
    print("DOWNLOAD SUMMARY")
    print(f"{'='*70}")
    print(f"Total products:        {len(products)}")
    print(f"Downloaded:            {downloaded}")
    print(f"Already existed:       {already_exist}")
    print(f"No image URL:          {skipped}")
    print(f"Failed:                {failed}")
    print(f"\nImages saved to:       {images_dir}")
    print(f"Total files in folder: {len(list(images_dir.glob('*.*')))}")

if __name__ == "__main__":
    download_product_images()
