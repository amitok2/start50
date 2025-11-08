import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';

interface Letter {
  id: string;
  fileName: string;
  fileSize: string;
  uploadDate: Date;
  fileUri: string;
}

// Sample data
const sampleLetters: Letter[] = [
  {
    id: '1',
    fileName: 'מכתב_המלצה_מנהלת_המחלקה.pdf',
    fileSize: '245 KB',
    uploadDate: new Date(2024, 11, 15),
    fileUri: 'file://sample1.pdf',
  },
  {
    id: '2',
    fileName: 'מכתב_המלצה_מנכל_החברה.pdf',
    fileSize: '189 KB',
    uploadDate: new Date(2024, 10, 20),
    fileUri: 'file://sample2.pdf',
  },
];

export default function RecommendationLettersScreen() {
  const [letters, setLetters] = useState<Letter[]>(sampleLetters);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      
      // In a real app, this would use Expo DocumentPicker
      console.log('Opening document picker...');
      
      // Simulate upload
      setTimeout(() => {
        const newLetter: Letter = {
          id: Date.now().toString(),
          fileName: 'מכתב_המלצה_חדש.pdf',
          fileSize: '320 KB',
          uploadDate: new Date(),
          fileUri: 'file://new-letter.pdf',
        };
        
        setLetters([newLetter, ...letters]);
        setIsUploading(false);
        
        // Show success message
        alert('מכתב ההמלצה הועלה בהצלחה! ✅');
      }, 1500);
    } catch (error) {
      console.error('Error uploading letter:', error);
      setIsUploading(false);
      alert('אירעה שגיאה בהעלאת הקובץ');
    }
  };

  const handleViewLetter = (letter: Letter) => {
    console.log('View letter:', letter.fileName);
    // In a real app, would open the PDF viewer
    alert(`פתיחת ${letter.fileName}`);
  };

  const handleDeleteLetter = (letterId: string) => {
    if (confirm('האם את בטוחה שברצונך למחוק מכתב המלצה זה?')) {
      setLetters(letters.filter((l) => l.id !== letterId));
      alert('מכתב ההמלצה נמחק בהצלחה');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.green[500], theme.colors.emerald[500], theme.colors.teal[500]]}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Ionicons name="star" size={64} color="white" />
          <Text style={styles.heroTitle}>⭐ מכתבי ההמלצה שלי</Text>
          <Text style={styles.heroSubtitle}>
            נהלי את מכתבי ההמלצה שלך למשרות עתידיות
          </Text>
        </View>
      </LinearGradient>

      {/* Upload Section */}
      <View style={styles.uploadSection}>
        <Card style={styles.uploadCard}>
          <CardHeader>
            <CardTitle style={styles.uploadTitle}>
              <Ionicons name="cloud-upload" size={24} color={theme.colors.green[600]} />
              {' '}העלאת מכתב המלצה חדש
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.tipBox}>
              <Ionicons name="bulb" size={20} color={theme.colors.green[800]} />
              <Text style={styles.tipText}>
                <Text style={styles.tipBold}>💡 טיפ:</Text> מכתבי המלצה חזקים יכולים להיות המפתח 
                להתקבלות לתפקיד חלומותייך! העלי מכתבי המלצה ממעסיקים קודמים, מנהלים או עמיתים 
                שיכולים להמליץ על העבודה המקצועית שלך.
              </Text>
            </View>

            <Button
              variant="gradient"
              gradientColors={[theme.colors.green[500], theme.colors.emerald[600]]}
              onPress={handleUpload}
              disabled={isUploading}
              style={styles.uploadButton}
            >
              {isUploading ? (
                <>
                  <Ionicons name="hourglass" size={20} color="white" />
                  <Text style={styles.uploadButtonText}>מעלה...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={20} color="white" />
                  <Text style={styles.uploadButtonText}>בחרי קובץ להעלאה</Text>
                </>
              )}
            </Button>

            <Text style={styles.supportedFormats}>
              פורמטים נתמכים: PDF, DOC, DOCX (עד 5MB)
            </Text>
          </CardContent>
        </Card>
      </View>

      {/* Letters List */}
      <View style={styles.lettersSection}>
        <Text style={styles.sectionTitle}>
          המכתבים שלי ({letters.length})
        </Text>

        {letters.length > 0 ? (
          letters.map((letter) => (
            <Card key={letter.id} style={styles.letterCard}>
              <CardContent>
                <View style={styles.letterRow}>
                  <View style={styles.fileIcon}>
                    <Ionicons name="document-text" size={32} color={theme.colors.green[500]} />
                  </View>

                  <View style={styles.letterInfo}>
                    <Text style={styles.fileName}>{letter.fileName}</Text>
                    <View style={styles.letterMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="calendar" size={14} color={theme.colors.gray[500]} />
                        <Text style={styles.metaText}>{formatDate(letter.uploadDate)}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="document" size={14} color={theme.colors.gray[500]} />
                        <Text style={styles.metaText}>{letter.fileSize}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.letterActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleViewLetter(letter)}
                    >
                      <Ionicons name="eye" size={20} color={theme.colors.blue[600]} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteLetter(letter.id)}
                    >
                      <Ionicons name="trash" size={20} color={theme.colors.red[500]} />
                    </TouchableOpacity>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <CardContent>
              <Ionicons name="document-text-outline" size={64} color={theme.colors.gray[300]} />
              <Text style={styles.emptyTitle}>עדיין אין מכתבי המלצה</Text>
              <Text style={styles.emptyText}>
                העלי את מכתב ההמלצה הראשון שלך כדי להתחיל
              </Text>
            </CardContent>
          </Card>
        )}
      </View>

      {/* Info Card */}
      <View style={styles.infoSection}>
        <Card style={styles.infoCard}>
          <CardHeader>
            <CardTitle style={styles.infoTitle}>
              <Ionicons name="information-circle" size={20} color={theme.colors.blue[600]} />
              {' '}למה חשוב לשמור מכתבי המלצה?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text style={styles.infoText}>
              ✅ זמינות מיידית בעת הגשת קורות חיים{'\n'}
              ✅ גיבוי מאובטח לכל המסמכים שלך{'\n'}
              ✅ הצגה מקצועית למעסיקים פוטנציאליים{'\n'}
              ✅ חיסכון בזמן בתהליכי גיוס
            </Text>
          </CardContent>
        </Card>
      </View>

      {/* Back Button */}
      <View style={styles.backButtonContainer}>
        <Button
          variant="outline"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-forward" size={20} color={theme.colors.green[600]} />
          <Text style={styles.backButtonText}>חזרה לפרופיל</Text>
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
  },
  uploadSection: {
    padding: theme.spacing.lg,
  },
  uploadCard: {
    borderWidth: 2,
    borderColor: theme.colors.green[100],
    ...theme.shadows.xl,
  },
  uploadTitle: {
    fontSize: theme.fontSize.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipBox: {
    backgroundColor: theme.colors.green[50],
    borderColor: theme.colors.green[200],
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.green[800],
    lineHeight: theme.fontSize.sm * 1.6,
    textAlign: 'right',
  },
  tipBold: {
    fontWeight: theme.fontWeight.bold,
  },
  uploadButton: {
    marginBottom: theme.spacing.md,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
  },
  supportedFormats: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[500],
    textAlign: 'center',
  },
  lettersSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.lg,
    textAlign: 'right',
  },
  letterCard: {
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  letterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  fileIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.green[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.xs,
    textAlign: 'right',
  },
  letterMeta: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  metaText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[600],
  },
  letterActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    padding: theme.spacing.sm,
  },
  emptyCard: {
    backgroundColor: theme.colors.gray[50],
    alignItems: 'center',
    padding: theme.spacing['2xl'],
  },
  emptyTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[700],
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    textAlign: 'center',
  },
  infoSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  infoCard: {
    backgroundColor: theme.colors.blue[50],
    borderColor: theme.colors.blue[100],
  },
  infoTitle: {
    fontSize: theme.fontSize.lg,
    flexDirection: 'row',
    alignItems: 'center',
    color: theme.colors.blue[800],
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.blue[800],
    lineHeight: theme.fontSize.sm * 2,
    textAlign: 'right',
  },
  backButtonContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    borderColor: theme.colors.green[300],
  },
  backButtonText: {
    color: theme.colors.green[700],
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
  },
  footer: {
    height: theme.spacing['2xl'],
  },
});

