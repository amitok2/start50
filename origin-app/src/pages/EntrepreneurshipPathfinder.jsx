
import React, { useState, useEffect } from 'react';
import { PathfinderResponse } from '@/api/entities';
import { User } from '@/api/entities';
import { InvokeLLM } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Loader2, ArrowLeft, ArrowRight, Sparkles, CheckCircle, BrainCircuit, Target, BookOpen, HeartHandshake, AlertCircle, RefreshCw, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PremiumContentWrapper from '@/components/auth/PremiumContentWrapper';

// Helper component for quiz questions
const QuizQuestion = ({ title, description, children }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    {description && <p className="text-gray-600">{description}</p>}
    <div className="space-y-4 pt-4">{children}</div>
  </div>
);

// Helper component for displaying results
const ResultDisplay = ({ result }) => {
    if (!result) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">אופס, אירעה שגיאה</h2>
                    <p className="text-gray-600 mt-2">לא הצלחנו לטעון את תוצאות האבחון שלך. <br/> אנא נסי לרענן את העמוד, ואם הבעיה חוזרת, פני לתמיכה.</p>
                    <Button onClick={() => window.location.reload()} className="mt-6">
                        <RefreshCw className="w-4 h-4 ml-2" />
                        רענון עמוד
                    </Button>
                </CardContent>
            </Card>
        );
    }
    const { archetype, summary, strengths, potential_challenges, actionable_steps, recommended_resources } = result;

    return (
        <div className="space-y-8">
            <div className="text-center p-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
                <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900">האבחון שלך מוכן!</h2>
                <p className="text-lg text-purple-800 font-semibold mt-2">אב הטיפוס היזמי שלך: {archetype}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BrainCircuit className="text-blue-500" /> סיכום וניתוח</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 leading-relaxed">
                    <p>{summary}</p>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CheckCircle className="text-green-500" /> נקודות החוזק שלך</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            {(strengths || []).map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Target className="text-red-500" /> אתגרים פוטנציאליים</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            {(potential_challenges || []).map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-rose-50 border-rose-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ArrowRight className="text-rose-500" /> הצעדים הבאים שלך</CardTitle>
                    <CardDescription>מפת דרכים אישית כדי להתחיל את המסע היזמי שלך</CardDescription>
                </CardHeader>
                <CardContent>
                    <ol className="list-decimal pl-5 space-y-3 text-gray-800">
                        {(actionable_steps || []).map((item, i) => <li key={i}>{item}</li>)}
                    </ol>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookOpen className="text-indigo-500" /> משאבים מומלצים עבורך</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {(recommended_resources || []).map((resource, i) => (
                        <Link to={createPageUrl(resource.page)} key={i} className="block p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border transition-colors">
                            <div className="font-semibold text-indigo-700">{resource.title}</div>
                            <p className="text-sm text-gray-600">{resource.description}</p>
                        </Link>
                    ))}
                </CardContent>
            </Card>
             <div className="text-center mt-8 flex justify-center gap-4">
                <Button asChild variant="outline">
                    <Link to={createPageUrl('MyProfile')}>
                        <Heart className="w-4 h-4 ml-2" />
                        חזרה למקום שלי
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default function EntrepreneurshipPathfinder() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [user, setUser] = useState(null);
    const [existingResponse, setExistingResponse] = useState(null);

    const totalSteps = 6;

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const currentUser = await User.me();
                setUser(currentUser);
                const responses = await PathfinderResponse.filter({ created_by: currentUser.email });
                if (responses.length > 0) {
                    const response = responses[0];
                    setExistingResponse(response);
                    setFormData(response);
                    if(response.ai_summary) {
                        setResult(response.ai_summary);
                    }
                }
            } catch (error) {
                console.error("Error loading initial data", error);
            }
            setIsLoading(false);
        };
        loadInitialData();
    }, []);

    const handleDataChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };
    
    const saveData = async (dataToSave) => {
      try {
        if (existingResponse) {
          await PathfinderResponse.update(existingResponse.id, dataToSave);
        } else {
          const newResponse = await PathfinderResponse.create(dataToSave);
          setExistingResponse(newResponse);
        }
      } catch (error) {
        console.error("Failed to save data:", error);
      }
    };

    const handleNext = () => {
        saveData(formData);
        if (currentStep < totalSteps - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const finalData = { ...formData, is_complete: true };
        await saveData(finalData);

        const prompt = `
            אתה יועץ מומחה לקריירה ויזמות, המתמחה בסיוע לנשים מעל גיל 50 בקהילה בשם ReStart 50+.
            משתמשת בשם ${user.full_name} השלימה שאלון אבחון יזמות. תשובותיה מובאות להלן בפורמט JSON.

            תשובות המשתמשת:
            ${JSON.stringify(finalData, null, 2)}

            המשימה שלך היא לנתח את תשובותיה ולספק ניתוח תומך, מעצים ופרקטי.
            הפלט שלך חייב להיות בפורמט JSON ובשפה העברית בלבד.

            יש להשתמש במבנה הבא:
            - archetype: שם יצירתי ומעצים בעברית לאב הטיפוס היזמי שלה (לדוגמה: "בונה הקהילות", "היועצת המומחית", "החזונית היצירתית").
            - summary: פסקה חמה ומעודדת בעברית המסכמת את הפרופיל והפוטנציאל שלה.
            - strengths: מערך של 3-4 נקודות חוזק מרכזיות ליזמות על בסיס תשובותיה, בעברית.
            - potential_challenges: מערך של 2-3 אתגרים פוטנציאליים או אזורים לצמיחה, מנוסחים באופן בונה, בעברית.
            - actionable_steps: מערך של 3-4 צעדים קונקרטיים ופרקטיים שהיא יכולה לנקוט, בעברית.
            - recommended_resources: מערך של שני אובייקטים בדיוק, כל אחד עם title (בעברית), description (בעברית), ו-page name מהרשימה הבאה: ['Mentoring', 'CoursesAndEvents', 'ResourceLibrary']. המשאבים צריכים להיות הכי רלוונטיים עבורה על סמך תשובותיה.
            
            ודא שכל הטקסטים בפלט (כולל שמות, תיאורים וכו') הם בעברית.
        `;

        const response_json_schema = {
            type: "object",
            properties: {
                archetype: { type: "string" },
                summary: { type: "string" },
                strengths: { type: "array", items: { type: "string" } },
                potential_challenges: { type: "array", items: { type: "string" } },
                actionable_steps: { type: "array", items: { type: "string" } },
                recommended_resources: { 
                    type: "array", 
                    items: {
                        type: "object",
                        properties: {
                            title: { type: "string" },
                            description: { type: "string" },
                            page: { type: "string", enum: ['Mentoring', 'CoursesAndEvents', 'ResourceLibrary'] }
                        },
                        required: ["title", "description", "page"]
                    }
                }
            },
            required: ["archetype", "summary", "strengths", "potential_challenges", "actionable_steps", "recommended_resources"]
        };

        try {
            const aiResult = await InvokeLLM({ prompt, response_json_schema });
            setResult(aiResult);
            await PathfinderResponse.update(existingResponse.id, { ai_summary: aiResult });
        } catch (error) {
            console.error("AI analysis failed:", error);
            alert("אוי, הייתה בעיה בניתוח התשובות. נסי שוב מאוחר יותר.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <PremiumContentWrapper
            title="האבחון מיועד למנויות בלבד"
            message="כדי לבצע את אבחון המצפן היזמי ולקבל המלצות מותאמות אישית, יש להיות מחוברת ובעלת מנוי פעיל בקהילת ReStart 50+."
        >
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-screen">
                            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
                        </div>
                    ) : result ? (
                        <ResultDisplay result={result} />
                    ) : (
                        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-center text-gray-900">האבחון האישי שלך מחכה!</CardTitle>
                                <CardDescription className="text-center">גלי מה הכיוון המתאים לך ביותר בשלב הזה של החיים - עבודה כשכירה או מעבר לעצמאות מלאה</CardDescription>
                                <CardDescription className="text-center mt-2">שלב {currentStep + 1} מתוך {totalSteps}</CardDescription>
                                <Progress value={((currentStep + 1) / totalSteps) * 100} className="w-full mt-4" />
                            </CardHeader>
                            <CardContent className="p-8">
                                {currentStep === 0 && (
                                    <QuizQuestion title="הרקע המקצועי שלך">
                                        <Textarea placeholder="למשל: הייתי מנהלת שיווק, עסקתי בהוראה..." value={formData.previous_fields || ''} onChange={(e) => handleDataChange('previous_fields', e.target.value)} />
                                        <Textarea placeholder="למשל: תפקיד שבו הדרכתי אנשים וראיתי אותם מצליחים..." value={formData.satisfying_role || ''} onChange={(e) => handleDataChange('satisfying_role', e.target.value)} />
                                    </QuizQuestion>
                                )}
                                {currentStep === 1 && (
                                    <QuizQuestion title="החוזקות והכישורים שלך">
                                        <Textarea placeholder="3 יכולות חזקות שלך (למשל: יצירתיות, יכולת ארגון)..." value={formData.three_strengths || ''} onChange={(e) => handleDataChange('three_strengths', e.target.value)} />
                                        <Textarea placeholder="תחומים שהיית רוצה ללמוד או להתפתח בהם..." value={formData.areas_to_learn || ''} onChange={(e) => handleDataChange('areas_to_learn', e.target.value)} />
                                        <Label>דרגי את רמת הביטחון שלך ביכולות המקצועיות שלך (1-לא בטוחה כלל, 10-בטוחה מאוד)</Label>
                                        <Slider defaultValue={[5]} min={1} max={10} step={1} value={formData.professional_confidence} onValueChange={(value) => handleDataChange('professional_confidence', value)} />
                                    </QuizQuestion>
                                )}
                                {currentStep === 2 && (
                                    <QuizQuestion title="מה מניע אותך?">
                                        <div className="space-y-2">
                                          {['ביטחון כלכלי', 'הגשמה עצמית', 'גמישות בשעות', 'השפעה על אחרים', 'עניין ואתגר'].map(item => (
                                            <div key={item} className="flex items-center space-x-2 space-x-reverse">
                                              <Checkbox id={item} checked={formData.career_importance?.includes(item)} onCheckedChange={(checked) => {
                                                const old = formData.career_importance || [];
                                                const a = checked ? [...old, item] : old.filter(v => v !== item);
                                                handleDataChange('career_importance', a);
                                              }}/>
                                              <Label htmlFor={item}>{item}</Label>
                                            </div>
                                          ))}
                                        </div>
                                        <Textarea placeholder="תחומים שמעניינים אותך במיוחד..." value={formData.interesting_fields || ''} onChange={(e) => handleDataChange('interesting_fields', e.target.value)} />
                                    </QuizQuestion>
                                )}
                                {currentStep === 3 && (
                                    <QuizQuestion title="הדרך שלך ליזמות">
                                        <Textarea placeholder="מה הכי מושך אותך בעולם היזמות?" value={formData.entrepreneurship_attraction || ''} onChange={(e) => handleDataChange('entrepreneurship_attraction', e.target.value)} />
                                        <Textarea placeholder="מה הכי מדאיג או חוסם אותך?" value={formData.entrepreneurship_concerns || ''} onChange={(e) => handleDataChange('entrepreneurship_concerns', e.target.value)} />
                                    </QuizQuestion>
                                )}
                                {currentStep === 4 && (
                                    <QuizQuestion title="החזון שלך">
                                        <Textarea placeholder="אם היה לך רעיון לעסק, מה הוא היה?" value={formData.business_idea || ''} onChange={(e) => handleDataChange('business_idea', e.target.value)} />
                                        <Textarea placeholder="אילו כישורים חדשים היית צריכה לרכוש?" value={formData.skills_to_acquire || ''} onChange={(e) => handleDataChange('skills_to_acquire', e.target.value)} />
                                    </QuizQuestion>
                                )}
                                {currentStep === 5 && (
                                     <QuizQuestion title="תמיכה ומוכנות">
                                         <Label>איזו תמיכה הכי תעזור לך כרגע?</Label>
                                        <div className="space-y-2">
                                          {['ליווי של מנטורית', 'קורס מקצועי', 'קהילה תומכת', 'כלים פיננסיים'].map(item => (
                                            <div key={item} className="flex items-center space-x-2 space-x-reverse">
                                              <Checkbox id={`support-${item}`} checked={formData.support_needed?.includes(item)} onCheckedChange={(checked) => {
                                                const old = formData.support_needed || [];
                                                const a = checked ? [...old, item] : old.filter(v => v !== item);
                                                handleDataChange('support_needed', a);
                                              }}/>
                                              <Label htmlFor={`support-${item}`}>{item}</Label>
                                            </div>
                                          ))}
                                        </div>
                                        <Input placeholder="תמיכה אחרת..." value={formData.support_other || ''} onChange={(e) => handleDataChange('support_other', e.target.value)} />
                                        <Label>בסולם של 1-10, כמה את מרגישה מוכנה לצאת לדרך?</Label>
                                        <Slider defaultValue={[5]} min={1} max={10} step={1} value={formData.readiness_level} onValueChange={(value) => handleDataChange('readiness_level', value)} />
                                     </QuizQuestion>
                                )}
                                
                                <div className="flex justify-between mt-8">
                                    <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                        חזרה
                                    </Button>
                                    {currentStep < totalSteps - 1 ? (
                                        <Button onClick={handleNext}>
                                            המשך
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                        </Button>
                                    ) : (
                                        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                            {isSubmitting ? (
                                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> מעבדת...</>
                                            ) : (
                                                <><Sparkles className="w-4 h-4 mr-2" /> קבלת אבחון AI</>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </PremiumContentWrapper>
    );
}
