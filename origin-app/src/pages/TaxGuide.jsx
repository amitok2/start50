
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calculator, Calendar, AlertTriangle, CheckCircle, Clock, ArrowLeft, Crown, DollarSign, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

const taxSections = [
  {
    id: 'types',
    title: 'סוגי עוסקים בישראל',
    icon: <Briefcase className="w-6 h-6" />,
    color: 'blue',
    content: [
      {
        subtitle: 'עוסק פטור',
        points: [
          'מחזור שנתי עד 104,000 ₪ (2024)',
          'לא צריך לגבות מע"מ מהלקוחות',
          'לא צריך להגיש דוחות מע"מ',
          'פטור מניהול ספרים מסודר',
          'מתאים לעסקים קטנים ותחילת דרך'
        ]
      },
      {
        subtitle: 'עוסק מורשה',
        points: [
          'מחזור שנתי מעל 104,000 ₪',
          'חובה לגבות מע"מ 17% מהלקוחות',
          'חובה להגיש דוחות מע"מ דו-חודשיים',
          'חובה בניהול פנקסי חשבונות',
          'זכאות לקיזוז מע"מ תשומות'
        ]
      },
      {
        subtitle: 'חברה בע"מ',
        points: [
          'ישות משפטית נפרדת',
          'אחריות מוגבלת',
          'מיסוי כפול (חברה + דיבידנד)',
          'דרישות דיווח מחמירות',
          'מתאים לעסקים גדולים'
        ]
      }
    ]
  },
  {
    id: 'taxes',
    title: 'סוגי המיסים שתשלמי',
    icon: <Calculator className="w-6 h-6" />,
    color: 'green',
    content: [
      {
        subtitle: 'מס הכנסה',
        points: [
          'מדרגות: 10%-47% לפי הכנסה',
          'נקודות זיכוי מקטינות את המס',
          'ניתן לנכות הוצאות מוכרות',
          'תשלום מקדמות רבעוני',
          'דוח שנתי עד 31.5 בשנה שאחרי'
        ]
      },
      {
        subtitle: 'ביטוח לאומי',
        points: [
          'כ-17% מההכנסה (עד תקרה)',
          'זכאות לדמי לידה, מחלה ועוד',
          'תשלום חודשי דרך האתר',
          'הנחות לעוסקים מתחילים בשנתיים הראשונות',
          'חובה לכל עצמאית'
        ]
      },
      {
        subtitle: 'מע"מ',
        points: [
          '17% על מכירות (רק למורשות)',
          'ניכוי מע"מ תשומות',
          'דוחות דו-חודשיים',
          'תשלום/החזר לפי המאזן',
          'קנסות על איחורים'
        ]
      }
    ]
  },
  {
    id: 'deductions',
    title: 'ניכויים והוצאות מוכרות',
    icon: <DollarSign className="w-6 h-6" />,
    color: 'purple',
    content: [
      {
        subtitle: 'הוצאות שניתן לנכות',
        points: [
          'משרד בבית: חלק יחסי משכירות, חשמל, ארנונה',
          'ציוד: מחשב, ריהוט, כלי עבודה',
          'שיווק ופרסום: מודעות, אתר, כרטיסי ביקור',
          'נסיעות עסקיות: דלק, חניה, אחזקת רכב',
          'שירותים מקצועיים: רו"ח, עו"ד, יועצים',
          'השתלמויות וקורסים מקצועיים',
          'תוכנות ומנויים דיגיטליים',
          'ביגוד מקצועי (בתנאים מסוימים)'
        ]
      },
      {
        subtitle: 'כללי זהב לניכויים',
        points: [
          'שמרי חשבוניות ומסמכים 7 שנים',
          'תיעדי כל הוצאה - גם קטנה',
          'ההוצאה חייבת להיות קשורה לעסק',
          'העסקה חייבת להיות מתועדת',
          'התייעצי עם רו"ח בספק'
        ]
      }
    ]
  },
  {
    id: 'deadlines',
    title: 'לוח מועדים חשוב',
    icon: <Calendar className="w-6 h-6" />,
    color: 'orange',
    content: [
      {
        subtitle: 'דיווחים שנתיים',
        points: [
          'דוח שנתי למס הכנסה: עד 31 במאי (שנה שאחרי)',
          'דוח שנתי לביטוח לאומי: עד 31 במרץ',
          'ניתן לקבל דחייה עד 30 בנובמבר (דרך רו"ח)',
          'תשלומי מקדמות: 30.3, 30.6, 30.9, 30.12'
        ]
      },
      {
        subtitle: 'דיווחי מע"מ (למורשות)',
        points: [
          'דוח דו-חודשי: עד ה-15 בחודש שאחרי',
          'תשלום עד ה-15 (או עד יום עסקים הבא)',
          '6 דוחות בשנה',
          'קנס על איחור: 1,040 ₪ + ריבית והצמדה',
          'דוח 0 גם אם אין פעילות!'
        ]
      }
    ]
  },
  {
    id: 'tips',
    title: 'טיפים חשובים',
    icon: <CheckCircle className="w-6 h-6" />,
    color: 'pink',
    content: [
      {
        subtitle: 'עצות זהב לניהול מיסים',
        points: [
          'פתחי חשבון בנק נפרד לעסק - הפרדה חשובה!',
          'תייעדי הכנסות והוצאות באופן שוטף',
          'השתמשי בתוכנת חשבונאות או Excel מסודר',
          'שלמי מקדמות בזמן - תחסכי קנסות וריביות',
          'התייעצי עם רו"ח לפחות פעם בשנה',
          'שמרי גיבויים דיגיטליים של מסמכים',
          'בדקי זכאות להטבות מס (נשים חוזרות לעבודה, תושבות פריפריה)',
          'למדי את הזכויות שלך - יש הרבה הטבות!'
        ]
      }
    ]
  },
  {
    id: 'mistakes',
    title: 'טעויות נפוצות להימנע מהן',
    icon: <AlertTriangle className="w-6 h-6" />,
    color: 'red',
    content: [
      {
        subtitle: 'מה לא לעשות',
        points: [
          '❌ לא לשלם מקדמות - יגיע חוב ענק בסוף השנה',
          '❌ לערבב כספים אישיים ועסקיים',
          '❌ לא לשמור חשבוניות והוכחות',
          '❌ לדווח הכנסות חלקיות (מזיק ולא חוקי!)',
          '❌ להתעלם ממכתבים ממס הכנסה',
          '❌ לא לדווח על שינויים (כתובת, סגירת עסק)',
          '❌ לחשוב ש"יסתדר בעצמי" ללא רו"ח',
          '❌ לפספס מועדי הגשה ולשלם קנסות מיותרים'
        ]
      }
    ]
  }
];

export default function TaxGuide() {
  const [expandedSection, setExpandedSection] = useState('types');

  const getColorClasses = (color) => {
    const colorMap = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-700', light: 'bg-blue-50', border: 'border-blue-200' },
      green: { bg: 'bg-green-500', text: 'text-green-700', light: 'bg-green-50', border: 'border-green-200' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-700', light: 'bg-purple-50', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-50', border: 'border-orange-200' },
      pink: { bg: 'bg-pink-500', text: 'text-pink-700', light: 'bg-pink-50', border: 'border-pink-200' },
      red: { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-50', border: 'border-red-200' }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 mb-6">
            <Crown className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">מדריך בלעדי מספריית המשאבים</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            מדריך מסים ליזמיות עצמאיות 💰
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            כל מה שצריך לדעת על מיסים, דיווחים וחובות כדי לנהל את העסק בשקט נפשי
          </p>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">חשוב לדעת!</h3>
                <p className="text-amber-50">
                  המדריך הזה הוא לצורכי הכוונה כללית בלבד. כל מקרה הוא ייחודי, והמידע משתנה מעת לעת. 
                  <strong> מומלץ מאוד להתייעץ עם רואת חשבון מוסמכת</strong> לפני קבלת החלטות פיננסיות חשובות.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-6">
          {taxSections.map((section, index) => {
            const colors = getColorClasses(section.color);
            const isExpanded = expandedSection === section.id;
            
            return (
              <Card key={section.id} className={`border-0 shadow-lg overflow-hidden ${colors.light} ${colors.border}`}>
                <CardHeader 
                  className="cursor-pointer transition-all duration-200 hover:bg-white/50"
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center text-white shadow-md`}>
                        {section.icon}
                      </div>
                      <CardTitle className={`text-xl font-bold ${colors.text}`}>
                        {index + 1}. {section.title}
                      </CardTitle>
                    </div>
                    <Badge className={`${colors.bg} text-white`}>
                      {isExpanded ? 'לחצי לסגירה' : 'לחצי להרחבה'}
                    </Badge>
                  </div>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent className="pt-0 pb-6">
                    <div className="space-y-6">
                      {section.content.map((item, idx) => (
                        <div key={idx} className="bg-white/80 p-6 rounded-lg border border-gray-200">
                          <h4 className="font-bold text-lg mb-4 text-gray-900">{item.subtitle}</h4>
                          <ul className="space-y-3">
                            {item.points.map((point, pidx) => (
                              <li key={pidx} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700 leading-relaxed">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Quick Links */}
        <Card className="mt-12 bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">קישורים שימושיים</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a href="https://taxes.gov.il" target="_blank" rel="noopener noreferrer" className="block bg-white/20 hover:bg-white/30 p-4 rounded-lg transition-colors">
              <strong>אתר רשות המיסים</strong> - לדיווחים ומידע רשמי
            </a>
            <a href="https://www.btl.gov.il" target="_blank" rel="noopener noreferrer" className="block bg-white/20 hover:bg-white/30 p-4 rounded-lg transition-colors">
              <strong>אתר הביטוח הלאומי</strong> - תשלומים ודיווחים
            </a>
            <a href="https://www.gov.il/he/service/business_licensing" target="_blank" rel="noopener noreferrer" className="block bg-white/20 hover:bg-white/30 p-4 rounded-lg transition-colors">
              <strong>רישוי עסקים</strong> - מידע על רישיונות והיתרים
            </a>
          </CardContent>
        </Card>

        {/* Back to Resource Library */}
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
