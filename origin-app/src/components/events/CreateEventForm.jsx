
import React, { useState, useRef, useEffect } from "react";
import { Event } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ImagePlus, Calendar, MapPin, Edit } from "lucide-react";

export default function CreateEventForm({ onSuccess, onCancel, initialEvent }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "",
    max_participants: "",
    price: "",
    is_public: false,
    organizer_name: "",
    organizer_contact: ""
  });
  const [eventImageFile, setEventImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialEvent) {
      setFormData({
        title: initialEvent.title || "",
        description: initialEvent.description || "",
        date: initialEvent.date ? new Date(initialEvent.date).toISOString().split('T')[0] : "",
        time: initialEvent.time || "",
        location: initialEvent.location || "",
        type: initialEvent.type || "",
        max_participants: initialEvent.max_participants || "",
        price: initialEvent.price || "",
        is_public: initialEvent.is_public || false,
        organizer_name: initialEvent.organizer_name || "",
        organizer_contact: initialEvent.organizer_contact || ""
      });
      if (initialEvent.image_url) {
        setImagePreview(initialEvent.image_url);
      }
    }
  }, [initialEvent]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEventImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let imageUrl = imagePreview; // Start with existing image or previously selected preview

    try {
      if (eventImageFile) {
        const uploadResult = await UploadFile({ file: eventImageFile });
        imageUrl = uploadResult.file_url;
      }

      const dataToSave = {
        ...formData,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        price: formData.price ? parseFloat(formData.price) : 0,
        image_url: imageUrl
      };

      if (initialEvent) {
        await Event.update(initialEvent.id, dataToSave);
      } else {
        await Event.create(dataToSave);
      }
      
      onSuccess();
    } catch (error) {
      console.error("Failed to create/update event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = !!initialEvent;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{isEditing ? "עריכת אירוע" : "יצירת אירוע חדש"}</h2>
        <p className="text-gray-600 mt-2">{isEditing ? "עדכני את פרטי האירוע שלך" : "ארגני אירוע מותאם לקהילה שלנו"}</p>
      </div>

      {/* Image Upload */}
      <div className="flex flex-col items-center gap-4">
        <div 
          className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden"
          onClick={() => fileInputRef.current.click()}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Event preview" className="w-full h-full object-cover" />
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

      {/* Event Details */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">שם האירוע</Label>
          <Input id="title" placeholder="מה שם האירוע?" value={formData.title} onChange={handleInputChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">תיאור האירוע</Label>
          <Textarea id="description" placeholder="ספרי על האירוע..." value={formData.description} onChange={handleInputChange} rows={3} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">תאריך</Label>
            <Input id="date" type="date" value={formData.date} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">שעה</Label>
            <Input id="time" type="time" value={formData.time} onChange={handleInputChange} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">מקום</Label>
          <Input id="location" placeholder="איפה יתקיים האירוע?" value={formData.location} onChange={handleInputChange} required />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>סוג האירוע</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({...prev, type: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="בחרי סוג" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="מפגש">מפגש</SelectItem>
                <SelectItem value="הרצאה">הרצאה</SelectItem>
                <SelectItem value="טיול">טיול</SelectItem>
                <SelectItem value="התנדבות">התנדבות</SelectItem>
                <SelectItem value="יום כיף">יום כיף</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_participants">מספר משתתפות מקסימלי</Label>
            <Input id="max_participants" type="number" placeholder="20" value={formData.max_participants} onChange={handleInputChange} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">עלות (בשקלים)</Label>
          <Input id="price" type="number" step="0.01" placeholder="0 לאירוע חינם" value={formData.price} onChange={handleInputChange} />
        </div>

        {/* Organizer Details */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">פרטי המארגנת</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organizer_name">שם המארגנת</Label>
              <Input id="organizer_name" placeholder="השם שלך" value={formData.organizer_name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizer_contact">פרטי יצירת קשר</Label>
              <Input id="organizer_contact" placeholder="טלפון או מייל" value={formData.organizer_contact} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        {/* Public/Private Setting */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is_public" 
              checked={formData.is_public}
              onCheckedChange={(checked) => setFormData(prev => ({...prev, is_public: checked}))}
            />
            <Label htmlFor="is_public" className="font-medium">פרסום האירוע באתר</Label>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {formData.is_public 
              ? "האירוע יפורסם באתר ויהיה גלוי לכל הקהילה" 
              : "האירוע יישאר פרטי ולא יפורסם באתר"}
          </p>
        </div>
      </div>
      
      {/* Submit */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>ביטול</Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
        >
          {isEditing ? (
            <>
              {isSubmitting ? 'מעדכנת...' : 'עדכון אירוע'}
              <Edit className="w-4 h-4 mr-2" />
            </>
          ) : (
            <>
              {isSubmitting ? 'יוצרת אירוע...' : 'יצירת האירוע'}
              <Calendar className="w-4 h-4 mr-2" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
