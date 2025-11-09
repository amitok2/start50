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

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('שגיאה', 'יש למלא אימייל וסיסמה');
      return;
    }

    setIsLoading(true);

    try {
      await login(email.trim(), password);
      Alert.alert('התחברות הצליחה! 🎉', 'ברוכה הבאה חזרה', [
        {
          text: 'אישור',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('שגיאה', error.message || 'אירעה שגיאה בהתחברות');
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
          colors={[theme.colors.rose[500], theme.colors.pink[500], theme.colors.purple[500]]}
          style={styles.hero}
        >
          <View style={styles.logoContainer}>
            <Ionicons name="flower" size={80} color="white" />
          </View>
          <Text style={[styles.heroTitle, rtlText]}>ברוכה הבאה</Text>
          <Text style={[styles.heroSubtitle, rtlText]}>
            התחברי לקהילת ReStart 50+
          </Text>
        </LinearGradient>

        {/* Login Form */}
        <View style={styles.formSection}>
          <Card style={styles.card}>
            <CardHeader>
              <CardTitle style={rtlText}>התחברות</CardTitle>
            </CardHeader>
            <CardContent>
              <View style={styles.formGroup}>
                <Text style={[styles.label, rtlText]}>אימייל</Text>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="your@email.com"
                  style={[styles.input, rtlText]}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, rtlText]}>סיסמה</Text>
                <View style={styles.passwordContainer}>
                  <Input
                    value={password}
                    onChangeText={setPassword}
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

              <Button
                variant="gradient"
                gradientColors={[theme.colors.purple[500], theme.colors.pink[600]]}
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                style={styles.loginButton}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'מתחבר...' : 'התחברי'}
                </Text>
              </Button>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>או</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                onPress={() => router.push('/signup')}
                disabled={isLoading}
              >
                <Text style={[styles.signupText, rtlText]}>
                  עדיין לא רשומה?{' '}
                  <Text style={styles.signupLink}>הרשמי עכשיו</Text>
                </Text>
              </TouchableOpacity>
            </CardContent>
          </Card>
        </View>

        {/* Demo Info Card */}
        <View style={styles.formSection}>
          <Card style={styles.demoCard}>
            <CardContent>
              <Text style={[styles.demoTitle, rtlText]}>
                <Ionicons name="information-circle" size={20} color={theme.colors.blue[600]} />
                {' '}משתמשת דמו
              </Text>
              <Text style={[styles.demoText, rtlText]}>
                אימייל: demo@restart50.com
              </Text>
              <Text style={[styles.demoText, rtlText]}>סיסמה: demo123</Text>
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
  },
  formGroup: {
    marginBottom: theme.spacing.xl,
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
  loginButton: {
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
  dividerText: {
    marginHorizontal: theme.spacing.md,
    color: theme.colors.gray[500],
    fontSize: theme.fontSize.sm,
  },
  signupText: {
    textAlign: 'center',
    color: theme.colors.gray[600],
    fontSize: theme.fontSize.base,
  },
  signupLink: {
    color: theme.colors.purple[600],
    fontWeight: theme.fontWeight.semibold,
  },
  demoCard: {
    backgroundColor: theme.colors.blue[50],
    borderColor: theme.colors.blue[200],
    marginTop: theme.spacing.xl,
  },
  demoTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.blue[900],
    marginBottom: theme.spacing.sm,
  },
  demoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.blue[800],
    marginBottom: theme.spacing.xs,
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

