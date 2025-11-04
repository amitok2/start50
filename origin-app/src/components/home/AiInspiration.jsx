import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvokeLLM } from '@/api/integrations';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Wand2, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiInspiration() {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setAiResponse(null);
    setError(null);

    const prompt = `
      אתה יועץ חכם ואמפתי בקהילת "ReStart 50+" לנשים מעל גיל 50. 
      משתמשת חדשה כתבה מה היא מחפשת. תפקידך הוא לנתח את הטקסט שלה, להבין את הצורך המרכזי, ולכוון אותה למקום הכי נכון בפלטפורמה.

      האפשרויות בפלטפורמה הן:
      - 'SocialTinder': להכיר חברות חדשות וליצור קשרים חברתיים. השתמש באפשרות זו כאשר היא מחפשת חברה, חברויות, חברה לקפה, קשרים חברתיים, אנשים להכיר וכד'.
      - 'CoursesAndEvents': ללמוד משהו חדש, קורסים והכשרות מקצועיות. השתמש באפשרות זו כאשר היא מחפשת להתפתח מקצועית, ללמוד נושא חדש, להשתתף בסדנאות וכד'.
      - 'Mentoring': ליווי אישי ומנטורינג למטרות אישיות או עסקיות. השתמש באפשרות זו כאשר היא מחפשת ליווי, הדרכה, ייעוץ מקצועי או מנטורית.
      - 'ResourceLibrary': כלים ומידע על פתיחת עסק ויזמות. השתמש באפשרות זו כאשר היא מחפשת משאבים, מדריכים, תבניות לעסק.
      - 'Community': פורומים לדיונים, שיתוף ושאלות עם כלל חברות הקהילה.
      - 'Career': סיוע בקריירה, חיפוש משרה חדשה, קורות חיים, הכנה לראיונות. **השתמש באפשרות זו כאשר היא מחפשת עבודה חדשה, משרה, קריירה, שינוי תעסוקתי, עדכון קורות חיים, הכנה לראיון עבודה וכד'.**
      - 'EntrepreneurshipHub': מרכז היזמות - תכנון עסק, בניית תוכנית עסקית, תקציב ושלבי פיתוח. **השתמש באפשרות זו כאשר היא מחפשת לפתוח עסק משלה, להיות עצמאית, לבנות תוכנית עסקית, לתכנן יזמות וכד'.**

      הטקסט של המשתמשת: "${userInput}"

      הפלט שלך חייב להיות JSON עם שני שדות:
      1. "responseText": טקסט חם ומעודד בעברית שמסביר לה לאן אתה מפנה אותה ולמה, על סמך מה שהיא כתבה.
      2. "suggestedPage": שם הדף המומלץ ביותר מבין האפשרויות שצוינו למעלה (למשל: 'SocialTinder', 'Career', 'EntrepreneurshipHub').
    `;

    const responseSchema = {
      type: "object",
      properties: {
        responseText: { type: "string" },
        suggestedPage: { 
          type: "string", 
          enum: ["SocialTinder", "CoursesAndEvents", "Mentoring", "ResourceLibrary", "Community", "Career", "EntrepreneurshipHub"] 
        }
      },
      required: ["responseText", "suggestedPage"]
    };

    try {
      const result = await InvokeLLM({ prompt, response_json_schema: responseSchema });
      setAiResponse(result);
    } catch (e) {
      console.error("AI search failed:", e);
      setError("אופס, נראה שיש לנו תקלה קטנה. נסו לנסח את הבקשה קצת אחרת או חזרו מאוחר יותר.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUserInput('');
    setAiResponse(null);
    setError(null);
    setIsLoading(false);
  };

  const handleNavigation = () => {
    if (aiResponse?.suggestedPage) {
      // Map AI response to actual page URLs
      const pageMapping = {
        'SocialTinder': 'SocialTinder',
        'CoursesAndEvents': 'CoursesAndEvents',
        'Mentoring': 'Mentoring',
        'ResourceLibrary': 'ResourceLibrary',
        'Community': 'Community',
        'Career': 'MyProfile?tab=career',
        'EntrepreneurshipHub': 'MyProfile?tab=entrepreneurship_hub'
      };
      
      const targetPage = pageMapping[aiResponse.suggestedPage] || aiResponse.suggestedPage;
      navigate(createPageUrl(targetPage));
    }
  };

  return (
    <section className="py-16 md:py-24 bg-rose-50/50">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-2xl border-0 overflow-hidden bg-gradient-to-br from-white to-pink-50">
          <AnimatePresence mode="wait">
            {!aiResponse ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CardContent className="p-8 md:p-12 text-center">
                  <div style={{direction: 'rtl'}} className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full border border-rose-200 mb-6">
                    <Wand2 className="w-5 h-5" />
                    <span className="font-semibold">המדריך האישי שלך</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    איך נוכל לעזור לך היום?
                  </h2>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    כתבי בחופשיות מה את מחפשת, חולמת או צריכה, והמערכת החכמה שלנו תמצא את המקום הנכון עבורך בפלטפורמה.
                  </p>
                  <div className="relative">
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="לדוגמה: 'אני רוצה להכיר חברות חדשות לקפה ושיחה', 'מחפשת משרה חדשה', 'חולמת לפתוח עסק מהבית'..."
                      className="w-full h-28 bg-white border-gray-300 text-lg rounded-xl p-4 resize-none"
                      dir="rtl"
                    />
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !userInput.trim()}
                    size="lg"
                    className="mt-6 bg-rose-500 hover:bg-rose-600 text-white px-10 py-3 text-lg font-semibold rounded-full shadow-lg"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                    ) : (
                      <Wand2 className="w-5 h-5 ml-2" />
                    )}
                    מצא/י לי את הדרך
                  </Button>
                  {error && <p className="text-red-500 mt-4">{error}</p>}
                </CardContent>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CardContent className="p-8 md:p-12 text-center">
                  <div className="text-4xl mb-4">✨</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    מצאנו כיוון עבורך!
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed mb-8 bg-rose-50 p-4 rounded-lg border border-rose-200">
                    "{aiResponse.responseText}"
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button onClick={handleReset} variant="outline" size="lg">
                      <RefreshCw className="w-4 h-4 ml-2" />
                      חיפוש חדש
                    </Button>
                    <Button onClick={handleNavigation} size="lg" className="bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg">
                      קחי אותי לשם
                      <ArrowLeft className="w-5 h-5 mr-2" />
                    </Button>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </section>
  );
}