
import React, { useState } from 'react';
import { User } from '@/api/entities';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Brain, Upload, Linkedin, FileText, Sparkles, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import JobSearchWidget from '../components/shared/JobSearchWidget';

export default function CvLinkedInEnhancer() {
    const [currentUser, setCurrentUser] = useState(null);
    const [cvFile, setCvFile] = useState(null);
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    React.useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const user = await User.me();
            setCurrentUser(user);
            if (user.cv_url) {
                // User already has CV uploaded
            }
        } catch (error) {
            console.error('Failed to load user:', error);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'application/pdf') {
                setCvFile(file);
                setError(null);
            } else {
                setError('אנא העלי קובץ PDF בלבד');
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type === 'application/pdf') {
                setCvFile(file);
                setError(null);
            } else {
                setError('אנא העלי קובץ PDF בלבד');
            }
        }
    };

    const handleAnalyze = async () => {
        if (!cvFile && !linkedinUrl.trim()) {
            setError('אנא העלי קובץ קורות חיים או הזיני קישור ל-LinkedIn');
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        
        try {
            let cvText = '';
            let linkedinData = '';

            // Upload and extract CV if provided
            if (cvFile) {
                const uploadResponse = await base44.integrations.Core.UploadFile({ file: cvFile });
                const cvUrl = uploadResponse.file_url;
                
                // Extract text from CV
                const extractResponse = await base44.integrations.Core.ExtractDataFromUploadedFile({
                    file_url: cvUrl,
                    json_schema: {
                        type: "object",
                        properties: {
                            full_text: { type: "string", description: "כל הטקסט מקורות החיים" },
                            name: { type: "string" },
                            email: { type: "string" },
                            phone: { type: "string" },
                            experience: { type: "array", items: { type: "string" } },
                            education: { type: "array", items: { type: "string" } },
                            skills: { type: "array", items: { type: "string" } }
                        }
                    }
                });
                
                if (extractResponse.status === 'success') {
                    cvText = JSON.stringify(extractResponse.output);
                }
            }

            // Analyze with AI
            const prompt = `
אתה יועצ/ת קריירה מומחה המתמחה בנשים בגיל 50+ בקהילת ReStart 50+.
המשימה שלך היא לנתח ולספק פידבק מעשי ומעצים על קורות חיים ופרופיל LinkedIn.

${cvFile ? `קורות החיים שהתקבלו:\n${cvText}\n\n` : ''}
${linkedinUrl ? `פרופיל LinkedIn: ${linkedinUrl}\n\n` : ''}

אנא ספקי:
1. הערכה כללית של המצב הנוכחי (טקסט חופשי)
2. נקודות חוזק (רשימת מחרוזות)
3. תחומים לשיפור (רשימת מחרוזות)
4. המלצות קונקרטיות לפעולה - צעדים ברורים ומעשיים (רשימת מחרוזות)
5. טיפים לשיפור נוכחות דיגיטלית ו-LinkedIn (רשימת מחרוזות)
6. משרות או תחומים מומלצים בהתאם לניסיון והכישורים (רשימת מחרוזות)

התייחסי לנקודת המבט של אישה בגיל 50+ עם ניסיון עשיר וייחודי.
כתבי הכל בעברית בטון תומך, אופטימי ומעצים.
`;

            const aiResponse = await base44.integrations.Core.InvokeLLM({
                prompt,
                add_context_from_internet: !!linkedinUrl,
                response_json_schema: {
                    type: "object",
                    properties: {
                        overall_assessment: { type: "string" },
                        strengths: { type: "array", items: { type: "string" } },
                        areas_for_improvement: { type: "array", items: { type: "string" } },
                        action_items: { type: "array", items: { type: "string" } },
                        digital_presence_tips: { type: "array", items: { type: "string" } },
                        recommended_roles: { type: "array", items: { type: "string" } }
                    },
                    required: ["overall_assessment", "strengths", "areas_for_improvement", "action_items"]
                }
            });

            setAnalysis(aiResponse);
            
        } catch (error) {
            console.error('Analysis failed:', error);
            setError('אירעה שגיאה בניתוח. אנא נסי שוב.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-8 sm:py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link to={createPageUrl("MyProfile")} className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600 mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        חזרה לפרופיל
                    </Link>
                    
                    <Card className="bg-gradient-to-r from-purple-100 to-indigo-100 border-0 shadow-xl">
                        <CardContent className="p-8 text-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Brain className="w-10 h-10 text-purple-600" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                                שדרוג קורות חיים ולינקדאין עם ריסטארט
                            </h1>
                            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed mb-3">
                                העלי את קורות החיים שלך ו/או הוסיפי קישור לפרופיל לינקדאין וקבלי ניתוח חכם, המלצות לשיפור והצעות עבודה מותאמות אישית.
                            </p>
                            <p className="text-base text-purple-700 font-semibold max-w-2xl mx-auto">
                                💼 בסיום האבחון תגיעי ישירות לחיפוש משרות המתאימות לך!
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {!analysis ? (
                    <div className="space-y-6">
                        {/* CV Upload Section */}
                        <Card className="shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <FileText className="w-6 h-6 text-rose-500" />
                                    העלאת קורות חיים (PDF בלבד) ⬆️
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                                        dragActive 
                                            ? 'border-purple-500 bg-purple-50' 
                                            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
                                    }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    {cvFile ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <CheckCircle className="w-12 h-12 text-green-500" />
                                            <p className="text-lg font-semibold text-gray-900">{cvFile.name}</p>
                                            <Button
                                                variant="outline"
                                                onClick={() => setCvFile(null)}
                                                size="sm"
                                            >
                                                הסרה
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 mb-4">
                                                גררי קובץ לכאן או לחצי לבחירת קובץ
                                            </p>
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="cv-upload"
                                            />
                                            <Label htmlFor="cv-upload">
                                                <Button asChild variant="outline">
                                                    <span>בחרי קובץ קורות חיים</span>
                                                </Button>
                                            </Label>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Divider */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="text-gray-500 font-medium">ו/או</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        {/* LinkedIn Section */}
                        <Card className="shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Linkedin className="w-6 h-6 text-blue-600" />
                                    הפרופיל המנצח שלך: הזיני קישור ללינקדאין לקבלת טיפים ממוקדים
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Input
                                    type="url"
                                    placeholder="https://www.linkedin.com/in/your-profile"
                                    value={linkedinUrl}
                                    onChange={(e) => setLinkedinUrl(e.target.value)}
                                    className="text-lg text-center"
                                    dir="ltr"
                                />
                                <p className="text-sm text-gray-600 text-center">
                                    העתיקי את הקישור המלא לפרופיל הלינקדאין שלך
                                </p>
                            </CardContent>
                        </Card>

                        {/* Error Message */}
                        {error && (
                            <Card className="bg-red-50 border-red-200">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                    <p className="text-red-800">{error}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Analyze Button */}
                        <Button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || (!cvFile && !linkedinUrl.trim())}
                            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xl py-6 rounded-full shadow-xl"
                            size="lg"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-6 h-6 ml-3 animate-spin" />
                                    מנתחת את הפרופיל שלך...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-6 h-6 ml-3" />
                                    נתחי את הפרופיל שלי
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    /* Analysis Results */
                    <div className="space-y-6" dir="rtl">
                        {/* Success Message */}
                        <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-200 shadow-xl">
                            <CardContent className="p-6 text-center">
                                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                                <h3 className="text-2xl font-bold text-green-800 mb-2">
                                    הניתוח הושלם בהצלחה! 🎉
                                </h3>
                                <p className="text-green-700">
                                    קיבלת ניתוח מקיף והמלצות מותאמות אישית
                                </p>
                            </CardContent>
                        </Card>

                        {/* Overall Assessment */}
                        <Card className="shadow-xl border-0 bg-white">
                            <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100">
                                <CardTitle className="flex items-center gap-2 text-purple-900 text-right">
                                    <Brain className="w-6 h-6" />
                                    הערכה כללית
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6" dir="rtl">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-right">
                                    {analysis.overall_assessment}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Strengths */}
                        {analysis.strengths && analysis.strengths.length > 0 && (
                            <Card className="shadow-xl border-0 bg-white">
                                <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
                                    <CardTitle className="flex items-center gap-2 text-green-900 text-right">
                                        <CheckCircle className="w-6 h-6" />
                                        נקודות חוזק
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6" dir="rtl">
                                    <ul className="space-y-3">
                                        {analysis.strengths.map((strength, index) => (
                                            <li key={index} className="flex items-start gap-3 text-right">
                                                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                                                    ✓
                                                </span>
                                                <span className="text-gray-800 flex-1 text-right">{strength}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Areas for Improvement */}
                        {analysis.areas_for_improvement && analysis.areas_for_improvement.length > 0 && (
                            <Card className="shadow-xl border-0 bg-white">
                                <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
                                    <CardTitle className="flex items-center gap-2 text-orange-900 text-right">
                                        <Sparkles className="w-6 h-6" />
                                        תחומים לשיפור
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6" dir="rtl">
                                    <ul className="space-y-3">
                                        {analysis.areas_for_improvement.map((area, index) => (
                                            <li key={index} className="flex items-start gap-3 text-right">
                                                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                                                    ⚡
                                                </span>
                                                <span className="text-gray-800 flex-1 text-right">{area}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Action Items */}
                        {analysis.action_items && analysis.action_items.length > 0 && (
                            <Card className="shadow-xl border-0 bg-white">
                                <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100">
                                    <CardTitle className="flex items-center gap-2 text-blue-900 text-right">
                                        <FileText className="w-6 h-6" />
                                        המלצות קונקרטיות לפעולה
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6" dir="rtl">
                                    <ol className="space-y-3">
                                        {analysis.action_items.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3 text-right">
                                                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                                                    {index + 1}
                                                </span>
                                                <span className="text-gray-800 flex-1 text-right">{item}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </CardContent>
                            </Card>
                        )}

                        {/* Digital Presence Tips */}
                        {analysis.digital_presence_tips && analysis.digital_presence_tips.length > 0 && (
                            <Card className="shadow-xl border-0 bg-white">
                                <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100">
                                    <CardTitle className="flex items-center gap-2 text-indigo-900 text-right">
                                        <Linkedin className="w-6 h-6" />
                                        טיפים לשיפור נוכחות דיגיטלית ו-LinkedIn
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6" dir="rtl">
                                    <ul className="space-y-3">
                                        {analysis.digital_presence_tips.map((tip, index) => (
                                            <li key={index} className="flex items-start gap-3 text-right">
                                                <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                                                    💡
                                                </span>
                                                <span className="text-gray-800 flex-1 text-right">{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Recommended Roles */}
                        {analysis.recommended_roles && analysis.recommended_roles.length > 0 && (
                            <Card className="shadow-xl border-0 bg-white">
                                <CardHeader className="bg-gradient-to-r from-rose-100 to-pink-100">
                                    <CardTitle className="flex items-center gap-2 text-rose-900 text-right">
                                        <Sparkles className="w-6 h-6" />
                                        משרות או תחומים מומלצים
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6" dir="rtl">
                                    <ul className="space-y-3">
                                        {analysis.recommended_roles.map((role, index) => (
                                            <li key={index} className="flex items-start gap-3 text-right">
                                                <span className="flex-shrink-0 w-6 h-6 bg-rose-100 text-rose-800 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                                                    💼
                                                </span>
                                                <span className="text-gray-800 flex-1 text-right">{role}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Job Search Widget */}
                        <div className="mt-12">
                            <JobSearchWidget />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button 
                                onClick={() => {
                                    setAnalysis(null);
                                    setCvFile(null);
                                    setLinkedinUrl('');
                                }}
                                variant="outline"
                                className="text-gray-600 hover:text-gray-800"
                            >
                                ניתוח נוסף
                            </Button>
                            <Button asChild className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white">
                                <Link to={createPageUrl('CareerReferrals')}>
                                    התחילי לעקוב אחרי הפניות שלך
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
