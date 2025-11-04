
import React, { useState, useEffect } from 'react';
import { MentorProfile } from '@/api/entities';
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, User as UserIcon, Mail, Phone, MapPin, Sparkles, BookOpen, Quote, Calendar, Star, Edit, MessageSquare, Info, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function CoachProfile() {
  const [searchParams] = useSearchParams();
  const [mentor, setMentor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null); // Changed from currentUser to user

  useEffect(() => {
    const fetchMentorAndUser = async () => {
      const mentorId = searchParams.get('id');
      if (!mentorId) {
        setIsLoading(false);
        return;
      }
      try {
        const mentorData = await MentorProfile.get(mentorId);
        setMentor(mentorData);
      } catch (error) {
        console.error("Error fetching mentor profile:", error);
      }

      try {
        const userData = await User.me();
        setUser(userData); // Changed from setCurrentUser to setUser
      } catch (error) {
        console.log("User not logged in");
      }

      setIsLoading(false);
    };

    fetchMentorAndUser();
  }, [searchParams]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="w-12 h-12 text-purple-500 animate-spin" /></div>;
  }

  if (!mentor) {
    return <div className="text-center py-20">לא נמצא פרופיל עבור המאמנת המבוקשת.</div>;
  }

  const isOwner = user && user.email === mentor.contact_email; // Changed from currentUser to user

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <div className="max-w-4xl mx-auto p-4 md:p-8">

        {isOwner && (
          <Alert className="mb-8 bg-yellow-100 border-yellow-300 text-yellow-800">
            <Info className="h-4 w-4 !text-yellow-800" />
            <AlertTitle className="font-bold">זוהי תצוגה מקדימה</AlertTitle>
            <AlertDescription>
              כך הפרופיל שלך נראה למשתמשות אחרות. כדי לערוך את הפרופיל, 
              <Link to={createPageUrl('EditMentorProfile')} className="font-semibold underline hover:text-yellow-900"> לחצי כאן</Link>.
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img 
                src={mentor.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.mentor_name)}&background=EC4899&color=fff`} 
                alt={mentor.mentor_name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-4xl font-bold text-gray-900">{mentor.mentor_name}</h1>
              <p className="text-xl text-pink-600 font-medium">{mentor.specialty}</p>
            </div>
          </div>
          
          {/* Body */}
          <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-pink-200 pb-2 mb-4">קצת עליי</h2>
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{mentor.bio}</p>
              </div>

              {mentor.focus_areas && mentor.focus_areas.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-pink-200 pb-2 mb-4">תחומי מיקוד</h2>
                  <div className="flex flex-wrap gap-2">
                    {mentor.focus_areas.map((area, index) => (
                      <Badge key={index} variant="outline" className="bg-pink-50 text-pink-700 border-pink-200 text-sm px-3 py-1">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {mentor.recommendations && mentor.recommendations.length > 0 && (
                 <div>
                    <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-pink-200 pb-2 mb-4">המלצות</h2>
                    <div className="space-y-4">
                      {mentor.recommendations.map((rec, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-pink-400">
                          <p className="italic text-gray-700 mb-2">"{rec.text}"</p>
                          <p className="text-right font-semibold text-sm text-gray-900">- {rec.author}</p>
                        </div>
                      ))}
                    </div>
                </div>
              )}

            </div>
            
            <aside className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Info className="text-pink-500" />
                    פרטים נוספים
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-pink-500" />
                    <span>{mentor.location || 'פגישות אונליין'}</span>
                  </div>
                  {mentor.contact_email && (
                     <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-pink-500" />
                        <a href={`mailto:${mentor.contact_email}`} className="hover:underline">{mentor.contact_email}</a>
                     </div>
                  )}
                  {mentor.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-pink-500" />
                      <a href={`tel:${mentor.phone}`} className="hover:underline">{mentor.phone}</a>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-purple-800">
                    <Calendar className="text-purple-600" />
                    קבעי פגישת היכרות
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-700 mb-4 text-center">
                    רוצה להתייעץ עם {mentor.mentor_name.split(' ')[0]}? לחצי על הכפתור ותעברי לדף תיאום פגישת היכרות אישית.
                  </p>
                  <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                    <Link to={createPageUrl(`Booking?mentorEmail=${mentor.contact_email}&mentorName=${mentor.mentor_name}&mentorId=${mentor.id}`)}>
                      <MessageSquare className="w-4 h-4 ml-2" />
                      תיאום פגישה
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </Card>
      </div>
    </div>
  );
}
