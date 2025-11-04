
import React, { useState, useEffect } from "react";
import { Course } from "@/api/entities";
import { Event } from "@/api/entities";
import { CourseEnrollment } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Calendar, Clock, User as UserIcon, Star, Filter, Search, CheckCircle, Loader2, MapPin, Users, AlertTriangle, Heart, Mic, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PremiumContentWrapper from '../components/auth/PremiumContentWrapper';

export default function CoursesAndEvents() {
    const [activeTab, setActiveTab] = useState('all');
    
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedActivityType, setSelectedActivityType] = useState('all');

    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [eventTypeFilter, setEventTypeFilter] = useState('all');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [userEnrollments, setUserEnrollments] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const loadPageData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const coursesData = await Course.list("-created_date");
                setCourses(coursesData);
                setFilteredCourses(coursesData);

                const eventsData = await Event.filter({ is_public: true }, "date");
                setEvents(eventsData);
                setFilteredEvents(eventsData);

                try {
                    const user = await User.me();
                    setCurrentUser(user);
                    
                    if (user) {
                        const enrollments = await CourseEnrollment.filter(
                            { student_email: user.email }, 
                            '-enrollment_date'
                        );
                        setUserEnrollments(enrollments);
                    } else {
                        setCurrentUser(null);
                        setUserEnrollments([]);
                    }
                } catch (userError) {
                    console.log("User not logged in or enrollments unavailable:", userError);
                    setCurrentUser(null);
                    setUserEnrollments([]);
                }

            } catch (error) {
                console.error("Error loading data:", error);
                setError("אירעה שגיאה קריטית בטעינת הנתונים. ייתכן שקיימות רשומות פגומות במערכת הקורסים. התקלה דווחה למנהלת המערכת.");
                setCourses([]);
                setEvents([]);
                setFilteredCourses([]);
                setFilteredEvents([]);
                setCurrentUser(null);
                setUserEnrollments([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadPageData();
    }, []);

    useEffect(() => {
        let filtered = courses;
        
        if (searchTerm) {
            filtered = filtered.filter(c => 
                c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.instructor.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(c => c.category === selectedCategory);
        }
        
        if (selectedLevel !== 'all') {
            filtered = filtered.filter(c => c.level === selectedLevel);
        }
        
        if (selectedActivityType !== 'all') {
            filtered = filtered.filter(c => c.course_type === selectedActivityType);
        }
        
        if (activeTab !== 'all') {
            if (activeTab === 'courses') {
                filtered = filtered.filter(c => !c.course_type || c.course_type === 'קורס');
            } else if (activeTab === 'workshops') {
                filtered = filtered.filter(c => c.course_type === 'סדנא');
            } else if (activeTab === 'trips') {
                filtered = filtered.filter(c => c.course_type === 'טיול');
            }
        }
        
        setFilteredCourses(filtered);
    }, [searchTerm, selectedCategory, selectedLevel, selectedActivityType, activeTab, courses]);

    useEffect(() => {
        const filtered = eventTypeFilter === "all" 
            ? events 
            : events.filter(event => event.type === eventTypeFilter);
        setFilteredEvents(filtered);
    }, [eventTypeFilter, events]);

    const handleEnrollInCourse = async (course) => {
        if (!currentUser) {
            alert("יש להתחבר כדי להירשם לפעילות");
            User.login();
            return;
        }

        const alreadyEnrolled = userEnrollments.find(e => e.course_id === course.id);
        if (alreadyEnrolled) {
            alert("את כבר רשומה לפעילות הזו!");
            return;
        }

        try {
            const enrollmentData = {
                course_id: course.id,
                course_title: course.title,
                student_email: currentUser.email,
                student_name: currentUser.full_name || currentUser.email,
                enrollment_date: new Date().toISOString()
            };

            await CourseEnrollment.create(enrollmentData);
            setUserEnrollments(prev => [...prev, enrollmentData]);
            
            try {
                const response = await fetch('/api/sendCourseEnrollmentEmail', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        courseTitle: course.title,
                        instructorName: course.instructor,
                        instructorEmail: course.instructor_email || 'restart@rse50.co.il',
                        studentName: currentUser.full_name || currentUser.email,
                        studentEmail: currentUser.email
                    })
                });
                
                if (!response.ok) {
                    console.warn("Failed to send enrollment email to instructor");
                }
            } catch (emailError) {
                console.warn("Error sending enrollment email:", emailError);
            }
            
            const activityType = course.course_type || 'קורס';
            alert(`נרשמת בהצלחה ל${activityType} "${course.title}"! 🎉`);
        } catch (error) {
            console.error("Error enrolling in course:", error);
            alert("אירעה שגיאה בהרשמה לפעילות. אנא נסי שוב.");
        }
    };

    const isEnrolledInCourse = (courseId) => {
        return userEnrollments.some(e => e.course_id === courseId);
    };

    const getCategoryColor = (category) => {
        const colors = {
            "קריירה": "bg-blue-100 text-blue-800",
            "טכנולוגיה": "bg-purple-100 text-purple-800", 
            "חברתי": "bg-green-100 text-green-800",
            "אישי": "bg-orange-100 text-orange-800",
            "טיולים ונופש": "bg-teal-100 text-teal-800",
            "יזמות ועסקים": "bg-pink-100 text-pink-800"
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
    
    const getActivityTypeColor = (type) => {
        const colors = {
            "קורס": "bg-blue-100 text-blue-800",
            "סדנא": "bg-amber-100 text-amber-800",
            "טיול": "bg-teal-100 text-teal-800"
        };
        return colors[type] || "bg-gray-100 text-gray-800";
    };
    
    const getActivityTypeIcon = (type) => {
        switch(type) {
            case 'קורס': return <BookOpen className="w-4 h-4" />;
            case 'סדנא': return <Star className="w-4 h-4" />;
            case 'טיול': return <MapPin className="w-4 h-4" />;
            default: return <BookOpen className="w-4 h-4" />;
        }
    };
    
    const getEventTypeColor = (type) => {
        const colors = {
            "מפגש": "bg-blue-100 text-blue-800",
            "הרצאה": "bg-purple-100 text-purple-800",
            "טיול": "bg-green-100 text-green-800",
            "התנדבות": "bg-orange-100 text-orange-800",
            "יום כיף": "bg-pink-100 text-pink-800"
        };
        return colors[type] || "bg-gray-100 text-gray-800";
    };

    const isUpcoming = (eventDate) => {
        return new Date(eventDate) >= new Date();
    };

    return (
        <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    {/* Circular Image with White Border */}
                    <div className="flex justify-center mb-6">
                        <div className="relative w-32 h-32 md:w-40 md:h-40">
                            <div className="w-full h-full rounded-full border-4 border-white shadow-xl overflow-hidden">
                                <img 
                                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/2886812bd_45.jpg" 
                                    alt="קהילת נשים" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        קורסים, סדנאות, טיולים ו<span className="gradient-text">חוויות משותפות</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        המרחב שלך להתפתחות אישית ומקצועית, לצד פעילויות ואירועים שמחברים בין כולנו.
                    </p>
                </div>

                {/* Call to Action - Moved to Top and Made Smaller */}
                <div className="mb-8">
                    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 shadow-md overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                                        <Mic className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                
                                <div className="flex-1 text-center md:text-right">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                                        מרצה? מנחת סדנאות? מארגנת טיולים?
                                    </h3>
                                    <p className="text-sm md:text-base text-gray-700 mb-3">
                                        הצטרפי אלינו והציעי את הפעילות שלך - קורס, סדנא או טיול! אנחנו נדאג לקהל, את תדאגי לתוכן המדהים.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                                        <Button asChild size="sm" className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full shadow-md px-6 py-2">
                                            <Link to={createPageUrl("BecomeInstructor")}>
                                                <Mic className="w-4 h-4 ml-2" />
                                                הציעי קורס, סדנא או טיול
                                            </Link>
                                        </Button>
                                        <Button asChild size="sm" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 rounded-full px-6 py-2">
                                            <Link to={createPageUrl("Faq")}>
                                                למידע נוסף
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                <PremiumContentWrapper
                    title="קורסים, סדנאות וטיולים לחברות הקהילה"
                    message="הגישה המלאה לכל הפעילויות והרשמה מיועדת לחברות הקהילה שלנו."
                >
                    <div className="flex justify-center mb-10">
                        <div className="bg-white p-2 rounded-full shadow-md flex flex-wrap gap-2">
                            <Button 
                                onClick={() => setActiveTab('all')}
                                variant={activeTab === 'all' ? 'default' : 'ghost'}
                                className={`px-4 sm:px-6 py-2 rounded-full text-sm ${activeTab === 'all' ? 'bg-rose-500 hover:bg-rose-600' : ''}`}
                            >
                                <Sparkles className="ml-2 w-4 h-4" />
                                הכל
                            </Button>
                            <Button 
                                onClick={() => setActiveTab('courses')}
                                variant={activeTab === 'courses' ? 'default' : 'ghost'}
                                className={`px-4 sm:px-6 py-2 rounded-full text-sm ${activeTab === 'courses' ? 'bg-rose-500 hover:bg-rose-600' : ''}`}
                            >
                                <BookOpen className="ml-2 w-4 h-4" />
                                קורסים
                            </Button>
                            <Button 
                                onClick={() => setActiveTab('workshops')}
                                variant={activeTab === 'workshops' ? 'default' : 'ghost'}
                                className={`px-4 sm:px-6 py-2 rounded-full text-sm ${activeTab === 'workshops' ? 'bg-rose-500 hover:bg-rose-600' : ''}`}
                            >
                                <Star className="ml-2 w-4 h-4" />
                                סדנאות
                            </Button>
                            <Button 
                                onClick={() => setActiveTab('trips')}
                                variant={activeTab === 'trips' ? 'default' : 'ghost'}
                                className={`px-4 sm:px-6 py-2 rounded-full text-sm ${activeTab === 'trips' ? 'bg-rose-500 hover:bg-rose-600' : ''}`}
                            >
                                <MapPin className="ml-2 w-4 h-4" />
                                טיולים
                            </Button>
                            <Button 
                                onClick={() => setActiveTab('events')}
                                variant={activeTab === 'events' ? 'default' : 'ghost'}
                                className={`px-4 sm:px-6 py-2 rounded-full text-sm ${activeTab === 'events' ? 'bg-rose-500 hover:bg-rose-600' : ''}`}
                            >
                                <Calendar className="ml-2 w-4 h-4" />
                                אירועים
                            </Button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                        </div>
                    ) : error ? (
                        <Card className="bg-red-50 border-red-300 shadow-lg text-center p-6 flex flex-col items-center">
                            <CardHeader className="p-0 mb-4">
                                <CardTitle className="text-red-800 flex items-center justify-center gap-3 text-2xl font-semibold">
                                    <AlertTriangle className="w-8 h-8" />
                                    שגיאה בטעינת הנתונים
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <p className="text-red-700 text-lg mb-6">{error}</p>
                                <Button 
                                    onClick={() => window.location.reload()} 
                                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg"
                                >
                                    נסה שוב
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div>
                            {activeTab !== 'events' && (
                                <div>
                                    <div className="bg-white p-4 rounded-xl shadow-md mb-8 flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-2 flex-grow">
                                            <Search className="w-5 h-5 text-gray-400" />
                                            <Input 
                                                placeholder="חפשי לפי שם, נושא או מרצה..." 
                                                className="border-0 focus-visible:ring-0 shadow-none"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="סינון לפי קטגוריה" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">כל הקטגוריות</SelectItem>
                                                    <SelectItem value="קריירה">קריירה</SelectItem>
                                                    <SelectItem value="טכנולוגיה">טכנולוגיה</SelectItem>
                                                    <SelectItem value="חברתי">חברתי</SelectItem>
                                                    <SelectItem value="אישי">אישי</SelectItem>
                                                    <SelectItem value="טיולים ונופש">טיולים ונופש</SelectItem>
                                                    <SelectItem value="יזמות ועסקים">יזמות ועסקים</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="סינון לפי רמה" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">כל הרמות</SelectItem>
                                                    <SelectItem value="מתחילות">מתחילות</SelectItem>
                                                    <SelectItem value="מתקדמות">מתקדמות</SelectItem>
                                                    <SelectItem value="לכולן">לכולן</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {filteredCourses.map(course => (
                                            <Card key={course.id} className="card-hover border-0 shadow-xl bg-white flex flex-col">
                                                {course.image_url && (
                                                    <img src={course.image_url} alt={course.title} className="w-full h-48 object-cover rounded-t-lg" />
                                                )}
                                                <CardHeader>
                                                    <CardTitle className="text-xl font-bold">{course.title}</CardTitle>
                                                    <div className="flex gap-2 pt-2 flex-wrap">
                                                        {course.course_type && (
                                                            <Badge className={getActivityTypeColor(course.course_type)}>
                                                                {getActivityTypeIcon(course.course_type)}
                                                                <span className="mr-1">{course.course_type}</span>
                                                            </Badge>
                                                        )}
                                                        <Badge className={getCategoryColor(course.category)}>{course.category}</Badge>
                                                        <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="flex-grow">
                                                    <p className="text-gray-600 mb-4">{course.description}</p>
                                                    <div className="text-sm text-gray-500 space-y-2">
                                                        <div className="flex items-center"><UserIcon className="ml-2 w-4 h-4 text-rose-500" /> מרצה: {course.instructor}</div>
                                                        {course.duration && <div className="flex items-center"><Clock className="ml-2 w-4 h-4 text-rose-500" /> משך: {course.duration}</div>}
                                                        <div className="flex items-center"><Star className="ml-2 w-4 h-4 text-rose-500" /> מחיר: {course.price > 0 ? `${course.price} ₪` : 'חינם'}</div>
                                                        {course.course_type === 'טיול' && course.meeting_point && (
                                                            <div className="flex items-center"><MapPin className="ml-2 w-4 h-4 text-rose-500" /> נקודת מפגש: {course.meeting_point}</div>
                                                        )}
                                                        {course.max_participants && (
                                                            <div className="flex items-center"><Users className="ml-2 w-4 h-4 text-rose-500" /> מקסימום: {course.max_participants} משתתפות</div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                                <div className="p-4 pt-0">
                                                    {currentUser ? (
                                                        isEnrolledInCourse(course.id) ? (
                                                            <Button disabled className="w-full bg-green-600 hover:bg-green-600 text-white">
                                                                <CheckCircle className="w-4 h-4 ml-2" />
                                                                רשומה ✓
                                                            </Button>
                                                        ) : (
                                                            <Button 
                                                                onClick={() => handleEnrollInCourse(course)}
                                                                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
                                                            >
                                                                הרשמה
                                                            </Button>
                                                        )
                                                    ) : (
                                                        <Button 
                                                            onClick={() => User.login()}
                                                            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
                                                        >
                                                            התחברי להרשמה
                                                        </Button>
                                                    )}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                    {filteredCourses.length === 0 && !isLoading && (
                                        <div className="text-center py-16">
                                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500 text-lg">לא נמצאו פעילויות בקטגוריה זו</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'events' && (
                                <div>
                                    <div className="bg-white p-4 rounded-xl shadow-md mb-8 flex items-center gap-4">
                                        <Filter className="w-5 h-5 text-gray-500" />
                                        <h3 className="font-semibold">סינון אירועים:</h3>
                                        <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                                            <SelectTrigger className="w-[220px]">
                                                <SelectValue placeholder="בחרי סוג אירוע..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">כל האירועים</SelectItem>
                                                <SelectItem value="מפגש">מפגש</SelectItem>
                                                <SelectItem value="הרצאה">הרצאה</SelectItem>
                                                <SelectItem value="טיול">טיול</SelectItem>
                                                <SelectItem value="התנדבות">התנדבות</SelectItem>
                                                <SelectItem value="יום כיף">יום כיף</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-6">
                                        {filteredEvents.map(event => (
                                            <Card key={event.id} className={`card-hover border-0 shadow-lg bg-white overflow-hidden ${!isUpcoming(event.date) ? 'opacity-60' : ''}`}>
                                                <div className="flex flex-col md:flex-row">
                                                    {event.image_url && (
                                                        <div className="w-full md:w-1/3 h-48 md:h-auto bg-gray-200">
                                                            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 p-6">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <CardTitle className="text-xl font-bold text-gray-900">{event.title}</CardTitle>
                                                            <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                                                        </div>
                                                        <p className="text-gray-600 mb-4">{event.description}</p>
                                                        <div className="text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            <div className="flex items-center"><Calendar className="ml-2 w-4 h-4 text-purple-500" /> {format(new Date(event.date), 'eeee, d MMMM yyyy', { locale: he })}</div>
                                                            <div className="flex items-center"><Clock className="ml-2 w-4 h-4 text-purple-500" /> {event.time}</div>
                                                            <div className="flex items-center"><MapPin className="ml-2 w-4 h-4 text-purple-500" /> {event.location}</div>
                                                            <div className="flex items-center"><Users className="ml-2 w-4 h-4 text-purple-500" /> {event.price > 0 ? `${event.price} ₪` : 'חינם'}</div>
                                                        </div>
                                                        <div className="mt-6">
                                                            <Button disabled={!isUpcoming(event.date)} className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
                                                                {isUpcoming(event.date) ? 'פרטים והרשמה' : 'האירוע הסתיים'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                    {filteredEvents.length === 0 && !isLoading && (
                                        <div className="text-center py-16">
                                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500 text-lg">לא נמצאו אירועים בקטגוריה זו</p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    )}
                </PremiumContentWrapper>

                <div className="flex justify-center mt-12 mb-8">
                    <Button asChild variant="outline" size="lg" className="border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700 shadow-md">
                        <Link to={createPageUrl('MyProfile')}>
                            <Heart className="w-4 h-4 ml-2" />
                            חזרה למקום שלי
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
