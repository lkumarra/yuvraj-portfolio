# 🍎 Apple-Style Portfolio Website

## ✨ New Apple-Inspired Design

I've created a completely redesigned version of your portfolio with:

### 🎨 Design Features
- **Minimalist Apple Aesthetic**: Clean, spacious design inspired by apple.com
- **Smooth Animations**: Parallax scrolling, fade-in effects, and smooth transitions
- **Glassmorphism Nav**: Blurred navigation bar like Apple's website
- **Premium Typography**: SF Pro Display style fonts for elegant look
- **Subtle Interactions**: Hover effects, scale animations, and smooth scrolling
- **Dark Mode**: Beautiful dark theme with smooth transitions 🌓

### 🚀 Key Improvements
1. **Fixed Config Loading**: Now properly loads all content from `config.json`
2. **Console Logging**: See exactly what's happening in browser console
3. **Error Messages**: Beautiful error notifications if something goes wrong
4. **Better Performance**: Optimized animations and lazy loading for images
5. **Mobile Responsive**: Perfect on all devices
6. **Dark Mode Toggle**: Switch between light and dark themes

## 📦 Files

- `index.html` - Main HTML file with clean structure
- `styles.css` - Apple-inspired CSS with smooth animations and dark mode
- `script.js` - Enhanced JavaScript with proper config loading and dark mode
- `start.sh` - Quick start script
- `config.json` - All website content (easy to customize)
- `generate_images.py` - Python script to generate sample images
- `DARK-MODE-GUIDE.md` - Dark mode documentation

## 🎯 How to Use

### Option 1: Quick Start (Recommended)
```bash
chmod +x start.sh
./start.sh
```
Then open: **http://localhost:8000**

### Option 2: Manual Start
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