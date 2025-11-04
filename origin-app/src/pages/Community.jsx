
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { User } from '@/api/entities';
import { CommunityPost } from '@/api/entities';
import { SocialProfile } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThumbsUp, MessageSquare, PlusCircle, Loader2, Users as UsersIcon, Search, Filter, Send, Sparkles, Heart } from 'lucide-react';
import { UserContext } from '@/components/auth/UserContext';
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PostCard from '../components/community/PostCard'; // Imported PostCard component

export default function Community() {
  const { currentUser, isLoadingUser } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'שיתוף' });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [stats, setStats] = useState({ members: 0, posts: 0, successes: 0 });
  const { toast } = useToast();

  const fetchCommunityData = useCallback(async () => {
    setIsLoading(true);
    console.log('[Community] 🔄 Starting to fetch community data...');
    
    try {
      // Initialize default stats
      let memberCount = 0;
      let postCount = 0;
      let successCount = 0;

      console.log('[Community] 📊 Attempting to fetch ALL community posts first...');
      const allPosts = await CommunityPost.list('-created_date', 100);
      console.log('[Community] 📊 All posts fetched:', allPosts.length);
      
      if (allPosts && allPosts.length > 0) {
        console.log('[Community] 🔍 Filtering for approved posts from:', allPosts.length, 'total posts');
        const approvedPosts = allPosts.filter(post => post.status === 'approved');
        console.log('[Community] ✅ Approved posts after filtering:', approvedPosts.length);
        
        if (approvedPosts.length > 0) {
          console.log('[Community] 📝 Sample approved post:', approvedPosts[0]);
          setPosts(approvedPosts);
          postCount = approvedPosts.length;
          successCount = approvedPosts.filter(p => p.category === 'הצלחה').length;
          console.log('[Community] 📈 Stats - Posts:', postCount, 'Success stories:', successCount);
        } else {
          console.log('[Community] ⚠️ No approved posts found after filtering');
          setPosts([]);
        }
      } else {
        console.log('[Community] ⚠️ No posts returned from database at all');
        setPosts([]);
      }

      // Try to get member count from social profiles (optional, won't break if fails)
      try {
        console.log('[Community] 👥 Attempting to fetch social profiles for member count...');
        const socialProfiles = await SocialProfile.list('-created_date', 50);
        memberCount = socialProfiles?.length || 0;
        console.log('[Community] 👥 Social profiles fetched:', memberCount);
      } catch (profileError) {
        console.log('[Community] ⚠️ Could not fetch social profiles, using default count:', profileError.message);
        memberCount = 5; // Default fallback
      }

      // Update stats
      setStats({
        members: memberCount,
        posts: postCount,
        successes: successCount
      });

      console.log('[Community] ✅ Community data loaded successfully. Final stats:', {
        members: memberCount,
        posts: postCount,
        successes: successCount
      });

    } catch (error) {
      console.error('[Community] ❌ Error loading community posts:', error);
      console.error('[Community] 🔍 Full error object:', JSON.stringify(error));
      // Keep posts as empty array instead of falling back to demo data
      setPosts([]);
      setStats({ members: 0, posts: 0, successes: 0 });
      
      toast({
        title: "שגיאה בטעינת פוסטי הקהילה",
        description: "לא ניתן לטעון פוסטים כרגע. נסה לרענן את הדף.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCommunityData();
  }, [fetchCommunityData]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast({ title: "שגיאה", description: "עליך להתחבר כדי לכתוב פוסט.", variant: "destructive" });
      return;
    }
    if (!newPost.title || !newPost.content) {
      toast({ title: "שגיאה", description: "יש למלא כותרת ותוכן לפוסט.", variant: "destructive" });
      return;
    }

    try {
      await CommunityPost.create({
        ...newPost,
        author_name: currentUser.full_name,
        status: 'pending'
      });
      toast({
        title: "הפוסט נשלח!",
        description: "הפוסט שלך נשלח לאישור ויפורסם בקרוב.",
        className: "bg-green-100 text-green-800"
      });
      setNewPost({ title: '', content: '', category: 'שיתוף' });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "שגיאה ביצירת הפוסט",
        description: error.message || "נסי שוב מאוחר יותר",
        variant: "destructive"
      });
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const filteredPosts = posts.filter(post => {
    const categoryMatch = filterCategory === 'all' || post.category === filterCategory;
    return categoryMatch;
  });

  if (isLoadingUser) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-16 h-16 animate-spin text-purple-600" /></div>;
  }
  
  if (!currentUser) {
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-indigo-50 p-4 sm:p-8 flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-8 bg-white/80 backdrop-blur-sm shadow-xl border-purple-200">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <UsersIcon className="w-8 h-8 text-white" />
            </div>
            <CardContent className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">הצטרפי לקהילה שלנו</h2>
                <p className="text-gray-600">
                כדי להצטרף לשיח, לשתף ולקבל תמיכה מנשים שמבינות את המסע שלך, עליך להתחבר או להירשם לאתר.
                </p>
                <Button asChild size="lg" className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                <Link to={createPageUrl('Join')}>
                    <Sparkles className="w-4 h-4 ml-2" />
                    אני רוצה להצטרף
                </Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  const filterCategories = { "הכל": 'all', "שאלה": "שאלה", "שיתוף": "שיתוף", "עצה": "עצה", "הצלחה": "הצלחה", "כללי": "כללי" };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center bg-rose-50/70 p-8 rounded-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-pink-500 mb-4">הקהילה שלנו</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">מקום בטוח לשתף, לשאול ולקבל תמיכה מנשים שמבינות את המסע שלך.</p>
        </div>
        
        {/* Stats Cards */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 bg-white/60 border-pink-200 shadow-sm">
                <UsersIcon className="w-8 h-8 text-pink-500 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-800">{stats.members}</p>
                <p className="text-sm text-gray-500">חברות פעילות</p>
            </Card>
            <Card className="text-center p-6 bg-white/60 border-purple-200 shadow-sm">
                <MessageSquare className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-800">{stats.posts}</p>
                <p className="text-sm text-gray-500">פוסטים מאושרים</p>
            </Card>
            <Card className="text-center p-6 bg-white/60 border-orange-200 shadow-sm">
                <Sparkles className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-800">{stats.successes}</p>
                <p className="text-sm text-gray-500">סיפורי הצלחה</p>
            </Card>
        </div>

        {/* Create Post Bar */}
        {currentUser && (
          <div className="mb-8">
            <Card 
                onClick={() => setShowCreateForm(!showCreateForm)} 
                className="p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-white"
            >
                <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">שתפי עם הקהילה...</span>
                    <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full px-5 py-2">
                        <PlusCircle className="ml-2 w-5 h-5" />
                        פוסט חדש
                    </Button>
                </div>
            </Card>

            {showCreateForm && (
                <Card className="mt-6 animate-fade-in">
                    <CardHeader>
                        <CardTitle>יצירת פוסט חדש</CardTitle>
                        <CardDescription>הפוסט יועבר לאישור לפני הפרסום.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreatePost} className="space-y-4">
                            <Input 
                                placeholder="כותרת הפוסט"
                                value={newPost.title}
                                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                            />
                            <Textarea 
                                placeholder="מה תרצי לשתף?"
                                value={newPost.content}
                                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                                rows={5}
                            />
                            <Select onValueChange={(value) => setNewPost({...newPost, category: value})} defaultValue="שיתוף">
                                <SelectTrigger>
                                    <SelectValue placeholder="בחרי קטגוריה" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(filterCategories).filter(([key]) => key !== 'הכל').map(([key, value]) => (
                                      <SelectItem key={value} value={value}>{key}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button type="submit" className="w-full md:w-auto">
                                <Send className="ml-2 w-4 h-4"/>
                                שליחה לאישור
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {Object.entries(filterCategories).map(([key, value]) => (
            <Button
              key={key}
              variant={filterCategory === value ? 'default' : 'outline'}
              onClick={() => setFilterCategory(value)}
              className={`rounded-full px-5 transition-all duration-200 ${filterCategory === value ? 'bg-pink-500 text-white border-pink-500' : 'bg-white/70 text-gray-700 border-gray-300'}`}
            >
              {key}
            </Button>
          ))}
        </div>

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
        ) : (
            filteredPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map(post => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      currentUser={currentUser}
                      onPostUpdate={handlePostUpdate}
                    />
                  ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white/50 rounded-2xl">
                <p className="text-gray-500 text-lg">
                  {filterCategory === 'all' ? 'אין פוסטים מאושרים כרגע. אולי תהיי הראשונה לשתף?' : 'עדיין אין פוסטים בקטגוריה זו. אולי תהיי הראשונה לשתף?'}
                </p>
              </div>
            )
        )}

        {filteredPosts.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">אין פוסטים בקטגוריה זו כרגע</p>
          </div>
        )}
      </div>

      {/* Back to My Profile Button */}
      <div className="flex justify-center mt-12 mb-8">
        <Button asChild variant="outline" size="lg" className="border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700 shadow-md">
          <Link to={createPageUrl('MyProfile')}>
            <Heart className="w-4 h-4 ml-2" />
            חזרה למקום שלי
          </Link>
        </Button>
      </div>
    </div>
  );
}
