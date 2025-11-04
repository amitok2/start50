import React, { useState, useRef } from "react";
import { PayItForward } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, Heart } from "lucide-react";

export default function CreateGiftForm({ gift, currentUser, onSuccess, onCancel }) {
  const [formData, setFormData] = useState(gift || {
    title: "",
    description: "",
    category: "",
    location: "",
    expiry_date: ""
  });
  const [giftImageFile, setGiftImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(gift?.image_url || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setGiftImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let imageUrl = gift?.image_url || ""; // Start with existing image_url if editing

    try {
      if (giftImageFile) {
        const uploadResult = await UploadFile({ file: giftImageFile });
        imageUrl = uploadResult.file_url;
      }

      const giftData = {
        ...formData,
        giver_name: currentUser.full_name,
        giver_email: currentUser.email,
        image_url: imageUrl,
        status: "available"
      };

      if (gift) {
        // עדכון מתנה קיימת
        await PayItForward.update(gift.id, giftData);
      } else {
        // יצירת מתנה חדשה
        await PayItForward.create(giftData);
      }
      
      onSuccess();
    } catch (error) {
      console.error("Failed to save gift:", error);
      alert("שגיאה בשמירת המתנה. נסי שוב.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center">
        <div className="text-4xl mb-2">🎁</div>
        <h2 className="text-2xl font-bold text-gray-900">
          {gift ? "עדכון המתנה" : "הוספת מתנה לקהילה"}
        </h2>
        <p className="text-gray-600 mt-2">
          {gift ? "ערכי את פרטי המתנה" : "שתפי משהו טוב עם הקהילה שלנו"}
        </p>
      </div>

      {/* Image Upload */}
      <div className="flex flex-col items-center gap-4">
        <div 
          className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden"
          onClick={() => fileInputRef.current.click()}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Gift preview" className="w-full h-full object-cover" />
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

      {/* Gift Details */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">כותרת המתנה</Label>
          <Input id="title" placeholder="לדוגמה: משרת גרפיקאית בסטארטאפ" value={formData.title} onChange={handleInputChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">תיאור המתנה</Label>
          <Textarea id="description" placeholder="ספרי על המתנה, למה היא טובה ואיך ליצור קשר..." value={formData.description} onChange={handleInputChange} rows={4} required />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>סוג המתנה</Label>
            <Select onValueChange={(value) => setFormData(prev => ({...prev, category: value}))} value={formData.category}>
              <SelectTrigger>
                <SelectValue placeholder="בחרי סוג" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="משרה">משרה</SelectItem>
                <SelectItem value="טיפ">טיפ</SelectItem>
                <SelectItem value="פריט">פריט</SelectItem>
                <SelectItem value="חוויה">חוויה</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">מיקום (אופציונלי)</Label>
            <Input id="location" placeholder="איפה זה נמצא?" value={formData.location} onChange={handleInputChange} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiry_date">תאריך תפוגה (אופציונלי)</Label>
          <Input id="expiry_date" type="date" value={formData.expiry_date} onChange={handleInputChange} />
        </div>
      </div>
      
      {/* Submit */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>ביטול</Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
        >
          {isSubmitting ? (gift ? 'מעדכן מתנה...' : 'מוסיף מתנה...') : (gift ? 'עדכון המתנה' : 'הוספת המתנה לקהילה')}
          <Heart className="w-4 h-4 mr-2" />
        </Button>
      </div>
    </form>
  );
}