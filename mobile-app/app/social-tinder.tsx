import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { rtlText } from '@/utils/rtl';

const { width } = Dimensions.get('window');

const sampleProfiles = [
  {
    id: '1',
    nickname: 'שרה',
    age: 52,
    city: 'תל אביב',
    headline: 'בעלת עסק בתחום היופי, אוהבת אמנות ויוגה',
    interests: ['יוגה', 'אמנות', 'יזמות', 'טיולים'],
    looking_for: 'חברות אמיתיות ושיתופי פעולה עסקיים',
    profile_image_url: null,
  },
  {
    id: '2',
    nickname: 'רחל',
    age: 55,
    city: 'ירושלים',
    headline: 'עיתונאית לשעבר, עכשיו מאמנת אישית',
    interests: ['קריאה', 'כתיבה', 'קפה', 'שיחות עומק'],
    looking_for: 'חברות שאוהבות תרבות ושיחות משמעותיות',
    profile_image_url: null,
  },
  {
    id: '3',
    nickname: 'דינה',
    age: 50,
    city: 'חיפה',
    headline: 'מעצבת גרפית, אמא ל-3, פעילה בקהילה',
    interests: ['עיצוב', 'צילום', 'בישול', 'מוזיקה'],
    looking_for: 'חברות יצירתיות ומשפחתיות',
    profile_image_url: null,
  },
];

export default function SocialTinderScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const currentProfile = sampleProfiles[currentIndex];

  const handleConnect = () => {
    console.log('Send connection request to:', currentProfile.nickname);
    if (currentIndex < sampleProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  const handleSkip = () => {
    if (currentIndex < sampleProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  const interestColors = [
    { bg: theme.colors.rose[100], text: theme.colors.rose[700] },
    { bg: theme.colors.purple[100], text: theme.colors.purple[700] },
    { bg: theme.colors.blue[100], text: theme.colors.blue[700] },
    { bg: theme.colors.green[100], text: theme.colors.green[700] },
    { bg: theme.colors.orange[100], text: theme.colors.orange[700] },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.rose[400], theme.colors.pink[400], theme.colors.purple[400]]}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>💕 הכירי את נפש התאומה שלך</Text>
          <Text style={styles.heroSubtitle}>
            מצאי נשים בדיוק כמוך - שמבינות, תומכות וחולקות איתך את המסע
          </Text>
        </View>
      </LinearGradient>

      {/* Filters Button */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="options-outline" size={20} color={theme.colors.rose[500]} />
          <Text style={styles.filterButtonText}>סינון</Text>
        </TouchableOpacity>
      </View>

      {/* Join CTA */}
      <View style={styles.section}>
        <Card style={styles.joinCard}>
          <CardHeader>
            <CardTitle style={[styles.joinTitle, rtlText]}>
              <Ionicons name="sparkles" size={24} color={theme.colors.purple[700]} />
              {' '}עדיין לא חברה בקהילה?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text style={[styles.joinDescription, rtlText]}>
              הצטרפי לקהילת ReStart 50+ ותוכלי ליצור פרופיל, להכיר חברות חדשות וליהנות מכל השירותים!
            </Text>
            <Button
              variant="gradient"
              gradientColors={[theme.colors.purple[500], theme.colors.pink[600]]}
              onPress={() => router.push('/apply-for-membership')}
              style={styles.joinButton}
            >
              <View style={styles.joinButtonContent}>
                <Ionicons name="arrow-forward" size={20} color="white" />
                <Text style={styles.joinButtonText}>הגישי בקשה להצטרפות</Text>
              </View>
            </Button>
          </CardContent>
        </Card>
      </View>

      {/* Profile Card */}
      <View style={styles.cardContainer}>
        <Card style={styles.profileCard}>
          <CardHeader>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                {currentProfile.profile_image_url ? (
                  <Image
                    source={{ uri: currentProfile.profile_image_url }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={48} color={theme.colors.rose[400]} />
                  </View>
                )}
              </View>
              <CardTitle style={styles.profileName}>
                {currentProfile.nickname}, {currentProfile.age}
              </CardTitle>
              <Text style={styles.profileCity}>
                <Ionicons name="location" size={16} color={theme.colors.gray[600]} /> {currentProfile.city}
              </Text>
            </View>
          </CardHeader>

          <CardContent>
            {/* Headline */}
            <View style={styles.section}>
              <Text style={styles.headline}>{currentProfile.headline}</Text>
            </View>

            {/* Interests */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>תחומי עניין:</Text>
              <View style={styles.interestsContainer}>
                {currentProfile.interests.map((interest, index) => {
                  const colorIndex = index % interestColors.length;
                  return (
                    <Badge
                      key={interest}
                      style={{
                        backgroundColor: interestColors[colorIndex].bg,
                        marginRight: theme.spacing.sm,
                        marginBottom: theme.spacing.sm,
                      }}
                      textStyle={{
                        color: interestColors[colorIndex].text,
                      }}
                    >
                      {interest}
                    </Badge>
                  );
                })}
              </View>
            </View>

            {/* Looking For */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>מחפשת:</Text>
              <Text style={styles.lookingForText}>{currentProfile.looking_for}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
              >
                <Ionicons name="close" size={32} color={theme.colors.gray[600]} />
              </TouchableOpacity>
              <Button
                variant="gradient"
                gradientColors={[theme.colors.rose[500], theme.colors.pink[600]]}
                onPress={handleConnect}
                style={styles.connectButton}
              >
                <Ionicons name="heart" size={20} color="white" />
                <Text style={styles.connectButtonText}>בואי נכיר</Text>
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            פרופיל {currentIndex + 1} מתוך {sampleProfiles.length}
          </Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Card style={styles.infoCard}>
          <CardHeader>
            <CardTitle>איך זה עובד?</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.step}>
              <Ionicons name="search" size={24} color={theme.colors.rose[500]} />
              <Text style={styles.stepText}>
                <Text style={styles.stepNumber}>1. </Text>
                עברי על פרופילים של נשים שמתאימות לך
              </Text>
            </View>
            <View style={styles.step}>
              <Ionicons name="heart" size={24} color={theme.colors.rose[500]} />
              <Text style={styles.stepText}>
                <Text style={styles.stepNumber}>2. </Text>
                לחצי "בואי נכיר" אם את רוצה להתחבר
              </Text>
            </View>
            <View style={styles.step}>
              <Ionicons name="chatbubbles" size={24} color={theme.colors.rose[500]} />
              <Text style={styles.stepText}>
                <Text style={styles.stepNumber}>3. </Text>
                תקבלי הודעה כשהיא תענה לך
              </Text>
            </View>
          </CardContent>
        </Card>
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
    paddingVertical: theme.spacing['5xl'],
    paddingHorizontal: theme.spacing.lg,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: theme.fontSize.lg,
    color: 'white',
    opacity: 0.95,
    textAlign: 'center',
  },
  filtersContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    alignItems: 'flex-end',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.rose[50],
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.rose[200],
  },
  filterButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.rose[600],
  },
  cardContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  profileCard: {
    ...theme.shadows.xl,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.rose[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'white',
    ...theme.shadows.lg,
  },
  profileName: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.xs,
  },
  profileCity: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[600],
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  headline: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    textAlign: 'right',
    lineHeight: theme.fontSize.base * 1.6,
  },
  sectionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.md,
    textAlign: 'right',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  lookingForText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    textAlign: 'right',
    lineHeight: theme.fontSize.base * 1.6,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  skipButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.gray[200],
  },
  connectButton: {
    flex: 1,
    maxWidth: 220,
  },
  connectButtonText: {
    color: 'white',
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  progressText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
  },
  infoSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing['2xl'],
  },
  infoCard: {
    backgroundColor: theme.colors.rose[50],
    borderColor: theme.colors.rose[100],
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  stepText: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    textAlign: 'right',
    lineHeight: theme.fontSize.base * 1.5,
  },
  stepNumber: {
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.rose[600],
  },
  footer: {
    height: theme.spacing['2xl'],
  },
  joinCard: {
    backgroundColor: theme.colors.purple[50],
    borderColor: theme.colors.purple[200],
    ...theme.shadows.lg,
  },
  joinTitle: {
    color: theme.colors.purple[800],
  },
  joinDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    textAlign: 'center',
    lineHeight: theme.fontSize.sm * 1.6,
    marginBottom: theme.spacing.lg,
  },
  joinButton: {
    ...theme.shadows.md,
  },
  joinButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  joinButtonText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: 'white',
  },
});

