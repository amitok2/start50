import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const sampleMatches = [
  {
    id: '1',
    name: 'דנה כהן',
    matchScore: 95,
    sharedInterests: ['יזמות', 'יוגה', 'כתיבה'],
    location: 'תל אביב',
    reason: 'שתיכן בעלות עסק, אוהבות יוגה וכתיבה יצירתית',
  },
  {
    id: '2',
    name: 'מיכל לוי',
    matchScore: 88,
    sharedInterests: ['שיווק', 'צילום', 'נסיעות'],
    location: 'חיפה',
    reason: 'עובדות בתחום השיווק הדיגיטלי ואוהבות לצלם',
  },
  {
    id: '3',
    name: 'רות אברהם',
    matchScore: 82,
    sharedInterests: ['אימון', 'פיתוח אישי', 'ספורט'],
    location: 'ירושלים',
    reason: 'שתיכן מאמנות אישיות ואוהבות ספורט',
  },
];

export default function AIMatchmakingScreen() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateMatches = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      console.log('Matches generated!');
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.purple[600], theme.colors.pink[500], theme.colors.rose[400]]}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Ionicons name="sparkles" size={64} color="white" />
          <Text style={styles.heroTitle}>🤖 התאמה חכמה AI</Text>
          <Text style={styles.heroSubtitle}>
            מצאי חברות מושלמות בעזרת בינה מלאכותית חכמה
          </Text>
        </View>
      </LinearGradient>

      {/* How It Works */}
      <View style={styles.section}>
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>איך זה עובד?</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                מערכת הAI שלנו מנתחת את הפרופיל שלך
              </Text>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                משווה אותך לאלפי פרופילים אחרים
              </Text>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                מציגה לך התאמות מדויקות לפי תחומי עניין, מטרות וערכים
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Generate Button */}
      <View style={styles.section}>
        <Button
          variant="gradient"
          gradientColors={[theme.colors.purple[600], theme.colors.pink[500]]}
          onPress={handleGenerateMatches}
          loading={isGenerating}
        >
          <Ionicons name="flash" size={20} color="white" />
          <Text style={styles.buttonText}>מצאי התאמות מושלמות</Text>
        </Button>
      </View>

      {/* Matches */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ההתאמות שלך 💕</Text>
        {sampleMatches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </View>

      {/* Benefits */}
      <View style={styles.section}>
        <Card style={styles.benefitsCard}>
          <CardHeader>
            <CardTitle>היתרונות שלנו</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.benefit}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.green[500]} />
              <Text style={styles.benefitText}>
                אלגוריתם חכם שמתאים לפי ערכים משותפים
              </Text>
            </View>
            <View style={styles.benefit}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.green[500]} />
              <Text style={styles.benefitText}>
                התאמות מדויקות לפי תחומי עניין ומטרות
              </Text>
            </View>
            <View style={styles.benefit}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.green[500]} />
              <Text style={styles.benefitText}>
                למידה מתמדת ושיפור ההתאמות עם הזמן
              </Text>
            </View>
            <View style={styles.benefit}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.green[500]} />
              <Text style={styles.benefitText}>
                קהילה תומכת של נשים בגיל 50+
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

function MatchCard({ match }: { match: any }) {
  return (
    <Card style={styles.matchCard}>
      <CardHeader>
        <View style={styles.matchHeader}>
          <View style={styles.matchInfo}>
            <CardTitle style={styles.matchName}>{match.name}</CardTitle>
            <Text style={styles.matchLocation}>
              <Ionicons name="location" size={14} color={theme.colors.gray[600]} /> {match.location}
            </Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreNumber}>{match.matchScore}%</Text>
            <Text style={styles.scoreLabel}>התאמה</Text>
          </View>
        </View>
      </CardHeader>

      <CardContent>
        <View style={styles.matchSection}>
          <Text style={styles.matchSectionTitle}>תחומי עניין משותפים:</Text>
          <View style={styles.interestsContainer}>
            {match.sharedInterests.map((interest: string) => (
              <Badge
                key={interest}
                style={styles.interestBadge}
                textStyle={styles.interestBadgeText}
              >
                {interest}
              </Badge>
            ))}
          </View>
        </View>

        <View style={styles.matchSection}>
          <Text style={styles.reasonText}>💡 {match.reason}</Text>
        </View>

        <Button
          variant="outline"
          size="sm"
          onPress={() => console.log('Connect with', match.name)}
        >
          <Ionicons name="heart" size={16} color={theme.colors.rose[500]} />
          <Text style={styles.connectText}>שלחי בקשת חברות</Text>
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
    lineHeight: theme.fontSize.base * 1.6,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.lg,
    textAlign: 'right',
  },
  card: {
    ...theme.shadows.lg,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.purple[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: 'white',
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
  },
  stepText: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    textAlign: 'right',
    lineHeight: theme.fontSize.base * 1.5,
  },
  buttonText: {
    color: 'white',
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
  matchCard: {
    ...theme.shadows.md,
    marginBottom: theme.spacing.lg,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: theme.fontSize.xl,
    marginBottom: theme.spacing.xs,
  },
  matchLocation: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: theme.colors.purple[50],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    minWidth: 70,
  },
  scoreNumber: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.purple[600],
  },
  scoreLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.purple[600],
  },
  matchSection: {
    marginBottom: theme.spacing.lg,
  },
  matchSectionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.sm,
    textAlign: 'right',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    justifyContent: 'flex-end',
  },
  interestBadge: {
    backgroundColor: theme.colors.purple[100],
  },
  interestBadgeText: {
    color: theme.colors.purple[700],
  },
  reasonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    fontStyle: 'italic',
    textAlign: 'right',
    lineHeight: theme.fontSize.sm * 1.5,
  },
  connectText: {
    color: theme.colors.rose[600],
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  benefitsCard: {
    backgroundColor: theme.colors.green[50],
    borderColor: theme.colors.green[100],
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  benefitText: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    textAlign: 'right',
    lineHeight: theme.fontSize.base * 1.5,
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

