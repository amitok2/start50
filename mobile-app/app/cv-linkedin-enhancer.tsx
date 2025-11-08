import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { rtlView, rtlText } from '@/utils/rtl';

interface AnalysisResult {
  overall_assessment: string;
  strengths: string[];
  areas_for_improvement: string[];
  action_items: string[];
  digital_presence_tips?: string[];
  recommended_roles?: string[];
}

export default function CvLinkedInEnhancerScreen() {
  const [cvFile, setCvFile] = useState<any>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        // Check file size (max 5MB)
        if (file.size && file.size > 5 * 1024 * 1024) {
          Alert.alert('שגיאה', 'הקובץ גדול מדי. גודל מקסימלי: 5MB');
          return;
        }

        setCvFile(file);
        setError('');
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('שגיאה', 'לא הצלחנו לפתוח את בורר הקבצים');
    }
  };

  const handleRemoveFile = () => {
    setCvFile(null);
  };

  const handleAnalyze = async () => {
    if (!cvFile && !linkedinUrl.trim()) {
      setError('אנא העלי קובץ קורות חיים או הזיני קישור ל-LinkedIn');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      // Simulate AI analysis (in production, this would call the actual API)
      // For now, show realistic results
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockAnalysis: AnalysisResult = {
        overall_assessment: `קורות החיים שלך מציגים ניסיון עשיר ומרשים. ${
          cvFile ? 'הקובץ שהעלת' : 'הפרופיל שלך'
        } מדגים מסלול קריירה מגוון עם הישגים משמעותיים. נראה שיש לך נקודות חוזק ייחודיות שכדאי להבליט יותר.`,
        strengths: [
          'ניסיון עשיר ומגוון בתחומים מרכזיים',
          'הצגה ברורה של הישגים והשפעה',
          'מיומנויות טכניות רלוונטיות',
          'ניסיון בניהול ומנהיגות',
        ],
        areas_for_improvement: [
          'הוספת מילות מפתח רלוונטיות לתחום',
          'הדגשת הישגים מדידים עם מספרים',
          'עדכון פרופיל LinkedIn עם פרויקטים אחרונים',
          'שיפור סעיף הסיכום המקצועי',
        ],
        action_items: [
          'הוסיפי סעיף "הישגים מרכזיים" בראש כל תפקיד',
          'שדרגי את הסיכום המקצועי להיות יותר ממוקד',
          'הוסיפי המלצות ב-LinkedIn מעמיתים ומנהלים',
          'צלמי תמונת פרופיל מקצועית ל-LinkedIn',
          'פרסמי פוסטים על התחום המקצועי שלך ב-LinkedIn',
        ],
        digital_presence_tips: [
          'שתפי מאמרים וכתבות בתחום שלך',
          'הצטרפי לקבוצות מקצועיות רלוונטיות',
          'פרסמי על הישגים והצלחות עדכניות',
          'תגובי על פוסטים של אנשי מקצוע בתחום',
        ],
        recommended_roles: [
          'מנהלת מוצר בכירה',
          'יועצת אסטרטגית',
          'ראש צוות פיתוח עסקי',
          'מנהלת תפעול',
          'יועצת ארגונית',
        ],
      };

      setAnalysis(mockAnalysis);
      Alert.alert(
        'הניתוח הושלם! 🎉',
        'קיבלת ניתוח מקיף עם המלצות מעשיות. גללי למטה לצפייה.'
      );
    } catch (err) {
      console.error('Analysis error:', err);
      setError('אירעה שגיאה בניתוח. אנא נסי שוב.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartOver = () => {
    setAnalysis(null);
    setCvFile(null);
    setLinkedinUrl('');
    setError('');
  };

  if (analysis) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[theme.colors.purple[500], theme.colors.pink[500], theme.colors.rose[500]]}
          style={styles.resultsHero}
        >
          <Ionicons name="checkmark-circle" size={64} color="white" />
          <Text style={styles.resultsHeroTitle}>הניתוח הושלם!</Text>
          <Text style={styles.resultsHeroSubtitle}>
            להלן הממצאים וההמלצות שלנו
          </Text>
        </LinearGradient>

        {/* Overall Assessment */}
        <View style={styles.section}>
          <Card style={styles.resultCard}>
            <CardHeader>
              <CardTitle>
                <Ionicons name="document-text" size={24} color={theme.colors.purple[600]} />
                {' '}הערכה כללית
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Text style={[styles.assessmentText, rtlText]}>{analysis.overall_assessment}</Text>
            </CardContent>
          </Card>
        </View>

        {/* Strengths */}
        <View style={styles.section}>
          <Card style={[styles.resultCard, styles.strengthsCard]}>
            <CardHeader>
              <CardTitle>
                <Ionicons name="star" size={24} color={theme.colors.green[600]} />
                {' '}נקודות חוזק
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.strengths.map((strength, index) => (
                <View key={index} style={[styles.listItem, rtlView]}>
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.green[500]} />
                  <Text style={[styles.listText, rtlText]}>{strength}</Text>
                </View>
              ))}
            </CardContent>
          </Card>
        </View>

        {/* Areas for Improvement */}
        <View style={styles.section}>
          <Card style={[styles.resultCard, styles.improvementCard]}>
            <CardHeader>
              <CardTitle>
                <Ionicons name="trending-up" size={24} color={theme.colors.orange[600]} />
                {' '}תחומים לשיפור
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.areas_for_improvement.map((area, index) => (
                <View key={index} style={[styles.listItem, rtlView]}>
                  <Ionicons name="arrow-up-circle" size={20} color={theme.colors.orange[500]} />
                  <Text style={[styles.listText, rtlText]}>{area}</Text>
                </View>
              ))}
            </CardContent>
          </Card>
        </View>

        {/* Action Items */}
        <View style={styles.section}>
          <Card style={[styles.resultCard, styles.actionCard]}>
            <CardHeader>
              <CardTitle>
                <Ionicons name="list" size={24} color={theme.colors.blue[600]} />
                {' '}צעדים מעשיים
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.action_items.map((action, index) => (
                <View key={index} style={[styles.actionItem, rtlView]}>
                  <View style={styles.actionNumber}>
                    <Text style={styles.actionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.actionText, rtlText]}>{action}</Text>
                </View>
              ))}
            </CardContent>
          </Card>
        </View>

        {/* Digital Presence Tips */}
        {analysis.digital_presence_tips && analysis.digital_presence_tips.length > 0 && (
          <View style={styles.section}>
            <Card style={[styles.resultCard, styles.tipsCard]}>
              <CardHeader>
                <CardTitle>
                  <Ionicons name="globe" size={24} color={theme.colors.purple[600]} />
                  {' '}טיפים לנוכחות דיגיטלית
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.digital_presence_tips.map((tip, index) => (
                  <View key={index} style={[styles.listItem, rtlView]}>
                    <Ionicons name="bulb" size={20} color={theme.colors.purple[500]} />
                    <Text style={[styles.listText, rtlText]}>{tip}</Text>
                  </View>
                ))}
              </CardContent>
            </Card>
          </View>
        )}

        {/* Recommended Roles */}
        {analysis.recommended_roles && analysis.recommended_roles.length > 0 && (
          <View style={styles.section}>
            <Card style={[styles.resultCard, styles.rolesCard]}>
              <CardHeader>
                <CardTitle>
                  <Ionicons name="briefcase" size={24} color={theme.colors.rose[600]} />
                  {' '}תפקידים מומלצים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <View style={styles.rolesContainer}>
                  {analysis.recommended_roles.map((role, index) => (
                    <View key={index} style={styles.roleChip}>
                      <Text style={styles.roleText}>{role}</Text>
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>
          </View>
        )}

        {/* Start Over Button */}
        <View style={styles.section}>
          <Button
            variant="outline"
            onPress={handleStartOver}
            style={styles.startOverButton}
          >
            <Ionicons name="refresh" size={20} color={theme.colors.purple[600]} />
            <Text style={styles.startOverButtonText}>נתח מסמך נוסף</Text>
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
        <View style={styles.heroContent}>
          <Ionicons name="document-text" size={64} color="white" />
          <Text style={styles.heroTitle}>שדרוג קו"ח ולינקדאין</Text>
          <Text style={styles.heroSubtitle}>
            כלי AI חכם שיעזור לך להבליט את היתרונות הייחודיים שלך בגיל 50+
          </Text>
        </View>
      </LinearGradient>

      {/* Error Message */}
      {error ? (
        <View style={styles.section}>
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={24} color={theme.colors.red[600]} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        </View>
      ) : null}

      {/* Upload CV Section */}
      <View style={styles.section}>
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>
              <Ionicons name="cloud-upload" size={24} color={theme.colors.purple[500]} />
              {' '}העלאת קורות חיים
            </CardTitle>
            <CardDescription>
              העלי קובץ PDF של קורות החיים שלך לניתוח מעמיק
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cvFile ? (
              <View style={styles.filePreview}>
                <View style={styles.fileInfo}>
                  <Ionicons name="document" size={32} color={theme.colors.purple[600]} />
                  <View style={styles.fileDetails}>
                    <Text style={[styles.fileName, rtlText]} numberOfLines={1}>
                      {cvFile.name}
                    </Text>
                    <Text style={styles.fileSize}>
                      {((cvFile.size || 0) / 1024).toFixed(1)} KB
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={handleRemoveFile} style={styles.removeButton}>
                  <Ionicons name="close-circle" size={28} color={theme.colors.red[500]} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadBox} onPress={handlePickDocument}>
                <Ionicons name="add-circle-outline" size={48} color={theme.colors.gray[400]} />
                <Text style={styles.uploadText}>לחצי להעלאת קובץ</Text>
                <Text style={styles.uploadSubtext}>PDF בלבד, עד 5MB</Text>
              </TouchableOpacity>
            )}
          </CardContent>
        </Card>
      </View>

      {/* Divider */}
      <View style={styles.section}>
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ו/או</Text>
          <View style={styles.dividerLine} />
        </View>
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
              הוסיפי קישור לפרופיל הלינקדאין שלך לניתוח משולב
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="https://www.linkedin.com/in/your-profile"
              value={linkedinUrl}
              onChangeText={setLinkedinUrl}
              style={[styles.input, rtlText]}
              keyboardType="url"
              autoCapitalize="none"
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
          disabled={!cvFile && !linkedinUrl.trim()}
        >
          <Ionicons name="sparkles" size={20} color="white" />
          <Text style={styles.buttonText}>
            {isAnalyzing ? 'מנתח...' : 'נתח ושפר'}
          </Text>
        </Button>
      </View>

      {/* Benefits Section */}
      <View style={styles.section}>
        <Card style={styles.benefitsCard}>
          <CardHeader>
            <CardTitle>מה תקבלי?</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={[styles.benefit, rtlView]}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.green[500]} />
              <Text style={[styles.benefitText, rtlText]}>
                ניתוח מעמיק של נקודות החוזק והחולשה
              </Text>
            </View>
            <View style={[styles.benefit, rtlView]}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.green[500]} />
              <Text style={[styles.benefitText, rtlText]}>
                המלצות לשיפור ניסוח והדגשת הניסיון שלך
              </Text>
            </View>
            <View style={[styles.benefit, rtlView]}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.green[500]} />
              <Text style={[styles.benefitText, rtlText]}>
                מילות מפתח רלוונטיות לתחום שלך
              </Text>
            </View>
            <View style={[styles.benefit, rtlView]}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.green[500]} />
              <Text style={[styles.benefitText, rtlText]}>
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
            <Text style={[styles.tipText, rtlText]}>
              💡 הדגישי הישגים מדידים ומספרים קונקרטיים
            </Text>
            <Text style={[styles.tipText, rtlText]}>
              💡 הוסיפי מילות מפתח רלוונטיות לתפקיד המבוקש
            </Text>
            <Text style={[styles.tipText, rtlText]}>
              💡 ציני הכשרות ותעודות עדכניות
            </Text>
            <Text style={[styles.tipText, rtlText]}>
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
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.red[50],
    borderWidth: 1,
    borderColor: theme.colors.red[200],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  errorText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.red[700],
    textAlign: 'right',
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
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.purple[50],
    borderWidth: 1,
    borderColor: theme.colors.purple[200],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.xs,
  },
  fileSize: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
  },
  removeButton: {
    padding: theme.spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.gray[300],
  },
  dividerText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    fontWeight: theme.fontWeight.medium,
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
    lineHeight: theme.fontSize.base * 1.5,
  },
  tipsCard: {
    backgroundColor: theme.colors.orange[50],
    borderColor: theme.colors.orange[100],
  },
  tipText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    lineHeight: theme.fontSize.base * 1.8,
    marginBottom: theme.spacing.md,
  },
  footer: {
    height: theme.spacing['2xl'],
  },
  // Results Styles
  resultsHero: {
    paddingVertical: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  resultsHeroTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  resultsHeroSubtitle: {
    fontSize: theme.fontSize.base,
    color: 'white',
    opacity: 0.95,
    textAlign: 'center',
  },
  resultCard: {
    ...theme.shadows.md,
  },
  assessmentText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    lineHeight: theme.fontSize.base * 1.6,
  },
  strengthsCard: {
    backgroundColor: theme.colors.green[50],
    borderColor: theme.colors.green[100],
  },
  improvementCard: {
    backgroundColor: theme.colors.orange[50],
    borderColor: theme.colors.orange[100],
  },
  actionCard: {
    backgroundColor: theme.colors.blue[50],
    borderColor: theme.colors.blue[100],
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  listText: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    lineHeight: theme.fontSize.base * 1.5,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  actionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.blue[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionNumberText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: 'white',
  },
  actionText: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    lineHeight: theme.fontSize.base * 1.5,
  },
  rolesCard: {
    backgroundColor: theme.colors.rose[50],
    borderColor: theme.colors.rose[100],
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  roleChip: {
    backgroundColor: theme.colors.rose[100],
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  roleText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.rose[700],
  },
  startOverButton: {
    borderColor: theme.colors.purple[300],
  },
  startOverButtonText: {
    color: theme.colors.purple[600],
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
  },
});
