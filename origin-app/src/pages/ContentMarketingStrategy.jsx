import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Target, 
  Users, 
  Calendar, 
  TrendingUp, 
  FileText,
  Lightbulb,
  CheckCircle,
  ArrowLeft,
  Crown,
  Sparkles,
  BarChart,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Mail,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const contentTypes = [
  { 
    id: 'blog', 
    name: 'פוסטים בבלוג', 
    icon: <FileText className="w-5 h-5" />,
    description: 'מאמרים מקצועיים שמספקים ערך ומידע',
    frequency: 'שבועי',
    effort: 'בינוני'
  },
  { 
    id: 'social', 
    name: 'פוסטים ברשתות', 
    icon: <Share2 className="w-5 h-5" />,
    description: 'תוכן קצר ומושך לאינסטגרם ופייסבוק',
    frequency: 'יומי',
    effort: 'נמוך'
  },
  { 
    id: 'video', 
    name: 'סרטונים', 
    icon: <Video className="w-5 h-5" />,
    description: 'תוכן ויזואלי ליוטיוב, טיקטוק, רילס',
    frequency: 'שבועי-חודשי',
    effort: 'גבוה'
  },
  { 
    id: 'newsletter', 
    name: 'ניוזלטר', 
    icon: <Mail className="w-5 h-5" />,
    description: 'מיילים תקופתיים לרשימת התפוצה',
    frequency: 'שבועי-חודשי',
    effort: 'בינוני'
  },
  { 
    id: 'infographic', 
    name: 'אינפוגרפיקות', 
    icon: <ImageIcon className="w-5 h-5" />,
    description: 'מידע מורכב בצורה ויזואלית',
    frequency: 'חודשי',
    effort: 'בינוני-גבוה'
  }
];

const contentPillars = [
  {
    title: 'חינוכי ומקצועי',
    description: 'מדריכים, טיפים, הסברים מקצועיים בתחום שלך',
    examples: ['איך לעשות X', 'המדריך המלא ל-Y', '5 טיפים לשיפור Z'],
    color: 'from-blue-500 to-cyan-600'
  },
  {
    title: 'השראה וסיפורים',
    description: 'סיפורי הצלחה, אתגרים שהתגברת עליהם, מסע אישי',
    examples: ['הסיפור שלי', 'איך התחלתי', 'האתגר הגדול שלי'],
    color: 'from-purple-500 to-pink-600'
  },
  {
    title: 'בידור ואירועים',
    description: 'מבט מאחורי הקלעים, רגעים כיפיים, אירועים',
    examples: ['יום בחיים שלי', 'הכנות לאירוע', 'רגעים משעשעים'],
    color: 'from-orange-500 to-amber-600'
  },
  {
    title: 'קידום מכירות',
    description: 'הצגת מוצרים/שירותים, מבצעים, המלצות',
    examples: ['המוצר החדש שלי', 'מבצע מיוחד', 'המלצות לקוחות'],
    color: 'from-green-500 to-emerald-600'
  }
];

const strategySteps = [
  {
    step: 1,
    title: 'הגדרת מטרות',
    icon: <Target className="w-8 h-8" />,
    questions: [
      'מה אני רוצה להשיג? (מודעות, לידים, מכירות)',
      'למי אני מדברת? (קהל יעד מדויק)',
      'מה הצעד הבא שאני רוצה שהם יעשו?'
    ]
  },
  {
    step: 2,
    title: 'זיהוי קהל היעד',
    icon: <Users className="w-8 h-8" />,
    questions: [
      'מי הלקוחות האידיאליים שלי?',
      'מה הכאבים והצרכים שלהם?',
      'איפה הם מבלים באינטרנט?'
    ]
  },
  {
    step: 3,
    title: 'תכנון לוח תוכן',
    icon: <Calendar className="w-8 h-8" />,
    questions: [
      'כמה פעמים בשבוע אני מפרסמת?',
      'באילו נושאים אני מתמקדת?',
      'מה התמהיל בין תוכן חינוכי לקידום מכירות?'
    ]
  },
  {
    step: 4,
    title: 'מדידה ושיפור',
    icon: <BarChart className="w-8 h-8" />,
    questions: [
      'מה הקריטריונים להצלחה שלי?',
      'איך אני עוקבת אחר התוצאות?',
      'מה עובד ומה צריך לשפר?'
    ]
  }
];

export default function ContentMarketingStrategy() {
  const [activeTab, setActiveTab] = useState('overview');
  const [goals, setGoals] = useState('');
  const [audience, setAudience] = useState('');
  const [painPoints, setPainPoints] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 mb-6">
            <Crown className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">כלי בלעדי מספריית המשאבים</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            תבנית אסטרטגיית שיווק תוכן 📊
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            המדריך המלא לבניית אסטרטגיית תוכן מנצחת - מהגדרת מטרות ועד ליישום מעשי!
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
            <TabsTrigger value="strategy">בניית אסטרטגיה</TabsTrigger>
            <TabsTrigger value="content">סוגי תוכן</TabsTrigger>
            <TabsTrigger value="calendar">לוח תוכן</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardTitle className="text-2xl">למה צריך אסטרטגיית תוכן?</CardTitle>
                <CardDescription className="text-purple-50">
                  תוכן ללא אסטרטגיה = זמן מבוזבז 💨
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      עם אסטרטגיה:
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span>יעילות מקסימלית - יודעת מה לפרסם ומתי</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span>מסרים עקביים המחזקים את המותג</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span>תוצאות מדידות ושיפור מתמיד</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span>פחות לחץ - העבודה מאורגנת ומתוכננת</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                      <span className="text-red-500">❌</span>
                      בלי אסטרטגיה:
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <span>בזבוז זמן על תוכן לא רלוונטי</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <span>מסרים לא עקביים שמבלבלים את הקהל</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <span>קושי למדוד האם זה באמת עובד</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <span>לחץ מתמיד - "מה אני מפרסמת היום?"</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4 Strategy Steps */}
            <div className="grid md:grid-cols-2 gap-6">
              {strategySteps.map((item) => (
                <Card key={item.step} className="border-2 border-purple-200 hover:border-purple-300 transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
                        {item.icon}
                      </div>
                      <div>
                        <Badge className="bg-purple-100 text-purple-700 mb-2">שלב {item.step}</Badge>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {item.questions.map((q, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <Lightbulb className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                          <span className="text-sm">{q}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Strategy Building Tab */}
          <TabsContent value="strategy" className="space-y-8">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-600 text-white">
                <CardTitle className="text-2xl">בואי נבנה את האסטרטגיה שלך! 🎯</CardTitle>
                <CardDescription className="text-pink-50">
                  מלאי את השדות הבאים כדי לקבל תבנית מותאמת אישית
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <label className="font-semibold text-gray-900">מהן המטרות העסקיות שלך?</label>
                  <Textarea 
                    placeholder="לדוגמה: להגדיל מודעות למותג, להוסיף 50 לקוחות חדשים, לחזק את המעמד כמומחית בתחום..."
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-3">
                  <label className="font-semibold text-gray-900">מי קהל היעד שלך? (תארי בפירוט)</label>
                  <Textarea 
                    placeholder="לדוגמה: נשים בגיל 40-60, יזמיות מתחילות, עם רקע מקצועי אבל חוסר ניסיון בעסקים עצמאיים..."
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-3">
                  <label className="font-semibold text-gray-900">מהם הכאבים/צרכים של הקהל שלך?</label>
                  <Textarea 
                    placeholder="לדוגמה: חוסר ביטחון, לא יודעים איך להתחיל, פחד מכישלון, צורך בקהילה תומכת..."
                    value={painPoints}
                    onChange={(e) => setPainPoints(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                {goals && audience && painPoints && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 space-y-4">
                    <h3 className="font-bold text-lg text-green-900 flex items-center gap-2">
                      <Sparkles className="w-6 h-6" />
                      מעולה! הנה ההמלצות שלי:
                    </h3>
                    <div className="space-y-3 text-gray-800">
                      <p><strong>עמודי תוכן מומלצים:</strong> תוכן חינוכי (40%), סיפורים אישיים (30%), קידום (20%), בידור (10%)</p>
                      <p><strong>תדירות פרסום:</strong> 3-5 פוסטים בשבוע ברשתות חברתיות + מאמר אחד בבלוג כל שבועיים</p>
                      <p><strong>פלטפורמות מומלצות:</strong> פייסבוק, אינסטגרם, לינקדאין</p>
                      <p><strong>טיפ מיוחד:</strong> התמקדי בבניית אמון - שתפי את המסע האישי שלך בכנות</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Content Pillars */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">עמודי התוכן שלך 🎨</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {contentPillars.map((pillar, idx) => (
                  <Card key={idx} className="border-0 shadow-lg overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${pillar.color}`} />
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{pillar.title}</h3>
                      <p className="text-gray-600 mb-4">{pillar.description}</p>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-700">דוגמאות:</p>
                        {pillar.examples.map((ex, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                            {ex}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Content Types Tab */}
          <TabsContent value="content" className="space-y-8">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">סוגי תוכן שכדאי לכם להכיר 📝</CardTitle>
                <CardDescription>לכל סוג תוכן יש מטרה ויתרונות משלו</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {contentTypes.map((type) => (
                    <div key={type.id} className="flex items-start gap-4 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{type.name}</h3>
                        <p className="text-gray-600 mb-3">{type.description}</p>
                        <div className="flex flex-wrap gap-3">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            תדירות: {type.frequency}
                          </Badge>
                          <Badge variant="outline" className={`border-2 ${
                            type.effort === 'נמוך' ? 'bg-green-50 text-green-700 border-green-200' :
                            type.effort === 'בינוני' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            מאמץ: {type.effort}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Ideas */}
            <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-amber-600" />
                  רעיונות לתוכן שתמיד עובד ✨
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'שאלות ותשובות מהקהילה',
                    'טעויות נפוצות ואיך להימנע מהן',
                    'הסיפור מאחורי המוצר/השירות',
                    'לפני ואחרי - תוצאות ממשיות',
                    'טיפ של היום/שבוע',
                    'אתגרים ואיך התגברתי עליהם',
                    'ראיונות עם לקוחות מרוצות',
                    'מבט מאחורי הקלעים',
                    'רשימת כלים/משאבים מומלצים',
                    'תרגומים מעולם המקצוע לשפה פשוטה'
                  ].map((idea, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{idea}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-8">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <CardTitle className="text-2xl">תבנית לוח תוכן חודשי 📅</CardTitle>
                <CardDescription className="text-indigo-50">
                  ארגון מראש = פחות לחץ ויותר עקביות
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg text-blue-900 mb-4">שבוע 1 - החינוכי 📚</h3>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>יום א׳:</strong> טיפ מקצועי קצר (פוסט ברשתות)</p>
                      <p><strong>יום ג׳:</strong> מאמר מעמיק בבלוג</p>
                      <p><strong>יום ה׳:</strong> סרטון הדרכה קצר או רילס</p>
                    </div>
                  </div>

                  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg text-purple-900 mb-4">שבוע 2 - ההשראתי 💡</h3>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>יום א׳:</strong> ציטוט או מחשבה מעוררת השראה</p>
                      <p><strong>יום ג׳:</strong> סיפור אישי או של לקוחה</p>
                      <p><strong>יום ה׳:</strong> "מבט מאחורי הקלעים" של העסק</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg text-green-900 mb-4">שבוע 3 - הקידומי 🎯</h3>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>יום א׳:</strong> הצגת מוצר/שירות עם ערך</p>
                      <p><strong>יום ג׳:</strong> המלצת לקוחה + קריאה לפעולה</p>
                      <p><strong>יום ה׳:</strong> מבצע או הצעה מיוחדת</p>
                    </div>
                  </div>

                  <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg text-orange-900 mb-4">שבוע 4 - האינטראקטיבי 🎉</h3>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>יום א׳:</strong> שאלה לקהילה או סקר</p>
                      <p><strong>יום ג׳:</strong> אתגר או פעילות משותפת</p>
                      <p><strong>יום ה׳:</strong> תחרות או גיווואווי</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-purple-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    טיפים לניהול לוח התוכן:
                  </h3>
                  <ul className="space-y-2 text-gray-800">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>הקדישי יום אחד בחודש לתכנון כל התוכן</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>צלמי/עצבי תוכן מראש בגודלי כמויות (batch work)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>השתמשי בכלי תזמון (כמו Buffer או Later)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>תני מקום לספונטניות - 20% מהתוכן יכול להיות אקטואלי</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>עקבי אחר ביצועים והתאימי את התוכנית בהתאם</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white mt-12">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              מוכנה להתחיל? 🚀
            </h2>
            <p className="text-lg mb-6 text-purple-50">
              עכשיו שיש לך את התבנית - הגיע הזמן ליישם! התחילי עם שבוע אחד ותראי את ההבדל.
            </p>
            <Button size="lg" asChild className="bg-white text-purple-600 hover:bg-gray-100">
              <Link to={createPageUrl("ResourceLibrary")}>
                <ArrowLeft className="w-5 h-5 mr-2" />
                חזרה לספריית המשאבים
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Footer Buttons */}
        <div className="text-center mt-8">
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