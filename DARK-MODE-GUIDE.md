# 🌓 Dark Mode Feature Guide

## Overview
Your portfolio now includes a beautiful dark mode toggle that switches between light and dark themes with smooth transitions!

## Features

### 🎨 Theme Toggle
- **Location**: Top navigation bar (right side)
- **Icons**: 
  - ☀️ Sun icon = Light mode (active)
  - 🌙 Moon icon = Dark mode (active)
- **Click**: Toggle between themes instantly

### 💾 Persistence
- **Remembers Your Choice**: Theme preference is saved in browser's localStorage
- **Auto-loads**: Your preferred theme loads automatically on next visit

### 🎭 Color Schemes

#### Light Mode (Default)
- Background: Pure white (#ffffff)
- Text: Dark gray (#1d1d1f)
- Accent: Apple blue (#0071e3)
- Cards: Light gray background (#f5f5f7)

#### Dark Mode
- Background: Pure black (#000000)
- Text: Light gray (#f5f5f7)
- Accent: Bright blue (#0a84ff)
- Cards: Dark gray (#1c1c1e)

## How to Use

### For Users
1. **Find the toggle**: Look in the navigation bar (☀️/🌙 button)
2. **Click to switch**: Tap once to toggle between themes
3. **Automatic save**: Your preference is remembered
4. **Smooth transition**: Watch colors fade smoothly (0.3s)

### For Developers

#### HTML Structure
```html
<button class="theme-toggle" id="themeToggle">
    <i class="fas fa-sun theme-toggle-icon active" id="lightIcon"></i>
    <i class="fas fa-moon theme-toggle-icon" id="darkIcon"></i>
</button>
```

#### CSS Variables
```css
/* Light Mode (default) */
:root {
    --color-bg: #ffffff;
    --color-text-primary: #1d1d1f;
    --color-accent: #0071e3;
}

/* Dark Mode */
[data-theme="dark"] {
    --color-bg: #000000;
    --color-text-primary: #f5f5f7;
    --color-accent: #0a84ff;
}
```

#### JavaScript API
```javascript
// Initialize dark mode
initDarkMode();

// Manually set theme
document.documentElement.setAttribute('data-theme', 'dark');

// Get current theme
const theme = localStorage.getItem('theme');

// Listen for theme changes
document.documentElement.addEventListener('themechange', (e) => {
    console.log('Theme changed to:', e.detail);
});
```

## Customization

### Change Default Theme
Edit `script-apple.js`:
```javascript
// Change this line to start with dark mode
const currentTheme = localStorage.getItem('theme') || 'dark';
```

### Adjust Colors
Edit `styles-apple.css` dark mode section:
```css
[data-theme="dark"] {
    --color-bg: #0a0a0a; /* Your custom dark background */
    --color-accent: #ff6b35; /* Your custom accent color */
}
```

### Add More Theme-Specific Styles
```css
[data-theme="dark"] .your-element {
    background: var(--color-bg-elevated);
    border-color: var(--color-border);
}
```

## Technical Details

### Transition Duration
- All color transitions: `0.3s ease`
- Smooth and performant
- Hardware accelerated

### Browser Support
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

### Performance
- Uses CSS custom properties (fast)
- No layout shifts
- GPU-accelerated transitions
- Minimal JavaScript overhead

### Accessibility
- Proper ARIA labels
- Keyboard accessible
- Respects user's system preference (coming soon)
- High contrast ratios in both modes

## Future Enhancements

### Auto-detect System Preference
```javascript
// Coming soon: Auto-detect system theme
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
}
```

### Scheduled Theme
```javascript
// Coming soon: Auto-switch based on time
const hour = new Date().getHours();
const theme = (hour >= 18 || hour < 6) ? 'dark' : 'light';
```

## Troubleshooting

### Theme not saving?
- Check if localStorage is enabled
- Clear browser cache
- Check browser console for errors

### Colors not changing?
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Check if custom CSS overrides exist
- Verify CSS variables are properly set

### Toggle button not visible on mobile?
- Check responsive styles
- Verify mobile menu includes theme toggle
- Test in device simulator

## Examples

### Quick Theme Test
```javascript
// Test in browser console
document.documentElement.setAttribute('data-theme', 'dark');
// Wait a moment...
document.documentElement.setAttribute('data-theme', 'light');
```

### Log Theme Changes
```javascript
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
            console.log('Theme:', mutation.target.dataset.theme);
        }
    });
});
observer.observe(document.documentElement, { attributes: true });
```

## Credits
- Design inspired by Apple's design language
- Icons from Font Awesome
- Smooth transitions using CSS custom properties

---

**Enjoy your new dark mode! 🌙✨**