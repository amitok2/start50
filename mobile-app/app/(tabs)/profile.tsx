import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Avatar } from '@/components/ui/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

export default function ProfileScreen() {
  // In a real app, this would come from auth context
  const user = {
    full_name: 'שרה כהן',
    email: 'sarah@example.com',
    image_url: null,
    member_since: '2024',
  };

  const menuItems = [
    {
      icon: 'briefcase-outline',
      title: 'הקריירה שלי',
      subtitle: 'כלים להצלחה מקצועית',
      onPress: () => router.push('/career-referrals' as any),
      route: '/career-referrals',
    },
    {
      icon: 'calendar-outline',
      title: 'הפגישות שלי',
      subtitle: 'צפי בפגישות מתוזמנות',
      onPress: () => router.push('/my-bookings' as any),
      route: '/my-bookings',
    },
    {
      icon: 'ribbon-outline',
      title: 'התגים שלי',
      subtitle: 'הישגים והצלחות',
      onPress: () => router.push('/my-badges' as any),
      route: '/my-badges',
    },
    {
      icon: 'target-outline',
      title: 'המטרות שלי',
      subtitle: 'עקבי אחר ההתקדמות שלך',
      onPress: () => router.push('/personal-goals' as any),
      route: '/personal-goals',
    },
    {
      icon: 'book-outline',
      title: 'הקורסים שלי',
      subtitle: 'הקורסים שנרשמת אליהם',
      onPress: () => router.push('/my-courses' as any),
      route: '/my-courses',
    },
    {
      icon: 'person-outline',
      title: 'עריכת פרופיל',
      subtitle: 'עדכון פרטים אישיים',
      onPress: () => console.log('Edit profile - coming soon'),
      route: null,
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header with Gradient */}
      <LinearGradient
        colors={[theme.colors.rose[500], theme.colors.pink[500]]}
        style={styles.headerGradient}
      >
        <View style={styles.profileHeader}>
          <Avatar
            source={user.image_url ? { uri: user.image_url } : undefined}
            size={100}
            fallback={user.full_name.charAt(0)}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user.full_name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.memberBadge}>
            <Text style={styles.memberText}>חברה מאז {user.member_since}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Card */}
      <Card style={styles.statsCard}>
        <CardContent style={styles.statsContent}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>קורסים</Text>
          </View>
          <Separator orientation="vertical" style={styles.statSeparator} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>פגישות</Text>
          </View>
          <Separator orientation="vertical" style={styles.statSeparator} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>תגים</Text>
          </View>
        </CardContent>
      </Card>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.title}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={theme.colors.purple[500]}
                  />
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons
                name="chevron-back"
                size={20}
                color={theme.colors.gray[400]}
              />
            </TouchableOpacity>
            {index < menuItems.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </View>

      {/* Logout Button */}
      <Button
        variant="outline"
        style={styles.logoutButton}
        onPress={() => console.log('Logout')}
      >
        <Ionicons name="log-out-outline" size={20} color={theme.colors.destructive} />
        <Text style={styles.logoutText}>התנתקי</Text>
      </Button>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerGradient: {
    paddingTop: theme.spacing['4xl'],
    paddingBottom: theme.spacing['5xl'],
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  avatar: {
    borderWidth: 4,
    borderColor: 'white',
    ...theme.shadows.xl,
  },
  name: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  email: {
    fontSize: theme.fontSize.base,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  memberBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginTop: theme.spacing.lg,
  },
  memberText: {
    fontSize: theme.fontSize.sm,
    color: 'white',
    fontWeight: theme.fontWeight.medium,
  },
  statsCard: {
    marginHorizontal: theme.spacing.lg,
    marginTop: -theme.spacing['3xl'],
    ...theme.shadows.xl,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.rose[500],
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
  },
  statSeparator: {
    height: 40,
  },
  menuContainer: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing['2xl'],
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.purple[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
    textAlign: 'right',
    marginBottom: theme.spacing.xs,
  },
  menuItemSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    textAlign: 'right',
  },
  logoutButton: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing['2xl'],
    borderColor: theme.colors.destructive,
  },
  logoutText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.destructive,
    fontWeight: theme.fontWeight.medium,
  },
  footer: {
    height: theme.spacing['4xl'],
  },
});

