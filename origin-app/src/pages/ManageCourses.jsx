
import React, { useState, useEffect } from "react";
import { Course } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2, BookOpen, User, Calendar, DollarSign, Users, Star } from "lucide-react";
import CourseForm from "../components/courses/CourseForm";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const courseData = await Course.list("-created_date");
      setCourses(courseData);
    } catch (error) {
      console.error("Failed to load courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingCourse(null);
    setShowModal(true);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowModal(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("האם את בטוחה שאת רוצה למחוק את הקורס הזה?")) {
      try {
        console.log('Attempting to delete course with ID:', courseId);
        await Course.delete(courseId);
        console.log('Course deleted successfully');
        loadCourses();
      } catch (error) {
        console.error("Failed to delete course:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        let errorMessage = "שגיאה לא ידועה במחיקת הקורס";
        if (error.response?.status === 500) {
          errorMessage = "שגיאה פנימית בשרת. יתכן שהקורס קשור למידע אחר במערכת";
        } else if (error.response?.status === 403) {
          errorMessage = "אין הרשאה למחוק את הקורס";
        }
        
        alert(`נכשל במחיקת הקורס: ${errorMessage}`);
      }
    }
  };

  const handleSuccess = () => {
    setShowModal(false);
    loadCourses();
  };

  const getCategoryColor = (category) => {
    const colors = {
      "קריירה": "bg-blue-100 text-blue-800",
      "טכנולוגיה": "bg-purple-100 text-purple-800", 
      "חברתי": "bg-green-100 text-green-800",
      "אישי": "bg-orange-100 text-orange-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getLevelColor = (level) => {
    const colors = {
      "מתחילות": "bg-emerald-100 text-emerald-800",
      "מתקדמות": "bg-rose-100 text-rose-800",
      "לכולן": "bg-indigo-100 text-indigo-800"
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ניהול קורסים והכשרות</h1>
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 ml-2" />
            הוספת קורס חדש
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="bg-white shadow-md overflow-hidden">
                {course.image_url && (
                  <div className="h-48 bg-gradient-to-br from-rose-100 to-pink-100 relative overflow-hidden">
                    <img 
                      src={course.image_url} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className={getCategoryColor(course.category)}>
                        {course.category}
                      </Badge>
                    </div>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                      <div className="flex gap-2 mb-3">
                        {course.level && (
                          <Badge className={getLevelColor(course.level)} variant="outline">
                            {course.level}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-rose-500" />
                      <span>{course.instructor}</span>
                    </div>
                    
                    {course.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 text-rose-500" />
                        <span>{course.duration}</span>
                      </div>
                    )}

                    {course.start_date && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-rose-500" />
                        <span>{new Date(course.start_date).toLocaleDateString('he-IL')}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 text-rose-500" />
                      <span>
                        {course.price && course.price > 0 ? `₪${course.price}` : 'חינם'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(course)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(course.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {courses.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">אין קורסים עדיין</h3>
            <p className="text-gray-500 mb-4">התחילי ליצור את המאגר שלך</p>
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4 ml-2" />
              יצירת קורס ראשון
            </Button>
          </div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? "עריכת קורס" : "הוספת קורס חדש"}
            </DialogTitle>
          </DialogHeader>
          <CourseForm course={editingCourse} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
