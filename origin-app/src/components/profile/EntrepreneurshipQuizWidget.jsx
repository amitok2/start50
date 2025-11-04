
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Lightbulb, ArrowLeft, Compass } from 'lucide-react';

export default function EntrepreneurshipQuizWidget() {
  return (
    <Card className="bg-gradient-to-br from-orange-50 to-rose-50 border-orange-200 shadow-xl overflow-hidden">
        <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Compass className="w-10 h-10 text-white" />
                </div>
                <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        מצפן יזמי: האם את מוכנה להיות עצמאית?
                    </h3>
                    <p className="text-gray-600">
                        גלי את הפוטנציאל היזמי שלך דרך שאלון אבחון אישי מבוסס AI וקבלי מפת דרכים מותאמת אישית.
                    </p>
                </div>
                <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-full mt-4 md:mt-0 flex-shrink-0">
                    <Link to={createPageUrl("EntrepreneurshipPathfinder")}>
                        התחילי את האבחון
                        <ArrowLeft className="w-5 h-5 mr-2" />
                    </Link>
                </Button>
            </div>
        </CardContent>
    </Card>
  );
}
