import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, ViewProps } from 'react-native';
import { theme } from '@/constants/theme';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({ 
  variant = 'default', 
  children, 
  style,
  textStyle,
  ...props 
}: BadgeProps) {
  return (
    <View 
      style={[
        styles.badge, 
        styles[`variant_${variant}`],
        style
      ]} 
      {...props}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.text, styles[`text_${variant}`], textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  
  // Variants
  variant_default: {
    borderColor: 'transparent',
    backgroundColor: theme.colors.primary,
  },
  variant_secondary: {
    borderColor: 'transparent',
    backgroundColor: theme.colors.secondary,
  },
  variant_destructive: {
    borderColor: 'transparent',
    backgroundColor: theme.colors.destructive,
  },
  variant_outline: {
    borderColor: theme.colors.border,
    backgroundColor: 'transparent',
  },
  
  // Text styles
  text: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
  },
  text_default: {
    color: theme.colors.primaryForeground,
  },
  text_secondary: {
    color: theme.colors.secondaryForeground,
  },
  text_destructive: {
    color: theme.colors.destructiveForeground,
  },
  text_outline: {
    color: theme.colors.foreground,
  },
});

