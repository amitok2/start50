import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const sampleResources = [
  {
    id: '1',
    title: 'מדריך פתיחת עסק - 2024',
    description: 'כל מה שצריך לדעת על פתיחת עסק בישראל',
    type: 'PDF',
    category: 'יזמות',
    downloads: 345,
    icon: 'document-text',
  },
  {
    id: '2',
    title: 'תבנית תכנית עסקית',
    description: 'תבנית מוכנה לתכנית עסקית מקצועית',
    type: 'DOC',
    category: 'כלים',
    downloads: 567,
    icon: 'document',
  },
  {
    id: '3',
    title: 'רשימת קישורים שימושיים',
    description: 'כל האתרים והכלים החשובים במקום אחד',
    type: 'Link',
    category: 'משאבים',
    downloads: 892,
    icon: 'link',
  },
  {
    id: '4',
    title: 'מצגת שיווק דיגיטלי',
    description: 'למד על שיווק דיגיטלי עם מצגת מפורטת',
    type: 'PPT',
    category: 'שיווק',
    downloads: 234,
    icon: 'easel',
  },
];

export default function ResourceLibrary() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={[theme.colors.rose[50], theme.colors.purple[50], '#FFFFFF']}
        style={styles.hero}
      >
        <Text style={styles.heroTitle}>ספריית משאבים</Text>
        <Text style={styles.heroSubtitle}>
          מדריכים, תבניות וכלים שיעזרו לך להצליח
        </Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={theme.colors.gray[400]}
          style={styles.searchIcon}
        />
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="חפשי משאב..."
          style={styles.searchInput}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {['הכל', 'יזמות', 'שיווק', 'כלים', 'משאבים'].map((category) => (
          <TouchableOpacity key={category} style={styles.categoryPill}>
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Resources List */}
      <View style={styles.resourcesList}>
        {sampleResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

function ResourceCard({ resource }: { resource: any }) {
  return (
    <TouchableOpacity activeOpacity={0.7}>
      <Card style={styles.resourceCard}>
        <CardContent style={styles.resourceContent}>
          <View style={styles.resourceHeader}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={resource.icon as any}
                size={24}
                color={theme.colors.rose[500]}
              />
            </View>
            <Badge
              style={{ backgroundColor: theme.colors.purple[100] }}
              textStyle={{ color: theme.colors.purple[700] }}
            >
              {resource.type}
            </Badge>
          </View>

          <Text style={styles.resourceTitle}>{resource.title}</Text>
          <Text style={styles.resourceDescription}>{resource.description}</Text>

          <View style={styles.resourceFooter}>
            <View style={styles.metaInfo}>
              <Ionicons name="pricetag" size={14} color={theme.colors.gray[500]} />
              <Text style={styles.metaText}>{resource.category}</Text>
            </View>
            <View style={styles.metaInfo}>
              <Ionicons name="download" size={14} color={theme.colors.gray[500]} />
              <Text style={styles.metaText}>{resource.downloads}</Text>
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
  searchContainer: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    right: 12,
    top: 10,
    zIndex: 1,
  },
  searchInput: {
    paddingRight: 40,
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray[100],
    marginRight: theme.spacing.sm,
  },
  categoryText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    fontWeight: theme.fontWeight.medium,
  },
  resourcesList: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  resourceCard: {
    ...theme.shadows.md,
  },
  resourceContent: {
    padding: theme.spacing.lg,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.rose[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.sm,
    textAlign: 'right',
  },
  resourceDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    lineHeight: theme.fontSize.sm * 1.5,
    marginBottom: theme.spacing.md,
    textAlign: 'right',
  },
  resourceFooter: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  metaInfo: {
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

