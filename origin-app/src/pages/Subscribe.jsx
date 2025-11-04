
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Heart, Sparkles, Star, Gift, Library, HeartHandshake, Users, MessageCircle, BookOpen, UserCheck, Briefcase, Loader2, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import { useUser } from '../components/auth/UserContext';
import { createPageUrl } from '@/utils';

export default function Subscribe() {
    const { currentUser, isLoadingUser } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const isTrialUser = currentUser &&
                       currentUser.subscription_status === 'active' &&
                       currentUser.subscription_type === 'trial';

    const handlePremiumPurchase = () => {
        if (isTrialUser) {
            navigate(createPageUrl("MyProfile"));
        } else {
            const premiumPaymentUrl = "https://private.invoice4u.co.il/newsite/he/clearing/public/i4u-clearing?ProductGuid=b459ffe7-18cf-4030-8e7a-2dcb2c80c7dd";
            window.location.href = premiumPaymentUrl;
        }
    };

    if (isLoadingUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link to={createPageUrl("Home")} className="inline-flex items-center text-gray-600 hover:text-rose-600 mb-8">
                    <ArrowLeft className="w-5 h-5 ml-2" />
                    חזרה לדף הבית
                </Link>

                {/* Main Card */}
                <Card className="shadow-2xl border-0 overflow-hidden">
                    <CardContent className="p-8 sm:p-12">
                        {/* Header Section */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full mb-6">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                הגיע הזמן לריסטארט! 🔄
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                                עם מנוי Restart 50 את נהנית מכל הטוב, בלי לעצור.
                            </p>
                            <p className="text-base sm:text-lg text-gray-600 mt-2">
                                55 ₪ בחודש – קל, פשוט ומשתלם.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-start">
                            
                            {/* Right Column - Features List */}
                            <div className="order-2 md:order-1">
                                <ul className="space-y-4 text-gray-700">
                                    <li className="flex items-start gap-3 flex-row-reverse text-right">
                                        <span className="text-2xl flex-shrink-0">🤝</span>
                                        <span className="flex-1">ליווי אישי עם מאמנת או יועצת שתהיה לצדך</span>
                                    </li>
                                    <li className="flex items-start gap-3 flex-row-reverse text-right">
                                        <span className="text-2xl flex-shrink-0">🌟</span>
                                        <span className="flex-1">למעלה מ‑100 מנטוריות שילוו אותך וייתנו השראה</span>
                                    </li>
                                    <li className="flex items-start gap-3 flex-row-reverse text-right">
                                        <span className="text-2xl flex-shrink-0">💸</span>
                                        <span className="flex-1">הנחות על קורסים וסדנאות + גישה לקבוצות תמיכה קטנות</span>
                                    </li>
                                    <li className="flex items-start gap-3 flex-row-reverse text-right">
                                        <span className="text-2xl flex-shrink-0">📚</span>
                                        <span className="flex-1">משאבים ליזמות – מדריכים, תבניות וכלים פרקטיים</span>
                                    </li>
                                    <li className="flex items-start gap-3 flex-row-reverse text-right">
                                        <span className="text-2xl flex-shrink-0">💼</span>
                                        <span className="flex-1">כלים לחיפוש עבודה – ניתוח קו"ח ומעקב אחרי פניות</span>
                                    </li>
                                    <li className="flex items-start gap-3 flex-row-reverse text-right">
                                        <span className="text-2xl flex-shrink-0">🔍</span>
                                        <span className="flex-1">בדיקת כיוון אישית – נזהה יחד מה הכי מתאים לך עכשיו</span>
                                    </li>
                                    <li className="flex items-start gap-3 flex-row-reverse text-right">
                                        <span className="text-2xl flex-shrink-0">💻</span>
                                        <span className="flex-1">שדרוג פרופיל לינקדאין – להראות את החוזקות שלך</span>
                                    </li>
                                    <li className="flex items-start gap-3 flex-row-reverse text-right">
                                        <span className="text-2xl flex-shrink-0">📝</span>
                                        <span className="flex-1">סיוע בקורות חיים והכנה לראיונות</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Left Column - Price Section */}
                            <div className="order-1 md:order-2 text-center md:border-r md:pr-8 flex flex-col justify-center">
                                <p className="text-5xl font-extrabold text-gray-900 mb-2">55<span className="text-2xl font-medium">₪</span></p>
                                <p className="text-gray-600 mb-6">לחודש</p>
                                <Button
                                    onClick={handlePremiumPurchase}
                                    disabled={isLoading}
                                    className={`w-full text-lg py-6 px-8 rounded-full font-bold shadow-lg transition-transform transform hover:scale-105 ${
                                        isTrialUser
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                                        : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700'
                                    }`}
                                >
                                    {isLoading
                                        ? <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                        : (isTrialUser ? 'חזרה למקום האישי שלי' : 'הצטרפי עכשיו')
                                    }
                                </Button>
                                <p className="text-sm text-gray-500 mt-4">
                                    {isTrialUser ? 'כדי ליהנות מהמנוי שלך' : 'תשלום מאובטח • ביטול בכל עת • ללא התחייבות'}
                                </p>
                            </div>

                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Trust Elements */}
            <div className="mt-16 max-w-3xl mx-auto text-center">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">קהילה פעילה</h3>
                        <p className="text-gray-600 text-sm">מעל 1000 נשים פעילות בקהילה</p>
                    </div>
                    <a href={`https://wa.me/972508873773?text=${encodeURIComponent('שלום, פונה מריסטרט 50+')}`} target="_blank" rel="noopener noreferrer" className="block text-center cursor-pointer transition-transform hover:scale-105">
                        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="w-8 h-8 text-pink-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">תמיכה 24/7</h3>
                        <p className="text-gray-600 text-sm">נהיה כאן בשבילך בכל שעה</p>
                    </a>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-orange-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">תוכן איכותי</h3>
                        <p className="text-gray-600 text-sm">קורסים וחומרים מתעדכנים</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
