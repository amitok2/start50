import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, CheckSquare, Library, Compass, ArrowLeft, Crown, Sparkles, TrendingUp, Target, Lightbulb, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EntrepreneurshipHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 py-8 sm:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-200 mb-6">
            <Crown className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-orange-700">המסע שלך ליזמות ועצמאות</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="gradient-text">המקום לעצמאית</span> 🚀
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            חלמת על עסק משלך בגיל 50+? כאן תמצאי את כל השלבים, הכלים והמדריכים שילוו אותך 
            מהרעיון הראשון ועד להצלחה המלאה של העסק שלך! 💫
          </p>
        </motion.div>

        {/* Main Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* Card 1: הצ'ק-ליסט המלא */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link to={createPageUrl("BusinessStartupChecklist")}>
              <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <CheckSquare className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <Badge className="bg-orange-100 text-orange-700 mb-2">שלב 1</Badge>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        מפת הדרכים המלאה שלך
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
                    צ'ק-ליסט מפורט ומסודר שמלווה אותך צעד אחר צעד: 
                    מבדיקת הרעיון, דרך הקמת העסק, ועד ההצלחה הגדולה! 
                    כל משימה עם הסבר ברור ודוגמאות מעשיות.
                  </p>
                  
                  <div className="flex items-center gap-2 text-orange-600 font-semibold">
                    <span>בואי נתחיל במסע</span>
                    <ArrowLeft className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          {/* Card 2: ארגז הכלים */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to={createPageUrl("ResourceLibrary")}>
              <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Library className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <Badge className="bg-purple-100 text-purple-700 mb-2">שלב 2</Badge>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        ארגז הכלים המלא
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
                    מדריכים מפורטים, תבניות מוכנות, וידאואים מעשיים וכלים דיגיטליים 
                    שיעזרו לך בכל שלב: שיווק, פיננסים, בניית נוכחות דיגיטלית ועוד.
                  </p>
                  
                  <div className="flex items-center gap-2 text-purple-600 font-semibold">
                    <span>לארגז הכלים המלא</span>
                    <ArrowLeft className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>

        {/* Secondary Cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {/* Card 3: מצפן יזמי */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to={createPageUrl("EntrepreneurshipPathfinder")}>
              <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border border-rose-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Compass className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        מצפן יזמי - האם זה בשבילי?
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base mb-3">
                        עוד לא בטוחה אם יזמות זה בשבילך? עשי את האבחון האישי ונגלה יחד!
                      </p>
                      <div className="text-rose-600 font-semibold text-sm flex items-center gap-1">
                        <span>התחילי את האבחון</span>
                        <ArrowLeft className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          {/* Card 4: קבוצת ווטסאפ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a href="https://chat.whatsapp.com/KRiY8hN94vjKmTi4Jk8i6f" target="_blank" rel="noopener noreferrer">
              <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        קבוצת היזמיות בוואטסאפ
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base mb-3">
                        הצטרפי לקהילה של יזמיות תומכות - שאלות, עצות והשראה בזמן אמת!
                      </p>
                      <div className="text-green-600 font-semibold text-sm flex items-center gap-1">
                        <span>💬 הצטרפות לקבוצה</span>
                        <ArrowLeft className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          </motion.div>
        </div>

        {/* Success Stories / Motivation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white border-0 shadow-2xl">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3">
                  את לא לבד במסע הזה! 💪
                </h3>
                <p className="text-white/95 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
                  מאות נשים בגיל 50+ כבר התחילו את המסע שלהן ליזמות ועצמאות. 
                  עם הכלים הנכונים, הליווי המקצועי והקהילה התומכת - גם את יכולה להגשים את החלום.
                  <br/>
                  <span className="font-bold text-xl block mt-3">בואי נתחיל את המסע ביחד! ✨</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Back to Profile Button */}
        <div className="text-center mt-8">
          <Button asChild variant="outline" size="lg" className="border-rose-300 text-rose-600 hover:bg-rose-50">
            <Link to={createPageUrl("MyProfile")}>
              <ArrowLeft className="w-5 h-5 ml-2" />
              חזרה לפרופיל שלי
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}