import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const sampleArticles = [
  {
    id: '1',
    title: 'איך התחלתי עסק בגיל 52 - הסיפור המלא',
    excerpt: 'המסע שלי מפרישה לעסק משגשג - כל האתגרים וההצלחות',
    author: 'רחל כהן',
    date: '15 ינואר 2024',
    readTime: '7 דקות',
    category: 'סיפורי הצלחה',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
    views: 1234,
  },
  {
    id: '2',
    title: '10 טיפים לשיווק דיגיטלי אפקטיבי',
    excerpt: 'כל מה שצריך לדעת על שיווק העסק שלך ברשתות החברתיות',
    author: 'מיכל לוי',
    date: '12 ינואר 2024',
    readTime: '5 דקות',
    category: 'שיווק',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    views: 2156,
  },
  {
    id: '3',
    title: 'מדריך מלא לניהול פיננסי בעסק קטן',
    excerpt: 'איך לנהל את הכספים של העסק בצורה מקצועית ואפקטיבית',
    author: 'שרה אברהם',
    date: '8 ינואר 2024',
    readTime: '10 דקות',
    category: 'כלכלה',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    views: 987,
  },
];

export default function ArticlesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.rose[50], theme.colors.orange[50], '#FFFFFF']}
        style={styles.hero}
      >
        <Text style={styles.heroTitle}>מאמרים ותובנות</Text>
        <Text style={styles.heroSubtitle}>
          למדי מניסיון של אחרות וקבלי השראה להצלחה
        </Text>
      </LinearGradient>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {['הכל', 'סיפורי הצלחה', 'שיווק', 'יזמות', 'כלכלה', 'קריירה'].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryPill,
              selectedCategory === cat && styles.categoryPillActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Articles List */}
      <View style={styles.articlesList}>
        {sampleArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

function ArticleCard({ article }: { article: any }) {
  return (
    <TouchableOpacity activeOpacity={0.9}>
      <Card style={styles.articleCard}>
        <Image source={{ uri: article.image }} style={styles.articleImage} />
        
        <CardHeader>
          <Badge
            style={{ backgroundColor: theme.colors.rose[100], alignSelf: 'flex-start' }}
            textStyle={{ color: theme.colors.rose[700] }}
          >
            {article.category}
          </Badge>
          <CardTitle style={styles.articleTitle}>{article.title}</CardTitle>
          <CardDescription style={styles.articleExcerpt}>
            {article.excerpt}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <View style={styles.articleMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={14} color={theme.colors.gray[500]} />
              <Text style={styles.metaText}>{article.author}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={theme.colors.gray[500]} />
              <Text style={styles.metaText}>{article.readTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="eye-outline" size={14} color={theme.colors.gray[500]} />
              <Text style={styles.metaText}>{article.views}</Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
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
  heroTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.md,
  },
  heroSubtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.gray[600],
    textAlign: 'center',
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray[100],
    marginRight: theme.spacing.sm,
  },
  categoryPillActive: {
    backgroundColor: theme.colors.rose[500],
  },
  categoryText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    fontWeight: theme.fontWeight.medium,
  },
  categoryTextActive: {
    color: 'white',
  },
  articlesList: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  articleCard: {
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  articleImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  articleTitle: {
    fontSize: theme.fontSize.xl,
    textAlign: 'right',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  articleExcerpt: {
    textAlign: 'right',
    lineHeight: theme.fontSize.sm * 1.6,
  },
  articleMeta: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  metaText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[600],
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

