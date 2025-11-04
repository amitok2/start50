import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Plus, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ManageMentorsTemp() {
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ניהול מנטוריות (זמני)</h1>
        </div>

        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              מצב זמני - בעיה טכנית
            </CardTitle>
          </CardHeader>
          <CardContent className="text-orange-700">
            <p className="mb-4">
              יש כרגע בעיה טכנית עם מסד הנתונים של המנטוריות. זהו דף זמני שיאפשר לך לעבוד בינתיים.
            </p>
            <p className="mb-4">
              <strong>מה שאפשר לעשות כרגע:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>ליצור מנטוריות חדשות ידנית דרך פונקציית התיקון</li>
              <li>לתקן מנטוריות קיימות שלא עובדות</li>
              <li>לנהל בקשות להצטרפות של מנטוריות דרך לוח הבקרה הראשי</li>
            </ul>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>יצירת מנטורית חדשה</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                כדי ליצור פרופיל מנטורית חדש, השתמשי בכלי התיקון הידני:
              </p>
              <Button asChild className="w-full">
                <Link to={createPageUrl("EmergencyRecovery")}>
                  <Settings className="w-4 h-4 ml-2" />
                  כלי תיקון ויצירת מנטוריות
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ניהול בקשות</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                לאישור בקשות מנטוריות חדשות, חזרי ללוח הבקרה הראשי:
              </p>
              <Button asChild className="w-full" variant="outline">
                <Link to={createPageUrl("AdminDashboard")}>
                  חזרה ללוח הבקרה
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">הוראות לפתרון זמני</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <ol className="list-decimal list-inside space-y-2">
              <li>כדי ליצור מנטורית חדשה - השתמשי ב"כלי תיקון ויצירת מנטוריות"</li>
              <li>כדי לתקן מנטורית קיימת שלא עובדת - השתמשי באותו כלי עם המייל של המנטורית</li>
              <li>כדי לאשר בקשות חדשות - עשי זאת דרך לוח הבקרה הראשי</li>
              <li>המנטוריות יוכלו לערוך את הפרופיל שלהן דרך "עריכת פרופיל מנטורית" ברגע שהבעיה תיפתר</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}