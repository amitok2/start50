import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';

const sampleCourses = [
  {
    id: '1',
    title: 'יזמות בגיל 50+',
    instructor: 'דנה כהן',
    progress: 75,
    status: 'active',
    nextLesson: 'שיווק דיגיטלי למתחילות',
    image: null,
  },
  {
    id: '2',
    title: 'שיווק דיגיטלי מתקדם',
    instructor: 'מיכל לוי',
    progress: 40,
    status: 'active',
    nextLesson: 'פרסום בפייסבוק',
    image: null,
  },
  {
    id: '3',
    title: 'בניית אתרים ב-WordPress',
    instructor: 'רחל אברהם',
    progress: 100,
    status: 'completed',
    nextLesson: null,
    image: null,
  },
];

export default function MyCoursesScreen() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredCourses = filter === 'all' 
    ? sampleCourses 
    : sampleCourses.filter(c => c.status === filter);

  const activeCourses = sampleCourses.filter(c => c.status === 'active').length;
  const completedCourses = sampleCourses.filter(c => c.status === 'completed').length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.purple[500], theme.colors.pink[500], theme.colors.rose[400]]}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Ionicons name="book" size={64} color="white" />
          <Text style={styles.heroTitle}>הקורסים שלי</Text>
          <Text style={styles.heroSubtitle}>
            הקורסים וההכשרות שנרשמת אליהם
          </Text>
        </View>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{activeCourses}</Text>
            <Text style={styles.statLabel}>פעילים</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{completedCourses}</Text>
            <Text style={styles.statLabel}>הושלמו</Text>
          </View>
        </View>
      </View>

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
            פעילים
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
            הושלמו
          </Text>
        </TouchableOpacity>
      </View>

      {/* Courses List */}
      <View style={styles.coursesList}>
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}

        {filteredCourses.length === 0 && (
          <Card style={styles.emptyCard}>
            <CardContent>
              <Text style={styles.emptyEmoji}>📚</Text>
              <Text style={styles.emptyTitle}>אין קורסים</Text>
              <Text style={styles.emptyText}>
                {filter === 'completed' 
                  ? 'עדיין לא השלמת אף קורס'
                  : 'עדיין לא נרשמת לאף קורס'}
              </Text>
              <Button
                onPress={() => router.push('/courses-and-events' as any)}
                style={styles.browseButton}
              >
                <Text style={styles.browseButtonText}>עברי לדף הקורסים</Text>
              </Button>
            </CardContent>
          </Card>
        )}
      </View>

      {/* Browse More */}
      <View style={styles.ctaSection}>
        <Card style={styles.ctaCard}>
          <CardContent>
            <Text style={styles.ctaEmoji}>🌟</Text>
            <Text style={styles.ctaTitle}>רוצה ללמוד עוד?</Text>
            <Text style={styles.ctaText}>
              גלי קורסים והכשרות נוספות שיעזרו לך להתקדם
            </Text>
            <Button
              variant="gradient"
              gradientColors={[theme.colors.purple[500], theme.colors.pink[500]]}
              onPress={() => router.push('/courses-and-events' as any)}
            >
              <Text style={styles.ctaButtonText}>לכל הקורסים</Text>
            </Button>
          </CardContent>
        </Card>
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

function CourseCard({ course }: { course: any }) {
  const isCompleted = course.status === 'completed';

  return (
    <Card style={styles.courseCard}>
      <CardHeader>
        <View style={styles.courseHeader}>
          <View style={styles.courseInfo}>
            <CardTitle style={styles.courseTitle}>{course.title}</CardTitle>
            <Text style={styles.instructor}>
              <Ionicons name="person" size={14} color={theme.colors.gray[600]} /> {course.instructor}
            </Text>
          </View>
          <Badge
            style={{
              backgroundColor: isCompleted ? theme.colors.green[100] : theme.colors.purple[100],
            }}
            textStyle={{
              color: isCompleted ? theme.colors.green[700] : theme.colors.purple[700],
            }}
          >
            {isCompleted ? 'הושלם' : 'פעיל'}
          </Badge>
        </View>
      </CardHeader>

      <CardContent>
        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>התקדמות</Text>
            <Text style={styles.progressPercentage}>{course.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${course.progress}%`,
                  backgroundColor: isCompleted ? theme.colors.green[500] : theme.colors.purple[500]
                }
              ]} 
            />
          </View>
        </View>

        {/* Next Lesson */}
        {course.nextLesson && (
          <View style={styles.nextLessonContainer}>
            <Text style={styles.nextLessonLabel}>השיעור הבא:</Text>
            <Text style={styles.nextLessonTitle}>{course.nextLesson}</Text>
          </View>
        )}

        {/* Action Button */}
        <Button
          variant={isCompleted ? 'outline' : 'default'}
          style={styles.actionButton}
          onPress={() => console.log('Navigate to course:', course.id)}
        >
          <Ionicons 
            name={isCompleted ? "trophy" : "play"} 
            size={16} 
            color={isCompleted ? theme.colors.gray[700] : 'white'} 
          />
          <Text style={[
            styles.actionButtonText,
            isCompleted && { color: theme.colors.gray[700] }
          ]}>
            {isCompleted ? 'צפה בתעודה' : 'המשך ללמוד'}
          </Text>
        </Button>
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
  statsSection: {
    padding: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.lg,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.fontSize['4xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.purple[600],
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    marginTop: theme.spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.gray[200],
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
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
    backgroundColor: theme.colors.purple[500],
  },
  filterText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray[700],
  },
  filterTextActive: {
    color: 'white',
  },
  coursesList: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  courseCard: {
    ...theme.shadows.md,
    marginBottom: theme.spacing.lg,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: theme.fontSize.xl,
    marginBottom: theme.spacing.xs,
  },
  instructor: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
  },
  progressContainer: {
    marginBottom: theme.spacing.lg,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  progressLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
  },
  progressPercentage: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.purple[600],
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.gray[200],
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  nextLessonContainer: {
    backgroundColor: theme.colors.purple[50],
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  nextLessonLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.purple[600],
    fontWeight: theme.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
    textAlign: 'right',
  },
  nextLessonTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.purple[900],
    fontWeight: theme.fontWeight.medium,
    textAlign: 'right',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  actionButtonText: {
    color: 'white',
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
  },
  emptyCard: {
    backgroundColor: theme.colors.gray[50],
    padding: theme.spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[700],
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[600],
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  browseButton: {
    marginTop: theme.spacing.md,
  },
  browseButtonText: {
    color: 'white',
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
  },
  ctaSection: {
    padding: theme.spacing.lg,
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
  ctaButtonText: {
    color: 'white',
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

