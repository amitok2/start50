import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { rtlText, rtlView } from '@/utils/rtl';

export default function ApplyForMembershipScreen() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whyJoin: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.whyJoin.trim()) {
      Alert.alert('שגיאה', 'נא למלא את כל השדות');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('שגיאה', 'נא להזין כתובת אימייל תקינה');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSubmitted(true);
    } catch (error) {
      Alert.alert('שגיאה', 'אירעה שגיאה בשליחת הבקשה. אנא נסי שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[theme.colors.green[400], theme.colors.teal[500], theme.colors.cyan[600]]}
          style={styles.successHero}
        >
          <Ionicons name="checkmark-circle" size={120} color="white" />
          <Text style={[styles.successTitle, rtlText]}>הבקשה נשלחה בהצלחה!</Text>
        </LinearGradient>

        <View style={styles.section}>
          <Card style={styles.successCard}>
            <CardHeader>
              <CardTitle style={[styles.successCardTitle, rtlText]}>
                <Ionicons name="heart" size={24} color={theme.colors.rose[600]} />
                {' '}ברוכה הבאה לקהילת ReStart 50+!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Text style={[styles.successText, rtlText]}>
                הבקשה שלך להצטרפות לקהילה התקבלה בהצלחה! 🎉
              </Text>
              <Text style={[styles.successText, rtlText]}>
                צוות ReStart יבדוק את הבקשה שלך בקרוב ותקבלי אישור באימייל.
              </Text>
              <Text style={[styles.successText, rtlText]}>
                בינתיים, אנחנו מזמינות אותך להצטרף לקבוצת הווטסאפ שלנו!
              </Text>
            </CardContent>
          </Card>
        </View>

        <View style={styles.section}>
          <Card style={styles.nextStepsCard}>
            <CardHeader>
              <CardTitle style={rtlText}>הצעדים הבאים</CardTitle>
            </CardHeader>
            <CardContent>
              <View style={[styles.step, rtlView]}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={[styles.stepText, rtlText]}>
                  נבדוק את הבקשה שלך ונשלח לך אישור באימייל
                </Text>
              </View>
              <View style={[styles.step, rtlView]}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={[styles.stepText, rtlText]}>
                  תקבלי הודעת ברוכה הבאה עם פרטי התחברות
                </Text>
              </View>
              <View style={[styles.step, rtlView]}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={[styles.stepText, rtlText]}>
                  תוכלי להתחיל ליהנות מכל השירותים שלנו!
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>

        <View style={styles.section}>
          <Button
            variant="gradient"
            gradientColors={[theme.colors.purple[500], theme.colors.pink[600]]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>חזרה לדף הקודם</Text>
          </Button>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.purple[500], theme.colors.pink[500], theme.colors.rose[500]]}
        style={styles.hero}
      >
        <Ionicons name="sparkles" size={64} color="white" />
        <Text style={[styles.heroTitle, rtlText]}>הצטרפי לקהילת ReStart 50+</Text>
        <Text style={[styles.heroSubtitle, rtlText]}>
          קהילה תומכת ומעצימה לנשים בגיל 50 ומעלה
        </Text>
      </LinearGradient>

      {/* Why Join */}
      <View style={styles.section}>
        <Card style={styles.whyJoinCard}>
          <CardHeader>
            <CardTitle style={[styles.whyJoinTitle, rtlText]}>
              <Ionicons name="heart" size={24} color={theme.colors.rose[600]} />
              {' '}למה להצטרף?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View style={[styles.benefit, rtlView]}>
              <Ionicons name="people" size={24} color={theme.colors.purple[500]} />
              <Text style={[styles.benefitText, rtlText]}>
                קהילה תומכת של נשים בגיל 50+ שמבינות אותך
              </Text>
            </View>
            <View style={[styles.benefit, rtlView]}>
              <Ionicons name="briefcase" size={24} color={theme.colors.blue[500]} />
              <Text style={[styles.benefitText, rtlText]}>
                כלים מעשיים לפיתוח קריירה ויזמות
              </Text>
            </View>
            <View style={[styles.benefit, rtlView]}>
              <Ionicons name="school" size={24} color={theme.colors.green[500]} />
              <Text style={[styles.benefitText, rtlText]}>
                סדנאות, קורסים ופעילויות מגוונות
              </Text>
            </View>
            <View style={[styles.benefit, rtlView]}>
              <Ionicons name="star" size={24} color={theme.colors.orange[500]} />
              <Text style={[styles.benefitText, rtlText]}>
                ייעוץ אישי ממנטוריות מובילות
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Form */}
      <View style={styles.section}>
        <Card style={styles.formCard}>
          <CardHeader>
            <CardTitle style={rtlText}>פרטים אישיים</CardTitle>
            <CardDescription style={rtlText}>
              מלאי את הפרטים שלך כדי להצטרף לקהילה
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Name */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, rtlText]}>שם מלא *</Text>
              <Input
                placeholder="השם שלך"
                value={formData.fullName}
                onChangeText={(text) => handleInputChange('fullName', text)}
                style={[styles.input, rtlText]}
              />
            </View>

            {/* Email */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, rtlText]}>אימייל *</Text>
              <Input
                placeholder="your@email.com"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, rtlText]}
              />
            </View>

            {/* Why Join */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, rtlText]}>למה את רוצה להצטרף? *</Text>
              <Textarea
                placeholder="ספרי לנו קצת על עצמך ומה את מחפשת בקהילה שלנו..."
                value={formData.whyJoin}
                onChangeText={(text) => handleInputChange('whyJoin', text)}
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
          disabled={!formData.fullName.trim() || !formData.email.trim() || !formData.whyJoin.trim()}
          style={styles.submitButton}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="send" size={20} color="white" />
            <Text style={styles.buttonText}>
              {isSubmitting ? 'שולח...' : 'שלח בקשה להצטרפות'}
            </Text>
          </View>
        </Button>
      </View>

      {/* Privacy Note */}
      <View style={styles.section}>
        <Card style={styles.privacyCard}>
          <CardContent>
            <View style={[styles.privacyContent, rtlView]}>
              <Ionicons name="shield-checkmark" size={24} color={theme.colors.green[600]} />
              <Text style={[styles.privacyText, rtlText]}>
                הפרטים שלך מוגנים ולא ישותפו עם גורם שלישי
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
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  heroSubtitle: {
    fontSize: theme.fontSize.lg,
    color: 'white',
    opacity: 0.95,
    textAlign: 'center',
    lineHeight: theme.fontSize.lg * 1.5,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  whyJoinCard: {
    backgroundColor: theme.colors.rose[50],
    borderColor: theme.colors.rose[100],
  },
  whyJoinTitle: {
    color: theme.colors.rose[800],
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  benefitText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
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
  privacyCard: {
    backgroundColor: theme.colors.green[50],
    borderColor: theme.colors.green[100],
  },
  privacyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  privacyText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.green[800],
    lineHeight: theme.fontSize.sm * 1.5,
  },
  footer: {
    height: theme.spacing['2xl'],
  },
  // Success Styles
  successHero: {
    paddingVertical: theme.spacing['6xl'],
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  successCard: {
    backgroundColor: theme.colors.rose[50],
    borderColor: theme.colors.rose[100],
    ...theme.shadows.xl,
  },
  successCardTitle: {
    color: theme.colors.rose[800],
  },
  successText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    lineHeight: theme.fontSize.base * 1.6,
    marginBottom: theme.spacing.md,
  },
  nextStepsCard: {
    backgroundColor: theme.colors.blue[50],
    borderColor: theme.colors.blue[100],
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
    backgroundColor: theme.colors.blue[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: 'white',
  },
  stepText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    lineHeight: theme.fontSize.sm * 1.5,
  },
});

