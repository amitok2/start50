
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Appointment } from '@/api/entities';
import { UserProfile } from '@/api/entities'; // Keep import for potential future use or if other parts depend on it, though not used in the new logic.
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Clock, User as UserIcon, AlertTriangle, CheckCircle, Hourglass, XCircle, Star, Crown, Heart } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { he } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from '@/components/ui/badge';
// import { syncUserProfile } from '@/api/functions'; // Removed as per new logic

export default function MyBookings() {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUserData = async () => {
            console.log('[MyBookings.js] 🔄 Starting to load appointments...');
            setIsLoading(true);
            try {
                const currentUser = await User.me();
                if (!currentUser || !currentUser.email) {
                    console.log('[MyBookings.js] ❌ No user logged in. Stopping.');
                    setIsLoading(false);
                    return;
                }
                
                setUser(currentUser);
                console.log(`[MyBookings.js] ✅ User authenticated: ${currentUser.email}`);

                // Simple, direct query based on user's email.
                // The RLS rules on the 'Appointment' entity should allow this.
                console.log(`[MyBookings.js] 🔍 Fetching appointments where user_email is ${currentUser.email}`);
                const userAppointments = await Appointment.filter(
                    { user_email: currentUser.email },
                    '-created_date'
                );

                console.log(`[MyBookings.js] ✅ Found ${userAppointments.length} appointments.`);
                if (userAppointments.length > 0) {
                    console.log('[MyBookings.js] 📋 Appointment details:', userAppointments);
                }
                
                setAppointments(userAppointments);

            } catch (error) {
                console.error('[MyBookings.js] ❌ Error loading appointments:', error);
                setAppointments([]); // Clear appointments on error
            } finally {
                setIsLoading(false);
                console.log('[MyBookings.js] 🏁 Appointment loading process finished.');
            }
        };
        loadUserData();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 ml-1" />אושר, תתואם פגישה</Badge>;
            case 'pending_approval':
                return <Badge className="bg-yellow-100 text-yellow-800"><Hourglass className="w-3 h-3 ml-1" />ממתין לאישור המנטורית</Badge>;
            case 'cancelled_by_user':
            case 'cancelled_by_mentor':
                return <Badge variant="destructive"><XCircle className="w-3 h-3 ml-1" />בוטל</Badge>;
            case 'completed':
                 return <Badge className="bg-blue-100 text-blue-800"><Star className="w-3 h-3 ml-1" />הושלם</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };
    
    const pageTitle = "הפגישות שלי";
    const pageDescription = "כאן תוכלי לראות את כל בקשות הפגישה ששלחת למנטוריות ולעקוב אחר הסטטוס שלהן.";

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8 sm:py-12 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        <span className="gradient-text">{pageTitle}</span>
                    </h1>
                    <p className="text-xl text-gray-600">
                        {pageDescription}
                    </p>
                </div>

                {appointments.length > 0 ? (
                    <div className="space-y-6">
                        {appointments.map(appt => (
                            <Card key={appt.id} className="card-hover shadow-lg border-0">
                                <CardHeader className="bg-white flex flex-row justify-between items-center p-4">
                                    <CardTitle className="text-lg text-gray-800">
                                        {`פגישה עם ${appt.mentor_name}`}
                                    </CardTitle>
                                    {getStatusBadge(appt.status)}
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    {appt.status === 'pending_approval' && (
                                        <div className="flex items-start gap-3 text-gray-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                            <Hourglass className="w-5 h-5 text-yellow-500 mt-1" />
                                            <span>
                                                בקשתך נשלחה בהצלחה. המנטורית תבחן את הבקשה ותיצור איתך קשר בהקדם.
                                            </span>
                                        </div>
                                    )}
                                     {appt.status === 'confirmed' && appt.appointment_date && (
                                        <div className="flex items-start gap-3 text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                                            <div>
                                                <p className="font-semibold">הפגישה נקבעה!</p>
                                                <p>{`תאריך: ${format(parseISO(appt.appointment_date), 'EEEE, d בMMMM yyyy, HH:mm', { locale: he })}`}</p>
                                            </div>
                                        </div>
                                    )}
                                     {appt.status === 'confirmed' && !appt.appointment_date && (
                                        <div className="flex items-start gap-3 text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                                            <span>
                                                הבקשה אושרה! המנטורית תיצור איתך קשר טלפונית לתיאום מועד מדויק.
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="text-center p-12">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">אין לך פגישות קרובות</h3>
                        <p className="text-gray-500 mb-6">רוצה לקבוע פגישה עם אחת המנטוריות שלנו?</p>
                        <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                            <Link to={createPageUrl('CoachesAndConsultants')}>
                                <Crown className="w-5 h-5 ml-2" />
                                לרשימת המנטוריות
                            </Link>
                        </Button>
                    </Card>
                )}
            </div>

            {/* Back to My Profile Button */}
            <div className="flex justify-center mt-12 mb-8">
                <Button asChild variant="outline" size="lg" className="border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700 shadow-md">
                    <Link to={createPageUrl('MyProfile')}>
                        <Heart className="w-4 h-4 ml-2" />
                        חזרה למקום שלי
                    </Link>
                </Button>
            </div>
        </div>
    );
}
