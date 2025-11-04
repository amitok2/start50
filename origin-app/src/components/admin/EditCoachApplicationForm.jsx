import React, { useState, useEffect, useRef } from 'react';
import { MentorApplication } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Plus, Trash2, ImagePlus } from 'lucide-react';

export default function EditCoachApplicationForm({ application, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (application) {
      setFormData({
        full_name: application.full_name || '',
        email: application.email || '',
        phone: application.phone || '',
        specialty: application.specialty || '',
        experience_summary: application.experience_summary || '',
        linkedin_profile_url: application.linkedin_profile_url || '',
        why_join: application.why_join || '',
        recommendations: application.recommendations || [],
        status: application.status || 'pending',
        admin_notes: application.admin_notes || '',
        image_url: application.image_url || ''
      });
      setImagePreview(application.image_url);
    }
  }, [application]);

  const specialtyOptions = [
    "מאמנת לקריירה ופיתוח מקצועי",
    "יועצת עסקית ופיננסית",
    "מאמנת להעצמה אישית וביטחון עצמי",
    "יועצת לפיתוח מיומנויות טכנולוגיות",
    "מאמנת לאורח חיים בריא ותזונה",
    "יועצת להכנה לפרישה ופרק ב׳ בחיים",
    "מאמנת להגשמה עסקית ויזמות נשית",
    "יועצת למערכות יחסים וזוגיות",
    "מאמנת לפיתוח מנהיגות נשית",
    "יועצת לניהול זמן ופרודקטיביות"
  ];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRecommendationChange = (index, field, value) => {
    const newRecommendations = [...formData.recommendations];
    newRecommendations[index][field] = value;
    setFormData(prev => ({ ...prev, recommendations: newRecommendations }));
  };

  const addRecommendation = () => {
    setFormData(prev => ({
      ...prev,
      recommendations: [...(prev.recommendations || []), { author: '', text: '' }]
    }));
  };

  const removeRecommendation = (index) => {
    const newRecommendations = formData.recommendations.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, recommendations: newRecommendations }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let finalData = { ...formData };

    try {
      if (imageFile) {
        const uploadResult = await UploadFile({ file: imageFile });
        finalData.image_url = uploadResult.file_url;
      }

      await MentorApplication.update(application.id, finalData);
      onSuccess();
    } catch (error) {
      console.error("Failed to update application:", error);
      alert("שגיאה בעדכון הבקשה.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!application) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <div className="flex flex-col items-center gap-4">
          <Label>תמונת פרופיל</Label>
          <div 
            className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden"
            onClick={() => imageInputRef.current.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-500">
                <ImagePlus className="w-8 h-8 mx-auto" />
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={imageInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="full_name">שם מלא</Label>
          <Input id="full_name" value={formData.full_name} onChange={handleInputChange} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">אימייל</Label>
          <Input id="email" type="email" value={formData.email} onChange={handleInputChange} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="phone">טלפון</Label>
          <Input id="phone" value={formData.phone} onChange={handleInputChange} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="specialty">תחום התמחות</Label>
          <Select value={formData.specialty} onValueChange={(v) => handleSelectChange('specialty', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {specialtyOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="experience_summary">סיכום ניסיון</Label>
        <Textarea id="experience_summary" value={formData.experience_summary} onChange={handleInputChange} rows={3} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="why_join">למה להצטרף</Label>
        <Textarea id="why_join" value={formData.why_join} onChange={handleInputChange} rows={3} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="linkedin_profile_url">פרופיל לינקדאין</Label>
        <Input id="linkedin_profile_url" value={formData.linkedin_profile_url} onChange={handleInputChange} />
      </div>

      <div className="space-y-2 rounded-lg border bg-gray-50 p-3">
        <Label className="font-semibold text-gray-800">המלצות</Label>
        {formData.recommendations?.map((rec, index) => (
          <div key={index} className="space-y-2 rounded-md border bg-white p-3 relative">
            <Button type="button" variant="ghost" size="icon" onClick={() => removeRecommendation(index)} className="absolute top-1 left-1 h-6 w-6"><Trash2 className="w-4 h-4 text-red-500" /></Button>
            <Input value={rec.author} onChange={(e) => handleRecommendationChange(index, 'author', e.target.value)} placeholder="שם הממליצ.ה" />
            <Textarea value={rec.text} onChange={(e) => handleRecommendationChange(index, 'text', e.target.value)} placeholder="תוכן ההמלצה" rows={2}/>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addRecommendation} className="bg-white"><Plus className="w-4 h-4 ml-2" /> הוספת המלצה</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
        <div className="space-y-1">
          <Label>סטטוס</Label>
          <Select value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">ממתין לאישור</SelectItem>
              <SelectItem value="approved">מאושר</SelectItem>
              <SelectItem value="rejected">נדחה</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="admin_notes">הערות מנהלת</Label>
          <Textarea id="admin_notes" value={formData.admin_notes} onChange={handleInputChange} rows={2} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>ביטול</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          שמירת שינויים
        </Button>
      </div>
    </form>
  );
}