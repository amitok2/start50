import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Sparkles, Image, MessageSquare, Video, FileText, PenTool, TrendingUp, Zap, ArrowLeft, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const aiTools = [
  {
    category: 'יצירת תוכן ושיווק',
    icon: <PenTool className="w-6 h-6" />,
    color: 'from-purple-500 to-indigo-600',
    tools: [
      { name: 'ChatGPT', description: 'כתיבת תוכן, מיילים, פוסטים ברשתות חברתיות', url: 'https://chat.openai.com', free: true },
      { name: 'Copy.ai', description: 'יצירת טקסטים שיווקיים וכותרות מושכות', url: 'https://www.copy.ai', free: true },
      { name: 'Jasper', description: 'כתיבת תוכן ארוך ומאמרים מקצועיים', url: 'https://www.jasper.ai', free: false },
      { name: 'Writesonic', description: 'כתיבת מודעות, פוסטים ותוכן לבלוג', url: 'https://writesonic.com', free: true }
    ]
  },
  {
    category: 'עיצוב גרפי ותמונות',
    icon: <Image className="w-6 h-6" />,
    color: 'from-pink-500 to-rose-600',
    tools: [
      { name: 'Canva AI', description: 'עיצוב גרפי מתקדם עם בינה מלאכותית', url: 'https://www.canva.com', free: true },
      { name: 'DALL-E', description: 'יצירת תמונות מטקסט בצורה יצירתית', url: 'https://openai.com/dall-e-2', free: false },
      { name: 'Midjourney', description: 'יצירת תמונות אמנותיות ומרהיבות', url: 'https://www.midjourney.com', free: false },
      { name: 'Remove.bg', description: 'הסרת רקע מתמונות באופן אוטומטי', url: 'https://www.remove.bg', free: true },
      { name: 'Designify', description: 'עיצוב אוטומטי של תמונות למוצרים', url: 'https://www.designify.com', free: true }
    ]
  },
  {
    category: 'וידאו ומולטימדיה',
    icon: <Video className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-600',
    tools: [
      { name: 'Runway ML', description: 'עריכת וידאו מתקדמת עם AI', url: 'https://runwayml.com', free: true },
      { name: 'Synthesia', description: 'יצירת סרטונים עם דוברים AI', url: 'https://www.synthesia.io', free: false },
      { name: 'Descript', description: 'עריכת אודיו ווידאו בקלות', url: 'https://www.descript.com', free: true },
      { name: 'Lumen5', description: 'הפיכת מאמרים לסרטונים', url: 'https://lumen5.com', free: true }
    ]
  },
  {
    category: 'ניתוח נתונים ותובנות',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-600',
    tools: [
      { name: 'Google Analytics', description: 'ניתוח תעבורה באתר עם המלצות AI', url: 'https://analytics.google.com', free: true },
      { name: 'MonkeyLearn', description: 'ניתוח טקסט ומשוב לקוחות', url: 'https://monkeylearn.com', free: true },
      { name: 'Tableau', description: 'ויזואליזציה של נתונים עסקיים', url: 'https://www.tableau.com', free: false }
    ]
  },
  {
    category: 'צ\'אט ושירות לקוחות',
    icon: <MessageSquare className="w-6 h-6" />,
    color: 'from-orange-500 to-amber-600',
    tools: [
      { name: 'Tidio', description: 'צ\'אט בוט אוטומטי לאתר', url: 'https://www.tidio.com', free: true },
      { name: 'ManyChat', description: 'בוטים לפייסבוק מסנג\'ר', url: 'https://manychat.com', free: true },
      { name: 'Zendesk AI', description: 'מערכת שירות לקוחות חכמה', url: 'https://www.zendesk.com', free: false }
    ]
  },
  {
    category: 'אוטומציה וייעול',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-violet-500 to-purple-600',
    tools: [
      { name: 'Zapier', description: 'חיבור בין כלים ואוטומציה של משימות', url: 'https://zapier.com', free: true },
      { name: 'Make (Integromat)', description: 'אוטומציה מתקדמת של תהליכים', url: 'https://www.make.com', free: true },
      { name: 'Notion AI', description: 'ניהול משימות וידע עם בינה מלאכותית', url: 'https://www.notion.so', free: true }
    ]
  }
];

export default function AiToolsList() {
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
            🤖 רשימת כלי AI בחינם ליזמיות 🚀
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            מדריך מקיף לכלי בינה מלאכותית שיחסכו לך זמן, כסף ויעזרו לך לנהל את העסק בצורה חכמה יותר!
          </p>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 max-w-2xl mx-auto">
            <p className="text-yellow-800 font-medium">
              💡 <strong>טיפ:</strong> רוב הכלים מציעים גרסה חינמית מצוינת. התחילי בחינמי, ורק אם את צריכה יותר - עברי לתשלום!
            </p>
          </div>
        </div>

        {/* Tools by Category */}
        <div className="space-y-8">
          {aiTools.map((category, index) => (
            <Card key={index} className="overflow-hidden border-0 shadow-xl">
              <CardHeader className={`bg-gradient-to-r ${category.color} text-white`}>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    {category.icon}
                  </div>
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {category.tools.map((tool, toolIndex) => (
                    <div key={toolIndex} className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-lg text-gray-900">{tool.name}</h3>
                        <Badge className={tool.free ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                          {tool.free ? 'חינם' : 'בתשלום'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{tool.description}</p>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 ml-2" />
                          כניסה לכלי
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips Section */}
        <Card className="mt-12 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-600" />
              טיפים לשימוש נכון בכלי AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">1. התחילי קטן</h3>
              <p className="text-gray-600">בחרי 2-3 כלים שיעזרו לך הכי הרבה ותתרכזי בהם. לא צריך להשתמש בהכל!</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">2. תני הוראות ברורות</h3>
              <p className="text-gray-600">ככל שתהיי יותר ספציפית במה שאת מבקשת מה-AI, כך התוצאות יהיו יותר טובות.</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">3. ערכי ושפרי</h3>
              <p className="text-gray-600">AI זה כלי עזר מעולה, אבל תמיד תעברי על התוכן ותתאימי אותו לסגנון שלך.</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">4. למדי מהתוצאות</h3>
              <p className="text-gray-600">שימי לב מה עובד ומה לא, וכך תשפרי את איכות ההוראות שלך עם הזמן.</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Navigation */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="border-purple-300 text-purple-600 hover:bg-purple-50">
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