import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Crown, Sparkles } from 'lucide-react';

export default function SubscriptionGate({ title, message }) {
  return (
    <div className="flex items-center justify-center py-12 px-4">
      <Card className="max-w-lg mx-auto text-center shadow-2xl border-2 border-purple-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-purple-800">
            {title || "זהו תוכן פרימיום, בדיוק בשבילך!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700">
            {message || "כדי לקבל גישה מלאה לעולם שלם של הזדמנויות, קורסים, מנטוריות וקשרים חדשים, הצטרפי אלינו למנוי פרימיום."}
          </p>
          <Button 
            asChild 
            size="lg" 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold text-lg"
          >
            <Link to={createPageUrl('Join')}>
              <Sparkles className="w-5 h-5 ml-2" />
              אני רוצה להצטרף
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}