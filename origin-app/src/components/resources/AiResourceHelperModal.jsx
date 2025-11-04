
import React, { useState, useEffect, useCallback } from 'react';
import { InvokeLLM } from '@/api/integrations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Lightbulb, CheckCircle, ArrowRight, Sparkles, AlertTriangle, ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AiResourceHelperModal({ resource, onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState(null);
  const [error, setError] = useState(null);

  const generateAiHelp = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAiResponse(null);

    const prompt = `
      את "המנטורית החכמה של ReStart 50+", מדריכה תומכת ומעצימה ליזמיות חדשות.
      המשתמשת מתעניינת במשאב בשם "${resource.title}" מקטגוריית "${resource.category}".
      התיאור של המשאב הוא: "${resource.description}".

      משימתך היא לספק לה תובנות מועילות ומעשיות על הנושא, בפורמט JSON קבוע ובעברית.
      תמיד דברי אליה כאישה לאישה, בטון חם ותומך.
      
      חשוב מאוד: הקפידי על דיוק ובהירות בכל משפט. אל תכתבי משפטים עם משמעות הפוכה או סותרת.
      כל נקודה צריכה להיות חיובית, בונה ומעשית, בלי ביטויים מבלבלים או לא ברורים.

      הפלט חייב להכיל את המבנה הבא:
      - "introduction": משפט פתיחה חם ומעודד מאישה לאישה.
      - "key_takeaways": מערך של 3 נקודות מפתח חשובות על הנושא. כל נקודה חייבת להיות ברורה, מדויקת ולא סותרת את עצמה.
      - "actionable_tip": טיפ אחד, קצר ופרקטי שהיא יכולה ליישם מיד.
      - "next_step_suggestion": הצעה להמשך, המכווינה אותה לאזור רלוונטי אחר בפלטפורמה (כמו ייעוץ מנטורינג, קורסים וכו').
      
      דוגמה לנקודה נכונה: "הקפידי לנהל את התקציב בקפידה - תכנני הוצאות מראש ושמרי מרווח ביטחון."
      דוגמה לנקודה לא נכונה: "אל תשקלי על משמעות התקציב - תנהלי את הכסף בחוכמה." (זה סותר את עצמו)
    `;

    const responseSchema = {
      type: "object",
      properties: {
        introduction: { type: "string" },
        key_takeaways: { type: "array", items: { type: "string" } },
        actionable_tip: { type: "string" },
        next_step_suggestion: { type: "string" }
      },
      required: ["introduction", "key_takeaways", "actionable_tip", "next_step_suggestion"]
    };

    try {
      const result = await InvokeLLM({ prompt, response_json_schema: responseSchema });
      setAiResponse(result);
    } catch (e) {
      console.error("AI helper failed:", e);
      setError("אופס, הבינה המלאכותית שלנו נתקלה בבעיה. נסי שוב מאוחר יותר.");
    } finally {
      setIsLoading(false);
    }
  }, [resource.title, resource.category, resource.description]);

  useEffect(() => {
    if (resource) {
      generateAiHelp();
    }
  }, [resource, generateAiHelp]);

  const handleOpenOriginalResource = () => {
    if (resource && resource.url) {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 text-center">{resource.title}</DialogTitle>
          <DialogDescription className="text-center pt-2">{resource.description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
              <p className="text-lg text-gray-700">המנטורית החכמה שלנו חושבת...</p>
              <p className="text-sm text-gray-500">מכינה עבורך תובנות וטיפים מעשיים</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                <AlertTriangle className="w-12 h-12 text-red-500" />
                <p className="text-lg text-red-700 font-semibold">אירעה שגיאה</p>
                <p className="text-sm text-gray-600">{error}</p>
                <Button variant="outline" onClick={generateAiHelp}>נסי שוב</Button>
            </div>
          )}
          {aiResponse && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-xl border border-rose-200 shadow-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-lg text-gray-800 leading-relaxed">{aiResponse.introduction}</p>
                </div>
              </div>

              <Card className="border-green-200 bg-green-50/30">
                <CardContent className="p-6">
                    <h3 style={{direction: 'rtl'}} className="font-semibold text-lg flex items-center gap-2 mb-4 text-green-800">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      תובנות מרכזיות שכדאי לקחת:
                    </h3>
                    <ul className="space-y-3 text-gray-700">
                        {aiResponse.key_takeaways.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-green-100">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-green-600 font-bold text-sm">{i + 1}</span>
                            </div>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                    </ul>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-6">
                    <h3 style={{direction: 'rtl'}} className="font-semibold text-lg flex items-center gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      טיפ מעשי ליישום מיידי:
                    </h3>
                    <div className="bg-white/70 p-4 rounded-lg border border-yellow-200">
                      <p className="text-gray-700 leading-relaxed">{aiResponse.actionable_tip}</p>
                    </div>
                </CardContent>
              </Card>

              <Card className="bg-indigo-50 border-indigo-200">
                <CardContent className="p-6">
                    <h3 style={{direction: 'rtl'}} className="font-semibold text-lg flex items-center gap-2 mb-3">
                      <ArrowRight className="w-5 h-5 text-indigo-600" />
                      הצעד הבא שלך:
                    </h3>
                    <div className="bg-white/70 p-4 rounded-lg border border-indigo-200">
                      <p className="text-gray-700 leading-relaxed">{aiResponse.next_step_suggestion}</p>
                    </div>
                </CardContent>
              </Card>

              <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                {resource.url && ( // Conditionally render if resource.url exists
                  <Button 
                    variant="secondary" 
                    onClick={handleOpenOriginalResource}
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-full py-3 px-6 w-full sm:w-auto"
                  >
                    <ExternalLink className="w-4 h-4 ml-2" />
                    {`פתיחת: ${resource.title}`}
                  </Button>
                )}
                <Button asChild variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 rounded-full py-3 px-6 w-full sm:w-auto">
                    <Link to={createPageUrl('MyProfile')}>
                        <ArrowLeft className="w-4 h-4 ml-2" />
                        חזרה לאזור האישי
                    </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
