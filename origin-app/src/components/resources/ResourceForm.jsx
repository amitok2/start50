
import React, { useState, useEffect, useRef } from "react";
import { Resource } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Link as LinkIcon, Loader2, ImagePlus } from "lucide-react";

export default function ResourceForm({ resource, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "קישור",
    url: "",
    category: "כלים שיווקיים",
    is_premium: true,
  });
  const [fileToUpload, setFileToUpload] = useState(null);
  const [imageToUpload, setImageToUpload] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (resource) {
      setFormData(resource);
      setImagePreview(resource.image_url || null);
    } else {
      setFormData({
        title: "",
        description: "",
        type: "קישור",
        url: "",
        category: "כלים שיווקיים",
        is_premium: true,
      });
      setImagePreview(null);
    }
  }, [resource]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (key, value) => {
     setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageToUpload(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let finalUrl = formData.url;
    let imageUrl = resource?.image_url || "";

    try {
      // Upload main file if exists
      if (fileToUpload) {
        const uploadResult = await UploadFile({ file: fileToUpload });
        if (uploadResult && uploadResult.file_url) {
          finalUrl = uploadResult.file_url;
        } else {
          throw new Error("File upload failed to return a URL.");
        }
      }

      // Upload image if exists
      if (imageToUpload) {
        const imageUploadResult = await UploadFile({ file: imageToUpload });
        if (imageUploadResult && imageUploadResult.file_url) {
          imageUrl = imageUploadResult.file_url;
        }
      }

      const dataToSave = { 
        ...formData, 
        url: finalUrl,
        image_url: imageUrl
      };

      if (resource) {
        await Resource.update(resource.id, dataToSave);
      } else {
        await Resource.create(dataToSave);
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save resource:", error);
      alert("שגיאה בשמירת המשאב.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resourceTypes = ["מאמר", "וידאו", "תבנית", "מדריך", "קישור"];
  const resourceCategories = ["כלים פיננסיים", "כלים שיווקיים", "מדריכים לפתיחת עסק"];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      {/* Image Upload Section */}
      <div className="space-y-4">
        <Label>תמונה של המשאב (אופציונלי)</Label>
        <div className="flex flex-col items-center gap-4">
          <div 
            className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden"
            onClick={() => imageInputRef.current.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Resource preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-500">
                <ImagePlus className="w-8 h-8 mx-auto" />
                <span className="text-xs">העלי תמונה</span>
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
          <p className="text-xs text-gray-500 text-center">לחצי על התמונה כדי להעלות או לשנות</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">שם המשאב</Label>
        <Input id="title" value={formData.title} onChange={handleInputChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">תיאור קצר</Label>
        <Textarea id="description" value={formData.description} onChange={handleInputChange} rows={3} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>סוג המשאב</Label>
          <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {resourceTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>קטגוריה</Label>
          <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {resourceCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4 rounded-lg border p-4">
        <Label>קישור או קובץ</Label>
        <div className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5 text-gray-400" />
          <Input id="url" placeholder="הדביקי כאן קישור (לסרטון יוטיוב, מאמר וכו')" value={formData.url} onChange={handleInputChange} />
        </div>
        <div className="relative flex items-center justify-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs">או</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>
        <div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <Button type="button" variant="outline" onClick={() => fileInputRef.current.click()}>
            <Upload className="w-4 h-4 ml-2" />
            העלאת קובץ (כמו Excel, PDF)
          </Button>
          {fileToUpload && <p className="text-sm text-gray-600 mt-2">קובץ נבחר: {fileToUpload.name}</p>}
        </div>
        <p className="text-xs text-gray-500">אם תעלי קובץ, הוא ידרוס את הקישור שהודבק.</p>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="is_premium" 
          checked={formData.is_premium}
          onCheckedChange={(checked) => handleSelectChange('is_premium', checked)}
        />
        <Label htmlFor="is_premium" className="font-medium cursor-pointer">
          זהו תוכן פרימיום (זמין רק למנויות משלמות)
        </Label>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (resource ? "עדכון משאב" : "שמירת משאב")}
        </Button>
      </div>
    </form>
  );
}
