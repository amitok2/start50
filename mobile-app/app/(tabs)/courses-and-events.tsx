import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

// Sample courses data
const sampleCourses = [
  {
    id: '1',
    title: 'שיווק דיגיטלי למתחילות',
    description: 'למדי איך לשווק את העסק שלך באינטרנט - מדיה חברתית, גוגל ועוד',
    instructor: 'מיכל לוי',
    duration: '8 שיעורים',
    level: 'מתחילות',
    price: 'חינם לחברות',
    category: 'שיווק',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    enrolled: 156,
  },
  {
    id: '2',
    title: 'בניית אתר עצמאי',
    description: 'צרי אתר מקצועי לעסק שלך ללא ידע טכני מוקדם',
    instructor: 'שרה כהן',
    duration: '6 שיעורים',
    level: 'מתחילות',
    price: '₪299',
    category: 'טכנולוגיה',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400',
    enrolled: 89,
  },
  {
    id: '3',
    title: 'ניהול פיננסי לעסק',
    description: 'תכנון תקציב, מעקב הכנסות והוצאות וניהול כספי נכון',
    instructor: 'רחל אברהם',
    duration: '5 שיעורים',
    level: 'בינוני',
    price: 'חינם לחברות',
    category: 'כלכלה',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    enrolled: 234,
  },
];

export default function CoursesScreen() {
  const [filter, setFilter] = useState('all');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={[theme.colors.purple[50], theme.colors.pink[50], '#FFFFFF']}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>קורסים והדרכות</Text>
          <Text style={styles.heroSubtitle}>
            למדי מיומנויות חדשות שיקדמו את העסק והקריירה שלך
          </Text>
        </View>
      </LinearGradient>

      {/* Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        <TouchableOpacity
          style={[styles.filterPill, filter === 'all' && styles.filterPillActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            הכל
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, filter === 'marketing' && styles.filterPillActive]}
          onPress={() => setFilter('marketing')}
        >
          <Text style={[styles.filterText, filter === 'marketing' && styles.filterTextActive]}>
            שיווק
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, filter === 'tech' && styles.filterPillActive]}
          onPress={() => setFilter('tech')}
        >
          <Text style={[styles.filterText, filter === 'tech' && styles.filterTextActive]}>
            טכנולוגיה
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, filter === 'finance' && styles.filterPillActive]}
          onPress={() => setFilter('finance')}
        >
          <Text style={[styles.filterText, filter === 'finance' && styles.filterTextActive]}>
            כלכלה
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Courses List */}
      <View style={styles.coursesList}>
        {sampleCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

function CourseCard({ course }: { course: any }) {
  return (
    <Card style={styles.courseCard}>
      <Image source={{ uri: course.image }} style={styles.courseImage} />
      
      <CardHeader>
        <View style={styles.courseHeader}>
          <Badge
            style={{ backgroundColor: theme.colors.purple[100] }}
            textStyle={{ color: theme.colors.purple[700] }}
          >
            {course.category}
          </Badge>
          <View style={styles.enrolledBadge}>
            <Ionicons name="people" size={14} color={theme.colors.gray[600]} />
            <Text style={styles.enrolledText}>{course.enrolled}</Text>
          </View>
        </View>
        <CardTitle style={styles.courseTitle}>{course.title}</CardTitle>
        <CardDescription style={styles.courseDescription}>
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <View style={styles.courseInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color={theme.colors.gray[500]} />
            <Text style={styles.infoText}>{course.instructor}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color={theme.colors.gray[500]} />
            <Text style={styles.infoText}>{course.duration}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="bar-chart-outline" size={16} color={theme.colors.gray[500]} />
            <Text style={styles.infoText}>{course.level}</Text>
          </View>
        </View>

        <View style={styles.courseFooter}>
          <Text style={styles.priceText}>{course.price}</Text>
          <Button
            variant="gradient"
            gradientColors={[theme.colors.purple[500], theme.colors.pink[600]]}
            size="sm"
            onPress={() => console.log('Enroll in course:', course.id)}
          >
            <Text style={styles.buttonText}>להרשמה</Text>
          </Button>
        </View>
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
    paddingVertical: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing.lg,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  heroSubtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.gray[600],
    textAlign: 'center',
  },
  filterContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  filterPill: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray[100],
    marginRight: theme.spacing.sm,
  },
  filterPillActive: {
    backgroundColor: theme.colors.purple[500],
  },
  filterText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    fontWeight: theme.fontWeight.medium,
  },
  filterTextActive: {
    color: 'white',
  },
  coursesList: {
    paddingHorizontal: theme.spacing.lg,
  },
  courseCard: {
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  enrolledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  enrolledText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[600],
  },
  courseTitle: {
    fontSize: theme.fontSize.xl,
    textAlign: 'right',
    marginBottom: theme.spacing.sm,
  },
  courseDescription: {
    textAlign: 'right',
    lineHeight: theme.fontSize.sm * 1.5,
  },
  courseInfo: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.purple[600],
  },
  buttonText: {
    color: 'white',
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

