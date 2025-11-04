
import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback for loadDashboardData
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useUser } from '../components/auth/UserContext';
import { MentorProfile } from '@/api/entities';
import { Appointment } from '@/api/entities';
import { MentorArticle } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Star, Loader2, AlertTriangle, RefreshCw, Settings, User, BarChart2, MessageSquare, Bell, CalendarCheck, Phone, Sparkles, Mail, MessageCircle, Heart, Share2, Copy, Check, CheckCircle, Crown, Plus, Edit, XCircle, Eye, Users, BookOpen, Facebook, Linkedin, Zap, TrendingUp, Target } from 'lucide-react';
import { format, isFuture, parseISO, isPast } from 'date-fns';
import { he } from 'date-fns/locale';
import { getMentorAppointments } from '@/api/functions';


const SubscriptionStatusCard = ({ currentUser }) => {
    if (!currentUser) return null;

    const endDate = currentUser.subscription_end_date ? parseISO(currentUser.subscription_end_date) : null;
    const isTrial = currentUser.subscription_type === 'trial';
    const isActive = currentUser.subscription_status === 'active';
    const isComped = currentUser.subscription_type === 'mentor_comp';
    
    let statusContent = null;

    if (isComped && isActive) {
        statusContent = (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-green-700"><CheckCircle className="w-6 h-6"/>סטטוס מנוי</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-medium text-green-800">יש לך מנוי פרימיום מלא במתנה כחלק מצוות המומחיות.</p>
                    <p className="text-sm mt-1 text-green-700">תודה על תרומתך לקהילה!</p>
                </CardContent>
            </div>
        );
    } else if (isTrial && endDate && isFuture(endDate)) {
         statusContent = (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-blue-700"><Sparkles className="w-6 h-6"/>מנוי ניסיון פעיל</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-medium text-blue-800">את נהנית מגישה מלאה כחלק מתקופת הניסיון שלך.</p>
                    <p className="text-sm mt-1 text-blue-700">המנוי שלך יפוג בתאריך: <strong>{format(endDate, 'dd/MM/yyyy', { locale: he })}</strong></p>
                </CardContent>
            </div>
        );
    } else if (isActive && !isTrial && !isComped) {
        statusContent = (
             <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-green-700"><CheckCircle className="w-6 h-6"/>מנוי פרימיום פעיל</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-medium text-green-800">תודה על היותך מנטורית וחברה בקהילת RSE50!</p>
                    {endDate && <p className="text-sm mt-1 text-green-700">המנוי שלך בתוקף עד: <strong>{format(endDate, 'dd/MM/yyyy', { locale: he })}</strong></p>}
                </CardContent>
            </div>
        );
    } else {
        statusContent = (
             <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-rose-700"><AlertTriangle className="w-6 h-6"/>המנוי שלך אינו פעיל</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-medium mb-4 text-rose-800">כדי להמשיך ליהנות מכל הכלים והחשיפה למנטוריות, יש לחדש את המנוי.</p>
                    <Button asChild className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white">
                        <Link to={createPageUrl('MentorSubscribe')}>
                            <Crown className="w-4 h-4 ml-2" />
                            לחידוש מנוי המנטורית
                        </Link>
                    </Button>
                </CardContent>
            </div>
        );
    }

    return <Card className="mb-8 shadow-md border-0 overflow-hidden">{statusContent}</Card>;
};


const MentorDashboard = () => {
  const { currentUser } = useUser();
  const [mentorProfile, setMentorProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [articles, setArticles] = useState([]);
  const [publishedArticles, setPublishedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    pendingAppointments: 0,
    upcomingAppointments: 0,
    awaitingCoordination: 0,
    publishedArticles: 0
  });
  const [copySuccess, setCopySuccess] = useState(false);

  const loadDashboardData = useCallback(async () => {
    if (!currentUser || !currentUser.email) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const profileResponse = await MentorProfile.filter({ contact_email: currentUser.email });
      
      if (profileResponse.length > 0) {
        setMentorProfile(profileResponse[0]);

        let fetchedAppointments = [];
        if (profileResponse[0].id) {
            try {
                const response = await getMentorAppointments({ mentor_profile_id: profileResponse[0].id });
                const responseData = response?.data;
                if (responseData && responseData.success) {
                    fetchedAppointments = responseData.data || [];
                } else {
                    const errorMessage = responseData?.error || 'Unknown error from backend function';
                    throw new Error(errorMessage);
                }
                setAppointments(fetchedAppointments);
            } catch (appointmentError) {
                setError(`שגיאה בטעינת הפגישות: ${appointmentError.message}`);
                setAppointments([]);
            }
        }
      
        const mentorArticles = await MentorArticle.filter({ mentor_profile_id: profileResponse[0]?.id || '' }, '-created_date');
        setArticles(mentorArticles);
        
        const published = mentorArticles.filter(a => a.status === 'published');
        setPublishedArticles(published);

        const upcoming = fetchedAppointments.filter(app =>
          app.appointment_date && app.status === 'confirmed' && isFuture(parseISO(app.appointment_date))
        );
        
        const awaitingCoordination = fetchedAppointments.filter(app =>
            app.status === 'confirmed' && !app.appointment_date
        );

        const pending = fetchedAppointments.filter(app => app.status === 'pending_approval');
        
        setStats({
          pendingAppointments: pending.length,
          upcomingAppointments: upcoming.length,
          awaitingCoordination: awaitingCoordination.length,
          publishedArticles: published.length
        });

      } else {
        setMentorProfile(null);
        setAppointments([]);
        setArticles([]);
        setPublishedArticles([]);
        setStats({
          pendingAppointments: 0,
          upcomingAppointments: 0,
          awaitingCoordination: 0,
          publishedArticles: 0
        });
      }

    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("שגיאה בטעינת לוח הבקרה: " + (err.message || "נסה שוב מאוחר יותר."));
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]); // Added currentUser as dependency for useCallback

  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser, loadDashboardData]); // Added loadDashboardData as dependency

  const handleCopyProfileLink = () => {
    if (!mentorProfile || !mentorProfile.id) return;
    
    const profileUrl = `https://rse50.co.il${createPageUrl('MentorProfile')}?id=${mentorProfile.id}`;
    
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const handleShareToSocial = (platform) => {
    if (!mentorProfile || !mentorProfile.id) return;
    
    const profileUrl = `https://rse50.co.il${createPageUrl('MentorProfile')}?id=${mentorProfile.id}`;
    const shareText = `היי! אני ${mentorProfile.mentor_name}, מנטורית ב-ReStart 50+. אני מתמחה ב${mentorProfile.specialty}. בואו נכיר!`;
    
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-600">טוענת את לוח הבקרה שלך...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <Card className="max-w-md w-full border-rose-200 bg-rose-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-rose-700">
              <AlertTriangle className="w-6 h-6" />
              שגיאה בטעינת הנתונים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-rose-600 mb-4">{error}</p>
            <Button onClick={loadDashboardData} className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white">
              <RefreshCw className="w-4 h-4 ml-2" />
              נסי שוב
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Changed the logic flow for these checks to match the outline's implied structure
  // Handle case where currentUser is null or not an approved mentor
  if (!currentUser?.is_approved_mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <Card className="max-w-md w-full border-rose-200 bg-rose-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-rose-700">
              <XCircle className="w-6 h-6" />
              גישה לא מורשית
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-rose-600 mb-4">לוח בקרה זה מיועד למנטוריות מאושרות בלבד.</p>
            <Button asChild className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white">
              <Link to={createPageUrl('BecomeMentor')}>
                <Crown className="w-4 h-4 ml-2" />
                הגישי בקשה להצטרף כמנטורית
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle case where mentor profile is missing for an approved mentor
  if (!mentorProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <Card className="max-w-md w-full border-rose-200 bg-rose-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-rose-700">
              <AlertTriangle className="w-6 h-6" />
              פרופיל מנטורית לא נמצא
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-rose-600 mb-4">נראה שעדיין לא יצרת פרופיל מנטורית. כדי להשתמש בלוח הבקרה, עליך ליצור פרופיל תחילה.</p>
            <Button asChild className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white">
              <Link to={createPageUrl('EditMentorProfile')}>
                <Edit className="w-4 h-4 ml-2" />
                צרי פרופיל מנטורית
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingAppointments = appointments.filter(apt => apt.status === 'pending_approval');
  const awaitingCoordination = appointments.filter(apt => apt.status === 'confirmed' && !apt.appointment_date);
  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'confirmed' && 
    apt.appointment_date && 
    isFuture(parseISO(apt.appointment_date))
  ).sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Subscription Status */}
        <SubscriptionStatusCard currentUser={currentUser} />

        {/* Beta Welcome Card */}
        <Card className="mb-8 shadow-xl border-0 overflow-hidden bg-gradient-to-r from-purple-100 via-pink-100 to-indigo-100">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="w-10 h-10 text-purple-600" />
              <h2 className="text-2xl font-bold text-purple-800">🎉 מזל טוב! את מנטורית מאושרת ב-ReStart 50+</h2>
            </div>
            <p className="text-purple-700 text-lg leading-relaxed">
              היי {currentUser?.full_name?.split(' ')[0] || 'מנטורית'}! 👋 זהו לוח הבקרה שלך – כאן תנהלי פגישות, תעקבי אחרי בקשות חדשות ותעדכני את הפרופיל והתכנים שלך.
            </p>
          </CardContent>
        </Card>

        {/* Hero Motivational Text */}
        <div className="mb-10 text-center bg-gradient-to-r from-rose-100 via-pink-100 to-orange-100 rounded-2xl p-8 shadow-lg border border-pink-200">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-rose-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              לוח הבקרה הוא מרכז ההשפעה שלך 🚀
            </h1>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
            מכאן את מנהלת את הפגישות, מעדכנת את הפרופיל, כותבת מאמרים ומשתפת את הידע שלך – גם כאן וגם ברשתות החברתיות בלחיצת כפתור. 
            כל פעולה כאן מגבירה את הנראות שלך בקהילה ומחברת אותך לעוד נשים שמחכות להכיר אותך.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Column - Alerts & Upcoming */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Urgent Actions Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4 flex-row-reverse">
                <h2 className="text-2xl font-bold text-gray-800">התראות ופעולות דחופות</h2>
                <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* New Appointment Requests */}
              {pendingAppointments.length > 0 && (
                <Card className="shadow-lg border-0 bg-gradient-to-r from-rose-50 to-pink-50 border-l-4 border-l-rose-400">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-rose-700">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        בקשות חדשות לפגישה דורשות תגובה
                      </span>
                      <Badge className="bg-rose-500 text-white text-lg px-3 py-1">
                        {pendingAppointments.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pendingAppointments.slice(0, 3).map((appointment) => (
                        <div key={appointment.id} className="p-4 bg-white rounded-lg border border-rose-200 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-gray-800">{appointment.user_name}</p>
                              <p className="text-sm text-gray-600">{appointment.user_email}</p>
                            </div>
                            <Badge variant="outline" className="text-rose-600 border-rose-300">חדש</Badge>
                          </div>
                          {appointment.user_message && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2 bg-gray-50 p-2 rounded">
                              {appointment.user_message}
                            </p>
                          )}
                          <Button asChild size="sm" className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white">
                            <Link to={createPageUrl(`ApproveBooking?id=${appointment.id}`)}>
                              <CheckCircle className="w-4 h-4 ml-2" />
                              טפלי עכשיו
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                    {pendingAppointments.length > 3 && (
                      <Button asChild variant="outline" className="w-full mt-4 border-rose-300 text-rose-600 hover:bg-rose-50">
                        <Link to={createPageUrl('ManageMyBookings')}>
                          ראי את כל הבקשות ({pendingAppointments.length})
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Awaiting Coordination */}
              {awaitingCoordination.length > 0 && (
                <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-l-orange-400">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-orange-700">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        פגישות ליצירת קשר ותיאום
                      </span>
                      <Badge className="bg-orange-500 text-white text-lg px-3 py-1">
                        {awaitingCoordination.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {awaitingCoordination.slice(0, 3).map((appointment) => (
                        <div key={appointment.id} className="p-4 bg-white rounded-lg border border-orange-200 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-gray-800">{appointment.user_name}</p>
                              <div className="flex gap-3 mt-1">
                                <a href={`mailto:${appointment.user_email}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {appointment.user_email}
                                </a>
                                {appointment.user_phone && (
                                  <a href={`tel:${appointment.user_phone}`} className="text-sm text-green-600 hover:underline flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {appointment.user_phone}
                                  </a>
                                )}
                              </div>
                            </div>
                            <Badge variant="outline" className="text-orange-600 border-orange-300">ממתינה</Badge>
                          </div>
                          <Button asChild size="sm" className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white mt-2">
                            <Link to={createPageUrl(`ApproveBooking?id=${appointment.id}`)}>
                              <Calendar className="w-4 h-4 ml-2" />
                              תאמי פגישה
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                    {awaitingCoordination.length > 3 && (
                      <Button asChild variant="outline" className="w-full mt-4 border-orange-300 text-orange-600 hover:bg-orange-50">
                        <Link to={createPageUrl('ManageMyBookings')}>
                          ראי את כל הפגישות הממתינות ({awaitingCoordination.length})
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* No Urgent Actions */}
              {pendingAppointments.length === 0 && awaitingCoordination.length === 0 && (
                <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-700 mb-2">כל הפעולות הדחופות טופלו! 🎉</h3>
                    <p className="text-green-600">אין בקשות חדשות לטיפול כרגע. נהדר!</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Upcoming Appointments */}
            <div>
              <div className="flex items-center gap-3 mb-4 flex-row-reverse">
                <h2 className="text-2xl font-bold text-gray-800">פגישות מאושרות בקרוב</h2>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <CalendarCheck className="w-6 h-6 text-white" />
                </div>
              </div>

              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.slice(0, 3).map((appointment) => (
                    <Card key={appointment.id} className="shadow-lg border-0 bg-gradient-to-r from-purple-50 to-indigo-50 hover:shadow-xl transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-lg text-gray-800">{appointment.user_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-4 h-4 text-purple-600" />
                              <span className="text-purple-700 font-medium">
                                {format(parseISO(appointment.appointment_date), 'dd/MM/yyyy HH:mm', { locale: he })}
                              </span>
                            </div>
                          </div>
                          <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                            {appointment.type === 'intro_call' ? 'שיחת היכרות' : 'פגישה בתשלום'}
                          </Badge>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <a href={`mailto:${appointment.user_email}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            שליחת מייל
                          </a>
                          {appointment.user_phone && (
                            <a href={`tel:${appointment.user_phone}`} className="text-sm text-green-600 hover:underline flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              התקשרות
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {upcomingAppointments.length > 3 && (
                    <Button asChild variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50">
                      <Link to={createPageUrl('ManageMyBookings')}>
                        ראי את כל הפגישות הקרובות ({upcomingAppointments.length})
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <Card className="shadow-lg border-0 bg-white">
                  <CardContent className="p-8 text-center">
                    <CalendarCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">אין פגישות מתוכננות בימים הקרובים.</p>
                  </CardContent>
                </Card>
              )}
            </div>

          </div>

          {/* Sidebar - Quick Actions & Stats */}
          <div className="space-y-6">
            
            {/* Profile & Share Card */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-rose-50 to-pink-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-rose-700">
                  <User className="w-5 h-5" />
                  הפרופיל שלי
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={mentorProfile.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorProfile.mentor_name)}&background=F472B6&color=fff`}
                    alt={mentorProfile.mentor_name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div>
                    <p className="font-bold text-gray-800">{mentorProfile.mentor_name}</p>
                    <p className="text-sm text-purple-600">{mentorProfile.specialty}</p>
                  </div>
                </div>

                <Button asChild variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50">
                  <Link to={createPageUrl(`MentorProfile?id=${mentorProfile.id}`)}>
                    <Eye className="w-4 h-4 ml-2" />
                    הפרופיל הציבורי שלי
                  </Link>
                </Button>

                <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  <Link to={createPageUrl('EditMentorProfile')}>
                    <Edit className="w-4 h-4 ml-2" />
                    עדכני את פרופילך
                  </Link>
                </Button>

                {/* Share Section */}
                <div className="pt-4 border-t border-pink-200">
                  <p className="text-sm font-semibold text-purple-700 mb-3 flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    שתפי את הפרופיל שלך
                  </p>
                  <div className="space-y-2">
                    <Button
                      onClick={handleCopyProfileLink}
                      variant="outline"
                      className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
                      size="sm"
                    >
                      {copySuccess ? (
                        <>
                          <Check className="w-4 h-4 ml-2 text-green-600" />
                          הקישור הועתק!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 ml-2" />
                          העתקת קישור
                        </>
                      )}
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleShareToSocial('facebook')}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <Facebook className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleShareToSocial('linkedin')}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <Linkedin className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleShareToSocial('whatsapp')}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-green-300 text-green-600 hover:bg-green-50"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-yellow-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Zap className="w-5 h-5" />
                  פעולות מהירות
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white">
                  <Link to={createPageUrl('WriteArticle')}>
                    <Edit className="w-4 h-4 ml-2" />
                    כתבי מאמר חדש
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white">
                  <Link to={createPageUrl('ManageMyBookings')}>
                    <Users className="w-4 h-4 ml-2" />
                    נהלי את כל הפגישות
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-indigo-700">
                  <BarChart2 className="w-5 h-5" />
                  סטטיסטיקות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-indigo-200">
                    <span className="text-gray-700 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-rose-500" />
                      בקשות ממתינות
                    </span>
                    <Badge className="bg-rose-100 text-rose-700 text-lg px-3 py-1">
                      {stats.pendingAppointments}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-indigo-200">
                    <span className="text-gray-700 flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-purple-500" />
                      פגישות קרובות
                    </span>
                    <Badge className="bg-purple-100 text-purple-700 text-lg px-3 py-1">
                      {stats.upcomingAppointments}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-indigo-200">
                    <span className="text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      ליצירת קשר
                    </span>
                    <Badge className="bg-orange-100 text-orange-700 text-lg px-3 py-1">
                      {stats.awaitingCoordination}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-indigo-200">
                    <span className="text-gray-700 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-green-500" />
                      מאמרים מפורסמים
                    </span>
                    <Badge className="bg-green-100 text-green-700 text-lg px-3 py-1">
                      {stats.publishedArticles}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Articles Management */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <BookOpen className="w-5 h-5" />
                  המאמרים שלי
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                    <p className="text-3xl font-bold text-green-700">{publishedArticles.length}</p>
                    <p className="text-sm text-gray-600">מאמרים מפורסמים</p>
                  </div>
                  <Button asChild className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                    <Link to={createPageUrl('WriteArticle')}>
                      <Plus className="w-4 h-4 ml-2" />
                      כתבי מאמר חדש
                    </Link>
                  </Button>
                  {articles.length > 0 && (
                    <Button asChild variant="outline" className="w-full border-green-300 text-green-600 hover:bg-green-50">
                      <Link to={createPageUrl('ManageArticles')}>
                        <Settings className="w-4 h-4 ml-2" />
                        נהלי מאמרים ({articles.length})
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
};

export default MentorDashboard;
