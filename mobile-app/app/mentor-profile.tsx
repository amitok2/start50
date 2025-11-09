import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { rtlText, rtlView } from '@/utils/rtl';

export default function MentorProfileScreen() {
  const params = useLocalSearchParams();
  const mentorId = params.id as string;
  const mentorName = params.name as string;
  const mentorEmail = params.email as string;

  // Mock data - in real app, fetch based on mentorId
  const mentor = {
    id: mentorId,
    mentor_name: mentorName,
    contact_email: mentorEmail,
    specialty: 'מאמנת קריירה ויזמות',
    image_url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/dce67f69b_.jpg',
    meeting_availability: ['זום', 'פנים לפנים'],
    duration: '60 דקות',
    price: 0,
    description: `מאמנת עסקית עם ניסיון של 15 שנה בליווי נשים בגיל 50+ להקמת עסקים ופיתוח קריירה.
    
אני מתמחה בהדרכה אישית המותאמת לאתגרים הייחודיים של נשים בגיל המעבר, ומסייעת להן לממש את הפוטנציאל העצום שיש להן.`,
    focus_areas: ['יזמות', 'קריירה', 'מנהיגות', 'מיתוג אישי'],
    bio: `שלום! אני ${mentorName}. במשך 15 השנים האחרונות, ליוויתי מאות נשים בגיל 50 ומעלה בדרכן ליזמות, שינוי קריירה ופיתוח אישי.
    
אני מאמינה שהגיל שלנו הוא נקודת חוזק עצומה - הניסיון, הבשלות והחוכמה שצברנו הם הנכס הכי יקר שלנו.

בפגישות שלנו, נתמקד ביצירת תוכנית פעולה ברורה ומעשית, שתוביל אותך להגשמת החלומות שלך.`,
    testimonials: [
      {
        id: '1',
        author: 'מיכל כהן',
        text: 'שרה עזרה לי להקים את העסק שתמיד חלמתי עליו. היא נתנה לי את הכלים והביטחון שהייתי צריכה.',
      },
      {
        id: '2',
        author: 'רחל לוי',
        text: 'הפגישות עם שרה שינו לי את החיים. היא אמפתית, מקשיבה ותמיד יש לה פתרון חכם.',
      },
    ],
  };

  const handleBooking = () => {
    router.push({
      pathname: '/booking',
      params: {
        mentorId: mentor.id,
        mentorName: mentor.mentor_name,
        mentorEmail: mentor.contact_email,
      },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={[theme.colors.purple[500], theme.colors.pink[500], theme.colors.rose[500]]}
        style={styles.hero}
      >
        <View style={styles.avatarContainer}>
          {mentor.image_url ? (
            <Image source={{ uri: mentor.image_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={64} color={theme.colors.rose[300]} />
            </View>
          )}
        </View>
        <Text style={[styles.heroName, rtlText]}>{mentor.mentor_name}</Text>
        <Text style={[styles.heroSpecialty, rtlText]}>{mentor.specialty}</Text>
      </LinearGradient>

      {/* Quick Info */}
      <View style={styles.quickInfoSection}>
        <Card style={styles.quickInfoCard}>
          <CardContent style={styles.quickInfo}>
            <View style={[styles.infoItem, rtlView]}>
              <Ionicons name="videocam" size={20} color={theme.colors.purple[600]} />
              <Text style={[styles.infoText, rtlText]}>
                {mentor.meeting_availability.join(' + ')}
              </Text>
            </View>
            <View style={[styles.infoItem, rtlView]}>
              <Ionicons name="time" size={20} color={theme.colors.purple[600]} />
              <Text style={[styles.infoText, rtlText]}>{mentor.duration}</Text>
            </View>
            <View style={[styles.infoItem, rtlView]}>
              <Ionicons name="star" size={20} color={theme.colors.purple[600]} />
              <Text style={[styles.infoText, rtlText]}>
                {mentor.price === 0 ? 'פגישת היכרות חינם' : `${mentor.price} ₪`}
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle style={rtlText}>
              <Ionicons name="person-circle" size={24} color={theme.colors.purple[600]} />
              {' '}קצת עליי
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text style={[styles.bioText, rtlText]}>{mentor.bio}</Text>
          </CardContent>
        </Card>
      </View>

      {/* Focus Areas */}
      <View style={styles.section}>
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle style={rtlText}>
              <Ionicons name="bulb" size={24} color={theme.colors.orange[600]} />
              {' '}תחומי התמחות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.badgesContainer}>
              {mentor.focus_areas.map((area, index) => (
                <Badge key={index} style={styles.badge}>
                  <Text style={[styles.badgeText, rtlText]}>{area}</Text>
                </Badge>
              ))}
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Testimonials */}
      <View style={styles.section}>
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle style={rtlText}>
              <Ionicons name="chatbubbles" size={24} color={theme.colors.rose[600]} />
              {' '}המלצות מנחניות
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mentor.testimonials.map((testimonial) => (
              <View key={testimonial.id} style={styles.testimonial}>
                <Ionicons
                  name="quote"
                  size={24}
                  color={theme.colors.rose[300]}
                  style={styles.quoteIcon}
                />
                <Text style={[styles.testimonialText, rtlText]}>{testimonial.text}</Text>
                <Text style={[styles.testimonialAuthor, rtlText]}>- {testimonial.author}</Text>
              </View>
            ))}
          </CardContent>
        </Card>
      </View>

      {/* Booking CTA */}
      <View style={styles.section}>
        <Card style={styles.bookingCard}>
          <CardHeader>
            <CardTitle style={[styles.bookingTitle, rtlText]}>
              <Ionicons name="calendar" size={24} color={theme.colors.purple[700]} />
              {' '}קבעי פגישת היכרות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text style={[styles.bookingDescription, rtlText]}>
              רוצה להתייעץ עם {mentor.mentor_name.split(' ')[0]}? לחצי על הכפתור ותעברי לדף תיאום פגישת היכרות אישית.
            </Text>
            <Button
              variant="gradient"
              gradientColors={[theme.colors.purple[600], theme.colors.pink[600]]}
              onPress={handleBooking}
              style={styles.bookingButton}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="calendar" size={20} color="white" />
                <Text style={styles.buttonText}>תיאום פגישה</Text>
              </View>
            </Button>
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
    paddingVertical: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
    ...theme.shadows.xl,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
    backgroundColor: theme.colors.rose[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroName: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  heroSpecialty: {
    fontSize: theme.fontSize.lg,
    color: 'white',
    opacity: 0.95,
    textAlign: 'center',
  },
  quickInfoSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: -30,
  },
  quickInfoCard: {
    ...theme.shadows.xl,
  },
  quickInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: theme.spacing.md,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    justifyContent: 'center',
  },
  infoText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[700],
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  card: {
    ...theme.shadows.md,
  },
  bioText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    lineHeight: theme.fontSize.base * 1.6,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  badge: {
    backgroundColor: theme.colors.orange[100],
    borderColor: theme.colors.orange[300],
  },
  badgeText: {
    color: theme.colors.orange[800],
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  testimonial: {
    backgroundColor: theme.colors.rose[50],
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.rose[400],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  quoteIcon: {
    marginBottom: theme.spacing.sm,
  },
  testimonialText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    lineHeight: theme.fontSize.sm * 1.6,
    marginBottom: theme.spacing.md,
  },
  testimonialAuthor: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.rose[700],
  },
  bookingCard: {
    backgroundColor: theme.colors.purple[50],
    borderColor: theme.colors.purple[200],
  },
  bookingTitle: {
    color: theme.colors.purple[800],
  },
  bookingDescription: {
    fontSize: theme.fontSize.base,
    color: theme.colors.purple[700],
    textAlign: 'center',
    lineHeight: theme.fontSize.base * 1.5,
    marginBottom: theme.spacing.lg,
  },
  bookingButton: {
    ...theme.shadows.md,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  buttonText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: 'white',
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

