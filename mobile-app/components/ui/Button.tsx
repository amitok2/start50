import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
  gradientColors?: string[];
}

export function Button({
  variant = 'default',
  size = 'default',
  loading = false,
  disabled,
  style,
  children,
  gradientColors,
  ...props
}: ButtonProps) {
  const buttonStyles = [
    styles.base,
    styles[`size_${size}`],
    variant !== 'gradient' && styles[`variant_${variant}`],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${size}`],
    variant !== 'gradient' && styles[`text_${variant}`],
    disabled && styles.textDisabled,
  ];

  const content = (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={
            variant === 'default' || variant === 'gradient'
              ? theme.colors.primaryForeground
              : theme.colors.foreground
          }
          style={styles.loader}
        />
      )}
      {typeof children === 'string' ? (
        <Text style={textStyles}>{children}</Text>
      ) : (
        children
      )}
    </>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity disabled={disabled || loading} {...props}>
        <LinearGradient
          colors={gradientColors || [theme.colors.purple[500], theme.colors.pink[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.base, styles[`size_${size}`], styles.gradient, style]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  
  // Sizes
  size_default: {
    height: 36,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  size_sm: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.md,
  },
  size_lg: {
    height: 40,
    paddingHorizontal: 32,
    borderRadius: theme.borderRadius.md,
  },
  size_icon: {
    height: 36,
    width: 36,
    paddingHorizontal: 0,
  },
  
  // Variants
  variant_default: {
    backgroundColor: theme.colors.primary,
  },
  variant_destructive: {
    backgroundColor: theme.colors.destructive,
  },
  variant_outline: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  variant_secondary: {
    backgroundColor: theme.colors.secondary,
  },
  variant_ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  variant_link: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  gradient: {
    shadowOpacity: 0,
    elevation: 0,
  },
  
  disabled: {
    opacity: 0.5,
  },
  
  // Text styles
  text: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  text_sm: {
    fontSize: theme.fontSize.xs,
  },
  text_lg: {
    fontSize: theme.fontSize.base,
  },
  text_default: {
    fontSize: theme.fontSize.sm,
  },
  text_icon: {
    fontSize: 0,
  },
  
  // Text variants
  text_default: {
    color: theme.colors.primaryForeground,
  },
  text_destructive: {
    color: theme.colors.destructiveForeground,
  },
  text_outline: {
    color: theme.colors.foreground,
  },
  text_secondary: {
    color: theme.colors.secondaryForeground,
  },
  text_ghost: {
    color: theme.colors.foreground,
  },
  text_link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  text_gradient: {
    color: theme.colors.primaryForeground,
  },
  
  textDisabled: {
    opacity: 1,
  },
  
  loader: {
    marginRight: 8,
  },
});

