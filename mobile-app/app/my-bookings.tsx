import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const sampleBookings = [
  {
    id: '1',
    mentor: 'מיכל לוי',
    specialty: 'שיווק דיגיטלי',
    date: '25 ינואר 2024',
    time: '14:00',
    duration: '60 דקות',
    type: 'zoom',
    status: 'upcoming',
  },
  {
    id: '2',
    mentor: 'שרה כהן',
    specialty: 'יזמות',
    date: '20 ינואר 2024',
    time: '10:00',
    duration: '45 דקות',
    type: 'phone',
    status: 'completed',
  },
  {
    id: '3',
    mentor: 'רחל אברהם',
    specialty: 'ייעוץ עסקי',
    date: '30 ינואר 2024',
    time: '16:00',
    duration: '60 דקות',
    type: 'zoom',
    status: 'upcoming',
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
          <Text style={styles.emptyTitle}>אין פגישות</Text>
          <Text style={styles.emptyText}>
            {filter === 'upcoming' ? 'אין לך פגישות קרובות' : 'אין לך פגישות שהיו'}
          </Text>
        </View>
      )}

      <View style={styles.footer} />
    </ScrollView>
  );
}

function BookingCard({ booking }: { booking: any }) {
  const isUpcoming = booking.status === 'upcoming';

  return (
    <Card style={styles.bookingCard}>
      <CardHeader>
        <View style={styles.bookingHeader}>
          <View>
            <CardTitle style={styles.mentorName}>{booking.mentor}</CardTitle>
            <Text style={styles.specialty}>{booking.specialty}</Text>
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
            <Text style={styles.detailText}>{booking.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time" size={16} color={theme.colors.purple[500]} />
            <Text style={styles.detailText}>{booking.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="hourglass" size={16} color={theme.colors.purple[500]} />
            <Text style={styles.detailText}>{booking.duration}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons
              name={booking.type === 'zoom' ? 'videocam' : 'call'}
              size={16}
              color={theme.colors.purple[500]}
            />
            <Text style={styles.detailText}>{booking.type === 'zoom' ? 'זום' : 'טלפון'}</Text>
          </View>
        </View>

        {isUpcoming && (
          <View style={styles.actionsContainer}>
            <Button
              variant="gradient"
              gradientColors={[theme.colors.purple[500], theme.colors.pink[600]]}
              size="sm"
              style={{ flex: 1 }}
              onPress={() => console.log('Join meeting')}
            >
              <Text style={styles.buttonText}>הצטרפי לפגישה</Text>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onPress={() => console.log('Reschedule')}
            >
              <Text style={styles.outlineButtonText}>קבעי מחדש</Text>
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
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

