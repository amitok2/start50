
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '../components/auth/UserContext';
import { MentorProfile } from '@/api/entities';
import { User } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Plus, Trash2, ImagePlus, User as UserIcon, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const specialtyOptions = [
  "קריירה ופיתוח מקצועי",
  "ייעוץ עסקי ופיננסי",
  "אימון להעצמה אישית וביטחון עצמי",
  "פיתוח מיומנויות טכנולוגיות",
  "אורח חיים בריא ותזונה",
  "הכנה לפרישה ופרק ב׳ בחיים",
  "יזמות נשית והגשמה עסקית",
  "מערכות יחסים וזוגיות",
  "פיתוח מנהיגות נשית",
  "ניהול זמן ופרודוקטיביות"
];

export default function EditMentorProfile() {
  const { currentUser } = useUser();
  const [mentorProfile, setMentorProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();

  const imageInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchMentorProfile = useCallback(async () => {
    if (!currentUser || !currentUser.email) {
      setError("משתמשת לא מחוברת או שאין אימייל.");
      setIsLoading(false);
      return;
    }
    
    if (!currentUser.is_approved_mentor) {
      setError("רק מנטוריות מאושרות יכולות לערוך את הפרופיל.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');
    setDebugInfo(`מתחיל בדיקה עבור: ${currentUser.email}`);

    try {
      console.log(`🔍 Fetching MentorProfile for email: ${currentUser.email}`);
      const profiles = await MentorProfile.filter({ contact_email: currentUser.email });
      
      console.log(`✅ Found ${profiles.length} profiles.`);
      setDebugInfo(`נמצאו ${profiles.length} פרופילים.`);

      if (profiles.length > 0) {
        setMentorProfile(profiles[0]);
        setImagePreview(profiles[0].image_url || '');
        setDebugInfo(`פרופיל קיים נטען בהצלחה.`);
      } else {
        console.log(`🤷‍♀️ No profile found. Creating a new one for approved mentor.`);
        setDebugInfo(`לא נמצא פרופיל. יוצר פרופיל חדש...`);
        
        const newProfileData = {
          mentor_name: currentUser.full_name || 'מנטורית חדשה',
          contact_email: currentUser.email,
          specialty: specialtyOptions[0], // Default specialty from options
          description: 'מנטורית מנוסה המתמחה בהעצמה וליווי נשים.',
          bio: 'רקע מקצועי עשיר ומומחיות בתחום.',
          meeting_availability: ['זום'], // Default availability for new profiles
          focus_areas: [], // Initialize as an empty array
        };
        
        const createdRecord = await MentorProfile.create(newProfileData);
        setMentorProfile(createdRecord);
        setImagePreview(createdRecord.image_url || '');
        setDebugInfo(`פרופיל חדש נוצר בהצלחה!`);
        console.log(`👍 Successfully created new mentor profile:`, createdRecord);
      }
    } catch (err) {
      console.error("❌ Error in fetchMentorProfile:", err);
      setError(`שגיאה בטעינת או יצירת הפרופיל: ${err.message}`);
      setDebugInfo(`שגיאה קריטית: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchMentorProfile();
    }
  }, [currentUser, fetchMentorProfile]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setMentorProfile(prev => ({ ...prev, [id]: value }));
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRecommendationChange = (index, field, value) => {
    const newRecommendations = [...(mentorProfile.recommendations || [])];
    newRecommendations[index] = {
        ...newRecommendations[index],
        [field]: value
    };
    setMentorProfile(prev => ({ ...prev, recommendations: newRecommendations }));
  };

  const addRecommendation = () => {
    setMentorProfile(prev => ({
      ...prev,
      recommendations: [...(prev.recommendations || []), { author: '', text: '' }]
    }));
  };

  const removeRecommendation = (index) => {
    const newRecommendations = (mentorProfile.recommendations || []).filter((_, i) => i !== index);
    setMentorProfile(prev => ({ ...prev, recommendations: newRecommendations }));
  };

  const handleFocusAreasChange = (newAreas) => {
    setMentorProfile(prev => ({ ...prev, focus_areas: newAreas }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mentorProfile) return;

    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      let updatedData = { ...mentorProfile };

      if (imageFile) {
        const uploadResult = await UploadFile({ file: imageFile });
        updatedData.image_url = uploadResult.file_url;
      }
      
      // Ensure focus_areas is an array before sending to the backend
      if (!Array.isArray(updatedData.focus_areas)) {
        updatedData.focus_areas = [];
      }

      const { id, created_date, updated_date, created_by, ...cleanUpdateData } = updatedData;
      
      await MentorProfile.update(id, cleanUpdateData);
      setSuccessMessage('הפרופיל עודכן בהצלחה!');
      setTimeout(() => navigate('/mentor-dashboard'), 2000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(`שגיאה בעדכון הפרופיל: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">טוען את הפרופיל שלך...</p>
        </div>
      </div>
    );
  }

  if (error && !mentorProfile) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
              <Alert variant="destructive" className="max-w-lg">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>שגיאה קריטית</AlertTitle>
                  <AlertDescription>
                      <p>{error}</p>
                      <p className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded">
                          <strong>מידע למפתחים:</strong> {debugInfo}
                      </p>
                      <Button onClick={fetchMentorProfile} disabled={isLoading} className="mt-4">
                         {isLoading ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : null}
                         נסה/י שוב
                      </Button>
                      <Button variant="outline" onClick={() => navigate('/mentor-dashboard')} className="mt-4 mr-2">
                        חזרה ללוח הבקרה
                      </Button>
                  </AlertDescription>
              </Alert>
          </div>
      );
  }

  if (!mentorProfile) {
    return <div className="text-center py-20">לא ניתן לטעון את הפרופיל. נסו לרענן את הדף.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">עריכת פרופיל המנטורית</CardTitle>
            <CardDescription>
              עדכני את פרטי הפרופיל שיוצגו למשתמשות האתר.
              <p className="font-mono text-xs text-gray-400 mt-2">ID: {mentorProfile.id}</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="flex flex-col items-center gap-4">
                <Label>תמונת פרופיל</Label>
                <div 
                  className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden"
                  onClick={() => imageInputRef.current.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
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
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="mentor_name">שם</Label>
                  <Input id="mentor_name" value={mentorProfile.mentor_name || ''} onChange={handleChange} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="specialty">התמחות ראשית</Label>
                  <Select
                    value={mentorProfile.specialty || ''}
                    onValueChange={(value) => setMentorProfile(prev => ({ ...prev, specialty: value }))}
                  >
                    <SelectTrigger id="specialty">
                        <SelectValue placeholder="בחרי התמחות ראשית..." />
                    </SelectTrigger>
                    <SelectContent>
                        {specialtyOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="contact_email">אימייל ליצירת קשר</Label>
                  <Input id="contact_email" type="email" value={mentorProfile.contact_email || ''} onChange={handleChange} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">טלפון</Label>
                  <Input id="phone" value={mentorProfile.phone || ''} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="location">מיקום</Label>
                <Input id="location" value={mentorProfile.location || ''} onChange={handleChange} placeholder="לדוגמה: תל אביב, פגישות אונליין"/>
              </div>

              <div className="space-y-1">
                <Label htmlFor="description">תיאור קצר על הליווי (עד 250 תווים)</Label>
                <Textarea id="description" value={mentorProfile.description || ''} onChange={handleChange} rows={2} maxLength="250" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="bio">קצת עליי (רקע מקצועי, ניסיון)</Label>
                <Textarea id="bio" value={mentorProfile.bio || ''} onChange={handleChange} rows={5} />
              </div>
              
              <div className="space-y-1">
                <Label>תחומי התמחות נוספים</Label>
                <Select
                  value="" // Set to empty string to ensure placeholder is always visible after selection
                  onValueChange={(value) => {
                      if (mentorProfile && !(mentorProfile.focus_areas || []).includes(value)) {
                          handleFocusAreasChange([...(mentorProfile.focus_areas || []), value]);
                      }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="הוסיפי תחומי התמחות..." />
                  </SelectTrigger>
                  <SelectContent>
                    {specialtyOptions
                      .filter(opt => 
                        opt !== mentorProfile.specialty && 
                        !(mentorProfile.focus_areas || []).includes(opt)
                      )
                      .map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(mentorProfile.focus_areas || []).map((area, index) => (
                    <div key={index} className="flex items-center gap-1 bg-purple-100 text-purple-800 text-sm rounded-full px-3 py-1">
                      {area}
                      <button
                        type="button"
                        onClick={() => handleFocusAreasChange(mentorProfile.focus_areas.filter(a => a !== area))}
                        className="text-purple-600 hover:text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-full p-0.5"
                        aria-label={`הסר ${area}`}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="meeting_availability">זמינות לפגישות</Label>
                <Select
                  value={
                    mentorProfile.meeting_availability && mentorProfile.meeting_availability.includes('זום') && mentorProfile.meeting_availability.includes('פרונטלי')
                      ? 'משולב'
                      : (mentorProfile.meeting_availability && mentorProfile.meeting_availability.includes('זום'))
                        ? 'זום'
                        : (mentorProfile.meeting_availability && mentorProfile.meeting_availability.includes('פרונטלי'))
                          ? 'פרונטלי'
                          : '' // Changed to empty string for consistent placeholder behavior
                  }
                  onValueChange={(value) => setMentorProfile(prev => ({ 
                    ...prev, 
                    meeting_availability: value === 'משולב' ? ['זום', 'פרונטלי'] : [value] 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחרי סוג פגישות" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="זום">זום בלבד</SelectItem>
                    <SelectItem value="פרונטלי">פרונטלי בלבד</SelectItem>
                    <SelectItem value="משולב">זום + פרונטלי</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 rounded-lg border bg-gray-50 p-4">
                  <Label className="text-lg font-semibold text-gray-800">המלצות</Label>
                  {(mentorProfile.recommendations || []).map((rec, index) => (
                      <div key={index} className="space-y-2 rounded-md border bg-white p-4 pt-2 relative">
                          <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeRecommendation(index)}
                              className="absolute top-1 left-1 h-7 w-7"
                              aria-label="מחק המלצה"
                          >
                              <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                          <div className="space-y-1">
                              <Label htmlFor={`rec-author-${index}`}>שם הממליצ.ה</Label>
                              <Input 
                                  id={`rec-author-${index}`} 
                                  value={rec.author || ''} 
                                  onChange={(e) => handleRecommendationChange(index, 'author', e.target.value)}
                              />
                          </div>
                          <div className="space-y-1">
                              <Label htmlFor={`rec-text-${index}`}>תוכן ההמלצה</Label>
                              <Textarea 
                                  id={`rec-text-${index}`} 
                                  value={rec.text || ''}
                                  onChange={(e) => handleRecommendationChange(index, 'text', e.target.value)}
                                  rows={3}
                              />
                          </div>
                      </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addRecommendation} className="bg-white">
                      <Plus className="w-4 h-4 ml-2" />
                      הוספת המלצה
                  </Button>
              </div>

              <div className="pt-6">
                {successMessage && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg mb-4">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <p>{successMessage}</p>
                  </div>
                )}
                {error && !successMessage && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg mb-4">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                  </div>
                )}
                <Button type="submit" disabled={isSaving} className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white text-lg py-3">
                  {isSaving ? <Loader2 className="w-5 h-5 ml-2 animate-spin" /> : <Save className="w-5 h-5 ml-2" />}
                  {isSaving ? 'שומרת...' : 'שמירת שינויים'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
