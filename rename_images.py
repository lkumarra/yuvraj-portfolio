#!/usr/bin/env python3
"""
Rename images to web-friendly names without spaces
"""
import os
import json
import shutil

# Mapping of old names to new names with meaningful identifiers
rename_map = {
    # Fashion (4 images)
    "FNM JULY 2025-00074 copy.jpg": "fashion-portrait-01.jpg",
    "FNM JULY 2025-00074.jpg": "fashion-portrait-02.jpg",
    "FNM JULY 2025-00095.jpg": "fashion-portrait-03.jpg",
    "FNM JULY 2025-00245.jpg": "fashion-portrait-04.jpg",
    
    # Portrait (10 images)
    "_BWP MODEL-00009.jpg": "portrait-model-01.jpg",
    "_BWP MODEL-00012.jpg": "portrait-model-02.jpg",
    "_BWP MODEL-00014.jpg": "portrait-model-03.jpg",
    "_BWP MODEL-00043.jpg": "portrait-model-04.jpg",
    "_BWP MODEL-00178.jpg": "portrait-model-05.jpg",
    "_BWP MODEL-00262.jpg": "portrait-model-06.jpg",
    "_MUGASA-00463.jpg": "portrait-model-07.jpg",
    "_MUGASA-00491.jpg": "portrait-model-08.jpg",
    "_MUGASA-00493.jpg": "portrait-model-09.jpg",
    "_MUGASA-00735 1 copy.motion.jpg": "portrait-model-10.jpg",
    
    # Lifestyle (7 images)
    "WAGWAAN-MAY 2025-00905.jpg": "lifestyle-fashion-01.jpg",
    "WAGWAAN-MAY 2025-00918.jpg": "lifestyle-fashion-02.jpg",
    "WAGWAAN-MAY 2025-00926.jpg": "lifestyle-fashion-03.jpg",
    "WAGWAAN-MAY 2025-00931.jpg": "lifestyle-fashion-04.jpg",
    "WAGWAAN-MAY 2025-00954.jpg": "lifestyle-fashion-05.jpg",
    "WAGWAAN-MAY 2025-01109 copy.jpg": "lifestyle-fashion-06.jpg",
    "WAGWAAN-MAY 2025-01109.jpg": "lifestyle-fashion-07.jpg",
    
    # Product Photography (13 images)
    "GIISHA PRODUCT-00006.jpg": "product-fashion-01.jpg",
    "GIISHA PRODUCT-00020.jpg": "product-fashion-02.jpg",
    "GIISHA PRODUCT-00027.jpg": "product-fashion-03.jpg",
    "GIISHA PRODUCT-00028.jpg": "product-fashion-04.jpg",
    "GIISHA PRODUCT-00030.jpg": "product-fashion-05.jpg",
    "GIISHA PRODUCT-00035.jpg": "product-fashion-06.jpg",
    "GIISHA PRODUCT-00057.jpg": "product-fashion-07.jpg",
    "GIISHA PRODUCT-00088.jpg": "product-fashion-08.jpg",
    "GIISHA PRODUCT-00118.jpg": "product-fashion-09.jpg",
    "GIISHA PRODUCT-00144.jpg": "product-fashion-10.jpg",
    "GIISHA PRODUCT-00160.jpg": "product-fashion-11.jpg",
    "GIISHA PRODUCT-00196.jpg": "product-fashion-12.jpg",
    "GIISHA PRODUCT-00216.jpg": "product-fashion-13.jpg",
    
    # Fashion Accessories (15 images) - Shoes + Wallets
    "ID SHOES(08th MAY-25)-00527.jpg": "accessories-shoes-01.jpg",
    "ID SHOES(08th MAY-25)-00535.jpg": "accessories-shoes-02.jpg",
    "ID SHOES(08th MAY-25)-00542.jpg": "accessories-shoes-03.jpg",
    "ID SHOES(08th MAY-25)-00555.jpg": "accessories-shoes-04.jpg",
    "ID SHOES(08th MAY-25)-00558.jpg": "accessories-shoes-05.jpg",
    "ID SHOES(08th MAY-25)-01189.jpg": "accessories-shoes-06.jpg",
    "ID SHOES(08th MAY-25)-01196.jpg": "accessories-shoes-07.jpg",
    "ID SHOES(08th MAY-25)-01216.jpg": "accessories-shoes-08.jpg",
    "ID SHOES(08th MAY-25)-01249.jpg": "accessories-shoes-09.jpg",
    "ID SHOES(08th MAY-25)-01295.jpg": "accessories-shoes-10.jpg",
    "ID wallet-00078.jpg": "accessories-wallet-01.jpg",
    "ID wallet-00083.jpg": "accessories-wallet-02.jpg",
    "ID wallet-00085.jpg": "accessories-wallet-03.jpg",
    "ID wallet-00086.jpg": "accessories-wallet-04.jpg",
    "ID wallet-00088.jpg": "accessories-wallet-05.jpg",
    
    # Jewelry (8 images)
    "Gold and Silver Palace-00014.jpg": "jewelry-gold-01.jpg",
    "Gold and Silver Palace-00019.jpg": "jewelry-gold-02.jpg",
    "Gold and Silver Palace-00023.jpg": "jewelry-gold-03.jpg",
    "Gold and Silver Palace-00036.jpg": "jewelry-gold-04.jpg",
    "Gold and Silver Palace-00038.jpg": "jewelry-gold-05.jpg",
    "Gold and Silver Palace-00043.jpg": "jewelry-gold-06.jpg",
    "Gold and Silver Palace-00047.jpg": "jewelry-gold-07.jpg",
    "Gold and Silver Palace-00205.jpg": "jewelry-gold-08.jpg",
    
    # Food & Beverage (9 images)
    "Greenbrew Product shoot-00023.jpg": "food-beverage-01.jpg",
    "Greenbrew Product shoot-00076.jpg": "food-beverage-02.jpg",
    "Greenbrew Product shoot-00088.jpg": "food-beverage-03.jpg",
    "Greenbrew Product shoot-00109.jpg": "food-beverage-04.jpg",
    "Greenbrew Product shoot-00197.jpg": "food-beverage-05.jpg",
    "Greenbrew Product shoot-00269.jpg": "food-beverage-06.jpg",
    "Greenbrew Product shoot-00311.jpg": "food-beverage-07.jpg",
    "Greenbrew Product shoot-00342.jpg": "food-beverage-08.jpg",
    "Greenbrew Product shoot-00390.jpg": "food-beverage-09.jpg",
    
    # E-commerce (16 images)
    "ShopAawaa(07-10-25)-00037.jpg": "ecommerce-product-01.jpg",
    "ShopAawaa(07-10-25)-00065.jpg": "ecommerce-product-02.jpg",
    "ShopAawaa(07-10-25)-00073.jpg": "ecommerce-product-03.jpg",
    "ShopAawaa(07-10-25)-00074.jpg": "ecommerce-product-04.jpg",
    "ShopAawaa(07-10-25)-00077.jpg": "ecommerce-product-05.jpg",
    "ShopAawaa(07-10-25)-00087.jpg": "ecommerce-product-06.jpg",
    "ShopAawaa(07-10-25)-00123.jpg": "ecommerce-product-07.jpg",
    "ShopAawaa(07-10-25)-00128.jpg": "ecommerce-product-08.jpg",
    "ShopAawaa(07-10-25)-00130.jpg": "ecommerce-product-09.jpg",
    "ShopAawaa(07-10-25)-00134.jpg": "ecommerce-product-10.jpg",
    "ShopAawaa(07-10-25)-00140.jpg": "ecommerce-product-11.jpg",
    "ShopAawaa(07-10-25)-00302.jpg": "ecommerce-product-12.jpg",
    "ShopAawaa(07-10-25)-00307.jpg": "ecommerce-product-13.jpg",
    "ShopAawaa(07-10-25)-00312.jpg": "ecommerce-product-14.jpg",
    "ShopAawaa(07-10-25)-00320.jpg": "ecommerce-product-15.jpg",
    "ShopAawaa(07-10-25)-00326.jpg": "ecommerce-product-16.jpg",
}

# Category mapping for config update
category_map = {
    "fashion-portrait": "fashion",
    "portrait-model": "portrait",
    "lifestyle-fashion": "lifestyle",
    "product-fashion": "product",
    "accessories-shoes": "accessories",
    "accessories-wallet": "accessories",
    "jewelry-gold": "jewelry",
    "food-beverage": "food",
    "ecommerce-product": "ecommerce",
}

def rename_images():
    """Rename all images in the images folder"""
    images_dir = "images"
    renamed_count = 0
    
    for old_name, new_name in rename_map.items():
        old_path = os.path.join(images_dir, old_name)
        new_path = os.path.join(images_dir, new_name)
        
        if os.path.exists(old_path):
            os.rename(old_path, new_path)
            print(f"✅ Renamed: {old_name} -> {new_name}")
            renamed_count += 1
        else:
            print(f"⚠️  Not found: {old_name}")
    
    print(f"\n✅ Renamed {renamed_count} images")

def update_config():
    """Update config.json with new image names"""
    with open('config.json', 'r') as f:
        config = json.load(f)
    
    # Update portfolio items
    for item in config['portfolio']['items']:
        old_path = item['image']
        old_filename = os.path.basename(old_path)
        
        if old_filename in rename_map:
            new_filename = rename_map[old_filename]
            item['image'] = f"images/{new_filename}"
            
            # Update alt text to be more meaningful
            prefix = new_filename.split('-')[0]
            if prefix == "fashion":
                item['alt'] = "Fashion portrait photography"
            elif prefix == "portrait":
                item['alt'] = "Professional portrait photography"
            elif prefix == "lifestyle":
                item['alt'] = "Lifestyle fashion photography"
            elif prefix == "product":
                item['alt'] = "Product photography"
            elif prefix == "accessories":
                item['alt'] = "Fashion accessories photography"
            elif prefix == "jewelry":
                item['alt'] = "Jewelry photography"
            elif prefix == "food":
                item['alt'] = "Food and beverage photography"
            elif prefix == "ecommerce":
                item['alt'] = "E-commerce product photography"
    
    # Save updated config
    with open('config.json', 'w') as f:
        json.dump(config, f, indent=2)
    
    print("\n✅ Updated config.json with new image paths")

if __name__ == "__main__":
    print("🔄 Starting image rename process...\n")
    rename_images()
    update_config()
    print("\n✨ Done! All images renamed and config updated.")
