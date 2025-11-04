
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { HelpCircle, Sparkles, ArrowLeft, Heart, Star, Crown, MessageCircle } from 'lucide-react';

const whyJoinData = [
  {
    icon: "✨",
    title: "את בשלב הכי מעניין של החיים",
    text: "משפחה? קריירה? חלומות? בריאות? נכון, הכל זז וזה בדיוק הזמן שתהיה לך קהילה שזזה איתך."
  },
  {
    icon: "💎",
    title: "כאן לא מדברים סתם - כאן פוגשות נשים כמוך",
    text: "נשים בגילך שחולמות, פועלות, משנות, ממציאות את עצמן מחדש ומבינות אותך בלי הרבה הסברים."
  },
  {
    icon: "🚀",
    title: "הגיע הזמן לשים את עצמך בפרונט",
    text: "בין אם את בונה קריירה שלישית, יוצאת לעצמאות, מתחילה פרויקט חדש או פשוט רוצה השראה - כאן זה קורה."
  },
  {
    icon: "🤝",
    title: "קהילה זה לא רק לייקים",
    text: "זה שיתופי פעולה, רעיונות, חברות, הזדמנויות עסקיות וגם כמה צחוקים טובים על הדרך."
  },
  {
    icon: "💪",
    title: "בגיל 50 את כבר יודעת - את לא מבזבזת זמן על שטויות",
    text: "את מחפשת ערך, קשרים אמיתיים, ואנשים שמבינים גם את הלב וגם את העסק."
  }
];

const faqData = [
  {
    question: "איך מתחילים? זה מסובך?",
    answer: "בכלל לא! פשוט לוחצת על 'הצטרפי אלינו' ועוברת תהליך הרשמה קצר ותשלום. הכל אינטואיטיבי וידידותי לנשים שלא אוהבות סיבוכים טכנולוגיים."
  },
  {
    question: "מה עלות המנוי ומה הוא כולל?",
    answer: (
      <div className="space-y-4">
        <div className="bg-rose-50 p-6 rounded-lg border border-rose-200">
          <h4 className="font-bold text-rose-800 mb-2 text-lg">💎 אצלנו כולן פרימיום!</h4>
          <p className="text-gray-700 leading-relaxed">
            המנוי החודשי עולה <span className="font-bold text-xl">₪55</span> בלבד.
            במחיר זה, את מצטרפת ל-RSE50 ומקבלת גישה מלאה לכל מה שהקהילה מציעה, ועוד הרבה יותר - בלי אותיות קטנות ובלי הגבלות.
          </p>
          <Button asChild size="sm" className="mt-4 bg-rose-600 hover:bg-rose-700 text-white">
            <Link to={createPageUrl("Subscribe")}>לכל ההטבות והצטרפות</Link>
          </Button>
        </div>
      </div>
    )
  },
  {
    question: "אני לא טכנולוגית, אני אצליח?",
    answer: "בהחלט! האתר נבנה במיוחד בשבילך. הכל פשוט, ברור ועם הסברים. יש גם תמיכה אנושית אמיתית בוואטסאפ ובמייל."
  },
  {
    question: "מה אם אני לא בטוחה מה אני רוצה?",
    answer: "זה בדיוק למה אנחנו כאן! רוב הנשים מגיעות אלינו בדיוק במקום הזה. יש לנו כלים, מנטוריות וקהילה שיעזרו לך לגלות את הכיוון החדש שלך."
  },
  {
    question: "איך אני יודעת שזה בשבילי?",
    answer: "אם הגעת עד לכאן ואת קוראת את זה, כנראה שכן. אבל בכל מקרה, תוכלי לבטל בכל שלב. אין התחייבות ואין סיכון."
  },
  {
    question: "יש תמיכה אישית?",
    answer: (
      <div className="space-y-3">
        <p>כן! במנוי פרימיום יש ליווי אישי מקצועי. ובכל מקרה, יש תמיכה טכנית ואנושית לכל השאלות שלך.</p>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-gray-700">💬 לתמיכה מיידית בוואטסאפ:</span>
          <a
            href={`https://wa.me/972508873773?text=${encodeURIComponent('שלום, פונה מריסטרט 50+')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-medium underline"
          >
            <MessageCircle className="w-4 h-4" />
            לחצי כאן
          </a>
        </div>
      </div>
    )
  },
  {
    question: "איך אני מתחברת לאחרות?",
    answer: (
      <>
        <p>יש לנו <Link to={createPageUrl("SocialTinder")} className="text-rose-600 hover:text-rose-700 font-medium underline">מערכת 'הכירי חברות'</Link> מיוחדת לגיל 50+, פורום קהילתי, ואירועים פיזיים ווירטואליים שמחברים בין נשים בדומה אליך.</p>
      </>
    )
  }
];

const mentorFaqData = [
  {
    question: "מה עלות המנוי למנטורית ומה הוא כולל?",
    answer: (
      <div className="space-y-4">
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h4 className="font-bold text-purple-800 mb-2 text-lg">🌟 מנוי פרימיום למנטורית</h4>
          <p className="text-gray-700 leading-relaxed">
            המנוי החודשי למנטורית עולה <span className="font-bold text-xl">₪55</span> בלבד.
            במחיר זה, את מצטרפת לצוות המומחיות של RSE50, מקבלת חשיפה לקהל היעד שלך, כלים לניהול פרופיל ופגישות, וגם את כל הטבות מנוי הפרימיום של הקהילה.
          </p>
          <Button asChild size="sm" className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
            <Link to={createPageUrl("MentorSubscribe")}>לפרטים נוספים והצטרפות</Link>
          </Button>
        </div>
      </div>
    )
  },
  {
    question: "מדוע כדאי לי להתחבר כמומחית ל-ReStart 50+?",
    answer: (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed font-medium">
          הפלטפורמה שלנו מעניקה לך כלים מתקדמים והזדמנויות שלא תמצאי במקום אחר:
        </p>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-purple-500 font-bold">🎯</span>
            <div>
              <span className="font-semibold">חשיפה לקהל יעד מדויק:</span> מאות נשים בגיל 50+ המחפשות בדיוק את מה שאת מציעה
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-500 font-bold">💼</span>
            <div>
              <span className="font-semibold">דף פרופיל מקצועי:</span> פרופיל מותאם אישית עם תמונות, המלצות, ותחומי התמחות
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-500 font-bold">📅</span>
            <div>
              <span className="font-semibold">ניהול פגישות חכם:</span> מערכת אוטומטית לתיאום פגישות עם התראות ותזכורות
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-500 font-bold">✍️</span>
            <div>
              <span className="font-semibold">פרסום תוכן מקצועי:</span> פרסום מאמרים וקורסים להגברת החשיפה והמומחיות
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-500 font-bold">👥</span>
            <div>
              <span className="font-semibold">קהילת מומחיות תומכת:</span> נטוורקינג והדדיות עם מנטוריות ויועצות אחרות
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-500 font-bold">💎</span>
            <div>
              <span className="font-semibold">גישה לכל הפלטפורמה:</span> כל יתרונות מנוי הפרימיום של הקהילה כלולים במנוי שלך
            </div>
          </li>
        </ul>
        <div className="bg-purple-100 p-4 rounded-lg border-l-4 border-purple-500 mt-4">
          <p className="text-purple-800 font-medium">
            💡 זו ההזדמנות שלך להפוך את הניסיון והידע שלך למקור הכנסה יציב תוך כדי עזרה אמיתית לנשים אחרות.
          </p>
        </div>
        <div className="flex gap-3 mt-4">
          <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
            <Link to={createPageUrl("BecomeMentor")}>הגשת בקשה להצטרפות</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
            <Link to={createPageUrl("MentorSubscribe")}>פרטי מנוי ותשלום</Link>
          </Button>
        </div>
      </div>
    )
  },
  {
    question: "איך אני מצטרפת כמומחית?",
    answer: (
        <>
            <p>תהליך ההצטרפות פשוט. יש למלא טופס בקשה מפורט, בו תוכלי לספר על עצמך ועל הניסיון שלך. לאחר שליחת הטופס, הצוות שלנו יבחן את הפנייה ויחזור אלייך. לחצי על הכפתור כדי להתחיל.</p>
            <Button asChild variant="link" className="p-0 h-auto mt-2 text-purple-600">
                <Link to={createPageUrl("BecomeMentor")}>למילוי טופס הצטרפות</Link>
            </Button>
        </>
    )
  },
  {
    question: "האם אני חייבת להיות בעלת עסק רשום?",
    answer: "לא חובה. אנחנו מקבלות בברכה גם מומחיות בתחילת דרכן העצמאית וגם שכירות בעלות ניסיון רב שרוצות לתרום מהידע שלהן. העיקר הוא הניסיון, התשוקה והרצון לעזור לנשים אחרות."
  },
  {
    question: "איך מתבצע תיאום הפגישות עם המנויות?",
    answer: "לאחר אישור הפרופיל שלך, תקבלי גישה ללוח בקרה אישי. שם תוכלי להגדיר את זמינותך ולנהל את כל הפניות והפגישות שנקבעו דרך הפלטפורמה. המערכת שולחת התראות גם לך וגם למנויה."
  }
];


export default function FaqPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="max-w-5xl mx-auto">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-rose-200 mb-8">
            <Heart className="w-5 h-5 text-rose-500" />
            <span className="font-medium text-rose-700">המסע החדש שלך מתחיל כאן</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            למה לך, אישה בת <span className="gradient-text">50 ומעלה</span>, להצטרף אלינו?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            זה הזמן שלך להתחיל את הפרק הכי מרגש בחיים
          </p>
        </div>

        {/* NEW SECTION: Meet Bloria - The Founder */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            הכירי את היזמת ומפתחת האפליקציה 💫
          </h2>
          
          <Card className="bg-gradient-to-br from-white to-rose-50 border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-100 p-6 rounded-2xl border shadow-inner">
                <div className="flex justify-center mb-6">
                  <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/e794af3e0_ChatGPTImageAug25202501_49_44PM.png"
                    alt="היזמת של ReStart 50+"
                    className="w-32 h-32 rounded-full object-cover border-4 border-rose-300 shadow-lg"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">מכתב אישי מבלוריה, יזמת ומייסדת ReStart 50+</h3>
                <div className="text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                  <p className="mb-4">
                    נעים להכיר, אני בלוריה 🌸 בלב ובנשמה יזמת, מפתחת, ובעיקר – מאמינה גדולה בכוחן של נשים בכל גיל.
                  </p>
                  <p className="mb-4">
                    את ReStart 50+ הקמתי מתוך ניסיון חיים עשיר והבנה עמוקה של צמתים בקריירה. לאחר שנים ארוכות בהן צברתי ידע ומומחיות בעולם הגיוס, הייעוץ העסקי והיזמות, הבנתי מה באמת גורם למעסיקים להתרשם, ואיך בונים מסלול קריירה שלא רק מפרנס, אלא גם ממלא במשמעות ובהגשמה אישית.
                  </p>
                  <p className="mb-4">
                    כשהגעתי לגיל 50, הבנתי שזהו לא הסוף של דרך אחת, אלא ההתחלה המרגשת של דרך חדשה – תקופה בה הניסיון שלנו הופך לנכס אמיתי, וההזדמנות ליזום, ליצור ולפרוח בעסק משלך, גדולה מתמיד.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Why Join Section */}
        <div className="mb-20">

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {whyJoinData.map((item, index) => (
              <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg card-hover overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl pt-1">{item.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight">{item.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center p-8 bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl border border-rose-200">
            <h3 className="font-bold text-2xl text-rose-800 mb-3 flex items-center justify-center gap-2">
              <span>🎯</span>
              הצטרפי לקהילת הנשים שחושבות קדימה בדיוק כמוך
            </h3>
            <p className="text-rose-700 text-lg mb-6">כי הקריירה השלישית שלך? מתחילה עם הקשרים הנכונים.</p>
            <Button size="lg" asChild className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg">
              <Link to={createPageUrl("Subscribe")}>
                הצטרפי עכשיו
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* FAQ Section for Members */}
        <div className="mb-16">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <HelpCircle className="w-6 h-6 text-rose-600" />
                שאלות נפוצות למצטרפות לקהילה
              </CardTitle>
              <p className="text-gray-600">כל מה שחשוב לדעת לפני שנכנסים פנימה</p>
            </CardHeader>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-right font-semibold text-lg hover:no-underline hover:text-rose-600">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 leading-relaxed text-base pt-2">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section for Mentors */}
        <div>
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <Crown className="w-6 h-6 text-purple-600" />
                שאלות נפוצות למומחיות ומנטוריות
              </CardTitle>
              <p className="text-gray-600">מידע חשוב למי שרוצה להצטרף לצוות המומחיות</p>
            </CardHeader>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {mentorFaqData.map((item, index) => (
                  <AccordionItem key={index} value={`mentor-item-${index}`}>
                    <AccordionTrigger className="text-right font-semibold text-lg hover:no-underline hover:text-purple-600">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 leading-relaxed text-base pt-2">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>


        {/* Final CTA */}
        <section className="py-16 mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-12 text-white">
            <Sparkles className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              מוכנה להתחיל את הפרק הבא שלך?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              הקהילה שלנו מחכה לך. בואי למצוא תמיכה, השראה וחברות לחיים.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 rounded-full font-semibold text-lg shadow-lg"
              >
                <Link to={createPageUrl("Subscribe")}>
                  הצטרפי עכשיו ₪55/חודש
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg"
              >
                <Link to={createPageUrl("Home")}>
                  עוד לא מוכנה? חזרי לעמד הבית
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
