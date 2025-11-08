#!/usr/bin/env python3
"""
Optimize images for web deployment
Reduces file size while maintaining quality
"""
import os
from PIL import Image
import sys

def optimize_image(input_path, output_path=None, max_width=1920, quality=85):
    """
    Optimize an image for web use
    
    Args:
        input_path: Path to input image
        output_path: Path for output (overwrites input if None)
        max_width: Maximum width in pixels
        quality: JPEG quality (1-100)
    """
    if output_path is None:
        output_path = input_path
    
    try:
        with Image.open(input_path) as img:
            # Convert RGBA to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Get original size
            original_size = os.path.getsize(input_path) / 1024 / 1024  # MB
            
            # Resize if too large
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Save with optimization
            img.save(output_path, 'JPEG', quality=quality, optimize=True)
            
            # Get new size
            new_size = os.path.getsize(output_path) / 1024 / 1024  # MB
            savings = ((original_size - new_size) / original_size) * 100
            
            print(f"✅ {os.path.basename(input_path)}: {original_size:.2f}MB → {new_size:.2f}MB ({savings:.1f}% saved)")
            return True
            
    except Exception as e:
        print(f"❌ Error processing {input_path}: {e}")
        return False

def optimize_all_images(directory='images', max_width=1920, quality=85):
    """Optimize all images in a directory"""
    print(f"🔄 Optimizing images in {directory}/")
    print(f"📐 Max width: {max_width}px, Quality: {quality}%\n")
    
    count = 0
    errors = 0
    
    for filename in os.listdir(directory):
        if filename.lower().endswith(('.jpg', '.jpeg')):
            filepath = os.path.join(directory, filename)
            if optimize_image(filepath, max_width=max_width, quality=quality):
                count += 1
            else:
                errors += 1
    
    print(f"\n✨ Done! Optimized {count} images")
    if errors > 0:
        print(f"⚠️  {errors} errors occurred")

if __name__ == "__main__":
    # Check if PIL is installed
    try:
        from PIL import Image
    except ImportError:
        print("❌ Error: Pillow library not installed")
        print("Install it with: pip3 install Pillow")
        sys.exit(1)
    
    optimize_all_images()
