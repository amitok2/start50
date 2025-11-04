import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Crown, Calendar } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

export default function ExpiredSubscriptionBanner({ user }) {
  const endDate = user.subscription_end_date ? new Date(user.subscription_end_date) : null;
  const wasTrialUser = user.subscription_type === 'trial';

  return (
    <Card className="border-2 border-red-400 bg-gradient-to-r from-red-50 to-orange-50 shadow-xl">
      <CardContent className="p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {wasTrialUser ? '⏰ תקופת הניסיון שלך הסתיימה' : '⏰ המנוי שלך פג תוקף'}
          </h2>

          {endDate && (
            <p className="text-lg text-gray-700 mb-4">
              <Calendar className="w-5 h-5 inline ml-2" />
              {wasTrialUser ? 'תקופת הניסיון' : 'המנוי'} שלך הסתיים ב-
              <strong className="text-red-600"> {format(endDate, 'dd/MM/yyyy', { locale: he })}</strong>
            </p>
          )}

          <div className="bg-white rounded-xl p-6 mb-6 text-right">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              💝 מה את מפסידה ללא מנוי פעיל:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold">✗</span>
                <span>גישה לדאשבורד האישי שלך</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold">✗</span>
                <span>יכולת להכיר חברות חדשות</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold">✗</span>
                <span>גישה לקורסים והכשרות</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold">✗</span>
                <span>ליווי מנטוריות מקצועיות</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold">✗</span>
                <span>כלים ליזמות ועצמאות</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold">✗</span>
                <span>קהילה תומכת ופורומים</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <Button 
              asChild 
              size="lg" 
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xl py-6"
            >
              <Link to={createPageUrl('Subscribe')}>
                <Crown className="w-6 h-6 ml-2" />
                חידוש המנוי שלי - רק 55₪ לחודש
              </Link>
            </Button>

            <p className="text-sm text-gray-600">
              💳 תשלום מאובטח • ביטול בכל עת • חזרה מיידית לכל התכנים
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}