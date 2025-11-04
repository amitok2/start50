import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, Mail } from 'lucide-react';
import { SendEmail } from '@/api/integrations';
import { createPageUrl } from '@/utils';

export default function SendInstructorEmail() {
    const [isSending, setIsSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState(null);

    const sendEmailToInstructor = async () => {
        setIsSending(true);
        setError(null);

        try {
            await SendEmail({
                to: 'pesiab@013.net',
                subject: '🎉 תודה על ההצטרפה! עוד צעד אחד קטן...',
                body: `
                  <div dir="rtl" style="font-family: Arial, sans-serif; text-align: right; line-height: 1.6; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #9333ea;">שלום פסיה,</h2>
                    
                    <p style="font-size: 16px;">תודה רבה שהצטרפת להגשת קורסים וסדנאות ב-ReStart 50+! 🎊</p>
                    
                    <p style="font-size: 16px;">קיבלנו את הצעת הקורס שלך: <strong>"כשרגש לוחץ על הכפתור – מי באמת מנהל אותנו"</strong></p>
                    
                    <div style="background: #fef3c7; padding: 20px; border-right: 4px solid #f59e0b; margin: 20px 0;">
                      <p style="margin: 0; font-size: 16px; font-weight: bold; color: #92400e;">📋 צעד חשוב נוסף:</p>
                      <p style="margin: 10px 0 0 0; font-size: 15px; color: #78350f;">
                        כדי שנוכל לאשר את הקורס שלך ולפרסם אותו, נצטרך קודם להכיר אותך טוב יותר. 
                        נא מלאי את טופס ההרשמה כמנטורית/מומחית - זה יעזור לנו להציג אותך בצורה הטובה ביותר לקהילה שלנו.
                      </p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="https://rse50.co.il${createPageUrl('BecomeMentor')}" 
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
                      לאחר שנאשר אותך כמנטורית, נעבור גם על הצעת הקורס שלך ונעדכן אותך בהקדם.
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

            setEmailSent(true);
            console.log('[SendInstructorEmail] Email sent successfully to pesiab@013.net');
        } catch (err) {
            console.error('[SendInstructorEmail] Error sending email:', err);
            setError(err.message || 'שגיאה בשליחת המייל');
        } finally {
            setIsSending(false);
        }
    };

    useEffect(() => {
        // Send email automatically on page load
        sendEmailToInstructor();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <Card className="shadow-2xl border-0">
                    <CardHeader className="text-center bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                        <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                            <Mail className="w-6 h-6" />
                            שליחת מייל למרצה
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        {isSending && (
                            <div className="text-center">
                                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                                <p className="text-lg text-gray-700">שולחת מייל לפסיה בן נון...</p>
                            </div>
                        )}

                        {emailSent && !error && (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">המייל נשלח בהצלחה! ✅</h3>
                                <p className="text-gray-600 mb-6">
                                    פסיה בן נון (pesiab@013.net) קיבלה מייל עם הנחיה למלא את טופס המנטורית.
                                </p>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-right">
                                    <p className="text-sm text-blue-800">
                                        💡 <strong>מעכשיו והלאה:</strong> כל מרצה חדשה שתגיש קורס תקבל אוטומטית את אותו מייל, 
                                        ותופנה למלא את טופס המנטורית לפני אישור הקורס.
                                    </p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">❌</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">שגיאה בשליחת המייל</h3>
                                <p className="text-red-600 mb-4">{error}</p>
                                <Button onClick={sendEmailToInstructor} disabled={isSending}>
                                    נסי שוב
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}