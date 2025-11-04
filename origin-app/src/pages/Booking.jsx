
import React, { useState, useEffect } from 'react';
import { useUser } from '../components/auth/UserContext';
import { Appointment } from '@/api/entities';
import { UserProfile } from '@/api/entities';
import { MentorProfile } from '@/api/entities';
import { createNotification } from '@/api/functions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Calendar, Phone, Send, AlertTriangle, Sparkles } from 'lucide-react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { createPageUrl } from '@/utils';
import { syncUserProfile } from '@/api/functions';
import { SendEmail } from '@/api/integrations';

export default function Booking() {
    const { currentUser, isSubscribed, isLoadingUser } = useUser();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const mentorProfileId = searchParams.get('mentorId');
    const mentorName = searchParams.get('mentorName');
    const mentorEmail = searchParams.get('mentorEmail');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        user_name: '',
        user_phone: '',
        user_message: '',
        preferred_meeting_type: 'לא משנה'
    });

    const [mentorProfile, setMentorProfile] = useState(null);
    const [userProfile, setUserProfile] = useState(null);

    console.log('[Booking.js] Booking component mounted with params:', {
        mentorProfileId, mentorName, mentorEmail
    });

    // Load mentor profile and user profile
    useEffect(() => {
        const loadProfiles = async () => {
            if (!currentUser || !mentorProfileId) return;

            console.log('[Booking.js] Loading profiles...');
            setIsLoading(true);

            try {
                // Load mentor profile
                console.log('[Booking.js] Loading mentor profile:', mentorProfileId);
                const mentor = await MentorProfile.get(mentorProfileId);
                if (!mentor) {
                    throw new Error('המנטורית לא נמצאה');
                }
                setMentorProfile(mentor);
                console.log('[Booking.js] ✅ Mentor profile loaded');

                // Sync/load user profile
                console.log('[Booking.js] Syncing user profile for:', currentUser.email);
                const { data: syncResult, error: syncError } = await syncUserProfile({});
                console.log('[Booking.js] syncResult received:', syncResult);

                if (syncError || !syncResult?.success) {
                    throw new Error(syncError?.message || syncResult?.error || 'שגיאה בסנכרון פרופיל משתמש');
                }

                const userProf = syncResult.profile;
                if (!userProf) {
                    throw new Error('לא ניתן היה לסנכרן או לטעון את פרופיל המשתמש');
                }
                setUserProfile(userProf);
                console.log('[Booking.js] ✅ User profile synced');

                // Pre-fill form with user data
                setFormData(prev => ({
                    ...prev,
                    user_name: userProf.full_name || currentUser.full_name || '',
                    user_phone: userProf.phone_number || '',
                    user_message: ''
                }));

            } catch (err) {
                console.error('[Booking.js] Error loading profiles:', err);
                setError(err.message || 'שגיאה בטעינת הנתונים');
                toast({
                    title: "שגיאה בטעינת פרופילים",
                    description: err.message,
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (!isLoadingUser) {
            loadProfiles();
        }
    }, [currentUser, mentorProfileId, isLoadingUser, toast]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setError(null);

        try {
            if (!userProfile || !mentorProfile) {
                throw new Error('נתוני המשתמש או המנטורית חסרים');
            }

            console.log('[Booking.js] Creating appointment request with:', {
                mentor_profile_id: mentorProfile.id,
                user_profile_id: userProfile.id,
                mentor_email: mentorProfile.contact_email,
                user_email: currentUser.email,
                ...formData
            });

            const appointmentData = {
                mentor_profile_id: mentorProfile.id,
                mentor_name: mentorProfile.mentor_name,
                mentor_email: mentorProfile.contact_email,
                user_profile_id: userProfile.id,
                user_email: currentUser.email,
                user_name: formData.user_name,
                user_phone: formData.user_phone,
                user_message: formData.user_message,
                preferred_meeting_type: formData.preferred_meeting_type,
                status: 'pending_approval',
                type: 'intro_call'
            };

            const appointment = await Appointment.create(appointmentData);
            console.log('[Booking.js] ✅ Appointment request created successfully:', appointment);

            // Send notification to mentor
            try {
                console.log('[Booking.js] 📨 Sending notification to mentor...');
                await createNotification({
                    recipient_email: mentorProfile.contact_email,
                    title: `בקשה חדשה לפגישת היכרות מ-${formData.user_name}`,
                    message: `${formData.user_name} מעוניינת בפגישת היכרות איתך. כנסי ללוח הבקרה שלך לצפייה בפרטים ואישור הפגישה.`,
                    type: 'appointment',
                    action_url: `https://rse50.co.il${createPageUrl('ApproveBooking')}?id=${appointment.id}`,
                    sender_name: formData.user_name,
                    priority: 'high'
                });
                console.log('[Booking.js] ✅ Notification sent to mentor');
            } catch (notificationError) {
                console.error('[Booking.js] ❌ Failed to send notification to mentor:', notificationError);
                // NEW: Send WhatsApp notification to admin about mentor internal notification failure
                try {
                    const { sendWhatsappMessage } = await import('@/api/functions');
                    await sendWhatsappMessage({
                        title: `⚠️ כשל בשליחת התראה פנימית למנטורית`,
                        message: `בקשת פגישה נוצרה בהצלחה עבור ${formData.user_name} אצל ${mentorProfile?.mentor_name}, אך נכשל בשליחת התראה פנימית למנטורית.
שגיאה: ${notificationError.message || 'שגיאה לא ידועה'}`
                    });
                    console.log('[Booking.js] ✅ WhatsApp sent to admin for mentor internal notification failure');
                } catch (whatsappAdminError) {
                    console.error('[Booking.js] ❌ Failed to send WhatsApp for mentor internal notification failure:', whatsappAdminError);
                }
            }

            // Send SIMPLIFIED email to mentor (avoid spam filters)
            try {
                console.log('[Booking.js] 📧 Preparing simplified email to mentor:', mentorProfile.contact_email);
                
                const meetingTypeText = formData.preferred_meeting_type === 'לא משנה' 
                    ? 'לא משנה לה' 
                    : `מעדיפה ${formData.preferred_meeting_type}`;
                
                // SIMPLIFIED HTML - NO complex gradients or suspicious links
                const simpleEmailContent = `
                    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #ec4899; text-align: center;">ReStart 50+</h2>
                        <h3 style="color: #333;">שלום ${mentorProfile.mentor_name}!</h3>
                        <p style="font-size: 16px; color: #333;">
                            <strong>${formData.user_name}</strong> ביקשה פגישת היכרות איתך!
                        </p>
                        
                        <div style="background-color: #f9fafb; padding: 15px; margin: 20px 0; border-right: 4px solid #ec4899;">
                            <p style="margin: 5px 0;"><strong>שם:</strong> ${formData.user_name}</p>
                            <p style="margin: 5px 0;"><strong>טלפון:</strong> ${formData.user_phone}</p>
                            <p style="margin: 5px 0;"><strong>העדפה לסוג פגישה:</strong> ${meetingTypeText}</p>
                        </div>
                        
                        <div style="background-color: #fff3cd; padding: 15px; margin: 20px 0;">
                            <p style="margin: 0; color: #856404;"><strong>הודעה מהמבקשת:</strong></p>
                            <p style="margin: 10px 0 0 0; color: #333;">${formData.user_message}</p>
                        </div>
                        
                        <div style="background-color: #e0f2fe; padding: 15px; margin: 20px 0;">
                            <p style="margin: 0; color: #0369a1;">
                                <strong>שלב הבא:</strong> אנא צרי קשר עם ${formData.user_name} בטלפון ${formData.user_phone} לתיאום מועד מדויק לפגישה.
                            </p>
                        </div>
                        
                        <p style="margin-top: 20px;">כנסי לאתר ReStart 50+ כדי לאשר את הפגישה ולנהל את לוח הפגישות שלך.</p>
                        
                        <p style="margin-top: 30px; color: #666;">בברכה,<br><strong>צוות ReStart 50+</strong></p>
                        
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                        <p style="font-size: 12px; color: #999; text-align: center;">זוהי הודעה אוטומטית מ-ReStart 50+</p>
                    </div>
                `;

                console.log('[Booking.js] 📧 Calling SendEmail for mentor...');
                const emailResult = await SendEmail({
                    to: mentorProfile.contact_email,
                    subject: `בקשת פגישה חדשה מ-${formData.user_name} ב-ReStart 50+`,
                    body: simpleEmailContent
                });
                
                console.log('[Booking.js] ✅ Email sent to mentor successfully, result:', emailResult);
            } catch (mentorEmailError) {
                console.error('[Booking.js] ❌ Failed to send email to mentor');
                console.error('[Booking.js] 🔍 Mentor email error:', {
                    name: mentorEmailError.name,
                    message: mentorEmailError.message,
                    stack: mentorEmailError.stack,
                    response: mentorEmailError.response?.data
                });
                // NEW: Send WhatsApp notification to admin about mentor email failure
                try {
                    const { sendWhatsappMessage } = await import('@/api/functions');
                    await sendWhatsappMessage({
                        title: `🚨 כשל בשליחת מייל למנטורית`,
                        message: `בקשת פגישה נוצרה בהצלחה עבור ${formData.user_name} אצל ${mentorProfile?.mentor_name}, אך נכשל בשליחת מייל למנטורית.
מייל המנטורית: ${mentorProfile?.contact_email || 'לא ידוע'}
שגיאה: ${mentorEmailError.message || 'שגיאה לא ידועה'}`
                    });
                    console.log('[Booking.js] ✅ WhatsApp sent to admin for mentor email failure');
                } catch (whatsappAdminError) {
                    console.error('[Booking.js] ❌ Failed to send WhatsApp for mentor email failure:', whatsappAdminError);
                }
            }

            // Send admin notification with detailed logging
            try {
                console.log('[Booking.js] 📧 Attempting to send admin notification via createNotification...');
                
                const meetingTypeText = formData.preferred_meeting_type === 'לא משנה' 
                    ? 'לא משנה לה' 
                    : `מעדיפה ${formData.preferred_meeting_type}`;
                
                const adminNotificationResult = await createNotification({
                    recipient_email: 'restart@rse50.co.il',
                    title: `✅ בקשת פגישה חדשה התקבלה`,
                    message: `מנטורית: ${mentorProfile.mentor_name}
מבקשת: ${formData.user_name}
טלפון: ${formData.user_phone}
העדפת פגישה: ${meetingTypeText}

הודעה: ${formData.user_message}

הבקשה ממתינה לאישור המנטורית.`,
                    type: 'system',
                    sender_name: 'מערכת ReStart 50+',
                    priority: 'normal',
                    send_manager_email_alert: true
                });
                
                console.log('[Booking.js] ✅ Admin notification result:', adminNotificationResult);
            } catch (adminNotificationError) {
                console.error('[Booking.js] ❌ CRITICAL: Failed to send admin notification');
                console.error('[Booking.js] 🔍 Admin notification error details:', {
                    name: adminNotificationError.name,
                    message: adminNotificationError.message,
                    stack: adminNotificationError.stack,
                    response: adminNotificationError.response?.data,
                    status: adminNotificationError.response?.status
                });
            }

            // Send WhatsApp to admin
            try {
                console.log('[Booking.js] 📱 Sending WhatsApp to admin...');
                const { sendWhatsappMessage } = await import('@/api/functions');
                
                const meetingTypeText = formData.preferred_meeting_type === 'לא משנה' 
                    ? 'לא משנה לה' 
                    : `מעדיפה ${formData.preferred_meeting_type}`;
                
                await sendWhatsappMessage({
                    title: `✅ בקשת פגישה חדשה`,
                    message: `מנטורית: ${mentorProfile.mentor_name}
מבקשת: ${formData.user_name}
טלפון: ${formData.user_phone}
העדפת פגישה: ${meetingTypeText}

הודעה: ${formData.user_message}

הבקשה ממתינה לאישור המנטורית.`
                });
                
                console.log('[Booking.js] ✅ WhatsApp sent to admin');
            } catch (whatsappError) {
                console.error('[Booking.js] ⚠️ Failed to send WhatsApp:', whatsappError);
            }

            // Send confirmation notification to user
            try {
                console.log('[Booking.js] 📨 Sending confirmation to user...');
                await createNotification({
                    recipient_email: currentUser.email,
                    title: `הבקשה שלך נשלחה ל-${mentorProfile.mentor_name}`,
                    message: `בקשתך לפגישת היכרות עם ${mentorProfile.mentor_name} נשלחה בהצלחה. המנטורית תיצור איתך קשר בקרוב לתיאום מועד.`,
                    type: 'appointment',
                    action_url: `https://rse50.co.il${createPageUrl('MyBookings')}`,
                    sender_name: 'מערכת ReStart 50+',
                    priority: 'normal'
                });
                console.log('[Booking.js] ✅ Confirmation notification sent to user');
            } catch (notificationError) {
                console.error('[Booking.js] ⚠️ Failed to send user confirmation:', notificationError);
                // NEW: Send WhatsApp notification to admin about user internal notification failure
                try {
                    const { sendWhatsappMessage } = await import('@/api/functions');
                    await sendWhatsappMessage({
                        title: `⚠️ כשל בשליחת התראת אישור פנימית למשתמשת`,
                        message: `בקשת פגישה נוצרה בהצלחה עבור ${formData.user_name} אצל ${mentorProfile?.mentor_name}, אך נכשל בשליחת התראה פנימית למשתמשת.
מייל המשתמשת: ${currentUser?.email || 'לא ידוע'}
שגיאה: ${notificationError.message || 'שגיאה לא ידועה'}`
                    });
                    console.log('[Booking.js] ✅ WhatsApp sent to admin for user internal notification failure');
                } catch (whatsappAdminError) {
                    console.error('[Booking.js] ❌ Failed to send WhatsApp for user internal notification failure:', whatsappAdminError);
                }
            }

            // Send SIMPLIFIED confirmation email to user
            try {
                console.log('[Booking.js] 📧 Sending confirmation email to user...');
                
                const meetingTypeText = formData.preferred_meeting_type === 'לא משנה' 
                    ? 'לא משנה לך' 
                    : formData.preferred_meeting_type;
                
                const userEmailContent = `
                    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #10b981; text-align: center;">🎉 הבקשה נשלחה בהצלחה!</h2>
                        <h3 style="color: #333;">שלום ${formData.user_name}! 💕</h3>
                        <p style="font-size: 16px; color: #333;">
                            בקשתך לפגישת היכרות עם <strong>${mentorProfile.mentor_name}</strong> נשלחה בהצלחה!
                        </p>
                        
                        <div style="background-color: #d1fae5; padding: 15px; margin: 20px 0; border-right: 4px solid #10b981;">
                            <p style="margin: 5px 0;"><strong>מנטורית:</strong> ${mentorProfile.mentor_name}</p>
                            <p style="margin: 5px 0;"><strong>סוג פגישה מועדף:</strong> ${meetingTypeText}</p>
                        </div>
                        
                        <div style="background-color: #fef3c7; padding: 15px; margin: 20px 0;">
                            <p style="margin: 0; color: #92400e;">
                                <strong>💡 השלבים הבאים:</strong> המנטורית תיצור איתך קשר בטלפון ${formData.user_phone} בקרוב לתיאום מועד מדויק ופרטי ההתחברות לפגישה.
                            </p>
                        </div>
                        
                        <p style="margin-top: 20px;">את יכולה לעקוב אחר הבקשה שלך באתר ReStart 50+ בלשונית הפגישות שלי.</p>
                        
                        <p style="margin-top: 30px; color: #666;">בהצלחה! אנחנו כאן בשבילך 💜<br><strong>צוות ReStart 50+</strong></p>
                        
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                        <p style="font-size: 12px; color: #999; text-align: center;">זוהי הודעה אוטומטית מ-ReStart 50+</p>
                    </div>
                `;

                await SendEmail({
                    to: currentUser.email,
                    subject: `🎉 הבקשה שלך לפגישה עם ${mentorProfile.mentor_name} נשלחה בהצלחה!`,
                    body: userEmailContent
                });
                
                console.log('[Booking.js] ✅ Confirmation email sent to user');
            } catch (userEmailError) {
                console.error('[Booking.js] ❌ Failed to send user confirmation email:', userEmailError);
                // NEW: Send WhatsApp notification to admin about user email failure
                try {
                    const { sendWhatsappMessage } = await import('@/api/functions');
                    await sendWhatsappMessage({
                        title: `🚨 כשל בשליחת מייל אישור למשתמשת`,
                        message: `בקשת פגישה נוצרה בהצלחה עבור ${formData.user_name} אצל ${mentorProfile?.mentor_name}, אך נכשל בשליחת מייל אישור למשתמשת.
מייל המשתמשת: ${currentUser?.email || 'לא ידוע'}
שגיאה: ${userEmailError.message || 'שגיאה לא ידועה'}`
                    });
                    console.log('[Booking.js] ✅ WhatsApp sent to admin for user email failure');
                } catch (whatsappAdminError) {
                    console.error('[Booking.js] ❌ Failed to send WhatsApp for user email failure:', whatsappAdminError);
                }
            }

            setSuccess(true);

        } catch (err) {
            console.error('[Booking.js] Error creating appointment request:', err);
            setError(err.message || 'אירעה שגיאה ביצירת הבקשה');
            toast({
                title: "שגיאה ביצירת הבקשה",
                description: err.message || 'אירעה שגיאה ביצירת הבקשה',
                variant: "destructive",
            });

            // NEW: Send WhatsApp notification to admin about critical booking failure
            try {
                const { sendWhatsappMessage } = await import('@/api/functions');
                await sendWhatsappMessage({
                    title: `🚨 שגיאה קריטית בבקשת פגישה חדשה`,
                    message: `לא ניתן היה ליצור בקשת פגישה ב-ReStart 50+.
מנטורית: ${mentorProfile?.mentor_name || 'לא ידוע'} (ID: ${mentorProfileId || 'לא ידוע'})
מבקשת: ${formData.user_name || 'לא ידוע'}
מייל המבקשת: ${currentUser?.email || 'לא ידוע'}
שגיאה: ${err.message || 'שגיאה לא ידועה'}
פרטי שגיאה נוספים: ${JSON.stringify(err.stack || err, null, 2).substring(0, 500)}...` // Truncate stack for WhatsApp
                });
                console.log('[Booking.js] ✅ WhatsApp sent to admin for critical booking failure');
            } catch (whatsappAdminError) {
                console.error('[Booking.js] ❌ Failed to send WhatsApp for critical booking failure:', whatsappAdminError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Loading states
    if (isLoadingUser || isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">טוען...</p>
                </div>
            </div>
        );
    }

    // Authentication check
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center">
                <Card className="text-center p-8 border-orange-200">
                    <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">נדרשת התחברות</h2>
                    <p className="text-gray-600 mb-6">כדי לבקש פגישה, יש להתחבר למערכת תחילה.</p>
                    <Button asChild>
                        <Link to={createPageUrl("Home")}>התחברות למערכת</Link>
                    </Button>
                </Card>
            </div>
        );
    }

    // Success state
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center">
                <Card className="text-center p-8 border-green-200">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">הבקשה נשלחה בהצלחה! 🎉</h2>
                    <p className="text-gray-600 mb-2">
                        בקשתך לפגישת היכרות עם <strong>{mentorName}</strong> נשלחה בהצלחה.
                    </p>
                    <p className="text-gray-600 mb-6">
                        המנטורית תיצור איתך קשר בקרוב לתיאום מועד מדויק לפגישה.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button asChild>
                            <Link to={createPageUrl("MyBookings")}>הבקשות שלי</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link to={createPageUrl("CoachesAndConsultants")}>חזרה למנטוריות</Link>
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center">
                <Card className="text-center p-8 border-red-200">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">אירעה שגיאה</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Button onClick={() => window.location.reload()}>נסי שוב</Button>
                </Card>
            </div>
        );
    }

    // Missing parameters
    if (!mentorProfileId || !mentorName) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center">
                <Card className="text-center p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">פרטי המנטורית חסרים</h2>
                    <p className="text-gray-600 mb-6">נא לחזור לדף המנטוריות ולבחור מנטורית.</p>
                    <Button asChild>
                        <Link to={createPageUrl("CoachesAndConsultants")}>חזרה למנטוריות</Link>
                    </Button>
                </Card>
            </div>
        );
    }

    // Main booking form
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Card className="shadow-2xl border-0 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
                            📞 בקשת פגישת היכרות
                        </CardTitle>
                        <CardDescription className="text-lg">
                            עם <span className="font-semibold text-purple-600">{mentorName}</span>
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6 p-8">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-green-900 text-lg mb-1">🎁 שיחת היכרות חינמית</h3>
                                    <p className="text-green-800 text-sm leading-relaxed">
                                        פגישת ההיכרות הראשונה שלך עם {mentorName} היא <strong>ללא עלות</strong>. זו הזדמנות להכיר, לשתף ולהבין איך המנטורית יכולה לסייע לך בהמשך הדרך.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="user_name">השם המלא שלך *</Label>
                                <Input
                                    id="user_name"
                                    name="user_name"
                                    type="text"
                                    value={formData.user_name}
                                    onChange={handleInputChange}
                                    placeholder="השם שלך"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="user_phone">מספר טלפון ליצירת קשר *</Label>
                                <Input
                                    id="user_phone"
                                    name="user_phone"
                                    type="tel"
                                    value={formData.user_phone}
                                    onChange={handleInputChange}
                                    placeholder="050-1234567"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="preferred_meeting_type">איך תרצי להיפגש? *</Label>
                                <Select
                                    value={formData.preferred_meeting_type}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, preferred_meeting_type: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="בחרי סוג פגישה" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="זום">זום</SelectItem>
                                        <SelectItem value="פרונטלי">פרונטלי</SelectItem>
                                        <SelectItem value="לא משנה">לא משנה לי</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="user_message">מה תרצי לשתף או לשאול? *</Label>
                                <Textarea
                                    id="user_message"
                                    name="user_message"
                                    value={formData.user_message}
                                    onChange={handleInputChange}
                                    placeholder="ספרי קצת על עצמך, מה המצב שלך כרגע ואיך את מקווה שהמנטורית יכולה לעזור לך..."
                                    className="min-h-[120px]"
                                    required
                                />
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 text-lg font-semibold"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                                        שולח בקשה...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 ml-2" />
                                        שליחת בקשה לפגישה
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="text-center text-sm text-gray-500 border-t pt-4">
                            לאחר שליחת הבקשה, המנטורית תיצור איתך קשר לתיאום מועד מדויק לפגישה
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
