import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { rtlView, rtlText } from '@/utils/rtl';

// Sample categories
const categories = [
  { label: 'הכל', value: 'all' },
  { label: 'שאלה', value: 'שאלה' },
  { label: 'שיתוף', value: 'שיתוף' },
  { label: 'עצה', value: 'עצה' },
  { label: 'הצלחה', value: 'הצלחה' },
  { label: 'כללי', value: 'כללי' },
];

// Sample posts data
const samplePosts = [
  {
    id: '1',
    title: 'התחלתי עסק משלי בגיל 52! 🎉',
    content: 'אחרי שנים של עבודה משרדית, החלטתי לקפוץ למים ולפתוח עסק משלי. זה מפחיד אבל כל כך משחרר!',
    author_name: 'שרה כהן',
    category: 'הצלחה',
    created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likes_count: 15,
    comments_count: 8,
  },
  {
    id: '2',
    title: 'איך מתמודדים עם פחד מהשינוי?',
    content: 'מזמינה אתכן לשתף - אני במפנה קריירה ויש לי הרבה פחדים. איך התמודדתן עם זה?',
    author_name: 'רחל לוי',
    category: 'שאלה',
    created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    likes_count: 23,
    comments_count: 12,
  },
  {
    id: '3',
    title: 'טיפים לראיון עבודה אחרי גיל 50',
    content: 'רציתי לשתף כמה טיפים שעזרו לי לעבור בהצלחה ראיונות עבודה: 1) תדגישי את הניסיון שלך 2) הראי גמישות...',
    author_name: 'דינה אברהם',
    category: 'עצה',
    created_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    likes_count: 31,
    comments_count: 5,
  },
];

export default function CommunityScreen() {
  const [posts, setPosts] = useState(samplePosts);
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'שיתוף',
  });
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      Alert.alert('שגיאה', 'יש למלא כותרת ותוכן לפוסט');
      return;
    }

    const post = {
      id: Date.now().toString(),
      ...newPost,
      author_name: 'את',
      created_date: new Date().toISOString(),
      likes_count: 0,
      comments_count: 0,
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', category: 'שיתוף' });
    setShowCreateModal(false);
    Alert.alert('הצלחה!', 'הפוסט שלך נשלח לאישור ויפורסם בקרוב');
  };

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes_count: post.likes_count + 1 } : post
      )
    );
  };

  const filteredPosts = posts.filter(
    (post) => filterCategory === 'all' || post.category === filterCategory
  );

  const getCategoryColor = (category: string) => {
    const colors: Record<string, any> = {
      שאלה: { bg: theme.colors.blue[100], text: theme.colors.blue[700] },
      שיתוף: { bg: theme.colors.purple[100], text: theme.colors.purple[700] },
      עצה: { bg: theme.colors.green[100], text: theme.colors.green[700] },
      הצלחה: { bg: theme.colors.rose[100], text: theme.colors.rose[700] },
      כללי: { bg: theme.colors.gray[100], text: theme.colors.gray[700] },
    };
    return colors[category] || colors.כללי;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'היום';
    if (diffInDays === 1) return 'אתמול';
    if (diffInDays < 7) return `לפני ${diffInDays} ימים`;
    return date.toLocaleDateString('he-IL');
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Hero */}
        <LinearGradient
          colors={[theme.colors.rose[400], theme.colors.pink[400], theme.colors.orange[400]]}
          style={styles.hero}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>🌸 הקהילה שלנו</Text>
            <Text style={styles.heroSubtitle}>
              מקום בטוח לשתף, לשאול ולקבל תמיכה מנשים שמבינות את המסע שלך
            </Text>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={32} color={theme.colors.pink[500]} />
            <Text style={styles.statNumber}>150+</Text>
            <Text style={styles.statLabel}>חברות פעילות</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="chatbubbles" size={32} color={theme.colors.purple[500]} />
            <Text style={styles.statNumber}>{posts.length}</Text>
            <Text style={styles.statLabel}>פוסטים</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star" size={32} color={theme.colors.rose[500]} />
            <Text style={styles.statNumber}>
              {posts.filter((p) => p.category === 'הצלחה').length}
            </Text>
            <Text style={styles.statLabel}>סיפורי הצלחה</Text>
          </View>
        </View>

        {/* Create Post Button */}
        <View style={styles.createButtonContainer}>
          <Button
            variant="gradient"
            gradientColors={[theme.colors.rose[500], theme.colors.pink[600]]}
            onPress={() => setShowCreateModal(true)}
            style={styles.createButton}
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text style={styles.createButtonText}>שיתוף חדש</Text>
          </Button>
        </View>

        {/* Category Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.filterChip,
                  filterCategory === cat.value && styles.filterChipActive,
                ]}
                onPress={() => setFilterCategory(cat.value)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    filterCategory === cat.value && styles.filterChipTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Posts List */}
        <View style={styles.postsContainer}>
          {filteredPosts.length === 0 ? (
            <Card style={styles.emptyCard}>
              <CardContent>
                <Ionicons
                  name="chatbubbles-outline"
                  size={64}
                  color={theme.colors.gray[300]}
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyText}>עדיין אין פוסטים בקטגוריה זו</Text>
                <Text style={styles.emptySubtext}>היי הראשונה לשתף!</Text>
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map((post) => {
              const categoryColors = getCategoryColor(post.category);
              return (
                <Card key={post.id} style={styles.postCard}>
                  <CardHeader>
                    <View style={[styles.postHeader, rtlView]}>
                      <View style={styles.authorInfo}>
                        <View style={styles.authorAvatar}>
                          <Ionicons
                            name="person"
                            size={24}
                            color={theme.colors.rose[400]}
                          />
                        </View>
                        <View>
                          <Text style={[styles.authorName, rtlText]}>
                            {post.author_name}
                          </Text>
                          <Text style={[styles.postDate, rtlText]}>
                            {formatDate(post.created_date)}
                          </Text>
                        </View>
                      </View>
                      <Badge
                        style={{ backgroundColor: categoryColors.bg }}
                        textStyle={{ color: categoryColors.text }}
                      >
                        {post.category}
                      </Badge>
                    </View>
                  </CardHeader>
                  <CardContent>
                    <Text style={[styles.postTitle, rtlText]}>{post.title}</Text>
                    <Text style={[styles.postContent, rtlText]} numberOfLines={3}>
                      {post.content}
                    </Text>

                    {/* Actions */}
                    <View style={[styles.postActions, rtlView]}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleLike(post.id)}
                      >
                        <Ionicons
                          name="heart-outline"
                          size={20}
                          color={theme.colors.rose[500]}
                        />
                        <Text style={styles.actionText}>{post.likes_count}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Ionicons
                          name="chatbubble-outline"
                          size={20}
                          color={theme.colors.gray[600]}
                        />
                        <Text style={styles.actionText}>{post.comments_count}</Text>
                      </TouchableOpacity>
                    </View>
                  </CardContent>
                </Card>
              );
            })
          )}
        </View>

        <View style={styles.footer} />
      </ScrollView>

      {/* Create Post Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Ionicons name="close" size={28} color={theme.colors.gray[700]} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>שיתוף חדש</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={[styles.inputLabel, rtlText]}>כותרת</Text>
            <TextInput
              style={[styles.input, rtlText]}
              placeholder="כתבי כותרת קצרה ומעניינת..."
              value={newPost.title}
              onChangeText={(text) => setNewPost({ ...newPost, title: text })}
              textAlign="right"
            />

            <Text style={[styles.inputLabel, rtlText]}>תוכן</Text>
            <TextInput
              style={[styles.textArea, rtlText]}
              placeholder="שתפי את המחשבות, השאלות או הסיפור שלך..."
              value={newPost.content}
              onChangeText={(text) => setNewPost({ ...newPost, content: text })}
              multiline
              numberOfLines={8}
              textAlign="right"
              textAlignVertical="top"
            />

            <Text style={[styles.inputLabel, rtlText]}>קטגוריה</Text>
            <View style={styles.categorySelector}>
              {categories
                .filter((cat) => cat.value !== 'all')
                .map((cat) => (
                  <TouchableOpacity
                    key={cat.value}
                    style={[
                      styles.categoryOption,
                      newPost.category === cat.value && styles.categoryOptionActive,
                    ]}
                    onPress={() => setNewPost({ ...newPost, category: cat.value })}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        newPost.category === cat.value &&
                          styles.categoryOptionTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>

            <Button
              variant="gradient"
              gradientColors={[theme.colors.rose[500], theme.colors.pink[600]]}
              onPress={handleCreatePost}
              style={styles.submitButton}
            >
              <Ionicons name="send" size={20} color="white" />
              <Text style={styles.submitButtonText}>פרסמי</Text>
            </Button>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  hero: {
    paddingVertical: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing.lg,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: theme.fontSize.base,
    color: 'white',
    opacity: 0.95,
    textAlign: 'center',
    lineHeight: theme.fontSize.base * 1.5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    marginTop: -theme.spacing['3xl'],
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  statNumber: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[600],
    marginTop: theme.spacing.xs,
  },
  createButtonContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  createButton: {
    ...theme.shadows.lg,
  },
  createButtonText: {
    color: 'white',
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
  filtersContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray[100],
    marginRight: theme.spacing.sm,
  },
  filterChipActive: {
    backgroundColor: theme.colors.rose[500],
  },
  filterChipText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray[700],
  },
  filterChipTextActive: {
    color: 'white',
  },
  postsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  postCard: {
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  postHeader: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.rose[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorName: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
  },
  postDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[600],
    marginTop: 2,
  },
  postTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.sm,
  },
  postContent: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    lineHeight: theme.fontSize.sm * 1.6,
    marginBottom: theme.spacing.lg,
  },
  postActions: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  actionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
  },
  emptyCard: {
    paddingVertical: theme.spacing['4xl'],
  },
  emptyIcon: {
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[700],
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    textAlign: 'center',
  },
  footer: {
    height: theme.spacing['2xl'],
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
  inputLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  input: {
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.base,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  textArea: {
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.base,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    minHeight: 150,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  categoryOption: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray[100],
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryOptionActive: {
    backgroundColor: theme.colors.rose[50],
    borderColor: theme.colors.rose[500],
  },
  categoryOptionText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray[700],
  },
  categoryOptionTextActive: {
    color: theme.colors.rose[700],
    fontWeight: theme.fontWeight.bold,
  },
  submitButton: {
    marginTop: theme.spacing['3xl'],
    marginBottom: theme.spacing['2xl'],
  },
  submitButtonText: {
    color: 'white',
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
});

