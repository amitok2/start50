
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, MapPin, Star, Camera, Clock, Users, Globe, Sparkles, ArrowLeft, Crown, Search, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const checklistSteps = [
  {
    id: 'setup',
    title: 'שלב 1: הקמת הפרופיל',
    icon: <MapPin className="w-6 h-6" />,
    color: 'blue',
    items: [
      { id: 'account', text: 'צרי חשבון Google (אם אין לך)', description: 'השתמשי בחשבון Gmail קיים או צרי חדש' },
      { id: 'claim', text: 'גשי ל-Google My Business והוסיפי את העסק שלך', description: 'חפשי את שם העסק ובדקי אם הוא כבר קיים' },
      { id: 'verify', text: 'אמתי את הבעלות על העסק', description: 'Google ישלחו קוד אימות בדואר, SMS או טלפון' },
      { id: 'category', text: 'בחרי קטגוריה מדויקת לעסק', description: 'למשל: יועצת עסקית, מאמנת אישית, מעצבת גרפית' }
    ]
  },
  {
    id: 'details',
    title: 'שלב 2: השלמת פרטים בסיסיים',
    icon: <Globe className="w-6 h-6" />,
    color: 'green',
    items: [
      { id: 'address', text: 'הוסיפי כתובת מדויקת', description: 'אם זה עסק ביתי, בחרי "אני משרתת לקוחות במיקום שלהם"' },
      { id: 'hours', text: 'הגדירי שעות פעילות', description: 'ציני מתי את זמינה לקבל פניות ולקוחות' },
      { id: 'phone', text: 'הוסיפי מספר טלפון ואתר', description: 'ודאי שהפרטים נכונים ומעודכנים' },
      { id: 'description', text: 'כתבי תיאור קצר ומושך על העסק', description: 'עד 750 תווים - הסבירי מה את עושה ולמי את מתאימה' }
    ]
  },
  {
    id: 'visual',
    title: 'שלב 3: ויזואליה ותמונות',
    icon: <Camera className="w-6 h-6" />,
    color: 'purple',
    items: [
      { id: 'logo', text: 'העלי לוגו של העסק', description: 'תמונה מרבעת, ברורה ומקצועית' },
      { id: 'cover', text: 'הוסיפי תמונת נושא (Cover Photo)', description: 'תמונה רחבה שמספרת את הסיפור של העסק' },
      { id: 'gallery', text: 'העלי גלריית תמונות', description: '5-10 תמונות איכותיות של המוצרים/שירותים/סביבת העבודה' },
      { id: 'video', text: 'העלי סרטון קצר (אופציונלי)', description: 'סרטון של 30 שניות שמציג את העסק' }
    ]
  },
  {
    id: 'optimize',
    title: 'שלב 4: אופטימיזציה וחשיפה',
    icon: <Search className="w-6 h-6" />,
    color: 'orange',
    items: [
      { id: 'keywords', text: 'הוסיפי מילות מפתח רלוונטיות', description: 'בתיאור ובמאפיינים של העסק' },
      { id: 'posts', text: 'פרסמי עדכונים ופוסטים', description: 'תוכן שוטף משפר את הדירוג וה-SEO' },
      { id: 'q_and_a', text: 'הוסיפי שאלות ותשובות נפוצות', description: 'ענה על שאלות שלקוחות שואלים הכי הרבה' },
      { id: 'attributes', text: 'הוסיפי מאפיינים מיוחדים', description: 'למשל: "בבעלות נשים", "שירות אונליין", "נגישות לכיסא גלגלים"' }
    ]
  },
  {
    id: 'reviews',
    title: 'שלב 5: ניהול ביקורות',
    icon: <Star className="w-6 h-6" />,
    color: 'yellow',
    items: [
      { id: 'ask_reviews', text: 'בקשי מלקוחות מרוצות לכתוב ביקורת', description: 'שלחי להן קישור ישיר לכתיבת המלצה' },
      { id: 'respond', text: 'תגובי לכל ביקורת - חיובית ושלילית', description: 'תגובה מקצועית משפרת את התדמית' },
      { id: 'monitor', text: 'עקבי אחר הביקורות באופן שוטף', description: 'הגיבי תוך 24-48 שעות' },
      { id: 'improve', text: 'השתמשי בפידבק לשיפור השירות', description: 'למדי מביקורות שלילית ושפרי' }
    ]
  },
  {
    id: 'maintain',
    title: 'שלב 6: תחזוקה שוטפת',
    icon: <Clock className="w-6 h-6" />,
    color: 'pink',
    items: [
      { id: 'update_info', text: 'עדכני מידע בזמן אמת', description: 'שעות פעילות מיוחדות, חגים, סגירות' },
      { id: 'insights', text: 'בדקי את הסטטיסטיקות', description: 'כמה אנשים מצאו אותך? מאיפה הם הגיעו?' },
      { id: 'posts_regular', text: 'פרסמי לפחות פעם בשבוע', description: 'עדכונים, מבצעים, טיפים - שמרי על פעילות' },
      { id: 'messages', text: 'הפעילי הודעות ישירות מ-Google', description: 'אפשרי ללקוחות ליצור קשר בקלות' }
    ]
  }
];

export default function GoogleMyBusinessGuide() {
  const [completedItems, setCompletedItems] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState(new Set(['setup']));

  useEffect(() => {
    const saved = localStorage.getItem('gmb-guide-completed');
    if (saved) {
      setCompletedItems(new Set(JSON.parse(saved)));
    }
  }, []);

  const toggleItem = (itemId) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);
    localStorage.setItem('gmb-guide-completed', JSON.stringify([...newCompleted]));
  };

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getTotalItems = () => {
    return checklistSteps.reduce((total, section) => total + section.items.length, 0);
  };

  const getCompletedCount = () => {
    return completedItems.size;
  };

  const getProgressPercentage = () => {
    return Math.round((getCompletedCount() / getTotalItems()) * 100);
  };

  const getSectionProgress = (section) => {
    const sectionCompleted = section.items.filter(item => completedItems.has(item.id)).length;
    return Math.round((sectionCompleted / section.items.length) * 100);
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-700', light: 'bg-blue-50', border: 'border-blue-200' },
      green: { bg: 'bg-green-500', text: 'text-green-700', light: 'bg-green-50', border: 'border-green-200' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-700', light: 'bg-purple-50', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-50', border: 'border-orange-200' },
      yellow: { bg: 'bg-yellow-500', text: 'text-yellow-700', light: 'bg-yellow-50', border: 'border-yellow-200' },
      pink: { bg: 'bg-pink-500', text: 'text-pink-700', light: 'bg-pink-50', border: 'border-pink-200' }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div style={{direction: 'rtl'}} className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200 mb-6">
            <Crown className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">מדריך בלעדי מספריית המשאבים</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            מדריך Google My Business 🗺️
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            הקימי נוכחות מקצועית ב-Google והגיעי ללקוחות חדשות דרך החיפוש והמפות
          </p>
          
          {/* Progress Overview */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-right">
                  <h3 className="text-2xl font-bold text-gray-900">ההתקדמות שלך</h3>
                  <p className="text-gray-600">השלמת {getCompletedCount()} מתוך {getTotalItems()} משימות</p>
                </div>
                <div className="w-full md:w-64">
                  <Progress value={getProgressPercentage()} className="h-3 mb-2" />
                  <p className="text-center text-sm font-semibold text-blue-700">{getProgressPercentage()}% הושלם</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Note */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <MapPin className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">למה Google My Business כל כך חשוב?</h3>
                <p className="text-blue-50">
                  כ-46% מכל החיפושים ב-Google הם חיפושים מקומיים. אם אין לך פרופיל Google My Business, 
                  את מפספסת חשיפה עצומה ללקוחות פוטנציאליות באזור שלך! 🚀
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checklist Sections */}
        <div className="space-y-6">
          {checklistSteps.map((section, sectionIndex) => {
            const colors = getColorClasses(section.color);
            const sectionProgress = getSectionProgress(section);
            const isExpanded = expandedSections.has(section.id);
            
            return (
              <Card key={section.id} className={`border-0 shadow-lg overflow-hidden ${colors.light} ${colors.border}`}>
                <CardHeader 
                  className="cursor-pointer transition-all duration-200 hover:bg-white/50"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center text-white shadow-md`}>
                        {section.icon}
                      </div>
                      <div>
                        <CardTitle className={`text-xl font-bold ${colors.text}`}>
                          {section.title}
                        </CardTitle>
                        <div className="flex items-center gap-3 mt-2">
                          <Progress value={sectionProgress} className="w-32 h-2" />
                          <span className="text-sm font-medium text-gray-600">{sectionProgress}%</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={`${colors.bg} text-white`}>
                      {section.items.filter(item => completedItems.has(item.id)).length}/{section.items.length}
                    </Badge>
                  </div>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent className="pt-0 pb-6">
                    <div className="space-y-4">
                      {section.items.map((item) => {
                        const isCompleted = completedItems.has(item.id);
                        return (
                          <div
                            key={item.id}
                            className={`flex items-start gap-4 p-4 rounded-lg border transition-all duration-200 ${
                              isCompleted 
                                ? 'bg-white/80 border-green-200 shadow-sm' 
                                : 'bg-white/60 border-gray-200 hover:bg-white/80 hover:shadow-md'
                            }`}
                          >
                            <Checkbox
                              id={item.id}
                              checked={isCompleted}
                              onCheckedChange={() => toggleItem(item.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <label
                                htmlFor={item.id}
                                className={`font-semibold cursor-pointer block ${
                                  isCompleted ? 'line-through text-gray-500' : colors.text
                                }`}
                              >
                                {item.text}
                              </label>
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            </div>
                            {isCompleted && (
                              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Completion Celebration */}
        {getProgressPercentage() === 100 && (
          <Card className="mt-12 bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-4">כל הכבוד! סיימת את ההגדרה!</h2>
              <p className="text-xl mb-6">
                הפרופיל שלך ב-Google My Business מוכן והעסק שלך כבר חשוף ללקוחות חדשות! 
                זכרי לעדכן ולפרסם באופן קבוע כדי לשמור על חשיפה גבוהה.
              </p>
              <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-50 font-bold">
                <a href="https://business.google.com" target="_blank" rel="noopener noreferrer">
                  <Globe className="w-5 h-5 mr-2" />
                  כניסה ל-Google My Business
                </a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pro Tips */}
        <Card className="mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-purple-800">
              <Sparkles className="w-6 h-6" />
              טיפים חשובים להצלחה
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-purple-900">
            <p><strong>פרסמי באופן קבוע:</strong> Google אוהב פרופילים פעילים! העלי עדכונים, מבצעים וטיפים לפחות פעם בשבוע.</p>
            <p><strong>תגובי מהר לביקורות:</strong> תגובה מהירה ומקצועית משפרת את הדירוג והאמון של לקוחות.</p>
            <p><strong>השתמשי בתמונות איכותיות:</strong> פרופילים עם תמונות מקבלים פי 2 יותר לחיצות מאשר כאלו ללא תמונות.</p>
            <p><strong>מלאי את כל השדות:</strong> פרופיל שמולא ב-100% מקבל עדיפות גבוהה יותר בתוצאות החיפוש.</p>
          </CardContent>
        </Card>

        {/* Footer Navigation */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="border-blue-300 text-blue-600 hover:bg-blue-50">
            <Link to={createPageUrl("ResourceLibrary")}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              חזרה לספריית המשאבים
            </Link>
          </Button>
        </div>

        {/* Back to Entrepreneurship Hub */}
        <div className="text-center mt-6">
          <Button asChild variant="outline" size="lg" className="border-orange-300 text-orange-600 hover:bg-orange-50">
            <Link to={createPageUrl("EntrepreneurshipHub")}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              חזרה לארגז הכלים לעצמאית
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
