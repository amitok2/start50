
import React, { useState, useRef, useEffect } from 'react';
import { MentorApplication } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription }
  from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Heart, Sparkles, Plus, Trash2, Edit, User as UserIcon, Quote, ImagePlus, Crown, AlertCircle, Users, BookOpen, Calendar, Award, Briefcase, Zap, Target, Loader2 } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { User } from '@/api/entities';
import { Notification } from '@/api/entities';
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const MentorPreview = ({ formData, onEdit, onSubmit, isSubmitting, imagePreview }) => {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        תצוגה מקדימה
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        כך יראה הפרופיל שלך (בקירוב). אם הכל נראה טוב, אפשר לשלוח!
                    </p>
                </div>

                <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm mb-8">
                    <CardHeader className="text-center p-8">
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-rose-100 to-pink-100 flex items-center justify-center mb-4 border-4 border-white shadow-md overflow-hidden">
                           {imagePreview ? (
                            <img src={imagePreview} alt={formData.full_name} className="w-full h-full object-cover" />
                           ) : (
                            <UserIcon className="w-12 h-12 text-rose-500" />
                           )}
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">{formData.full_name || "שם המומחית"}</CardTitle>
                        <p className="text-lg text-rose-600 font-semibold">{formData.specialty || "תחום התמחות"}</p>
                        {formData.focus_areas && formData.focus_areas.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2 mt-2">
                                {formData.focus_areas.map((area, index) => (
                                    <span key={index} className="bg-purple-100 text-purple-800 text-xs rounded-full px-2 py-1">
                                        {area}
                                    </span>
                                ))}
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-6 px-8 pb-8">
                        <div>
                            <h3 className="font-semibold text-gray-800 border-b pb-2 mb-3">קצת על הניסיון שלי</h3>
                            <p className="text-gray-600 whitespace-pre-wrap">{formData.experience_summary || "..."}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 border-b pb-2 mb-3">למה אני רוצה להצטרף כמומחית ב-ReStart 50+?</h3>
                            <p className="text-gray-600 whitespace-pre-wrap">{formData.why_join || "..."}</p>
                        </div>
                        {formData.recommendations && formData.recommendations.filter(r => r.text).length > 0 && (
                            <div>
                                <h3 className="font-semibold text-gray-800 border-b pb-2 mb-3">המלצות</h3>
                                <div className="space-y-3">
                                {formData.recommendations.map((rec, index) => (
                                   rec.text && (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div className="flex items-start gap-3">
                                            <Quote className="w-5 h-5 text-rose-300 mt-1 flex-shrink-0 transform -scale-x-100" />
                                            <p className="italic text-gray-700">"{rec.text}"</p>
                                        </div>
                                        <p className="text-right font-semibold text-sm text-gray-900 mt-2">- {rec.author || "ממליצ.ה"}</p>
                                    </div>
                                   )
                                ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={onEdit} className="text-lg py-3 rounded-full">
                      <Edit className="w-4 h-4 ml-2" />
                      חזרה לעריכה
                    </Button>
                    <Button
                      onClick={onSubmit}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-rose-500 to-pink-600 text-white text-lg py-3 rounded-full"
                    >
                      <Heart className="w-5 h-5 ml-2" />
                      {isSubmitting ? 'שולחת...' : 'אישור ושליחה'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default function BecomeMentor() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    specialty: '',
    experience_summary: '',
    linkedin_profile_url: '',
    why_join: '',
    recommendations: [],
    focus_areas: []
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        // Auto-fill email and full_name when user is loaded
        if (user) {
          setFormData(prev => ({
            ...prev,
            email: user.email || prev.email,
            full_name: user.full_name || prev.full_name
          }));
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const specialtyOptions = [
    "קריירה ופיתוח מקצועי",
    "ייעוץ עסקי ופיננסי",
    "אימון להעצמה אישית וביטחון עצמי",
    "פיתוח מיומנויות טכנולוגיות",
    "אורח חיים בריא ותזונה",
    "הכנה לפרישה ופרק ב׳ בחיים",
    "יזמות נשית והגשמה עסקית",
    "מערכות יחסים וזוגיות",
    "פיתוח מנהיגות נשית",
    "ניהול זמן ופרודוקטיביות"
  ];

  const handleRecommendationChange = (index, field, value) => {
    const newRecommendations = [...formData.recommendations];
    newRecommendations[index] = { ...newRecommendations[index], [field]: value };
    setFormData(prev => ({ ...prev, recommendations: newRecommendations }));
  };

  const addRecommendation = () => {
    setFormData(prev => ({
        ...prev,
        recommendations: [...prev.recommendations, { author: '', text: '' }]
    }));
  };

  const removeRecommendation = (index) => {
      const newRecommendations = formData.recommendations.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, recommendations: newRecommendations }));
  };

  const handleFocusAreasChange = (newAreas) => {
    setFormData(prev => ({ ...prev, focus_areas: newAreas }));
  };

  const validateForm = () => {
    setFormError('');
    if (!formData.full_name || !formData.email || !formData.specialty || !formData.experience_summary || !formData.why_join) {
        setFormError('נא למלא את כל שדות החובה המסומנים בכוכבית.');
        return false;
    }
    // Ensure there's at least one non-empty recommendation
    const hasValidRecommendation = formData.recommendations.some(r => r.text && r.author);
    if (!hasValidRecommendation) {
        setFormError('חובה להוסיף לפחות המלצה אחת מלאה (עם שם ותוכן).');
        return false;
    }
    if (!hasAgreed) {
        setFormError('יש לאשר את תנאי השימוש ומדיניות הפרטיות.');
        return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!validateForm()) {
        return;
    }
    
    setIsSubmitting(true);
    setFormError('');

    try {
      console.log('[BecomeMentor] *** STARTING SUBMISSION PROCESS ***');

      let imageUrl = null;
      if (imageFile) {
        try {
          console.log('[BecomeMentor] Starting image upload...');
          const uploadResult = await UploadFile({ file: imageFile });
          imageUrl = uploadResult.file_url;
          console.log('[BecomeMentor] Image uploaded successfully:', imageUrl);
        } catch (uploadError) {
          console.error('[BecomeMentor] Image upload failed:', uploadError);
          setFormError(`שגיאה בהעלאת התמונה: ${uploadError.message}. הבקשה תישלח ללא תמונה.`);
        }
      }

      const finalFormData = {
        ...formData,
        image_url: imageUrl,
        focus_areas: formData.focus_areas.filter(area => area),
        recommendations: formData.recommendations.filter(r => r.author && r.text),
        status: 'pending'
      };

      console.log('[BecomeMentor] Final form data being sent:', {
        full_name: finalFormData.full_name,
        email: finalFormData.email,
        specialty: finalFormData.specialty,
        focus_areas_count: finalFormData.focus_areas.length,
        status: finalFormData.status,
        recommendations_count: finalFormData.recommendations.length,
        has_image: !!finalFormData.image_url
      });

      let application;
      try {
        console.log('[BecomeMentor] *** ATTEMPTING MentorApplication.create() ***');
        application = await MentorApplication.create(finalFormData);
        console.log('[BecomeMentor] *** MentorApplication.create() SUCCEEDED ***');
        console.log('[BecomeMentor] Created application with ID:', application?.id);

        if (!application || !application.id) {
          throw new Error('MentorApplication.create() returned invalid result - no ID found');
        }

      } catch (createError) {
        console.error('[BecomeMentor] *** MentorApplication.create() FAILED ***');
        console.error('[BecomeMentor] Create error details:', createError);
        console.error('[BecomeMentor] Error message:', createError.message);
        console.error('[BecomeMentor] Error stack:', createError.stack);

        let errorMessage = "שגיאה בשמירת הבקשה למסד הנתונים.";
        if (createError.message) {
          errorMessage += `\n\nפרטי השגיאה הטכנית:\n${createError.message}`;
        }
        if (createError.response?.data) {
          errorMessage += `\n\nתגובת השרת:\n${JSON.stringify(createError.response.data)}`;
        }

        setFormError(errorMessage);
        throw createError;
      }

      // 🆕 Send notification using createNotification with send_manager_email_alert
      try {
        console.log('[BecomeMentor] 📨 Sending notification to admin with email alert...');
        const { createNotification } = await import('@/api/functions');
        
        await createNotification({
          recipient_email: 'restart@rse50.co.il',
          title: `🌟 בקשה חדשה להצטרפות כמומחית: ${finalFormData.full_name}`,
          message: `${finalFormData.full_name} (${finalFormData.email}) הגישה בקשה להצטרפות כמומחית בתחום ${finalFormData.specialty}.
          
תחומי התמחות נוספים: ${finalFormData.focus_areas.length > 0 ? finalFormData.focus_areas.join(', ') : 'אין'}
טלפון: ${finalFormData.phone || 'לא צוין'}

לחצי לבדיקה ואישור בלוח הבקרה.`,
          type: 'system',
          action_url: createPageUrl('AdminDashboard'),
          priority: 'high',
          send_manager_email_alert: true
        });
        
        console.log('[BecomeMentor] ✅ Notification with email alert created successfully');
      } catch (notificationError) {
        console.error('[BecomeMentor] ❌ Failed to create notification:', notificationError);
      }

      try {
        console.log('[BecomeMentor] 📱 Sending WhatsApp message to admin...');
        const { sendWhatsappMessage } = await import('@/api/functions');
        await sendWhatsappMessage({
          title: `בקשת מומחית חדשה: ${finalFormData.full_name}`,
          message: `שם: ${finalFormData.full_name}
מייל: ${finalFormData.email}
תחום: ${finalFormData.specialty}
${finalFormData.focus_areas.length > 0 ? `תחומים נוספים: ${finalFormData.focus_areas.join(', ')}\n` : ''}
טלפון: ${finalFormData.phone || 'לא צוין'}

היכנסי ללוח הבקרה לאישור הבקשה.`
        });
        console.log('[BecomeMentor] ✅ WhatsApp message sent successfully');
      } catch (whatsappError) {
        console.error('[BecomeMentor] ❌ Failed to send WhatsApp message:', whatsappError);
      }

      console.log('[BecomeMentor] *** SUBMISSION COMPLETED SUCCESSFULLY ***');
      setIsSubmitted(true);
      setIsPreview(false);

    } catch (error) {
      console.error("[BecomeMentor] *** SUBMISSION FAILED ***:", error);

      let errorMessage = "אירעה שגיאה בשליחת הבקשה.";

      if (error.message && error.message.includes('401')) {
        errorMessage = "בעיה בהרשאות. אנא התחברי למערכת ונסי שוב.";
      } else if (error.message && error.message.includes('403')) {
        errorMessage = "אין הרשאה ליצור בקשה. אנא צרי קשר עם המנהלת.";
      } else if (error.message && error.message.includes('500')) {
        errorMessage = "שגיאת שרת. אנא נסי שוב בעוד כמה דקות.";
      } else if (error.response?.status === 401) {
        errorMessage = "בעיה בהרשאות. אנא התחברי למערכת ונסי שוב.";
      } else if (error.response?.status === 403) {
        errorMessage = "אין הרשאה ליצור בקשה. אנא צרי קשר עם המנהלת.";
      } else if (error.response?.status === 500) {
        errorMessage = "שגיאת שרת. אנא נסי שוב בעוד כמה דקות.";
      } else if (error.message) {
        errorMessage += `\n\nפרטי השגיאה:\n${error.message}`;
      }
      setFormError(errorMessage);

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSubmit(e);
    }
  };

  const handleLoginClick = async () => {
    setIsLoggingIn(true);
    try {
      await User.login(); // Assuming User.login() handles the redirect or reload
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoggingIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
        <p className="text-xl text-gray-700">טוען נתוני משתמש...</p>
      </div>
    );
  }

  // NEW: Check if user is not logged in - show login prompt
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
        <Card className="max-w-lg w-full text-center border-0 shadow-2xl">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-8 h-8 text-white"/>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">התחברות נדרשת</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              כדי להגיש בקשה להצטרפות כמומחית (מנטורית/מאמנת/יועצת) ב-ReStart 50+, 
              יש להתחבר למערכת תחילה.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              ההתחברות תיצור עבורך פרופיל בסיסי במערכת ותאפשר לנו לאשר את בקשתך בצורה מהירה ויעילה.
            </p>
            <Button 
              onClick={handleLoginClick}
              disabled={isLoggingIn}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  מתחבר...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5 ml-2" />
                  התחברות והמשך לבקשה
                </>
              )}
            </Button>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                ההתחברות מתבצעת באמצעות חשבון גוגל שלך ולא דורשת הרשמה נפרדת.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentUser && currentUser.is_approved_mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
        <Card className="max-w-lg w-full text-center border-0 shadow-2xl">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-8 h-8 text-white"/>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">את כבר מנטורית מאושרת!</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              מצוין! את כבר חלק מצוות המומחיות שלנו. 
              בואי נעבור ללוח הבקרה שלך או לעדכון הפרופיל הציבורי שלך.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                <Link to={createPageUrl("MentorDashboard")}>
                  <Crown className="w-5 h-5 ml-2" />
                  לוח הבקרה שלי
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to={createPageUrl("EditMentorProfile")}>
                  <Edit className="w-5 h-5 ml-2" />
                  עדכון פרופיל
                </Link>
              </Button>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                באהבה, צוות ReStart 50<span className="inline-block text-rose-500 font-bold text-xs relative -top-0.5">+</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full text-center border-0 shadow-2xl">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white"/>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">תודה על פנייתך!</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              קיבלנו את הפרטים שלך. אנחנו מעריכות מאוד את הרצון שלך לתרום ולהשפיע.
              הצוות שלנו יבחן את הפנייה ויחזור אלייך בהקדם.
            </p>
             <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  💌 מייל אישור בדרך אלייך! לפעמים הוא מסתתר בתיקיית "קידומי מכירות".
                  <br/>
                  נשמח אם תבדקי שם ותגררי אותנו לתיבה הראשית.
                </p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
                באהבה, צוות ReStart 50<span className="inline-block text-rose-500 font-bold text-xs relative -top-0.5">+</span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isPreview) {
      return <MentorPreview formData={formData} onEdit={() => setIsPreview(false)} onSubmit={handleSubmit} isSubmitting={isSubmitting} imagePreview={imagePreview} />;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
      <div className="max-w-3xl mx-auto">
        
        {/* Hero Header */}
        <div className="text-center mb-12">
          {/* Image Circle */}
          <div className="w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/e1e1eb21c_.jpg"
              alt="Mentor ReStart 50+"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold text-sm">✨ הצטרפי לצוות המומחיות שלנו</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            הצטרפי אלינו כ<span className="gradient-text">מומחית</span>
          </h1>
          <p className="text-lg text-gray-600">
            (מנטורית / מאמנת / יועצת)
          </p>
        </div>

        {/* Benefits Section */}
        <Card className="mb-8 bg-gradient-to-br from-white to-purple-50 shadow-xl border-purple-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Zap className="w-6 h-6 text-purple-600" />
              💡 למה להצטרף?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-white p-4 rounded-lg text-right">
                <Target className="w-5 h-5 text-rose-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">במה וחשיפה</p>
                  <p className="text-sm text-gray-600">לנשים בגיל 50+ שמחפשות ליווי אמיתי</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 bg-white p-4 rounded-lg text-right">
                <UserIcon className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">דף אישי משלך</p>
                  <p className="text-sm text-gray-600">פרופיל, מאמרים, פגישות ועוד</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 bg-white p-4 rounded-lg text-right">
                <Calendar className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">מערכת ניהול נוחה</p>
                  <p className="text-sm text-gray-600">תיאום פגישות קל ופשוט</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 bg-white p-4 rounded-lg text-right">
                <BookOpen className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">פרסום תכנים</p>
                  <p className="text-sm text-gray-600">מאמרים וקורסים משלך</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 bg-white p-4 rounded-lg text-right">
                <Users className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">קהילת מומחיות</p>
                  <p className="text-sm text-gray-600">נטוורקינג ותמיכה הדדית</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 bg-white p-4 rounded-lg text-right">
                <Award className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">מנוי פרימיום</p>
                  <p className="text-sm text-gray-600">כל ההטבות כלולות 🚀</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center p-4 bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg border-2 border-pink-300">
              <p className="font-bold text-pink-800 text-lg flex items-center justify-center gap-2">
                🎉 מיוחד לגרסת הבטא: ההצטרפות בחינם למייסדות הראשונות!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Commitment Notice */}
        <Card className="mb-8 bg-purple-50 border-2 border-purple-300">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-purple-900 flex items-center justify-center gap-2">
                <Heart className="w-6 h-6" />
                💜 האחריות שלך כמנטורית
              </h3>
            </div>
            <div className="space-y-3 text-purple-800 text-center max-w-2xl mx-auto">
              <p className="leading-relaxed">
                <span className="text-purple-600 font-bold">•</span> <strong>שיחת היכרות ראשונה חינמית</strong> (כ־30 דק׳)
              </p>
              <p className="leading-relaxed">
                <span className="text-purple-600 font-bold">•</span> שירותים נוספים בתשלום – בהסדר ישיר מול המנויות
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b">
            <CardTitle className="text-3xl font-bold text-center text-gray-900 flex items-center justify-center gap-2">
              <Briefcase className="w-7 h-7 text-rose-600" />
              📋 טופס הצטרפות
            </CardTitle>
            <CardDescription className="text-center pt-2 text-base">
              מלאי את הטופס בקפידה - זה יעזור לנו להכיר אותך טוב יותר
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleFormSubmit} className="space-y-8">
              
              {/* Step 1: Personal Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-rose-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <h3 className="text-xl font-bold text-gray-900">פרטים אישיים</h3>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700">תמונת פרופיל (אופציונלי)</Label>
                  <div
                    className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer overflow:hidden hover:border-rose-400 transition-colors"
                    onClick={() => imageInputRef.current.click()}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-gray-500">
                        <ImagePlus className="w-8 h-8 mx-auto mb-1" />
                        <span className="text-xs">העלי תמונה</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-sm font-medium">שם מלא <span className="text-red-500">*</span></Label>
                    <Input id="full_name" value={formData.full_name} onChange={handleInputChange} required placeholder="הזיני את השם המלא שלך" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      כתובת אימייל <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        disabled={!!currentUser} 
                        className={`bg-gray-50 text-gray-600 ${!!currentUser ? 'cursor-not-allowed' : ''}`}
                        required
                        placeholder="example@email.com"
                      />
                      {currentUser && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                    {currentUser && (
                      <p className="text-xs text-gray-500 mt-1">
                        🔒 המייל נלקח אוטומטית מהחשבון המחובר שלך
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">מספר טלפון</Label>
                  <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="050-1234567" />
                </div>
              </div>

              {/* Step 2: Expertise */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-purple-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <h3 className="text-xl font-bold text-gray-900">תחומי התמחות</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty" className="text-sm font-medium">תחום התמחות עיקרי <span className="text-red-500">*</span></Label>
                  <Select
                    onValueChange={(value) => setFormData(prev => ({ ...prev, specialty: value }))}
                    value={formData.specialty}
                    required
                  >
                    <SelectTrigger id="specialty">
                      <SelectValue placeholder="בחרי תחום התמחות..." />
                    </SelectTrigger>
                    <SelectContent>
                      {specialtyOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">תחומי התמחות נוספים (אופציונלי)</Label>
                  <Select
                    onValueChange={(value) => {
                      if (value && value !== formData.specialty && !formData.focus_areas.includes(value)) {
                        handleFocusAreasChange([...formData.focus_areas, value]);
                      }
                    }}
                    value=""
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="הוסיפי תחומי התמחות..." />
                    </SelectTrigger>
                    <SelectContent>
                      {specialtyOptions
                        .filter(opt => opt !== formData.specialty && !formData.focus_areas.includes(opt))
                        .map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.focus_areas.map((area, index) => (
                      <div key={index} className="flex items-center gap-1 bg-purple-100 text-purple-800 text-sm rounded-full px-3 py-1">
                        {area}
                        <button
                          type="button"
                          onClick={() => handleFocusAreasChange(formData.focus_areas.filter(a => a !== area))}
                          className="text-purple-600 hover:text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-full"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3: Experience & Recommendations */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <h3 className="text-xl font-bold text-gray-900">ניסיון והמלצות</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience_summary" className="text-sm font-medium">ספרי על הניסיון שלך <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="experience_summary" 
                    value={formData.experience_summary} 
                    onChange={handleInputChange} 
                    rows={4} 
                    required 
                    placeholder="תארי בקצרה את הניסיון המקצועי והאישי שלך הרלוונטי לליווי, אימון או ייעוץ" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="why_join" className="text-sm font-medium">למה תרצי להצטרף כמומחית ב-ReStart 50<span className="inline-block text-rose-500 font-bold text-xs relative -top-0.5">+</span>? <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="why_join" 
                    value={formData.why_join} 
                    onChange={handleInputChange} 
                    rows={3} 
                    required 
                    placeholder="מה מניע אותך? מה את מקווה לתרום?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_profile_url" className="text-sm font-medium">קישור לפרופיל לינקדאין (אופציונלי)</Label>
                  <Input 
                    id="linkedin_profile_url" 
                    value={formData.linkedin_profile_url} 
                    onChange={handleInputChange} 
                    placeholder="https://www.linkedin.com/in/yourprofile"
                  />
                </div>

                <div className="space-y-4 rounded-lg border-2 border-gray-200 bg-gray-50 p-6">
                  <div className="flex items-center gap-2">
                    <Quote className="w-5 h-5 text-rose-500" />
                    <Label className="text-lg font-semibold text-gray-800">המלצות (לפחות אחת) <span className="text-red-500">*</span></Label>
                  </div>
                  <p className="text-sm text-gray-600">
                    המלצות מלקוחות או קולגות מחזקות את האמינות שלך
                  </p>
                  
                  {formData.recommendations.map((rec, index) => (
                    <div key={index} className="space-y-2 rounded-md border bg-white p-4 pt-2 relative animate-fade-in">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRecommendation(index)}
                        className="absolute top-1 left-1 h-7 w-7"
                        aria-label="מחק המלצה"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                      <div className="space-y-1">
                        <Label htmlFor={`rec-author-${index}`} className="text-sm">שם הממליצ.ה <span className="text-red-500">*</span></Label>
                        <Input
                          id={`rec-author-${index}`}
                          value={rec.author}
                          onChange={(e) => handleRecommendationChange(index, 'author', e.target.value)}
                          placeholder="לדוגמה: ישראלה ישראלי"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`rec-text-${index}`} className="text-sm">תוכן ההמלצה <span className="text-red-500">*</span></Label>
                        <Textarea
                          id={`rec-text-${index}`}
                          value={rec.text}
                          onChange={(e) => handleRecommendationChange(index, 'text', e.target.value)}
                          rows={3}
                          placeholder="כתבי כאן את תוכן ההמלצה..."
                          required
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button type="button" variant="outline" onClick={addRecommendation} className="bg-white w-full">
                    <Plus className="w-4 h-4 ml-2" />
                    הוספת המלצה
                  </Button>
                </div>
              </div>

              {/* Important Notice */}
              <div className="pt-4">
                <Alert className="mb-6 bg-amber-50 border-2 border-amber-200">
                  <div className="text-center">
                    <AlertTitle className="flex items-center justify-center gap-2 text-amber-900 font-bold text-lg mb-3">
                      <AlertCircle className="w-5 h-5" />
                      ⚖️ חשוב לדעת
                    </AlertTitle>
                    <AlertDescription>
                      <div className="text-amber-800 space-y-2 text-center max-w-2xl mx-auto">
                        <p className="leading-relaxed">
                          <span className="text-amber-600 font-bold">•</span> המידע שתזיני יוצג למנויות הפלטפורמה
                        </p>
                        <p className="leading-relaxed">
                          <span className="text-amber-600 font-bold">•</span> הצוות שלנו יבדוק את הפרטים לפני אישור
                        </p>
                        <p className="leading-relaxed">
                          <span className="text-amber-600 font-bold">•</span> השימוש בפלטפורמה מהווה הסכמה לתקנון ולמדיניות הפרטיות
                        </p>
                      </div>
                    </AlertDescription>
                  </div>
                </Alert>

                <div className="flex items-start space-x-2 space-x-reverse bg-white p-4 rounded-lg border-2 border-gray-200">
                  <Checkbox id="terms" checked={hasAgreed} onCheckedChange={setHasAgreed} className="mt-1" />
                  <Label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                    ☑️ אני מאשרת שקראתי את 
                    <Link to={createPageUrl("Privacy")} target="_blank" className="text-purple-600 hover:underline font-semibold px-1">
                      מדיניות הפרטיות
                    </Link>
                    ואת 
                    <Link to={createPageUrl("TermsOfService")} target="_blank" className="text-purple-600 hover:underline font-semibold px-1">
                      תקנון השימוש
                    </Link>
                    , ומסכימה לתנאיהם. אני מצהירה כי כל המידע שמסרתי הוא אמיתי, מדויק ומלא. <span className="text-red-500">*</span>
                  </Label>
                </div>
              </div>

              {/* Error Display */}
              {formError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>שגיאה בטופס</AlertTitle>
                  <AlertDescription className="whitespace-pre-wrap">{formError}</AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (validateForm()) {
                      setIsPreview(true);
                    }
                  }}
                  className="w-full sm:w-auto rounded-full py-6 text-lg px-8 border-2 border-purple-300 hover:bg-purple-50"
                >
                  <Sparkles className="w-5 h-5 ml-2" />
                  תצוגה מקדימה
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-pink-600 text-white text-lg py-6 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                      שולחת...
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 ml-2" />
                      שליחת פנייה ✅
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
