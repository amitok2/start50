
import React, { useState, useEffect, useRef } from "react";
import { MentorSession } from "@/api/entities";
import { User } from "@/api/entities"; // Added import for User entity
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, Plus, Trash2, Loader2, Save } from "lucide-react";

const specialtyOptions = [
  "פיתוח קריירה ושינוי מקצוע",
  "יזמות ועסבים קטנים",
  "התפתחות אישית וביטחון עצמי",
  "טכנולוגיה ודיגיטל לנשים 50+",
  "כלכלת משפחה וניהול פיננסי",
  "יחסים, זוגיות ומשפחה בגיל 50+",
  "בריאות, תזונה ואורח חיים",
  "יצירה, תחביבים וזהות עצמית",
  "הכנה לפרישה ומעבר שלב",
  "קהילה, שייכות והעצמה נשית"
];

export default function MentorForm({ mentor, onSuccess }) {
  const [formData, setFormData] = useState({
    mentor_name: "",
    specialty: "",
    contact_email: "",
    description: "",
    bio: "",
    focus_areas: [],
    recommendations: [],
    phone: "", // New field
    location: "" // New field
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (mentor) {
      setFormData({
        mentor_name: mentor.mentor_name || "",
        specialty: mentor.specialty || "",
        contact_email: mentor.contact_email || "",
        description: mentor.description || "",
        bio: mentor.bio || "",
        focus_areas: mentor.focus_areas || [],
        recommendations: mentor.recommendations || [],
        phone: mentor.phone || "", // Initialize new field
        location: mentor.location || "" // Initialize new field
      });
      setImagePreview(mentor.image_url || null);
    } else {
       setFormData({
        mentor_name: "",
        specialty: "",
        contact_email: "",
        description: "",
        bio: "",
        focus_areas: [],
        recommendations: [{ author: '', text: '' }],
        phone: "", // Initialize new field for new mentor
        location: "" // Initialize new field for new mentor
      });
      setImagePreview(null);
    }
  }, [mentor]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleFocusAreasChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, focus_areas: value.split(',').map(s => s.trim()) }));
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
        recommendations: [...prev.recommendations, { author: '', text: '' }]
    }));
  };

  const removeRecommendation = (index) => {
      const newRecommendations = formData.recommendations.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, recommendations: newRecommendations }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let imageUrl = imagePreview;

    try {
      if (imageFile) {
        const uploadResult = await UploadFile({ file: imageFile });
        imageUrl = uploadResult.file_url;
      }

      const dataToSave = {
        ...formData,
        image_url: imageUrl,
        recommendations: formData.recommendations.filter(r => r.author && r.text),
      };

      if (mentor) {
        await MentorSession.update(mentor.id, dataToSave);
      } else {
        const newMentorSession = await MentorSession.create(dataToSave);
        
        // **FIX**: After creating a mentor, update the corresponding user's roles
        try {
            const users = await User.filter({ email: formData.contact_email });
            if (users && users.length > 0) {
                const userToUpdate = users[0];
                await User.update(userToUpdate.id, {
                    user_type: 'mentor',
                    is_approved_mentor: true,
                    mentor_id: newMentorSession.id
                });
            }
        } catch (userUpdateError) {
            console.warn(`Mentor created, but failed to update user record for ${formData.contact_email}.`, userUpdateError);
            alert(`פרופיל המנטורית נוצר, אך נכשלה פעולת עדכון הרשאות המשתמשת. יש לעדכן אותה ידנית.`);
        }
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save mentor:", error);
      alert("שגיאה בשמירת המנטורית.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      <div className="flex flex-col items-center gap-4">
        <div 
          className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden"
          onClick={() => fileInputRef.current.click()}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-gray-500">
              <ImagePlus className="w-8 h-8 mx-auto" />
              <span className="text-xs">העלי תמונה</span>
            </div>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mentor_name">שם המנטורית</Label>
          <Input id="mentor_name" value={formData.mentor_name} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">מספר טלפון</Label>
          <Input id="phone" value={formData.phone || ''} onChange={handleInputChange} placeholder="לדוגמה: 050-1234567" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact_email">מייל לתיאום פגישה</Label>
          <Input id="contact_email" type="email" value={formData.contact_email} onChange={handleInputChange} required placeholder="האימייל שיקבל את בקשות הפגישה" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">מיקום גיאוגרפי</Label>
          <Input id="location" value={formData.location || ''} onChange={handleInputChange} placeholder="לדוגמה: תל אביב, ירושלים" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="specialty">תחום התמחות ראשי</Label>
        <Select
          value={formData.specialty}
          onValueChange={(value) => setFormData(prev => ({ ...prev, specialty: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="בחרי תחום התמחות..." />
          </SelectTrigger>
          <SelectContent>
            {specialtyOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">תיאור קצר (לכרטיס)</Label>
        <Textarea id="description" value={formData.description} onChange={handleInputChange} rows={3} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">ביו מורחב (לעמוד פרופיל)</Label>
        <Textarea id="bio" value={formData.bio} onChange={handleInputChange} rows={5} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="focus_areas">תחומי מיקוד (מופרדים בפסיק)</Label>
        <Input id="focus_areas" value={formData.focus_areas.join(', ')} onChange={handleFocusAreasChange} placeholder="לדוגמה: שינוי קריירה, ביטחון עצמי" />
      </div>

      <div className="space-y-4 rounded-lg border bg-gray-50 p-4">
        <Label className="text-lg font-semibold text-gray-800">המלצות</Label>
        {formData.recommendations.map((rec, index) => (
          <div key={index} className="space-y-2 rounded-md border bg-white p-4 pt-2 relative">
            <Button type="button" variant="ghost" size="icon" onClick={() => removeRecommendation(index)} className="absolute top-1 left-1 h-7 w-7">
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
            <div className="space-y-1">
              <Label htmlFor={`rec-author-${index}`}>שם הממליצ.ה</Label>
              <Input id={`rec-author-${index}`} value={rec.author} onChange={(e) => handleRecommendationChange(index, 'author', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`rec-text-${index}`}>תוכן ההמלצה</Label>
              <Textarea id={`rec-text-${index}`} value={rec.text} onChange={(e) => handleRecommendationChange(index, 'text', e.target.value)} rows={2} />
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addRecommendation} className="bg-white">
          <Plus className="w-4 h-4 ml-2" />
          הוספת המלצה
        </Button>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              שומר...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {mentor ? "שמירת שינויים" : "יצירת מנטורית"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
