
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown, Sparkles, Star, Edit, Calendar, Users, Loader2 } from 'lucide-react';
import { useUser } from '../components/auth/UserContext';
import { createPageUrl } from '@/utils';

const mentorBenefits = [
    { text: "במה וחשיפה למאות לקוחות פוטנציאליות בקהילה", icon: Sparkles },
    { text: "ניהול דף אינטרנט אישי הכולל פרופיל, מאמרים ופגישות", icon: Edit },
    { text: "מערכת לניהול פגישות ותיאום קל ונוח עם מתעניינות", icon: Calendar },
    { text: "קהילת מומחיות - נטוורקינג ותמיכה הדדית עם מומחיות אחרות", icon: Users },
    { text: "כל יתרונות מנוי הפרימיום של הקהילה כלולים", icon: Check },
];

export default function MentorSubscribe() {
    const { currentUser, isLoadingUser } = useUser();
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const isTrialUser = currentUser &&
                       currentUser.subscription_status === 'active' &&
                       currentUser.subscription_type === 'trial';
    
    const handlePurchase = () => {
        setIsProcessing(true);
        if (isTrialUser) {
            navigate(createPageUrl("MentorDashboard"));
        } else {
            // Updated mentor-specific payment link
            const paymentUrl = "https://private.invoice4u.co.il/newsite/he/clearing/public/i4u-clearing?ProductGuid=f396642f-ce9a-419c-bf12-63513e598ff9";
            window.location.href = paymentUrl;
        }
    };

    if (isLoadingUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <div className="mb-16">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                            <Crown className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                            מנוי פרימיום למנטורית
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                        {isTrialUser 
                            ? `שלום ${currentUser.full_name?.split(' ')[0] || 'מומחית'}, את כרגע במנוי ניסיון חינם לחודש!` 
                            : 'הצטרפי כעת, קבלי חשיפה לקהל חדש והפכי לחלק מצוות המומחיות של RSE50.'}
                    </p>
                    {isTrialUser && (
                         <p className="text-lg text-green-700 font-semibold mt-4">
                            המנוי שלך בתוקף עד {currentUser.subscription_end_date ? new Date(currentUser.subscription_end_date).toLocaleDateString('he-IL') : ''}.
                        </p>
                    )}
                </div>

                {/* הודעת "לא תשלום כפול" */}
                <div className="mb-12 max-w-3xl mx-auto">
                    <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-6 rounded-2xl border-2 border-purple-300 shadow-lg">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                                <Star className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-purple-800">כבר חברה משלמת בקהילת ReStart 50+? מצוין!</h3>
                        </div>
                        <p className="text-purple-700 text-lg leading-relaxed">
                            מנוי המומחית שלך <span className="font-semibold">כולל בתוכו את כל הטבות מנוי הפרימיום של הקהילה</span>, בנוסף לכל הכלים הייעודיים שתקבלי כמנטורית. 
                            <span className="font-semibold"> את לא משלמת כפול</span> – את פשוט משדרגת את החוויה, החשיפה וההשפעה שלך, וזוכה מכל העולמות במחיר אחד! 
                            <span className="font-semibold text-purple-800"> הזדמנות כפולה לצמוח, לתרום ולהצליח.</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-12 max-w-4xl mx-auto">
                <Card className="border-2 border-purple-500 shadow-2xl relative bg-gradient-to-br from-white via-purple-50 to-pink-50">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-bold px-6 py-2 rounded-full uppercase tracking-wider flex items-center gap-2 shadow-lg">
                            <Star className="w-4 h-4"/>
                            מנוי מומחית
                        </div>
                    </div>
                    <CardHeader className="p-8 text-center">
                        <CardTitle className="text-3xl font-bold mb-4">הצטרפות לצוות המומחיות</CardTitle>
                        <CardDescription className="text-lg text-gray-600">
                            {isTrialUser ? 'כרגע את נהנית מכל ההטבות - בחינם!' : 'הצטרפי עכשיו ותיהני מגישה מלאה לכל הכלים והקהילה'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="text-center md:border-l md:pl-8">
                                <p className="text-5xl font-extrabold text-gray-900 mb-2">55<span className="text-2xl font-medium">₪</span></p>
                                <p className="text-gray-600">לחודש</p>
                                <Button
                                    onClick={handlePurchase}
                                    disabled={isProcessing}
                                    className={`w-full mt-6 text-lg py-3 px-8 rounded-full font-bold shadow-lg transition-transform transform hover:scale-105 ${
                                        isTrialUser
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                                        : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                                    }`}
                                >
                                    {isProcessing
                                        ? <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                        : (isTrialUser ? 'חזרה ללוח הבקרה' : 'הצטרפות ותשלום')
                                    }
                                </Button>
                                <p className="text-sm text-gray-500 mt-4">
                                    {isTrialUser ? 'את כבר חלק מהצוות!' : 'תשלום מאובטח • ביטול בכל עת'}
                                </p>
                            </div>

                            <ul className="space-y-4 text-gray-700 text-right">
                                {mentorBenefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-4 flex-row-reverse">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <benefit.icon className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <span className="flex-1 font-semibold">{benefit.text}</span>
                                    </li>

                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
