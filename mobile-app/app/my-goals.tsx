import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const sampleGoals = [
  {
    id: '1',
    title: 'להשלים 3 קורסים',
    category: 'למידה',
    progress: 66,
    current: 2,
    target: 3,
    dueDate: '31 מרץ 2024',
    status: 'active',
  },
  {
    id: '2',
    title: 'לפגוש 5 מאמנות',
    category: 'רשת',
    progress: 40,
    current: 2,
    target: 5,
    dueDate: '30 אפריל 2024',
    status: 'active',
  },
  {
    id: '3',
    title: 'לפרסם 10 פוסטים בקהילה',
    category: 'קהילה',
    progress: 30,
    current: 3,
    target: 10,
    dueDate: '31 מאי 2024',
    status: 'active',
  },
  {
    id: '4',
    title: 'להשלים תכנית עסקית',
    category: 'יזמות',
    progress: 100,
    current: 1,
    target: 1,
    dueDate: '15 ינואר 2024',
    status: 'completed',
  },
];

export default function MyGoalsScreen() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredGoals = filter === 'all'
    ? sampleGoals
    : sampleGoals.filter((g) => g.status === filter);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.orange[400], theme.colors.rose[400], theme.colors.pink[400]]}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>🎯 המטרות שלי</Text>
          <Text style={styles.heroSubtitle}>
            עקבי אחר ההתקדמות והישגי את היעדים שלך
          </Text>
        </View>
      </LinearGradient>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            הכל
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
          onPress={() => setFilter('active')}
        >
          <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
            פעילות
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
            הושגו
          </Text>
        </TouchableOpacity>
      </View>

      {/* Goals List */}
      <View style={styles.goalsList}>
        {filteredGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </View>

      {/* Add Goal Button */}
      <View style={styles.addButtonContainer}>
        <Button
          variant="gradient"
          gradientColors={[theme.colors.orange[500], theme.colors.rose[500]]}
          onPress={() => console.log('Add goal')}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addButtonText}>הוספת מטרה</Text>
        </Button>
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

function GoalCard({ goal }: { goal: any }) {
  const isCompleted = goal.status === 'completed';

  return (
    <Card style={styles.goalCard}>
      <CardHeader>
        <View style={styles.goalHeader}>
          <View style={{ flex: 1 }}>
            <CardTitle style={styles.goalTitle}>{goal.title}</CardTitle>
            <Badge
              style={{
                backgroundColor: isCompleted ? theme.colors.green[100] : theme.colors.orange[100],
                alignSelf: 'flex-start',
                marginTop: theme.spacing.xs,
              }}
              textStyle={{
                color: isCompleted ? theme.colors.green[700] : theme.colors.orange[700],
              }}
            >
              {goal.category}
            </Badge>
          </View>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={32} color={theme.colors.green[500]} />
            </View>
          )}
        </View>
      </CardHeader>

      <CardContent>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${goal.progress}%`,
                  backgroundColor: isCompleted ? theme.colors.green[500] : theme.colors.orange[500],
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{goal.progress}%</Text>
        </View>

        {/* Progress Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons name="flag" size={16} color={theme.colors.gray[500]} />
            <Text style={styles.detailText}>
              {goal.current} מתוך {goal.target}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color={theme.colors.gray[500]} />
            <Text style={styles.detailText}>{goal.dueDate}</Text>
          </View>
        </View>

        {!isCompleted && (
          <Button
            variant="outline"
            size="sm"
            style={{ marginTop: theme.spacing.md }}
            onPress={() => console.log('Update progress')}
          >
            <Text style={styles.updateButtonText}>עדכון התקדמות</Text>
          </Button>
        )}
      </CardContent>
    </Card>
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
    textAlign: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  filterButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.gray[100],
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: theme.colors.orange[500],
  },
  filterText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray[700],
  },
  filterTextActive: {
    color: 'white',
  },
  goalsList: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  goalCard: {
    ...theme.shadows.lg,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  goalTitle: {
    fontSize: theme.fontSize.xl,
    textAlign: 'right',
  },
  completedBadge: {
    padding: theme.spacing.xs,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.gray[200],
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  progressText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[700],
    minWidth: 45,
    textAlign: 'left',
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  detailText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
  },
  updateButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    fontWeight: theme.fontWeight.medium,
  },
  addButtonContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  addButtonText: {
    color: 'white',
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

