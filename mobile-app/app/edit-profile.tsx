import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Avatar } from '@/components/ui/Avatar';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { rtlText } from '@/utils/rtl';

export default function EditProfileScreen() {
  const [formData, setFormData] = useState({
    full_name: 'שרה כהן',
    email: 'sarah@example.com',
    phone: '050-1234567',
    bio: 'אישה יזמית בגיל 52, אוהבת אתגרים חדשים ולמידה מתמדת',
    location: 'תל אביב',
    profession: 'מנהלת מוצר',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        'הצלחה! 🎉',
        'הפרופיל שלך עודכן בהצלחה',
        [
          {
            text: 'אישור',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('שגיאה', 'אירעה שגיאה בעדכון הפרופיל. אנא נסי שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.rose[500], theme.colors.pink[500], theme.colors.purple[500]]}
        style={styles.hero}
      >
        <View style={styles.avatarContainer}>
          <Avatar size={100} fallback={formData.full_name.charAt(0)} />
          <Button
            variant="outline"
            size="sm"
            style={styles.changePhotoButton}
            onPress={() => Alert.alert('בקרוב', 'אפשרות להחלפת תמונה תהיה זמינה בקרוב')}
          >
            <Ionicons name="camera" size={16} color="white" />
            <Text style={styles.changePhotoText}>שנה תמונה</Text>
          </Button>
        </View>
      </LinearGradient>

      {/* Form */}
      <View style={styles.formSection}>
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle style={rtlText}>
              <Ionicons name="person" size={20} color={theme.colors.purple[600]} />
              {' '}פרטים אישיים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.formGroup}>
              <Text style={[styles.label, rtlText]}>שם מלא *</Text>
              <Input
                value={formData.full_name}
                onChangeText={(text) => handleInputChange('full_name', text)}
                style={[styles.input, rtlText]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, rtlText]}>אימייל *</Text>
              <Input
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, rtlText]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, rtlText]}>טלפון</Text>
              <Input
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                keyboardType="phone-pad"
                style={[styles.input, rtlText]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, rtlText]}>מקצוע</Text>
              <Input
                value={formData.profession}
                onChangeText={(text) => handleInputChange('profession', text)}
                style={[styles.input, rtlText]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, rtlText]}>מיקום</Text>
              <Input
                value={formData.location}
                onChangeText={(text) => handleInputChange('location', text)}
                style={[styles.input, rtlText]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, rtlText]}>אודותיי</Text>
              <Textarea
                value={formData.bio}
                onChangeText={(text) => handleInputChange('bio', text)}
                numberOfLines={4}
                style={[styles.textarea, rtlText]}
                placeholder="ספרי קצת על עצמך..."
              />
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Tips Card */}
      <View style={styles.formSection}>
        <Card style={styles.tipsCard}>
          <CardHeader>
            <CardTitle style={rtlText}>
              <Ionicons name="bulb" size={20} color={theme.colors.orange[600]} />
              {' '}טיפים למילוי פרופיל
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text style={[styles.tipText, rtlText]}>
              💡 פרופיל מלא יעזור לך להתחבר עם חברות ומנטוריות שמתאימות לך
            </Text>
            <Text style={[styles.tipText, rtlText]}>
              💡 תארי את החוזקות והתחומים שמעניינים אותך
            </Text>
            <Text style={[styles.tipText, rtlText]}>
              💡 שתפי את הניסיון הייחודי שלך
            </Text>
          </CardContent>
        </Card>
      </View>

      {/* Submit Button */}
      <View style={styles.formSection}>
        <Button
          variant="gradient"
          gradientColors={[theme.colors.purple[500], theme.colors.pink[600]]}
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!formData.full_name.trim() || !formData.email.trim()}
          style={styles.submitButton}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text style={styles.buttonText}>
              {isSubmitting ? 'שומר...' : 'שמור שינויים'}
            </Text>
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
  avatarContainer: {
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  changePhotoButton: {
    borderColor: 'white',
    borderWidth: 2,
  },
  changePhotoText: {
    color: 'white',
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  formSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  card: {
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
  tipsCard: {
    backgroundColor: theme.colors.orange[50],
    borderColor: theme.colors.orange[100],
  },
  tipText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    lineHeight: theme.fontSize.sm * 1.8,
    marginBottom: theme.spacing.sm,
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
  footer: {
    height: theme.spacing['2xl'],
  },
});

