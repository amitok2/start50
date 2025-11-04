
import React, { useState, useEffect } from "react";
import { MentorArticle } from "@/api/entities";
import { User } from "@/api/entities";
import { useUser, isUserAdmin } from '../components/auth/UserContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Eye, Trash2, Loader2, BookOpen, AlertCircle, LogIn, LogOut, Edit } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { adminManageArticle } from '@/api/functions';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Helper component for Access Denied
function AccessDenied() {
  const { currentUser } = useUser();

  const handleLogoutAndRedirect = async () => {
    try {
      await User.logout();
      window.location.reload();
    } catch (error) {
      console.error("Logout failed", error);
      alert("Logout failed. Please try again.");
    }
  };

  const handleLogin = () => {
    User.loginWithRedirect(window.location.href);
  };
  
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 flex justify-center items-center">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">אין הרשאת גישה</h1>
        <p className="text-gray-600 mb-6">
          הדף הזה זמין רק למנהלות או מנטוריות מאושרות.
          <br/>
          {currentUser ? `החשבון (${currentUser.email}) אינו מוגדר כמנהל או מנטורית.` : "נראה שאת לא מחוברת."}
        </p>
        {currentUser ? (
           <Button onClick={handleLogoutAndRedirect} variant="destructive">
             <LogOut className="w-4 h-4 ml-2" />
             התנתקי ונסה להתחבר עם חשבון מנהלת/מנטורית
           </Button>
        ) : (
           <Button onClick={handleLogin}>
             <LogIn className="w-4 h-4 ml-2" />
             התחברות כמנהלת/מנטורית
           </Button>
        )}
      </div>
    </div>
  );
}

export default function ManageArticles() {
  const { currentUser, isLoadingUser } = useUser();
  const [articles, setArticles] = useState([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  const isAdmin = isUserAdmin(currentUser);
  const isMentor = currentUser?.is_approved_mentor;

  useEffect(() => {
    if (!isLoadingUser && currentUser && (isAdmin || isMentor)) {
      loadArticles();
    } else if (!isLoadingUser) {
        setIsLoadingArticles(false);
    }
  }, [currentUser, isLoadingUser, isAdmin, isMentor]);

  const loadArticles = async () => {
    setIsLoadingArticles(true);
    try {
      let articlesData;
      
      if (isAdmin) {
        // Admin sees all articles
        articlesData = await MentorArticle.list("-created_date");
      } else if (isMentor) {
        // Mentor sees only their own articles
        articlesData = await MentorArticle.filter({ created_by: currentUser.email }, "-created_date");
      } else {
        articlesData = []; // No articles for non-admin/non-mentor users
      }
      
      console.log(`[ManageArticles] Loaded ${articlesData.length} articles.`);
      setArticles(articlesData);
    } catch (error) {
      console.error("Failed to load articles:", error);
      alert(`שגיאה בטעינת המאמרים: ${error.message}`);
    } finally {
      setIsLoadingArticles(false);
    }
  };

  const handleApprove = async (articleId) => {
    setProcessingId(articleId);
    try {
      await adminManageArticle({
        articleId: articleId,
        newStatus: 'published'
      });
      await loadArticles();
      setShowPreview(false);
      alert("המאמר אושר ופורסם בהצלחה! 🎉");
    } catch (error) {
      console.error("Error approving article:", error);
      alert(`שגיאה באישור המאמר: ${error.message}. נסי לרענן ולהתחבר מחדש.`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (articleId) => {
    setProcessingId(articleId);
    try {
      await adminManageArticle({
        articleId: articleId,
        newStatus: 'rejected'
      });
      await loadArticles();
      setShowPreview(false);
      alert("המאמר נדחה.");
    } catch (error) {
      console.error("Error rejecting article:", error);
      alert(`שגיאה בדחיית המאמר: ${error.message}.`);
    } finally {
      setProcessingId(null);
    }
  };
  
  const handleDelete = async (articleId) => {
    if (window.confirm("האם את בטוחה שאת רוצה למחוק את המאמר לגמרי?")) {
      try {
        await MentorArticle.delete(articleId);
        await loadArticles();
        alert("המאמר נמחק בהצלחה.");
      } catch (error) {
        console.error("Error deleting article:", error);
        alert(`שגיאה במחיקת המאמר: ${error.message}.`);
      }
    }
  };

  const handlePreview = (article) => {
    setSelectedArticle(article);
    setShowPreview(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'published': return 'פורסם';
      case 'pending': return 'ממתין לאישור';
      case 'rejected': return 'נדחה';
      default: return status || 'לא ידוע';
    }
  };

  if (isLoadingUser || isLoadingArticles) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 flex justify-center items-center">
        <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
      </div>
    );
  }

  if (!isAdmin && !isMentor) {
    return <AccessDenied />;
  }

  const pendingArticles = articles.filter(a => a.status === 'pending');
  const publishedArticles = articles.filter(a => a.status === 'published');
  const rejectedArticles = articles.filter(a => a.status === 'rejected');

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? 'ניהול מאמרים' : 'המאמרים שלי'}
          </h1>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
              ממתינים לאישור: {pendingArticles.length}
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-800">
              פורסמו: {publishedArticles.length}
            </Badge>
            <Link to={createPageUrl('WriteArticle')}>
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
                <Edit className="w-4 h-4 ml-2" />
                כתיבת מאמר חדש
              </Button>
            </Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              ממתינים לאישור ({pendingArticles.length})
            </TabsTrigger>
            <TabsTrigger value="published" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              פורסמו ({publishedArticles.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              נדחו ({rejectedArticles.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              כל המאמרים ({articles.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <ArticlesList 
              articles={pendingArticles} 
              onApprove={isAdmin ? handleApprove : null}
              onReject={isAdmin ? handleReject : null}
              onPreview={handlePreview}
              onDelete={handleDelete}
              processingId={processingId}
              showActions={true}
              getStatusText={getStatusText}
              getStatusColor={getStatusColor}
              isAdmin={isAdmin}
            />
          </TabsContent>

          <TabsContent value="published" className="space-y-6">
            <ArticlesList 
              articles={publishedArticles} 
              onPreview={handlePreview}
              onDelete={handleDelete}
              processingId={processingId}
              showActions={false}
              getStatusText={getStatusText}
              getStatusColor={getStatusColor}
              isAdmin={isAdmin}
            />
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            <ArticlesList 
              articles={rejectedArticles} 
              onApprove={isAdmin ? handleApprove : null}
              onPreview={handlePreview}
              onDelete={handleDelete}
              processingId={processingId}
              showActions={true}
              getStatusText={getStatusText}
              getStatusColor={getStatusColor}
              isAdmin={isAdmin}
            />
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <ArticlesList 
              articles={articles} 
              onApprove={isAdmin ? handleApprove : null}
              onReject={isAdmin ? handleReject : null}
              onPreview={handlePreview}
              onDelete={handleDelete}
              processingId={processingId}
              showActions={true}
              getStatusText={getStatusText}
              getStatusColor={getStatusColor}
              isAdmin={isAdmin}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              תצוגה מקדימה: {selectedArticle?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedArticle && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedArticle.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>מאת: {selectedArticle.mentor_name}</span>
                  <span>נכתב: {format(new Date(selectedArticle.created_date), 'dd/MM/yyyy', { locale: he })}</span>
                  <Badge className={getStatusColor(selectedArticle.status)}>
                    {getStatusText(selectedArticle.status)}
                  </Badge>
                </div>
              </div>
              
              {selectedArticle.summary && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">תקציר:</h3>
                  <p className="text-gray-700">{selectedArticle.summary}</p>
                </div>
              )}
              
              {selectedArticle.image_url && (
                <div className="text-center">
                  <img 
                    src={selectedArticle.image_url} 
                    alt={selectedArticle.title}
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              )}
              
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
                  {selectedArticle.content}
                </div>
              </div>
              
              {selectedArticle.status === 'pending' && isAdmin && (
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedArticle.id)}
                    disabled={processingId === selectedArticle.id}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    {processingId === selectedArticle.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'דחה'}
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedArticle.id)}
                    disabled={processingId === selectedArticle.id}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {processingId === selectedArticle.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'אשר ופרסם'}
                  </Button>
                </div>
              )}
              {selectedArticle.status === 'rejected' && isAdmin && (
                 <div className="flex justify-end gap-3 pt-4 border-t">
                 <Button
                   onClick={() => handleApprove(selectedArticle.id)}
                   disabled={processingId === selectedArticle.id}
                   className="bg-green-600 hover:bg-green-700 text-white"
                 >
                   {processingId === selectedArticle.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'אשר ופרסם'}
                 </Button>
                 </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Component for articles list
function ArticlesList({ articles, onApprove, onReject, onPreview, onDelete, processingId, showActions, getStatusText, getStatusColor, isAdmin }) {

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">אין מאמרים בקטגוריה זו</h3>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Card key={article.id} className="bg-white shadow-md">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg font-bold text-gray-900 mb-2">
                  {article.title}
                </CardTitle>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>מאת: {article.mentor_name}</span>
                  <span>נכתב: {format(new Date(article.created_date), 'dd/MM/yyyy', { locale: he })}</span>
                  <Badge className={getStatusColor(article.status)}>
                    {getStatusText(article.status)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {article.summary && (
              <p className="text-gray-600 mb-4 line-clamp-2">{article.summary}</p>
            )}
            
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onPreview(article)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  הצג מאמר
                </Button>
                
                <Link to={createPageUrl(`WriteArticle?id=${article.id}`)}>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-purple-300 text-purple-600 hover:bg-purple-50"
                  >
                    <Edit className="w-4 h-4" />
                    ערוך
                  </Button>
                </Link>
              </div>
              
              <div className="flex gap-2">
                {showActions && article.status === 'pending' && isAdmin && onReject && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReject(article.id)}
                      disabled={processingId === article.id}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      {processingId === article.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'דחה'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onApprove(article.id)}
                      disabled={processingId === article.id}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {processingId === article.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'אשר ופרסם'}
                    </Button>
                  </>
                )}
                
                {showActions && article.status === 'rejected' && isAdmin && onApprove && (
                  <Button
                    size="sm"
                    onClick={() => onApprove(article.id)}
                    disabled={processingId === article.id}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {processingId === article.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'אשר ופרסם'}
                  </Button>
                )}
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(article.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
