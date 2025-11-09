import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { rtlText } from '@/utils/rtl';

const sampleBookings = [
  {
    id: '1',
    mentor: 'מיכל לוי',
    mentorId: '2',
    mentorEmail: 'michal@example.com',
    specialty: 'שיווק דיגיטלי',
    date: '25 ינואר 2024',
    time: '14:00',
    duration: '60 דקות',
    type: 'zoom',
    status: 'upcoming',
    meetingLink: 'https://zoom.us/j/1234567890',
  },
  {
    id: '2',
    mentor: 'שרה כהן',
    mentorId: '1',
    mentorEmail: 'sarah@example.com',
    specialty: 'יזמות',
    date: '20 ינואר 2024',
    time: '10:00',
    duration: '45 דקות',
    type: 'phone',
    status: 'completed',
    phoneNumber: '050-1234567',
  },
  {
    id: '3',
    mentor: 'רחל אברהם',
    mentorId: '3',
    mentorEmail: 'rachel@example.com',
    specialty: 'ייעוץ עסקי',
    date: '30 ינואר 2024',
    time: '16:00',
    duration: '60 דקות',
    type: 'zoom',
    status: 'upcoming',
    meetingLink: 'https://zoom.us/j/0987654321',
  },
];

export default function MyBookingsScreen() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  const filteredBookings = filter === 'all'
    ? sampleBookings
    : sampleBookings.filter((b) => b.status === filter);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.purple[50], theme.colors.pink[50], '#FFFFFF']}
        style={styles.hero}
      >
        <Text style={styles.heroTitle}>הפגישות שלי</Text>
        <Text style={styles.heroSubtitle}>
          נהלי את כל הפגישות שלך עם המאמנות
        </Text>
      </LinearGradient>

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
          style={[styles.filterButton, filter === 'upcoming' && styles.filterButtonActive]}
          onPress={() => setFilter('upcoming')}
        >
          <Text style={[styles.filterText, filter === 'upcoming' && styles.filterTextActive]}>
            קרובות
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
            שהיו
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <View style={styles.bookingsList}>
        {filteredBookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </View>

      {filteredBookings.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color={theme.colors.gray[300]} />
          <Text style={[styles.emptyTitle, rtlText]}>אין פגישות</Text>
          <Text style={[styles.emptyText, rtlText]}>
            {filter === 'upcoming' ? 'אין לך פגישות קרובות' : 'אין לך פגישות שהיו'}
          </Text>
          {filter === 'all' && (
            <>
              <Text style={[styles.emptyDescription, rtlText]}>
                רוצה לקבוע פגישה עם אחת המנטוריות שלנו?
              </Text>
              <Button
                variant="gradient"
                gradientColors={[theme.colors.purple[500], theme.colors.pink[600]]}
                onPress={() => router.push('/coaches-and-consultants')}
                style={styles.ctaButton}
              >
                <View style={styles.ctaButtonContent}>
                  <Ionicons name="people" size={20} color="white" />
                  <Text style={styles.ctaButtonText}>לרשימת המנטוריות</Text>
                </View>
              </Button>
            </>
          )}
        </View>
      )}

      <View style={styles.footer} />
    </ScrollView>
  );
}

function BookingCard({ booking }: { booking: any }) {
  const isUpcoming = booking.status === 'upcoming';

  const handleJoinMeeting = async () => {
    if (booking.type === 'zoom' && booking.meetingLink) {
      try {
        const supported = await Linking.canOpenURL(booking.meetingLink);
        if (supported) {
          await Linking.openURL(booking.meetingLink);
        } else {
          Alert.alert('שגיאה', 'לא ניתן לפתוח את קישור הזום');
        }
      } catch (error) {
        Alert.alert('שגיאה', 'אירעה שגיאה בפתיחת הקישור');
      }
    } else if (booking.type === 'phone' && booking.phoneNumber) {
      try {
        const phoneUrl = `tel:${booking.phoneNumber}`;
        const supported = await Linking.canOpenURL(phoneUrl);
        if (supported) {
          await Linking.openURL(phoneUrl);
        } else {
          Alert.alert('מספר טלפון', booking.phoneNumber);
        }
      } catch (error) {
        Alert.alert('מספר טלפון', booking.phoneNumber);
      }
    } else {
      Alert.alert(
        'פגישה קרובה',
        'פרטי הפגישה יישלחו אליך באימייל לפני מועד הפגישה'
      );
    }
  };

  const handleReschedule = () => {
    router.push({
      pathname: '/booking',
      params: {
        mentorId: booking.mentorId,
        mentorName: booking.mentor,
        mentorEmail: booking.mentorEmail,
        reschedule: 'true',
        bookingId: booking.id,
      },
    });
  };

  return (
    <Card style={styles.bookingCard}>
      <CardHeader>
        <View style={styles.bookingHeader}>
          <View>
            <CardTitle style={[styles.mentorName, rtlText]}>{booking.mentor}</CardTitle>
            <Text style={[styles.specialty, rtlText]}>{booking.specialty}</Text>
          </View>
          <Badge
            style={{
              backgroundColor: isUpcoming ? theme.colors.green[100] : theme.colors.gray[100],
            }}
            textStyle={{
              color: isUpcoming ? theme.colors.green[700] : theme.colors.gray[700],
            }}
          >
            {isUpcoming ? 'קרובה' : 'הייתה'}
          </Badge>
        </View>
      </CardHeader>

      <CardContent>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color={theme.colors.purple[500]} />
            <Text style={[styles.detailText, rtlText]}>{booking.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time" size={16} color={theme.colors.purple[500]} />
            <Text style={[styles.detailText, rtlText]}>{booking.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="hourglass" size={16} color={theme.colors.purple[500]} />
            <Text style={[styles.detailText, rtlText]}>{booking.duration}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons
              name={booking.type === 'zoom' ? 'videocam' : 'call'}
              size={16}
              color={theme.colors.purple[500]}
            />
            <Text style={[styles.detailText, rtlText]}>
              {booking.type === 'zoom' ? 'זום' : 'טלפון'}
            </Text>
          </View>
        </View>

        {isUpcoming && (
          <View style={styles.actionsContainer}>
            <Button
              variant="gradient"
              gradientColors={[theme.colors.purple[500], theme.colors.pink[600]]}
              size="sm"
              style={{ flex: 1 }}
              onPress={handleJoinMeeting}
            >
              <Text style={[styles.buttonText, rtlText]}>הצטרפי לפגישה</Text>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onPress={handleReschedule}
            >
              <Text style={[styles.outlineButtonText, rtlText]}>קבעי מחדש</Text>
            </Button>
          </View>
        )}
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
  bookingsList: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  bookingCard: {
    ...theme.shadows.lg,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mentorName: {
    fontSize: theme.fontSize.xl,
    marginBottom: theme.spacing.xs,
  },
  specialty: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.purple[600],
    fontWeight: theme.fontWeight.medium,
  },
  detailsContainer: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  detailText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  buttonText: {
    color: 'white',
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  outlineButtonText: {
    color: theme.colors.gray[700],
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing['6xl'],
    paddingHorizontal: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[700],
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[500],
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  ctaButton: {
    ...theme.shadows.lg,
  },
  ctaButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  ctaButtonText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: 'white',
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

