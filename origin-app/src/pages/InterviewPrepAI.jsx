
import React, { useState } from 'react';
import { User } from '@/api/entities';
import { CareerReferral } from '@/api/entities';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Brain, CheckCircle, Lightbulb, ArrowLeft, MessageSquare, Send, SkipForward, Save } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PremiumContentWrapper from '../components/auth/PremiumContentWrapper';

export default function InterviewPrepAI() {
    const [formData, setFormData] = useState({
        companyName: '',
        jobTitle: '',
        jobDescription: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [prepResults, setPrepResults] = useState(null);
    const [user, setUser] = useState(null);
    
    // Simulation states
    const [showSimulation, setShowSimulation] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [simulationFeedback, setSimulationFeedback] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [referralId, setReferralId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [savedSuccessfully, setSavedSuccessfully] = useState(false);
    
    const location = useLocation();

    React.useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await User.me();
                setUser(currentUser);
                
                // Check if we have a referralId in URL params
                const urlParams = new URLSearchParams(location.search);
                const refId = urlParams.get('referralId');
                if (refId) {
                    setReferralId(refId);
                    
                    // Load the referral data to pre-fill the form
                    try {
                        const referral = await CareerReferral.filter({ id: refId });
                        if (referral && referral.length > 0) {
                            setFormData({
                                companyName: referral[0].company_name || '',
                                jobTitle: referral[0].job_title || '',
                                jobDescription: ''
                            });
                        }
                    } catch (error) {
                        console.error("Failed to load referral:", error);
                    }
                }
            } catch (error) {
                console.error("Failed to load user:", error);
            }
        };
        loadUser();
    }, [location.search]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleGeneratePrep = async () => {
        if (!formData.companyName.trim() || !formData.jobTitle.trim()) {
            alert('אנא מלאי את שם החברה ואת התפקיד');
            return;
        }

        setIsLoading(true);
        try {
            const prompt = `
אתה יועץ קריירה מומחה המתמחה בהכנת נשים בגיל 50+ לראיונות עבודה.
משתמשת בקהילה ReStart 50+ מתכוננת לראיון עבודה עם הפרטים הבאים:

שם החברה: ${formData.companyName}
תפקיד: ${formData.jobTitle}
${formData.jobDescription ? `תיאור התפקיד: ${formData.jobDescription}` : ''}

המשימה שלך היא להכין עבורה חבילת הכנה מקיפה לראיון, הכוללת:
1. שאלות ראיון צפויות (כלליות וספציפיות לתפקיד)
2. נקודות מפתח להדגיש בתשובות
3. טיפים מעשיים להכנה

התבסס על הניסיון והיתרונות הייחודיים של נשים בגיל 50+: ניסיון עשיר, בגרות, יציבות, והבנה עמוקה של צרכי לקוחות.
כתב הכל בעברית, בטון תומך ומעצים.

הפלט שלך חייב להיות בפורמט JSON בעברית.
            `;

            const response_json_schema = {
                type: "object",
                properties: {
                    general_questions: {
                        type: "array",
                        items: { type: "string" },
                        description: "שאלות ראיון כלליות"
                    },
                    specific_questions: {
                        type: "array", 
                        items: { type: "string" },
                        description: "שאלות ספציפיות לתפקיד"
                    },
                    key_points: {
                        type: "array",
                        items: { type: "string" },
                        description: "נקודות מפתח להדגיש"
                    },
                    preparation_tips: {
                        type: "array",
                        items: { type: "string" },
                        description: "טיפים מעשיים להכנה"
                    },
                    strengths_to_highlight: {
                        type: "array",
                        items: { type: "string" },
                        description: "חוזקות של נשים 50+ להדגיש"
                    }
                },
                required: ["general_questions", "specific_questions", "key_points", "preparation_tips", "strengths_to_highlight"]
            };

            const aiResult = await base44.integrations.Core.InvokeLLM({ 
                prompt, 
                response_json_schema 
            });
            
            setPrepResults(aiResult);
            
            // מתחילים את הסימולציה מיד אחרי שה-AI סיים
            setShowSimulation(true);
            setCurrentQuestionIndex(0);
            setUserAnswers([]);
            setCurrentAnswer('');
            setSimulationFeedback(null);
            setSavedSuccessfully(false);
            
        } catch (error) {
            console.error("Failed to generate interview prep:", error);
            alert('אירעה שגיאה ביצירת ההכנה לראיון. אנא נסי שוב.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveResults = async () => {
        if (!referralId) {
            alert('לא ניתן לשמור - אין הפניית קריירה משויכת. אנא גשי מדף ההפניות.');
            return;
        }

        setIsSaving(true);
        try {
            await CareerReferral.update(referralId, {
                interview_feedback: {
                    ...simulationFeedback,
                    simulation_date: new Date().toISOString(),
                    company_name: formData.companyName,
                    job_title: formData.jobTitle,
                    questions_and_answers: userAnswers
                }
            });
            
            setSavedSuccessfully(true);
            
            // Show success message for 3 seconds
            setTimeout(() => {
                setSavedSuccessfully(false);
            }, 3000);
        } catch (error) {
            console.error('Failed to save feedback:', error);
            alert('אירעה שגיאה בשמירת התוצאות. אנא נסי שוב.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleStartSimulation = () => {
        setShowSimulation(true);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setCurrentAnswer('');
        setSimulationFeedback(null);
        setSavedSuccessfully(false);
    };

    const handleSubmitAnswer = () => {
        if (!currentAnswer.trim()) {
            alert('אנא כתבי תשובה לפני המעבר לשאלה הבאה');
            return;
        }

        const allQuestions = [
            ...(prepResults.general_questions || []),
            ...(prepResults.specific_questions || [])
        ];

        const newAnswers = [...userAnswers, {
            question: allQuestions[currentQuestionIndex],
            answer: currentAnswer
        }];

        setUserAnswers(newAnswers);
        setCurrentAnswer('');

        if (currentQuestionIndex < Math.min(allQuestions.length - 1, 4)) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            handleFinishSimulation(newAnswers);
        }
    };

    const handleSkipQuestion = () => {
        const allQuestions = [
            ...(prepResults.general_questions || []),
            ...(prepResults.specific_questions || [])
        ];

        if (currentQuestionIndex < Math.min(allQuestions.length - 1, 4)) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setCurrentAnswer('');
        } else {
            if (userAnswers.length === 0) {
                alert('עליך לענות לפחות על שאלה אחת כדי לקבל פידבק');
                return;
            }
            handleFinishSimulation(userAnswers);
        }
    };

    const handleFinishSimulation = async (answers) => {
        setIsAnalyzing(true);
        try {
            const response = await base44.functions.invoke('analyzeInterviewSimulation', {
                companyName: formData.companyName,
                jobTitle: formData.jobTitle,
                jobDescription: formData.jobDescription,
                questionsAndAnswers: answers
            });
            
            setSimulationFeedback(response.data);
            setShowSimulation(false);
        } catch (error) {
            console.error("Failed to analyze interview:", error);
            alert('אירעה שגיאה בניתוח הראיון. אנא נסי שוב.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const allQuestions = prepResults ? [
        ...(prepResults.general_questions || []),
        ...(prepResults.specific_questions || [])
    ] : [];

    const currentQuestion = allQuestions[currentQuestionIndex];
    const totalQuestionsToAsk = Math.min(allQuestions.length, 5);

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <PremiumContentWrapper
                    title="ראיון עם ReStart – הכנה חכמה לראיון עבודה"
                    message="כלי ההכנה לראיון כולל סימולציה מדויקת עם פידבק אישי וממוקד, וזמין באופן בלעדי למנויות פרימיום בלבד."
                >
                    {/* Header - visible to all users */}
                    <Card className="mb-8 bg-white/90 backdrop-blur-sm shadow-xl border-0">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                                🎯 הכנה לראיון עם ReStart – ביטחון, מקצועיות והצלחה
                            </CardTitle>
                            <CardDescription className="text-lg text-gray-600">
                                קבלי הכנה אישית לראיון המותאמת במיוחד לתפקיד שלך
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {showSimulation ? (
                        // Interview Simulation
                        <div className="space-y-6">
                            <Card className="bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-200">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-purple-800">סימולציית ראיון</h3>
                                        <span className="text-sm text-purple-600">
                                            שאלה {currentQuestionIndex + 1} מתוך {totalQuestionsToAsk}
                                        </span>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 mb-4">
                                        <p className="text-lg text-gray-800 text-right leading-relaxed">
                                            {currentQuestion}
                                        </p>
                                    </div>
                                    <Textarea
                                        value={currentAnswer}
                                        onChange={(e) => setCurrentAnswer(e.target.value)}
                                        placeholder="כתבי כאן את תשובתך לשאלה..."
                                        className="h-32 text-right"
                                        dir="rtl"
                                    />
                                    <div className="flex gap-3 mt-4">
                                        <Button
                                            onClick={handleSubmitAnswer}
                                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                                        >
                                            <Send className="w-4 h-4 ml-2" />
                                            {currentQuestionIndex < totalQuestionsToAsk - 1 ? 'שאלה הבאה' : 'סיימתי - קבלי פידבק'}
                                        </Button>
                                        <Button
                                            onClick={handleSkipQuestion}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            <SkipForward className="w-4 h-4 ml-2" />
                                            דלגי על השאלה
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {userAnswers.length > 0 && (
                                <Card className="bg-white/80">
                                    <CardHeader>
                                        <CardTitle className="text-lg">התשובות שלך עד כה</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {userAnswers.map((qa, idx) => (
                                                <div key={idx} className="bg-gray-50 p-3 rounded-lg text-right">
                                                    <p className="text-sm text-gray-600 mb-1">שאלה {idx + 1}:</p>
                                                    <p className="text-xs text-gray-500 mb-2 italic">{qa.question}</p>
                                                    <p className="text-sm text-gray-800">{qa.answer}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    ) : isAnalyzing ? (
                        // Analyzing state
                        <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
                            <CardContent className="p-12 text-center">
                                <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">מנתחת את הראיון שלך...</h3>
                                <p className="text-gray-600">רק עוד רגע, אנחנו מכינות עבורך פידבק מפורט ומותאם אישית</p>
                            </CardContent>
                        </Card>
                    ) : simulationFeedback ? (
                        // Simulation Feedback Results
                        <div className="space-y-8" dir="rtl">
                            <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-200">
                                <CardContent className="p-6 text-center" dir="rtl">
                                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                                    <h3 className="text-2xl font-bold text-green-800 mb-2">
                                        כל הכבוד! סיימת את סימולציית הראיון 🎉
                                    </h3>
                                    <p className="text-green-700">
                                        הנה הפידבק המפורט שלך
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Success Save Message */}
                            {savedSuccessfully && (
                                <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 animate-pulse">
                                    <CardContent className="p-4 text-center">
                                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <p className="text-green-800 font-semibold">התוצאות נשמרו בהצלחה! 🎉</p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Overall Performance */}
                            {simulationFeedback.overall_impression && (
                                <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-blue-800 text-right" dir="rtl">
                                            📊 ביצועים כלליים
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent dir="rtl">
                                        <p className="text-gray-800 text-right leading-relaxed whitespace-pre-wrap">
                                            {String(simulationFeedback.overall_impression)}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Strengths */}
                            {simulationFeedback.strengths && Array.isArray(simulationFeedback.strengths) && simulationFeedback.strengths.length > 0 && (
                                <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-green-800 text-right" dir="rtl">
                                            💪 נקודות חוזק
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent dir="rtl">
                                        <ul className="space-y-3">
                                            {simulationFeedback.strengths.map((strength, index) => (
                                                <li key={index} className="flex items-start gap-3 text-right" dir="rtl">
                                                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium">
                                                        ✓
                                                    </span>
                                                    <span className="text-gray-800 text-right flex-1">{String(strength)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Areas for Improvement */}
                            {simulationFeedback.areas_for_improvement && Array.isArray(simulationFeedback.areas_for_improvement) && simulationFeedback.areas_for_improvement.length > 0 && (
                                <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-orange-800 text-right" dir="rtl">
                                            🎯 תחומים לשיפור
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent dir="rtl">
                                        <ul className="space-y-3">
                                            {simulationFeedback.areas_for_improvement.map((area, index) => (
                                                <li key={index} className="flex items-start gap-3 text-right" dir="rtl">
                                                    <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center text-sm font-medium">
                                                        ⚡
                                                    </span>
                                                    <span className="text-gray-800 text-right flex-1">{String(area)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Specific Answer Feedback */}
                            {simulationFeedback.answer_feedback && Array.isArray(simulationFeedback.answer_feedback) && simulationFeedback.answer_feedback.length > 0 && (
                                <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-purple-800 text-right" dir="rtl">
                                            💬 פידבק ספציפי לתשובות
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent dir="rtl">
                                        <div className="space-y-4">
                                            {simulationFeedback.answer_feedback.map((feedback, index) => (
                                                <div key={index} className="bg-purple-50 p-4 rounded-lg text-right" dir="rtl">
                                                    <p className="font-semibold text-purple-900 mb-2">שאלה {index + 1}</p>
                                                    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{String(feedback)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Action Items */}
                            {simulationFeedback.action_items && Array.isArray(simulationFeedback.action_items) && simulationFeedback.action_items.length > 0 && (
                                <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-indigo-800 text-right" dir="rtl">
                                            <Lightbulb className="w-5 h-5" />
                                            המלצות לפעולה
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent dir="rtl">
                                        <ul className="space-y-3">
                                            {simulationFeedback.action_items.map((item, index) => (
                                                <li key={index} className="flex items-start gap-3 text-right" dir="rtl">
                                                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center text-sm font-medium">
                                                        {index + 1}
                                                    </span>
                                                    <span className="text-gray-800 text-right flex-1">{String(item)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Recommended Links */}
                            {simulationFeedback.recommended_links && Array.isArray(simulationFeedback.recommended_links) && simulationFeedback.recommended_links.length > 0 && (
                                <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-indigo-800 text-right" dir="rtl">
                                            🔗 המשך המסע שלך בפלטפורמה
                                        </CardTitle>
                                        <CardDescription className="text-right" dir="rtl">
                                            משאבים מומלצים במיוחד עבורך
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent dir="rtl">
                                        <div className="space-y-3">
                                            {simulationFeedback.recommended_links.map((link, index) => (
                                                <Link 
                                                    key={index} 
                                                    to={createPageUrl(link.page)}
                                                    className="block p-4 rounded-lg bg-white hover:bg-indigo-50 border border-indigo-200 transition-all hover:shadow-md"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-right flex-1">
                                                            <div className="font-semibold text-indigo-700">{String(link.title)}</div>
                                                        </div>
                                                        <ArrowLeft className="w-5 h-5 text-indigo-500 flex-shrink-0 mr-3" />
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center" dir="rtl">
                                {referralId && !savedSuccessfully && (
                                    <Button 
                                        onClick={handleSaveResults}
                                        disabled={isSaving}
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                                שומר...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 ml-2" />
                                                שמרי את התוצאות
                                            </>
                                        )}
                                    </Button>
                                )}
                                
                                <Button 
                                    onClick={() => {
                                        setSimulationFeedback(null);
                                        setShowSimulation(false);
                                        setPrepResults(null);
                                        setFormData({ companyName: '', jobTitle: '', jobDescription: '' });
                                        setSavedSuccessfully(false);
                                    }}
                                    variant="outline"
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    הכנה לתפקיד נוסף
                                </Button>
                                
                                <Button 
                                    onClick={() => {
                                        setSimulationFeedback(null);
                                        setSavedSuccessfully(false);
                                        handleStartSimulation();
                                    }}
                                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                                >
                                    <MessageSquare className="w-4 h-4 ml-2" />
                                    תרגלי שוב את הראיון
                                </Button>
                                
                                <Button asChild>
                                    <Link to={createPageUrl('CareerReferrals')}>
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        חזרה להפניות הקריירה
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ) : ( // Default state when no simulation, analysis, or feedback is active
                        referralId && formData.companyName && formData.jobTitle ? (
                            // Initial Prep View - Welcome Screen (when referral is pre-filled and ready to generate)
                            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
                                <CardContent className="p-12 text-center">
                                    <div className="max-w-2xl mx-auto space-y-6">
                                        <div className="text-6xl mb-6">🎯</div>
                                        
                                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                            הכנה לראיון עם ReStart – ביטחון, מקצועיות והצלחה
                                        </h2>
                                        
                                        <p className="text-xl text-gray-700 leading-relaxed">
                                            קבלי הכנה אישית לראיון עבודה, מותאמת במיוחד עבורך בעזרת בינה מלאכותית.
                                        </p>
                                        
                                        <p className="text-lg text-gray-600 leading-relaxed">
                                            המערכת תעזור לך לתרגל שאלות אמיתיות, לבנות ביטחון עצמי, ולהבליט את החוזקות שלך כאישה מנוסה ובוגרת.
                                        </p>
                                        
                                        <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200">
                                            <p className="text-lg text-purple-800 font-medium">
                                                🧘‍♀️ לפני שמתחילים, כדאי לבצע את התרגול מהמחשב, בסביבה שקטנה וללא הפרעות.
                                            </p>
                                        </div>
                                        
                                        <div className="pt-4">
                                            <p className="text-xl font-semibold text-gray-800 mb-4">
                                                מוכנה לתרגל? 💪
                                            </p>
                                            <Button
                                                onClick={handleGeneratePrep}
                                                disabled={isLoading}
                                                size="lg"
                                                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xl px-12 py-6 rounded-full shadow-2xl"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                                        מכינה את הסימולציה...
                                                    </>
                                                ) : (
                                                    <>
                                                        <MessageSquare className="w-6 h-6 mr-3" />
                                                        התחילי סימולציית ראיון
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        
                                        <div className="pt-6">
                                            <Button asChild variant="outline" size="lg">
                                                <Link to={createPageUrl('CareerReferrals')}>
                                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                                    חזרה להפניות הקריירה
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            // Input Form (when no referral, or referral is missing data, or user wants to start fresh)
                            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                                        <Brain className="w-6 h-6 text-rose-500" />
                                        פרטי הראיון
                                    </CardTitle>
                                    <CardDescription>
                                        מלאי את הפרטים כדי לקבל הכנה מותאמת אישית
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                                            שם החברה *
                                        </Label>
                                        <Input
                                            id="companyName"
                                            placeholder="למשל: מיקרוסופט ישראל"
                                            value={formData.companyName}
                                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
                                            התפקיד *
                                        </Label>
                                        <Input
                                            id="jobTitle"
                                            placeholder="למשל: מנהלת פרויקטים"
                                            value={formData.jobTitle}
                                            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="jobDescription" className="text-sm font-medium text-gray-700">
                                            תיאור התפקיד (אופציונלי)
                                        </Label>
                                        <Textarea
                                            id="jobDescription"
                                            placeholder="העתיקי כאן את תיאור התפקיד מהמודעה (יעזור ליצור הכנה מדויקת יותר)"
                                            value={formData.jobDescription}
                                            onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                                            className="mt-1 h-24"
                                        />
                                    </div>

                                    <Button 
                                        onClick={handleGeneratePrep}
                                        disabled={isLoading || !formData.companyName.trim() || !formData.jobTitle.trim()}
                                        className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3 text-lg"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                מכינה את ההכנה האישית שלך...
                                            </>
                                        ) : (
                                            <>
                                                <Brain className="w-5 h-5 mr-2" />
                                                צרי הכנה אישית לראיון
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    )}
                </PremiumContentWrapper>

                {/* Back button when showing form without referralId */}
                {!prepResults && !showSimulation && !referralId && (
                    <div className="text-center mt-8">
                        <Button asChild variant="outline">
                            <Link to={createPageUrl('CareerReferrals')}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                חזרה להפניות הקריירה
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
