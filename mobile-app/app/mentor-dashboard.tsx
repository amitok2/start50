import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { rtlText } from '@/utils/rtl';

export default function MentorDashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);

  // Sample mentor data
  const mentorData = {
    name: 'שרה כהן',
    specialty: 'יזמות ופיתוח עסקי',
    profileUrl: 'https://rse50.co.il/MentorProfile?id=123',
    imageUrl: null,
  };

  const stats = {
    pendingAppointments: 3,
    upcomingAppointments: 5,
    awaitingCoordination: 2,
    publishedArticles: 7,
    totalViews: 342,
    profileViews: 89,
  };

  const recentAppointments = [
    {
      id: '1',
      user_name: 'רחל לוי',
      date: '15 ינואר 2025',
      status: 'pending_approval',
    },
    {
      id: '2',
      user_name: 'דינה כהן',
      date: '18 ינואר 2025',
      status: 'confirmed',
    },
    {
      id: '3',
      user_name: 'שרה אברהם',
      date: '20 ינואר 2025',
      status: 'pending_approval',
    },
  ];

  const quickActions = [
    {
      id: 'manage-bookings',
      title: 'ניהול פגישות',
      icon: 'calendar',
      color: theme.colors.purple[500],
      route: '/manage-my-bookings',
    },
    {
      id: 'edit-profile',
      title: 'עריכת פרופיל',
      icon: 'person',
      color: theme.colors.blue[500],
      route: '/edit-mentor-profile',
    },
    {
      id: 'write-article',
      title: 'כתיבת מאמר',
      icon: 'create',
      color: theme.colors.green[500],
      route: '/write-article',
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return { bg: theme.colors.yellow[100], text: theme.colors.yellow[700] };
      case 'confirmed':
        return { bg: theme.colors.green[100], text: theme.colors.green[700] };
      default:
        return { bg: theme.colors.gray[100], text: theme.colors.gray[700] };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return 'ממתינה לאישור';
      case 'confirmed':
        return 'מאושרת';
      default:
        return status;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.purple[600], theme.colors.pink[500], theme.colors.rose[400]]}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Ionicons name="stats-chart" size={64} color="white" />
          <Text style={[styles.heroTitle, rtlText]}>לוח הבקרה שלי</Text>
          <Text style={[styles.heroSubtitle, rtlText]}>
            ברוכה הבאה, {mentorData.name}
          </Text>
          <View style={styles.specialtyBadge}>
            <Text style={[styles.specialtyText, rtlText]}>
              {mentorData.specialty}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsSection}>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.rose[50] }]}>
            <Ionicons name="notifications" size={32} color={theme.colors.rose[500]} />
            <Text style={styles.statNumber}>{stats.pendingAppointments}</Text>
            <Text style={[styles.statLabel, rtlText]}>בקשות ממתינות</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.colors.purple[50] }]}>
            <Ionicons name="calendar-sharp" size={32} color={theme.colors.purple[500]} />
            <Text style={styles.statNumber}>{stats.upcomingAppointments}</Text>
            <Text style={[styles.statLabel, rtlText]}>פגישות קרובות</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.colors.orange[50] }]}>
            <Ionicons name="call" size={32} color={theme.colors.orange[500]} />
            <Text style={styles.statNumber}>{stats.awaitingCoordination}</Text>
            <Text style={[styles.statLabel, rtlText]}>ליצירת קשר</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.colors.green[50] }]}>
            <Ionicons name="book" size={32} color={theme.colors.green[500]} />
            <Text style={styles.statNumber}>{stats.publishedArticles}</Text>
            <Text style={[styles.statLabel, rtlText]}>מאמרים מפורסמים</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.colors.blue[50] }]}>
            <Ionicons name="eye" size={32} color={theme.colors.blue[500]} />
            <Text style={styles.statNumber}>{stats.totalViews}</Text>
            <Text style={[styles.statLabel, rtlText]}>צפיות סה"כ</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.colors.indigo[50] }]}>
            <Ionicons name="person" size={32} color={theme.colors.indigo[500]} />
            <Text style={styles.statNumber}>{stats.profileViews}</Text>
            <Text style={[styles.statLabel, rtlText]}>צפיות בפרופיל</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, rtlText]}>פעולות מהירות</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon as any} size={28} color="white" />
              </View>
              <Text style={[styles.actionTitle, rtlText]}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Appointments */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, rtlText]}>פגישות אחרונות</Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => router.push('/manage-my-bookings' as any)}
          >
            <Text style={styles.viewAllText}>הכל</Text>
            <Ionicons name="chevron-back" size={16} color={theme.colors.purple[600]} />
          </Button>
        </View>

        {recentAppointments.map((appointment) => {
          const statusColors = getStatusColor(appointment.status);
          return (
            <Card key={appointment.id} style={styles.appointmentCard}>
              <CardContent style={styles.appointmentContent}>
                <View style={styles.appointmentInfo}>
                  <View style={styles.appointmentHeader}>
                    <Text style={[styles.appointmentName, rtlText]}>
                      {appointment.user_name}
                    </Text>
                    <Badge
                      style={{ backgroundColor: statusColors.bg }}
                      textStyle={{ color: statusColors.text }}
                    >
                      {getStatusText(appointment.status)}
                    </Badge>
                  </View>
                  <View style={styles.appointmentDate}>
                    <Ionicons name="calendar-outline" size={14} color={theme.colors.gray[500]} />
                    <Text style={[styles.appointmentDateText, rtlText]}>
                      {appointment.date}
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          );
        })}
      </View>

      {/* Profile Link Share */}
      <View style={styles.section}>
        <Card style={styles.shareLinkCard}>
          <CardHeader>
            <CardTitle style={rtlText}>
              <Ionicons name="link" size={20} color={theme.colors.purple[600]} />
              {' '}שתפי את הפרופיל שלך
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text style={[styles.shareLinkText, rtlText]}>
              {mentorData.profileUrl}
            </Text>
            <Button
              variant="gradient"
              gradientColors={[theme.colors.purple[500], theme.colors.pink[600]]}
              onPress={() => {}}
              style={styles.shareButton}
            >
              <View style={styles.shareButtonContent}>
                <Ionicons name="copy" size={18} color="white" />
                <Text style={styles.shareButtonText}>העתיקי קישור</Text>
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
    marginTop: theme.spacing.lg,
  },
  heroSubtitle: {
    fontSize: theme.fontSize.lg,
    color: 'white',
    marginTop: theme.spacing.sm,
    opacity: 0.9,
  },
  specialtyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginTop: theme.spacing.md,
  },
  specialtyText: {
    color: 'white',
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  statsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: -theme.spacing['2xl'],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  statCard: {
    width: '48%',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  statNumber: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
  },
  viewAllText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.purple[600],
    fontWeight: theme.fontWeight.medium,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray[700],
    textAlign: 'center',
  },
  appointmentCard: {
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  appointmentContent: {
    padding: theme.spacing.md,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  appointmentName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
  },
  appointmentDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  appointmentDateText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
  },
  shareLinkCard: {
    backgroundColor: theme.colors.purple[50],
    borderColor: theme.colors.purple[100],
  },
  shareLinkText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    backgroundColor: 'white',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  shareButton: {
    ...theme.shadows.md,
  },
  shareButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  shareButtonText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: 'white',
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

