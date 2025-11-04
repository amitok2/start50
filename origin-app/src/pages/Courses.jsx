
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Course } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, User as UserIcon, Star, Filter, Search, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    loadCourses();
    checkUserSubscription();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedCategory, selectedLevel]);

  const checkUserSubscription = async () => {
    try {
      const currentUser = await User.me();
      if (currentUser && currentUser.subscription_status === 'active' && new Date(currentUser.subscription_end_date) > new Date()) {
        setIsSubscribed(true);
      }
    } catch (e) {
      // User not logged in or error fetching user, assume not subscribed
      setIsSubscribed(false);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const loadCourses = async () => {
    const data = await Course.list("-created_date");
    setCourses(data);
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.includes(searchTerm) || 
        course.description.includes(searchTerm) ||
        course.instructor.includes(searchTerm)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    if (selectedLevel !== "all") {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    setFilteredCourses(filtered);
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="gradient-text">קורסים והכשרות</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            קורסים ייחודיים המותאמים לנשים בגיל 50 ומעלה - מעשיים, מעצימים ומותאמים לקצב שלך
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">סינון קורסים</h3>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="חיפוש קורסים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="קטגוריה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הקטגוריות</SelectItem>
                <SelectItem value="קריירה">קריירה</SelectItem>
                <SelectItem value="טכנולוגיה">טכנולוגיה</SelectItem>
                <SelectItem value="חברתי">חברתי</SelectItem>
                <SelectItem value="אישי">אישי</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="רמה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הרמות</SelectItem>
                <SelectItem value="מתחילות">מתחילות</SelectItem>
                <SelectItem value="מתקדמות">מתקדמות</SelectItem>
                <SelectItem value="לכולן">לכולן</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedLevel("all");
              }}
              className="border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              איפוס סינון
            </Button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="card-hover border-0 shadow-lg overflow-hidden bg-white flex flex-col">
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
              
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
                    {course.title}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">4.8</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mb-3">
                  {course.level && (
                    <Badge variant="outline" className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0 flex-grow flex flex-col">
                <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                  {course.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <UserIcon className="w-4 h-4 text-rose-500" />
                    <span>{course.instructor}</span>
                  </div>
                  
                  {course.duration && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-rose-500" />
                      <span>{course.duration}</span>
                    </div>
                  )}

                  {course.start_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4 text-rose-500" />
                      <span>מתחיל: {new Date(course.start_date).toLocaleDateString('he-IL')}</span>
                    </div>
                  )}
                </div>

                {course.highlights && course.highlights.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">מה תלמדי:</h4>
                    <ul className="space-y-1">
                      {course.highlights.slice(0, 3).map((highlight, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-between items-center mt-auto pt-4">
                  <div className="text-left">
                    {course.price && course.price > 0 ? (
                      <span className="text-2xl font-bold text-gray-900">₪{course.price}</span>
                    ) : (
                      <span className="text-2xl font-bold text-green-600">חינם</span>
                    )}
                  </div>
                  {isLoadingUser ? (
                     <Button disabled className="bg-gray-200 rounded-full px-6">טוען...</Button>
                  ) : isSubscribed ? (
                    <Button disabled className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full px-6">
                      <CheckCircle className="w-4 h-4 ml-2" />
                      כלול במנוי שלך
                    </Button>
                  ) : (
                    <Button asChild className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-full px-6">
                      <Link to={createPageUrl("Subscribe")}>הרשמה לקורס</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">לא נמצאו קורסים</h3>
            <p className="text-gray-500">נסי לשנות את הסינון או לחפש משהו אחר</p>
          </div>
        )}
      </div>
    </div>
  );
}
