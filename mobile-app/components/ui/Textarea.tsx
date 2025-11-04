import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { theme } from '@/constants/theme';

interface TextareaProps extends TextInputProps {
  // Additional custom props can be added here
}

export function Textarea({ style, ...props }: TextareaProps) {
  return (
    <TextInput
      style={[styles.textarea, style]}
      placeholderTextColor={theme.colors.mutedForeground}
      multiline
      textAlignVertical="top"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  textarea: {
    width: '100%',
    minHeight: 80,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.input,
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
    ...theme.shadows.sm,
  },
});

