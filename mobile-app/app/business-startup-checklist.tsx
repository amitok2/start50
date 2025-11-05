import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const checklistSteps = [
  {
    id: 'planning',
    title: 'שלב התכנון והחקירה',
    icon: 'bulb',
    color: theme.colors.purple[500],
    items: [
      { id: 'idea', text: 'בדיקת כדאיות הרעיון העסקי', description: 'בחינת השוק והתחרות' },
      { id: 'research', text: 'מחקר שוק מעמיק', description: 'זיהוי קהל היעד והצרכים שלו' },
      { id: 'business_plan', text: 'כתיבת תוכנית עסקית', description: 'הגדרת מטרות, אסטרטגיה ותחזיות כספיות' },
      { id: 'budget', text: 'חישוב תקציב התחלתי', description: 'הערכת ההשקעה הנדרשת והוצאות חודשיות' }
    ]
  },
  {
    id: 'legal',
    title: 'רישוי וסידורים משפטיים',
    icon: 'document-text',
    color: theme.colors.blue[500],
    items: [
      { id: 'business_type', text: 'בחירת סוג התארגנות עסקית', description: 'עוסק פטור/מורשה, חברה בע״מ או שותפות' },
      { id: 'tax_registration', text: 'רישום במס הכנסה', description: 'קבלת מספר עוסק ורישום לצורכי מס' },
      { id: 'vat_registration', text: 'רישום למע״מ (במידת הצורך)', description: 'אם המחזור הצפוי עולה על הסכום הקבוע בחוק' },
      { id: 'insurance', text: 'ביטוח עסקי', description: 'ביטוח אחריות מקצועית וציוד' }
    ]
  },
  {
    id: 'financial',
    title: 'הקמה פיננסית',
    icon: 'card',
    color: theme.colors.green[500],
    items: [
      { id: 'bank_account', text: 'פתיחת חשבון בנק עסקי', description: 'הפרדה בין הכספים האישיים לעסקיים' },
      { id: 'accounting_system', text: 'הקמת מערכת הנהלת חשבונות', description: 'בחירת תוכנה או רואה חשבון' },
      { id: 'payment_methods', text: 'הקמת אמצעי תשלום', description: 'כרטיסי אשראי, העברות בנקאיות' },
      { id: 'funding', text: 'גיוס מימון (במידת הצורך)', description: 'הלוואות, משקיעים או מענקים ממשלתיים' }
    ]
  },
  {
    id: 'branding',
    title: 'מיתוג ונוכחות דיגיטלית',
    icon: 'globe',
    color: theme.colors.orange[500],
    items: [
      { id: 'logo_design', text: 'עיצוב לוגו ומיתוג', description: 'יצירת זהות עיצובית עקבית' },
      { id: 'website', text: 'בניית אתר אינטרנט', description: 'דף נחיתה או חנות אונליין' },
      { id: 'social_media', text: 'הקמת דפי רשתות חברתיות', description: 'פייסבוק, אינסטגרם, לינקדאין' },
      { id: 'marketing_materials', text: 'עיצוב חומרי שיווק', description: 'כרטיסי ביקור, עלונים, קטלוגים' }
    ]
  },
];

export default function BusinessStartupChecklist() {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['planning']));

  useEffect(() => {
    loadCompletedItems();
  }, []);

  const loadCompletedItems = async () => {
    try {
      const saved = await AsyncStorage.getItem('business-checklist-completed');
      if (saved) {
        setCompletedItems(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.error('Error loading checklist:', error);
    }
  };

  const toggleItem = async (itemId: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);
    
    try {
      await AsyncStorage.setItem('business-checklist-completed', JSON.stringify([...newCompleted]));
    } catch (error) {
      console.error('Error saving checklist:', error);
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getTotalItems = () => {
    return checklistSteps.reduce((total, section) => total + section.items.length, 0);
  };

  const getCompletedCount = () => {
    return completedItems.size;
  };

  const getProgressPercentage = () => {
    const total = getTotalItems();
    return total > 0 ? Math.round((getCompletedCount() / total) * 100) : 0;
  };

  const getSectionProgress = (section: typeof checklistSteps[0]) => {
    const sectionItemsLength = section.items.length;
    if (sectionItemsLength === 0) return 0;
    const sectionCompleted = section.items.filter(item => completedItems.has(item.id)).length;
    return Math.round((sectionCompleted / sectionItemsLength) * 100);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.orange[400], theme.colors.rose[400], theme.colors.pink[400]]}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Ionicons name="checkmark-circle" size={64} color="white" />
          <Text style={styles.heroTitle}>צ'ק-ליסט הקמת עסק</Text>
          <Text style={styles.heroSubtitle}>
            כל השלבים לפתיחת עסק - מהרעיון ועד ההשקה
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
                {getCompletedCount()} מתוך {getTotalItems()} משימות הושלמו
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

      {/* Checklist Sections */}
      <View style={styles.sectionsContainer}>
        {checklistSteps.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const progress = getSectionProgress(section);
          
          return (
            <Card key={section.id} style={styles.sectionCard}>
              <TouchableOpacity
                onPress={() => toggleSection(section.id)}
                activeOpacity={0.7}
              >
                <CardHeader style={styles.sectionHeader}>
                  <View style={styles.sectionHeaderContent}>
                    <View style={[styles.sectionIcon, { backgroundColor: `${section.color}20` }]}>
                      <Ionicons name={section.icon as any} size={24} color={section.color} />
                    </View>
                    <View style={styles.sectionTitleContainer}>
                      <CardTitle style={styles.sectionTitle}>{section.title}</CardTitle>
                      <Text style={styles.sectionProgress}>{progress}% הושלם</Text>
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
                  {section.items.map((item) => {
                    const isCompleted = completedItems.has(item.id);
                    
                    return (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => toggleItem(item.id)}
                        activeOpacity={0.7}
                        style={styles.item}
                      >
                        <View style={styles.itemContent}>
                          <View style={[
                            styles.checkbox,
                            isCompleted && styles.checkboxChecked
                          ]}>
                            {isCompleted && (
                              <Ionicons name="checkmark" size={18} color="white" />
                            )}
                          </View>
                          <View style={styles.itemText}>
                            <Text style={[
                              styles.itemTitle,
                              isCompleted && styles.itemTitleCompleted
                            ]}>
                              {item.text}
                            </Text>
                            <Text style={styles.itemDescription}>{item.description}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </CardContent>
              )}
            </Card>
          );
        })}
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
    color: theme.colors.orange[600],
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: theme.colors.gray[200],
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.orange[500],
    borderRadius: theme.borderRadius.full,
  },
  sectionsContainer: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  sectionCard: {
    ...theme.shadows.md,
  },
  sectionHeader: {
    paddingVertical: theme.spacing.lg,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitleContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    marginBottom: theme.spacing.xs,
  },
  sectionProgress: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
  },
  item: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.orange[500],
    borderColor: theme.colors.orange[500],
  },
  itemText: {
    flex: 1,
    alignItems: 'flex-end',
  },
  itemTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
    textAlign: 'right',
    marginBottom: theme.spacing.xs,
  },
  itemTitleCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.gray[500],
  },
  itemDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    textAlign: 'right',
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

