import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

export default function CareerAssessmentWidget() {
    return (
        <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg border-0">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">
                    מוכנה לגלות את הייעוד הבא שלך?
                </CardTitle>
                <CardDescription className="text-gray-600">
                    שאלון אבחון קצר ומדויק שיעזור לך להבין מה הכי נכון לך עכשיו - קריירה חדשה כשכירה, או הדרך המרגשת לעצמאות.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center">
                    <div className="mb-6 p-8 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border-2 border-rose-100">
                        <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Rocket className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                            🎯 האבחון האישי שלך מחכה!
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            גלי מה הכיוון המתאים לך ביותר בשלב הזה של החיים - עבודה כשכירה או מעבר לעצמאות מלאה.
                            קבלי המלצות מותאמות אישית והתחילי את המסע החדש שלך.
                        </p>
                    </div>
                    
                    <Button asChild size="lg" className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-full shadow-lg transform hover:scale-105 transition-transform">
                        <Link to={createPageUrl("EntrepreneurshipPathfinder")}>
                            <Rocket className="w-5 h-5 ml-2" />
                            אני רוצה להתחיל את האבחון
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}