import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent } from '@/components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';

const entrepreneurshipTools = [
  {
    id: 'checklist',
    title: 'הצ\'ק-ליסט המלא',
    description: 'כל השלבים לפתיחת עסק - מהרעיון ועד ההשקה',
    icon: 'checkmark-done',
    color: theme.colors.orange[500],
    route: '/business-startup-checklist',
  },
  {
    id: 'business-plan',
    title: 'תכנון עסקי חכם',
    description: 'בני את תכנית העסק שלך צעד אחר צעד',
    icon: 'document-text',
    color: theme.colors.purple[500],
    route: '/business-steps-planner',
  },
  {
    id: 'budget',
    title: 'מתכנן תקציב',
    description: 'נהלי את התקציב של העסק שלך',
    icon: 'calculator',
    color: theme.colors.rose[500],
    route: '/budget-planner',
  },
  {
    id: 'resources',
    title: 'ספריית משאבים',
    description: 'מדריכים, תבניות וכלים דיגיטליים',
    icon: 'library',
    color: theme.colors.pink[500],
    route: '/resource-library',
  },
];

export default function EntrepreneurshipHub() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={[theme.colors.orange[400], theme.colors.rose[400], theme.colors.pink[400]]}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <View style={styles.badge}>
            <Ionicons name="ribbon" size={20} color={theme.colors.orange[600]} />
            <Text style={styles.badgeText}>המסע שלך ליזמות ועצמאות</Text>
          </View>
          
          <Text style={styles.heroTitle}>המקום לעצמאית 🚀</Text>
          
          <Text style={styles.heroSubtitle}>
            חלמת על עסק משלך בגיל 50+? כאן תמצאי את כל השלבים, הכלים והמדריכים 
            שילוו אותך מהרעיון הראשון ועד להצלחה המלאה של העסק שלך! 💫
          </Text>
        </View>
      </LinearGradient>

      {/* Tools Grid */}
      <View style={styles.toolsContainer}>
        {entrepreneurshipTools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            onPress={() => router.push(tool.route as any)}
            activeOpacity={0.7}
          >
            <Card style={styles.toolCard}>
              <CardContent style={styles.toolContent}>
                <View style={[styles.iconContainer, { backgroundColor: `${tool.color}20` }]}>
                  <Ionicons name={tool.icon as any} size={32} color={tool.color} />
                </View>
                
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolDescription}>{tool.description}</Text>
                
                <View style={styles.arrow}>
                  <Ionicons name="arrow-back" size={20} color={theme.colors.gray[400]} />
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA Section */}
      <LinearGradient
        colors={[theme.colors.orange[50], theme.colors.rose[50]]}
        style={styles.cta}
      >
        <Text style={styles.ctaTitle}>מוכנה להתחיל?</Text>
        <Text style={styles.ctaText}>
          התחילי עם הצ'ק-ליסט המלא ותגלי את כל השלבים לפתיחת עסק מצליח
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => console.log('Start checklist')}
        >
          <LinearGradient
            colors={[theme.colors.orange[500], theme.colors.rose[500]]}
            style={styles.ctaButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaButtonText}>לצ'ק-ליסט המלא</Text>
            <Ionicons name="arrow-back" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

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
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.lg,
  },
  badgeText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.orange[700],
  },
  heroTitle: {
    fontSize: theme.fontSize['4xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  heroSubtitle: {
    fontSize: theme.fontSize.lg,
    color: 'white',
    textAlign: 'center',
    lineHeight: theme.fontSize.lg * 1.6,
    opacity: 0.95,
  },
  toolsContainer: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  toolCard: {
    ...theme.shadows.lg,
  },
  toolContent: {
    padding: theme.spacing.xl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  toolTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.sm,
    textAlign: 'right',
  },
  toolDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    lineHeight: theme.fontSize.sm * 1.6,
    textAlign: 'right',
    marginBottom: theme.spacing.md,
  },
  arrow: {
    alignSelf: 'flex-end',
  },
  cta: {
    margin: theme.spacing.lg,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius['2xl'],
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: theme.fontSize.base * 1.6,
  },
  ctaButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  ctaButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  ctaButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: 'white',
  },
  footer: {
    height: theme.spacing['4xl'],
  },
});

