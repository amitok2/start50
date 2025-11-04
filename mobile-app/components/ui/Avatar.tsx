import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle, ImageSourcePropType } from 'react-native';
import { theme } from '@/constants/theme';

interface AvatarProps {
  source?: ImageSourcePropType;
  size?: number;
  fallback?: string;
  style?: ViewStyle;
}

export function Avatar({ 
  source, 
  size = 40, 
  fallback, 
  style 
}: AvatarProps) {
  return (
    <View style={[styles.avatar, { width: size, height: size }, style]}>
      {source ? (
        <Image source={source} style={styles.image} />
      ) : (
        <View style={styles.fallback}>
          <Text style={[styles.fallbackText, { fontSize: size * 0.4 }]}>
            {fallback || '?'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    backgroundColor: theme.colors.muted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.muted,
  },
  fallbackText: {
    color: theme.colors.mutedForeground,
    fontWeight: theme.fontWeight.medium,
  },
});

