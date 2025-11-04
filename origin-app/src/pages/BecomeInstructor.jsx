
import React, { useState, useRef, useEffect } from 'react';
import { CourseProposal } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Mic, Sparkles, ImagePlus, Crown, Loader2, Lock } from 'lucide-react';
import { createNotification } from '@/api/functions';
import { createPageUrl } from '@/utils';
import { User } from '@/api/entities';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { isUserAdmin, hasValidSubscription } from '../components/auth/UserContext';

// InstructorPreview Component for displaying review details
const InstructorPreview = ({ formData, onEdit, onSubmit, isSubmitting, imagePreview }) => {
    const getActivityTypeLabel = () => {
        switch(formData.activity_type) {
            case 'קורס': return 'קורס';
            case 'סדנא': return 'סדנא';
            case 'טיול': return 'טיול';
            default: return 'פעילות';
        }
    };

    return (
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">
                    אישור פרטי ה{getActivityTypeLabel()}
                </CardTitle>
                <CardDescription className="text-gray-600">
                    אנא וודאי שכל הפרטים נכונים לפני השליחה הסופית.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6 text-right">
                    {imagePreview && (
                        <div className="flex justify-center mb-4">
                            <img src={imagePreview} alt={formData.instructor_name} className="w-32 h-32 rounded-full object-cover border-4 border-purple-300 shadow-md" />
                        </div>
                    )}
                    <h3 className="text-lg font-semibold text-gray-800">פרטים אישיים</h3>
                    <p className="text-gray-700"><span className="font-medium">שם מלא:</span> {formData.instructor_name}</p>
                    <p className="text-gray-700"><span className="font-medium">אימייל:</span> {formData.email}</p>
                    <p className="text-gray-700"><span className="font-medium">טלפון:</span> {formData.phone || 'לא צוין'}</p>

                    <h3 className="text-lg font-semibold text-gray-800 mt-6">פרטי ה{getActivityTypeLabel()}</h3>
                    <p className="text-gray-700"><span className="font-medium">סוג:</span> {formData.activity_type}</p>
                    <p className="text-gray-700"><span className="font-medium">שם:</span> {formData.course_title}</p>
                    <p className="text-gray-700"><span className="font-medium">תיאור:</span> {formData.course_description}</p>
                    <p className="text-gray-700"><span className="font-medium">קהל יעד:</span> {formData.target_audience || 'לא צוין'}</p>
                    <p className="text-gray-700"><span className="font-medium">פורמט:</span> {
                        formData.course_format === 'online' ? 'אונליין' :
                        formData.course_format === 'frontal' ? 'פרונטלי' :
                        'משולב'
                    }</p>
                    <p className="text-gray-700"><span className="font-medium">מחיר:</span> {formData.price} ש"ח</p>
                    <p className="text-gray-700"><span className="font-medium">משך:</span> {formData.duration || 'לא צוין'}</p>
                    <p className="text-gray-700"><span className="font-medium">קטגוריה:</span> {formData.category}</p>
                    <p className="text-gray-700"><span className="font-medium">רמה:</span> {formData.level}</p>
                    <p className="text-gray-700"><span className="font-medium">תאריך התחלה:</span> {formData.start_date || 'לא צוין'}</p>
                    
                    {formData.activity_type === 'טיול' && formData.end_date && (
                        <p className="text-gray-700"><span className="font-medium">תאריך סיום:</span> {formData.end_date}</p>
                    )}
                    {formData.activity_type === 'טיול' && formData.meeting_point && (
                        <p className="text-gray-700"><span className="font-medium">נקודת מפגש:</span> {formData.meeting_point}</p>
                    )}
                    {(formData.activity_type === 'טיול' || formData.activity_type === 'סדנא') && formData.equipment_needed && (
                        <p className="text-gray-700"><span className="font-medium">ציוד נדרש:</span> {formData.equipment_needed}</p>
                    )}
                    {formData.max_participants && (
                        <p className="text-gray-700"><span className="font-medium">מספר משתתפות מקסימלי:</span> {formData.max_participants}</p>
                    )}
                    {formData.link_to_materials && (
                        <p className="text-gray-700"><span className="font-medium">קישור לחומרים:</span> <a href={formData.link_to_materials} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{formData.link_to_materials}</a></p>
                    )}
                </div>

                <div className="pt-8 flex justify-between gap-4">
                    <Button 
                        type="button" 
                        onClick={onEdit} 
                        className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 py-3 rounded-full"
                    >
                        חזרה לעריכה
                    </Button>
                    <Button 
                        type="button" 
                        onClick={onSubmit} 
                        disabled={isSubmitting} 
                        className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-lg py-3 rounded-full"
                    >
                        {isSubmitting ? 'שולחת הצעה...' : 'שלחי הצעה סופית'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default function BecomeInstructor() {
  const [formData, setFormData] = useState({
    activity_type: 'קורס',
    instructor_name: '',
    email: '',
    phone: '',
    course_title: '',
    course_description: '',
    target_audience: '',
    course_format: 'online',
    price: '',
    duration: '',
    category: 'קריירה',
    level: 'לכולן',
    start_date: '',
    end_date: '',
    meeting_point: '',
    equipment_needed: '',
    max_participants: '',
    link_to_materials: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [instructorImageFile, setInstructorImageFile] = useState(null);
  const [instructorImagePreview, setInstructorImagePreview] = useState(null);
  const imageInputRef = useRef(null);
  const [isPreview, setIsPreview] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
            instructor_name: user.full_name || prev.instructor_name
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

  const handleFinalSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log('[BecomeInstructor] *** STARTING SUBMISSION PROCESS ***');

      let instructorImageUrl = instructorImagePreview;
      if (instructorImageFile) {
        try {
          console.log('[BecomeInstructor] Starting image upload...');
          const uploadResult = await UploadFile({ file: instructorImageFile });
          instructorImageUrl = uploadResult.file_url;
          console.log('[BecomeInstructor] Image uploaded successfully:', instructorImageUrl);
        } catch (uploadError) {
          console.error('[BecomeInstructor] Image upload failed:', uploadError);
        }
      }

      const price = parseFloat(formData.price) || 0;

      const proposalData = {
        ...formData,
        price: price,
        status: 'pending',
        instructor_image_url: instructorImageUrl
      };
      
      await CourseProposal.create(proposalData);
      
      const isApprovedMentor = currentUser?.is_approved_mentor === true;
      
      if (!isApprovedMentor) {
        console.log('[BecomeInstructor] User is not approved mentor - sending instructions email...');
        
        try {
          const { SendEmail } = await import('@/api/integrations');
          const activityTypeText = formData.activity_type === 'קורס' ? 'קורס' : formData.activity_type === 'סדנא' ? 'סדנא' : 'טיול';
          
          await SendEmail({
            to: formData.email,
            subject: `🎉 תודה על ההצטרפות! עוד צעד אחד קטן...`,
            body: `
              <div dir="rtl" style="font-family: Arial, sans-serif; text-align: right; line-height: 1.6; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #9333ea;">שלום ${formData.instructor_name},</h2>
                
                <p style="font-size: 16px;">תודה רבה שהצטרפת להגשת פעילויות ב-ReStart 50+! 🎊</p>
                
                <p style="font-size: 16px;">קיבלנו את ההצעה שלך ל${activityTypeText}: <strong>"${formData.course_title}"</strong></p>
                
                <div style="background: #fef3c7; padding: 20px; border-right: 4px solid #f59e0b; margin: 20px 0;">
                  <p style="margin: 0; font-size: 16px; font-weight: bold; color: #92400e;">📋 צעד חשוב נוסף:</p>
                  <p style="margin: 10px 0 0 0; font-size: 15px; color: #78350f;">
                    כדי שנוכל לאשר את ה${activityTypeText} שלך ולפרסם אותו, נצטרך קודם להכיר אותך טוב יותר. 
                    נא מלאי את טופס ההרשמה כמנטורית/מומחית - זה יעזור לנו להציג אותך בצורה הטובה ביותר לקהילה שלנו.
                  </p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${createPageUrl('BecomeMentor')}" 
                     style="background: linear-gradient(135deg, #9333ea, #a855f7); 
                            color: white; 
                            padding: 15px 30px; 
                            text-decoration: none; 
                            border-radius: 25px; 
                            font-size: 16px;
                            font-weight: bold;
                            display: inline-block;">
                    למילוי טופס המנטורית 👉
                  </a>
                </div>
                
                <p style="font-size: 14px; color: #666;">
                  לאחר שנאשר אותך כמנטורית, נעבור גם על הצעת ה${activityTypeText} שלך ונעדכן אותך בהקדם.
                </p>
                
                <p style="font-size: 16px; margin-top: 30px;">
                  מצפות לראות אותך בקהילה! 💜<br/>
                  <strong>צוות ReStart 50+</strong>
                </p>
                
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #999;">
                  המייל הזה נשלח אוטומטית מאתר ReStart 50+
                </p>
              </div>
            `
          });
          console.log('[BecomeInstructor] Instructions email sent successfully');
        } catch (emailError) {
          console.error('[BecomeInstructor] Failed to send instructions email:', emailError);
        }
        
        setIsSubmitted(true);
        setIsPreview(false);
        
      } else {
        console.log('[BecomeInstructor] User is approved mentor - sending admin notifications...');
        
        const activityTypeText = formData.activity_type === 'קורס' ? 'קורס' : formData.activity_type === 'סדנא' ? 'סדנא' : 'טיול';
        
        await createNotification({
            recipient_email: 'restart@rse50.co.il',
            title: `הצעת ${activityTypeText} חדש: ${formData.course_title}`,
            message: `התקבלה הצעה חדשה ל${activityTypeText} מפי ${formData.instructor_name}. לחצי לצפייה בפרטים.`,
            type: 'system',
            action_url: createPageUrl('AdminDashboard')
        });

        try {
          console.log('[BecomeInstructor] Sending email to admin...');
          const { SendEmail } = await import('@/api/integrations');
          await SendEmail({
            to: 'restart@rse50.co.il',
            subject: `הצעת ${activityTypeText} חדש: ${formData.course_title}`,
            body: `
              <div dir="rtl" style="font-family: Arial, sans-serif; text-align: right; line-height: 1.6;">
                <h2>הצעת ${activityTypeText} חדש</h2>
                <p><strong>מרצה/מנחה:</strong> ${formData.instructor_name}</p>
                <p><strong>מייל:</strong> ${formData.email}</p>
                <p><strong>סוג:</strong> ${formData.activity_type}</p>
                <p><strong>שם:</strong> ${formData.course_title}</p>
                <p><strong>קטגוריה:</strong> ${formData.category}</p>
                <p><strong>מחיר:</strong> ${formData.price} ש"ח</p>
                <p><strong>תיאור:</strong></p>
                <p>${formData.course_description}</p>
                <p><a href="${createPageUrl('AdminDashboard')}" style="background: #9333ea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">לאישור הפעילות - לוח הבקרה</a></p>
              </div>
            `
          });
          console.log('[BecomeInstructor] Email sent successfully');
        } catch (emailError) {
          console.error('[BecomeInstructor] Failed to send email:', emailError);
        }

        try {
          console.log('[BecomeInstructor] Sending WhatsApp message to admin...');
          const { sendWhatsappMessage } = await import('@/api/functions');
          await sendWhatsappMessage({
            title: `הצעת ${activityTypeText} חדש: ${formData.course_title}`,
            message: `מרצה/מנחה: ${formData.instructor_name}
מייל: ${formData.email}
סוג: ${formData.activity_type}
שם: ${formData.course_title}
קטגוריה: ${formData.category}
מחיר: ${formData.price} ש"ח

היכנסי ללוח הבקרה לאישור הפעילות: ${createPageUrl('AdminDashboard')}`
          });
          console.log('[BecomeInstructor] WhatsApp message sent successfully');
        } catch (whatsappError) {
          console.error('[BecomeInstructor] Failed to send WhatsApp message:', whatsappError);
        }
        
        setIsSubmitted(true);
        setIsPreview(false);
      }
      
    } catch (error) {
      console.error("[BecomeInstructor] Error submitting proposal:", error);
      alert("אירעה שגיאה בשליחת ההצעה. אנא ודאי שכל השדות מלאים כראוי ונסה שוב.");
    }
    setIsSubmitting(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsPreview(true);
  };

  const handleEdit = () => {
    setIsPreview(false);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setInstructorImageFile(file);
      setInstructorImagePreview(URL.createObjectURL(file));
    }
  };

  const getActivityTypeLabel = () => {
    switch(formData.activity_type) {
        case 'קורס': return 'קורס';
        case 'סדנא': return 'סדנא';
        case 'טיול': return 'טיול';
        default: return 'פעילות';
    }
  };

  const handleLoginClick = async () => {
    setIsLoggingIn(true);
    try {
      await User.login();
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoggingIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <p className="text-xl text-gray-700">טוען נתוני משתמש...</p>
      </div>
    );
  }

  // Check if user is not logged in - show login prompt
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <Card className="max-w-lg w-full text-center border-0 shadow-2xl">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mic className="w-8 h-8 text-white"/>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">התחברות נדרשת</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              כדי להציע קורס, סדנא או טיול ב-ReStart 50+, 
              יש להתחבר למערכת תחילה.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              ההתחברות תיצור עבורך פרופיל בסיסי במערכת ותאפשר לנו לאשר את ההצעה שלך בצורה מהירה ויעילה.
            </p>
            <Button 
              onClick={handleLoginClick}
              disabled={isLoggingIn}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  מתחבר...
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 ml-2" />
                  התחברות והמשך להצעה
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

  // NEW: Check if user is logged in but not subscribed (and not an approved mentor or admin)
  const isAdmin = isUserAdmin(currentUser);
  const hasSubscription = hasValidSubscription(currentUser);
  const isApprovedMentor = currentUser.is_approved_mentor === true;

  if (!isAdmin && !hasSubscription && !isApprovedMentor) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <Card className="max-w-lg w-full text-center border-0 shadow-2xl">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-white"/>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">מנוי נדרש</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              כדי להציע קורסים, סדנאות או טיולים ב-ReStart 50+, 
              יש להיות מנויה פעילה בפלטפורמה.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              המנוי מאפשר לך לא רק להציע פעילויות, אלא גם ליהנות מכל השירותים והתכנים שהפלטפורמה מציעה.
            </p>
            <div className="space-y-3">
              <Button 
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
              >
                <Link to={createPageUrl("Subscribe")}>
                  <Crown className="w-5 h-5 ml-2" />
                  הצטרפי כמנויה עכשיו
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Link to={createPageUrl("Home")}>
                  חזרה לדף הבית
                </Link>
              </Button>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                💡 <strong>טיפ:</strong> המנוי החודשי עולה רק 55₪ ומעניק גישה מלאה לכל שירותי הפלטפורמה.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    const needsMentorRegistration = !currentUser?.is_approved_mentor;
    const activityTypeText = formData.activity_type === 'קורס' ? 'קורס' : formData.activity_type === 'סדנא' ? 'סדנא' : 'טיול';
    
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full text-center border-0 shadow-2xl">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            
            {needsMentorRegistration ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">תודה רבה! ההצעה שלך נקלטה 💖</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  קיבלנו את הפרטים ואנחנו מתרגשות לבדוק את ה{activityTypeText} שלך.
                </p>
                
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm font-semibold text-yellow-800 mb-2">📋 צעד חשוב נוסף:</p>
                  <p className="text-sm text-yellow-700 mb-4">
                    כדי שנוכל לאשר את ה{activityTypeText} שלך, נצטרך להכיר אותך טוב יותר. 
                    שלחנו לך מייל עם קישור למילוי טופס המנטורית.
                  </p>
                  <Link to={createPageUrl('BecomeMentor')}>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500">
                      <Mic className="w-4 h-4 ml-2" />
                      מלאי טופס מנטורית עכשיו
                    </Button>
                  </Link>
                </div>
                
                <p className="text-sm text-gray-500">
                  💌 בדקי את תיבת המייל שלך (גם בקידומי מכירות) למידע נוסף.
                </p>
              </>
            ) : (
              <>
                <h2 className="2xl font-bold text-gray-900 mb-4">תודה רבה! ההצעה שלך נשלחה 💖</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  קיבלנו את הפרטים ואנחנו מתרגשות לבדוק את ה{activityTypeText} שלך.
                  צוות התוכן שלנו יעבור על ההצעה ויחזור אלייך תוך מספר ימי עסקים.
                </p>
                <p className="text-sm text-gray-500">
                  אנחנו כבר לא יכולות לחכות לשיתוף הפעולה!
                </p>
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      💌 מייל אישור בדרך אלייך! לפעמים הוא מסתתר בתיקיית "קידומי מכירות".
                      <br/>
                      נשמח אם תבדקי שם ותגררי אותנו לתיבה הראשית.
                    </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isPreview) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <div className="max-w-3xl mx-auto">
          <InstructorPreview 
            formData={formData} 
            onEdit={handleEdit} 
            onSubmit={handleFinalSubmit} 
            isSubmitting={isSubmitting} 
            imagePreview={instructorImagePreview}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/2efd3b5fb_451.jpg" 
                alt="מרצה במעמד" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
              <Mic className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
           <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 mb-6">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">הציעי קורס, סדנא או טיול</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            שתפי את הידע שלך עם <span className="gradient-text">קהילת ReStart 50+</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            הציעי קורס, סדנה או טיול – ואנחנו נדאג לקהל הנשים שמחכה ללמוד ממך
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              ספרי לנו על הפעילות המיוחדת שלך
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              מלאי את הפרטים הבאים ואנחנו נדאג לשאר
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* סוג פעילות */}
              <div className="space-y-2 bg-purple-50 p-4 rounded-lg">
                <Label className="text-lg font-semibold">מה את מציעה?</Label>
                <Select onValueChange={(value) => setFormData(prev => ({...prev, activity_type: value}))} value={formData.activity_type}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחרי סוג פעילות" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="קורס">📚 קורס (למידה לאורך תקופה)</SelectItem>
                    <SelectItem value="סדנא">🎨 סדנא (מפגש אחד או כמה מפגשים)</SelectItem>
                    <SelectItem value="טיול">🌄 טיול (חוויה חברתית משותפת)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* מידע אישי */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">1</span>
                  קצת עלייך
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instructor_name">שם מלא</Label>
                    <Input 
                      id="instructor_name" 
                      value={formData.instructor_name} 
                      onChange={handleInputChange} 
                      required 
                      disabled={!!currentUser}
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">אימייל</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      disabled={!!currentUser} 
                      className="bg-gray-50"
                      required
                    />
                    {currentUser && (
                      <p className="text-xs text-gray-500">
                        ✓ נלקח אוטומטית מהחשבון שלך
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">טלפון ליצירת קשר</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange}
                      placeholder="050-1234567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>תמונה ראשית לפעילות (אופציונלי)</Label>
                    <div
                      className="w-full h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      onClick={() => imageInputRef.current.click()}
                    >
                      {instructorImagePreview ? (
                        <img src={instructorImagePreview} alt="תצוגה מקדימה" className="h-full w-auto object-contain rounded-lg" />
                      ) : (
                        <div className="text-center text-gray-500">
                          <ImagePlus className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-sm">לחצי להעלאה</span>
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
                </div>
              </div>
              
              {/* פרטי הפעילות */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">2</span>
                  פרטי ה{getActivityTypeLabel()}
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="course_title">שם ה{getActivityTypeLabel()}</Label>
                  <Input 
                    id="course_title" 
                    value={formData.course_title} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="לדוגמה: קורס Excel למתחילות | סדנת צילום בטבע | טיול בכרמל"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="course_description">תארי את הפעילות</Label>
                  <Textarea 
                    id="course_description" 
                    value={formData.course_description} 
                    onChange={handleInputChange} 
                    rows={4} 
                    required 
                    placeholder="מה תלמדו או תחוו? מה יהיה מיוחד בפעילות? (לדוגמה: נלמד איך לבנות תקציב אישי בצורה פשוטה ומעשית)"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>קטגוריה</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({...prev, category: value}))} value={formData.category}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="קריירה">💼 קריירה</SelectItem>
                        <SelectItem value="טכנולוגיה">💻 טכנולוגיה</SelectItem>
                        <SelectItem value="חברתי">👥 חברתי</SelectItem>
                        <SelectItem value="אישי">✨ אישי</SelectItem>
                        <SelectItem value="טיולים ונופש">🌍 טיולים ונופש</SelectItem>
                        <SelectItem value="יזמות ועסקים">🚀 יזמות ועסקים</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>רמת הפעילות</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({...prev, level: value}))} value={formData.level}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="מתחילות">מתחילות</SelectItem>
                        <SelectItem value="מתקדמות">מתקדמות</SelectItem>
                        <SelectItem value="לכולן">לכולן</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">מחיר (₪)</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      min="0" 
                      step="10"
                      value={formData.price} 
                      onChange={handleInputChange} 
                      placeholder="0 = חינם"
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">משך</Label>
                    <Input 
                      id="duration" 
                      value={formData.duration} 
                      onChange={handleInputChange} 
                      placeholder="8 שבועות / יום אחד"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max_participants">מקסימום משתתפות</Label>
                    <Input 
                      id="max_participants" 
                      type="number"
                      min="1"
                      value={formData.max_participants} 
                      onChange={handleInputChange} 
                      placeholder="15"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target_audience">קהל יעד</Label>
                    <Input 
                      id="target_audience" 
                      value={formData.target_audience} 
                      onChange={handleInputChange} 
                      placeholder="נשים מעל 50 שרוצות..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>פורמט הפעילות</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({...prev, course_format: value}))} value={formData.course_format}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">🌐 אונליין</SelectItem>
                        <SelectItem value="frontal">🏢 פרונטלי</SelectItem>
                        <SelectItem value="hybrid">🔄 משולב</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">תאריך התחלה משוער</Label>
                    <Input 
                      id="start_date" 
                      type="date" 
                      value={formData.start_date} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  {formData.activity_type === 'טיול' && (
                    <div className="space-y-2">
                      <Label htmlFor="end_date">תאריך סיום (לטיול של יותר מיום)</Label>
                      <Input 
                        id="end_date" 
                        type="date" 
                        value={formData.end_date} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  )}
                </div>

                {/* שדות ספציפיים לטיול */}
                {formData.activity_type === 'טיול' && (
                  <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                    <h4 className="font-semibold text-blue-900">פרטים נוספים לטיול</h4>
                    <div className="space-y-2">
                      <Label htmlFor="meeting_point">נקודת מפגש</Label>
                      <Input 
                        id="meeting_point" 
                        value={formData.meeting_point} 
                        onChange={handleInputChange} 
                        placeholder="לדוגמה: חניון תחנה מרכזית, ירושלים"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="equipment_needed">ציוד נדרש</Label>
                      <Textarea 
                        id="equipment_needed" 
                        value={formData.equipment_needed} 
                        onChange={handleInputChange} 
                        rows={2}
                        placeholder="נעלי הליכה, כובע, מים..."
                      />
                    </div>
                  </div>
                )}

                {/* שדות ספציפיים לסדנא */}
                {formData.activity_type === 'סדנא' && (
                  <div className="bg-amber-50 p-4 rounded-lg space-y-4">
                    <h4 className="font-semibold text-amber-900">פרטים נוספים לסדנא</h4>
                    <div className="space-y-2">
                      <Label htmlFor="equipment_needed">חומרים/ציוד נדרש</Label>
                      <Textarea 
                        id="equipment_needed" 
                        value={formData.equipment_needed} 
                        onChange={handleInputChange} 
                        rows={2}
                        placeholder="מחברת, עפרונות, מחשב נייד..."
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="link_to_materials">קישור לחומרים או מצגת (אופציונלי)</Label>
                  <Input 
                    id="link_to_materials" 
                    value={formData.link_to_materials} 
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* הסכמה ושליחה */}
              <div className="pt-6 border-t">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800 leading-relaxed">
                    <strong>💡 שימי לב:</strong> לאחר שליחת הטופס, ההצעה שלך תשלח לבדיקת צוות האתר. 
                    הפעילות תפורסם בעמוד "קורסים, סדנאות וטיולים" לאחר אישור והתאמה לקהל.
                  </p>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse mb-4">
                    <Checkbox id="terms" checked={hasAgreed} onCheckedChange={setHasAgreed} />
                    <Label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                      אני מאשרת שקראתי את 
                      <Link to={createPageUrl("Privacy")} target="_blank" className="text-purple-600 hover:underline font-medium px-1">
                        מדיניות הפרטיות
                      </Link>
                      ואת 
                      <Link to={createPageUrl("TermsOfService")} target="_blank" className="text-purple-600 hover:underline font-medium px-1">
                        תקנון השימוש
                      </Link>
                      ומסכימה לתנאיהם
                    </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-lg py-6 rounded-full shadow-lg"
                  disabled={!hasAgreed}
                >
                  <Sparkles className="w-5 h-5 ml-2" />
                  סקירה ושליחת ההצעה
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
