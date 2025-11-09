import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { rtlText } from '@/utils/rtl';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupScreen() {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      Alert.alert('שגיאה', 'יש למלא שם מלא');
      return false;
    }

    if (!formData.email.trim()) {
      Alert.alert('שגיאה', 'יש למלא אימייל');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('שגיאה', 'אימייל לא תקין');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('שגיאה', 'הסיסמה חייבת להכיל לפחות 6 תווים');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('שגיאה', 'הסיסמאות אינן תואמות');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await signup(formData.email.trim(), formData.password, formData.full_name.trim());
      Alert.alert(
        'ההרשמה הצליחה! 🎉',
        'קיבלת 14 ימי ניסיון חינם. ברוכה הבאה לקהילת ReStart 50+',
        [
          {
            text: 'אישור',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('שגיאה', error.message || 'אירעה שגיאה בהרשמה');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <LinearGradient
          colors={[theme.colors.purple[500], theme.colors.pink[500], theme.colors.rose[500]]}
          style={styles.hero}
        >
          <View style={styles.logoContainer}>
            <Ionicons name="flower" size={80} color="white" />
          </View>
          <Text style={[styles.heroTitle, rtlText]}>הצטרפי אלינו</Text>
          <Text style={[styles.heroSubtitle, rtlText]}>
            התחילי את המסע שלך עם ReStart 50+
          </Text>
        </LinearGradient>

        {/* Signup Form */}
        <View style={styles.formSection}>
          <Card style={styles.card}>
            <CardHeader>
              <CardTitle style={rtlText}>הרשמה חדשה</CardTitle>
            </CardHeader>
            <CardContent>
              <View style={styles.formGroup}>
                <Text style={[styles.label, rtlText]}>שם מלא *</Text>
                <Input
                  value={formData.full_name}
                  onChangeText={(text) => handleInputChange('full_name', text)}
                  placeholder="שרה כהן"
                  style={[styles.input, rtlText]}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, rtlText]}>אימייל *</Text>
                <Input
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="your@email.com"
                  style={[styles.input, rtlText]}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, rtlText]}>סיסמה * (לפחות 6 תווים)</Text>
                <View style={styles.passwordContainer}>
                  <Input
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    secureTextEntry={!showPassword}
                    placeholder="••••••••"
                    style={[styles.input, rtlText]}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={24}
                      color={theme.colors.gray[500]}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, rtlText]}>אימות סיסמה *</Text>
                <View style={styles.passwordContainer}>
                  <Input
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                    secureTextEntry={!showConfirmPassword}
                    placeholder="••••••••"
                    style={[styles.input, rtlText]}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={24}
                      color={theme.colors.gray[500]}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Button
                variant="gradient"
                gradientColors={[theme.colors.purple[500], theme.colors.pink[600]]}
                onPress={handleSignup}
                loading={isLoading}
                disabled={isLoading}
                style={styles.signupButton}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'נרשמת...' : 'הרשמי עכשיו'}
                </Text>
              </Button>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                onPress={() => router.back()}
                disabled={isLoading}
              >
                <Text style={[styles.loginText, rtlText]}>
                  כבר רשומה?{' '}
                  <Text style={styles.loginLink}>התחברי</Text>
                </Text>
              </TouchableOpacity>
            </CardContent>
          </Card>
        </View>

        {/* Benefits Card */}
        <View style={styles.formSection}>
          <Card style={styles.benefitsCard}>
            <CardHeader>
              <CardTitle style={rtlText}>
                <Ionicons name="gift" size={20} color={theme.colors.green[600]} />
                {' '}מה מחכה לך?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.green[600]} />
                <Text style={[styles.benefitText, rtlText]}>14 ימי ניסיון חינם</Text>
              </View>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.green[600]} />
                <Text style={[styles.benefitText, rtlText]}>גישה לכל הקורסים והפעילויות</Text>
              </View>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.green[600]} />
                <Text style={[styles.benefitText, rtlText]}>חיבור לקהילה תומכת</Text>
              </View>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.green[600]} />
                <Text style={[styles.benefitText, rtlText]}>ייעוץ עם מנטוריות מנוסות</Text>
              </View>
            </CardContent>
          </Card>
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
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    paddingTop: theme.spacing['6xl'],
    paddingBottom: theme.spacing['5xl'],
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: theme.spacing.lg,
  },
  heroTitle: {
    fontSize: theme.fontSize['4xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    marginBottom: theme.spacing.sm,
  },
  heroSubtitle: {
    fontSize: theme.fontSize.lg,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },
  formSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: -theme.spacing['3xl'],
  },
  card: {
    ...theme.shadows.xl,
    marginBottom: theme.spacing.xl,
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
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    left: theme.spacing.md,
    top: theme.spacing.md,
  },
  signupButton: {
    marginTop: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  buttonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: 'white',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.gray[300],
  },
  loginText: {
    textAlign: 'center',
    color: theme.colors.gray[600],
    fontSize: theme.fontSize.base,
  },
  loginLink: {
    color: theme.colors.purple[600],
    fontWeight: theme.fontWeight.semibold,
  },
  benefitsCard: {
    backgroundColor: theme.colors.green[50],
    borderColor: theme.colors.green[200],
    marginTop: theme.spacing.xl,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  benefitText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    flex: 1,
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

