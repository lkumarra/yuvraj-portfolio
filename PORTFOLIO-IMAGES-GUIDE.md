# 📸 Adding Multiple Images to Portfolio

## How It Works Now

The carousel system automatically groups all images by their `category` field. You can add as many images as you want to each category!

## Example: Adding Multiple Creative Images

In your `config.json`, simply add more items with the same category:

```json
"portfolio": {
  "items": [
    {
      "image": "images/creative-1.jpg",
      "category": "creative",
      "title": "Fantasy Landscape",
      "description": "Digital art manipulation"
    },
    {
      "image": "images/creative-2.jpg",
      "category": "creative",
      "title": "Surreal Portrait",
      "description": "Creative photo composition"
    },
    {
      "image": "images/creative-3.jpg",
      "category": "creative",
      "title": "Abstract Design",
      "description": "Artistic photo manipulation"
    },
    {
      "image": "images/portrait-1.jpg",
      "category": "portrait",
      "title": "Professional Headshot",
      "description": "Business portrait retouching"
    },
    {
      "image": "images/portrait-2.jpg",
      "category": "portrait",
      "title": "Fashion Editorial",
      "description": "High-end beauty retouching"
    }
  ]
}
```

## Image Size Handling

### Auto-Resize Features:
- ✅ **Aspect Ratio**: All carousel slides maintain 4:3 ratio
- ✅ **Object-fit: cover**: Images automatically crop to fill container
- ✅ **Object-position: center**: Keeps important parts of image visible
- ✅ **Responsive**: Automatically adjusts for different screen sizes

### Image Recommendations:

**For Best Results:**
- Recommended resolution: 1200x900px (4:3 ratio)
- Minimum resolution: 800x600px
- Format: JPG or PNG
- File size: < 500KB (for faster loading)

**Different Sizes? No Problem!**
The system handles:
- Portrait images (vertical)
- Landscape images (horizontal)
- Square images
- Various aspect ratios

All images will be automatically:
1. Resized to fit the carousel
2. Cropped intelligently (centered)
3. Scaled proportionally
4. Optimized for viewing

## How Categories Work

### "All" Category
- Automatically shows ALL images from every category
- No need to manually add items to "all"
- Created automatically by the system

### Individual Categories
When you click a category filter:
- Shows ONLY the carousel for that category
- Includes ALL images with that category tag
- Auto-scrolls through all images in that category

### Example Structure:

```
Creative Category (10 images)
┌────────────────────────────────┐
│  [⏸️] [◀️] [▶️]                │
│  ┌──────┬──────┬──────┐        │
│  │ Img1 │ Img2 │ Img3 │  ...   │  ← All 10 creative images
│  └──────┴──────┴──────┘        │
│  ⚫⚪⚪⚪⚪⚪⚪⚪⚪⚪              │
└────────────────────────────────┘

Portrait Category (5 images)
┌────────────────────────────────┐
│  [⏸️] [◀️] [▶️]                │
│  ┌──────┬──────┬──────┐        │
│  │ Img1 │ Img2 │ Img3 │  ...   │  ← All 5 portrait images
│  └──────┴──────┴──────┘        │
│  ⚫⚪⚪⚪⚪                      │
└────────────────────────────────┘
```

## Adding New Images

### Step 1: Add Image File
Place your image in the `images/` folder:
```
images/
├── creative-manipulation-1.jpg
├── creative-manipulation-2.jpg
├── portrait-retouch-1.jpg
└── ...
```

### Step 2: Add to config.json
Add a new entry in the `portfolio.items` array:

```json
{
  "image": "images/creative-manipulation-1.jpg",
  "alt": "Creative Photo Manipulation",
  "category": "creative",
  "title": "Magic Hour Composite",
  "description": "Fantasy landscape manipulation"
}
```

### Step 3: Refresh Browser
That's it! The carousel will automatically:
- Include your new image
- Group it with other images in that category
- Add it to the auto-scroll rotation

## Multiple Categories Example

You can have unlimited images per category:

```json
"items": [
  // 10 Creative images
  {"image": "images/creative-1.jpg", "category": "creative", ...},
  {"image": "images/creative-2.jpg", "category": "creative", ...},
  {"image": "images/creative-3.jpg", "category": "creative", ...},
  {"image": "images/creative-4.jpg", "category": "creative", ...},
  {"image": "images/creative-5.jpg", "category": "creative", ...},
  
  // 8 Portrait images
  {"image": "images/portrait-1.jpg", "category": "portrait", ...},
  {"image": "images/portrait-2.jpg", "category": "portrait", ...},
  {"image": "images/portrait-3.jpg", "category": "portrait", ...},
  
  // 5 Landscape images
  {"image": "images/landscape-1.jpg", "category": "landscape", ...},
  {"image": "images/landscape-2.jpg", "category": "landscape", ...},
  
  // 12 Product images
  {"image": "images/product-1.jpg", "category": "product", ...},
  {"image": "images/product-2.jpg", "category": "product", ...}
]
```

## Image Cropping Options

### Current: Cover (Default)
Images fill the entire carousel slide, may crop edges:
```css
object-fit: cover; /* Fills container, crops excess */
```

### Alternative: Contain
To show full images without cropping (with letterboxing):
Add this class to your HTML or modify CSS:
```css
.carousel-slide.contain img {
    object-fit: contain; /* Shows full image, adds padding */
}
```

## Tips for Best Results

### 1. Consistent Naming
```
creative-fantasy-1.jpg
creative-surreal-2.jpg
creative-abstract-3.jpg
```

### 2. Optimize Images
Before uploading:
- Resize to appropriate dimensions
- Compress for web (80-90% quality)
- Use tinypng.com or similar tools

### 3. Descriptive Titles
```json
{
  "title": "Fantasy Forest Composite",  ← Specific
  "description": "Multi-layer photo manipulation with color grading"  ← Detailed
}
```

### 4. Organize by Category
Keep similar work together:
- All creative manipulation → "creative"
- All portrait retouching → "portrait"
- All landscape editing → "landscape"

## Troubleshooting

### Images Not Showing?
1. Check file path is correct
2. Verify image exists in `images/` folder
3. Check file extension (.jpg, .png)
4. Look for typos in config.json

### Images Cropped Strangely?
1. Try using images with 4:3 aspect ratio
2. Or modify CSS to use `object-fit: contain`
3. Ensure important subject is centered

### Carousel Not Scrolling?
1. Check browser console for errors
2. Verify all images have same category spelling
3. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

---

**You can now add unlimited images to any category!** 🎨✨