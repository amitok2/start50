
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, MapPin, Star, Calendar, Heart, Mail, Phone, Search, User, AlertTriangle, RefreshCcw, MessageSquare, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { MentorProfile } from '@/api/entities';
import { useUser } from '../components/auth/UserContext';
import MentorFilters from '../components/mentors/MentorFilters';
import MentorCard from '../components/mentors/MentorCard';

export default function CoachesAndConsultants() {
  const { currentUser, isSubscribed, isLoadingUser } = useUser();
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ specialty: 'all', searchTerm: '' }); // Removed location from initial state

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Attempting to load MentorProfile data...');
      const mentorData = await MentorProfile.list('-created_date');
      console.log(`✅ Successfully loaded ${mentorData.length} mentor profiles`);
      
      setMentors(mentorData);
    } catch (error) {
      console.error("❌ Failed to load mentors:", error);
      
      if (error.message.includes("Cannot read properties of undefined") || 
          error.message.includes("MentorProfile") ||
          error.message.includes("Module not found")) {
        setError("הישות MentorProfile עדיין לא הוגדרה במערכת. זה נורמלי לאחר עדכונים חדשים - המערכת צריכה זמן לסנכרון.");
      } else {
        setError(`שגיאה טכנית: ${error.message}`);
      }
      
      setMentors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMentors = mentors.filter(mentor => {
    const searchTermLower = filters.searchTerm?.toLowerCase() || '';
    const specialtyMatch = filters.specialty === 'all' || mentor.specialty === filters.specialty;
    // Removed locationMatch condition

    const textSearchMatch = searchTermLower === '' ||
      (mentor.mentor_name && mentor.mentor_name.toLowerCase().includes(searchTermLower)) ||
      (mentor.specialty && mentor.specialty.toLowerCase().includes(searchTermLower)) ||
      (mentor.description && mentor.description.toLowerCase().includes(searchTermLower)) ||
      (Array.isArray(mentor.focus_areas) && mentor.focus_areas.some(area => area && area.toLowerCase().includes(searchTermLower)));

    const isNotCurrentUser = !currentUser || !currentUser.email || mentor.contact_email !== currentUser.email;

    return specialtyMatch && textSearchMatch && isNotCurrentUser; // Removed locationMatch from return
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-amber-800 mb-4">המערכת בתהליך עדכון</h2>
              <p className="text-amber-700 mb-6 leading-relaxed">
                {error.includes("MentorProfile עדיין לא הוגדרה") ? (
                  <>
                    חלק מהישויות החדשות עדיין בתהליך סנכרון במסד הנתונים של Base44. 
                    זה תהליך אוטומטי שלוקח בדרך כלל כמה דקות.
                  </>
                ) : (
                  <>אירעה שגיאה בטעינת נתוני המאמנות: {error}</>
                )}
              </p>
              
              <div className="bg-white p-4 rounded-lg border border-amber-200 mb-6">
                <h3 className="font-semibold text-amber-800 mb-2">מה לעשות?</h3>
                <ul className="text-amber-700 text-sm space-y-1">
                  <li>• המתיני כמה דקות ורענני את הדף</li>
                  <li>• אם השגיאה נמשכת, צרי קשר עם התמיכה הטכנית</li>
                </ul>
              </div>
              
              <Button onClick={loadMentors} variant="outline" className="border-amber-300">
                <RefreshCcw className="w-4 h-4 ml-2" />
                נסה שוב
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          {/* Image Circle */}
          <div className="w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/389eb1e63_.jpg"
              alt="Mentor ReStart 50+"
              className="w-full h-full object-cover"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            מצאו את <span className="gradient-text">המנטורית</span> שתקפיץ אתכם קדימה!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            צוות המומחיות שלנו כאן כדי ללוות אותך בדרך להגשמה אישית ומקצועית, עם ידע עמוק וניסיון עשיר בתחומים מגוונים.
          </p>
        </header>

        {/* How It Works Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              איך זה עובד? <span className="gradient-text">שלושה צעדים פשוטים</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <Card className="relative bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute -top-4 right-6 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                1
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-center text-xl text-purple-800">
                  בחרי מנטורית
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-center leading-relaxed">
                  דפדפי בפרופילים, סנני לפי התמחות וניסיון, ומצאי את הליווי המושלם עבורך.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="relative bg-gradient-to-br from-pink-50 to-orange-50 border-pink-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute -top-4 right-6 w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                2
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-center text-xl text-pink-800">
                  תאמי שיחת היכרות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-center leading-relaxed">
                  שלחי בקשה קצרה דרך הפרופיל, והמנטורית תיצור איתך קשר לתיאום פגישה ראשונה.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="relative bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute -top-4 right-6 w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                3
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-center text-xl text-orange-800">
                  התחילי לצמוח
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-center leading-relaxed">
                  התחילי משיחת היכרות חינמית (30 דק'), והמשיכי לפגישות מותאמות אישית למטרותייך.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-full border-2 border-green-300">
              <Sparkles className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">שיחת ההיכרות הראשונה תמיד חינם! 🎁</span>
            </div>
            
            <div>
              <Button 
                onClick={() => {
                  const filtersSection = document.querySelector('#mentor-filters');
                  if (filtersSection) {
                    filtersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-6 text-lg shadow-lg"
              >
                <Sparkles className="w-5 h-5 ml-2" />
                מצאו את המנטורית שלי עכשיו!
              </Button>
            </div>
          </div>
        </div>

        <div id="mentor-filters">
          <MentorFilters onFilterChange={setFilters} allMentors={mentors} />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-16 h-16 animate-spin text-purple-500 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">טוענות את המומחיות המדהימות שלנו...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center mt-10">
              <p className="text-gray-600">
                נמצאו <span className="font-bold text-purple-600">{filteredMentors.length}</span> מומחיות מתאימות
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMentors.map((mentor) => (
                <MentorCard 
                  key={mentor.id} 
                  mentor={mentor} 
                />
              ))}
            </div>

            {filteredMentors.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">לא נמצאו מנטוריות התואמות את החיפוש</p>
              </div>
            )}
          </>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                רוצה להצטרף לצוות המומחיות שלנו?
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                יש לך ניסיון וידע שאת רוצה לשתף? הצטרפי לצוות המומחיות המקצועיות שלנו והשפיעי על חיים של נשים נוספות.
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Link to={createPageUrl("BecomeMentor")}>
                  <Star className="w-5 h-5 ml-2" />
                  הצטרפי כמומחית
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Back to My Profile Button */}
      <div className="flex justify-center mt-12 mb-8">
        <Button asChild variant="outline" size="lg" className="border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700 shadow-md">
          <Link to={createPageUrl('MyProfile')}>
            <Heart className="w-4 h-4 ml-2" />
            חזרה למקום שלי
          </Link>
        </Button>
      </div>
    </div>
  );
}
