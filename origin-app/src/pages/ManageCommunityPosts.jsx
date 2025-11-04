
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Eye, MessageSquare, Calendar, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { useUser, isUserAdmin } from '../components/auth/UserContext';
import { base44 } from '@/api/base44Client';

export default function ManageCommunityPosts() {
  const { currentUser } = useUser();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (!currentUser || !isUserAdmin(currentUser)) {
      return;
    }
    loadPosts();
  }, [currentUser]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const allPosts = await base44.entities.CommunityPost.list('-created_date');
      setPosts(allPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
    setIsLoading(false);
  };

  const handleStatusChange = async (post, newStatus, notes = '') => {
    try {
      console.log('[ManageCommunityPosts] 🔄 Starting update process');
      console.log('[ManageCommunityPosts] Post ID:', post.id);
      console.log('[ManageCommunityPosts] New status:', newStatus);
      console.log('[ManageCommunityPosts] Admin notes:', notes);
      
      // Build update object
      const updateData = {
        status: newStatus
      };
      
      if (newStatus === 'approved') {
        updateData.approved_by = currentUser.email;
      }
      
      if (notes && notes.trim()) {
        updateData.admin_notes = notes.trim();
      }
      
      console.log('[ManageCommunityPosts] 📝 Update data:', updateData);
      
      // Direct update using entity
      console.log('[ManageCommunityPosts] 🚀 Calling base44.entities.CommunityPost.update...');
      const result = await base44.entities.CommunityPost.update(post.id, updateData);
      
      console.log('[ManageCommunityPosts] ✅ Update successful!', result);
      
      setSelectedPost(null);
      setAdminNotes('');
      await loadPosts();
      
      const statusText = newStatus === 'approved' ? 'אושר' : 'נדחה';
      alert(`הפוסט ${statusText} בהצלחה!`);
    } catch (error) {
      console.error('[ManageCommunityPosts] ❌ Error updating post status:', error);
      console.error('[ManageCommunityPosts] Error name:', error.name);
      console.error('[ManageCommunityPosts] Error message:', error.message);
      console.error('[ManageCommunityPosts] Error stack:', error.stack);
      alert('שגיאה בעדכון סטטוס הפוסט: ' + (error.message || 'נסי שוב'));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'ממתין לאישור', className: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'מאושר', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'נדחה', className: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
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

  const filterPosts = (status) => {
    if (status === 'all') return posts;
    return posts.filter(post => post.status === status);
  };

  const PostCard = ({ post, showActions = true }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
            <div className="flex gap-2 mb-2">
              {getStatusBadge(post.status)}
              <Badge className={getCategoryColor(post.category)}>
                {post.category}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              מאת: {post.author_name} • {format(new Date(post.created_date), 'd בMMMM yyyy', { locale: he })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            {post.likes_count || 0} לייקים
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            {post.comments_count || 0} תגובות
          </span>
        </div>

        {post.admin_notes && (
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="text-sm font-medium text-gray-700">הערות מנהל:</p>
            <p className="text-sm text-gray-600">{post.admin_notes}</p>
          </div>
        )}

        {showActions && (
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post);
                    setAdminNotes(post.admin_notes || '');
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  צפייה מלאה
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{post.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {getStatusBadge(post.status)}
                    <Badge className={getCategoryColor(post.category)}>
                      {post.category}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    מאת: {post.author_name} • {format(new Date(post.created_date), 'd בMMMM yyyy, HH:mm', { locale: he })}
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{post.content}</p>
                  </div>

                  {post.status === 'pending' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">הערות (אופציונלי):</label>
                        <Textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="הערות למחבר הפוסט..."
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => handleStatusChange(post, 'approved', adminNotes)}
                          className="bg-green-600 hover:bg-green-700 flex-1"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          אישור פוסט
                        </Button>
                        <Button
                          onClick={() => handleStatusChange(post, 'rejected', adminNotes)}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          דחיית פוסט
                        </Button>
                      </div>
                    </>
                  )}

                  {post.status !== 'pending' && post.admin_notes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">הערות מנהל:</p>
                      <p className="text-sm text-gray-600">{post.admin_notes}</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {post.status === 'pending' && (
              <>
                <Button
                  onClick={() => handleStatusChange(post, 'approved')}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  אישור
                </Button>
                <Button
                  onClick={() => handleStatusChange(post, 'rejected')}
                  size="sm"
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  דחייה
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (!currentUser || !isUserAdmin(currentUser)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <CardTitle className="text-red-600 mb-4">אין הרשאה</CardTitle>
          <p>רק מנהלי המערכת יכולים לגשת לדף זה.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3"><MessageSquare className="w-8 h-8"/>ניהול פוסטי קהילה</h1>
          <p className="text-gray-600">ניהול ואישור פוסטים שנשלחו על ידי חברות הקהילה</p>
        </div>
        <Button onClick={loadPosts} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          רענן
        </Button>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            ממתינים לאישור ({filterPosts('pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            מאושרים ({filterPosts('approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            נדחו ({filterPosts('rejected').length})
          </TabsTrigger>
          <TabsTrigger value="all">
            כל הפוסטים ({posts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">טוען פוסטים...</div>
            ) : filterPosts('pending').length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">אין פוסטים ממתינים לאישור כרגע</p>
              </Card>
            ) : (
              filterPosts('pending').map(post => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">טוען פוסטים...</div>
            ) : filterPosts('approved').length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">אין פוסטים מאושרים כרגע</p>
              </Card>
            ) : (
              filterPosts('approved').map(post => (
                <PostCard key={post.id} post={post} showActions={false} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">טוען פוסטים...</div>
            ) : filterPosts('rejected').length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">אין פוסטים שנדחו</p>
              </Card>
            ) : (
              filterPosts('rejected').map(post => (
                <PostCard key={post.id} post={post} showActions={false} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">טוען פוסטים...</div>
            ) : posts.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">אין פוסטים במערכת כרגע</p>
              </Card>
            ) : (
              posts.map(post => (
                <PostCard key={post.id} post={post} showActions={post.status === 'pending'} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
