
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Appointment } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertTriangle, User, Phone, MessageSquare, XCircle, Calendar } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { SendEmail } from "@/api/integrations";
import { format } from "date-fns";
import { he } from 'date-fns/locale';
import { useToast } from "@/components/ui/use-toast";

export default function ApproveBooking() {
    const [appointment, setAppointment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();

    const appointmentId = new URLSearchParams(location.search).get('id');

    useEffect(() => {
        const loadAppointment = async () => {
            if (!appointmentId) {
                setError('מזהה פגישה לא תקין.');
                setIsLoading(false);
                return;
            }
            try {
                const apptData = await Appointment.get(appointmentId);
                if (!apptData) {
                    setError('הפגישה לא נמצאה.');
                } else {
                    setAppointment(apptData);
                }
            } catch (err) {
                setError('שגיאה בטעינת הפגישה.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadAppointment();
    }, [appointmentId]);
    
    const handleStatusUpdate = async (newStatus, userMessage, subject) => {
        setIsUpdating(true);
        try {
            await Appointment.update(appointment.id, { status: newStatus });

            await SendEmail({
                to: appointment.user_email,
                subject: subject,
                body: userMessage,
            });

            toast({
                title: "הסטטוס עודכן בהצלחה",
                description: `הודעה נשלחה למשתמשת ${appointment.user_name}.`,
                className: "bg-green-100 text-green-800"
            });
            
            navigate(createPageUrl('MentorDashboard'));

        } catch (error) {
            console.error("Update failed:", error);
            setError('אירעה שגיאה בעדכון הפגישה.');
            toast({ title: "שגיאה בעדכון", description: error.message, variant: "destructive" });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleApprove = () => {
        const meetingDetailsUrl = `${window.location.origin}${createPageUrl('MyBookings')}`;
        const emailBody = `שלום ${appointment.user_name},
            <br><br>
            הבקשה שלך לפגישה עם <strong>${appointment.mentor_name}</strong> אושרה!
            <br>
            המנטורית קיבלה את פרטייך ותיצור עמך קשר טלפוני בהקדם לתיאום מועד מדויק לפגישה.
            <br><br>
            תוכלי לעקוב אחר סטטוס הפגישות שלך בקישור הבא:
            <br>
            <a href="${meetingDetailsUrl}">לצפייה בפגישות שלי</a>
            <br><br>
            בברכה,
            <br>
            צוות ReStart 50+`;
        
        handleStatusUpdate('confirmed', emailBody, `בקשתך לפגישה עם ${appointment.mentor_name} אושרה!`);
    };

    const handleReject = () => {
        const emailBody = `שלום ${appointment.user_name},
            <br><br>
            בשלב זה, המנטורית <strong>${appointment.mentor_name}</strong> לא יכולה לקבל את בקשתך לפגישה.
            <br>
            אנו מזמינות אותך לפנות למנטוריות אחרות הזמינות בפלטפורמה.
            <br><br>
            בברכה,
            <br>
            צוות ReStart 50+`;

        handleStatusUpdate('cancelled_by_mentor', emailBody, `עדכון לגבי בקשתך לפגישה עם ${appointment.mentor_name}`);
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
              <Button asChild className="mt-4">
                <Link to={createPageUrl("MentorDashboard")}>חזרה ללוח הבקרה</Link>
              </Button>
            </Card>
          </div>
        );
    }
    
    if (!appointment) return null;
    
    if (appointment.status !== 'pending_approval') {
        return (
             <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="text-center p-6 border-blue-300">
                  <CheckCircle className="mx-auto h-12 w-12 text-blue-500" />
                  <h3 className="mt-4 text-lg font-medium text-blue-800">הבקשה כבר טופלה</h3>
                  <p className="mt-2 text-sm text-gray-600">הסטטוס של בקשה זו הוא: {appointment.status}</p>
                   <Button asChild className="mt-4">
                    <Link to={createPageUrl("MentorDashboard")}>חזרה ללוח הבקרה</Link>
                  </Button>
                </Card>
              </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <Card className="max-w-2xl w-full text-right shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">פרטי בקשה חדשה לפגישה</CardTitle>
                    <CardDescription>בבקשה בדקי את הפרטים והגיבי לפנייה.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-3 mb-4">
                            <User className="w-5 h-5 text-purple-600" />
                            <h3 className="font-semibold text-gray-800">פנייה מאת: {appointment.user_name}</h3>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <Phone className="w-5 h-5 text-purple-600" />
                            <h3 className="font-semibold text-gray-800">טלפון ליצירת קשר: <a href={`tel:${appointment.user_phone}`} className="text-blue-600 hover:underline">{appointment.user_phone}</a></h3>
                        </div>
                        {appointment.preferred_meeting_type && (
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-purple-600" />
                                <h3 className="font-semibold text-gray-800">
                                    העדפה לסוג פגישה: 
                                    <span className="text-purple-700 mr-2">
                                        {appointment.preferred_meeting_type === 'לא משנה' ? 'לא משנה לה' : appointment.preferred_meeting_type}
                                    </span>
                                </h3>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-purple-600" />
                            הודעה מהמבקשת:
                        </h4>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border whitespace-pre-wrap">{appointment.user_message}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                        <Button 
                            onClick={handleApprove}
                            disabled={isUpdating}
                            className="bg-green-600 hover:bg-green-700 flex-1"
                            size="lg"
                        >
                            {isUpdating ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <CheckCircle className="ml-2 h-4 w-4" />}
                            אישור ויצירת קשר
                        </Button>
                        <Button 
                            onClick={handleReject}
                            disabled={isUpdating}
                            variant="destructive"
                            className="flex-1"
                             size="lg"
                        >
                            <XCircle className="ml-2 h-4 w-4" />
                            דחיית הבקשה
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
