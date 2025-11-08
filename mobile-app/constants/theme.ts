/**
 * Theme configuration matching the web app design system
 * Based on Tailwind CSS configuration and shadcn/ui neutral theme
 */

export const Colors = {
  light: {
    // Main colors from CSS variables
    background: '#FFFFFF',      // hsl(0 0% 100%)
    foreground: '#0A0A0A',      // hsl(0 0% 3.9%)
    
    // Card colors
    card: '#FFFFFF',            // hsl(0 0% 100%)
    cardForeground: '#0A0A0A',  // hsl(0 0% 3.9%)
    
    // Primary colors (black/dark)
    primary: '#171717',         // hsl(0 0% 9%)
    primaryForeground: '#FAFAFA', // hsl(0 0% 98%)
    
    // Secondary colors (light gray)
    secondary: '#F5F5F5',       // hsl(0 0% 96.1%)
    secondaryForeground: '#171717', // hsl(0 0% 9%)
    
    // Muted colors
    muted: '#F5F5F5',           // hsl(0 0% 96.1%)
    mutedForeground: '#737373', // hsl(0 0% 45.1%)
    
    // Accent colors
    accent: '#F5F5F5',          // hsl(0 0% 96.1%)
    accentForeground: '#171717', // hsl(0 0% 9%)
    
    // Destructive/Error colors
    destructive: '#EF4444',     // hsl(0 84.2% 60.2%)
    destructiveForeground: '#FAFAFA', // hsl(0 0% 98%)
    
    // Border and input colors
    border: '#E5E5E5',          // hsl(0 0% 89.8%)
    input: '#E5E5E5',           // hsl(0 0% 89.8%)
    ring: '#0A0A0A',            // hsl(0 0% 3.9%)
    
    // Brand gradient colors (rose, pink, purple, orange)
    rose: {
      50: '#FFF1F2',
      100: '#FFE4E6',
      200: '#FECDD3',
      300: '#FDA4AF',
      400: '#FB7185',
      500: '#F43F5E',  // Main rose
      600: '#E11D48',
      700: '#BE123C',
      800: '#9F1239',
      900: '#881337',
    },
    pink: {
      50: '#FDF2F8',
      100: '#FCE7F3',
      200: '#FBCFE8',
      300: '#F9A8D4',
      400: '#F472B6',
      500: '#EC4899',  // Main pink
      600: '#DB2777',
      700: '#BE185D',
      800: '#9D174D',
      900: '#831843',
    },
    purple: {
      50: '#FAF5FF',
      100: '#F3E8FF',
      200: '#E9D5FF',
      300: '#D8B4FE',
      400: '#C084FC',
      500: '#A855F7',  // Main purple
      600: '#9333EA',
      700: '#7E22CE',
      800: '#6B21A8',
      900: '#581C87',
    },
    orange: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',  // Main orange
      500: '#F97316',
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
    },
    green: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',  // Main green
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },
    blue: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6',  // Main blue
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
    },
    cyan: {
      50: '#ECFEFF',
      100: '#CFFAFE',
      200: '#A5F3FC',
      300: '#67E8F9',
      400: '#22D3EE',
      500: '#06B6D4',  // Main cyan
      600: '#0891B2',
      700: '#0E7490',
      800: '#155E75',
      900: '#164E63',
    },
    teal: {
      50: '#F0FDFA',
      100: '#CCFBF1',
      200: '#99F6E4',
      300: '#5EEAD4',
      400: '#2DD4BF',
      500: '#14B8A6',  // Main teal
      600: '#0D9488',
      700: '#0F766E',
      800: '#115E59',
      900: '#134E4A',
    },
    red: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',  // Main red
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
  },
  
  dark: {
    background: '#0A0A0A',      // hsl(0 0% 3.9%)
    foreground: '#FAFAFA',      // hsl(0 0% 98%)
    
    card: '#0A0A0A',
    cardForeground: '#FAFAFA',
    
    primary: '#FAFAFA',
    primaryForeground: '#171717',
    
    secondary: '#262626',       // hsl(0 0% 14.9%)
    secondaryForeground: '#FAFAFA',
    
    muted: '#262626',
    mutedForeground: '#A3A3A3', // hsl(0 0% 63.9%)
    
    accent: '#262626',
    accentForeground: '#FAFAFA',
    
    destructive: '#7F1D1D',     // hsl(0 62.8% 30.6%)
    destructiveForeground: '#FAFAFA',
    
    border: '#262626',
    input: '#262626',
    ring: '#D4D4D4',           // hsl(0 0% 83.1%)
    
    // Brand colors remain the same in dark mode
    rose: {
      50: '#FFF1F2',
      100: '#FFE4E6',
      200: '#FECDD3',
      300: '#FDA4AF',
      400: '#FB7185',
      500: '#F43F5E',
      600: '#E11D48',
      700: '#BE123C',
      800: '#9F1239',
      900: '#881337',
    },
    pink: {
      50: '#FDF2F8',
      100: '#FCE7F3',
      200: '#FBCFE8',
      300: '#F9A8D4',
      400: '#F472B6',
      500: '#EC4899',
      600: '#DB2777',
      700: '#BE185D',
      800: '#9D174D',
      900: '#831843',
    },
    purple: {
      50: '#FAF5FF',
      100: '#F3E8FF',
      200: '#E9D5FF',
      300: '#D8B4FE',
      400: '#C084FC',
      500: '#A855F7',
      600: '#9333EA',
      700: '#7E22CE',
      800: '#6B21A8',
      900: '#581C87',
    },
    orange: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316',
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
    },
    green: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },
    blue: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
    },
    cyan: {
      50: '#ECFEFF',
      100: '#CFFAFE',
      200: '#A5F3FC',
      300: '#67E8F9',
      400: '#22D3EE',
      500: '#06B6D4',
      600: '#0891B2',
      700: '#0E7490',
      800: '#155E75',
      900: '#164E63',
    },
    teal: {
      50: '#F0FDFA',
      100: '#CCFBF1',
      200: '#99F6E4',
      300: '#5EEAD4',
      400: '#2DD4BF',
      500: '#14B8A6',
      600: '#0D9488',
      700: '#0F766E',
      800: '#115E59',
      900: '#134E4A',
    },
    red: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

export const BorderRadius = {
  sm: 4,   // calc(var(--radius) - 4px)
  md: 6,   // calc(var(--radius) - 2px)
  lg: 8,   // var(--radius) = 0.5rem = 8px
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

export const FontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
};

export const theme = {
  colors: Colors.light,
  darkColors: Colors.dark,
  spacing: Spacing,
  borderRadius: BorderRadius,
  fontSize: FontSizes,
  fontWeight: FontWeights,
  shadows: Shadows,
};

export type Theme = typeof theme;

