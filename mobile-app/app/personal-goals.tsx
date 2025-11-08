import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { rtlView, rtlText } from '@/utils/rtl';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'completed' | 'paused';
  target_date?: string;
  progress: number;
  created_date: string;
}

const categories = [
  { label: 'קריירה', value: 'career', icon: 'briefcase', color: theme.colors.blue[500] },
  { label: 'בריאות', value: 'health', icon: 'fitness', color: theme.colors.green[500] },
  { label: 'משפחה', value: 'family', icon: 'people', color: theme.colors.purple[500] },
  { label: 'כספים', value: 'finance', icon: 'cash', color: theme.colors.orange[500] },
  { label: 'אישי', value: 'personal', icon: 'heart', color: theme.colors.rose[500] },
  { label: 'לימודים', value: 'education', icon: 'school', color: theme.colors.cyan[500] },
];

const sampleGoals: Goal[] = [
  {
    id: '1',
    title: 'למצוא עבודה חדשה',
    description: 'חיפוש עבודה בתחום שיווק דיגיטלי',
    category: 'career',
    status: 'active',
    target_date: '2025-12-31',
    progress: 60,
    created_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'לעשות יוגה 3 פעמים בשבוע',
    description: 'שיפור כושר ובריאות כללית',
    category: 'health',
    status: 'active',
    progress: 40,
    created_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'לחסוך 10,000 ₪',
    description: 'חיסכון לחופשה משפחתית',
    category: 'finance',
    status: 'active',
    target_date: '2025-09-01',
    progress: 75,
    created_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function PersonalGoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>(sampleGoals);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal',
    target_date: '',
  });

  const handleCreateGoal = () => {
    if (!newGoal.title.trim()) {
      Alert.alert('שגיאה', 'יש למלא שם למטרה');
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      status: 'active',
      progress: 0,
      created_date: new Date().toISOString(),
    };

    setGoals([goal, ...goals]);
    setNewGoal({ title: '', description: '', category: 'personal', target_date: '' });
    setShowCreateModal(false);
    Alert.alert('הצלחה!', 'המטרה נוספה בהצלחה');
  };

  const handleUpdateProgress = (goalId: string, newProgress: number) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const status = newProgress >= 100 ? 'completed' : goal.status;
          return { ...goal, progress: Math.min(newProgress, 100), status };
        }
        return goal;
      })
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    Alert.alert('מחיקת מטרה', 'האם את בטוחה שברצונך למחוק מטרה זו?', [
      { text: 'ביטול', style: 'cancel' },
      {
        text: 'מחיקה',
        style: 'destructive',
        onPress: () => setGoals(goals.filter((g) => g.id !== goalId)),
      },
    ]);
  };

  const getCategoryData = (categoryValue: string) => {
    return categories.find((c) => c.value === categoryValue) || categories[0];
  };

  const filteredGoals = goals.filter((goal) => {
    if (filter === 'all') return true;
    return goal.status === filter;
  });

  const stats = {
    total: goals.length,
    active: goals.filter((g) => g.status === 'active').length,
    completed: goals.filter((g) => g.status === 'completed').length,
    avgProgress: goals.length > 0
      ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
      : 0,
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient
          colors={[theme.colors.cyan[400], theme.colors.teal[400], theme.colors.green[400]]}
          style={styles.hero}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroIcon}>
              <Ionicons name="flag" size={48} color="white" />
            </View>
            <Text style={styles.heroTitle}>המטרות שלי</Text>
            <Text style={styles.heroSubtitle}>
              חלום גדול מתחיל בצעד קטן. הגדירי, עקבי והשיגי את המטרות שלך.
            </Text>
          </View>
        </LinearGradient>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="list" size={24} color={theme.colors.teal[500]} />
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>סה"כ מטרות</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="rocket" size={24} color={theme.colors.blue[500]} />
            <Text style={styles.statNumber}>{stats.active}</Text>
            <Text style={styles.statLabel}>מטרות פעילות</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.green[500]} />
            <Text style={styles.statNumber}>{stats.completed}</Text>
            <Text style={styles.statLabel}>הושלמו</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={24} color={theme.colors.purple[500]} />
            <Text style={styles.statNumber}>{stats.avgProgress}%</Text>
            <Text style={styles.statLabel}>ממוצע התקדמות</Text>
          </View>
        </View>

        {/* Create Goal Button */}
        <View style={styles.createButtonContainer}>
          <Button
            variant="gradient"
            gradientColors={[theme.colors.teal[500], theme.colors.cyan[600]]}
            onPress={() => setShowCreateModal(true)}
            style={styles.createButton}
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text style={styles.createButtonText}>מטרה חדשה</Text>
          </Button>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === 'all' && styles.filterTabTextActive,
              ]}
            >
              הכל ({goals.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'active' && styles.filterTabActive]}
            onPress={() => setFilter('active')}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === 'active' && styles.filterTabTextActive,
              ]}
            >
              פעילות ({stats.active})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'completed' && styles.filterTabActive]}
            onPress={() => setFilter('completed')}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === 'completed' && styles.filterTabTextActive,
              ]}
            >
              הושלמו ({stats.completed})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Goals List */}
        <View style={styles.goalsContainer}>
          {filteredGoals.length === 0 ? (
            <Card style={styles.emptyCard}>
              <CardContent>
                <Ionicons
                  name="flag-outline"
                  size={64}
                  color={theme.colors.gray[300]}
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyText}>עדיין אין לך מטרות</Text>
                <Text style={styles.emptySubtext}>הוסיפי מטרה ראשונה והתחילי את המסע!</Text>
              </CardContent>
            </Card>
          ) : (
            filteredGoals.map((goal) => {
              const categoryData = getCategoryData(goal.category);
              return (
                <Card key={goal.id} style={styles.goalCard}>
                  <CardHeader>
                    <View style={[styles.goalHeader, rtlView]}>
                      <View style={styles.goalTitleRow}>
                        <View
                          style={[
                            styles.categoryIcon,
                            { backgroundColor: `${categoryData.color}20` },
                          ]}
                        >
                          <Ionicons
                            name={categoryData.icon as any}
                            size={24}
                            color={categoryData.color}
                          />
                        </View>
                        <View style={styles.goalTitleContainer}>
                          <Text style={[styles.goalTitle, rtlText]}>{goal.title}</Text>
                          <Text style={[styles.categoryLabel, rtlText]}>
                            {categoryData.label}
                          </Text>
                        </View>
                      </View>
                      <Badge
                        style={{
                          backgroundColor:
                            goal.status === 'completed'
                              ? theme.colors.green[100]
                              : goal.status === 'paused'
                              ? theme.colors.gray[100]
                              : theme.colors.blue[100],
                        }}
                        textStyle={{
                          color:
                            goal.status === 'completed'
                              ? theme.colors.green[700]
                              : goal.status === 'paused'
                              ? theme.colors.gray[700]
                              : theme.colors.blue[700],
                        }}
                      >
                        {goal.status === 'completed' ? 'הושלמה' : 'פעילה'}
                      </Badge>
                    </View>
                  </CardHeader>
                  <CardContent>
                    {goal.description && (
                      <Text style={[styles.goalDescription, rtlText]}>
                        {goal.description}
                      </Text>
                    )}

                    {/* Progress Bar */}
                    <View style={styles.progressSection}>
                      <View style={[styles.progressHeader, rtlView]}>
                        <Text style={[styles.progressLabel, rtlText]}>התקדמות</Text>
                        <Text style={styles.progressPercentage}>{goal.progress}%</Text>
                      </View>
                      <View style={styles.progressBarContainer}>
                        <View
                          style={[
                            styles.progressBar,
                            {
                              width: `${goal.progress}%`,
                              backgroundColor: categoryData.color,
                            },
                          ]}
                        />
                      </View>
                    </View>

                    {/* Progress Controls */}
                    {goal.status === 'active' && (
                      <View style={styles.progressControls}>
                        <TouchableOpacity
                          style={styles.progressButton}
                          onPress={() => handleUpdateProgress(goal.id, goal.progress - 10)}
                          disabled={goal.progress === 0}
                        >
                          <Ionicons name="remove" size={20} color={theme.colors.gray[600]} />
                        </TouchableOpacity>
                        <Text style={styles.progressControlText}>עדכון התקדמות</Text>
                        <TouchableOpacity
                          style={styles.progressButton}
                          onPress={() => handleUpdateProgress(goal.id, goal.progress + 10)}
                          disabled={goal.progress === 100}
                        >
                          <Ionicons name="add" size={20} color={theme.colors.teal[600]} />
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Actions */}
                    <View style={[styles.goalActions, rtlView]}>
                      {goal.target_date && (
                        <View style={styles.targetDate}>
                          <Ionicons
                            name="calendar-outline"
                            size={16}
                            color={theme.colors.gray[600]}
                          />
                          <Text style={styles.targetDateText}>
                            {new Date(goal.target_date).toLocaleDateString('he-IL')}
                          </Text>
                        </View>
                      )}
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteGoal(goal.id)}
                      >
                        <Ionicons name="trash-outline" size={18} color={theme.colors.red[500]} />
                      </TouchableOpacity>
                    </View>
                  </CardContent>
                </Card>
              );
            })
          )}
        </View>

        {/* Motivational Quote */}
        <Card style={styles.quoteCard}>
          <CardContent>
            <Ionicons name="bulb" size={32} color={theme.colors.orange[500]} style={styles.quoteIcon} />
            <Text style={[styles.quoteText, rtlText]}>
              "אין גיל שבו כבר מאוחר מדי להגדיר מטרות חדשות ולהגשים חלומות"
            </Text>
            <Text style={[styles.quoteAuthor, rtlText]}>- C.S. Lewis</Text>
          </CardContent>
        </Card>

        <View style={styles.footer} />
      </ScrollView>

      {/* Create Goal Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Ionicons name="close" size={28} color={theme.colors.gray[700]} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>מטרה חדשה</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={[styles.inputLabel, rtlText]}>שם המטרה</Text>
            <TextInput
              style={[styles.input, rtlText]}
              placeholder="למשל: לפתוח עסק משלי"
              value={newGoal.title}
              onChangeText={(text) => setNewGoal({ ...newGoal, title: text })}
              textAlign="right"
            />

            <Text style={[styles.inputLabel, rtlText]}>תיאור</Text>
            <TextInput
              style={[styles.textArea, rtlText]}
              placeholder="תארי את המטרה בפירוט..."
              value={newGoal.description}
              onChangeText={(text) => setNewGoal({ ...newGoal, description: text })}
              multiline
              numberOfLines={4}
              textAlign="right"
              textAlignVertical="top"
            />

            <Text style={[styles.inputLabel, rtlText]}>קטגוריה</Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryCard,
                    newGoal.category === cat.value && styles.categoryCardActive,
                    { borderColor: cat.color },
                  ]}
                  onPress={() => setNewGoal({ ...newGoal, category: cat.value })}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={28}
                    color={newGoal.category === cat.value ? cat.color : theme.colors.gray[400]}
                  />
                  <Text
                    style={[
                      styles.categoryCardText,
                      newGoal.category === cat.value && { color: cat.color },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.inputLabel, rtlText]}>תאריך יעד (אופציונלי)</Text>
            <TextInput
              style={[styles.input, rtlText]}
              placeholder="2025-12-31"
              value={newGoal.target_date}
              onChangeText={(text) => setNewGoal({ ...newGoal, target_date: text })}
              textAlign="right"
            />

            <Button
              variant="gradient"
              gradientColors={[theme.colors.teal[500], theme.colors.cyan[600]]}
              onPress={handleCreateGoal}
              style={styles.submitButton}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.submitButtonText}>צרי מטרה</Text>
            </Button>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  hero: {
    paddingVertical: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 400,
  },
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  heroTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: theme.fontSize.base,
    color: 'white',
    opacity: 0.95,
    textAlign: 'center',
    lineHeight: theme.fontSize.base * 1.5,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    marginTop: -theme.spacing['2xl'],
    gap: theme.spacing.sm,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.md,
    marginBottom: theme.spacing.sm,
  },
  statNumber: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[600],
    marginTop: theme.spacing.xs,
  },
  createButtonContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  createButton: {
    ...theme.shadows.lg,
  },
  createButtonText: {
    color: 'white',
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.gray[100],
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: theme.colors.teal[500],
  },
  filterTabText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray[700],
  },
  filterTabTextActive: {
    color: 'white',
  },
  goalsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  goalCard: {
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  goalHeader: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalTitleContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
  },
  categoryLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[600],
    marginTop: 2,
  },
  goalDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    lineHeight: theme.fontSize.sm * 1.5,
    marginBottom: theme.spacing.lg,
  },
  progressSection: {
    marginBottom: theme.spacing.lg,
  },
  progressHeader: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  progressLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray[700],
  },
  progressPercentage: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.teal[600],
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.gray[200],
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  progressControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  progressButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressControlText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
  },
  goalActions: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  targetDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  targetDateText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[600],
  },
  deleteButton: {
    padding: theme.spacing.sm,
  },
  emptyCard: {
    paddingVertical: theme.spacing['4xl'],
  },
  emptyIcon: {
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[700],
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    textAlign: 'center',
  },
  quoteCard: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.orange[50],
    borderColor: theme.colors.orange[200],
  },
  quoteIcon: {
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  quoteText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    textAlign: 'center',
    lineHeight: theme.fontSize.base * 1.6,
    fontStyle: 'italic',
    marginBottom: theme.spacing.sm,
  },
  quoteAuthor: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    textAlign: 'center',
  },
  footer: {
    height: theme.spacing['2xl'],
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  modalTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  inputLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  input: {
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.base,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  textArea: {
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.base,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    minHeight: 100,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  categoryCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    borderColor: theme.colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
  },
  categoryCardActive: {
    backgroundColor: 'white',
    borderWidth: 2,
  },
  categoryCardText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray[600],
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: theme.spacing['3xl'],
    marginBottom: theme.spacing['2xl'],
  },
  submitButtonText: {
    color: 'white',
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
});
