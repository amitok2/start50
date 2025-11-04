
import React, { useState } from 'react';
import { GenerateImage, InvokeLLM } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Wand2, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AiImageGenerator({ onImageGenerated, onCancel }) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("אנא הכניסי תיאור ליצירת התמונה.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const llmPrompt = `You are an expert prompt engineer for an AI image generator. Your task is to create a beautiful illustration (not photorealistic) of a woman based on the user's description. The illustration should be in a warm, elegant style using soft colors that match the website's palette: rose pink, soft purple, warm orange, and gentle gradients. The style should be: digital illustration, artistic, flattering, warm and welcoming. User description in Hebrew: "${prompt}". Create an English prompt for: "Beautiful digital illustration of a graceful woman, [incorporate user details like hair color, eye color, etc. from the Hebrew description], warm smile, artistic style with soft rose pink and purple color palette, elegant and flattering portrait, digital art, high quality illustration."`;
      
      const refinedPrompt = await InvokeLLM({
        prompt: llmPrompt,
      });

      const result = await GenerateImage({ prompt: refinedPrompt });
      if (result && result.url) {
        setGeneratedImageUrl(result.url);
      } else {
        throw new Error("לא התקבלה תמונה מהשרת.");
      }
    } catch (e) {
      console.error("AI image generation failed:", e);
      setError("אוי, יצירת התמונה לא הצליחה. נסי שוב עם תיאור אחר או בדקי מאוחר יותר.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptImage = () => {
    if (generatedImageUrl) {
      onImageGenerated(generatedImageUrl);
    }
  };
  
  const retry = () => {
    setGeneratedImageUrl(null);
    setError(null);
  }

  return (
    <Card className="bg-purple-50 border-purple-200 p-4 mt-4">
      <CardContent className="p-0">
        <div className="space-y-4">
          {!generatedImageUrl && !isLoading && (
            <>
              <Label htmlFor="ai-prompt" className="font-semibold text-gray-800">ספרי ל-AI איזו תמונה ליצור עבורך</Label>
              <Textarea
                id="ai-prompt"
                placeholder="היי מפורטת ככל האפשר: צבע שיער, אורך, צבע עיניים, הבעת פנים, רקע, סגנון לבוש וכו'."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                disabled={isLoading}
              />
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-100 p-2 rounded-md">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {isLoading && (
             <div className="flex flex-col items-center justify-center text-center p-4">
                <Loader2 className="w-8 h-8 ml-2 animate-spin text-purple-600" />
                <p className="mt-2 font-semibold text-purple-700">יוצרת קסם...</p>
                <p className="text-sm text-gray-600">זה עשוי לקחת כ-10-15 שניות.</p>
             </div>
          )}

          {generatedImageUrl && !isLoading && (
            <div className="space-y-3 text-center">
              <p className="font-semibold">התוצאה:</p>
              <img src={generatedImageUrl} alt="תמונה שנוצרה עם AI" className="rounded-lg w-48 h-48 mx-auto object-cover border-2 border-purple-300 shadow-md" />
              <div className="flex justify-center gap-2 flex-wrap">
                <Button type="button" onClick={handleAcceptImage} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="ml-2 h-4 w-4" />
                  מעולה! נשתמש בזו
                </Button>
                <Button type="button" variant="outline" onClick={retry}>
                  <RefreshCw className="ml-2 h-4 w-4" />
                  יצירת תמונה חדשה
                </Button>
              </div>
            </div>
          )}
          
          {!generatedImageUrl && !isLoading && (
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                ביטול
              </Button>
              <Button type="button" onClick={handleGenerate} disabled={isLoading || !prompt.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    יוצרת...
                  </>
                ) : (
                  <>
                    <Wand2 className="ml-2 h-4 w-4" />
                    צרי לי תמונה
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
