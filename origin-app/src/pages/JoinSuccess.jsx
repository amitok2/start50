import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, BookOpen, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function JoinSuccess() {
  useEffect(() => {
    document.title = "הצטרפת בהצלחה! | ריסטארט 50+";
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="max-w-2xl mx-auto text-center">
        
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            הצטרפת בהצלחה!
          </h1>
          <p className="text-xl text-gray-600">
            הקוד שלך הופעל! קיבלת <span className="font-bold text-purple-600">חודש מתנה במנוי פרימיום</span>.
            <br/>
            אנחנו כל כך שמחות שהצטרפת למסע שלנו!
          </p>
        </div>

        <Card className="mb-8 shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle>מה עכשיו? בואי נתחיל! 🚀</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-right space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-rose-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold">צרי פרופיל חברתי</h4>
                <p className="text-sm text-gray-600">זה המפתח להכיר חברות חדשות, שותפות לדרך או סתם לשיחה טובה על קפה.
                  <Link to={createPageUrl("SocialTinder")} className="text-rose-600 font-semibold ml-1">בואי נתחיל כאן.</Link>
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold">גלי את הקורסים והאירועים</h4>
                <p className="text-sm text-gray-600">יש לנו מגוון רחב של תכנים שמחכים רק לך. עכשיו הכל פתוח בפנייך. 
                  <Link to={createPageUrl("CoursesAndEvents")} className="text-purple-600 font-semibold ml-1">לצפייה בקטלוג.</Link>
                </p>
              </div>
            </div>

             <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold">הכירי את המנטוריות</h4>
                <p className="text-sm text-gray-600">נשים מדהימות עם ניסיון חיים עשיר שמחכות ללוות אותך. מגיעה לך פגישת היכרות חינם!
                  <Link to={createPageUrl("MeetMentors")} className="text-green-600 font-semibold ml-1">למאגר המנטוריות.</Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button
            asChild
            size="lg"
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-4 text-lg rounded-full"
          >
            <Link to={createPageUrl("MyProfile")}>
              <UserCheck className="w-6 h-6 ml-2" />
              לאיזור האישי שלי
            </Link>
          </Button>
          
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="w-full py-4 text-lg"
          >
            <Link to={createPageUrl("Home")}>
              חזרה לדף הבית
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}