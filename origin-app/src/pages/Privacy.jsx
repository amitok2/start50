
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Mail, Lock, Eye, FileText, Phone } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🛡 מדיניות פרטיות – <span className="gradient-text">ReStart 50<span className="text-sm relative top-[-0.1em]">+</span></span>
          </h1>
          <p className="text-lg text-gray-600">
            עודכן לאחרונה: יוני 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              כללי
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              אנו מכבדים את פרטיות המשתמשות בפלטפורמה שלנו. מדיניות פרטיות זו נועדה להסביר איזה מידע אנו אוספים, כיצד אנו משתמשים בו, ואיך אנו מגנים עליו.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-500" />
              מידע שאנו אוספים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              בעת שימושך באתר או באפליקציה שלנו, אנו עשויים לאסוף את המידע הבא:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                <span>שם מלא, כתובת דוא"ל, מספר טלפון, גיל / שנת לידה (במידה וניתן)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                <span>מידע על קורסים / פעילויות שבחרת</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                <span>פרטי תשלום (באמצעות ספק סליקה מאובטח – לא נשמרים אצלנו ישירות)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                <span>תוכן שאת מוסרת ביוזמתך (טפסים, שאלונים, פרופיל אישי)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" />
              שימוש במידע
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">המידע שאנו אוספים משמש ל:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>יצירת פרופיל משתמש ושיפור חוויית השירות</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>שליחת עדכונים, תזכורות, הצעות או מידע רלוונטי</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>מתן גישה לתוכן, קורסים ושירותים מותאמים אישית</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>ניתוח סטטיסטי פנימי לצורך שיפור הפלטפורמה</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>יצירת קשר במקרה הצורך (תמיכה, שירות לקוחות וכדומה)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-500" />
              אבטחת מידע
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-gray-700">
              <p>
                אנו עושים שימוש באמצעי אבטחה מתקדמים כדי להגן על המידע שלך, כולל הצפנת מידע, שימוש בחיבורים מאובטחים (HTTPS) ושמירה בשרתים מאובטחים.
              </p>
              <p>
                תשלומים מתבצעים דרך ספק סליקה מאובטח בלבד (כגון: קארדקום / משולם / Tranzila וכו').
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Third Party Sharing */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              מסירת מידע לצד שלישי
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">לא נעביר את פרטיך לצדדים שלישיים אלא אם כן:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                <span>הדבר נדרש על פי חוק או צו שיפוטי</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                <span>לצורך מתן שירות מטעמנו (כגון ספק סליקה או מערכות דיוור), בכפוף להסכמי סודיות</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-500" />
              שימוש בעוגיות (Cookies)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              האתר עושה שימוש בקבצי cookies לשם זיהוי, שמירת העדפות משתמש ושיפור חווית הגלישה. תוכלי לחסום או למחוק אותם דרך הגדרות הדפדפן.
            </p>
          </CardContent>
        </Card>

        {/* User Rights */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-500" />
              זכויות המשתמשת
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">לכל משתמשת יש את הזכות:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                <span>לעיין במידע שנשמר אודותיה</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                <span>לבקש לתקן מידע שגוי</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                <span>לבקש למחוק את המידע (בכפוף לדרישות החוק)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-rose-500" />
              יצירת קשר
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              בכל שאלה או בקשה בעניין פרטיותך – ניתן לפנות אלינו:
            </p>
            <div className="bg-white rounded-lg p-4 border border-rose-200">
              <a 
                href="mailto:restart@rse50.co.il" 
                className="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium"
              >
                <Mail className="w-4 h-4" />
                restart@rse50.co.il
              </a>
              <a 
                href="tel:+972508873773" 
                className="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium mt-2"
              >
                <Phone className="w-4 h-4" />
                <span>050-8873773</span>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">שימי לב:</span> מדיניות זו עשויה להתעדכן מעת לעת. נפרסם תאריך עדכון בראש העמוד.
          </p>
        </div>
      </div>
    </div>
  );
}
