import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
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

export default function EditMentorProfileScreen() {
  const [formData, setFormData] = useState({
    mentor_name: 'שרה כהן',
    contact_email: 'sarah@example.com',
    specialty: 'יזמות ופיתוח עסקי',
    bio: 'מנטורית עם 15 שנות ניסיון בעולם היזמות והעסקים',
    description: 'מתמחה בייעוץ עסקי, בניית תוכניות עסקיות, וליווי יזמות בתהליך הקמת העסק.',
    meeting_availability: 'זום, טלפון',
    duration: '60 דקות',
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient
          colors={[theme.colors.purple[500], theme.colors.pink[500], theme.colors.rose[500]]}
          style={styles.hero}
        >
          <View style={styles.avatarContainer}>
            <Avatar size={100} fallback={formData.mentor_name.charAt(0)} />
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
                {' '}פרטים בסיסיים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <View style={styles.formGroup}>
                <Text style={[styles.label, rtlText]}>שם המנטורית *</Text>
                <Input
                  value={formData.mentor_name}
                  onChangeText={(text) => handleInputChange('mentor_name', text)}
                  style={[styles.input, rtlText]}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, rtlText]}>אימייל ליצירת קשר *</Text>
                <Input
                  value={formData.contact_email}
                  onChangeText={(text) => handleInputChange('contact_email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[styles.input, rtlText]}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, rtlText]}>התמחות *</Text>
                <Input
                  value={formData.specialty}
                  onChangeText={(text) => handleInputChange('specialty', text)}
                  style={[styles.input, rtlText]}
                />
              </View>
            </CardContent>
          </Card>
        </View>

        {/* About Section */}
        <View style={styles.formSection}>
          <Card style={styles.card}>
            <CardHeader>
              <CardTitle style={rtlText}>
                <Ionicons name="document-text" size={20} color={theme.colors.purple[600]} />
                {' '}אודות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <View style={styles.formGroup}>
                <Text style={[styles.label, rtlText]}>ביוגרפיה קצרה</Text>
                <Textarea
                  value={formData.bio}
                  onChangeText={(text) => handleInputChange('bio', text)}
                  numberOfLines={3}
                  style={[styles.textarea, rtlText]}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, rtlText]}>תיאור מפורט</Text>
                <Textarea
                  value={formData.description}
                  onChangeText={(text) => handleInputChange('description', text)}
                  numberOfLines={5}
                  style={[styles.textarea, rtlText]}
                  placeholder="תארי את הניסיון, המומחיות והשירותים שלך..."
                />
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Availability Section */}
        <View style={styles.formSection}>
          <Card style={styles.card}>
            <CardHeader>
              <CardTitle style={rtlText}>
                <Ionicons name="calendar" size={20} color={theme.colors.purple[600]} />
                {' '}זמינות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <View style={styles.formGroup}>
                <Text style={[styles.label, rtlText]}>סוגי פגישות</Text>
                <Input
                  value={formData.meeting_availability}
                  onChangeText={(text) => handleInputChange('meeting_availability', text)}
                  placeholder="זום, טלפון, פנים לפנים"
                  style={[styles.input, rtlText]}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, rtlText]}>משך פגישה</Text>
                <Input
                  value={formData.duration}
                  onChangeText={(text) => handleInputChange('duration', text)}
                  placeholder="60 דקות"
                  style={[styles.input, rtlText]}
                />
              </View>
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
            disabled={!formData.mentor_name.trim() || !formData.contact_email.trim()}
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
    </KeyboardAvoidingView>
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

