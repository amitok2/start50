import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import MentorCard from '@/components/mentors/MentorCard';
import { theme } from '@/constants/theme';

// Sample mentor data - this would come from API in real app
const sampleMentors = [
  {
    id: '1',
    mentor_name: 'שרה כהן',
    specialty: 'מאמנת קריירה ויזמות',
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
    meeting_availability: ['זום', 'טלפון'],
    duration: '50 דקות',
    price: 150,
    description: 'מאמנת אישית המתמחה בליווי נשים לשינוי קריירה והתפתחות אישית.',
    focus_areas: ['התפתחות אישית', 'שינוי קריירה', 'ביטחון עצמי'],
  },
];

export default function MentorsScreen() {
  const [mentors] = useState(sampleMentors);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>מאמנות ויועצות</Text>
        <Text style={styles.subtitle}>
          מצאי את המאמנת המושלמת עבורך
        </Text>
      </View>

      {mentors.map((mentor) => (
        <MentorCard
          key={mentor.id}
          mentor={mentor}
          onPress={() => {
            console.log('Navigate to mentor profile:', mentor.id);
          }}
        />
      ))}

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing['2xl'],
    alignItems: 'center',
  },
  title: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.gray[600],
    textAlign: 'center',
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

