import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { User, Calendar, Clock, Star } from '@/utils/icons';
import { theme } from '@/constants/theme';

interface Mentor {
  id: string;
  mentor_name: string;
  specialty?: string;
  image_url?: string;
  meeting_availability?: string[];
  duration?: string;
  price?: number;
  description?: string;
  focus_areas?: string[];
}

interface MentorCardProps {
  mentor: Mentor;
  onPress?: () => void;
}

export default function MentorCard({ mentor, onPress }: MentorCardProps) {
  if (!mentor || !mentor.id) {
    return null;
  }

  const getMeetingAvailabilityText = () => {
    if (!mentor.meeting_availability || mentor.meeting_availability.length === 0) {
      return 'זום';
    }
    return mentor.meeting_availability.join(' + ');
  };

  return (
    <Card style={styles.card}>
      <CardHeader style={styles.header}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {mentor.image_url ? (
            <Image source={{ uri: mentor.image_url }} style={styles.avatar} />
          ) : (
            <LinearGradient
              colors={[theme.colors.rose[100], theme.colors.pink[100]]}
              style={styles.avatarGradient}
            >
              <User size={48} color={theme.colors.rose[400]} />
            </LinearGradient>
          )}
        </View>

        {/* Name and Specialty */}
        <CardTitle style={styles.name}>{mentor.mentor_name}</CardTitle>
        {mentor.specialty && (
          <Text style={styles.specialty}>{mentor.specialty}</Text>
        )}
      </CardHeader>

      <CardContent style={styles.content}>
        {/* Info Section */}
        <View style={styles.infoSection}>
          {/* Availability */}
          <View style={styles.infoRow}>
            <Calendar size={16} color={theme.colors.purple[500]} />
            <Text style={styles.infoText}>
              זמינות: {getMeetingAvailabilityText()}
            </Text>
          </View>

          {/* Duration */}
          {mentor.duration && (
            <View style={styles.infoRow}>
              <Clock size={16} color={theme.colors.purple[500]} />
              <Text style={styles.infoText}>משך פגישה: {mentor.duration}</Text>
            </View>
          )}

          {/* Price */}
          {mentor.price !== undefined && (
            <View style={styles.infoRow}>
              <Star size={16} color={theme.colors.purple[500]} />
              <Text style={styles.infoText}>
                {mentor.price === 0
                  ? 'פגישת היכרות חינם'
                  : `${mentor.price} ₪ לפגישה`}
              </Text>
            </View>
          )}

          {/* Description */}
          {mentor.description && (
            <Text style={styles.description} numberOfLines={3}>
              {mentor.description}
            </Text>
          )}

          {/* Focus Areas */}
          {mentor.focus_areas && mentor.focus_areas.length > 0 && (
            <View style={styles.focusAreasSection}>
              <Text style={styles.focusAreasTitle}>תחומי התמחות:</Text>
              <View style={styles.badgesContainer}>
                {mentor.focus_areas.slice(0, 3).map((area, index) => (
                  <Badge
                    key={index}
                    style={styles.badge}
                    textStyle={styles.badgeText}
                  >
                    {area}
                  </Badge>
                ))}
                {mentor.focus_areas.length > 3 && (
                  <Badge variant="outline" style={styles.badgeMore}>
                    <Text style={styles.badgeMoreText}>
                      +{mentor.focus_areas.length - 3} נוספים
                    </Text>
                  </Badge>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Action Button */}
        <Button
          variant="gradient"
          gradientColors={[theme.colors.purple[500], theme.colors.pink[600]]}
          onPress={onPress}
          style={styles.button}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>לפרטים וקביעת פגישה</Text>
            <Calendar size={16} color={theme.colors.primaryForeground} />
          </View>
        </Button>
      </CardContent>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    ...theme.shadows.xl,
  },
  header: {
    alignItems: 'center',
    paddingBottom: theme.spacing.lg,
  },
  avatarContainer: {
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: theme.borderRadius.full,
  },
  avatarGradient: {
    width: 96,
    height: 96,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  specialty: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.rose[600],
    textAlign: 'center',
  },
  content: {
    gap: theme.spacing.lg,
  },
  infoSection: {
    gap: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    lineHeight: theme.fontSize.sm * 1.6,
    textAlign: 'right',
  },
  focusAreasSection: {
    gap: theme.spacing.sm,
  },
  focusAreasTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[800],
    textAlign: 'right',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  badge: {
    backgroundColor: theme.colors.purple[50],
    borderColor: theme.colors.purple[200],
  },
  badgeText: {
    color: theme.colors.purple[700],
  },
  badgeMore: {
    backgroundColor: theme.colors.gray[50],
    borderColor: theme.colors.gray[200],
  },
  badgeMoreText: {
    color: theme.colors.gray[600],
    fontSize: theme.fontSize.xs,
  },
  button: {
    marginTop: theme.spacing.md,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  buttonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primaryForeground,
  },
});

