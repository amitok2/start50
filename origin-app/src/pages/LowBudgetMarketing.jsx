import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Users, 
  MessageCircle, 
  Camera, 
  Mail, 
  Share2, 
  Gift, 
  Star,
  Lightbulb,
  DollarSign,
  Target,
  Zap,
  BookOpen,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const CampaignIdea = ({ icon, title, cost, effort, description, tips, examples }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getCostColor = (cost) => {
    switch(cost) {
      case 'חינם': return 'bg-green-100 text-green-800';
      case 'זול': return 'bg-yellow-100 text-yellow-800';
      case 'בינוני': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffortColor = (effort) => {
    switch(effort) {
      case 'קל': return 'bg-green-100 text-green-800';
      case 'בינוני': return 'bg-yellow-100 text-yellow-800';
      case 'דורש מאמץ': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
      <CardHeader onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
              {React.createElement(icon, { className: "w-6 h-6 text-white" })}
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge className={getCostColor(cost)}>{cost}</Badge>
                <Badge className={getEffortColor(effort)}>{effort}</Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            {isExpanded ? '−' : '+'}
          </Button>
        </div>
        <CardDescription className="mt-3">{description}</CardDescription>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="border-t bg-gray-50">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                טיפים ליישום:
              </h4>
              <ul className="list-disc pr-5 space-y-1 text-gray-700">
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                דוגמאות מעשיות:
              </h4>
              <ul className="list-disc pr-5 space-y-1 text-gray-700">
                {examples.map((example, index) => (
                  <li key={index}>{example}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default function LowBudgetMarketing() {
  const campaignIdeas = [
    {
      icon: Heart,
      title: "שיתוף סיפור אישי",
      cost: "חינם",
      effort: "קל",
      description: "שתפי את הסיפור שלך - למה התחלת את העסק, מה המניע שלך, איך זה משנה חיים.",
      tips: [
        "כתבי בכנות ובפשטות - אנשים מתחברים לאותנטיות",
        "שתפי גם קשיים וחששות, לא רק הצלחות",
        "הוסיפי תמונה אישית או מאחורי הקלעים",
        "שאלי שאלה בסוף הפוסט כדי לעודד תגובות"
      ],
      examples: [
        "\"איך החלטתי בגיל 52 להתחיל מחדש ולפתוח סטודיו יוגה\"",
        "\"הטעות הכי גדולה שעשיתי בעסק ומה למדתי ממנה\"",
        "\"למה עזבתי את המשרה הקבועה והקמתי עסק בייקרי בבית\""
      ]
    },
    {
      icon: Users,
      title: "שותפויות עם עסקים מקומיים",
      cost: "חינם",
      effort: "בינוני",
      description: "יצירת קשרים עם עסקים אחרים באזור שלך לקידום הדדי.",
      tips: [
        "בחרי עסקים שמשלימים אותך, לא מתחרים",
        "הציעי חילופי שירותים במקום כסף",
        "יצרי אירוע או סדנה משותפת",
        "שתפי את הלקוחות של השותפה ברשתות החברתיות"
      ],
      examples: [
        "יועצת תזונה + מאמנת כושר - סדנה על בריאות כוללת",
        "מעצבת פנים + אמנית - תערוכה בבית קפה מקומי",
        "מאפיה + בעלת חנות תה - סדנת 'תה ועוגיות' בסוף השבוע"
      ]
    },
    {
      icon: Camera,
      title: "תוכן מאחורי הקלעים",
      cost: "חינם",
      effort: "קל",
      description: "הראי איך העבודה שלך נעשית, מה קורה מאחורי הקלעים של העסק.",
      tips: [
        "צלמי סרטונים קצרים של תהליך העבודה",
        "הראי את המקום שלך - הבית, המשרד, הסטודיו",
        "ספרי על הכלים והחומרים שאת משתמשת בהם",
        "שתפי את ההכנות לפגישה או להזמנה חדשה"
      ],
      examples: [
        "איך מכינים קייטרינג לאירוע של 50 איש",
        "בוקר של מעצבת גרפית - מהקפה ועד ללקוח",
        "הכנת פרחים לחתונה - מהרעיון ועד לביצוע"
      ]
    },
    {
      icon: Gift,
      title: "תחרויות וקמפיינים ויראליים",
      cost: "זול",
      effort: "בינוני",
      description: "יצירת תחרויות פשוטות שמעודדות שיתוף ומביאות חשיפה.",
      tips: [
        "הפרס צריך להיות רלוונטי לקהל היעד שלך",
        "בקשי שיתוף + תיוג חברות (להגדלת החשיפה)",
        "קבעי כללים ברורים ותאריך סיום",
        "הכינירכיבים ויזואליים יפים לתחרות"
      ],
      examples: [
        "\"שתפי תמונה של הקינוח הכי טעים שעשית השבוע וזכי בסדנת בישול\"",
        "\"תגי 3 חברות שמגיע להן פינוק וכולכן תזכו במסאז' קבוצתי\"",
        "\"ספרי במילה אחת איך את מרגישה היום - נגרל זוכה לייעוץ חינם\""
      ]
    },
    {
      icon: MessageCircle,
      title: "שיתוף ידע וטיפים מקצועיים",
      cost: "חינם",
      effort: "קל",
      description: "הפכי את עצמך למומחית על ידי שיתוף עצות וטיפים בתחום שלך.",
      tips: [
        "כתבי פוסטים של 'טיפ השבוע' או 'כך תעשו זאת נכון'",
        "השתמשי במילים פשוטות, לא בג'רגון מקצועי",
        "הוסיפי תמונות או אינפוגרפיקות לכל טיפ",
        "עודדי שאלות ותגובות מהקהל"
      ],
      examples: [
        "5 דרכים לחסוך כסף בעיצוב הבית",
        "איך לבחור את הצמח הנכון לכל חדר בבית",
        "3 תרגילי נשימה שיעזרו לך להירגע במשך היום"
      ]
    },
    {
      icon: Mail,
      title: "רשימת תפוצה אישית",
      cost: "חינם",
      effort: "בינוני",
      description: "בניית קהילה של לקוחות פוטנציאליות שמקבלות תוכן ישירות למייל.",
      tips: [
        "הציעי משהו בחינם בתמורה לכתובת מייל (מדריך, מתכון, רשימת צ'ק)",
        "שלחי מייל אחת לשבוע או לחודש, לא כל יום",
        "כתבי נושא מייל מעניין שגורם לפתוח",
        "שלבי תוכן אישי עם תוכן מקצועי"
      ],
      examples: [
        "מדריך חינם: '7 דרכים לארגן את הבית ב-30 דקות ביום'",
        "רשימת מרכיבים: 'מה תמיד צריך להיות לך במטבח'",
        "צ'ק-ליסט: 'איך להיערך לפגישת עבודה מנצחת'"
      ]
    },
    {
      icon: Share2,
      title: "תוכן שמעודד שיתוף",
      cost: "חינם",  
      effort: "קל",
      description: "יצירת תוכן שאנשים רוצים לשתף - ציטוטים, מימים, אינפוגרפיקות.",
      tips: [
        "צרי ציטוטים מעודדים עם הלוגו שלך",
        "הכיני אינפוגרפיקה עם מידע שימושי",
        "כתבי פוסטים שמתחילים ב'כמו לי אם...'",
        "יצרי תוכן שמדבר על רגשות ולא רק על המוצר"
      ],
      examples: [
        "\"הגיל הכי טוב להתחיל מחדש הוא בדיוק הגיל שאת נמצאת בו עכשיו\"",
        "אינפוגרפיקה: '10 הדברים שכל אישה בת 50+ צריכה לדעת על יזמות'",
        "\"כמו לי אם גם את חולמת להפוך את התחביב שלך למקור הכנסה\""
      ]
    },
    {
      icon: Target,
      title: "פרסום ממוקד באזור",
      cost: "זול",
      effort: "קל", 
      description: "שימוש בקבוצות פייסבוק מקומיות ודרכי פרסום בשכונה.",
      tips: [
        "הצטרפי לקבוצות פייסבוק של השכונה או העיר שלך",
        "שתפי תוכן שימושי, אל תעשי רק פרסומות",
        "תני המלצות וטיפים לאחרות, תהיי נדיבה",
        "השתתפי בדיונים ובשאלות של אחרות"
      ],
      examples: [
        "הקמת סדנאות בבית הקהילה המקומי",
        "שיתוף טיפים לעניין העיר בקבוצת המקום בפייסבוק",
        "הצעת שירותים לבעלי עסקים מקומיים אחרים"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 mb-6">
            <DollarSign className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">שיווק חכם בתקציב קטן</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            רעיונות לקמפיינים <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">בתקציב קטן</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            שיווק לא חייב לעלות הון! הנה 8 רעיונות יצירתיים ומעשיים שיעזרו לך להכיר את העסק שלך לעולם, 
            גם אם התקציב שלך מוגבל. כל רעיון כולל הסבר מפורט, טיפים ליישום ודוגמאות קונקרטיות.
          </p>
        </div>

        {/* מדד הוצאות */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <BookOpen className="w-6 h-6" />
              מדריך לקריאת הסמלים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-gray-800">עלות:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">חינם</Badge>
                    <span className="text-sm text-gray-600">₪0 - רק זמן ויצירתיות</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800">זול</Badge>
                    <span className="text-sm text-gray-600">₪50-200 - השקעה קטנה</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-100 text-orange-800">בינוני</Badge>
                    <span className="text-sm text-gray-600">₪200-500 - השקעה מתונה</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-gray-800">מאמץ נדרש:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">קל</Badge>
                    <span className="text-sm text-gray-600">1-2 שעות, ללא ניסיון קודם</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800">בינוני</Badge>
                    <span className="text-sm text-gray-600">חצי יום עבודה, מעט תכנון</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800">דורש מאמץ</Badge>
                    <span className="text-sm text-gray-600">יום עבודה או יותר</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* רשימת הרעיונות */}
        <div className="space-y-6">
          {campaignIdeas.map((idea, index) => (
            <CampaignIdea key={index} {...idea} />
          ))}
        </div>

        {/* טיפים כלליים */}
        <Card className="mt-12 bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-rose-800">
              <Zap className="w-6 h-6" />
              טיפים זהב לשיווק מוצלח בתקציב קטן
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700"><strong>עקביות חשובה יותר מכמות:</strong> עדיף פוסט אחד איכותי בשבוע מאשר 5 פוסטים חלשים.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700"><strong>תמיד מדדי תוצאות:</strong> עקבי אחר מה עובד - לייקים, שיתופים, הודעות פרטיות.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700"><strong>תגובי לכל תגובה:</strong> אינטראקציה אישית יוצרת לקוחות נאמנות.</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700"><strong>היי אותנטית:</strong> אנשים קונים מאנשים, לא מחברות. תני לאישיות שלך לבוא לביטוי.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700"><strong>שימי דגש על ערך:</strong> מה הלקוחה תרוויח? איך זה ישפר לה את החיים?</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700"><strong>תני זמן לתהליך:</strong> בניית מותג לוקח זמן. תהיי סבלנית ועקבית.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* קישור חזרה */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="border-purple-300 text-purple-600 hover:bg-purple-50">
            <Link to={createPageUrl('ResourceLibrary')}>
              <ArrowLeft className="w-4 h-4 ml-2" />
              חזרה לספריית המשאבים
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}