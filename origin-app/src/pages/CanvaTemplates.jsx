
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Image, 
  Heart, 
  TrendingUp, 
  Gift, 
  Calendar,
  Sparkles,
  ArrowLeft,
  Crown,
  ExternalLink,
  Lightbulb,
  CheckCircle,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const templateCategories = [
  {
    id: 'announcements',
    title: 'פוסטים להכרזות',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'from-purple-500 to-indigo-600',
    templates: [
      { name: 'השקת מוצר חדש', description: 'תבנית מרשימה להכרזה על מוצר או שירות חדש' },
      { name: 'הודעה חשובה', description: 'עיצוב נקי ומודגש להודעות חשובות' },
      { name: 'מבצע מיוחד', description: 'תבנית בולטת להצעות מוגבלות בזמן' }
    ]
  },
  {
    id: 'educational',
    title: 'תוכן לימודי וטיפים',
    icon: <Lightbulb className="w-6 h-6" />,
    color: 'from-amber-500 to-orange-600',
    templates: [
      { name: 'טיפ של היום', description: 'תבנית קלה לעין לשיתוף טיפים יומיים' },
      { name: 'דיד יו נואו?', description: 'עיצוב מעניין לשיתוף עובדות ומידע' },
      { name: 'המדריך המלא', description: 'תבנית לפירוט תהליך או מדריך צעד אחר צעד' }
    ]
  },
  {
    id: 'testimonials',
    title: 'המלצות ולקוחות',
    icon: <Star className="w-6 h-6" />,
    color: 'from-pink-500 to-rose-600',
    templates: [
      { name: 'המלצת לקוח', description: 'תבנית מעוצבת להצגת ביקורות חיוביות' },
      { name: 'תמונות לפני ואחרי', description: 'עיצוב להצגת תוצאות' },
      { name: 'סיפור הצלחה', description: 'תבנית מרגשת לשיתוף סיפורי לקוחות' }
    ]
  },
  {
    id: 'engagement',
    title: 'פוסטים לאינטראקציה',
    icon: <Heart className="w-6 h-6" />,
    color: 'from-red-500 to-pink-600',
    templates: [
      { name: 'שאלה לקהילה', description: 'תבנית מזמינה לשאלות והתייעצות' },
      { name: 'משחק או חידה', description: 'עיצוב כיפי למשחקים ואתגרים' },
      { name: 'סקר דעת קהל', description: 'תבנית נקייה לסקרים' }
    ]
  },
  {
    id: 'quotes',
    title: 'ציטוטים והשראה',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'from-teal-500 to-cyan-600',
    templates: [
      { name: 'ציטוט מעורר השראה', description: 'רקע יפהפה לציטוטים' },
      { name: 'מוטיבציה בוקר', description: 'תבנית אנרגטית לפתיחת היום' },
      { name: 'מחשבה לסוף השבוע', description: 'עיצוב רגוע ומעודד' }
    ]
  },
  {
    id: 'promotions',
    title: 'מבצעים ואירועים',
    icon: <Gift className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-600',
    templates: [
      { name: 'הנחה מיוחדת', description: 'תבנית בולטת למבצעים' },
      { name: 'הזמנה לאירוע', description: 'עיצוב אלגנטי להזמנות' },
      { name: 'תחרות וגיוואווי', description: 'תבנית מרגשת לתחרויות' }
    ]
  }
];

const designTips = [
  {
    title: 'שמרי על אחידות ברנדינג',
    description: 'השתמשי באותם צבעים, פונטים ולוגו בכל הפוסטים כדי ליצור זהות ויזואלית עקבית',
    icon: <Palette className="w-5 h-5 text-purple-500" />
  },
  {
    title: 'פחות זה יותר',
    description: 'הימנעי מעומס מידע - פוסט ברור ופשוט יותר אפקטיבי מפוסט עמוס',
    icon: <Sparkles className="w-5 h-5 text-pink-500" />
  },
  {
    title: 'תמונות באיכות גבוהה',
    description: 'השתמשי רק בתמונות חדות ובאיכות טובה - זה משפיע על התדמית המקצועית שלך',
    icon: <Image className="w-5 h-5 text-blue-500" />
  },
  {
    title: 'קריאה לפעולה ברורה',
    description: 'כל פוסט צריך CTA ברור - "הזמיני עכשיו", "שתפי את דעתך", "לפרטים נוספים"',
    icon: <TrendingUp className="w-5 h-5 text-green-500" />
  }
];

const canvaFeatures = [
  { title: 'תבניות מוכנות', description: 'אלפי תבניות מעוצבות בחינם' },
  { title: 'עריכה פשוטה', description: 'גרירה ושחרור - ללא צורך בידע מקצועי' },
  { title: 'ספריית תמונות', description: 'מיליוני תמונות ואיקונים זמינים' },
  { title: 'שיתוף פעולה', description: 'עבדי עם צוות או מעצבת' },
  { title: 'גדלים מותאמים', description: 'תבניות לכל פלטפורמה - אינסטגרם, פייסבוק, לינקדאין' },
  { title: 'יצוא באיכות גבוהה', description: 'שמרי בפורמטים שונים - PNG, JPG, PDF' }
];

export default function CanvaTemplates() {
  const [activeTab, setActiveTab] = useState('announcements');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 mb-6">
            <Crown className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">כלי בלעדי מספריית המשאבים</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            מדריך Canva למתחילות 🎨
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            מדריך מקיף ליצירת פוסטים מושכים ומקצועיים ב-Canva - גם בלי ניסיון בעיצוב!
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-full shadow-lg"
          >
            <a href="https://www.canva.com" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-5 h-5 ml-2" />
              פתחי את Canva
            </a>
          </Button>
        </div>

        <Card className="mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
            <CardTitle className="text-2xl">מה זה Canva ולמה זה מושלם בשבילך?</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              <strong>Canva</strong> היא פלטפורמת עיצוב אונליין חינמית (עם אופציה לגרסה בתשלום) שמאפשרת לך ליצור תוכן ויזואלי מקצועי בקלות - 
              גם אם אין לך שום ניסיון בעיצוב גרפי! מושלם ליזמיות שרוצות לנהל את השיווק בעצמן בלי להוציא הון על מעצבת.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {canvaFeatures.map((feature, index) => (
                <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">תבניות מומלצות לפי סוג פוסט</CardTitle>
            <CardDescription>בחרי את סוג הפוסט שאת רוצה ליצור וקבלי המלצות לתבניות</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 h-auto bg-transparent mb-8">
                {templateCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:text-white data-[state=active]:shadow-lg"
                    style={{
                      backgroundImage: activeTab === category.id ? `linear-gradient(to right, ${category.color.replace('from-', '').replace('to-', '')})` : 'none'
                    }}
                  >
                    <div className="flex flex-col items-center gap-1 p-2">
                      {category.icon}
                      <span className="text-xs font-medium">{category.title}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {templateCategories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="space-y-4">
                  <div className={`bg-gradient-to-r ${category.color} text-white p-6 rounded-xl mb-6`}>
                    <div className="flex items-center gap-3 mb-2">
                      {category.icon}
                      <h3 className="text-2xl font-bold">{category.title}</h3>
                    </div>
                    <p className="text-white/90">תבניות מומלצות לקטגוריה זו ב-Canva</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {category.templates.map((template, index) => (
                      <Card key={index} className="hover:shadow-xl transition-all">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                              <span className="text-white font-bold text-sm">{index + 1}</span>
                            </div>
                            {template.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">{template.description}</p>
                          <Button
                            asChild
                            variant="outline"
                            className="w-full"
                          >
                            <a 
                              href={`https://www.canva.com/templates/?query=${encodeURIComponent(template.name)}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4 ml-2" />
                              חפשי ב-Canva
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Palette className="w-8 h-8 text-orange-600" />
              4 טיפים זהב לעיצוב פוסטים מנצחים
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {designTips.map((tip, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {tip.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
                      <p className="text-gray-600 text-sm">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardTitle className="text-2xl">איך מתחילים? מדריך מהיר ל-3 דקות</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-green-600">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">הירשמי ל-Canva (חינם)</h3>
                  <p className="text-gray-600">גשי ל-canva.com והירשמי עם המייל שלך - התהליך לוקח 30 שניות</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-green-600">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">בחרי תבנית</h3>
                  <p className="text-gray-600">חפשי "Instagram Post" או "Facebook Post" ובחרי תבנית שאהבת</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-green-600">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">ערכי והתאימי אישית</h3>
                  <p className="text-gray-600">שני את הטקסט, הצבעים והתמונות בהתאם למותג שלך</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-green-600">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">הורידי ושתפי!</h3>
                  <p className="text-gray-600">לחצי "Share" ו-"Download" - הפוסט מוכן לפרסום ברשתות החברתיות</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <p className="text-center text-gray-700">
                💡 <strong>טיפ פרו:</strong> צרי תיקייה ייעודית ב-Canva לכל העסק שלך, כך שכל התבניות יהיו במקום אחד ונגיש!
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button asChild variant="outline" size="lg" className="border-purple-300 text-purple-600 hover:bg-purple-50">
            <Link to={createPageUrl("ResourceLibrary")}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              חזרה לספריית המשאבים
            </Link>
          </Button>
          
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
          >
            <a href="https://www.canva.com/create/instagram-posts/" target="_blank" rel="noopener noreferrer">
              <Sparkles className="w-5 h-5 ml-2" />
              התחילי ליצור עכשיו!
            </a>
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
