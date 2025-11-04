
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Compass, ArrowLeft, Sparkles } from 'lucide-react';

export default function PathfinderResultWidget({ result }) {
  if (!result) return null;

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-xl overflow-hidden">
        <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        הצצה לעתיד היזמי שלך!
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                        גילינו את אב הטיפוס היזמי שמתאים לך במיוחד: <span className="font-semibold text-green-800">{result.archetype}</span>.
                        <br/>
                        זהו הצעד הראשון במסע מרגש! לחצי לצפייה בדוח המלא, הכולל ניתוח מעמיק, נקודות חוזק, והמלצות אישיות שיאירו לך את הדרך.
                    </p>
                </div>
                <Button asChild size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full mt-4 md:mt-0 flex-shrink-0">
                    <Link to={createPageUrl("EntrepreneurshipPathfinder")}>
                        צפייה בדוח המלא
                        <ArrowLeft className="w-5 h-5 mr-2" />
                    </Link>
                </Button>
            </div>
        </CardContent>
    </Card>
  );
}
