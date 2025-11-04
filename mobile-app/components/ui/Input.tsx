import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { theme } from '@/constants/theme';

export interface InputProps extends TextInputProps {
  // Additional custom props can be added here
}

export function Input({ style, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={theme.colors.mutedForeground}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 36,
    width: '100%',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.input,
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
    ...theme.shadows.sm,
  },
});

