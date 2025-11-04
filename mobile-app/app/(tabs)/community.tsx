import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import PostCard from '@/components/community/PostCard';
import { theme } from '@/constants/theme';

// Sample posts data - this would come from API in real app
const samplePosts = [
  {
    id: '1',
    title: 'איך התחלתי עסק משלי בגיל 52',
    content: 'שלום לכולן! רציתי לשתף אתכן בסיפור שלי. לפני שנה, החלטתי להגשים את החלום שלי ולפתוח סטודיו ליוגה. הדרך לא הייתה קלה, אבל היום אני גאה להגיד שיש לי 30 תלמידות קבועות. המפתח היה להאמין בעצמי ולא לוותר!',
    author_name: 'רחל כהן',
    category: 'הצלחה',
    created_date: new Date(2025, 0, 15).toISOString(),
  },
  {
    id: '2',
    title: 'עצות לשיווק עסק קטן',
    content: 'היי! אני עוסקת בייעוץ שיווקי כבר 10 שנים ורציתי לשתף אתכן בכמה טיפים שיכולים לעזור:\n1. השקיעו באינסטגרם - זה הכי משתלם\n2. תספרו את הסיפור האישי שלכן\n3. תתמידו - התוצאות לא מגיעות מיד',
    author_name: 'מיכל לוי',
    category: 'עצה',
    created_date: new Date(2025, 0, 20).toISOString(),
  },
  {
    id: '3',
    title: 'איך מתמודדים עם הפחד משינוי?',
    content: 'אני בגיל 55 וחולמת על קריירה חדשה בתחום הקוסמטיקה, אבל יש לי הרבה פחדים. איך התמודדתן עם זה?',
    author_name: 'שרה אברהם',
    category: 'שאלה',
    created_date: new Date(2025, 0, 25).toISOString(),
  },
];

export default function CommunityScreen() {
  const [posts] = useState(samplePosts);
  // In a real app, this would come from auth context
  const currentUser = {
    email: 'user@example.com',
    full_name: 'משתמשת לדוגמה',
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>קהילה</Text>
        <Text style={styles.subtitle}>
          שתפי, הגיבי והתחברי לנשים מדהימות
        </Text>
      </View>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUser={currentUser} />
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

