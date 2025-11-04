import React, { useState, useRef, useEffect } from 'react';
import { SocialProfile } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImagePlus, Loader2, AlertTriangle, Wand2 } from 'lucide-react';
import PillSelector from './PillSelector';
import AiImageGenerator from '../shared/AiImageGenerator';
import { INTERESTS_OPTIONS, LOOKING_FOR_OPTIONS, CITIES_OPTIONS } from './constants';

export default function EditProfileForm({ user, profile, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    nickname: '',
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

  useEffect(() => {
    if (profile) {
      setFormData({
        nickname: profile.nickname || '',
        age: profile.age || '',
        location: profile.location || '',
        about_me: profile.about_me || '',
        interests: profile.interests || [],
        looking_for: profile.looking_for || [],
        status_quote: profile.status_quote || '',
      });
      if (profile.profile_image_url) {
        setImagePreview(profile.profile_image_url);
      }
    }
  }, [profile]);
  
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
      setError(null);
    }
  };

  const handleAiImageGenerated = (url) => {
    setImagePreview(url);
    setImageFile(null);
    setImageMode('ai_preview');
    setError(null);
  };

  const handleSelectionChange = (field) => (selection) => {
    setFormData(prev => ({ ...prev, [field]: selection }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const requiredFields = {
        nickname: "כינוי",
        age: "גיל",
        location: "אזור מגורים",
        about_me: "קצת עליי",
    };

    for (const field in requiredFields) {
        if (!formData[field] || String(formData[field]).trim() === '') {
            setError(`שדה חובה: "${requiredFields[field]}" חסר.`);
            setIsLoading(false);
            return;
        }
    }

    try {
      let imageUrl = profile?.profile_image_url || null;

      if (imageMode === 'upload_preview' && imageFile) {
        const uploadResult = await UploadFile({ file: imageFile });
        imageUrl = uploadResult.file_url;
      } else if (imageMode === 'ai_preview' && imagePreview) {
        imageUrl = imagePreview;
      }

      const profileDataToUpdate = { 
        ...formData, 
        age: parseInt(formData.age) || null,
        profile_image_url: imageUrl,
      };
      
      if (profile && profile.id) {
        await SocialProfile.update(profile.id, profileDataToUpdate);
        const updatedFullProfile = { ...profile, ...profileDataToUpdate };
        alert('הפרופיל עודכן בהצלחה!');
        onSuccess(updatedFullProfile);
      } else {
        const newProfile = await SocialProfile.create({ ...profileDataToUpdate, email: user.email });
        alert('הפרופיל נוצר בהצלחה!');
        onSuccess(newProfile);
      }
      
    } catch (error) {
      console.error("Error saving profile:", error);
      setError(`אירעה שגיאה בשמירת הפרופיל: ${error.message || 'נסו שוב מאוחר יותר.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">עדכון הפרופיל שלך ✨</h2>
        <p className="text-gray-600 mt-2">עדכני את הפרטים שלך כדי שהחברות שלך יכירו אותך טוב יותר</p>
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
            <Input id="age" type="number" value={formData.age} onChange={handleInputChange} required />
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
                    <Button type="button" variant="outline" onClick={() => imageInputRef.current && imageInputRef.current.click()}>
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
        <Textarea id="about_me" value={formData.about_me} onChange={handleInputChange} rows={4} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status_quote">משפט השראה או סטטוס אישי (אופציונלי)</Label>
        <Input id="status_quote" value={formData.status_quote} onChange={handleInputChange} />
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
      
      <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-4 text-sm text-rose-800 w-full">
        <p className="font-medium mb-2">💡 תזכורת:</p>
        <p>המידע שתעדכני יהיה גלוי לחברות אחרות בקהילה. אנא וודאי שהפרטים מדויקים ועדכניים. את מחויבת ל<a href="/TermsOfService" target="_blank" className="underline font-semibold">תקנון השימוש</a> של הפלטפורמה.</p>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>ביטול</Button>
        <Button type="submit" disabled={isLoading} className="bg-rose-500 hover:bg-rose-600 text-white">
          {isLoading ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> שומר שינויים...</> : 'שמירת שינויים'}
        </Button>
      </div>
    </form>
  );
}