import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { theme } from '@/constants/theme';
import { rtlText } from '@/utils/rtl';

export default function WriteArticleScreen() {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
  });
  const [imageFile, setImageFile] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImagePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        setImageFile(result.assets[0]);
        Alert.alert('הצלחה', 'התמונה נבחרה בהצלחה');
      }
    } catch (error) {
      Alert.alert('שגיאה', 'אירעה שגיאה בבחירת התמונה');
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      Alert.alert('שגיאה', 'יש למלא כותרת ותוכן המאמר');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        'המאמר נשלח בהצלחה! 🎉',
        'המאמר שלך נשלח לעיון ואישור. תקבלי עדכון כאשר הוא יפורסם.',
        [
          {
            text: 'אישור',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('שגיאה', 'אירעה שגיאה בשליחת המאמר. אנא נסי שוב.');
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
          colors={[theme.colors.purple[500], theme.colors.indigo[600], theme.colors.blue[600]]}
          style={styles.hero}
        >
          <Ionicons name="create" size={64} color="white" />
          <Text style={[styles.heroTitle, rtlText]}>כתיבת מאמר חדש</Text>
          <Text style={[styles.heroSubtitle, rtlText]}>
            שתפי את הידע והניסיון שלך עם הקהילה
          </Text>
        </LinearGradient>

        {/* Form */}
        <View style={styles.formSection}>
          <Card style={styles.card}>
            <CardHeader>
              <CardTitle style={rtlText}>
                <Ionicons name="document-text" size={20} color={theme.colors.purple[600]} />
                {' '}פרטי המאמר
              </CardTitle>
            </CardHeader>
            <CardContent>
              <View style={styles.formGroup}>
                <Text style={[styles.label, rtlText]}>כותרת המאמר *</Text>
                <Input
                  value={formData.title}
                  onChangeText={(text) => handleInputChange('title', text)}
                  placeholder="כותרת מעניינת ומושכת לקוראות..."
                  style={[styles.input, rtlText]}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, rtlText]}>תקציר קצר</Text>
                <Textarea
                  value={formData.summary}
                  onChangeText={(text) => handleInputChange('summary', text)}
                  placeholder="תקציר קצר שיעזור לקוראות להחליט אם לקרוא את המאמר..."
                  numberOfLines={3}
                  style={[styles.textarea, rtlText]}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, rtlText]}>תוכן המאמר *</Text>
                <Textarea
                  value={formData.content}
                  onChangeText={(text) => handleInputChange('content', text)}
                  placeholder="כתבי את המאמר המלא. שתפי טיפים, ניסיון אישי, עצות מקצועיות..."
                  numberOfLines={10}
                  style={[styles.textarea, rtlText]}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, rtlText]}>תמונת נושא (אופציונלי)</Text>
                <Button
                  variant="outline"
                  onPress={handleImagePick}
                  style={styles.imageButton}
                >
                  <View style={styles.imageButtonContent}>
                    <Ionicons name="image" size={20} color={theme.colors.purple[600]} />
                    <Text style={[styles.imageButtonText, rtlText]}>
                      {imageFile ? imageFile.name : 'בחרי תמונה'}
                    </Text>
                  </View>
                </Button>
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
                {' '}טיפים לכתיבת מאמר מושך
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Text style={[styles.tipText, rtlText]}>
                💡 כתבי בשפה פשוטה וברורה
              </Text>
              <Text style={[styles.tipText, rtlText]}>
                💡 שתפי דוגמאות אישיות וניסיון מהשטח
              </Text>
              <Text style={[styles.tipText, rtlText]}>
                💡 חלקי את המאמר לפסקאות קצרות וקריאות
              </Text>
              <Text style={[styles.tipText, rtlText]}>
                💡 הוסיפי כותרות משנה לארגון התוכן
              </Text>
              <Text style={[styles.tipText, rtlText]}>
                💡 סיימי עם קריאה לפעולה או שאלה למחשבה
              </Text>
            </CardContent>
          </Card>
        </View>

        {/* Submit Button */}
        <View style={styles.formSection}>
          <Button
            variant="gradient"
            gradientColors={[theme.colors.purple[500], theme.colors.indigo[600]]}
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={!formData.title.trim() || !formData.content.trim()}
            style={styles.submitButton}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="send" size={20} color="white" />
              <Text style={styles.buttonText}>
                {isSubmitting ? 'שולח...' : 'שליחה לאישור'}
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
  imageButton: {
    borderColor: theme.colors.purple[200],
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  imageButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  imageButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.purple[600],
    fontWeight: theme.fontWeight.medium,
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

