import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/api/entities';
import { MemberApplication } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Send, PartyPopper, CheckCircle, Heart } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { createNotification } from '@/api/functions';
import { useUser, hasValidSubscription } from '@/components/auth/UserContext';

export default function ApplyForMembership() {
    const { currentUser, isLoadingUser } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        whyJoin: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser && !isLoadingUser) {
            setFormData(prev => ({
                ...prev,
                fullName: currentUser.full_name || '',
                email: currentUser.email || ''
            }));
        }
    }, [currentUser, isLoadingUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!formData.fullName || !formData.email || !formData.whyJoin) {
            setError('נא למלא את כל השדות.');
            return;
        }

        setIsSubmitting(true);
        try {
            console.log('[ApplyForMembership] Starting submission...');
            
            const applicationData = {
                full_name: formData.fullName,
                email: formData.email,
                why_join: formData.whyJoin,
                status: 'pending',
                notes: ''
            };

            console.log('[ApplyForMembership] Creating MemberApplication...');
            await MemberApplication.create(applicationData);
            console.log('[ApplyForMembership] ✅ MemberApplication created successfully');

            // Send in-app notification to admin
            try {
                console.log('[ApplyForMembership] 📨 Sending in-app notification to admin...');
                await createNotification({
                    recipient_email: 'restart@rse50.co.il',
                    title: `✨ בקשת הצטרפות חדשה: ${formData.fullName}`,
                    message: `${formData.fullName} (${formData.email}) ביקשה להצטרף לקהילה. היכנסי ללוח הבקרה לאישור.`,
                    type: 'system',
                    action_url: createPageUrl('ManageUsers'),
                    send_manager_email_alert: true,
                    priority: 'high'
                });
                console.log('[ApplyForMembership] ✅ In-app notification sent');
            } catch (notificationError) {
                console.error('[ApplyForMembership] ❌ Failed to send in-app notification:', notificationError);
            }

            // Send WhatsApp notification to admin
            try {
                console.log('[ApplyForMembership] 📱 Sending WhatsApp to admin...');
                const { sendWhatsappMessage } = await import('@/api/functions');
                await sendWhatsappMessage({
                    title: `✨ בקשת הצטרפות חדשה`,
                    message: `שם: ${formData.fullName}
מייל: ${formData.email}

סיבת הצטרפות: ${formData.whyJoin}

היכנסי ללוח הבקרה לאישור הבקשה.`
                });
                console.log('[ApplyForMembership] ✅ WhatsApp sent successfully');
            } catch (whatsappError) {
                console.error('[ApplyForMembership] ⚠️ Failed to send WhatsApp:', whatsappError);
            }
            
            setIsSubmitted(true);
        } catch (err) {
            console.error('[ApplyForMembership] ❌ Submission failed:', err);
            setError('אירעה שגיאה בשליחת הבקשה. אנא נסי שוב.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleLoginAndApply = async () => {
        try {
            await User.loginWithRedirect(window.location.href);
        } catch (error) {
            console.error("Login failed", error);
            setError("ההתחברות נכשלה. נסי לרענן את הדף.");
        }
    };

    if (isLoadingUser) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 text-rose-500 animate-spin" /></div>;
    }

    // Check if user is already a member with valid subscription
    if (currentUser && hasValidSubscription(currentUser)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 p-4">
                <Card className="text-center p-8 max-w-lg shadow-2xl">
                    <CardHeader>
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold">את כבר חלק מהקהילה! 🎉</CardTitle>
                        <CardDescription className="text-lg text-gray-600 mt-2">
                            את מנויה פעילה בריסטארט 50+ ויש לך גישה מלאה לכל השירותים והתכנים שלנו.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-600">
                            אין צורך להגיש בקשה נוספת. את יכולה להמשיך ליהנות מכל מה שהקהילה מציעה!
                        </p>
                        <div className="flex flex-col gap-3">
                            <Button asChild size="lg" className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700">
                                <a href={createPageUrl('MyProfile')}>
                                    <Heart className="w-4 h-4 ml-2" />
                                    חזרה למקום האישי שלי
                                </a>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <a href={createPageUrl('Home')}>
                                    לעמוד הבית
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 p-4">
                <Card className="text-center p-8 max-w-lg shadow-2xl">
                    <CardHeader>
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <PartyPopper className="w-8 h-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold">הבקשה שלך נשלחה בהצלחה!</CardTitle>
                        <CardDescription className="text-lg text-gray-600 mt-2">
                            תודה רבה! אנחנו נבדוק את הבקשה ונעדכן אותך במייל תוך 24-48 שעות.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate(createPageUrl('Home'))}>חזרה לעמוד הבית</Button>
                        <p className="text-xs text-gray-500 mt-6">
                            💌 מייל אישור בדרך אלייך! לפעמים הוא מסתתר בתיקיית "קידומי מכירות".
                            <br/>
                            נשמח אם תבדקי שם ותגררי אותנו לתיבה הראשית.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 p-4">
            <Card className="w-full max-w-2xl shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold gradient-text">בקשת הצטרפות ל-ReStart 50+</CardTitle>
                    <CardDescription className="text-lg text-gray-600 mt-2">
                        צעד אחד קטן ואת בפנים! ספרי לנו קצת עלייך.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!currentUser ? (
                        <div className="text-center p-6 bg-rose-50 rounded-lg">
                           <h3 className="font-bold text-rose-800">רגע לפני שממשיכים</h3>
                           <p className="text-rose-700 my-2">כדי להגיש בקשה, עליך להיות מחוברת לחשבון. </p>
                           <Button onClick={handleLoginAndApply}>
                                התחברות והמשך למילוי הטופס
                           </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="fullName" className="font-medium">שם מלא</label>
                                <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="font-medium">כתובת מייל</label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required readOnly disabled className="bg-gray-100" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="whyJoin" className="font-medium">למה תרצי להצטרף לקהילה שלנו?</label>
                                <Textarea id="whyJoin" name="whyJoin" value={formData.whyJoin} onChange={handleChange} rows={4} required placeholder="ספרי לנו מה מביא אותך אלינו, מה את מקווה למצוא..." />
                            </div>
                            
                            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-sm text-rose-800">
                                <p className="font-medium mb-2">💡 שימי לב:</p>
                                <p>המידע שתזיני הוא באחריותך הבלעדית. אנא וודאי את דיוק הפרטים. המשך בתהליך מהווה הסכמה ל<a href="/TermsOfService" target="_blank" className="underline font-semibold">תקנון השימוש</a> ול<a href="/Privacy" target="_blank" className="underline font-semibold">מדיניות הפרטיות</a> שלנו.</p>
                            </div>

                            {error && <p className="text-red-600 text-sm">{error}</p>}
                            
                            <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-2" />}
                                שליחת בקשה
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}