import React from 'react';
import { User } from '@/api/entities';
import BadgeSystem from '../components/gamification/BadgeSystem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function MyBadges() {
    const [user, setUser] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await User.me();
                setUser(currentUser);
            } catch (error) {
                console.error("Error loading user:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <p>נדרשת התחברות לצפייה בתגים</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Link to={createPageUrl('MyProfile')}>
                            <Button variant="ghost" size="sm">
                                <ArrowRight className="w-4 h-4 ml-2" />
                                חזרה לפרופיל
                            </Button>
                        </Link>
                    </div>
                    
                    <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-xl">
                        <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="w-8 h-8" />
                            </div>
                            <h1 className="text-3xl font-bold mb-2">התגים וההישגים שלי</h1>
                            <p className="text-purple-100">
                                כל תג מסמל הישג מיוחד בדרך שלך בקהילה שלנו
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Badge System */}
                <BadgeSystem userEmail={user.email} />

                {/* Tips Card */}
                <Card className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-800">
                            <Star className="w-5 h-5" />
                            טיפים לזכייה בתגים נוספים
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-amber-700">
                        <ul className="space-y-2 text-sm">
                            <li>• הצטרפי לקורסים וסדנאות כדי לזכות בתגי למידה</li>
                            <li>• צרי חיבורים חברתיים חדשים דרך "הכירי חברות"</li>
                            <li>• פרסמי בקהילה ועזרי לחברות אחרות</li>
                            <li>• הגדירי מטרות אישיות ועקבי אחרי ההתקדמות</li>
                            <li>• קבעי פגישות עם מנטוריות לליווי מקצועי</li>
                        </ul>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}