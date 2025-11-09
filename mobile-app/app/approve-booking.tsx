import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { rtlText } from '@/utils/rtl';

export default function ApproveBookingScreen() {
  const params = useLocalSearchParams();
  const appointmentId = params.id as string;
  
  const [isUpdating, setIsUpdating] = useState(false);

  // Sample appointment data
  const appointment = {
    id: appointmentId,
    user_name: 'רחל לוי',
    user_email: 'rachel@example.com',
    user_phone: '050-1234567',
    user_message: 'היי! אשמח לקבל ייעוץ בנושא קידום בקריירה',
    mentor_name: 'שרה כהן',
    status: 'pending_approval',
  };

  const handleApprove = async () => {
    setIsUpdating(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        'הפגישה אושרה! 🎉',
        `הודעה נשלחה ל-${appointment.user_name}. המנטורית תיצור איתה קשר טלפוני בהקדם.`,
        [
          {
            text: 'אישור',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('שגיאה', 'אירעה שגיאה באישור הפגישה. אנא נסי שוב.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    Alert.alert(
      'דחיית בקשה',
      'האם את בטוחה שברצונך לדחות בקשה זו?',
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'דחה',
          style: 'destructive',
          onPress: async () => {
            setIsUpdating(true);

            try {
              // Simulate API call
              await new Promise((resolve) => setTimeout(resolve, 1500));

              Alert.alert(
                'הבקשה נדחתה',
                `הודעה נשלחה ל-${appointment.user_name}`,
                [
                  {
                    text: 'אישור',
                    onPress: () => router.back(),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('שגיאה', 'אירעה שגיאה בדחיית הבקשה. אנא נסי שוב.');
            } finally {
              setIsUpdating(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.purple[500], theme.colors.pink[500], theme.colors.rose[500]]}
        style={styles.hero}
      >
        <Ionicons name="calendar-sharp" size={64} color="white" />
        <Text style={[styles.heroTitle, rtlText]}>אישור פגישה</Text>
        <Text style={[styles.heroSubtitle, rtlText]}>
          בקשה לפגישה עם {appointment.user_name}
        </Text>
      </LinearGradient>

      {/* Appointment Details */}
      <View style={styles.section}>
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle style={rtlText}>
              <Ionicons name="person" size={20} color={theme.colors.purple[600]} />
              {' '}פרטי המשתמשת
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={20} color={theme.colors.gray[600]} />
              <Text style={[styles.detailLabel, rtlText]}>שם:</Text>
              <Text style={[styles.detailValue, rtlText]}>{appointment.user_name}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={20} color={theme.colors.gray[600]} />
              <Text style={[styles.detailLabel, rtlText]}>אימייל:</Text>
              <Text style={[styles.detailValue, rtlText]}>{appointment.user_email}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={20} color={theme.colors.gray[600]} />
              <Text style={[styles.detailLabel, rtlText]}>טלפון:</Text>
              <Text style={[styles.detailValue, rtlText]}>{appointment.user_phone}</Text>
            </View>

            {appointment.user_message && (
              <View style={styles.messageSection}>
                <Text style={[styles.messageLabel, rtlText]}>
                  <Ionicons name="chatbubbles-outline" size={16} color={theme.colors.gray[700]} />
                  {' '}הודעת המשתמשת:
                </Text>
                <View style={styles.messageBox}>
                  <Text style={[styles.messageText, rtlText]}>{appointment.user_message}</Text>
                </View>
              </View>
            )}
          </CardContent>
        </Card>
      </View>

      {/* Info Card */}
      <View style={styles.section}>
        <Card style={styles.infoCard}>
          <CardContent>
            <View style={styles.infoContent}>
              <Ionicons name="information-circle" size={24} color={theme.colors.blue[600]} />
              <Text style={[styles.infoText, rtlText]}>
                לאחר אישור הבקשה, המשתמשת תקבל הודעה באימייל. תוכלי ליצור איתה קשר טלפוני לתיאום מועד מדויק לפגישה.
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Action Buttons */}
      <View style={styles.section}>
        <Button
          variant="gradient"
          gradientColors={[theme.colors.green[500], theme.colors.green[600]]}
          onPress={handleApprove}
          loading={isUpdating}
          disabled={isUpdating}
          style={styles.approveButton}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="checkmark-circle" size={24} color="white" />
            <Text style={styles.buttonText}>אשר פגישה</Text>
          </View>
        </Button>

        <Button
          variant="outline"
          onPress={handleReject}
          disabled={isUpdating}
          style={[styles.rejectButton, { borderColor: theme.colors.red[500] }]}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="close-circle" size={24} color={theme.colors.red[500]} />
            <Text style={[styles.buttonText, { color: theme.colors.red[500] }]}>דחה בקשה</Text>
          </View>
        </Button>
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
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    marginTop: theme.spacing.lg,
  },
  heroSubtitle: {
    fontSize: theme.fontSize.base,
    color: 'white',
    marginTop: theme.spacing.sm,
    opacity: 0.9,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  card: {
    ...theme.shadows.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  detailLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray[700],
    minWidth: 60,
  },
  detailValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[900],
    flex: 1,
  },
  messageSection: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  messageLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[700],
    marginBottom: theme.spacing.sm,
  },
  messageBox: {
    backgroundColor: theme.colors.gray[50],
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  messageText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    lineHeight: theme.fontSize.sm * 1.5,
  },
  infoCard: {
    backgroundColor: theme.colors.blue[50],
    borderColor: theme.colors.blue[200],
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.blue[900],
    lineHeight: theme.fontSize.sm * 1.6,
  },
  approveButton: {
    ...theme.shadows.lg,
    marginBottom: theme.spacing.md,
  },
  rejectButton: {
    ...theme.shadows.sm,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  buttonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: 'white',
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

