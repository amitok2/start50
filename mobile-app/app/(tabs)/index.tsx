import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import ServicesHighlight from '@/components/home/ServicesHighlight';
import { Card, CardContent } from '@/components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const quickLinks = [
  { title: 'הקריירה שלי', route: '/career-referrals', icon: 'briefcase', color: theme.colors.blue[500] },
  { title: 'קהילה', route: '/community', icon: 'chatbubbles', color: theme.colors.rose[500] },
  { title: 'פעילויות וחוויות', route: '/courses-and-events', icon: 'calendar', color: theme.colors.purple[500] },
  { title: 'יזמות', route: '/entrepreneurship-hub', icon: 'rocket', color: theme.colors.orange[500] },
  { title: 'מאמרים', route: '/articles', icon: 'newspaper', color: theme.colors.pink[500] },
  { title: 'להכיר חברות', route: '/social-tinder', icon: 'people', color: theme.colors.teal[500] },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={[theme.colors.rose[50], theme.colors.pink[50], '#FFFFFF']}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>🌸 ברוכה הבאה לקהילת ReStart 50+</Text>
          <Text style={styles.heroSubtitle}>
            המקום שלך להתחיל מחדש בגיל 50+
          </Text>
          <Text style={styles.heroDescription}>
            כאן תמצאי כלים, השראה וקהילה תומכת שתעזור לך לממש את החלומות שלך
          </Text>
        </View>
      </LinearGradient>

      {/* Quick Links */}
      <View style={styles.quickLinksContainer}>
        <Text style={styles.sectionTitle}>קיצורי דרך</Text>
        <View style={styles.quickLinksGrid}>
          {quickLinks.map((link) => (
            <TouchableOpacity
              key={link.route}
              onPress={() => router.push(link.route as any)}
              style={styles.quickLink}
            >
              <View style={[styles.quickLinkIcon, { backgroundColor: `${link.color}20` }]}>
                <Ionicons name={link.icon as any} size={24} color={link.color} />
              </View>
              <Text style={styles.quickLinkText}>{link.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Services Highlight */}
      <ServicesHighlight />

      {/* Footer CTA */}
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
  quickLinksContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.lg,
    textAlign: 'right',
  },
  quickLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  quickLink: {
    width: '47%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  quickLinkIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  quickLinkText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[700],
    textAlign: 'center',
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

