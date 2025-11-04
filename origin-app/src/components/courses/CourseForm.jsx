
import React, { useState, useEffect, useRef } from "react";
import { Course } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ImagePlus, Plus, Trash2, Loader2, Save, User, BookOpen } from "lucide-react";

export default function CourseForm({ course, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    instructor_bio: "",
    duration: "",
    price: "",
    category: "קריירה",
    level: "לכולן",
    start_date: "",
    highlights: []
  });
  
  const [courseImageFile, setCourseImageFile] = useState(null);
  const [courseImagePreview, setCourseImagePreview] = useState(null);
  const [instructorImageFile, setInstructorImageFile] = useState(null);
  const [instructorImagePreview, setInstructorImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState("");
  
  const courseImageRef = useRef(null);
  const instructorImageRef = useRef(null);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        instructor: course.instructor || "",
        instructor_bio: course.instructor_bio || "",
        duration: course.duration || "",
        price: course.price || "",
        category: course.category || "קריירה",
        level: course.level || "לכולן",
        start_date: course.start_date ? new Date(course.start_date).toISOString().split('T')[0] : "",
        highlights: course.highlights || []
      });
      setCourseImagePreview(course.image_url || null);
      setInstructorImagePreview(course.instructor_image_url || null);
    } else {
      setFormData({
        title: "",
        description: "",
        instructor: "",
        instructor_bio: "",
        duration: "",
        price: "",
        category: "קריירה",
        level: "לכולן",
        start_date: "",
        highlights: []
      });
      setCourseImagePreview(null);
      setInstructorImagePreview(null);
    }
  }, [course]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCourseImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCourseImageFile(file);
      setCourseImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInstructorImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setInstructorImageFile(file);
      setInstructorImagePreview(URL.createObjectURL(file));
    }
  };

  const addHighlight = () => {
    if (currentHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, currentHighlight.trim()]
      }));
      setCurrentHighlight("");
    }
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let courseImageUrl = courseImagePreview;
    let instructorImageUrl = instructorImagePreview;

    try {
      // Upload course image if exists
      if (courseImageFile) {
        const uploadResult = await UploadFile({ file: courseImageFile });
        courseImageUrl = uploadResult.file_url;
      }

      // Upload instructor image if exists
      if (instructorImageFile) {
        const uploadResult = await UploadFile({ file: instructorImageFile });
        instructorImageUrl = uploadResult.file_url;
      }

      // Clean and validate data before sending
      const dataToSave = {
        title: formData.title?.trim() || "",
        description: formData.description?.trim() || "",
        instructor: formData.instructor?.trim() || "",
        instructor_bio: formData.instructor_bio?.trim() || "",
        duration: formData.duration?.trim() || "",
        price: parseFloat(formData.price) || 0,
        category: formData.category || "קריירה",
        level: formData.level || "לכולן",
        start_date: formData.start_date || null,
        highlights: Array.isArray(formData.highlights) ? formData.highlights : [],
        image_url: courseImageUrl || null,
        instructor_image_url: instructorImageUrl || null
      };

      // Remove null/undefined values and empty strings if they are not explicitly required to be empty
      Object.keys(dataToSave).forEach(key => {
        if (dataToSave[key] === null || dataToSave[key] === undefined || (typeof dataToSave[key] === 'string' && dataToSave[key] === "")) {
          // Keep price 0 if it is 0
          if (key === 'price' && dataToSave[key] === 0) return;
          delete dataToSave[key];
        }
      });
      
      console.log('Attempting to save course with cleaned data:', dataToSave);

      if (course && course.id) {
        console.log('Updating existing course ID:', course.id);
        await Course.update(course.id, dataToSave);
      } else {
        console.log('Creating new course...');
        await Course.create(dataToSave);
      }
      
      onSuccess();
    } catch (error) {
      console.error("Failed to save course:", error);
      
      // More detailed error logging
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      
      let errorMessage = "שגיאה לא ידועה";
      
      if (error.response?.status === 500) {
        errorMessage = "שגיאה בשרת. נסי להקטין את אורך התיאור או לבדוק תווים מיוחדים";
      } else if (error.response?.status === 403) {
        errorMessage = "אין הרשאה לעריכת הקורס";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`שגיאה בשמירת הקורס: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      
      {/* Course Image */}
      <div className="space-y-4">
        <Label>תמונה של הקורס</Label>
        <div className="flex flex-col items-center gap-4">
          <div 
            className="w-48 h-32 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden"
            onClick={() => courseImageRef.current.click()}
          >
            {courseImagePreview ? (
              <img src={courseImagePreview} alt="Course preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-500">
                <BookOpen className="w-8 h-8 mx-auto mb-2" />
                <span className="text-xs">העלי תמונת קורס</span>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={courseImageRef}
            onChange={handleCourseImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Basic Course Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">שם הקורס</Label>
          <Input id="title" value={formData.title} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instructor">שם המרצה/המדריכה</Label>
          <Input id="instructor" value={formData.instructor} onChange={handleInputChange} required />
        </div>
      </div>

      {/* Instructor Image */}
      <div className="space-y-4">
        <Label>תמונה של המרצה</Label>
        <div className="flex flex-col items-center gap-4">
          <div 
            className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden"
            onClick={() => instructorImageRef.current.click()}
          >
            {instructorImagePreview ? (
              <img src={instructorImagePreview} alt="Instructor preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-500">
                <User className="w-8 h-8 mx-auto mb-2" />
                <span className="text-xs">העלי תמונת מרצה</span>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={instructorImageRef}
            onChange={handleInstructorImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructor_bio">ביו קצר של המרצה</Label>
        <Textarea id="instructor_bio" value={formData.instructor_bio} onChange={handleInputChange} rows={3} placeholder="רקע מקצועי, התמחויות, ניסיון..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">תיאור הקורס</Label>
        <Textarea id="description" value={formData.description} onChange={handleInputChange} rows={4} required />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>קטגוריה</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="קריירה">קריירה</SelectItem>
              <SelectItem value="טכנולוגיה">טכנולוגיה</SelectItem>
              <SelectItem value="חברתי">חברתי</SelectItem>
              <SelectItem value="אישי">אישי</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>רמת הקורס</Label>
          <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({...prev, level: value}))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="מתחילות">מתחילות</SelectItem>
              <SelectItem value="מתקדמות">מתקדמות</SelectItem>
              <SelectItem value="לכולן">לכולן</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">משך הקורס</Label>
          <Input id="duration" value={formData.duration} onChange={handleInputChange} placeholder="8 שבועות, 12 שעות..." />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">מחיר (בשקלים)</Label>
          <Input id="price" type="number" min="0" step="10" value={formData.price} onChange={handleInputChange} placeholder="0 לקורס חינם" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="start_date">תאריך התחלה</Label>
          <Input id="start_date" type="date" value={formData.start_date} onChange={handleInputChange} />
        </div>
      </div>

      {/* Highlights */}
      <div className="space-y-4">
        <Label>נקודות עיקריות בקורס</Label>
        <div className="flex gap-2">
          <Input
            value={currentHighlight}
            onChange={(e) => setCurrentHighlight(e.target.value)}
            placeholder="מה תלמדי בקורס..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
          />
          <Button type="button" onClick={addHighlight} variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {formData.highlights.length > 0 && (
          <div className="space-y-2">
            {formData.highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                <span className="flex-1">{highlight}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeHighlight(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
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
              {course ? "שמירת שינויים" : "יצירת קורס"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
