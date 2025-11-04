
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Facebook, Instagram, CheckCircle, ArrowRight, Lightbulb, UserPlus, Image as ImageIcon, FileText, Send, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const Step = ({ icon, title, description, checklist }) => {
    const [checkedItems, setCheckedItems] = useState(new Array(checklist.length).fill(false));

    const handleCheck = (index) => {
        const newCheckedItems = [...checkedItems];
        newCheckedItems[index] = !newCheckedItems[index];
        setCheckedItems(newCheckedItems);
    };
    
    const isCompleted = checkedItems.every(Boolean);

    return (
        <Card className={`transition-all duration-300 ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${isCompleted ? 'from-green-400 to-emerald-500' : 'from-purple-400 to-pink-500'}`}>
                        {React.createElement(icon, { className: "w-6 h-6 text-white" })}
                    </div>
                    <span className="text-xl font-bold text-gray-900">{title}</span>
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {checklist.map((item, index) => (
                        <div key={index} className={`flex items-center gap-3 p-3 rounded-md transition-colors ${checkedItems[index] ? 'bg-green-100 text-gray-500 line-through' : 'bg-gray-50'}`}>
                            <Checkbox 
                                id={`step-${title}-${index}`} 
                                checked={checkedItems[index]} 
                                onCheckedChange={() => handleCheck(index)}
                            />
                            <label htmlFor={`step-${title}-${index}`} className="flex-1 cursor-pointer">{item}</label>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default function SocialMediaGuide() {
    const facebookSteps = [
        { icon: UserPlus, title: "שלב 1: יצירת הדף", description: "הקמת הדף העסקי שלך, נפרד מהפרופיל האישי.", checklist: ["לחצי על 'צור דף חדש' מהפרופיל האישי שלך", "הזיני שם לדף (שם העסק)", "בחרי קטגוריה מדויקת (למשל: יועצת, חנות בגדים)"] },
        { icon: ImageIcon, title: "שלב 2: מיתוג ויזואלי", description: "הוספת תמונות שייצגו את העסק שלך.", checklist: ["העלי תמונת פרופיל (לרוב לוגו)", "העלי תמונת נושא (Cover Photo) שמספרת את הסיפור שלך", "ודאי שהתמונות נראות טוב גם במובייל"] },
        { icon: FileText, title: "שלב 3: מילוי פרטים", description: "השלמת כל המידע כדי שלקוחות ימצאו אותך ויבינו מה את מציעה.", checklist: ["כתבי תיאור קצר וקולע על העסק", "הוסיפי אתר אינטרנט (אם יש)", "מלאי שעות פעילות ופרטי התקשרות"] },
        { icon: Send, title: "שלב 4: תוכן ראשוני והזמנה", description: "יצירת הפוסט הראשון והזמנת חברים ראשונים.", checklist: ["כתבי פוסט 'ברוכים הבאים' שמסביר על העסק", "הזמיני חברים קרובים לעשות לייק לדף", "שתפי את הדף החדש בפרופיל האישי שלך"] }
    ];

    const instagramSteps = [
        { icon: UserPlus, title: "שלב 1: הקמת חשבון עסקי", description: "העברת החשבון למצב 'עסקי' כדי לקבל גישה לכלים וסטטיסטיקות.", checklist: ["פתחי חשבון אינסטגרם חדש או השתמשי בקיים", "בהגדרות, עברי ל'חשבון עסקי' (Business Account)", "חברי את חשבון האינסטגרם לדף הפייסבוק העסקי שיצרת"] },
        { icon: FileText, title: "שלב 2: אופטימיזציה של הפרופיל", description: "הביו הוא כרטיס הביקור שלך. נצלי אותו היטב.", checklist: ["בחרי תמונת פרופיל ברורה (לוגו או תמונת פנים)", "כתבי 'ביו' (תיאור) קצר שמסביר מי את ומה את עושה", "הוסיפי קישור לאתר/דף נחיתה/וואטסאפ (זה הקישור היחיד באינסטגרם!)"] },
        { icon: Sparkles, title: "שלב 3: בניית הגריד", description: "יצירת 6-9 פוסטים ראשונים כדי שהפרופיל ייראה מלא ומזמין.", checklist: ["תכנני את התוכן לפוסטים הראשונים", "העלי תמונות איכותיות עם תיאור רלוונטי", "השתמשי בהאשטאגים (#) קשורים לנישה שלך"] }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">הקמת עמוד עסקי בפייסבוק ואינסטגרם</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        המדריך האינטראקטיבי שילווה אותך צעד-אחר-צעד בנוכחות הדיגיטלית הראשונה שלך. סמני כל משימה שביצעת והתקדמי בביטחון!
                    </p>
                </header>

                <div className="space-y-12">
                    {/* Facebook Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <Facebook className="w-10 h-10 text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-800">פתיחת דף עסקי בפייסבוק</h2>
                        </div>
                        <div className="space-y-6">
                            {facebookSteps.map((step, index) => <Step key={index} {...step} />)}
                        </div>
                    </section>

                    {/* Instagram Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
                                <Instagram className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">פתיחת פרופיל עסקי באינסטגרם</h2>
                        </div>
                        <div className="space-y-6">
                            {instagramSteps.map((step, index) => <Step key={index} {...step} />)}
                        </div>
                    </section>

                     {/* Pro Tips Section */}
                    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-purple-800"><Lightbulb /> טיפים למתקדמות</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-purple-900">
                            <p><strong>עקביות היא המפתח:</strong> נסי לפרסם באופן קבוע (גם 2-3 פעמים בשבוע זה מעולה) כדי להישאר בתודעה.</p>
                            <p><strong>השתמשי בסטוריז:</strong> סטוריז הם ה"מאחורי הקלעים" של העסק. שתפי שם טיפים מהירים, סקרים ותהליכי עבודה.</p>
                            <p><strong>הגיבי לכל תגובה:</strong> מעורבות בונה קהילה. הראי לקהל שלך שאת קוראת ושאכפת לך.</p>
                        </CardContent>
                    </Card>

                    <div className="text-center mt-12">
                         <Button size="lg" asChild className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white">
                            <Link to={createPageUrl("Community")}>
                                סיימתי! אני רוצה לשתף את הדף שלי עם הקהילה 
                                <ArrowRight className="w-5 h-5 mr-2" />
                            </Link>
                        </Button>
                    </div>

                    {/* Back to Entrepreneurship Hub */}
                    <div className="text-center mt-8 pt-8 border-t">
                        <Button asChild variant="outline" size="lg" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                            <Link to={createPageUrl("EntrepreneurshipHub")}>
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                חזרה לארגז הכלים לעצמאית
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
