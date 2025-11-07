#!/usr/bin/env python3
"""
Generate sample portfolio images using PIL/Pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont, ImageFilter
    import random
except ImportError:
    print("Installing required package: Pillow")
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageDraw, ImageFont, ImageFilter
    import random

import os

# Create images directory if it doesn't exist
os.makedirs('images', exist_ok=True)

def create_gradient(width, height, start_color, end_color):
    """Create a gradient image"""
    base = Image.new('RGB', (width, height), start_color)
    top = Image.new('RGB', (width, height), end_color)
    mask = Image.new('L', (width, height))
    mask_data = []
    for y in range(height):
        for x in range(width):
            mask_data.append(int(255 * (y / height)))
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base

def add_noise_overlay(image):
    """Add subtle noise/texture overlay"""
    width, height = image.size
    noise = Image.new('RGB', (width, height))
    pixels = []
    for _ in range(width * height):
        val = random.randint(0, 30)
        pixels.append((val, val, val))
    noise.putdata(pixels)
    return Image.blend(image, noise, 0.1)

def add_circles(draw, width, height, color):
    """Add decorative circles"""
    for _ in range(15):
        x = random.randint(0, width)
        y = random.randint(0, height)
        radius = random.randint(20, 100)
        alpha = random.randint(10, 40)
        # Create semi-transparent effect
        draw.ellipse([x-radius, y-radius, x+radius, y+radius], 
                     fill=(255, 255, 255, alpha))

def create_portfolio_image(filename, width, height, text, gradient_colors, category_icon):
    """Create a portfolio image with gradient and text"""
    # Create gradient background
    img = create_gradient(width, height, gradient_colors[0], gradient_colors[1])
    
    # Add noise overlay
    img = add_noise_overlay(img)
    
    # Apply subtle blur for depth
    img = img.filter(ImageFilter.GaussianBlur(radius=1))
    
    # Create drawing context
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Add decorative circles
    for _ in range(20):
        x = random.randint(0, width)
        y = random.randint(0, height)
        radius = random.randint(30, 150)
        alpha = random.randint(5, 25)
        draw.ellipse([x-radius, y-radius, x+radius, y+radius], 
                     fill=(255, 255, 255, alpha))
    
    # Try to use a nice font, fallback to default
    try:
        # Try different font paths for different systems
        font_paths = [
            '/System/Library/Fonts/Helvetica.ttc',  # macOS
            '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',  # Linux
            'C:\\Windows\\Fonts\\arial.ttf',  # Windows
        ]
        font = None
        for font_path in font_paths:
            if os.path.exists(font_path):
                font = ImageFont.truetype(font_path, 70)
                icon_font = ImageFont.truetype(font_path, 100)
                break
        if font is None:
            font = ImageFont.load_default()
            icon_font = font
    except:
        font = ImageFont.load_default()
        icon_font = font
    
    # Add icon/emoji
    icon_y = height // 2 - 120
    draw.text((width // 2, icon_y), category_icon, 
              fill=(255, 255, 255, 230), font=icon_font, anchor="mm")
    
    # Add text with shadow
    lines = text.split('\n')
    y_offset = height // 2 + 20
    
    for line in lines:
        # Shadow
        draw.text((width // 2 + 3, y_offset + 3), line, 
                  fill=(0, 0, 0, 100), font=font, anchor="mm")
        # Main text
        draw.text((width // 2, y_offset), line, 
                  fill=(255, 255, 255, 255), font=font, anchor="mm")
        y_offset += 80
    
    # Save image
    img.save(f'images/{filename}', 'JPEG', quality=90, optimize=True)
    print(f'✅ Created: images/{filename}')

def create_profile_image(filename, width, height):
    """Create a profile photo placeholder"""
    # Create gradient background
    img = create_gradient(width, height, (99, 102, 241), (139, 92, 246))
    
    # Add noise
    img = add_noise_overlay(img)
    
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Add decorative circles
    for _ in range(30):
        x = random.randint(0, width)
        y = random.randint(0, height)
        radius = random.randint(20, 100)
        alpha = random.randint(10, 30)
        draw.ellipse([x-radius, y-radius, x+radius, y+radius], 
                     fill=(255, 255, 255, alpha))
    
    # Add large centered circle for profile area
    center_x, center_y = width // 2, height // 2
    radius = min(width, height) // 3
    draw.ellipse([center_x-radius, center_y-radius, center_x+radius, center_y+radius],
                 fill=(255, 255, 255, 40))
    
    # Try to use a nice font
    try:
        font_paths = [
            '/System/Library/Fonts/Helvetica.ttc',
            '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
            'C:\\Windows\\Fonts\\arial.ttf',
        ]
        font = None
        icon_font = None
        for font_path in font_paths:
            if os.path.exists(font_path):
                font = ImageFont.truetype(font_path, 60)
                icon_font = ImageFont.truetype(font_path, 120)
                break
        if font is None:
            font = ImageFont.load_default()
            icon_font = font
    except:
        font = ImageFont.load_default()
        icon_font = font
    
    # Add user icon
    draw.text((width // 2, height // 2 - 40), "👤", 
              fill=(255, 255, 255, 230), font=icon_font, anchor="mm")
    
    # Add text
    draw.text((width // 2 + 2, height // 2 + 82), "Your Photo", 
              fill=(0, 0, 0, 100), font=font, anchor="mm")
    draw.text((width // 2, height // 2 + 80), "Your Photo", 
              fill=(255, 255, 255, 255), font=font, anchor="mm")
    
    # Save image
    img.save(f'images/{filename}', 'JPEG', quality=90, optimize=True)
    print(f'✅ Created: images/{filename}')

# Portfolio images configuration
portfolio_images = [
    {
        'filename': 'portfolio-1.jpg',
        'width': 800,
        'height': 600,
        'text': 'Portrait\nRetouching',
        'colors': [(102, 126, 234), (118, 75, 162)],
        'icon': '📸'
    },
    {
        'filename': 'portfolio-2.jpg',
        'width': 800,
        'height': 600,
        'text': 'Landscape\nEnhancement',
        'colors': [(240, 147, 251), (245, 87, 108)],
        'icon': '🏔️'
    },
    {
        'filename': 'portfolio-3.jpg',
        'width': 800,
        'height': 600,
        'text': 'Product\nPhotography',
        'colors': [(79, 172, 254), (0, 242, 254)],
        'icon': '📦'
    },
    {
        'filename': 'portfolio-4.jpg',
        'width': 800,
        'height': 600,
        'text': 'Creative\nManipulation',
        'colors': [(67, 233, 123), (56, 249, 215)],
        'icon': '✨'
    },
    {
        'filename': 'portfolio-5.jpg',
        'width': 800,
        'height': 600,
        'text': 'Beauty\nRetouching',
        'colors': [(250, 112, 154), (254, 225, 64)],
        'icon': '💄'
    },
    {
        'filename': 'portfolio-6.jpg',
        'width': 800,
        'height': 600,
        'text': 'Nature\nPhotography',
        'colors': [(48, 207, 208), (51, 8, 103)],
        'icon': '🌿'
    }
]

def main():
    print("🎨 Generating portfolio images...")
    print("")
    
    # Create portfolio images
    for config in portfolio_images:
        create_portfolio_image(
            config['filename'],
            config['width'],
            config['height'],
            config['text'],
            config['colors'],
            config['icon']
        )
    
    # Create profile image
    create_profile_image('profile.jpg', 600, 600)
    
    print("")
    print("✅ All images generated successfully!")
    print(f"📁 Images saved in: {os.path.abspath('images')}")
    print("")
    print("Next steps:")
    print("1. Check the images in the 'images/' folder")
    print("2. Replace with your own photos if desired")
    print("3. Open index.html to see your portfolio!")

if __name__ == "__main__":
    main()
