import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import { HeartOutline, Heart, MessageSquare, Send } from '@/utils/icons';
import { theme } from '@/constants/theme';

interface Post {
  id: string;
  title: string;
  content: string;
  author_name: string;
  category: string;
  created_date: string;
}

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_date: string;
}

interface PostCardProps {
  post: Post;
  currentUser?: { email: string; full_name: string } | null;
}

export default function PostCard({ post, currentUser }: PostCardProps) {
  const [likes, setLikes] = useState<any[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleLike = async () => {
    if (!currentUser) {
      alert('יש להתחבר כדי לעשות לייק');
      return;
    }

    setIsLiking(true);
    try {
      const existingLike = likes.find((like) => like.user_email === currentUser.email);

      if (existingLike) {
        // Remove like
        setLikes(likes.filter((like) => like.id !== existingLike.id));
      } else {
        // Add like
        const newLike = {
          id: Date.now().toString(),
          user_email: currentUser.email,
          user_name: currentUser.full_name,
        };
        setLikes([...likes, newLike]);
      }
    } catch (error) {
      console.error('Error handling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!currentUser) {
      alert('יש להתחבר כדי להגיב');
      return;
    }

    if (!newComment.trim()) {
      alert('יש לכתוב תגובה');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const comment: Comment = {
        id: Date.now().toString(),
        author_name: currentUser.full_name,
        content: newComment.trim(),
        created_date: new Date().toISOString(),
      };

      setComments([comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, any> = {
      שאלה: { bg: theme.colors.rose[100], text: theme.colors.rose[800] },
      שיתוף: { bg: theme.colors.purple[100], text: theme.colors.purple[800] },
      עצה: { bg: theme.colors.pink[100], text: theme.colors.pink[800] },
      הצלחה: { bg: theme.colors.orange[100], text: theme.colors.orange[800] },
      כללי: { bg: theme.colors.gray[100], text: theme.colors.gray[800] },
    };
    return colors[category] || colors['כללי'];
  };

  const isLikedByUser = currentUser && likes.some((like) => like.user_email === currentUser.email);
  const likesCount = likes.length;
  const commentsCount = comments.length;

  const categoryColors = getCategoryColor(post.category);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Card style={styles.card}>
      <CardHeader>
        <View style={styles.headerRow}>
          <View style={styles.headerContent}>
            <CardTitle style={styles.title}>{post.title}</CardTitle>
            <CardDescription style={styles.description}>
              מאת: {post.author_name} • {formatDate(post.created_date)}
            </CardDescription>
          </View>
          <Badge
            style={[styles.categoryBadge, { backgroundColor: categoryColors.bg }]}
            textStyle={{ color: categoryColors.text }}
          >
            {post.category}
          </Badge>
        </View>
      </CardHeader>

      <CardContent>
        <Text style={styles.content}>{post.content}</Text>
      </CardContent>

      <CardFooter style={styles.footer}>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLike}
            disabled={isLiking || !currentUser}
          >
            {isLikedByUser ? (
              <Heart size={20} color={theme.colors.rose[500]} />
            ) : (
              <HeartOutline size={20} color={theme.colors.gray[500]} />
            )}
            <Text
              style={[
                styles.actionText,
                isLikedByUser && { color: theme.colors.rose[500] },
              ]}
            >
              {likesCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowComments(!showComments)}
          >
            <MessageSquare size={20} color={theme.colors.gray[500]} />
            <Text style={styles.actionText}>{commentsCount}</Text>
          </TouchableOpacity>
        </View>

        {showComments && (
          <View style={styles.commentsSection}>
            {/* Add Comment Form */}
            {currentUser && (
              <View style={styles.commentForm}>
                <Textarea
                  value={newComment}
                  onChangeText={setNewComment}
                  placeholder="כתבי תגובה..."
                  style={styles.commentInput}
                  numberOfLines={2}
                />
                <Button
                  onPress={handleAddComment}
                  disabled={isSubmittingComment || !newComment.trim()}
                  size="sm"
                  style={styles.sendButton}
                >
                  <Send size={16} color={theme.colors.primaryForeground} />
                </Button>
              </View>
            )}

            {!currentUser && (
              <Text style={styles.loginPrompt}>יש להתחבר כדי להגיב</Text>
            )}

            {/* Comments List */}
            <ScrollView style={styles.commentsList} nestedScrollEnabled>
              {comments.length === 0 ? (
                <Text style={styles.noComments}>
                  עדיין אין תגובות. היי הראשונה!
                </Text>
              ) : (
                comments.map((comment) => (
                  <View key={comment.id} style={styles.comment}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{comment.author_name}</Text>
                      <Text style={styles.commentDate}>
                        {formatDate(comment.created_date)}
                      </Text>
                    </View>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        )}
      </CardFooter>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    ...theme.shadows.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[800],
    textAlign: 'right',
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[500],
    textAlign: 'right',
  },
  categoryBadge: {
    borderWidth: 0,
  },
  content: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    lineHeight: theme.fontSize.base * 1.6,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'column',
    gap: theme.spacing.lg,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: theme.spacing['2xl'],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  actionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[500],
  },
  commentsSection: {
    width: '100%',
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[100],
  },
  commentForm: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'flex-end',
  },
  commentInput: {
    flex: 1,
    minHeight: 60,
  },
  sendButton: {
    width: 40,
    height: 40,
  },
  loginPrompt: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[500],
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
  },
  commentsList: {
    maxHeight: 300,
  },
  noComments: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[500],
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
  },
  comment: {
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  commentAuthor: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray[900],
  },
  commentDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[500],
  },
  commentContent: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    lineHeight: theme.fontSize.sm * 1.5,
    textAlign: 'right',
  },
});

