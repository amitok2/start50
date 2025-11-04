# Constants

This directory contains app-wide constants and configuration.

## theme.ts

The theme file defines the entire design system matching the web app:

### Color System
- **Brand Colors**: Rose, Pink, Purple, Orange gradients
- **Neutral Colors**: Gray scale for text and backgrounds
- **Semantic Colors**: Primary, Secondary, Destructive, etc.
- **Light & Dark Modes**: Full support for both color schemes

### Design Tokens
- **Spacing**: Consistent spacing scale (xs to 6xl)
- **Typography**: Font sizes and weights
- **Border Radius**: Rounded corners (sm to full)
- **Shadows**: Elevation system (sm to 2xl)

### Usage Example

```typescript
import { theme } from '@/constants/theme';

// Using colors
backgroundColor: theme.colors.rose[500]

// Using spacing
padding: theme.spacing.lg

// Using typography
fontSize: theme.fontSize.xl
fontWeight: theme.fontWeight.bold

// Using shadows
...theme.shadows.xl
```

## Adding New Constants

When adding new constants:
1. Keep them typed with TypeScript
2. Follow the naming conventions
3. Document their purpose
4. Ensure they align with the web app's design system

