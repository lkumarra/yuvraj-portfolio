# 🍎 Apple-Style Portfolio Website

## ✨ New Apple-Inspired Design

A production-ready photo editor portfolio website with Apple-inspired design and modern features.

### 🎨 Design Features
- **Minimalist Apple Aesthetic**: Clean, spacious design inspired by apple.com
- **Smooth Animations**: Parallax scrolling, fade-in effects, and smooth transitions
- **Glassmorphism Nav**: Blurred navigation bar like Apple's website
- **Premium Typography**: SF Pro Display style fonts for elegant look
- **Subtle Interactions**: Hover effects, scale animations, and smooth scrolling
- **Dark Mode**: Beautiful dark theme with smooth transitions 🌓
- **Auto-Scrolling Carousels**: Portfolio images with auto-scroll and manual controls
- **Portrait Image Support**: Optimized for 2:3 aspect ratio images

### 🚀 Key Features
1. **Config-Driven Content**: All content loads from `config.json`
2. **Dark Mode Toggle**: Switch between light and dark themes with localStorage
3. **Portfolio Carousels**: Auto-scrolling carousels with play/pause, prev/next, dots
4. **Multiple Images Per Category**: Add unlimited images to same category
5. **Responsive Design**: Perfect on desktop, tablet, and mobile (3→2→1 slides)
6. **Lightbox Gallery**: Click any image to view full-size
7. **Portrait Optimized**: Designed for vertical/portrait images (2:3 ratio)

## 📦 Project Structure

- `index.html` - Main HTML file with semantic structure
- `styles.css` - Apple-inspired CSS with dark mode and carousel system
- `script.js` - Enhanced JavaScript with carousel logic and dark mode
- `config.json` - All website content (easy to customize)
- `netlify.toml` - Netlify deployment configuration
- `images/` - Portfolio and profile images
- Documentation files (guides for dark mode, portfolio images, project structure)

## 🚀 Deployment

### Deploy to Netlify (Recommended)

1. **Push to GitHub** (already done ✅)
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select `lkumarra/yuvraj-portfolio`
   - Netlify will auto-detect settings from `netlify.toml`
   - Click "Deploy site"
   - Your site will be live in ~1 minute! 🎉

3. **Custom Domain (Optional)**
   - Go to Site settings → Domain management
   - Add your custom domain
   - Update DNS records as instructed

### Local Development

#### Option 1: Quick Start (Recommended)
```bash
chmod +x start.sh
./start.sh
```
Then open: **http://localhost:8000**

#### Option 2: Manual Start
```bash
python3 -m http.server 8000
```
Then open: **http://localhost:8000**

## 🎨 What You'll See

### Hero Section
- Large, bold typography
- Gradient text accent
- Smooth parallax scrolling
- Two call-to-action buttons

### Services Section  
- Clean card layout
- Gradient icons
- Hover animations with lift effect

### Portfolio Section
- Beautiful grid layout
- Category filtering
- Smooth transitions
- Lightbox viewer with keyboard navigation

### About Section
- Side-by-side layout
- Animated skill bars
- Professional profile image

### Contact Section
- Split layout with info cards
- Working contact form
- Social media links
- Smooth form validation

### Dark Mode 🌓
- Toggle in navigation bar
- Smooth color transitions
- Remembers your preference
- Beautiful dark color scheme

## 🔍 Debugging

Open browser console (F12) to see:
- ✅ Configuration loading status
- 🎨 Content population logs
- ❌ Any errors with helpful messages

## 🎨 Customization

All content is in `config.json`:
```json
{
  "brand": { "name": "Your Brand" },
  "hero": { "title": "Your Title", ... },
  "services": { "items": [...] },
  "portfolio": { "items": [...] },
  ...
}
```

Just edit `config.json` and refresh!

## 🌟 Key Differences from Original

| Feature | Basic Design | Apple Style |
|---------|----------|-------------|
| Design | Colorful gradients | Minimal, clean |
| Animations | Basic | Smooth, Apple-like |
| Navigation | Standard | Glassmorphism blur |
| Typography | Regular | SF Pro style |
| Colors | Multiple colors | Black, white, blue accent |
| Spacing | Compact | Generous whitespace |
| Dark Mode | ❌ No | ✅ Yes with toggle |
| Config Loading | ❌ Broken | ✅ Fixed with logging |

## 🐛 Troubleshooting

**Content not showing?**
- Make sure you're using http://localhost:8000 (not file://)
- Check browser console for errors
- Verify config.json is in same folder

**Animations not working?**
- Scroll slowly to trigger fade-in effects
- Try refreshing the page

**Images not loading?**
- Make sure images/ folder exists
- Run `python3 generate_images.py` if needed

**Dark mode not saving?**
- Check if localStorage is enabled
- Clear browser cache
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

## 📱 Mobile Responsive

The design automatically adapts to:
- 📱 Mobile phones (< 768px)
- 📱 Tablets (768px - 1024px)  
- 💻 Desktops (> 1024px)

## 🎉 Features Summary

This design combines:
- ✅ Apple's minimalist aesthetic
- ✅ Smooth, professional animations
- ✅ Proper config loading (finally working!)
- ✅ Beautiful typography and spacing
- ✅ Mobile-first responsive design
- ✅ Dark mode with smooth transitions
- ✅ Animated skill bars
- ✅ Portfolio lightbox gallery
- ✅ Form validation
- ✅ Parallax scrolling

---

**Open http://localhost:8000 and enjoy your premium portfolio! 🚀**