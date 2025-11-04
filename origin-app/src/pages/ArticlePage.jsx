
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MentorArticle } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, User, Calendar, Loader2, AlertTriangle, Facebook, Linkedin, MessageCircle, Link as LinkIcon, Check, Heart, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ArticlePage() {
  const { id } = useParams();
  const articleId = new URLSearchParams(window.location.search).get('id') || id;
  
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      if (!articleId) {
        setError('לא סופק מזהה מאמר');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log(`[ArticlePage] Loading article with ID: ${articleId}`);
        const articleData = await MentorArticle.get(articleId);
        
        if (!articleData) {
          setError('המאמר לא נמצא');
        } else if (articleData.status !== 'published') {
          setError('המאמר לא זמין לצפייה');
        } else {
          setArticle(articleData);
          console.log(`[ArticlePage] Article loaded successfully:`, articleData.title);
        }
      } catch (err) {
        console.error('[ArticlePage] Error loading article:', err);
        setError(`שגיאה בטעינת המאמר: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);

  const handleShare = (platform) => {
    if (!article) return;
    
    const articleUrl = `https://rse50.co.il/ArticlePage?id=${article.id}`;
    const shareText = `${article.title} - מאת ${article.mentor_name} | ReStart 50+`;
    
    let shareUrl = '';
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + articleUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = () => {
    if (!article) return;
    
    const articleUrl = `https://rse50.co.il/ArticlePage?id=${article.id}`;
    
    navigator.clipboard.writeText(articleUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="text-center p-6 border-red-300">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-medium text-red-800">אירעה שגיאה</h3>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <Button asChild className="mt-4" variant="outline">
            <Link to={createPageUrl("Articles")}>
              <ArrowRight className="w-4 h-4 ml-2" />
              חזרה למאמרים
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="text-center p-6">
          <h3 className="text-lg font-medium text-gray-800">המאמר לא נמצא</h3>
          <p className="mt-2 text-sm text-gray-600">יתכן שהקישור שגוי או שהמאמר לא קיים יותר.</p>
          <Button asChild className="mt-4" variant="outline">
            <Link to={createPageUrl("Articles")}>חזרה למאמרים</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="outline" className="border-rose-300 text-rose-600 hover:bg-rose-50">
            <Link to={createPageUrl("Articles")}>
              <ArrowRight className="w-4 h-4 ml-2" />
              חזרה למאמרים
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <Card className="mb-8 overflow-hidden shadow-xl border-0">
          <div className="h-2 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500"></div>
          
          {article.image_url && (
            <div className="h-64 bg-gradient-to-br from-rose-100 to-pink-100 relative overflow-hidden">
              <img 
                src={article.image_url} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <CardHeader className="p-8">
            <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {article.title}
            </CardTitle>
            
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-rose-500" />
                {article.mentor_profile_id ? (
                  <Link 
                    to={createPageUrl(`MentorProfile?id=${article.mentor_profile_id}`)}
                    className="text-rose-600 hover:text-rose-800 font-medium hover:underline transition-colors"
                  >
                    {article.mentor_name}
                  </Link>
                ) : (
                  <span className="font-medium">{article.mentor_name}</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-rose-500" />
                <span>{format(new Date(article.publication_date || article.created_date), 'd בMMMM yyyy', { locale: he })}</span>
              </div>
            </div>
            
            {article.summary && (
              <div className="mt-6 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200">
                <p className="text-lg text-gray-700 leading-relaxed font-medium">
                  {article.summary}
                </p>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Article Content */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <div 
                className="whitespace-pre-wrap leading-relaxed text-gray-800 text-lg"
                dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Share Section */}
        <Card className="mt-8 bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-rose-800 mb-2">אהבת את המאמר? שתפי אותו!</h3>
              <p className="text-sm text-rose-600">עזרי לנו להעביר את המסר הלאה ולהגיע ליותר נשים</p>
            </div>
            
            <div className="flex justify-center gap-3 flex-wrap">
              <Button
                onClick={() => handleShare('facebook')}
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <Facebook className="w-5 h-5 ml-2" />
                שיתוף בפייסבוק
              </Button>
              
              <Button
                onClick={() => handleShare('linkedin')}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Linkedin className="w-5 h-5 ml-2" />
                שיתוף בלינקדאין
              </Button>
              
              <Button
                onClick={() => handleShare('whatsapp')}
                variant="outline"
                className="border-green-300 text-green-600 hover:bg-green-50"
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                שיתוף בוואטסאפ
              </Button>
              
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                {copySuccess ? (
                  <>
                    <Check className="w-5 h-5 ml-2 text-green-600" />
                    הקישור הועתק!
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-5 h-5 ml-2" />
                    העתקת קישור
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section - Join Now */}
        <Card className="mt-8 bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 border-0 shadow-2xl overflow-hidden">
          <CardContent className="p-8 md:p-12 text-center relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-300 rounded-full opacity-20 -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-300 rounded-full opacity-20 -ml-12 -mb-12"></div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                אהבת את המאמר?
              </h2>
              
              <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
                רוצה לגלות עולם שלם של תכנים, ליווי וקהילה תומכת?<br />
                <span className="font-semibold">הצטרפי עכשיו ל-ReStart 50+!</span>
              </p>
              
              <Button asChild size="lg" className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Link to={createPageUrl("Join")}>
                  <Sparkles className="w-5 h-5 ml-2" />
                  הצטרפי עכשיו ל-ReStart 50+
                </Link>
              </Button>
              
              <p className="text-sm text-gray-600 mt-4">
                מנוי חודשי ב-55₪ בלבד • ביטול בכל עת • ללא התחייבות
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Author Info Section */}
        {article.mentor_profile_id && (
          <Card className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">על הכותבת</h3>
                  <p className="text-purple-700">רוצה לדעת יותר על {article.mentor_name} ולראות עוד מאמרים שלה?</p>
                </div>
                <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
                  <Link to={createPageUrl(`MentorProfile?id=${article.mentor_profile_id}`)}>
                    <User className="w-4 h-4 ml-2" />
                    צפי בפרופיל
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back Button Bottom */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="border-rose-300 text-rose-600 hover:bg-rose-50">
            <Link to={createPageUrl("Articles")}>
              <ArrowRight className="w-4 h-4 ml-2" />
              חזרה למאמרים
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
