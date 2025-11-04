
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { MentorProfile as MentorEntity } from '@/api/entities';
import { MentorArticle } from '@/api/entities';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Star, Loader2, AlertTriangle, RefreshCw, Info, MessageSquare, ArrowRight, Home, Heart, Share2, Facebook, Linkedin, MessageCircle, Link as LinkIcon, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useUser, isUserAdmin } from '../components/auth/UserContext';

export default function MentorProfile() {
  const { id } = useParams();
  const mentorId = new URLSearchParams(window.location.search).get('id') || id;
  
  const [mentor, setMentor] = useState(null);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const { currentUser: user } = useUser();

  const isOwner = user && mentor && user.email === mentor.contact_email;

  const loadMentorData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`[MentorProfile] Loading mentor with ID: ${mentorId}`);
      
      const mentorData = await MentorEntity.get(mentorId);
      console.log('[MentorProfile] Mentor data received:', mentorData);
      
      if (!mentorData) {
        console.log('[MentorProfile] No mentor found with ID:', mentorId);
        setError('המנטורית לא נמצאה. יתכן שהקישור שגוי.');
        setIsLoading(false);
        return;
      }
      
      setMentor(mentorData);
      console.log('[MentorProfile] ✅ Mentor profile loaded successfully');

      try {
        const mentorArticles = await MentorArticle.filter({ 
          mentor_profile_id: mentorData.id,
          status: 'published' 
        }, '-publication_date');
        setArticles(mentorArticles || []);
        console.log(`[MentorProfile] ✅ Articles loaded: ${mentorArticles?.length || 0}`);
      } catch (articlesError) {
        console.warn('[MentorProfile] Could not load articles:', articlesError.message);
        setArticles([]);
      }

    } catch (e) {
      console.error('[MentorProfile] Error loading mentor data:', e);
      setError(`שגיאה בטעינת פרטי המנטורית: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [mentorId, setMentor, setArticles, setError, setIsLoading]);

  useEffect(() => {
    if (mentorId) {
      loadMentorData();
    } else {
      setError('לא סופק מזהה מנטורית');
      setIsLoading(false);
    }
  }, [mentorId, loadMentorData]);

  const handleShareToSocial = (platform) => {
    if (!mentor || !mentorId) return;
    
    // Ensure the domain is correct for deployment
    const profileUrl = `https://rse50.co.il${createPageUrl('MentorProfile')}?id=${mentorId}`;
    const shareText = `היכרו עם ${mentor.mentor_name}, מנטורית מומחית ב${mentor.specialty} ב-ReStart 50+. בואו להכיר!`;
    
    let shareUrl = '';
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + profileUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyProfileLink = () => {
    if (!mentorId) return;
    
    const profileUrl = `https://rse50.co.il${createPageUrl('MentorProfile')}?id=${mentorId}`;
    
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="text-center p-6 border-red-300">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-medium text-red-800">אופס, אירעה שגיאה</h3>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <Button onClick={loadMentorData} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" /> נסי שוב
          </Button>
        </Card>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="text-center p-6">
          <h3 className="text-lg font-medium text-gray-800">המנטורית לא נמצאה</h3>
          <p className="mt-2 text-sm text-gray-600">יתכן שהקישור שגוי או שהמנטורית לא קיימת יותר במערכת.</p>
          <Button asChild className="mt-4" variant="outline">
            <Link to={createPageUrl("CoachesAndConsultants")}>חזרה לרשימת המנטוריות</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        
        {isOwner && (
          <Alert className="mb-8 bg-yellow-100 border-yellow-300 text-yellow-800">
            <Info className="h-4 w-4 !text-yellow-800" />
            <AlertTitle className="font-bold">זוהי תצוגה מקדימה</AlertTitle>
            <AlertDescription>
              כך הפרופיל שלך נראה למשתמשות אחרות. כדי לערוך את הפרופיל, 
              <Link to={createPageUrl('EditMentorProfile')} className="font-semibold underline hover:text-yellow-900"> לחצי כאן</Link>.
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img 
                src={mentor.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.mentor_name)}&background=EC4899&color=fff`} 
                alt={mentor.mentor_name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-4xl font-bold text-gray-900">{mentor.mentor_name}</h1>
              <p className="text-xl text-pink-600 font-medium">{mentor.specialty}</p>
              {mentor.meeting_availability && mentor.meeting_availability.length > 0 && (
                <div className="mt-2">
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    זמינות: {mentor.meeting_availability.join(" + ")}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          
          {/* Body */}
          <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-pink-200 pb-2 mb-4">קצת עליי</h2>
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{mentor.bio}</p>
              </div>

              {mentor.focus_areas && mentor.focus_areas.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-pink-200 pb-2 mb-4">תחומי מיקוד</h2>
                  <div className="flex flex-wrap gap-2">
                    {mentor.focus_areas.map((area, index) => (
                      <Badge key={index} variant="outline" className="bg-pink-50 text-pink-700 border-pink-200 text-sm px-3 py-1">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {mentor.recommendations && mentor.recommendations.length > 0 && (
                 <div>
                    <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-pink-200 pb-2 mb-4">המלצות</h2>
                    <div className="space-y-4">
                      {mentor.recommendations.map((rec, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-pink-400">
                          <p className="italic text-gray-700 mb-2">"{rec.text}"</p>
                          <p className="text-right font-semibold text-sm text-gray-900">- {rec.author}</p>
                        </div>
                      ))}
                    </div>
                </div>
              )}

              {articles.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-pink-200 pb-2 mb-4">המאמרים שלי ({articles.length})</h2>
                  <div className="space-y-4">
                    {articles.map((article) => (
                      <div key={article.id} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                        <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                        {article.summary && (
                          <p className="text-gray-600 text-sm mb-2">{article.summary}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            פורסם ב-{new Date(article.publication_date).toLocaleDateString('he-IL')}
                          </span>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={createPageUrl(`Article/${article.id}`)}>קריאה</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <aside className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Info className="text-pink-500" />
                    פרטים נוספים
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-pink-500" />
                    <span>{mentor.location || 'פגישות אונליין'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-purple-800">
                    <Calendar className="text-purple-600" />
                    קבעי פגישת היכרות
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-700 mb-4 text-center">
                    רוצה להתייעץ עם {mentor.mentor_name.split(' ')[0]}? לחצי על הכפתור ותעברי לדף תיאום פגישת היכרות אישית.
                  </p>
                  <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                    <Link to={createPageUrl(`Booking?mentorId=${mentor.id}&mentorName=${encodeURIComponent(mentor.mentor_name)}&mentorEmail=${encodeURIComponent(mentor.contact_email)}`)}>
                      <MessageSquare className="w-4 h-4 ml-2" />
                      תיאום פגישה
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </Card>

        {/* Share Section - NEW */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-purple-800 mb-2 flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                אהבת את הפרופיל? שתפי אותו!
              </h3>
              <p className="text-sm text-purple-600">עזרי ל{mentor.mentor_name.split(' ')[0]} להגיע ליותר נשים ולהרחיב את מעגל ההשפעה</p>
            </div>
            
            <div className="flex justify-center gap-3 flex-wrap">
              <Button
                onClick={() => handleShareToSocial('facebook')}
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <Facebook className="w-5 h-5 ml-2" />
                שיתוף בפייסבוק
              </Button>
              
              <Button
                onClick={() => handleShareToSocial('linkedin')}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Linkedin className="w-5 h-5 ml-2" />
                שיתוף בלינקדאין
              </Button>
              
              <Button
                onClick={() => handleShareToSocial('whatsapp')}
                variant="outline"
                className="border-green-300 text-green-600 hover:bg-green-50"
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                שיתוף בוואטסאפ
              </Button>
              
              <Button
                onClick={handleCopyProfileLink}
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

        {/* Navigation buttons at the bottom */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 mb-4">
          <Button asChild variant="outline" size="lg" className="border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-700">
            <Link to={createPageUrl('CoachesAndConsultants')}>
              <ArrowRight className="w-4 h-4 ml-2" />
              חזרה לרשימת המנטוריות
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700">
            <Link to={createPageUrl('MyProfile')}>
              <Heart className="w-4 h-4 ml-2" />
              חזרה למקום שלי
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
