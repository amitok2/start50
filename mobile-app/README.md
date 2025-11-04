# Base44 Mobile App

A React Native mobile application built with Expo that provides an identical twin experience to the Base44 web application. Designed specifically for women 50+ to restart their careers, find mentorship, and connect with a supportive community.

## 🎨 Design System

This mobile app faithfully replicates the web app's design system:

- **Color Palette**: Rose (#F43F5E), Pink (#EC4899), Purple (#A855F7), Orange (#FB923C)
- **Typography**: Hebrew-first with RTL support
- **Components**: shadcn/ui inspired components adapted for React Native
- **Animations**: Smooth, delightful animations using react-native-reanimated
- **Spacing & Layout**: Consistent with web app design tokens

## 🚀 Features

- **Home Screen**: Beautiful service highlights with horizontal scrolling cards
- **Mentors**: Browse and connect with coaches and consultants
- **Community**: Share posts, like, comment, and engage with other members
- **Profile**: Manage your account, view stats, and access settings
- **RTL Support**: Full Hebrew language support with right-to-left layout
- **Responsive Design**: Optimized for mobile devices with best UX practices

## 📦 Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tooling
- **Expo Router**: File-based routing
- **TypeScript**: Type-safe code
- **React Native Reanimated**: High-performance animations
- **Expo Linear Gradient**: Beautiful gradient effects
- **@base44/sdk**: Backend integration

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
- **iOS**: Press `i` or scan QR code with Camera app
- **Android**: Press `a` or scan QR code with Expo Go app

## 📱 Running the App

### iOS Simulator
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

### Web (for testing)
```bash
npm run web
```

## 📂 Project Structure

```
mobile-app/
├── app/                      # Expo Router pages
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── index.tsx        # Home screen
│   │   ├── mentors.tsx      # Mentors listing
│   │   ├── community.tsx    # Community posts
│   │   └── profile.tsx      # User profile
│   └── _layout.tsx          # Root layout with RTL support
├── components/              # Reusable components
│   ├── ui/                  # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Avatar.tsx
│   │   ├── Textarea.tsx
│   │   └── Separator.tsx
│   ├── home/               # Home screen components
│   │   └── ServicesHighlight.tsx
│   ├── mentors/            # Mentor components
│   │   └── MentorCard.tsx
│   └── community/          # Community components
│       └── PostCard.tsx
├── constants/              # App constants
│   └── theme.ts           # Design system theme
├── utils/                 # Utility functions
│   ├── rtl.ts            # RTL helpers
│   └── icons.tsx         # Icon components
└── assets/               # Images and fonts
```

## 🎯 Key Components

### UI Components
- **Button**: Multiple variants (default, gradient, outline, ghost, link) with loading states
- **Card**: Flexible card component with header, content, and footer sections
- **Badge**: Categorization and status indicators
- **Input/Textarea**: Form inputs with consistent styling
- **Avatar**: User profile images with fallback support

### Feature Components
- **ServicesHighlight**: Horizontal scrolling cards showcasing main services
- **MentorCard**: Beautiful mentor profiles with booking capabilities
- **PostCard**: Interactive community posts with likes and comments

## 🌐 RTL Support

The app automatically enables RTL (Right-to-Left) layout for Hebrew text:
- Text alignment is automatically adjusted
- Icons and layouts are mirrored appropriately
- Navigation gestures work naturally in RTL

## 🎨 Theme Customization

The theme is defined in `constants/theme.ts` and includes:
- Colors (light & dark mode)
- Spacing system
- Typography scale
- Border radius values
- Shadow presets

## 🔗 Integration with Backend

The app uses `@base44/sdk` for backend integration. Configure your API endpoints in the appropriate environment files.

## 📱 Best Practices Implemented

- ✅ Component-based architecture
- ✅ TypeScript for type safety
- ✅ Consistent design system
- ✅ Responsive layouts
- ✅ Smooth animations
- ✅ RTL support
- ✅ Accessibility considerations
- ✅ Performance optimizations

## 🚧 Development Notes

### RTL Configuration
On Android, the app needs to be reloaded after RTL is enabled. This is automatically handled in the root layout.

### Animations
Using `react-native-reanimated` for performance. Make sure to follow the plugin order in `babel.config.js`.

### Fonts
Add Hebrew fonts (Heebo) to `assets/fonts/` for optimal typography.

## 📝 Future Enhancements

- [ ] Dark mode toggle
- [ ] Push notifications
- [ ] Offline support
- [ ] Advanced search and filters
- [ ] Video content integration
- [ ] Calendar integration for bookings
- [ ] Payment processing
- [ ] Social sharing

## 🤝 Contributing

This mobile app mirrors the web app's functionality and design. When updating:
1. Maintain design consistency with the web app
2. Follow the existing component patterns
3. Test on both iOS and Android
4. Ensure RTL support is maintained

## 📄 License

Private - Base44 Mobile Application

---

Built with ❤️ for women 50+ starting their next chapter

