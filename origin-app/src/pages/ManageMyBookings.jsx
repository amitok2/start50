
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Appointment } from '@/api/entities';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CalendarCheck, CalendarX, Mail, Phone, Clock, MessageSquare, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { he } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useToast } from "@/components/ui/use-toast";

const AppointmentCard = ({ appointment }) => {
    const getStatusBadge = (status) => {
        const statuses = {
            pending_approval: { text: 'ממתינה לאישור', color: 'bg-yellow-100 text-yellow-800' },
            confirmed: { text: 'מאושרת', color: 'bg-green-100 text-green-800' },
            cancelled_by_user: { text: 'בוטלה ע"י המשתמשת', color: 'bg-red-100 text-red-800' },
            cancelled_by_mentor: { text: 'בוטלה על ידך', color: 'bg-red-100 text-red-800' },
            completed: { text: 'הושלמה', color: 'bg-blue-100 text-blue-800' },
        };
        return <Badge className={statuses[status]?.color || 'bg-gray-100 text-gray-800'}>{statuses[status]?.text}</Badge>;
    };

    return (
        <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl font-bold">{appointment.user_name}</CardTitle>
                        <CardDescription>{format(parseISO(appointment.created_date), 'd MMMM yyyy, HH:mm', { locale: he })}</CardDescription>
                    </div>
                    {getStatusBadge(appointment.status)}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail className="w-4 h-4 text-purple-600"/>
                    <span>{appointment.user_email}</span>
                </div>
                {appointment.user_phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-4 h-4 text-purple-600"/>
                        <span>{appointment.user_phone}</span>
                    </div>
                )}
                {appointment.user_message && (
                    <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{appointment.user_message}</p>
                    </div>
                )}

                {appointment.status === 'pending_approval' && (
                    <div className="flex gap-2 pt-4 border-t">
                        <Button asChild className="flex-1 bg-green-500 hover:bg-green-600">
                            <Link to={createPageUrl(`ApproveBooking?id=${appointment.id}`)}>
                                <CalendarCheck className="w-4 h-4 ml-2" />
                                אשר פגישה
                            </Link>
                        </Button>
                        <Button asChild variant="destructive" className="flex-1">
                             <Link to={createPageUrl(`ApproveBooking?id=${appointment.id}&action=reject`)}>
                                <CalendarX className="w-4 h-4 ml-2" />
                                דחה פגישה
                            </Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default function ManageMyBookings() {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchUserAndAppointments = async () => {
            setIsLoading(true);
            try {
                const user = await User.me();
                setCurrentUser(user);

                if (user && user.email) {
                    console.log(`Fetching appointments for mentor: ${user.email}`);
                    const mentorAppointments = await Appointment.filter({ mentor_email: user.email }, '-created_date');
                    console.log(`Found ${mentorAppointments.length} appointments.`);
                    setAppointments(mentorAppointments);
                } else {
                    throw new Error("לא ניתן לאמת את המשתמשת.");
                }
            } catch (err) {
                console.error("Error loading data:", err);
                setError("אירעה שגיאה בטעינת הפגישות.");
                toast({
                    title: "שגיאה",
                    description: err.message || "לא ניתן היה לטעון את הפגישות. נסי לרענן את הדף.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserAndAppointments();
    }, [toast]);

    const filteredAppointments = useMemo(() => {
        const pending = appointments.filter(a => a.status === 'pending_approval');
        const confirmed = appointments.filter(a => a.status === 'confirmed');
        const past = appointments.filter(a => ['completed', 'cancelled_by_user', 'cancelled_by_mentor'].includes(a.status));
        return { pending, confirmed, past };
    }, [appointments]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-16 h-16 animate-spin text-purple-600" /></div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">אופס, משהו השתבש</h2>
                <p className="text-red-600">{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">רענון הדף</Button>
            </div>
        );
    }
    
    return (
        <div dir="rtl" className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900">ניהול הפגישות שלי</h1>
                    <p className="text-lg text-gray-600 mt-2">כאן תוכלי לראות את כל בקשות הפגישה, לאשר אותן ולנהל את לוח הזמנים שלך.</p>
                </div>

                <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="pending">בקשות חדשות ({filteredAppointments.pending.length})</TabsTrigger>
                        <TabsTrigger value="confirmed">פגישות מאושרות ({filteredAppointments.confirmed.length})</TabsTrigger>
                        <TabsTrigger value="past">פגישות עבר ({filteredAppointments.past.length})</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="pending" className="pt-6">
                        {filteredAppointments.pending.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredAppointments.pending.map(app => <AppointmentCard key={app.id} appointment={app} />)}
                            </div>
                        ) : <p className="text-center text-gray-500 py-10">אין לך בקשות חדשות שממתינות לאישור.</p>}
                    </TabsContent>
                    
                    <TabsContent value="confirmed" className="pt-6">
                        {filteredAppointments.confirmed.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredAppointments.confirmed.map(app => <AppointmentCard key={app.id} appointment={app} />)}
                            </div>
                        ) : <p className="text-center text-gray-500 py-10">אין לך פגישות מאושרות.</p>}
                    </TabsContent>
                    
                    <TabsContent value="past" className="pt-6">
                        {filteredAppointments.past.length > 0 ? (
                           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredAppointments.past.map(app => <AppointmentCard key={app.id} appointment={app} />)}
                            </div>
                        ) : <p className="text-center text-gray-500 py-10">אין לך פגישות עבר.</p>}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
