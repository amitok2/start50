import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createNotification } from '@/api/functions';
import { User } from '@/api/entities';
import { CheckCircle, Bell, Mail, Loader2, AlertTriangle, MessageCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function TestNotification() {
  const [isLoading, setIsLoading] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [error, setError] = useState(null);

  const sendTestNotification = async () => {
    setIsLoading(true);
    setError(null);
    
    const adminEmail = "restart@rse50.co.il";

    try {
      // First, verify that the admin user exists in the system
      console.log('[TestEmailNotification] Checking if admin user exists...');
      try {
        const currentUser = await User.me();
        if (!currentUser || currentUser.role !== 'admin') {
          setError('רק מנהלת יכולה לבצע בדיקה זו');
          setIsLoading(false);
          return;
        }
      } catch (authError) {
        setError('נדרשת הרשאה של מנהלת לבצע בדיקה זו');
        setIsLoading(false);
        return;
      }

      // Send in-app notification with email alert
      console.log('[TestEmailNotification] Sending in-app notification with email...');
      await createNotification({
          recipient_email: adminEmail,
          title: '🧪 בדיקת מערכת ההתראות',
          message: 'זוהי התראת בדיקה פנימית כדי לוודא שהמערכת עובדת תקין.',
          type: 'system',
          action_url: createPageUrl('AdminDashboard'),
          send_manager_email_alert: true // This will send email via the notification function
      });
      console.log('[TestEmailNotification] In-app notification sent successfully');
      
      // Send WhatsApp test
      try {
        console.log('[TestEmailNotification] 📱 Sending WhatsApp test...');
        const { sendWhatsappMessage } = await import('@/api/functions');
        await sendWhatsappMessage({
          title: '🧪 בדיקת מערכת WhatsApp',
          message: `זוהי הודעת בדיקה לוואטסאפ.

אם קיבלת הודעה זו, המערכת עובדת תקין!

בברכה,
מערכת ReStart 50+`
        });
        console.log('[TestEmailNotification] ✅ WhatsApp test sent successfully');
      } catch (whatsappError) {
        console.error('[TestEmailNotification] ⚠️ WhatsApp test failed:', whatsappError);
        // Don't fail the entire process if WhatsApp fails
      }
      
      setNotificationSent(true);
    } catch (e) {
      console.error('[TestEmailNotification] Failed to send test:', e);
      setError('שגיאה בשליחת הבדיקה: ' + (e.message || 'אנא נסי שוב מאוחר יותר.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              🧪 בדיקת מנגנון ההתראות
            </CardTitle>
            <CardDescription>בדיקת שליחת התראות פנימיות, מיילים ו-WhatsApp למנהלת</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">מה עושה העמוד הזה?</h3>
              <p className="text-blue-800 text-sm mb-2">
                לחיצה על הכפתור תבצע שלוש פעולות:
              </p>
              <ul className="text-blue-800 text-sm list-disc list-inside space-y-1">
                <li><strong>התראה פנימית</strong> - תופיע כשתלחצי על סמל הפעמון (🔔) בתפריט.</li>
                <li><strong>מייל</strong> - יישלח לכתובת: <span className="font-semibold">restart@rse50.co.il</span>.</li>
                <li><strong>WhatsApp</strong> - יישלח למספר המוגדר ב-ADMIN_WHATSAPP_NUMBER.</li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900">שגיאה</h4>
                  <p className="text-red-800 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {!notificationSent ? (
              <div className="text-center">
                <Button
                  onClick={sendTestNotification}
                  disabled={isLoading}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                      שולחת בדיקה...
                    </>
                  ) : (
                    <>
                      <Bell className="w-5 h-5 ml-2" />
                      שליחת התראת בדיקה
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-bold text-green-900 text-lg mb-2">ההתראה נשלחה בהצלחה! ✅</h3>
                <p className="text-green-800 text-sm mb-4">
                  בדקי את:
                </p>
                <ul className="text-green-800 text-sm list-disc list-inside space-y-1 text-right">
                  <li>הפעמון (🔔) בתפריט העליון - אמורה להופיע התראה חדשה</li>
                  <li>תיבת המייל שלך: restart@rse50.co.il</li>
                  <li>WhatsApp במספר שהגדרת</li>
                </ul>
                <Button 
                  onClick={() => {
                    setNotificationSent(false);
                    setError(null);
                  }} 
                  variant="outline" 
                  className="mt-4"
                >
                  שלחי בדיקה נוספת
                </Button>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                טיפ לניפוי שגיאות
              </h3>
              <p className="text-amber-800 text-sm">
                אם לא קיבלת התראה באחד מהערוצים:
              </p>
              <ul className="text-amber-800 text-sm list-disc list-inside space-y-1 mt-2">
                <li>בדקי בתיקיית הספאם/קידומי מכירות במייל</li>
                <li>ודאי שמספר ה-WhatsApp מוגדר נכון ב-ADMIN_WHATSAPP_NUMBER</li>
                <li>בדקי את הקונסול בדפדפן לשגיאות טכניות (F12)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}