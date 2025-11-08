import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { rtlView, rtlText } from '@/utils/rtl';

interface PrepResults {
  general_questions: string[];
  specific_questions: string[];
  key_points: string[];
  preparation_tips: string[];
  strengths_to_highlight: string[];
}

export default function InterviewPrepAIScreen() {
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobDescription: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [prepResults, setPrepResults] = useState<PrepResults | null>(null);
  const [showSimulation, setShowSimulation] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');

  const handleGenerate = async () => {
    if (!formData.companyName.trim() || !formData.jobTitle.trim()) {
      Alert.alert('שגיאה', 'אנא מלאי את שם החברה ואת התפקיד');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate AI generation (in production, this would call the actual API)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockResults: PrepResults = {
        general_questions: [
          'ספרי לי על עצמך ועל הניסיון המקצועי שלך',
          'מדוע את מעוניינת בתפקיד הזה?',
          'מהם החוזקות והחולשות שלך?',
          'איך את מתמודדת עם לחץ ומועדים?',
          'איפה את רואה את עצמך בעוד 5 שנים?',
        ],
        specific_questions: [
          `מהו הניסיון שלך ספציפית ב${formData.jobTitle}?`,
          'תני דוגמה לפרויקט מאתגר שהובלת',
          `איך את רואה את התפקיד ב${formData.companyName}?`,
          'מה היית משנה בתפקידך הקודם?',
          'איך את נשארת מעודכנת בתחום?',
        ],
        key_points: [
          'הדגישי את הניסיון העשיר והמגוון שלך',
          'ציני הישגים קונקרטיים עם מספרים',
          'הראי מוטיבציה ותשוקה ללמידה',
          'התייחסי ליתרונות של ניסיון בגיל 50+',
          'הצגי יציבות ובגרות מקצועית',
        ],
        preparation_tips: [
          'חקרי את החברה לעומק - היסטוריה, מוצרים, תרבות',
          'הכיני 3-5 סיפורים על הישגים בשיטת STAR',
          'תרגלי תשובות בקול רם',
          'הכיני שאלות חכמות לשאול את המראיין',
          'הגיעי 15 דקות מוקדם להירגע',
        ],
        strengths_to_highlight: [
          'ניסיון עשיר ומגוון בתחום',
          'בגרות וטיפול מקצועי במצבים מורכבים',
          'כישורי תקשורת בין-אישית מעולים',
          'רשת קשרים מקצועית רחבה',
          'יכולת מנטורינג והדרכת צוותים',
        ],
      };

      setPrepResults(mockResults);
      Alert.alert(
        'ההכנה מוכנה! 🎉',
        'קיבלת חבילת הכנה מקיפה עם שאלות וטיפים. גללי למטה לצפייה.'
      );
    } catch (error) {
      console.error('Error generating prep:', error);
      Alert.alert('שגיאה', 'אירעה שגיאה ביצירת ההכנה. אנא נסי שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSimulation = () => {
    if (!prepResults) return;
    setShowSimulation(true);
    setCurrentQuestionIndex(0);
    setCurrentAnswer('');
  };

  const handleNextQuestion = () => {
    const allQuestions = [
      ...(prepResults?.general_questions || []),
      ...(prepResults?.specific_questions || []),
    ];
    
    if (currentQuestionIndex < Math.min(allQuestions.length - 1, 4)) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer('');
    } else {
      setShowSimulation(false);
      Alert.alert(
        'סימולציה הושלמה! 🎊',
        'תרגלת היטב! עכשיו את מוכנה לראיון האמיתי.'
      );
    }
  };

  const handleStartOver = () => {
    setPrepResults(null);
    setFormData({ companyName: '', jobTitle: '', jobDescription: '' });
    setShowSimulation(false);
  };

  if (prepResults) {
    const allQuestions = [
      ...(prepResults.general_questions || []),
      ...(prepResults.specific_questions || []),
    ];

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[theme.colors.blue[500], theme.colors.purple[500], theme.colors.pink[500]]}
          style={styles.resultsHero}
        >
          <Ionicons name="checkmark-circle" size={64} color="white" />
          <Text style={styles.resultsHeroTitle}>ההכנה מוכנה!</Text>
          <Text style={styles.resultsHeroSubtitle}>
            חבילת הכנה מקיפה עבור {formData.jobTitle} ב-{formData.companyName}
          </Text>
        </LinearGradient>

        {/* General Questions */}
        <View style={styles.section}>
          <Card style={[styles.resultCard, styles.questionsCard]}>
            <CardHeader>
              <CardTitle>
                <Ionicons name="help-circle" size={24} color={theme.colors.blue[600]} />
                {' '}שאלות כלליות
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prepResults.general_questions.map((question, index) => (
                <View key={index} style={[styles.questionItem, rtlView]}>
                  <View style={styles.questionNumber}>
                    <Text style={styles.questionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.questionText, rtlText]}>{question}</Text>
                </View>
              ))}
            </CardContent>
          </Card>
        </View>

        {/* Specific Questions */}
        <View style={styles.section}>
          <Card style={[styles.resultCard, styles.specificCard]}>
            <CardHeader>
              <CardTitle>
                <Ionicons name="bulb" size={24} color={theme.colors.purple[600]} />
                {' '}שאלות ספציפיות לתפקיד
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prepResults.specific_questions.map((question, index) => (
                <View key={index} style={[styles.questionItem, rtlView]}>
                  <View style={[styles.questionNumber, { backgroundColor: theme.colors.purple[500] }]}>
                    <Text style={styles.questionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.questionText, rtlText]}>{question}</Text>
                </View>
              ))}
            </CardContent>
          </Card>
        </View>

        {/* Key Points */}
        <View style={styles.section}>
          <Card style={[styles.resultCard, styles.keyPointsCard]}>
            <CardHeader>
              <CardTitle>
                <Ionicons name="key" size={24} color={theme.colors.orange[600]} />
                {' '}נקודות מפתח להדגיש
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prepResults.key_points.map((point, index) => (
                <View key={index} style={[styles.listItem, rtlView]}>
                  <Ionicons name="star" size={20} color={theme.colors.orange[500]} />
                  <Text style={[styles.listText, rtlText]}>{point}</Text>
                </View>
              ))}
            </CardContent>
          </Card>
        </View>

        {/* Preparation Tips */}
        <View style={styles.section}>
          <Card style={[styles.resultCard, styles.tipsCard]}>
            <CardHeader>
              <CardTitle>
                <Ionicons name="checkmark-done" size={24} color={theme.colors.green[600]} />
                {' '}טיפים להכנה
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prepResults.preparation_tips.map((tip, index) => (
                <View key={index} style={[styles.listItem, rtlView]}>
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.green[500]} />
                  <Text style={[styles.listText, rtlText]}>{tip}</Text>
                </View>
              ))}
            </CardContent>
          </Card>
        </View>

        {/* Strengths to Highlight */}
        <View style={styles.section}>
          <Card style={[styles.resultCard, styles.strengthsCard]}>
            <CardHeader>
              <CardTitle>
                <Ionicons name="trophy" size={24} color={theme.colors.rose[600]} />
                {' '}היתרונות שלך בגיל 50+
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prepResults.strengths_to_highlight.map((strength, index) => (
                <View key={index} style={[styles.listItem, rtlView]}>
                  <Ionicons name="medal" size={20} color={theme.colors.rose[500]} />
                  <Text style={[styles.listText, rtlText]}>{strength}</Text>
                </View>
              ))}
            </CardContent>
          </Card>
        </View>

        {/* Simulation Button */}
        <View style={styles.section}>
          <Button
            variant="gradient"
            gradientColors={[theme.colors.blue[500], theme.colors.purple[500]]}
            onPress={handleStartSimulation}
            style={styles.simulationButton}
          >
            <Ionicons name="play-circle" size={24} color="white" />
            <Text style={styles.buttonText}>התחל סימולציית ראיון</Text>
          </Button>
        </View>

        {/* Start Over Button */}
        <View style={styles.section}>
          <Button
            variant="outline"
            onPress={handleStartOver}
            style={styles.startOverButton}
          >
            <Ionicons name="refresh" size={20} color={theme.colors.blue[600]} />
            <Text style={styles.startOverButtonText}>הכנה נוספת</Text>
          </Button>
        </View>

        <View style={styles.footer} />

        {/* Simulation Modal */}
        <Modal
          visible={showSimulation}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowSimulation(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowSimulation(false)}>
                <Ionicons name="close" size={28} color={theme.colors.gray[700]} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>סימולציית ראיון</Text>
              <View style={{ width: 28 }} />
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Card style={styles.simulationCard}>
                <CardContent>
                  <View style={styles.progressIndicator}>
                    <Text style={styles.progressText}>
                      שאלה {currentQuestionIndex + 1} מתוך {Math.min(allQuestions.length, 5)}
                    </Text>
                  </View>

                  <View style={styles.questionContainer}>
                    <Ionicons name="person-circle" size={48} color={theme.colors.blue[500]} />
                    <View style={styles.speechBubble}>
                      <Text style={[styles.simulationQuestion, rtlText]}>
                        {allQuestions[currentQuestionIndex]}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.answerLabel, rtlText]}>התשובה שלך:</Text>
                  <Textarea
                    placeholder="הקלידי את התשובה שלך כאן..."
                    value={currentAnswer}
                    onChangeText={setCurrentAnswer}
                    numberOfLines={8}
                    style={[styles.answerInput, rtlText]}
                  />

                  <Button
                    variant="gradient"
                    gradientColors={[theme.colors.blue[500], theme.colors.purple[500]]}
                    onPress={handleNextQuestion}
                    disabled={!currentAnswer.trim()}
                    style={styles.nextButton}
                  >
                    <Text style={styles.buttonText}>
                      {currentQuestionIndex < Math.min(allQuestions.length - 1, 4)
                        ? 'שאלה הבאה'
                        : 'סיים סימולציה'}
                    </Text>
                    <Ionicons name="arrow-back" size={20} color="white" />
                  </Button>
                </CardContent>
              </Card>

              <Card style={[styles.hintCard, { marginTop: theme.spacing.xl }]}>
                <CardHeader>
                  <CardTitle>
                    <Ionicons name="bulb-outline" size={20} color={theme.colors.orange[600]} />
                    {' '}טיפ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Text style={[styles.hintText, rtlText]}>
                    השתמשי בשיטת STAR: מצב (Situation), משימה (Task), פעולה (Action), תוצאה
                    (Result)
                  </Text>
                </CardContent>
              </Card>
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
    );
  }

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
              <Text style={[styles.label, rtlText]}>שם החברה *</Text>
              <Input
                placeholder="למשל: Microsoft"
                value={formData.companyName}
                onChangeText={(text) => setFormData({ ...formData, companyName: text })}
                style={[styles.input, rtlText]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, rtlText]}>תפקיד *</Text>
              <Input
                placeholder="למשל: מנהלת מוצר"
                value={formData.jobTitle}
                onChangeText={(text) => setFormData({ ...formData, jobTitle: text })}
                style={[styles.input, rtlText]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, rtlText]}>תיאור התפקיד (אופציונלי)</Text>
              <Textarea
                placeholder="הדבקי כאן את תיאור התפקיד מהמודעה..."
                value={formData.jobDescription}
                onChangeText={(text) => setFormData({ ...formData, jobDescription: text })}
                numberOfLines={6}
                style={[styles.textarea, rtlText]}
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
          <Text style={styles.buttonText}>
            {isLoading ? 'מכין...' : 'צור חבילת הכנה'}
          </Text>
        </Button>
      </View>

      {/* What You'll Get */}
      <View style={styles.section}>
        <Card style={styles.benefitsCard}>
          <CardHeader>
            <CardTitle>מה תקבלי?</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={[styles.benefit, rtlView]}>
              <Ionicons name="help-circle" size={24} color={theme.colors.blue[500]} />
              <View style={styles.benefitContent}>
                <Text style={[styles.benefitTitle, rtlText]}>שאלות ראיון צפויות</Text>
                <Text style={[styles.benefitDescription, rtlText]}>
                  שאלות כלליות ושאלות ספציפיות לתפקיד שלך
                </Text>
              </View>
            </View>

            <View style={[styles.benefit, rtlView]}>
              <Ionicons name="key" size={24} color={theme.colors.purple[500]} />
              <View style={styles.benefitContent}>
                <Text style={[styles.benefitTitle, rtlText]}>נקודות מפתח לתשובות</Text>
                <Text style={[styles.benefitDescription, rtlText]}>
                  מה חשוב להדגיש בכל תשובה
                </Text>
              </View>
            </View>

            <View style={[styles.benefit, rtlView]}>
              <Ionicons name="bulb" size={24} color={theme.colors.orange[500]} />
              <View style={styles.benefitContent}>
                <Text style={[styles.benefitTitle, rtlText]}>טיפים מעשיים</Text>
                <Text style={[styles.benefitDescription, rtlText]}>
                  איך להציג את היתרונות שלך בגיל 50+
                </Text>
              </View>
            </View>

            <View style={[styles.benefit, rtlView]}>
              <Ionicons name="star" size={24} color={theme.colors.rose[500]} />
              <View style={styles.benefitContent}>
                <Text style={[styles.benefitTitle, rtlText]}>סימולציית ראיון</Text>
                <Text style={[styles.benefitDescription, rtlText]}>
                  תרגול מעשי עם פידבק מיידי
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Tips */}
      <View style={styles.section}>
        <Card style={styles.advantagesCard}>
          <CardHeader>
            <CardTitle>
              <Ionicons name="trophy" size={24} color={theme.colors.orange[600]} />
              {' '}היתרונות שלך בגיל 50+
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text style={[styles.tipText, rtlText]}>✨ ניסיון עשיר ומגוון</Text>
            <Text style={[styles.tipText, rtlText]}>✨ בגרות ויציבות רגשית</Text>
            <Text style={[styles.tipText, rtlText]}>✨ כישורי תקשורת מפותחים</Text>
            <Text style={[styles.tipText, rtlText]}>✨ הבנה עמוקה של צרכי לקוחות</Text>
            <Text style={[styles.tipText, rtlText]}>✨ מנטורינג ופיתוח עובדים</Text>
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
  },
  benefitDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    lineHeight: theme.fontSize.sm * 1.5,
  },
  advantagesCard: {
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
  questionsCard: {
    backgroundColor: theme.colors.blue[50],
    borderColor: theme.colors.blue[100],
  },
  specificCard: {
    backgroundColor: theme.colors.purple[50],
    borderColor: theme.colors.purple[100],
  },
  keyPointsCard: {
    backgroundColor: theme.colors.orange[50],
    borderColor: theme.colors.orange[100],
  },
  tipsCard: {
    backgroundColor: theme.colors.green[50],
    borderColor: theme.colors.green[100],
  },
  strengthsCard: {
    backgroundColor: theme.colors.rose[50],
    borderColor: theme.colors.rose[100],
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  questionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.blue[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionNumberText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: 'white',
  },
  questionText: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    lineHeight: theme.fontSize.base * 1.5,
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
  simulationButton: {
    ...theme.shadows.lg,
  },
  startOverButton: {
    borderColor: theme.colors.blue[300],
  },
  startOverButtonText: {
    color: theme.colors.blue[600],
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  modalTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  simulationCard: {
    backgroundColor: 'white',
    ...theme.shadows.lg,
  },
  progressIndicator: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  progressText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.blue[600],
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: theme.colors.blue[50],
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.blue[200],
  },
  simulationQuestion: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
    lineHeight: theme.fontSize.lg * 1.5,
  },
  answerLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[700],
    marginBottom: theme.spacing.sm,
  },
  answerInput: {
    marginBottom: theme.spacing.xl,
  },
  nextButton: {
    ...theme.shadows.md,
  },
  hintCard: {
    backgroundColor: theme.colors.orange[50],
    borderColor: theme.colors.orange[100],
  },
  hintText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    lineHeight: theme.fontSize.sm * 1.6,
  },
});
