import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import MentorCard from '@/components/mentors/MentorCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { rtlText } from '@/utils/rtl';

// Sample mentor data - this would come from API in real app
const sampleMentors = [
  {
    id: '1',
    mentor_name: 'שרה כהן',
    specialty: 'מאמנת קריירה ויזמות',
    contact_email: 'sarah@example.com',
    image_url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/dce67f69b_.jpg',
    meeting_availability: ['זום', 'פנים לפנים'],
    duration: '60 דקות',
    price: 0,
    description: 'מאמנת עסקית עם ניסיון של 15 שנה בליווי נשים בגיל 50+ להקמת עסקים ופיתוח קריירה.',
    focus_areas: ['יזמות', 'קריירה', 'מנהיגות', 'מיתוג אישי'],
  },
  {
    id: '2',
    mentor_name: 'מיכל לוי',
    specialty: 'יועצת עסקית',
    contact_email: 'michal@example.com',
    image_url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/389eb1e63_.jpg',
    meeting_availability: ['זום'],
    duration: '45 דקות',
    price: 200,
    description: 'יועצת עסקית מומחית בשיווק דיגיטלי ופיתוח אסטרטגיות עסקיות לעסקים קטנים.',
    focus_areas: ['שיווק דיגיטלי', 'אסטרטגיה עסקית', 'מדיה חברתית'],
  },
  {
    id: '3',
    mentor_name: 'רחל אברהם',
    specialty: 'מאמנת אישית',
    contact_email: 'rachel@example.com',
    meeting_availability: ['זום', 'טלפון'],
    duration: '50 דקות',
    price: 150,
    description: 'מאמנת אישית המתמחה בליווי נשים לשינוי קריירה והתפתחות אישית.',
    focus_areas: ['התפתחות אישית', 'שינוי קריירה', 'ביטחון עצמי'],
  },
];

export default function MentorsScreen() {
  const [mentors] = useState(sampleMentors);

  const handleMentorPress = (mentor: typeof sampleMentors[0]) => {
    router.push({
      pathname: '/mentor-profile',
      params: {
        id: mentor.id,
        name: mentor.mentor_name,
        email: mentor.contact_email,
      },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Header */}
      <LinearGradient
        colors={[theme.colors.purple[500], theme.colors.pink[500], theme.colors.rose[500]]}
        style={styles.hero}
      >
        <View style={styles.imageCircle}>
          <Image
            source={{
              uri: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/389eb1e63_.jpg',
            }}
            style={styles.heroImage}
          />
        </View>
        <Text style={[styles.heroTitle, rtlText]}>
          מצאו את <Text style={styles.heroTitleGradient}>המנטורית</Text> שתקפיץ אתכן קדימה!
        </Text>
        <Text style={[styles.heroSubtitle, rtlText]}>
          צוות המומחיות שלנו כאן כדי ללוות אותך בדרך להגשמה אישית ומקצועית
        </Text>
      </LinearGradient>

      {/* How It Works */}
      <View style={styles.howItWorksSection}>
        <Text style={[styles.sectionTitle, rtlText]}>
          איך זה עובד? <Text style={styles.sectionTitleHighlight}>שלושה צעדים פשוטים</Text>
        </Text>

        <View style={styles.stepsContainer}>
          {/* Step 1 */}
          <Card style={[styles.stepCard, { backgroundColor: theme.colors.purple[50] }]}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.purple[500] }]}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <CardHeader>
              <CardTitle style={[styles.stepTitle, rtlText]}>בחרי מנטורית</CardTitle>
            </CardHeader>
            <CardContent>
              <Text style={[styles.stepDescription, rtlText]}>
                עברי על הפרופילים שלנו, והתרשמי מהניסיון והתמחויות של המנטוריות.
              </Text>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card style={[styles.stepCard, { backgroundColor: theme.colors.pink[50] }]}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.pink[500] }]}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <CardHeader>
              <CardTitle style={[styles.stepTitle, rtlText]}>קבעי פגישת היכרות</CardTitle>
            </CardHeader>
            <CardContent>
              <Text style={[styles.stepDescription, rtlText]}>
                לחצי על "קבעי פגישה" ומלאי את הפרטים שלך. המנטורית תחזור אלייך בהקדם.
              </Text>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card style={[styles.stepCard, { backgroundColor: theme.colors.rose[50] }]}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.rose[500] }]}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <CardHeader>
              <CardTitle style={[styles.stepTitle, rtlText]}>התחילי את המסע</CardTitle>
            </CardHeader>
            <CardContent>
              <Text style={[styles.stepDescription, rtlText]}>
                לאחר אישור הפגישה, תקבלי את כל הפרטים למפגש הראשון שלך.
              </Text>
            </CardContent>
          </Card>
        </View>
      </View>

      {/* Mentors List */}
      <View style={styles.mentorsSection}>
        <Text style={[styles.mentorsTitle, rtlText]}>המנטוריות שלנו</Text>
        {mentors.map((mentor) => (
          <MentorCard
            key={mentor.id}
            mentor={mentor}
            onPress={() => handleMentorPress(mentor)}
          />
        ))}
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
    paddingVertical: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  imageCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.xl,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  heroTitleGradient: {
    fontWeight: theme.fontWeight.extrabold,
  },
  heroSubtitle: {
    fontSize: theme.fontSize.lg,
    color: 'white',
    opacity: 0.95,
    textAlign: 'center',
    lineHeight: theme.fontSize.lg * 1.5,
    maxWidth: '90%',
  },
  howItWorksSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing['3xl'],
  },
  sectionTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  sectionTitleHighlight: {
    color: theme.colors.purple[600],
  },
  stepsContainer: {
    gap: theme.spacing.lg,
  },
  stepCard: {
    position: 'relative',
    paddingTop: theme.spacing.xl,
    ...theme.shadows.md,
  },
  stepNumber: {
    position: 'absolute',
    top: -16,
    right: theme.spacing.lg,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.lg,
  },
  stepNumberText: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: 'white',
  },
  stepTitle: {
    fontSize: theme.fontSize.xl,
    textAlign: 'center',
    color: theme.colors.gray[900],
  },
  stepDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    textAlign: 'center',
    lineHeight: theme.fontSize.sm * 1.6,
  },
  mentorsSection: {
    paddingVertical: theme.spacing.xl,
  },
  mentorsTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

