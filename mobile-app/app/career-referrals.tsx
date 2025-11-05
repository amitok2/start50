import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';

const careerTools = [
  {
    id: 'cv-enhancer',
    title: 'שדרוג קו"ח ולינקדאין',
    description: 'קבלי סיוע AI לשדרוג הקו"ח והלינקדאין שלך',
    icon: 'document-text',
    color: theme.colors.purple[500],
    route: '/cv-linkedin-enhancer',
  },
  {
    id: 'interview-prep',
    title: 'הכנה לראיון עבודה',
    description: 'התאמני לראיון דרך AI חכם',
    icon: 'school',
    color: theme.colors.blue[500],
    route: '/interview-prep-ai',
  },
];

const quickActions = [
  {
    id: 'upload-cv',
    title: 'העלאת קו"ח',
    description: 'העלי את קורות החיים שלך',
    icon: 'cloud-upload',
    color: theme.colors.green[500],
  },
  {
    id: 'job-search',
    title: 'חיפוש משרות',
    description: 'מצאי את המשרה המושלמת',
    icon: 'search',
    color: theme.colors.orange[500],
  },
];

export default function CareerReferralsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.blue[600], theme.colors.purple[500], theme.colors.pink[400]]}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Ionicons name="briefcase" size={64} color="white" />
          <Text style={styles.heroTitle}>הקריירה שלי</Text>
          <Text style={styles.heroSubtitle}>
            כלים להצלחה מקצועית בגיל 50+
          </Text>
        </View>
      </LinearGradient>

      {/* Career Tools */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>כלים מקצועיים</Text>
        {careerTools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            onPress={() => router.push(tool.route as any)}
            activeOpacity={0.7}
          >
            <Card style={styles.toolCard}>
              <CardContent>
                <View style={styles.toolRow}>
                  <View style={[styles.iconContainer, { backgroundColor: `${tool.color}20` }]}>
                    <Ionicons name={tool.icon as any} size={32} color={tool.color} />
                  </View>
                  <View style={styles.toolContent}>
                    <Text style={styles.toolTitle}>{tool.title}</Text>
                    <Text style={styles.toolDescription}>{tool.description}</Text>
                  </View>
                  <Ionicons name="chevron-back" size={24} color={theme.colors.gray[400]} />
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>פעולות מהירות</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              activeOpacity={0.7}
              onPress={() => console.log(action.id)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon as any} size={28} color="white" />
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
              <Text style={styles.quickActionDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tips Card */}
      <View style={styles.section}>
        <Card style={styles.tipsCard}>
          <CardHeader>
            <CardTitle>
              <Ionicons name="bulb" size={20} color={theme.colors.orange[600]} />
              {' '}היתרונות שלך בגיל 50+
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text style={styles.tipText}>✨ ניסיון עשיר ומגוון</Text>
            <Text style={styles.tipText}>✨ בגרות ויציבות רגשית</Text>
            <Text style={styles.tipText}>✨ כישורי תקשורת מפותחים</Text>
            <Text style={styles.tipText}>✨ הבנה עמוקה של צרכי לקוחות</Text>
            <Text style={styles.tipText}>✨ מנטורינג ופיתוח עובדים</Text>
          </CardContent>
        </Card>
      </View>

      {/* CTA Section */}
      <View style={styles.section}>
        <Card style={styles.ctaCard}>
          <CardContent>
            <Text style={styles.ctaEmoji}>🎯</Text>
            <Text style={styles.ctaTitle}>מוכנה לקפיצת מדרגה?</Text>
            <Text style={styles.ctaText}>
              התחילי עם שדרוג הקו"ח והלינקדאין שלך, והכיני את עצמך לראיון הבא!
            </Text>
            <Button
              variant="gradient"
              gradientColors={[theme.colors.purple[500], theme.colors.pink[500]]}
              onPress={() => router.push('/cv-linkedin-enhancer' as any)}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaButtonText}>התחילי עכשיו</Text>
            </Button>
          </CardContent>
        </Card>
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
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: theme.fontSize.base,
    color: 'white',
    opacity: 0.95,
    textAlign: 'center',
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
  toolCard: {
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolContent: {
    flex: 1,
  },
  toolTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.xs,
    textAlign: 'right',
  },
  toolDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    textAlign: 'right',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  quickActionTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  quickActionDescription: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[600],
    textAlign: 'center',
  },
  tipsCard: {
    backgroundColor: theme.colors.orange[50],
    borderColor: theme.colors.orange[100],
  },
  tipText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    textAlign: 'right',
    lineHeight: theme.fontSize.base * 1.8,
    marginBottom: theme.spacing.md,
  },
  ctaCard: {
    backgroundColor: theme.colors.purple[50],
    borderColor: theme.colors.purple[200],
    borderWidth: 2,
  },
  ctaEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  ctaTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.purple[900],
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  ctaText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.purple[800],
    textAlign: 'center',
    lineHeight: theme.fontSize.base * 1.6,
    marginBottom: theme.spacing.xl,
  },
  ctaButton: {
    marginTop: theme.spacing.md,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

