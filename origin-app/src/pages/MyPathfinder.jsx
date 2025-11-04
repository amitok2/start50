
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { PathfinderResponse } from '@/api/entities';
import { InvokeLLM } from '@/api/integrations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Loader2, ArrowLeft, ArrowRight, Printer, Sparkles, CheckCircle, Lightbulb, UserCheck, Search, Download, Target, Briefcase, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Progress } from "@/components/ui/progress";

const totalSteps = 3;

const careerImportanceOptions = [
  "גמישות בזמנים ומקום העבודה",
  "הכנסה יציבה וטובה", 
  "תחושת משמעות ותרומה",
  "פיתוח וצמיחה אישית",
  "יצירתיות והתמחות",
  "עבודה עם אנשים",
  "עצמאות והחלטה עצמית",
  "איזון עבודה-חיים"
];

const workStyleOptions = [
  "מובילה צוות ולוקחת אחריות",
  "עובדת בצוות בשיתוף פעולה", 
  "עובדת עצמאית ובאופן עצמאי",
  "מתמחה בתחום ספציפי",
  "מייעצת ומשתפת בידע",
  "יוצרת ומפתחת פתרונות חדשים"
];

const supportOptions = [
  "ליווי אישי/מנטורינג",
  "קורסים והכשרה מקצועית",
  "רשת של קשרים מקצועיים",
  "תמיכה כלכלית בתחילת הדרך",
  "כלים דיגיטליים ושיווקיים",
  "קבוצת תמיכה של נשים דומות",
  "ליווי משפטי או עסקי",
  "מידע על הזדמנויות ומשרות"
];

export default function MyPathfinder() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pathfinderRecord, setPathfinderRecord] = useState(null);
    const [currentStep, setCurrentStep] = useState(0); // מתחיל מ-0 עבור דף הפתיחה
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false); // For AI
    const [aiSummary, setAiSummary] = useState(null); // For AI
    const [summaryError, setSummaryError] = useState(null); // For AI
    const [formData, setFormData] = useState({
        // חלק א' - הערכה אישית ומקצועית
        previous_fields: "",
        satisfying_role: "",
        three_strengths: "",
        areas_to_learn: "",
        professional_confidence: [3],
        
        // חלק ב' - התאמה לקריירה מתקדמת  
        career_importance: [],
        interesting_fields: "",
        work_style: [],
        entrepreneurship_attraction: "",
        entrepreneurship_concerns: "",
        current_challenges: "",
        
        // חלק ג' - תכנון קריירה ופיתוח אישי
        three_goals: "",
        business_idea: "",
        skills_to_acquire: "",
        support_needed: [],
        support_other: "",
        readiness_level: [3],
        
        is_complete: false
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const currentUser = await User.me();
                setUser(currentUser);
                const existingResponse = await PathfinderResponse.filter({ created_by: currentUser.email });
                if (existingResponse.length > 0) {
                    const record = existingResponse[0];
                    setPathfinderRecord(record);
                    // המר את הנתונים הישנים לפורמט החדש אם נדרש
                    setFormData({
                        ...formData,
                        ...record,
                        professional_confidence: record.professional_confidence || [3],
                        readiness_level: record.readiness_level || [3],
                        career_importance: record.career_importance || [],
                        work_style: record.work_style || [],
                        support_needed: record.support_needed || []
                    });
                    
                    if (record.is_complete && record.ai_summary) {
                        setAiSummary(record.ai_summary);
                        setCurrentStep(totalSteps + 1); // Go to summary
                    }
                }
            } catch (error) {
                console.error("Error loading data:", error);
                // Redirect to login instead of staying on page
                navigate(createPageUrl('Home'));
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSliderChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCheckboxChange = (field, option, checked) => {
        setFormData(prev => {
            const currentOptions = prev[field] || [];
            if (checked) {
                return { ...prev, [field]: [...currentOptions, option] };
            } else {
                return { ...prev, [field]: currentOptions.filter(item => item !== option) };
            }
        });
    };
    
    const saveData = async (isCompleting = false, summary = null) => {
        setIsSubmitting(true);
        try {
            const dataToSave = { ...formData, is_complete: isCompleting };
            if (summary) {
                dataToSave.ai_summary = summary;
            }

            if (pathfinderRecord) {
                const updatedRecord = await PathfinderResponse.update(pathfinderRecord.id, dataToSave);
                setPathfinderRecord(updatedRecord);
                setFormData(prev => ({...prev, ...updatedRecord}));
            } else {
                const newRecord = await PathfinderResponse.create(dataToSave);
                setPathfinderRecord(newRecord);
                setFormData(prev => ({...prev, ...newRecord}));
            }
        } catch (error) {
            console.error("Failed to save data:", error);
            alert("אופס! הייתה שגיאה בשמירת הנתונים. נסי שוב.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextStep = async () => {
        if (currentStep > 0) { // שמירה רק אחרי דף הפתיחה
            await saveData();
        }
        setCurrentStep(prev => prev + 1);
    };
    
    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleFinish = async () => {
        await saveData(true); // Save final answers
        setCurrentStep(totalSteps + 1); // Move to summary page
        setIsGeneratingSummary(true);
        setSummaryError(null);

        try {
            // Prepare data for AI
            const userAnswers = `
              תחומים קודמים: ${formData.previous_fields}
              תפקיד מספק: ${formData.satisfying_role}
              חוזקות: ${formData.three_strengths}
              תחומים ללמידה: ${formData.areas_to_learn}
              ביטחון מקצועי (1-5): ${formData.professional_confidence[0]}
              מה חשוב בקריירה: ${formData.career_importance.join(', ')}
              תחומים מעניינים: ${formData.interesting_fields}
              סגנון עבודה: ${formData.work_style.join(', ')}
              מה מושך ביזמות: ${formData.entrepreneurship_attraction}
              חששות מיזמות: ${formData.entrepreneurship_concerns}
              אתגרים: ${formData.current_challenges}
              מטרות לשנתיים: ${formData.three_goals}
              רעיון לעסק: ${formData.business_idea}
              כישורים לרכישה: ${formData.skills_to_acquire}
              תמיכה נדרשת: ${[...formData.support_needed, formData.support_other].filter(Boolean).join(', ')}
              מוכנות לצאת לדרך (1-5): ${formData.readiness_level[0]}
            `;

            const prompt = `
                אתה יועץ קריירה מומחה, חם ומעצים, המתמחה בסיוע לנשים בגיל 50+ בתהליך של "קריירה שלישית".
                קיבלת את התשובות הבאות משאלון אבחון אישי של משתמשת:
                ${userAnswers}

                המשימה שלך היא ליצור סיכום אישי, מקצועי ומעורר השראה עבורה.
                הקפד על טון חיובי, מעשי וממוקד בפעולה.
                הפלט חייב להיות בפורמט JSON בלבד, בהתאם לסכמה שסופקה.
            `;
            
            const response_json_schema = {
                type: "object",
                properties: {
                    "personal_summary": { "type": "string", "description": "סיכום אישי, חם ומעצים (2-3 משפטים) המסכם את הפרופיל של המשתמשת." },
                    "strengths_analysis": { "type": "array", "items": { "type": "string" }, "description": "ניתוח של 2-3 נקודות חוזק מרכזיות עם הסבר קצר." },
                    "career_path_recommendation": {
                        "type": "object",
                        "properties": {
                            "title": { "type": "string", "description": "כותרת להמלצה על מסלול קריירה (למשל: 'הזדמנות בעולם היזמות')." },
                            "details": { "type": "string", "description": "פירוט ההמלצה על מסלול הקריירה המתאים." }
                        },
                        "required": ["title", "details"]
                    },
                    "actionable_steps": {
                        "type": "array",
                        "items": { "type": "string" },
                        "description": "רשימה של 3 צעדים קונקרטיים ופרקטיים שהמשתמשת יכולה לנקוט."
                    }
                },
                required: ["personal_summary", "strengths_analysis", "career_path_recommendation", "actionable_steps"]
            };

            const result = await InvokeLLM({
                prompt,
                response_json_schema,
            });

            setAiSummary(result);
            await saveData(true, result); // Save the AI summary to the database

        } catch (error) {
            console.error("AI summary generation failed:", error);
            setSummaryError("אוי, נתקלנו בבעיה ביצירת הסיכום. נסי לרענן את העמוד או לחזור מאוחר יותר.");
        } finally {
            setIsGeneratingSummary(false);
        }
    };
    
    const handlePrint = () => {
        window.print();
    };

    const startOver = async () => {
        const newFormData = {
            previous_fields: "",
            satisfying_role: "",
            three_strengths: "",
            areas_to_learn: "",
            professional_confidence: [3],
            career_importance: [],
            interesting_fields: "",
            work_style: [],
            entrepreneurship_attraction: "",
            entrepreneurship_concerns: "",
            current_challenges: "",
            three_goals: "",
            business_idea: "",
            skills_to_acquire: "",
            support_needed: [],
            support_other: "",
            readiness_level: [3],
            is_complete: false
        };
        setFormData(newFormData);
        setAiSummary(null); // Clear AI summary
        setSummaryError(null); // Clear any error
        setIsGeneratingSummary(false); // Reset generating state
        setCurrentStep(0);
        if (pathfinderRecord) {
            await PathfinderResponse.update(pathfinderRecord.id, newFormData);
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen"><Loader2 className="w-12 h-12 text-purple-500 animate-spin" /></div>;
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Target className="w-10 h-10 text-white" />
                        </div>
                        <CardTitle className="text-3xl mb-6 text-gray-900">ברוכה הבאה!</CardTitle>
                        <div className="max-w-2xl mx-auto text-lg leading-relaxed text-gray-700 space-y-4">
                            <p>
                                זהו שאלון אישי שמטרתו לעזור לך להבין את הכוחות, החלומות וההזדמנויות שלך 
                                לקראת <strong>הקריירה השלישית</strong> שלך — כשכירה, כעצמאית, או כיזמית.
                            </p>
                            <p>
                                בסיום השאלון תקבלי <strong>תובנות אישיות ראשוניות</strong> והמלצות מותאמות לך אישית.
                            </p>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-6">
                                <p className="text-purple-800 font-medium">
                                    ⏱️ משך המילוי כ-10 דקות
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <CardTitle className="flex items-center gap-3 mb-6">
                            <UserCheck className="w-8 h-8 text-purple-500" />
                            ✨ חלק א' — הערכה אישית ומקצועית
                        </CardTitle>
                        <div className="space-y-8">
                            <div>
                                <Label htmlFor="previous_fields" className="text-lg font-semibold text-gray-800 mb-3 block">
                                    1. באילו תחומים עסקתי עד כה?
                                </Label>
                                <Textarea 
                                    id="previous_fields" 
                                    value={formData.previous_fields} 
                                    onChange={handleInputChange} 
                                    rows={4} 
                                    className="text-base" 
                                    placeholder="למשל: חינוך, שיווק, משאבי אנוש, יעוץ עסקי..."
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="satisfying_role" className="text-lg font-semibold text-gray-800 mb-3 block">
                                    2. תפקיד שבו הרגשתי מסופקת ומצליחה:
                                </Label>
                                <Textarea 
                                    id="satisfying_role" 
                                    value={formData.satisfying_role} 
                                    onChange={handleInputChange} 
                                    rows={4} 
                                    className="text-base"
                                    placeholder="תארי תפקיד או תקופה שבהם הרגשת הכי טוב..."
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="three_strengths" className="text-lg font-semibold text-gray-800 mb-3 block">
                                    3. שלוש היכולות החזקות שלי:
                                </Label>
                                <Textarea 
                                    id="three_strengths" 
                                    value={formData.three_strengths} 
                                    onChange={handleInputChange} 
                                    rows={4} 
                                    className="text-base"
                                    placeholder="למשל: ניהול פרויקטים, יצירתיות, יכולת הקשבה..."
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="areas_to_learn" className="text-lg font-semibold text-gray-800 mb-3 block">
                                    4. תחומים שחשוב לי ללמוד או לחזק:
                                </Label>
                                <Textarea 
                                    id="areas_to_learn" 
                                    value={formData.areas_to_learn} 
                                    onChange={handleInputChange} 
                                    rows={4} 
                                    className="text-base"
                                    placeholder="למשל: כלים דיגיטליים, מכירות, ניהול כספים..."
                                />
                            </div>
                            
                            <div>
                                <Label className="text-lg font-semibold text-gray-800 mb-3 block">
                                    5. עד כמה אני בטוחה בעצמי מקצועית?
                                </Label>
                                <div className="px-4">
                                    <Slider
                                        value={formData.professional_confidence}
                                        onValueChange={(value) => handleSliderChange('professional_confidence', value)}
                                        max={5}
                                        min={1}
                                        step={1}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                                        <span>לא בטוחה (1)</span>
                                        <span className="font-semibold text-purple-600">
                                            {formData.professional_confidence[0]}
                                        </span>
                                        <span>מאוד בטוחה (5)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <CardTitle className="flex items-center gap-3 mb-6">
                            <Briefcase className="w-8 h-8 text-purple-500" />
                            🌟 חלק ב' — התאמה לקריירה מתקדמת
                        </CardTitle>
                        <div className="space-y-8">
                            <div>
                                <Label className="text-lg font-semibold text-gray-800 mb-3 block">
                                    6. מה הכי חשוב לי בקריירה הקרובה? (ניתן לבחור מספר אופציות)
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {careerImportanceOptions.map(option => (
                                        <div key={option} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                            <Checkbox 
                                                id={`career-${option}`} 
                                                onCheckedChange={(checked) => handleCheckboxChange('career_importance', option, checked)}
                                                checked={formData.career_importance?.includes(option)}
                                            />
                                            <Label htmlFor={`career-${option}`} className="text-sm cursor-pointer">{option}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="interesting_fields" className="text-lg font-semibold text-gray-800 mb-3 block">
                                    7. תחומים שמסקרנים אותי:
                                </Label>
                                <Textarea 
                                    id="interesting_fields" 
                                    value={formData.interesting_fields} 
                                    onChange={handleInputChange} 
                                    rows={4} 
                                    className="text-base"
                                    placeholder="למשל: יעוץ עסקי, אמנות, בריאות, טכנולוגיה..."
                                />
                            </div>
                            
                            <div>
                                <Label className="text-lg font-semibold text-gray-800 mb-3 block">
                                    8. איך אני רואה את עצמי בעבודה? (ניתן לבחור מספר אופציות)
                                </Label>
                                <div className="grid grid-cols-1 gap-3">
                                    {workStyleOptions.map(option => (
                                        <div key={option} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                            <Checkbox 
                                                id={`work-${option}`} 
                                                onCheckedChange={(checked) => handleCheckboxChange('work_style', option, checked)}
                                                checked={formData.work_style?.includes(option)}
                                            />
                                            <Label htmlFor={`work-${option}`} className="text-sm cursor-pointer">{option}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="entrepreneurship_attraction" className="text-lg font-semibold text-gray-800 mb-3 block">
                                    9. מה מושך אותי בעצמאות או יזמות?
                                </Label>
                                <Textarea 
                                    id="entrepreneurship_attraction" 
                                    value={formData.entrepreneurship_attraction} 
                                    onChange={handleInputChange} 
                                    rows={4} 
                                    className="text-base"
                                    placeholder="למשל: חופש בקבלת החלטות, יצירתיות, בניית משהו שלי..."
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="entrepreneurship_concerns" className="text-lg font-semibold text-gray-800 mb-3 block">
                                    10. אילו חששות יש לי מלהיות עצמאית או יזמית?
                                </Label>
                                <Textarea 
                                    id="entrepreneurship_concerns" 
                                    value={formData.entrepreneurship_concerns} 
                                    onChange={handleInputChange} 
                                    rows={4} 
                                    className="text-base"
                                    placeholder="למשל: חוסר יציבות כלכלית, פחד מכישלון, חוסר ניסיון בעסקים..."
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="current_challenges" className="text-lg font-semibold text-gray-800 mb-3 block">
                                    11. אתגרים שאני מזהה כרגע:
                                </Label>
                                <Textarea 
                                    id="current_challenges" 
                                    value={formData.current_challenges} 
                                    onChange={handleInputChange} 
                                    rows={4} 
                                    className="text-base"
                                    placeholder="למשל: חוסר זמן, ביטחון עצמי, ידע טכני..."
                                />
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <CardTitle className="flex items-center gap-3 mb-6">
                            <Sparkles className="w-8 h-8 text-purple-500" />
                            🚀 חלק ג' — תכנון קריירה ופיתוח אישי
                        </CardTitle>
                        <div className="space-y-8">
                            <div>
                                <Label htmlFor="three_goals" className="text-lg font-semibold text-gray-800 mb-3 block">
                                    12. שלוש מטרות לשנתיים הקרובות:
                                </Label>
                                <Textarea 
                                    id="three_goals" 
                                    value={formData.three_goals} 
                                    onChange={handleInputChange} 
                                    rows={5} 
                                    className="text-base"
                                    placeholder="למשל: להשלים קורס בתחום X, לבנות רשת קשרים מקצועיים, להתחיל לעבוד עצמאית..."
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="business_idea" className="text-lg font-semibold text-gray-800 mb-3 block">
                                    13. אם הייתי פותחת עסק — מה היה התחום או הרעיון?
                                </Label>
                                <Textarea 
                                    id="business_idea" 
                                    value={formData.business_idea} 
                                    onChange={handleInputChange} 
                                    rows={4} 
                                    className="text-base"
                                    placeholder="למשל: ייעוץ לעסקים קטנים, סטודיו יוגה, חנות אונליין..."
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="skills_to_acquire" className="text-lg font-semibold text-gray-800 mb-3 block">
                                    14. מיומנויות או כישורים שחשוב לי לרכוש כדי להצליח:
                                </Label>
                                <Textarea 
                                    id="skills_to_acquire" 
                                    value={formData.skills_to_acquire} 
                                    onChange={handleInputChange} 
                                    rows={4} 
                                    className="text-base"
                                    placeholder="למשל: שיווק דיגיטלי, ניהול כספים, מכירות, רישוי מקצועי..."
                                />
                            </div>
                            
                            <div>
                                <Label className="text-lg font-semibold text-gray-800 mb-3 block">
                                    15. מה יוכל לתמוך בי בדרך? (ניתן לבחור מספר אופציות)
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {supportOptions.map(option => (
                                        <div key={option} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                            <Checkbox 
                                                id={`support-${option}`} 
                                                onCheckedChange={(checked) => handleCheckboxChange('support_needed', option, checked)}
                                                checked={formData.support_needed?.includes(option)}
                                            />
                                            <Label htmlFor={`support-${option}`} className="text-sm cursor-pointer">{option}</Label>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <Label htmlFor="support_other" className="text-sm text-gray-600 mb-2 block">
                                        דבר אחר שיכול לתמוך בי:
                                    </Label>
                                    <Textarea 
                                        id="support_other" 
                                        value={formData.support_other} 
                                        onChange={handleInputChange} 
                                        rows={2} 
                                        className="text-base"
                                        placeholder="אם יש משהו נוסף שחשוב לך..."
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <Label className="text-lg font-semibold text-gray-800 mb-3 block">
                                    16. עד כמה אני מרגישה מוכנה לצאת לדרך?
                                </Label>
                                <div className="px-4">
                                    <Slider
                                        value={formData.readiness_level}
                                        onValueChange={(value) => handleSliderChange('readiness_level', value)}
                                        max={5}
                                        min={1}
                                        step={1}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                                        <span>לא מוכנה (1)</span>
                                        <span className="font-semibold text-purple-600">
                                            {formData.readiness_level[0]}
                                        </span>
                                        <span>מוכנה מאוד (5)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                if (isGeneratingSummary) {
                    return (
                        <div className="text-center py-20">
                            <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-gray-800">רק עוד רגע...</h2>
                            <p className="text-gray-600 mt-2">מגבשת עבורך תובנות והמלצות אישיות</p>
                        </div>
                    );
                }
                
                if (summaryError) {
                     return (
                        <div className="text-center py-20">
                            <h2 className="text-xl font-bold text-red-600 mb-4">שגיאה ביצירת הסיכום</h2>
                            <p className="text-gray-600 mb-6">{summaryError}</p>
                            <Button onClick={handleFinish}>נסי שוב</Button>
                        </div>
                    );
                }
                
                if (aiSummary) {
                    return (
                        <div className="printable-area">
                            <CardTitle className="text-center text-3xl mb-4 text-gray-900">
                                <Sparkles className="inline-block w-8 h-8 text-yellow-400 -mt-2 mr-2"/>
                                הסיכום האישי שלך
                            </CardTitle>
                             <p className="text-center text-lg text-gray-600 mb-8">{aiSummary.personal_summary}</p>
                             
                             <div className="space-y-8">
                                <div className="p-6 bg-green-50/70 rounded-xl border border-green-200">
                                    <h3 className="font-bold text-xl text-green-800 mb-3 flex items-center gap-2">
                                        <Lightbulb className="w-6 h-6" />
                                        נקודות האור שלך
                                    </h3>
                                    <ul className="space-y-2 list-disc pr-5">
                                      {aiSummary.strengths_analysis.map((item, i) => <li key={i} className="text-gray-800 leading-relaxed">{item}</li>)}
                                    </ul>
                                </div>
                                
                                <div className="p-6 bg-purple-50/70 rounded-xl border border-purple-200">
                                    <h3 className="font-bold text-xl text-purple-800 mb-3 flex items-center gap-2">
                                        <Target className="w-6 h-6" />
                                        המלצה למסלול הבא
                                    </h3>
                                    <p className="font-semibold text-gray-900">{aiSummary.career_path_recommendation.title}</p>
                                    <p className="text-gray-800 leading-relaxed mt-1">
                                        {aiSummary.career_path_recommendation.details}
                                    </p>
                                </div>
                                
                                <div className="p-6 bg-blue-50/70 rounded-xl border border-blue-200">
                                    <h3 className="font-bold text-xl text-blue-800 mb-3 flex items-center gap-2">
                                        <Briefcase className="w-6 h-6" />
                                        צעדים ראשונים לדרך
                                    </h3>
                                    <ol className="space-y-3">
                                      {aiSummary.actionable_steps.map((item, i) => (
                                          <li key={i} className="flex items-start gap-3">
                                              <div className="w-6 h-6 flex-shrink-0 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">{i+1}</div>
                                              <span className="text-gray-800 leading-relaxed">{item}</span>
                                          </li>
                                      ))}
                                    </ol>
                                </div>
                             </div>

                            {/* Call to Action */}
                            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 mt-10 text-center text-white no-print">
                                <h4 className="font-bold text-xl mb-3">🎯 מה עכשיו?</h4>
                                <p className="leading-relaxed mb-4">
                                    הסיכום הזה הוא נקודת הפתיחה שלך. הגיע הזמן להפוך תובנות לפעולות!
                                </p>
                                <div className="flex justify-center flex-wrap gap-4">
                                   <Button asChild size="lg" className="bg-white text-purple-700 hover:bg-gray-100">
                                        <Link to={createPageUrl("MeetMentors")}>
                                            <UserCheck className="w-5 h-5 ml-2" />
                                            לשיחת ייעוץ עם מנטורית
                                        </Link>
                                    </Button>
                                    <Button asChild size="lg" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                                        <Link to={createPageUrl("PersonalGoals")}>
                                            <Target className="w-5 h-5 ml-2" />
                                            להגדיר את היעדים שלי
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                }
                
                // Fallback in case something went wrong but no error was caught
                return <div className="text-center p-8">טוען סיכום...</div>;
            default: return null;
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
             <style>
                {`
                  @media print {
                    body * { visibility: hidden; }
                    .printable-area, .printable-area * { visibility: visible; }
                    .printable-area { position: absolute; left: 0; top: 0; width: 100%; padding: 20px !important; }
                    .no-print { display: none !important; }
                  }
                `}
            </style>
            <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                     {currentStep > 0 && currentStep <= totalSteps && (
                        <>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-600">שלב {currentStep} מתוך {totalSteps}</span>
                                <span className="text-sm font-bold gradient-text">שאלון אבחון קריירה שלישית</span>
                            </div>
                            <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
                        </>
                    )}
                </CardHeader>
                <CardContent className="p-8 md:p-12">
                    {renderStepContent()}
                    
                    <div className="mt-12 flex justify-between items-center no-print">
                        {currentStep > 0 && currentStep <= totalSteps && (
                            <Button variant="outline" onClick={handlePrevStep} className="text-lg px-6 py-5">
                                <ArrowRight className="w-5 h-5 ml-2" />
                                חזרה
                            </Button>
                        )}
                         {currentStep > totalSteps && ( // Summary page buttons
                             <div className='flex flex-wrap gap-4'>
                                <Button onClick={handlePrint} className="text-lg px-6 py-5 bg-purple-600 hover:bg-purple-700">
                                    <Printer className="w-5 h-5 ml-2" />
                                    הדפסה / שמירה כ-PDF
                                </Button>
                                <Button asChild className="text-lg px-6 py-5 bg-rose-600 hover:bg-rose-700">
                                    <Link to={createPageUrl("MeetMentors")}>
                                        <UserCheck className="w-5 h-5 ml-2" />
                                        אני רוצה להמשיך לליווי אישי
                                    </Link>
                                </Button>
                                <Button variant="ghost" onClick={startOver} className="text-lg text-gray-600">
                                    התחילי מחדש
                                </Button>
                            </div>
                        )}
                        <div className="mr-auto">
                            {currentStep === 0 && (
                                <Button onClick={handleNextStep} className="text-lg px-8 py-5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                                    <ArrowLeft className="w-5 h-5 ml-2" />
                                    בואי נתחיל!
                                </Button>
                            )}
                            {currentStep > 0 && currentStep < totalSteps && (
                                <Button onClick={handleNextStep} disabled={isSubmitting} className="text-lg px-6 py-5">
                                    {isSubmitting ? <Loader2 className="animate-spin ml-2"/> :  <ArrowLeft className="w-5 h-5 ml-2" />}
                                    {isSubmitting ? 'שומר...' : 'שמירה והמשך'}
                                </Button>
                            )}
                            {currentStep === totalSteps && (
                                <Button onClick={handleFinish} disabled={isSubmitting} className="text-lg px-8 py-5 bg-green-600 hover:bg-green-700">
                                    {isSubmitting ? <Loader2 className="animate-spin ml-2"/> : <CheckCircle className="w-5 h-5 ml-2" />}
                                    {isSubmitting ? 'שומר...' : 'סיום וקבלת תובנות'}
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
