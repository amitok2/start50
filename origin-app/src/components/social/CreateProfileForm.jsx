import React, { useState, useRef } from 'react';
import { SocialProfile } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImagePlus, Loader2, AlertTriangle, Wand2 } from 'lucide-react';
import { createPageUrl } from '@/utils';
import PillSelector from './PillSelector';
import AiImageGenerator from '../shared/AiImageGenerator';
import { INTERESTS_OPTIONS, LOOKING_FOR_OPTIONS, CITIES_OPTIONS } from './constants';

export default function CreateProfileForm({ user, onSuccess, onCancel }) {
  // All hooks must be called before any early returns
  const [formData, setFormData] = useState({
    nickname: user?.full_name || '',
    email: user?.email || '',
    age: '',
    location: '',
    about_me: '',
    interests: [],
    looking_for: [],
    status_quote: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const imageInputRef = useRef(null);
  const [imageMode, setImageMode] = useState(null);

  // Now we can do early return after all hooks are defined
  if (!user) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-4">
          <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
          <p className="font-semibold">שגיאה: לא ניתן ליצור פרופיל ללא התחברות</p>
        </div>
        <Button onClick={onCancel} variant="outline">
          סגור
        </Button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError(null);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageMode('upload_preview');
    }
  };
  
  const handleAiImageGenerated = (url) => {
    console.log('AI Image generated URL:', url);
    setImagePreview(url);
    setImageFile(null);
    setImageMode('ai_preview');
  };

  const handleSelectionChange = (field) => (selection) => {
    setFormData(prev => ({ ...prev, [field]: selection }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Creating profile with data:', formData);
      console.log('Submit - imageMode:', imageMode);
      console.log('Submit - imagePreview:', imagePreview);
      
      let imageUrl = '';
      if (imageFile && imageMode === 'upload_preview') {
        console.log('Uploading image...');
        const uploadResult = await UploadFile({ file: imageFile });
        imageUrl = uploadResult.file_url;
        console.log('Image uploaded successfully:', imageUrl);
      } else if (imageMode === 'ai_preview' && imagePreview) {
         console.log('Using AI-generated image URL...');
         imageUrl = imagePreview;
         console.log('AI image URL set:', imageUrl);
      }

      const profileData = { 
        ...formData, 
        age: formData.age ? parseInt(formData.age) : undefined,
        profile_image_url: imageUrl 
      };
      
      console.log('Final profile data to save:', profileData);
      
      const result = await SocialProfile.create(profileData);
      console.log('Profile created successfully:', result);
      
      // Send welcome email
      try {
        const { SendEmail } = await import('@/api/integrations');
        await SendEmail({
          to: user.email,
          subject: 'ברוכה הבאה לקהילת ReStart 50+! 🌸',
          body: `
            <div dir="rtl" style="font-family: Arial, sans-serif; text-align: right; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #f43f5e, #ec4899); padding: 20px; border-radius: 15px 15px 0 0; text-align: center;">
                <h1 style="color: white; font-size: 28px; margin: 0;">🌸 ברוכה הבאה ל-ReStart 50+ 🌸</h1>
              </div>
              
              <div style="background: #fdf2f8; padding: 30px; border-radius: 0 0 15px 15px;">
                <h2 style="color: #be185d; font-size: 22px;">שלום ${formData.nickname}! 👋</h2>
                
                <p style="font-size: 18px; color: #374151; margin: 20px 0;">
                  הפרופיל החברתי שלך נוצר בהצלחה ב-ReStart 50+! 
                </p>
                
                <p style="color: #374151; font-size: 16px; margin: 20px 0;">
                  עכשיו את יכולה להתחיל להכיר חברות חדשות ולהתחבר לקהילה המדהימה שלנו.
                </p>

                <div style="background: white; padding: 25px; border-radius: 10px; margin: 25px 0; border-right: 4px solid #ec4899;">
                  <h3 style="color: #be185d; font-size: 18px; margin-bottom: 15px;">וזה רק קצה המזלג! ב-ReStart 50+ מחכים לך גם:</h3>
                  
                  <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                      <strong style="color: #be185d;">📚 קורסים וסדנאות מעשירים:</strong> ללמוד דברים חדשים שיאיצו את הקריירה או התחביבים שלך.
                    </li>
                    <li style="margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                      <strong style="color: #be185d;">✨ מאמרים ותובנות:</strong> ממומחיות מובילות בתחומי קריירה, יזמות והתפתחות אישית.
                    </li>
                    <li style="margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                      <strong style="color: #be185d;">🎯 כלים להגשמת חלומות:</strong> אבחונים אישיים, שדרוג קורות חיים ומשאבים להקמת עסק.
                    </li>
                    <li style="margin: 12px 0; padding: 8px 0;">
                      <strong style="color: #be185d;">💬 פורומים וקבוצות תמיכה:</strong> לשיתוף חוויות וקבלת ייעוץ מנשים שמבינות באמת.
                    </li>
                  </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${window.location.origin}${createPageUrl('SocialTinder')}" 
                     style="background: linear-gradient(135deg, #ec4899, #be185d); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);">
                    🤝 בואי נכיר חברות חדשות!
                  </a>
                </div>

                <div style="background: linear-gradient(135deg, #fef3c7, #fed7aa); padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center;">
                  <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">💡 טיפ ראשון שלך:</h4>
                  <p style="color: #92400e; margin: 0; font-size: 14px;">
                    מומלץ להתחיל בעיון במאמרים ובקהילה, ואז לעבור ליצירת קשרים חברתיים. כך תכירי טוב יותר את האווירה והנשים שכאן!
                  </p>
                </div>

                <p style="color: #374151; font-size: 16px; margin: 25px 0 10px 0;">
                  בהצלחה והכרויות נעימות! 💕
                </p>
                
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  בחיבה,<br/>
                  <strong>צוות ReStart 50+</strong>
                </p>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
                    יש לך שאלות? כתבי לנו ב-
                    <a href="mailto:restart@rse50.co.il" style="color: #ec4899;">restart@rse50.co.il</a>
                  </p>
                  <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
                    או בקרי באתר: 
                    <a href="${window.location.origin}" style="color: #ec4899;">ReStart50.co.il</a>
                  </p>
                </div>
              </div>
            </div>
          `
        });
        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
      
      alert('הפרופיל שלך נוצר בהצלחה! כעת תוכלי להכיר חברות חדשות.');
      onSuccess(result);
      
    } catch (error) {
      console.error("Error creating profile:", error);
      setError(`אירעה שגיאה ביצירת הפרופיל: ${error.message}`);
      
      if (error.message.includes('permission') || error.message.includes('unauthorized')) {
        setError('אין לך הרשאה ליצור פרופיל. אנא וודאי שאת מחוברת ובעלת מנוי פעיל.');
      } else if (error.message.includes('validation') || error.message.includes('required')) {
        setError('יש למלא את כל השדות הנדרשים. אנא בדקי שמילאת את כל הפרטים.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">בואי ניצור לך פרופיל זוהר ✨</h2>
        <p className="text-gray-600 mt-2">ספרי קצת על עצמך כדי שהחברות החדשות שלך יוכלו להכיר אותך</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-red-800 text-sm">{error}</div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <Label htmlFor="nickname">כינוי (איך תרצי שיקראו לך?) *</Label>
            <Input id="nickname" value={formData.nickname} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="age">גיל *</Label>
            <Input id="age" type="number" placeholder="הגיל הוא רק מספר" value={formData.age} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2 md:col-span-2">
            <Label htmlFor="location">עיר מגורים *</Label>
            <select 
              id="location" 
              value={formData.location} 
              onChange={handleInputChange} 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="">בחרי עיר...</option>
              {CITIES_OPTIONS.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
        </div>
        <div className="space-y-2 md:col-span-2">
            <Label>מייל ליצירת קשר</Label>
            <Input id="email" type="email" value={formData.email} disabled />
            <p className="text-xs text-gray-500">המייל נלקח אוטומטית מהחשבון שלך</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>תמונת פרופיל</Label>
        <div className="w-full min-h-32 p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-gray-50 text-center">
            {imagePreview && (
                <div className="mb-4">
                    <img src={imagePreview} alt="תצוגה מקדימה" className="h-24 w-24 object-cover rounded-full shadow-md mx-auto" />
                    <p className="text-xs text-gray-500 mt-2">תצוגה מקדימה</p>
                </div>
            )}

            {imageMode !== 'ai' ? (
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="button" variant="outline" onClick={() => { imageInputRef.current.click(); setImageMode('upload'); }}>
                        <ImagePlus className="ml-2 h-4 w-4" />
                        העלאת תמונה מהמחשב
                    </Button>
                    <Button type="button" onClick={() => setImageMode('ai')}>
                        <Wand2 className="ml-2 h-4 w-4" />
                        יצירת תמונה עם AI
                    </Button>
                </div>
            ) : (
                 <p className="text-purple-700 font-semibold">מצב יצירת תמונה עם AI פעיל 👇</p>
            )}
        </div>

        <input type="file" ref={imageInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

        {imageMode === 'ai' && (
            <AiImageGenerator
                onImageGenerated={handleAiImageGenerated}
                onCancel={() => {setImageMode(null); setImagePreview(null); setImageFile(null);}}
            />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="about_me">קצת עליי (מה היית רוצה שחברות ידעו עלייך?) *</Label>
        <Textarea id="about_me" placeholder="מה את אוהבת לעשות? מה חשוב לך?" value={formData.about_me} onChange={handleInputChange} rows={4} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status_quote">משפט השראה או סטטוס אישי (אופציונלי)</Label>
        <Input id="status_quote" placeholder="למשל: 'החיים מתחילים איפה שהפחד נגמר'" value={formData.status_quote} onChange={handleInputChange} />
      </div>

      <div className="border-t pt-6 space-y-6">
        <PillSelector
          title="תחומי עניין (מה מעניין אותך?)"
          description="בחרי כמה שתרצי:"
          options={INTERESTS_OPTIONS}
          selectedOptions={formData.interests}
          onSelectionChange={handleSelectionChange('interests')}
        />
      </div>

      <div className="border-t pt-6 space-y-6">
        <PillSelector
          title="מה את מחפשת? (איך תרצי להתחבר?)"
          description="בחרי חופשי כמה שתרצי:"
          options={LOOKING_FOR_OPTIONS}
          selectedOptions={formData.looking_for}
          onSelectionChange={handleSelectionChange('looking_for')}
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-4 text-sm text-rose-800 w-full">
          <p className="font-medium mb-2">💡 שימי לב:</p>
          <p>המידע שתזיני יהיה גלוי לחברות אחרות בקהילה וישמש ליצירת קשרים חברתיים. אנא וודאי את דיוק הפרטים. השימוש בפלטפורמה מהווה הסכמה ל<a href="/TermsOfService" target="_blank" className="underline font-semibold">תקנון השימוש</a>.</p>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>ביטול</Button>
        <Button type="submit" disabled={isLoading} className="bg-rose-500 hover:bg-rose-600 text-white">
          {isLoading ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> יוצר פרופיל...</> : 'שמירת פרופיל'}
        </Button>
      </div>
    </form>
  );
}