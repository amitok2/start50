import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const BUSINESS_STEPS = [
  {
    id: 1,
    name: "גיבוש רעיון ומחקר שוק",
    description: "גלי מי הלקוחות שלך ומה הופך את העסק שלך לייחודי",
    motivationalText: "גיבושי את הרעיון שלך – זה הרגע לתת לחלום שלך מילים ✨",
    icon: 'bulb-outline',
    color: theme.colors.pink[500],
    subtasks: [
      "הגדרת הרעיון העסקי בבהירות",
      "זיהוי קהל היעד המדויק",
      "מחקר מתחרים ואנליזה תחרותית",
      "הגדרת הערך הייחודי של המוצר/השירות",
      "בדיקת כדאיות ראשונית"
    ]
  },
  {
    id: 2,
    name: "בניית תוכנית עסקית",
    description: "מפת הדרכים המפורטת שתוביל אותך להצלחה",
    motivationalText: "כתבי את תוכנית הפעולה שלך – בלי דחיות, רק צעדים קדימה 💪",
    icon: 'flag-outline',
    color: theme.colors.purple[500],
    subtasks: [
      "הגדרת חזון ומטרות העסק",
      "תכנון אסטרטגיית שיווק",
      "חישוב תחזית הכנסות והוצאות",
      "תכנון מבנה התפעול",
      "הגדרת מדדי הצלחה ויעדים"
    ]
  },
  {
    id: 3,
    name: "בחירת שם, לוגו ומיתוג",
    description: "זהות חזותית ומסר שיגרמו ללקוחות להתאהב בעסק שלך",
    motivationalText: "בחרי שם ולוגו – צרי את זהות העסק שלך היום! 🎨",
    icon: 'star-outline',
    color: theme.colors.rose[500],
    subtasks: [
      "בחירת שם העסק ובדיקת זמינות",
      "עיצוב לוגו או הזמנתו ממעצב",
      "הגדרת פלטת צבעים ופונטים",
      "יצירת סלוגן או מסר מרכזי",
      "הכנת קווים מנחים למיתוג"
    ]
  },
  {
    id: 4,
    name: "היבטים חוקיים וחשבונאיים",
    description: "כל הניירת והרישומים שיתנו לך שקט נפשי",
    motivationalText: "סיימי את הרישום והסידורים החוקיים עכשיו – את כמעט שם! 📋",
    icon: 'document-text-outline',
    color: theme.colors.gray[600],
    subtasks: [
      "בחירת מעמד עסקי (עוסק פטור/מורשה/בע\"מ)",
      "רישום במס הכנסה ומע\"מ",
      "רישום בביטוח לאומי",
      "בחירת רואה חשבון והסכמה איתו",
      "פתיחת חשבון בנק עסקי"
    ]
  },
  {
    id: 5,
    name: "בניית אתר ונוכחות דיגיטלית",
    description: "החנות הדיגיטלית שלך פתוחה 24/7",
    motivationalText: "בני את הבית הדיגיטלי של העסק שלך – זו החזית שלך לעולם! 🌐",
    icon: 'globe-outline',
    color: theme.colors.blue[500],
    subtasks: [
      "רכישת דומיין (שם אתר)",
      "בחירת פלטפורמת אתרים או מפתח",
      "עיצוב דפי אתר מרכזיים",
      "הקמת דפי רשתות חברתיות",
      "אופטימיזציה למנועי חיפוש (SEO)"
    ]
  },
  {
    id: 6,
    name: "תכנון שיווק ומכירות",
    description: "האסטרטגיה שתביא לך לקוחות",
    motivationalText: "כתבי את תוכנית השיווק שלך – איך תגיעי ללקוחות? 📣",
    icon: 'megaphone-outline',
    color: theme.colors.orange[500],
    subtasks: [
      "הגדרת תקציב שיווק",
      "בחירת ערוצי שיווק מתאימים",
      "יצירת תוכן שיווקי (טקסטים, תמונות)",
      "תכנון קמפיין השקה",
      "הגדרת מחירים והצעות ראשוניות"
    ]
  },
  {
    id: 7,
    name: "השקה והתנסות בשוק",
    description: "הרגע הגדול – פתיחת העסק!",
    motivationalText: "הגיע הזמן להשיק – את מוכנה! 🚀",
    icon: 'rocket-outline',
    color: theme.colors.green[500],
    subtasks: [
      "הכנת אירוע השקה או קמפיין",
      "פרסום לרשתות קיימות (משפחה, חברות)",
      "מכירה ללקוחות ראשונים",
      "איסוף משוב ולמידה",
      "התאמות בזמן אמת"
    ]
  },
];

export default function BusinessStepsPlanner() {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([1]));

  useEffect(() => {
    loadCompletedSteps();
  }, []);

  const loadCompletedSteps = async () => {
    try {
      const saved = await AsyncStorage.getItem('business-steps-completed');
      if (saved) {
        setCompletedSteps(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.error('Error loading steps:', error);
    }
  };

  const toggleStep = async (stepId: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
    
    try {
      await AsyncStorage.setItem('business-steps-completed', JSON.stringify([...newCompleted]));
    } catch (error) {
      console.error('Error saving steps:', error);
    }
  };

  const toggleExpanded = (stepId: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const getProgressPercentage = () => {
    return Math.round((completedSteps.size / BUSINESS_STEPS.length) * 100);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.purple[500], theme.colors.pink[500], theme.colors.rose[400]]}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Ionicons name="flag" size={64} color="white" />
          <Text style={styles.heroTitle}>תכנון עסקי חכם</Text>
          <Text style={styles.heroSubtitle}>
            בני את תכנית העסק שלך צעד אחר צעד
          </Text>
        </View>
      </LinearGradient>

      {/* Progress */}
      <View style={styles.progressSection}>
        <Card style={styles.progressCard}>
          <CardHeader>
            <CardTitle>ההתקדמות שלך</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>
                {completedSteps.size} מתוך {BUSINESS_STEPS.length} שלבים הושלמו
              </Text>
              <Text style={styles.progressPercentage}>{getProgressPercentage()}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[styles.progressBarFill, { width: `${getProgressPercentage()}%` }]} 
              />
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Steps */}
      <View style={styles.stepsContainer}>
        {BUSINESS_STEPS.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const isExpanded = expandedSteps.has(step.id);
          const isLast = index === BUSINESS_STEPS.length - 1;
          
          return (
            <View key={step.id} style={styles.stepWrapper}>
              <Card style={[styles.stepCard, isCompleted && styles.stepCardCompleted]}>
                <TouchableOpacity
                  onPress={() => toggleExpanded(step.id)}
                  activeOpacity={0.7}
                >
                  <CardHeader>
                    <View style={styles.stepHeader}>
                      <View style={[styles.stepNumberContainer, { backgroundColor: step.color }]}>
                        <Text style={styles.stepNumber}>{step.id}</Text>
                      </View>
                      <View style={styles.stepTitleContainer}>
                        <View style={styles.stepTitleRow}>
                          <CardTitle style={styles.stepTitle}>{step.name}</CardTitle>
                          {isCompleted && (
                            <Ionicons name="checkmark-circle" size={24} color={theme.colors.green[500]} />
                          )}
                        </View>
                        <Text style={styles.stepDescription}>{step.description}</Text>
                      </View>
                      <Ionicons 
                        name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                        size={24} 
                        color={theme.colors.gray[500]} 
                      />
                    </View>
                  </CardHeader>
                </TouchableOpacity>

                {isExpanded && (
                  <CardContent>
                    <View style={styles.motivationalBox}>
                      <Text style={styles.motivationalText}>{step.motivationalText}</Text>
                    </View>

                    <Text style={styles.subtasksTitle}>משימות לביצוע:</Text>
                    {step.subtasks.map((subtask, idx) => (
                      <View key={idx} style={styles.subtask}>
                        <View style={styles.subtaskBullet} />
                        <Text style={styles.subtaskText}>{subtask}</Text>
                      </View>
                    ))}

                    <TouchableOpacity
                      style={[
                        styles.completeButton,
                        isCompleted && styles.completeButtonActive
                      ]}
                      onPress={() => toggleStep(step.id)}
                    >
                      <Ionicons 
                        name={isCompleted ? "checkmark-circle" : "checkmark-circle-outline"} 
                        size={20} 
                        color="white" 
                      />
                      <Text style={styles.completeButtonText}>
                        {isCompleted ? 'שלב הושלם ✓' : 'סמני כהושלם'}
                      </Text>
                    </TouchableOpacity>
                  </CardContent>
                )}
              </Card>

              {!isLast && <View style={styles.connector} />}
            </View>
          );
        })}
      </View>

      {/* Completion Message */}
      {completedSteps.size === BUSINESS_STEPS.length && (
        <View style={styles.completionSection}>
          <Card style={styles.completionCard}>
            <CardContent>
              <Text style={styles.completionEmoji}>🎉</Text>
              <Text style={styles.completionTitle}>כל הכבוד!</Text>
              <Text style={styles.completionText}>
                השלמת את כל שלבי התכנון העסקי! את מוכנה להשיק את העסק שלך 🚀
              </Text>
            </CardContent>
          </Card>
        </View>
      )}

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
  progressSection: {
    padding: theme.spacing.lg,
  },
  progressCard: {
    ...theme.shadows.lg,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  progressText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    textAlign: 'right',
  },
  progressPercentage: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.purple[600],
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: theme.colors.gray[200],
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.purple[500],
    borderRadius: theme.borderRadius.full,
  },
  stepsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  stepWrapper: {
    position: 'relative',
  },
  stepCard: {
    ...theme.shadows.md,
    marginBottom: theme.spacing.md,
  },
  stepCardCompleted: {
    backgroundColor: theme.colors.green[50],
    borderColor: theme.colors.green[200],
    borderWidth: 2,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  stepNumberContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  stepNumber: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
  },
  stepTitleContainer: {
    flex: 1,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  stepTitle: {
    fontSize: theme.fontSize.lg,
    flex: 1,
  },
  stepDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    textAlign: 'right',
  },
  motivationalBox: {
    backgroundColor: theme.colors.orange[50],
    borderRightWidth: 4,
    borderRightColor: theme.colors.orange[500],
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  },
  motivationalText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.orange[800],
    fontWeight: theme.fontWeight.semibold,
    textAlign: 'right',
  },
  subtasksTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.md,
    textAlign: 'right',
  },
  subtask: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  subtaskBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.purple[500],
    marginTop: 8,
  },
  subtaskText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    textAlign: 'right',
    lineHeight: theme.fontSize.sm * 1.6,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.gray[500],
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.lg,
  },
  completeButtonActive: {
    backgroundColor: theme.colors.green[500],
  },
  completeButtonText: {
    color: 'white',
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
  },
  connector: {
    width: 2,
    height: 16,
    backgroundColor: theme.colors.gray[300],
    marginLeft: 40,
    marginBottom: theme.spacing.md,
  },
  completionSection: {
    padding: theme.spacing.lg,
  },
  completionCard: {
    backgroundColor: theme.colors.green[50],
    borderColor: theme.colors.green[200],
    borderWidth: 2,
  },
  completionEmoji: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  completionTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.green[800],
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  completionText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.green[700],
    textAlign: 'center',
    lineHeight: theme.fontSize.base * 1.6,
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

