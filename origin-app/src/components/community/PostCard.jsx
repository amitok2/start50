import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, MessageSquare, Send, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Like } from '@/api/entities';
import { Comment } from '@/api/entities';

export default function PostCard({ post, currentUser, onPostUpdate }) {
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    const loadLikesAndComments = useCallback(async () => {
        try {
            const [postLikes, postComments] = await Promise.all([
                Like.filter({ post_id: post.id }),
                Comment.filter({ post_id: post.id, is_approved: true }, '-created_date')
            ]);
            setLikes(postLikes || []);
            setComments(postComments || []);
        } catch (error) {
            console.error('Error loading likes and comments:', error);
        }
    }, [post.id]);

    useEffect(() => {
        loadLikesAndComments();
    }, [loadLikesAndComments]);

    const handleLike = async () => {
        if (!currentUser) {
            alert('יש להתחבר כדי לעשות לייק');
            return;
        }

        setIsLiking(true);
        try {
            const existingLike = likes.find(like => like.user_email === currentUser.email);
            
            if (existingLike) {
                // Remove like
                await Like.delete(existingLike.id);
                setLikes(likes.filter(like => like.id !== existingLike.id));
            } else {
                // Add like
                const newLike = await Like.create({
                    post_id: post.id,
                    user_email: currentUser.email,
                    user_name: currentUser.full_name
                });
                setLikes([...likes, newLike]);
            }
        } catch (error) {
            console.error('Error handling like:', error);
            alert('שגיאה בעדכון הלייק. נסי שוב.');
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
            const comment = await Comment.create({
                post_id: post.id,
                content: newComment.trim(),
                author_email: currentUser.email,
                author_name: currentUser.full_name
            });

            setComments([comment, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('שגיאה בהוספת התגובה. נסי שוב.');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'שאלה': 'bg-blue-100 text-blue-800',
            'שיתוף': 'bg-purple-100 text-purple-800',
            'עצה': 'bg-green-100 text-green-800',
            'הצלחה': 'bg-orange-100 text-orange-800',
            'כללי': 'bg-gray-100 text-gray-800'
        };
        return colors[category] || colors['כללי'];
    };

    const isLikedByUser = currentUser && likes.some(like => like.user_email === currentUser.email);
    const likesCount = likes.length;
    const commentsCount = comments.length;

    return (
        <Card className="bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold text-gray-800">{post.title}</CardTitle>
                        <CardDescription className="text-sm text-gray-500 mt-2">
                            מאת: {post.author_name} • {format(new Date(post.created_date), 'd בMMMM, yyyy', { locale: he })}
                        </CardDescription>
                    </div>
                    <Badge className={getCategoryColor(post.category)}>
                        {post.category}
                    </Badge>
                </div>
            </CardHeader>
            
            <CardContent>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{post.content}</p>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
                <div className="flex items-center gap-6 w-full">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLike}
                        disabled={isLiking || !currentUser}
                        className={`flex items-center gap-2 ${isLikedByUser ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'}`}
                    >
                        <Heart className={`w-5 h-5 ${isLikedByUser ? 'fill-current' : ''}`} />
                        <span>{likesCount}</span>
                        {isLiking && <span className="text-xs">...</span>}
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-500"
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span>{commentsCount}</span>
                    </Button>
                </div>

                {showComments && (
                    <div className="w-full space-y-4 pt-4 border-t border-gray-100">
                        {/* Add Comment Form */}
                        {currentUser && (
                            <div className="flex gap-2">
                                <Textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="כתבי תגובה..."
                                    rows={2}
                                    className="flex-1 resize-none"
                                />
                                <Button
                                    onClick={handleAddComment}
                                    disabled={isSubmittingComment || !newComment.trim()}
                                    size="sm"
                                    className="self-end"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

                        {!currentUser && (
                            <p className="text-gray-500 text-sm text-center py-4">
                                יש להתחבר כדי להגיב
                            </p>
                        )}

                        {/* Comments List */}
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {comments.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-4">
                                    עדיין אין תגובות. היי הראשונה!
                                </p>
                            ) : (
                                comments.map(comment => (
                                    <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-medium text-gray-900">{comment.author_name}</span>
                                            <span className="text-xs text-gray-500">
                                                {format(new Date(comment.created_date), 'd/M/yy HH:mm', { locale: he })}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm whitespace-pre-line">{comment.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}