import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

export default function InterviewPrepAIScreen() {
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobDescription: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Generated prep materials!');
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.blue[500], theme.colors.purple[500], theme.colors.pink[500]]}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Ionicons name="school" size={64} color="white" />
          <Text style={styles.heroTitle}>הכנה לראיון עבודה AI</Text>
          <Text style={styles.heroSubtitle}>
            קבלי חבילת הכנה מקיפה עם שאלות צפויות וטיפים מעשיים
          </Text>
        </View>
      </LinearGradient>

      {/* Form */}
      <View style={styles.section}>
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>פרטי התפקיד</CardTitle>
            <CardDescription>
              מלאי את הפרטים כדי לקבל הכנה מותאמת אישית
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View style={styles.formGroup}>
              <Text style={styles.label}>שם החברה *</Text>
              <Input
                placeholder="למשל: Microsoft"
                value={formData.companyName}
                onChangeText={(text) => setFormData({ ...formData, companyName: text })}
                style={styles.input}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>תפקיד *</Text>
              <Input
                placeholder="למשל: מנהלת מוצר"
                value={formData.jobTitle}
                onChangeText={(text) => setFormData({ ...formData, jobTitle: text })}
                style={styles.input}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>תיאור התפקיד (אופציונלי)</Text>
              <Textarea
                placeholder="הדבקי כאן את תיאור התפקיד מהמודעה..."
                value={formData.jobDescription}
                onChangeText={(text) => setFormData({ ...formData, jobDescription: text })}
                numberOfLines={6}
                style={styles.textarea}
              />
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Generate Button */}
      <View style={styles.section}>
        <Button
          variant="gradient"
          gradientColors={[theme.colors.blue[500], theme.colors.purple[500]]}
          onPress={handleGenerate}
          loading={isLoading}
          disabled={!formData.companyName.trim() || !formData.jobTitle.trim()}
        >
          <Ionicons name="sparkles" size={20} color="white" />
          <Text style={styles.buttonText}>צור חבילת הכנה</Text>
        </Button>
      </View>

      {/* What You'll Get */}
      <View style={styles.section}>
        <Card style={styles.benefitsCard}>
          <CardHeader>
            <CardTitle>מה תקבלי?</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.benefit}>
              <Ionicons name="help-circle" size={24} color={theme.colors.blue[500]} />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>שאלות ראיון צפויות</Text>
                <Text style={styles.benefitText}>
                  שאלות כלליות ושאלות ספציפיות לתפקיד שלך
                </Text>
              </View>
            </View>

            <View style={styles.benefit}>
              <Ionicons name="key" size={24} color={theme.colors.purple[500]} />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>נקודות מפתח לתשובות</Text>
                <Text style={styles.benefitText}>
                  מה חשוב להדגיש בכל תשובה
                </Text>
              </View>
            </View>

            <View style={styles.benefit}>
              <Ionicons name="bulb" size={24} color={theme.colors.orange[500]} />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>טיפים מעשיים</Text>
                <Text style={styles.benefitText}>
                  איך להציג את היתרונות שלך בגיל 50+
                </Text>
              </View>
            </View>

            <View style={styles.benefit}>
              <Ionicons name="star" size={24} color={theme.colors.rose[500]} />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>סימולציית ראיון</Text>
                <Text style={styles.benefitText}>
                  תרגול מעשי עם פידבק מיידי
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Tips */}
      <View style={styles.section}>
        <Card style={styles.tipsCard}>
          <CardHeader>
            <CardTitle>
              <Ionicons name="trophy" size={24} color={theme.colors.orange[600]} />
              {' '}היתרונות שלך בגיל 50+
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text style={styles.tipText}>✨ ניסיון עשיר ומגוון</Text>
            <Text style={styles.tipText}>✨ בגרות ויציבות רגשית</Text>
            <Text style={styles.tipText}>✨ כישורי תקשורת מפותחים</Text>
            <Text style={styles.tipText}>✨ הבנה עמוקה של צרכי לקוחות</Text>
            <Text style={styles.tipText}>✨ מנטורינג ופיתוח עובדים</Text>
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
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: theme.fontSize.base,
    color: 'white',
    opacity: 0.95,
    textAlign: 'center',
    lineHeight: theme.fontSize.base * 1.6,
  },
  section: {
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
    textAlign: 'right',
  },
  input: {
    textAlign: 'right',
  },
  textarea: {
    textAlign: 'right',
  },
  buttonText: {
    color: 'white',
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
  benefitsCard: {
    backgroundColor: theme.colors.blue[50],
    borderColor: theme.colors.blue[100],
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.xs,
    textAlign: 'right',
  },
  benefitText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    textAlign: 'right',
    lineHeight: theme.fontSize.sm * 1.5,
  },
  tipsCard: {
    backgroundColor: theme.colors.orange[50],
    borderColor: theme.colors.orange[100],
  },
  tipText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    textAlign: 'right',
    lineHeight: theme.fontSize.base * 1.8,
    marginBottom: theme.spacing.md,
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

