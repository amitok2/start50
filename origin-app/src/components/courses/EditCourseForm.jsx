import React, { useState, useEffect } from "react";
import { Course } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from "lucide-react";

export default function EditCourseForm({ onSuccess, onCancel, course }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    duration: "",
    price: "",
    category: "",
    level: "",
    start_date: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        instructor: course.instructor || "",
        duration: course.duration || "",
        price: course.price || "",
        category: course.category || "",
        level: course.level || "",
        start_date: course.start_date ? new Date(course.start_date).toISOString().split('T')[0] : ""
      });
    }
  }, [course]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await Course.update(course.id, {
        ...formData,
        price: parseFloat(formData.price) || 0,
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to update course:", error);
      alert("אופס! משהו השתבש בעדכון הקורס.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">עריכת קורס</h2>
        <p className="text-gray-600 mt-2">עדכני את פרטי הקורס שלך.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">שם הקורס</Label>
          <Input id="title" value={formData.title} onChange={handleInputChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">תיאור הקורס</Label>
          <Textarea id="description" value={formData.description} onChange={handleInputChange} rows={3} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="instructor">שם המדריכה</Label>
            <Input id="instructor" value={formData.instructor} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">מחיר (בשקלים)</Label>
            <Input id="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>קטגוריה</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger><SelectValue placeholder="בחרי קטגוריה" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="קריירה">קריירה</SelectItem>
                        <SelectItem value="טכנולוגיה">טכנולוגיה</SelectItem>
                        <SelectItem value="חברתי">חברתי</SelectItem>
                        <SelectItem value="אישי">אישי</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>רמה</Label>
                <Select value={formData.level} onValueChange={(value) => handleSelectChange("level", value)}>
                    <SelectTrigger><SelectValue placeholder="בחרי רמה" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="מתחילות">מתחילות</SelectItem>
                        <SelectItem value="מתקדמות">מתקדמות</SelectItem>
                        <SelectItem value="לכולן">לכולן</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="duration">משך הקורס</Label>
                <Input id="duration" value={formData.duration} onChange={handleInputChange} placeholder="לדוגמה: 8 מפגשים, 12 שעות"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="start_date">תאריך התחלה</Label>
                <Input id="start_date" type="date" value={formData.start_date} onChange={handleInputChange}/>
            </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>ביטול</Button>
        <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 text-white">
          {isSubmitting ? 'מעדכנת...' : 'עדכון קורס'}
          <Edit className="w-4 h-4 mr-2" />
        </Button>
      </div>
    </form>
  );
}