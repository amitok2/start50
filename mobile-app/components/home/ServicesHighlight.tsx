import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { theme } from '@/constants/theme';
import { HeartHandshake, BookOpen, Crown, Library, ArrowLeft } from '@/utils/icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32; // Full width minus padding

interface Service {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  description: string;
  image: string;
}

const services: Service[] = [
  {
    title: 'הכירי את נפש התאומה שלך',
    url: 'SocialTinder',
    icon: HeartHandshake,
    description: 'מצאי נשים בדיוק כמוך. שמבינות, תומכות וחולקות איתך את המסע. ליצירת קשרים עמוקים ומרגשים לכל החיים.',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/dce67f69b_.jpg',
  },
  {
    title: 'ניהול הקריירה שלך',
    url: 'MyProfile?tab=career',
    icon: BookOpen,
    description: 'כלים, רעיונות וליווי שיאפשרו לך לבחור מחדש, להתחזק ולהתפתח מקצועית בגיל 50+.',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/611e4dfde_1.jpg',
  },
  {
    title: 'מאמנות ויועצות',
    url: 'CoachesAndConsultants',
    icon: Crown,
    description: 'ליווי אישי וכלים מעשיים מנשים שכבר היו שם, כדי להזניק קדימה את הקריירה, העסק או הביטחון העצמי שלך.',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/fd020a2f1_.jpg',
  },
  {
    title: 'יזמות בגיל 50+',
    url: 'EntrepreneurshipHub',
    icon: Library,
    description: 'כל הכלים וההשראה לפתיחת עסק משלך. חלמת על עסק משלך בגיל 50+? כאן תמצאי את כל הכלים, המדריכים וההשראה להתחיל.',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/bc3d288cb_.jpg',
  },
];

export default function ServicesHighlight() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          מה מחכה לך <Text style={styles.gradientText}>כאן?</Text>
        </Text>
        <Text style={styles.subtitle}>
          כל מה שאת צריכה כדי להתחיל מחדש, במקום אחד.
        </Text>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
      >
        {services.map((service, index) => (
          <Animated.View
            key={service.title}
            entering={FadeInUp.delay(index * 100).duration(500)}
          >
            <ServiceCard service={service} />
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => {
        // Navigation will be handled later
        console.log('Navigate to:', service.url);
      }}
    >
      <LinearGradient
        colors={[
          theme.colors.rose[50],
          theme.colors.pink[50],
          theme.colors.orange[50],
        ]}
        style={styles.cardGradient}
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: service.image }} style={styles.image} />
          <LinearGradient
            colors={['transparent', 'rgba(244, 63, 94, 0.2)']}
            style={styles.imageOverlay}
          />
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{service.title}</Text>
          <Text style={styles.cardDescription}>{service.description}</Text>

          <View style={styles.cardFooter}>
            <Text style={styles.linkText}>לפרטים נוספים</Text>
            <ArrowLeft size={16} color={theme.colors.rose[500]} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing['4xl'],
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing['3xl'],
    alignItems: 'center',
  },
  title: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  gradientText: {
    color: theme.colors.rose[500],
  },
  subtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.gray[600],
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: 16,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: theme.borderRadius['2xl'],
    overflow: 'hidden',
    ...theme.shadows.xl,
  },
  cardGradient: {
    flex: 1,
    borderRadius: theme.borderRadius['2xl'],
    borderWidth: 1,
    borderColor: theme.colors.rose[100],
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  cardContent: {
    padding: theme.spacing['2xl'],
  },
  cardTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.md,
    textAlign: 'right',
  },
  cardDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    lineHeight: theme.fontSize.sm * 1.6,
    marginBottom: theme.spacing.lg,
    textAlign: 'right',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
  },
  linkText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.rose[500],
  },
});

