# RTL Support & Navigation Guide

## 🔄 Navigation System

### How it Works
All screens now have proper back button navigation. When you navigate to any screen outside the tabs, you'll see:
- ✅ **Back button** in the top-left (automatically positioned for RTL)
- ✅ **Screen title** in Hebrew at the top
- ✅ **Tap back button** or swipe to return to previous screen

### Screens with Navigation
All these screens now have back buttons:
- מרכז יזמות (Entrepreneurship Hub)
- ספריית משאבים (Resource Library)  
- מאמרים ותובנות (Articles)
- הפגישות שלי (My Bookings)
- התגים שלי (My Badges)
- המטרות שלי (Personal Goals)
- להכיר חברות (Social Tinder)
- שדרוג קו"ח ולינקדאין (CV/LinkedIn Enhancer)
- הכנה לראיון עבודה (Interview Prep AI)
- התאמה חכמה AI (AI Matchmaking)

## 🔤 RTL (Right-to-Left) Support

### What Was Fixed
1. **Global RTL** - Enabled on all platforms (iOS, Android, Web)
2. **Text Alignment** - All Hebrew text right-aligned
3. **Writing Direction** - Proper RTL text flow
4. **Flex Direction** - Reversed for Hebrew reading order
5. **Components** - Card, Button, and all UI elements support RTL

### RTL Utilities

Import from `@/utils/rtl`:

```typescript
import { rtlText, rtlView, rtlRow } from '@/utils/rtl';

// For Hebrew text
<Text style={rtlText}>טקסט בעברית</Text>

// For containers with Hebrew content
<View style={rtlView}>...</View>

// For horizontal layouts
<View style={rtlRow}>...</View>
```

### RTL Styles Available

#### `rtlText` - For all Hebrew text
```typescript
{
  textAlign: 'right',
  writingDirection: 'rtl',
}
```

#### `rtlView` - For containers
```typescript
{
  alignItems: 'flex-end',
}
```

#### `rtlRow` - For horizontal layouts
```typescript
{
  flexDirection: 'row-reverse',
}
```

### Auto-Applied RTL
These components already have RTL built-in:
- ✅ **Card** - All card components (title, description, content, footer)
- ✅ **Navigation** - Back button automatically positioned
- ✅ **Tabs** - Bottom navigation respects RTL
- ✅ **Buttons** - Icon positioning respects RTL

## 🎯 Best Practices

### When to Use RTL Styles

1. **Always for Hebrew text:**
```typescript
<Text style={rtlText}>זה טקסט בעברית</Text>
```

2. **For containers with Hebrew:**
```typescript
<View style={rtlView}>
  <Text style={rtlText}>כותרת</Text>
  <Text style={rtlText}>תיאור</Text>
</View>
```

3. **For horizontal layouts:**
```typescript
<View style={[rtlRow, { gap: 8 }]}>
  <Icon name="star" />
  <Text style={rtlText}>טקסט</Text>
</View>
```

### What's Automatic

You DON'T need to manually add RTL to:
- Card components (already have RTL)
- Navigation headers
- Tab bar
- Stack navigation

## 🧪 Testing RTL

### On iOS Simulator
1. Settings → General → Language & Region
2. Add Hebrew
3. Set Hebrew as primary language
4. App will automatically use RTL

### On Android Emulator
1. Settings → System → Languages
2. Add Hebrew
3. App will automatically use RTL

### On Web
RTL is now enabled by default on web too!

## 🔧 Troubleshooting

### Text Not Right-Aligned?
Add `rtlText` style:
```typescript
<Text style={rtlText}>טקסט</Text>
```

### Layout Reversed?
Use `rtlRow` for horizontal layouts:
```typescript
<View style={rtlRow}>...</View>
```

### Can't Navigate Back?
Make sure you're using `router.push()` to navigate:
```typescript
import { router } from 'expo-router';
router.push('/screen-name');
```

## 📚 Resources

- **RTL Utilities:** `/mobile-app/utils/rtl.ts`
- **Root Layout:** `/mobile-app/app/_layout.tsx`
- **Card Component:** `/mobile-app/components/ui/Card.tsx`

---

✨ **Your app now has full RTL support and proper navigation!**

