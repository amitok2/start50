import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ServicesHighlight from '@/components/home/ServicesHighlight';
import { theme } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={[theme.colors.rose[50], theme.colors.pink[50], '#FFFFFF']}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>ברוכה הבאה ל-Base44</Text>
          <Text style={styles.heroSubtitle}>
            המקום שלך להתחיל מחדש בגיל 50+
          </Text>
          <Text style={styles.heroDescription}>
            כאן תמצאי כלים, השראה וקהילה תומכת שתעזור לך לממש את החלומות שלך
          </Text>
        </View>
      </LinearGradient>

      {/* Services Highlight */}
      <ServicesHighlight />

      {/* Additional sections can be added here */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          הצטרפי לאלפי נשים שכבר מממשות את עצמן
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  hero: {
    paddingVertical: theme.spacing['5xl'],
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 600,
  },
  heroTitle: {
    fontSize: theme.fontSize['4xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  heroSubtitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.rose[600],
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  heroDescription: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.gray[600],
    textAlign: 'center',
    lineHeight: theme.fontSize.lg * 1.6,
  },
  footer: {
    paddingVertical: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    backgroundColor: theme.colors.gray[50],
    marginTop: theme.spacing['4xl'],
  },
  footerText: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[700],
    textAlign: 'center',
  },
});

