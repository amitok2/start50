import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { VolunteerRegistration } from '@/api/entities';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Heart, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { createNotification } from '@/api/functions';
import { createPageUrl } from '@/utils';

const categoryEmojis = {
    'עזרה טכנולוגית': '💻',
    'עזרה בבית': '🏠',
    'הסעות וליווי': '🚗',
    'שמרטפות': '👶',
    'הוראה וחונכות': '📚',
    'יצירה ותחביבים': '🎨'
};

export default function VolunteerSignup() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const categoryFromUrl = searchParams.get('category') || '';

    const [currentUser, setCurrentUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        volunteer_name: '',
        email: '',
        phone: '',
        category: categoryFromUrl,
        message: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await User.me();
                setCurrentUser(user);
                setFormData(prev => ({
                    ...prev,
                    volunteer_name: user.full_name || '',
                    email: user.email || ''
                }));
            } catch (e) {
                // Not logged in, which is fine
            } finally {
                setIsLoadingUser(false);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.volunteer_name || !formData.email || !formData.category) {
            setError('נא למלא את כל השדות החובה.');
            return;
        }

        setIsSubmitting(true);
        try {
            console.log('[VolunteerSignup] Starting submission...');

            const registrationData = {
                volunteer_name: formData.volunteer_name,
                email: formData.email,
                phone: formData.phone || '',
                category: formData.category,
                message: formData.message || '',
                status: 'pending'
            };

            console.log('[VolunteerSignup] Creating volunteer registration...');
            await VolunteerRegistration.create(registrationData);
            console.log('[VolunteerSignup] ✅ Registration created successfully');

            // Send in-app notification to admin
            try {
                console.log('[VolunteerSignup] 📨 Sending notification to admin...');
                await createNotification({
                    recipient_email: 'restart@rse50.co.il',
                    title: `✨ בקשת התנדבות חדשה: ${formData.category}`,
                    message: `${formData.volunteer_name} (${formData.email}) מעוניינת להתנדב בנושא "${formData.category}". ${formData.phone ? `טלפון: ${formData.phone}` : ''}`,
                    type: 'system',
                    action_url: createPageUrl('AdminDashboard'),
                    send_manager_email_alert: true,
                    priority: 'normal'
                });
                console.log('[VolunteerSignup] ✅ Notification sent');
            } catch (notificationError) {
                console.error('[VolunteerSignup] ❌ Failed to send notification:', notificationError);
            }

            // Send WhatsApp to admin
            try {
                console.log('[VolunteerSignup] 📱 Sending WhatsApp to admin...');
                const { sendWhatsappMessage } = await import('@/api/functions');
                await sendWhatsappMessage({
                    title: `✨ בקשת התנדבות חדשה`,
                    message: `שם: ${formData.volunteer_name}
מייל: ${formData.email}
${formData.phone ? `טלפון: ${formData.phone}` : ''}
קטגוריה: ${formData.category}

${formData.message ? `הודעה: ${formData.message}` : ''}

צרי קשר עם המתנדבת לתיאום פרטים.`
                });
                console.log('[VolunteerSignup] ✅ WhatsApp sent');
            } catch (whatsappError) {
                console.error('[VolunteerSignup] ⚠️ Failed to send WhatsApp:', whatsappError);
            }

            setIsSubmitted(true);
        } catch (error) {
            console.error('[VolunteerSignup] ❌ Submission failed:', error);
            setError('אירעה שגיאה בשליחת הבקשה. אנא נסי שוב.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLoginAndSignup = async () => {
        try {
            await User.loginWithRedirect(window.location.href);
        } catch (error) {
            console.error("Login failed", error);
            setError("ההתחברות נכשלה. נסי לרענן את הדף.");
        }
    };

    if (isLoadingUser) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
                <Card className="text-center p-8 max-w-lg shadow-2xl">
                    <CardHeader>
                        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold">הבקשה נשלחה בהצלחה! 💜</CardTitle>
                        <CardDescription className="text-lg text-gray-600 mt-2">
                            תודה רבה על הרצון שלך לתרום ולעזור! נחזור אלייך בהקדם לתיאום פרטים.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate(createPageUrl('PayItForward'))}>
                            <ArrowRight className="w-4 h-4 ml-2" />
                            חזרה לדף נתינה והתנדבות
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
            <Card className="w-full max-w-2xl shadow-2xl">
                <CardHeader className="text-center bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                    <div className="text-5xl mb-3">
                        {categoryEmojis[formData.category] || '💜'}
                    </div>
                    <CardTitle className="text-3xl font-bold">רישום להתנדבות</CardTitle>
                    <CardDescription className="text-white/90 text-lg mt-2">
                        {formData.category ? `התנדבות בנושא: ${formData.category}` : 'הצטרפי למעגל הנתינה שלנו'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    {!currentUser ? (
                        <div className="text-center p-6 bg-purple-50 rounded-lg">
                            <Heart className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                            <h3 className="font-bold text-purple-800 text-lg">רגע לפני שממשיכים</h3>
                            <p className="text-purple-700 my-2">כדי להירשם להתנדבות, עליך להיות מחוברת לחשבון.</p>
                            <Button onClick={handleLoginAndSignup} size="lg" className="mt-3 bg-purple-600 hover:bg-purple-700">
                                התחברות והמשך לרישום
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="volunteer_name">שם מלא *</Label>
                                <Input
                                    id="volunteer_name"
                                    name="volunteer_name"
                                    value={formData.volunteer_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">כתובת מייל *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    readOnly
                                    disabled
                                    className="bg-gray-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">מספר טלפון</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="לתיאום פרטים"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">קטגוריית התנדבות *</Label>
                                <Input
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    readOnly
                                    className="bg-gray-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">ספרי לנו קצת על עצמך ועל הניסיון שלך</Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="למשל: יש לי ניסיון בהדרכת מחשבים, או: אשמח לעזור עם הסעות באזור תל אביב..."
                                />
                            </div>

                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-purple-800">
                                <p className="font-medium mb-2">💡 שימי לב:</p>
                                <p>לאחר שליחת הבקשה, נחזור אלייך בהקדם לתיאום פרטים ולהתאים את ההתנדבות בצורה הטובה ביותר.</p>
                            </div>

                            {error && <p className="text-red-600 text-sm">{error}</p>}

                            <Button
                                type="submit"
                                className="w-full text-lg py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin ml-2" />
                                ) : (
                                    <Heart className="w-5 h-5 ml-2" />
                                )}
                                שלחי בקשה להתנדבות
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}