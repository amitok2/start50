import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { rtlText } from '@/utils/rtl';

export default function ManageMyBookingsScreen() {
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'past'>('pending');

  const appointments = [
    {
      id: '1',
      user_name: 'רחל לוי',
      user_email: 'rachel@example.com',
      user_phone: '050-1234567',
      user_message: 'היי! אשמח לקבל ייעוץ בנושא קידום בקריירה',
      date: '15 ינואר 2025',
      status: 'pending_approval',
    },
    {
      id: '2',
      user_name: 'דינה כהן',
      user_email: 'dina@example.com',
      user_phone: '052-9876543',
      date: '18 ינואר 2025',
      time: '14:00',
      status: 'confirmed',
    },
    {
      id: '3',
      user_name: 'שרה אברהם',
      user_email: 'sarah@example.com',
      user_phone: '054-5555555',
      user_message: 'מעוניינת בייעוץ עסקי',
      date: '20 ינואר 2025',
      status: 'pending_approval',
    },
    {
      id: '4',
      user_name: 'מרים גולן',
      user_email: 'miriam@example.com',
      date: '10 ינואר 2025',
      status: 'completed',
    },
  ];

  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab === 'pending') return apt.status === 'pending_approval';
    if (activeTab === 'confirmed') return apt.status === 'confirmed';
    if (activeTab === 'past') return apt.status === 'completed';
    return false;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return { bg: theme.colors.yellow[100], text: theme.colors.yellow[700], label: 'ממתינה לאישור' };
      case 'confirmed':
        return { bg: theme.colors.green[100], text: theme.colors.green[700], label: 'מאושרת' };
      case 'completed':
        return { bg: theme.colors.blue[100], text: theme.colors.blue[700], label: 'הושלמה' };
      default:
        return { bg: theme.colors.gray[100], text: theme.colors.gray[700], label: status };
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.purple[50], theme.colors.pink[50], '#FFFFFF']}
        style={styles.hero}
      >
        <Text style={[styles.heroTitle, rtlText]}>ניהול הפגישות שלי</Text>
        <Text style={[styles.heroSubtitle, rtlText]}>
          נהלי את כל בקשות הפגישה ולוח הזמנים שלך
        </Text>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive, rtlText]}>
            בקשות חדשות ({appointments.filter((a) => a.status === 'pending_approval').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'confirmed' && styles.tabActive]}
          onPress={() => setActiveTab('confirmed')}
        >
          <Text style={[styles.tabText, activeTab === 'confirmed' && styles.tabTextActive, rtlText]}>
            מאושרות ({appointments.filter((a) => a.status === 'confirmed').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive, rtlText]}>
            עבר ({appointments.filter((a) => a.status === 'completed').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Appointments List */}
      <View style={styles.appointmentsSection}>
        {filteredAppointments.length === 0 ? (
          <Card style={styles.emptyCard}>
            <CardContent>
              <Ionicons name="calendar-outline" size={64} color={theme.colors.gray[300]} />
              <Text style={[styles.emptyText, rtlText]}>אין פגישות</Text>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => {
            const statusInfo = getStatusBadge(appointment.status);
            return (
              <Card key={appointment.id} style={styles.appointmentCard}>
                <CardHeader>
                  <View style={styles.appointmentHeader}>
                    <CardTitle style={[styles.appointmentName, rtlText]}>
                      {appointment.user_name}
                    </CardTitle>
                    <Badge
                      style={{ backgroundColor: statusInfo.bg }}
                      textStyle={{ color: statusInfo.text }}
                    >
                      {statusInfo.label}
                    </Badge>
                  </View>
                </CardHeader>
                <CardContent>
                  <View style={styles.appointmentDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons name="mail" size={16} color={theme.colors.purple[500]} />
                      <Text style={[styles.detailText, rtlText]}>{appointment.user_email}</Text>
                    </View>
                    {appointment.user_phone && (
                      <View style={styles.detailRow}>
                        <Ionicons name="call" size={16} color={theme.colors.purple[500]} />
                        <Text style={[styles.detailText, rtlText]}>{appointment.user_phone}</Text>
                      </View>
                    )}
                    <View style={styles.detailRow}>
                      <Ionicons name="calendar" size={16} color={theme.colors.purple[500]} />
                      <Text style={[styles.detailText, rtlText]}>{appointment.date}</Text>
                    </View>
                    {appointment.time && (
                      <View style={styles.detailRow}>
                        <Ionicons name="time" size={16} color={theme.colors.purple[500]} />
                        <Text style={[styles.detailText, rtlText]}>{appointment.time}</Text>
                      </View>
                    )}
                    {appointment.user_message && (
                      <View style={styles.messageBox}>
                        <Text style={[styles.messageText, rtlText]}>{appointment.user_message}</Text>
                      </View>
                    )}
                  </View>

                  {appointment.status === 'pending_approval' && (
                    <View style={styles.actionsContainer}>
                      <Button
                        variant="gradient"
                        gradientColors={[theme.colors.green[500], theme.colors.green[600]]}
                        size="sm"
                        style={{ flex: 1 }}
                        onPress={() => router.push({ pathname: '/approve-booking', params: { id: appointment.id } } as any)}
                      >
                        <View style={styles.actionButtonContent}>
                          <Ionicons name="checkmark-circle" size={18} color="white" />
                          <Text style={styles.actionButtonText}>אשר</Text>
                        </View>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        style={{ flex: 1, borderColor: theme.colors.red[500] }}
                        onPress={() => {}}
                      >
                        <View style={styles.actionButtonContent}>
                          <Ionicons name="close-circle" size={18} color={theme.colors.red[500]} />
                          <Text style={[styles.actionButtonText, { color: theme.colors.red[500] }]}>דחה</Text>
                        </View>
                      </Button>
                    </View>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
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
  heroTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.sm,
  },
  heroSubtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[600],
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: theme.colors.purple[500],
  },
  tabText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray[700],
  },
  tabTextActive: {
    color: 'white',
  },
  appointmentsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  appointmentCard: {
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  appointmentName: {
    fontSize: theme.fontSize.xl,
    flex: 1,
  },
  appointmentDetails: {
    gap: theme.spacing.sm,
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
  messageBox: {
    backgroundColor: theme.colors.gray[50],
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  messageText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    lineHeight: theme.fontSize.sm * 1.5,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  actionButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: 'white',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing['6xl'],
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.gray[500],
    marginTop: theme.spacing.lg,
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

