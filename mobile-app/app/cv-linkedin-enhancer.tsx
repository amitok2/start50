import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

export default function CvLinkedInEnhancerScreen() {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      console.log('Analysis complete!');
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.purple[500], theme.colors.pink[500], theme.colors.rose[500]]}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Ionicons name="document-text" size={64} color="white" />
          <Text style={styles.heroTitle}>שדרוג קו"ח ולינקדאין</Text>
          <Text style={styles.heroSubtitle}>
            כלי AI חכם שיעזור לך להבליט את היתרונות הייחודיים שלך בגיל 50+
          </Text>
        </View>
      </LinearGradient>

      {/* Upload CV Section */}
      <View style={styles.section}>
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>
              <Ionicons name="cloud-upload" size={24} color={theme.colors.purple[500]} />
              {' '}העלאת קורות חיים
            </CardTitle>
            <CardDescription>
              העלי קובץ PDF של קורות החיים שלך לניתוח
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TouchableOpacity style={styles.uploadBox}>
              <Ionicons name="add-circle-outline" size={48} color={theme.colors.gray[400]} />
              <Text style={styles.uploadText}>לחצי להעלאת קובץ</Text>
              <Text style={styles.uploadSubtext}>PDF בלבד, עד 5MB</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>
      </View>

      {/* LinkedIn Profile */}
      <View style={styles.section}>
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>
              <Ionicons name="logo-linkedin" size={24} color={theme.colors.blue[600]} />
              {' '}פרופיל LinkedIn
            </CardTitle>
            <CardDescription>
              הוסיפי קישור לפרופיל הלינקדאין שלך
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="https://www.linkedin.com/in/your-profile"
              value={linkedinUrl}
              onChangeText={setLinkedinUrl}
              style={styles.input}
            />
          </CardContent>
        </Card>
      </View>

      {/* Analyze Button */}
      <View style={styles.section}>
        <Button
          variant="gradient"
          gradientColors={[theme.colors.purple[500], theme.colors.pink[500]]}
          onPress={handleAnalyze}
          loading={isAnalyzing}
          disabled={!linkedinUrl.trim()}
        >
          <Ionicons name="sparkles" size={20} color="white" />
          <Text style={styles.buttonText}>נתח ושפר</Text>
        </Button>
      </View>

      {/* Benefits Section */}
      <View style={styles.section}>
        <Card style={styles.benefitsCard}>
          <CardHeader>
            <CardTitle>מה תקבלי?</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.benefit}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.green[500]} />
              <Text style={styles.benefitText}>
                ניתוח מעמיק של נקודות החוזק והחולשה
              </Text>
            </View>
            <View style={styles.benefit}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.green[500]} />
              <Text style={styles.benefitText}>
                המלצות לשיפור ניסוח והדגשת הניסיון שלך
              </Text>
            </View>
            <View style={styles.benefit}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.green[500]} />
              <Text style={styles.benefitText}>
                מילות מפתח רלוונטיות לתחום שלך
              </Text>
            </View>
            <View style={styles.benefit}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.green[500]} />
              <Text style={styles.benefitText}>
                דגשים מיוחדים לנשים בגיל 50+
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Tips Section */}
      <View style={styles.section}>
        <Card style={styles.tipsCard}>
          <CardHeader>
            <CardTitle>
              <Ionicons name="bulb" size={24} color={theme.colors.orange[500]} />
              {' '}טיפים להצלחה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text style={styles.tipText}>
              💡 הדגישי הישגים מדידים ומספרים קונקרטיים
            </Text>
            <Text style={styles.tipText}>
              💡 הוסיפי מילות מפתח רלוונטיות לתפקיד המבוקש
            </Text>
            <Text style={styles.tipText}>
              💡 ציני הכשרות ותעודות עדכניות
            </Text>
            <Text style={styles.tipText}>
              💡 שמרי על עיצוב נקי ומקצועי
            </Text>
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
  uploadBox: {
    backgroundColor: theme.colors.gray[50],
    borderWidth: 2,
    borderColor: theme.colors.gray[300],
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing['3xl'],
    alignItems: 'center',
  },
  uploadText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray[700],
    marginTop: theme.spacing.md,
  },
  uploadSubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[500],
    marginTop: theme.spacing.xs,
  },
  input: {
    textAlign: 'right',
  },
  buttonText: {
    color: 'white',
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
  benefitsCard: {
    backgroundColor: theme.colors.green[50],
    borderColor: theme.colors.green[100],
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  benefitText: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    textAlign: 'right',
    lineHeight: theme.fontSize.base * 1.5,
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

