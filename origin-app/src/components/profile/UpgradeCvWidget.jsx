
import React, { useState, useRef } from 'react';
import { UploadFile, InvokeLLM } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Wand2, Loader2, Sparkles, FileText, CheckCircle, BrainCircuit, Lightbulb, Briefcase, Search, ExternalLink, Linkedin } from 'lucide-react';

export default function UpgradeCvWidget() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [linkedinUrl, setLinkedinUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setAnalysisResult(null);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file && !linkedinUrl.trim()) {
            setError("אנא העלי קובץ קורות חיים או הזיני קישור לפרופיל לינקדאין (או שניהם).");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let file_url = null;
            if (file) {
                const uploadResult = await UploadFile({ file });
                file_url = uploadResult.file_url;
            }

            const prompt = `
                אתה יועץ קריירה מומחה ומנוסה, המתמחה בסיוע לנשים מעל גיל 50 למצוא את השלב הבא בקריירה שלהן.
                ${file ? 'קיבלת קובץ קורות חיים של משתמשת.' : ''}
                ${linkedinUrl.trim() ? `קיבלת קישור לפרופיל הלינקדאין של המשתמשת: ${linkedinUrl}` : ''}
                המשימה שלך היא לנתח את המידע שקיבלת ביסודיות ולספק ניתוח מעצים, חיובי ופרקטי.

                הפלט שלך חייב להיות בפורמט JSON, בהתאם לסכמה שסופקה.
                הניתוח צריך לכלול:
                1.  **strengths**: זיהוי של 3-4 נקודות חוזקה עיקריות שעולות מהמסמכים. התמקד בניסיון, מיומנויות וכישורים ייחודיים.
                2.  **improvement_suggestions**: מתן 2-3 הצעות קונקרטיות לשיפור קורות החיים כדי להתאים אותם לשוק העבודה הנוכחי (למשל, הוספת סיכום מקצועי, שימוש בפעלים חזקים, התאמה למשרות ספציפיות).
                3.  **job_recommendations**: המלצה על 3-4 תפקידים או כיוונים מקצועיים ספציפיים שמתאימים לפרופיל. עבור כל המלצה, הסבר בקצרה (במשפט אחד) מדוע היא מתאימה.
                ${linkedinUrl.trim() ? `4.  **linkedin_suggestions**: ${file ? 'בהשוואה לקורות החיים, ' : ''}נתח את פרופיל הלינקדאין (דרך הקישור שסופק) וספק 3-4 המלצות קונקרטיות לשיפור הפרופיל בלינקדאין. זה יכול לכלול: שיפור כותרת המקצועית, הוספת מילות מפתח רלוונטיות, שיפור הסיכום (About), הדגשת הישגים בתיאורי התפקידים, הוספת מיומנויות חשובות, וכו'. התמקד בדברים שניתן לעשות מיד לשיפור הנראות והמקצועיות של הפרופיל.` : ''}

                הקפד על טון מעצים, מכבד ותומך.
            `;
            
            const response_json_schema = {
                type: "object",
                properties: {
                    strengths: {
                        type: "array",
                        items: { type: "string" },
                        description: "3-4 נקודות חוזקה עיקריות מהניתוח"
                    },
                    improvement_suggestions: {
                        type: "array",
                        items: { type: "string" },
                        description: "2-3 הצעות קונקרטיות לשיפור קורות החיים"
                    },
                    job_recommendations: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                title: { type: "string", description: "שם התפקיד המומלץ" },
                                reason: { type: "string", description: "הסבר קצר מדוע התפקיד מתאים" }
                            },
                            required: ["title", "reason"]
                        },
                        description: "3-4 המלצות לתפקידים ספציפיים"
                    },
                    ...(linkedinUrl.trim() && {
                        linkedin_suggestions: {
                            type: "array",
                            items: { type: "string" },
                            description: "3-4 המלצות קונקרטיות לשיפור פרופיל הלינקדאין"
                        }
                    })
                },
                required: ["strengths", "improvement_suggestions", "job_recommendations"]
            };

            const llmParams = {
                prompt: prompt,
                response_json_schema: response_json_schema
            };

            if (file_url) {
                llmParams.file_urls = [file_url];
            }

            const result = await InvokeLLM(llmParams);
            
            setAnalysisResult(result);

        } catch (e) {
            console.error("AI analysis failed:", e);
            setError("אוי, נראה שהקסם לא עבד הפעם. נסי שוב מאוחר יותר או עם קובץ/קישור אחר.");
        } finally {
            setIsLoading(false);
        }
    };

    const resetState = () => {
        setFile(null);
        setFileName("");
        setLinkedinUrl("");
        setAnalysisResult(null);
        setError(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const handleDirectJobSearch = (jobTitle) => {
        if (!jobTitle) return;
        const searchQuery = encodeURIComponent(jobTitle.trim());
        const searchUrl = `https://www.google.com/search?q=${searchQuery}+משרה+site:jobmaster.co.il+OR+site:alljobs.co.il+OR+site:drushim.co.il+OR+site:linkedin.com`;
        window.open(searchUrl, '_blank');
    };

    return (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 shadow-xl">
            {!analysisResult ? (
                <CardContent className="p-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BrainCircuit className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            שדרוג קורות חיים ולינקדאין עם ריסטארט
                        </h3>
                        <p className="text-gray-600 text-sm">
                            העלי את קורות החיים שלך ו/או הוסיפי קישור לפרופיל לינקדאין וקבלי ניתוח חכם, המלצות לשיפור והצעות עבודה מותאמות אישית.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="cv-upload" className="sr-only">העלאת קורות חיים</Label>
                            <div 
                                className="relative flex items-center justify-center px-3 py-2 text-sm text-gray-600 bg-white border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-purple-400"
                                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            >
                                <Upload className="w-4 h-4 ml-2 text-gray-500" />
                                {fileName || "בחרי קובץ קורות חיים (PDF בלבד)"}
                            </div>
                            <input
                                id="cv-upload"
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".pdf"
                                className="hidden"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gradient-to-r from-purple-50 to-indigo-50 text-gray-500">ו/או</span>
                            </div>
                        </div>

                        <div dir="rtl">
                            <Label htmlFor="linkedin-url" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Linkedin className="w-4 h-4 text-blue-600" />
                                הפרופיל המנצח שלך: הזני קישור ללינקדאין לקבלת טיפים ממוקדים
                            </Label>
                            <Input
                                id="linkedin-url"
                                type="url"
                                placeholder="https://www.linkedin.com/in/your-profile"
                                value={linkedinUrl}
                                onChange={(e) => setLinkedinUrl(e.target.value)}
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">העתיקי את הקישור המלא לפרופיל הלינקדאין שלך</p>
                        </div>

                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                        <Button
                            onClick={handleAnalyze}
                            disabled={isLoading || (!file && !linkedinUrl.trim())}
                            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full font-semibold"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                                    מנתחת את הפרופיל שלך...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-5 h-5 ml-2" />
                                    נתחי את הפרופיל שלי
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            ) : (
                <CardContent className="p-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">הניתוח שלך מוכן!</h3>
                        {fileName && <p className="text-gray-600 text-sm">{fileName}</p>}
                        {linkedinUrl && <p className="text-gray-600 text-sm flex items-center justify-center gap-1 mt-1"><Linkedin className="w-4 h-4 text-blue-600" /> פרופיל לינקדאין נותח</p>}
                    </div>

                    <div className="space-y-6">
                        {/* Strengths */}
                        <div>
                            <h4 className="font-semibold text-lg flex items-center gap-2 mb-3"><CheckCircle className="w-5 h-5 text-green-500" /> נקודות החוזק שלך:</h4>
                            <ul className="list-disc pr-5 space-y-1 text-gray-700">
                                {analysisResult.strengths.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>

                        {/* Improvements */}
                        <div>
                            <h4 className="font-semibold text-lg flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-yellow-500" /> הצעות לשיפור קורות החיים:</h4>
                            <ul className="list-disc pr-5 space-y-1 text-gray-700">
                                {analysisResult.improvement_suggestions.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>

                        {/* LinkedIn Suggestions */}
                        {analysisResult.linkedin_suggestions && analysisResult.linkedin_suggestions.length > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-lg flex items-center gap-2 mb-3">
                                    <Linkedin className="w-5 h-5 text-blue-600" /> 
                                    💡 טיפים לשיפור הפרופיל בלינקדאין:
                                </h4>
                                <ul className="list-disc pr-5 space-y-2 text-gray-700">
                                    {analysisResult.linkedin_suggestions.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                                <div className="mt-4 pt-4 border-t border-blue-200">
                                    <p className="text-sm text-blue-800 font-medium mb-2">זה הרגע שלך לבלוט! 🌟</p>
                                    <p className="text-xs text-blue-700">הפרופיל שלך בלינקדאין הוא לא רק עוד עמודה - הוא הסיפור שלך בעולם העבודה החדש.</p>
                                </div>
                            </div>
                        )}

                        {/* Job Recommendations */}
                        <div>
                            <h4 className="font-semibold text-lg flex items-center gap-2 mb-3"><Briefcase className="w-5 h-5 text-indigo-500" /> המלצות לתפקידים:</h4>
                            <div className="space-y-3">
                                {analysisResult.job_recommendations.map((job, i) => (
                                    <div key={i} className="bg-white/70 p-3 rounded-lg border">
                                        <div className="flex justify-between items-center gap-2">
                                            <p className="font-semibold text-indigo-800">{job.title}</p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDirectJobSearch(job.title)}
                                                className="border-indigo-200 text-indigo-600 hover:bg-indigo-100 shrink-0"
                                            >
                                                <Search className="w-4 h-4 ml-1" />
                                                חיפוש
                                            </Button>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{job.reason}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button onClick={resetState} variant="outline" className="w-full">
                            ניתוח קובץ או פרופיל חדש
                        </Button>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
