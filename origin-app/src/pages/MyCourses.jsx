import React, { useState, useEffect } from "react";
import { CourseEnrollment } from "@/api/entities";
import { Course } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Calendar, Clock, User as UserIcon, CheckCircle, Play, Pause, X, MessageSquare, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function MyCourses() {
    const [enrollments, setEnrollments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadMyEnrollments();
    }, []);

    const loadMyEnrollments = async () => {
        try {
            const user = await User.me();
            setCurrentUser(user);

            const userEnrollments = await CourseEnrollment.filter(
                { student_email: user.email },
                '-enrollment_date'
            );
            setEnrollments(userEnrollments);

            // טען פרטי קורסים
            if (userEnrollments.length > 0) {
                const courseIds = userEnrollments.map(e => e.course_id);
                const allCourses = await Course.list();
                const enrolledCourses = allCourses.filter(c => courseIds.includes(c.id));
                setCourses(enrolledCourses);
            }
        } catch (error) {
            console.error("Error loading enrollments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateEnrollmentStatus = async (enrollmentId, newStatus) => {
        try {
            await CourseEnrollment.update(enrollmentId, { status: newStatus });
            setEnrollments(prev => prev.map(e => 
                e.id === enrollmentId ? { ...e, status: newStatus } : e
            ));
        } catch (error) {
            console.error("Error updating enrollment:", error);
            alert("שגיאה בעדכון הסטטוס");
        }
    };

    const updateProgress = async (enrollmentId, progress) => {
        try {
            await CourseEnrollment.update(enrollmentId, { 
                completion_percentage: progress,
                ...(progress === 100 && { status: 'completed' })
            });
            setEnrollments(prev => prev.map(e => 
                e.id === enrollmentId ? { 
                    ...e, 
                    completion_percentage: progress,
                    ...(progress === 100 && { status: 'completed' })
                } : e
            ));
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            active: "bg-green-100 text-green-800",
            completed: "bg-blue-100 text-blue-800",
            paused: "bg-yellow-100 text-yellow-800",
            dropped: "bg-red-100 text-red-800"
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const getStatusText = (status) => {
        const texts = {
            active: "פעיל",
            completed: "הושלם",
            paused: "מושהה",
            dropped: "ננטש"
        };
        return texts[status] || status;
    };

    const getCourseDetails = (courseId) => {
        return courses.find(c => c.id === courseId);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">הקורסים שלי</h1>
                        <p className="text-gray-600">
                            עקבי אחר ההתקדמות שלך בקורסים השונים
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link to={createPageUrl("CoursesAndEvents")}>
                            <BookOpen className="w-4 h-4 ml-2" />
                            עיוני בקורסים נוספים
                        </Link>
                    </Button>
                </div>

                {enrollments.length === 0 ? (
                    <Card className="text-center py-16">
                        <CardContent>
                            <BookOpen className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-gray-700 mb-4">
                                עדיין לא נרשמת לקורסים
                            </h2>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                גלי את המגוון הרחב של קורסים והכשרות שמחכים לך
                            </p>
                            <Button asChild size="lg" className="bg-gradient-to-r from-rose-500 to-pink-600">
                                <Link to={createPageUrl("CoursesAndEvents")}>
                                    <BookOpen className="w-5 h-5 ml-2" />
                                    עיוני בקורסים זמינים
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {enrollments.map(enrollment => {
                            const courseDetails = getCourseDetails(enrollment.course_id);
                            
                            return (
                                <Card key={enrollment.id} className="overflow-hidden shadow-xl bg-white">
                                    {courseDetails?.image_url && (
                                        <div className="h-48 bg-gradient-to-br from-rose-100 to-pink-100 relative overflow-hidden">
                                            <img 
                                                src={courseDetails.image_url} 
                                                alt={enrollment.course_title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-4 right-4">
                                                <Badge className={getStatusColor(enrollment.status)}>
                                                    {getStatusText(enrollment.status)}
                                                </Badge>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-start">
                                            <span>{enrollment.course_title}</span>
                                            {!courseDetails?.image_url && (
                                                <Badge className={getStatusColor(enrollment.status)}>
                                                    {getStatusText(enrollment.status)}
                                                </Badge>
                                            )}
                                        </CardTitle>
                                        <div className="text-sm text-gray-500">
                                            נרשמת ב-{format(new Date(enrollment.enrollment_date), 'dd/MM/yyyy', { locale: he })}
                                        </div>
                                    </CardHeader>
                                    
                                    <CardContent className="space-y-4">
                                        {courseDetails && (
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <UserIcon className="w-4 h-4 text-rose-500" />
                                                    <span>{courseDetails.instructor}</span>
                                                </div>
                                                {courseDetails.duration && (
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-rose-500" />
                                                        <span>{courseDetails.duration}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium">התקדמות</span>
                                                <span className="text-sm text-gray-600">
                                                    {enrollment.completion_percentage || 0}%
                                                </span>
                                            </div>
                                            <Progress value={enrollment.completion_percentage || 0} className="h-2" />
                                        </div>

                                        <div className="flex gap-2 pt-4">
                                            {enrollment.status === 'active' ? (
                                                <>
                                                    <Button
                                                        onClick={() => updateEnrollmentStatus(enrollment.id, 'paused')}
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1"
                                                    >
                                                        <Pause className="w-4 h-4 ml-1" />
                                                        השהה
                                                    </Button>
                                                    <Button
                                                        onClick={() => updateProgress(enrollment.id, Math.min(100, (enrollment.completion_percentage || 0) + 10))}
                                                        size="sm"
                                                        className="flex-1 bg-rose-600 hover:bg-rose-700"
                                                    >
                                                        <Play className="w-4 h-4 ml-1" />
                                                        המשך
                                                    </Button>
                                                </>
                                            ) : enrollment.status === 'paused' ? (
                                                <Button
                                                    onClick={() => updateEnrollmentStatus(enrollment.id, 'active')}
                                                    size="sm"
                                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                                >
                                                    <Play className="w-4 h-4 ml-1" />
                                                    המשך
                                                </Button>
                                            ) : enrollment.status === 'completed' ? (
                                                <div className="flex items-center justify-center text-green-600 font-medium py-2">
                                                    <CheckCircle className="w-5 h-5 ml-2" />
                                                    הקורס הושלם בהצלחה!
                                                </div>
                                            ) : null}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}