import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { rtlText, rtlView } from '@/utils/rtl';

export default function BookingScreen() {
  const params = useLocalSearchParams();
  const mentorId = params.mentorId as string;
  const mentorName = params.mentorName as string;
  const mentorEmail = params.mentorEmail as string;

  const [formData, setFormData] = useState({
    user_name: '',
    user_phone: '',
    user_message: '',
    preferred_meeting_type: 'לא משנה',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const meetingTypes = [
    { value: 'לא משנה', label: 'לא משנה' },
    { value: 'זום', label: 'זום' },
    { value: 'פנים לפנים', label: 'פנים לפנים' },
    { value: 'טלפון', label: 'טלפון' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.user_name.trim() || !formData.user_phone.trim()) {
      Alert.alert('שגיאה', 'נא למלא את כל השדות החובה (שם ומספר טלפון)');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        'הבקשה נשלחה בהצלחה! 🎉',
        `הבקשה שלך לפגישה עם ${mentorName} נשלחה בהצלחה. המנטורית תחזור אלייך בהקדם.`,
        [
          {
            text: 'אישור',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('שגיאה', 'אירעה שגיאה בשליחת הבקשה. אנא נסי שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.purple[500], theme.colors.pink[500], theme.colors.rose[500]]}
        style={styles.hero}
      >
        <Ionicons name="calendar" size={64} color="white" />
        <Text style={[styles.heroTitle, rtlText]}>קביעת פגישת היכרות</Text>
        <Text style={[styles.heroSubtitle, rtlText]}>עם {mentorName}</Text>
      </LinearGradient>

      {/* Info Card */}
      <View style={styles.section}>
        <Card style={styles.infoCard}>
          <CardContent style={styles.infoContent}>
            <Ionicons name="information-circle" size={24} color={theme.colors.blue[600]} />
            <Text style={[styles.infoText, rtlText]}>
              מלאי את הפרטים שלך והמנטורית תחזור אלייך בהקדם לתיאום הפגישה
            </Text>
          </CardContent>
        </Card>
      </View>

      {/* Form */}
      <View style={styles.section}>
        <Card style={styles.formCard}>
          <CardHeader>
            <CardTitle style={rtlText}>פרטים אישיים</CardTitle>
            <CardDescription style={rtlText}>
              המידע שלך ישמש את המנטורית לתיאום הפגישה
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Name */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, rtlText]}>שם מלא *</Text>
              <Input
                placeholder="השם שלך"
                value={formData.user_name}
                onChangeText={(text) => handleInputChange('user_name', text)}
                style={[styles.input, rtlText]}
              />
            </View>

            {/* Phone */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, rtlText]}>מספר טלפון *</Text>
              <Input
                placeholder="050-1234567"
                value={formData.user_phone}
                onChangeText={(text) => handleInputChange('user_phone', text)}
                keyboardType="phone-pad"
                style={[styles.input, rtlText]}
              />
            </View>

            {/* Meeting Type */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, rtlText]}>העדפה לסוג פגישה</Text>
              <View style={styles.meetingTypeContainer}>
                {meetingTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={formData.preferred_meeting_type === type.value ? 'default' : 'outline'}
                    onPress={() => handleInputChange('preferred_meeting_type', type.value)}
                    style={[
                      styles.meetingTypeButton,
                      formData.preferred_meeting_type === type.value && styles.meetingTypeButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.meetingTypeText,
                        formData.preferred_meeting_type === type.value && styles.meetingTypeTextActive,
                        rtlText,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </Button>
                ))}
              </View>
            </View>

            {/* Message */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, rtlText]}>הודעה למנטורית (אופציונלי)</Text>
              <Textarea
                placeholder="ספרי קצת על עצמך ועל מה שהיית רוצה לקבל עזרה בו..."
                value={formData.user_message}
                onChangeText={(text) => handleInputChange('user_message', text)}
                numberOfLines={6}
                style={[styles.textarea, rtlText]}
              />
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Submit Button */}
      <View style={styles.section}>
        <Button
          variant="gradient"
          gradientColors={[theme.colors.purple[500], theme.colors.pink[600]]}
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!formData.user_name.trim() || !formData.user_phone.trim()}
          style={styles.submitButton}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="send" size={20} color="white" />
            <Text style={styles.buttonText}>
              {isSubmitting ? 'שולח...' : 'שלח בקשה לפגישה'}
            </Text>
          </View>
        </Button>
      </View>

      {/* Benefits */}
      <View style={styles.section}>
        <Card style={styles.benefitsCard}>
          <CardHeader>
            <CardTitle style={rtlText}>
              <Ionicons name="star" size={24} color={theme.colors.purple[700]} />
              {' '}מה כולל המפגש?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View style={[styles.benefit, rtlView]}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.green[500]} />
              <Text style={[styles.benefitText, rtlText]}>
                פגישת היכרות אישית עם המנטורית
              </Text>
            </View>
            <View style={[styles.benefit, rtlView]}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.green[500]} />
              <Text style={[styles.benefitText, rtlText]}>
                זיהוי מטרות והגדרת יעדים ברורים
              </Text>
            </View>
            <View style={[styles.benefit, rtlView]}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.green[500]} />
              <Text style={[styles.benefitText, rtlText]}>
                המלצות ראשוניות ותוכנית פעולה
              </Text>
            </View>
            <View style={[styles.benefit, rtlView]}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.green[500]} />
              <Text style={[styles.benefitText, rtlText]}>
                חוויית ליווי מקצועית ואישית
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
    paddingVertical: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  heroSubtitle: {
    fontSize: theme.fontSize.xl,
    color: 'white',
    opacity: 0.95,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  infoCard: {
    backgroundColor: theme.colors.blue[50],
    borderColor: theme.colors.blue[200],
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.blue[800],
    lineHeight: theme.fontSize.sm * 1.5,
  },
  formCard: {
    ...theme.shadows.lg,
  },
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray[700],
    marginBottom: theme.spacing.sm,
  },
  input: {
    textAlign: 'right',
  },
  textarea: {
    textAlign: 'right',
  },
  meetingTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  meetingTypeButton: {
    flex: 1,
    minWidth: '45%',
  },
  meetingTypeButtonActive: {
    backgroundColor: theme.colors.purple[500],
  },
  meetingTypeText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
  },
  meetingTypeTextActive: {
    color: 'white',
  },
  submitButton: {
    ...theme.shadows.lg,
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
  benefitsCard: {
    backgroundColor: theme.colors.purple[50],
    borderColor: theme.colors.purple[100],
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  benefitText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    lineHeight: theme.fontSize.sm * 1.5,
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

