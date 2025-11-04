# Base44 Mobile App - Setup Guide

This guide will help you get the mobile app up and running quickly.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd mobile-app
npm install
```

### 2. Start the Development Server

```bash
npm start
```

This will open Expo DevTools in your browser.

### 3. Run on Your Device

#### Option A: Physical Device (Recommended for Hebrew RTL testing)

1. **iOS**: 
   - Download "Expo Go" from the App Store
   - Scan the QR code with your Camera app
   
2. **Android**: 
   - Download "Expo Go" from Google Play
   - Scan the QR code with the Expo Go app

#### Option B: Emulator/Simulator

**iOS Simulator** (Mac only):
```bash
npm run ios
```

**Android Emulator**:
```bash
npm run android
```

## 📱 Testing RTL Support

The app automatically enables RTL (Right-to-Left) for Hebrew text:

1. On **Android**: The app may need to reload after RTL is enabled
2. On **iOS**: RTL works immediately
3. All text should align to the right
4. Icons and layouts should be mirrored appropriately

## 🎨 Design System Verification

The mobile app matches the web app's design. Verify these elements:

### Colors ✅
- **Rose**: #F43F5E (Main brand color)
- **Pink**: #EC4899 (Secondary brand color)
- **Purple**: #A855F7 (Accent color)
- **Orange**: #FB923C (Highlight color)

### Typography ✅
- Hebrew text with proper RTL support
- Font sizes: xs (12px) to 5xl (48px)
- Font weights: normal, medium, semibold, bold

### Components ✅
- **Button**: 6 variants (default, gradient, outline, secondary, ghost, link)
- **Card**: Rounded corners (12px), shadow, border
- **Badge**: Color-coded categories
- **Input/Textarea**: Consistent styling with web app

### Spacing ✅
- Follows 4px grid system
- xs (4px) to 6xl (64px)

## 🔧 Customization

### Changing Colors

Edit `constants/theme.ts`:

```typescript
export const Colors = {
  light: {
    rose: {
      500: '#YOUR_COLOR', // Change brand color
    },
    // ... other colors
  },
};
```

### Adding New Components

1. Create component in `components/ui/`
2. Follow existing patterns
3. Use theme constants
4. Test in both RTL and LTR

### Adding New Screens

1. Create file in `app/(tabs)/` for tab screens
2. Or create file in `app/` for modal screens
3. Expo Router handles routing automatically

## 🏗️ Project Structure

```
mobile-app/
├── app/                    # Screens (Expo Router)
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home (ServicesHighlight)
│   │   ├── mentors.tsx    # Mentors listing
│   │   ├── community.tsx  # Community posts
│   │   └── profile.tsx    # User profile
│   ├── _layout.tsx        # Root layout (RTL config)
│   └── index.tsx          # Redirect to tabs
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── home/             # Home screen components
│   ├── mentors/          # Mentor components
│   └── community/        # Community components
├── constants/            # Theme and constants
├── utils/               # Utility functions
└── assets/             # Images and fonts
```

## 🎯 Feature Checklist

### Core Features ✅
- [x] Home screen with services highlight
- [x] Mentor cards with booking info
- [x] Community posts with likes/comments
- [x] User profile with stats
- [x] RTL support for Hebrew
- [x] Bottom tab navigation
- [x] Gradient buttons matching web app
- [x] Card components with shadows
- [x] Badge system for categories
- [x] Avatar components with fallback
- [x] Responsive layouts

### Design Matching ✅
- [x] Color palette identical to web app
- [x] Typography system matching web app
- [x] Spacing system matching web app
- [x] Border radius matching web app
- [x] Shadow system matching web app
- [x] Component variants matching web app

### UX Enhancements ✅
- [x] Smooth animations (react-native-reanimated)
- [x] Horizontal scrolling for services
- [x] Touch feedback on all interactive elements
- [x] Loading states on buttons
- [x] Empty states for lists
- [x] Proper text wrapping for Hebrew

## 🐛 Troubleshooting

### RTL Not Working
- **Android**: Close and reopen the app
- **iOS**: Should work automatically
- Check `I18nManager.isRTL` in console

### Fonts Not Loading
- Make sure fonts are in `assets/fonts/`
- Hebrew fonts (Heebo) recommended
- Install fonts with: `expo install expo-font`

### Images Not Loading
- Check internet connection
- Verify image URLs are accessible
- Use placeholder images for testing

### Metro Bundler Issues
```bash
# Clear cache and restart
npm start -- --clear
```

### Build Errors
```bash
# Clean install
rm -rf node_modules
npm install
```

## 📦 Building for Production

### Android APK
```bash
eas build --platform android
```

### iOS App
```bash
eas build --platform ios
```

Note: You'll need an Expo account and EAS CLI configured.

## 🔐 Environment Variables

Create `.env` file for sensitive data:

```env
API_URL=https://your-api.com
API_KEY=your-api-key
```

Access in code:
```typescript
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl;
```

## 📱 Assets Needed

Before publishing, add these assets to `assets/`:

1. **icon.png** - App icon (1024x1024)
2. **splash.png** - Splash screen
3. **adaptive-icon.png** - Android icon (1024x1024)
4. **fonts/** - Hebrew fonts (Heebo)

## 🚢 Deployment

### Expo Go (Development)
- Already set up with `npm start`
- Share QR code with testers

### Standalone Apps
1. Configure `app.json`
2. Set up EAS: `npm install -g eas-cli`
3. Build: `eas build`
4. Submit: `eas submit`

## 📖 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

## 🎓 Learning Path

1. Start with Home screen (`app/(tabs)/index.tsx`)
2. Explore UI components (`components/ui/`)
3. Understand theme system (`constants/theme.ts`)
4. Learn navigation (`app/_layout.tsx`)
5. Study feature components (Mentor/Post cards)

## 💡 Tips

- Use TypeScript for type safety
- Follow the component patterns
- Test on both iOS and Android
- Verify RTL support frequently
- Keep design consistent with web app
- Use theme constants, not hardcoded values

---

**Need help?** Check the main README.md for more information.

**Ready to go!** Run `npm start` and scan the QR code to see your app! 🎉

