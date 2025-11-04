
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, FileText, Building, CreditCard, Scale, Users, Globe, Sparkles, ArrowLeft, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const checklistSteps = [
  {
    id: 'planning',
    title: 'שלב התכנון והחקירה',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'purple',
    items: [
      { id: 'idea', text: 'בדיקת כדאיות הרעיון העסקי', description: 'בחינת השוק והתחרות' },
      { id: 'research', text: 'מחקר שוק מעמיק', description: 'זיהוי קהל היעד והצרכים שלו' },
      { id: 'business_plan', text: 'כתיבת תוכנית עסקית', description: 'הגדרת מטרות, אסטרטגיה ותחזיות כספיות' },
      { id: 'budget', text: 'חישוב תקציב התחלתי', description: 'הערכת ההשקעה הנדרשת והוצאות חודשיות' }
    ]
  },
  {
    id: 'legal',
    title: 'רישוי וסידורים משפטיים',
    icon: <Scale className="w-6 h-6" />,
    color: 'blue',
    items: [
      { id: 'business_type', text: 'בחירת סוג התארגנות עסקית', description: 'עוסק פטור/מורשה, חברה בע״מ או שותפות' },
      { id: 'tax_registration', text: 'רישום במס הכנסה', description: 'קבלת מספר עוסק ורישום לצורכי מס' },
      { id: 'vat_registration', text: 'רישום למע״מ (במידת הצורך)', description: 'אם המחזור הצפוי עולה על הסכום הקבוע בחוק' },
      { id: 'municipality', text: 'רישוי עירוני ומשרד הבריאות', description: 'בהתאם לסוג העסק והמיקום' },
      { id: 'insurance', text: 'ביטוח עסקי', description: 'ביטוח אחריות מקצועית וציוד' }
    ]
  },
  {
    id: 'financial',
    title: 'הקמה פיננסית',
    icon: <CreditCard className="w-6 h-6" />,
    color: 'green',
    items: [
      { id: 'bank_account', text: 'פתיחת חשבון בנק עסקי', description: 'הפרדה בין הכספים האישיים לעסקיים' },
      { id: 'accounting_system', text: 'הקמת מערכת הנהלת חשבונות', description: 'בחירת תוכנה או רואה חשבון' },
      { id: 'payment_methods', text: 'הקמת אמצעי תשלום', description: 'כרטיסי אשראי, העברות בנקאיות, PayPal וכו״' },
      { id: 'funding', text: 'גיוס מימון (במידת הצורך)', description: 'הלוואות, משקיעים או מענקים ממשלתיים' }
    ]
  },
  {
    id: 'branding',
    title: 'מיתוג ונוכחות דיגיטלית',
    icon: <Globe className="w-6 h-6" />,
    color: 'orange',
    items: [
      { id: 'logo_design', text: 'עיצוב לוגו ומיתוג', description: 'יצירת זהות עיצובית עקבית' },
      { id: 'website', text: 'בניית אתר אינטרנט', description: 'דף נחיתה או חנות אונליין' },
      { id: 'social_media', text: 'הקמת דפי רשתות חברתיות', description: 'פייסבוק, אינסטגרם, לינקדאין' },
      { id: 'marketing_materials', text: 'עיצוב חומרי שיווק', description: 'כרטיסי ביקור, עלונים, קטלוגים' }
    ]
  },
  {
    id: 'operations',
    title: 'תפעול ומכירות',
    icon: <Building className="w-6 h-6" />,
    color: 'indigo',
    items: [
      { id: 'location', text: 'הכנת מקום העבודה', description: 'משרד, חנות או סטודיו ביתי' },
      { id: 'equipment', text: 'רכישת ציוד נדרש', description: 'מחשבים, מכונות, כלי עבודה' },
      { id: 'suppliers', text: 'יצירת קשר עם ספקים', description: 'מציאת ספקי חומרי גלם או שירותים' },
      { id: 'first_customers', text: 'מציאת הלקוחות הראשונים', description: 'רשת קשרים, מדיה חברתית או פרסום ממוקד' }
    ]
  },
  {
    id: 'growth',
    title: 'צמיחה והתפתחות',
    icon: <Users className="w-6 h-6" />,
    color: 'pink',
    items: [
      { id: 'feedback', text: 'איסוף משוב מלקוחות', description: 'שיפור המוצר או השירות על בסיס ביקורות' },
      { id: 'expansion', text: 'תכנון הרחבה', description: 'מוצרים נוספים, שירותים חדשים או שווקים חדשים' },
      { id: 'team', text: 'גיוס עובדות (במידת הצורך)', description: 'הגדלת הצוות כשהעסק גדל' },
      { id: 'automation', text: 'אוטומציה ושיפור תהליכים', description: 'חיסכון בזמן והגדלת היעילות' }
    ]
  }
];

export default function BusinessStartupChecklist() {
  const [completedItems, setCompletedItems] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState(new Set(['planning']));

  useEffect(() => {
    // Load completed items from localStorage
    const saved = localStorage.getItem('business-checklist-completed');
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
    localStorage.setItem('business-checklist-completed', JSON.stringify([...newCompleted]));
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
    const totalItems = getTotalItems();
    return totalItems > 0 ? Math.round((getCompletedCount() / totalItems) * 100) : 0;
  };

  const getSectionProgress = (section) => {
    const sectionItemsLength = section.items.length;
    if (sectionItemsLength === 0) return 0;
    const sectionCompleted = section.items.filter(item => completedItems.has(item.id)).length;
    return Math.round((sectionCompleted / sectionItemsLength) * 100);
  };

  const getColorClasses = (color, variant = 'bg') => {
    const colorMap = {
      purple: { bg: 'bg-purple-500', text: 'text-purple-700', light: 'bg-purple-50', border: 'border-purple-200' },
      blue: { bg: 'bg-blue-500', text: 'text-blue-700', light: 'bg-blue-50', border: 'border-blue-200' },
      green: { bg: 'bg-green-500', text: 'text-green-700', light: 'bg-green-50', border: 'border-green-200' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-50', border: 'border-orange-200' },
      indigo: { bg: 'bg-indigo-500', text: 'text-indigo-700', light: 'bg-indigo-50', border: 'border-indigo-200' },
      pink: { bg: 'bg-pink-500', text: 'text-pink-700', light: 'bg-pink-50', border: 'border-pink-200' }
    };
    return colorMap[color] || colorMap.purple;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div style={{direction: 'rtl'}} className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 mb-6">
            <Crown className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">מדריך בלעדי מספריית המשאבים</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            צ'ק-ליסט לפתיחת עסק עצמאי בישראל ✨
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            המדריך המלא שיוביל אותך שלב אחר שלב מהרעיון ועד לעסק פורח ומצליח
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
                  <p className="text-center text-sm font-semibold text-purple-700">{getProgressPercentage()}% הושלם</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                          {sectionIndex + 1}. {section.title}
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
              <h2 className="text-3xl font-bold mb-4">מזל טוב! סיימת את כל השלבים!</h2>
              <p className="text-xl mb-6">
                העסק שלך מוכן לצאת לדרך! זה הזמן להתחיל למכור ולממש את החלום.
              </p>
              <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-50 font-bold">
                <Link to={createPageUrl("ResourceLibrary")}>
                  חזרה לספריית המשאבים
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

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
