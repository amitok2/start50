import React from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const { width } = Dimensions.get('window');
const BADGE_SIZE = (width - 64) / 3; // 3 badges per row with margins

const sampleBadges = [
  {
    id: '1',
    name: 'התחלה חדשה',
    description: 'השלמת הפרופיל',
    icon: 'star',
    color: theme.colors.orange[500],
    earned: true,
    earnedDate: '1 ינואר 2024',
  },
  {
    id: '2',
    name: 'לומדת נצחית',
    description: 'השלמת קורס ראשון',
    icon: 'school',
    color: theme.colors.purple[500],
    earned: true,
    earnedDate: '10 ינואר 2024',
  },
  {
    id: '3',
    name: 'מחוברת',
    description: 'פגישה עם מאמנת',
    icon: 'people',
    color: theme.colors.pink[500],
    earned: true,
    earnedDate: '15 ינואר 2024',
  },
  {
    id: '4',
    name: 'משתפת',
    description: 'פרסום ראשון בקהילה',
    icon: 'chatbubbles',
    color: theme.colors.rose[500],
    earned: false,
    earnedDate: null,
  },
  {
    id: '5',
    name: 'יזמית',
    description: 'השלמת תכנית עסקית',
    icon: 'rocket',
    color: theme.colors.orange[600],
    earned: false,
    earnedDate: null,
  },
  {
    id: '6',
    name: 'מובילה',
    description: 'עזרה ל-5 חברות',
    icon: 'trophy',
    color: theme.colors.purple[600],
    earned: false,
    earnedDate: null,
  },
];

export default function MyBadgesScreen() {
  const earnedBadges = sampleBadges.filter(b => b.earned);
  const lockedBadges = sampleBadges.filter(b => !b.earned);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.purple[400], theme.colors.pink[400], theme.colors.rose[400]]}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>🏆 התגים שלי</Text>
          <Text style={styles.heroSubtitle}>
            הישגים והצלחות שלך במסע
          </Text>
          <View style={styles.stats}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{earnedBadges.length}</Text>
              <Text style={styles.statLabel}>תגים</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{lockedBadges.length}</Text>
              <Text style={styles.statLabel}>עוד לפתוח</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Earned Badges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>התגים שלך 🎉</Text>
        <View style={styles.badgesGrid}>
          {earnedBadges.map((badge) => (
            <View key={badge.id} style={styles.badgeContainer}>
              <View style={[styles.badgeCircle, { backgroundColor: badge.color }]}>
                <Ionicons name={badge.icon as any} size={32} color="white" />
              </View>
              <Text style={styles.badgeName}>{badge.name}</Text>
              <Text style={styles.badgeDate}>{badge.earnedDate}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Locked Badges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>תגים לפתיחה 🔒</Text>
        <View style={styles.badgesGrid}>
          {lockedBadges.map((badge) => (
            <View key={badge.id} style={styles.badgeContainer}>
              <View style={[styles.badgeCircle, styles.lockedBadge]}>
                <Ionicons name="lock-closed" size={32} color={theme.colors.gray[400]} />
              </View>
              <Text style={styles.badgeNameLocked}>{badge.name}</Text>
              <Text style={styles.badgeDescription}>{badge.description}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer} />
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
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: theme.fontSize['4xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    marginBottom: theme.spacing.md,
  },
  heroSubtitle: {
    fontSize: theme.fontSize.lg,
    color: 'white',
    opacity: 0.95,
    marginBottom: theme.spacing.xl,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.borderRadius['2xl'],
    padding: theme.spacing.xl,
    gap: theme.spacing.xl,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.fontSize['4xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: 'white',
    opacity: 0.9,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.lg,
    textAlign: 'right',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  badgeContainer: {
    width: BADGE_SIZE,
    alignItems: 'center',
  },
  badgeCircle: {
    width: BADGE_SIZE - 20,
    height: BADGE_SIZE - 20,
    borderRadius: (BADGE_SIZE - 20) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    ...theme.shadows.lg,
  },
  lockedBadge: {
    backgroundColor: theme.colors.gray[200],
  },
  badgeName: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  badgeNameLocked: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray[500],
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  badgeDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[500],
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[400],
    textAlign: 'center',
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

