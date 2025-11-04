import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { User } from '@/api/entities';
import { SendEmail } from '@/api/integrations'; // Using integration directly

export default function PaymentSuccess() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const handleNewUser = async () => {
            try {
                const currentUser = await User.me();
                setUser(currentUser);

                const queryParams = new URLSearchParams(location.search);
                const isNewUser = queryParams.get('new_user') === 'true';

                if (isNewUser) {
                    const appUrl = window.location.origin;
                    const name = currentUser.full_name.split(' ')[0] || 'יקירה';
                    const subject = `ברוכה הבאה ל-ReStart 50+, ${name}!`;
                    const body = `
                        <div dir="rtl" style="font-family: Arial, sans-serif; text-align: right; color: #333;">
                            <h1 style="color: #d63384;">היי ${name}, איזו התרגשות!</h1>
                            <p>רצינו להגיד לך תודה ענקית שהצטרפת לקהילת ReStart 50+.</p>
                            <p>המסע החדש שלך מתחיל ממש עכשיו, ואנחנו כאן כדי ללוות אותך בכל צעד.</p>
                            <p>מה תרצי לעשות עכשיו?</p>
                            <ul style="list-style-type: none; padding: 0;">
                                <li style="margin-bottom: 10px;">✨ <a href="${appUrl}${createPageUrl('MyProfile')}" style="color: #8b5cf6;">להכיר את האזור האישי שלך</a></li>
                                <li style="margin-bottom: 10px;">🤝 <a href="${appUrl}${createPageUrl('SocialTinder')}" style="color: #8b5cf6;">להכיר חברות חדשות בקהילה</a></li>
                                <li style="margin-bottom: 10px;">📚 <a href="${appUrl}${createPageUrl('CoursesAndEvents')}" style="color: #8b5cf6;">לגלות את הקורסים והסדנאות שלנו</a></li>
                            </ul>
                            <p>אם יש לך שאלות, אנחנו תמיד כאן בשבילך.</p>
                            <p>באהבה,<br>צוות ReStart 50+</p>
                        </div>
                    `;
                    
                    await SendEmail({
                        to: currentUser.email,
                        subject,
                        body
                    });
                    
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            } catch (error) {
                console.error("Error handling new user flow:", error);
            } finally {
                setIsLoading(false);
            }
        };

        handleNewUser();
    }, [location.search]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-rose-50">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
        );
    }
    
    return (
        <div className="min-h-screen py-20 px-4 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
            <Card className="max-w-lg w-full text-center shadow-2xl border-0">
                <CardHeader className="pt-8">
                    <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-12 h-12" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900">הצטרפת בהצלחה!</CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                        ברוכה הבאה לקהילת ReStart 50+. אנחנו כל כך שמחות שאת כאן.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-8">
                    <p className="text-gray-700 mb-6">
                        המנוי שלך פעיל. מייל עם פרטים נוספים נשלח אלייך.
                        זה הזמן להתחיל את המסע החדש שלך!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" asChild className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-lg">
                            <Link to={createPageUrl("MyProfile")}>
                                כניסה לאזור האישי
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link to={createPageUrl("Home")}>
                                <ArrowLeft className="w-4 h-4 ml-2" />
                                חזרה לדף הבית
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}