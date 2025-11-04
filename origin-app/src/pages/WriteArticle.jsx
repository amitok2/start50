
import React, { useState, useEffect } from 'react';
import { MentorArticle } from '@/api/entities';
import { MentorProfile } from '@/api/entities'; // Changed from MentorProfileEntity
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UploadFile } from '@/api/integrations';
import { Loader2, FileText, ImagePlus, CheckCircle } from 'lucide-react';
import { User } from '@/api/entities';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// New imports based on outline
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useUser } from '../components/auth/UserContext';
import { Link, useParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function WriteArticle() {
  const { currentUser } = useUser();
  const { id } = useParams();
  // Attempt to get article ID from URL parameters first, then fallback to query parameters
  const articleId = new URLSearchParams(window.location.search).get('id') || id;

  const [mentorProfile, setMentorProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [existingImageUrl, setExistingImageUrl] = useState(''); // State to hold URL of an already existing image

  const isEditMode = !!articleId; // Determine if we are in edit mode based on articleId presence

  useEffect(() => {
    const loadProfileAndArticle = async () => {
      setIsLoading(true);
      setError('');

      if (!currentUser) {
        if (currentUser === null) {
          setError("אנא התחברי כדי לכתוב מאמר.");
          setIsLoading(false);
        }
        return;
      }

      if (!currentUser.is_approved_mentor) {
        setError("רק מנטוריות מאושרות יכולות לכתוב מאמרים.");
        setIsLoading(false);
        return;
      }

      try {
        console.log(`[WriteArticle] Loading profile for ${currentUser.email}`);
        // Changed to MentorProfile.filter
        const profiles = await MentorProfile.filter({ contact_email: currentUser.email });
        if (profiles.length === 0) {
          throw new Error("לא נמצא פרופיל מנטורית עבורך. אנא פני למנהלת המערכת.");
        }
        setMentorProfile(profiles[0]);
        console.log(`[WriteArticle] Profile loaded:`, profiles[0]);

        // If in edit mode, load the article
        if (isEditMode) {
          console.log(`[WriteArticle] Loading article ${articleId} for editing`);
          const article = await MentorArticle.get(articleId);

          // Verify ownership: current mentor's profile ID must match the article's mentor_profile_id,
          // or the current user must be an admin.
          if (article.mentor_profile_id !== profiles[0].id && currentUser.role !== 'admin') {
            throw new Error("אין לך הרשאה לערוך מאמר זה.");
          }

          setTitle(article.title);
          setSummary(article.summary || ''); // Ensure summary is not null or undefined
          setContent(article.content);
          setExistingImageUrl(article.image_url || ''); // Set the existing image URL
          if (article.image_url) {
            setImagePreview(article.image_url); // Display existing image in preview
          }

          console.log(`[WriteArticle] Article loaded for editing`);
        }
      } catch (err) {
        console.error("Error loading user or profile or article:", err);
        setError(`שגיאה בטעינת הנתונים: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser !== undefined) {
      loadProfileAndArticle();
    }
  }, [currentUser, articleId, isEditMode]); // Added articleId and isEditMode to dependencies

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      // Clear existingImageUrl if a new file is selected
      setExistingImageUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !content) {
      setError("אנא מלאי כותרת ותוכן המאמר.");
      return;
    }

    if (!mentorProfile || !mentorProfile.id) {
      setError("שגיאה: לא ניתן לאמת את פרופיל המנטורית שלך. אנא נסי לרענן את הדף.");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = existingImageUrl; // Start with the existing image URL from the fetched article

      // Only upload new image if one was selected in the form
      if (imageFile) {
        const uploadResult = await UploadFile({ file: imageFile });
        imageUrl = uploadResult.file_url;
      }

      const articleData = {
        mentor_profile_id: mentorProfile.id, // Ensure this is the correct field name as per entity
        mentor_name: mentorProfile.mentor_name,
        title: title,
        summary: summary,
        content: content,
        image_url: imageUrl,
        // Status and publication_date are only set for new articles, not on edit
        status: isEditMode ? undefined : 'pending',
        publication_date: isEditMode ? undefined : new Date().toISOString().split('T')[0]
      };

      if (isEditMode) {
        await MentorArticle.update(articleId, articleData);
        alert("המאמר עודכן בהצלחה! ✨");
        // Redirect to the articles management page after a successful update
        window.location.href = createPageUrl('ManageArticles');
      } else {
        await MentorArticle.create(articleData);
        setSubmitSuccess(true);
      }

    } catch (err) {
      console.error("Error submitting article:", err);
      setError(`אירעה שגיאה בשליחת המאמר: ${err.message}. אנא נסי שוב.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  WriteArticle.modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' },
      { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  WriteArticle.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">שגיאה</h2>
            <p className="text-red-600">{error}</p>
            {error.includes("התחברי") && (
              <Link to={createPageUrl('login')} className="mt-4 inline-block">
                <Button>התחברי עכשים</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!mentorProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">פרופיל מנטורית לא נמצא</h2>
            <p className="text-gray-600">לא נמצא פרופיל מנטורית המשויך לחשבונך, או שפרטי הפרופיל אינם מלאים. אנא פני למנהלת המערכת לסיוע.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show success message only for new article submissions
  if (submitSuccess && !isEditMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">המאמר נשלח בהצלחה! 🎉</h2>
            <p className="text-gray-600 mb-6">המאמר שלך נשלח לעיון ואישור. תקבלי עדכון כאשר הוא יפורסם.</p>
            <Link to={createPageUrl('ManageArticles')}>
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
                חזרי לניהול המאמרים
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <span className="gradient-text">{isEditMode ? 'עריכת מאמר' : 'כתיבת מאמר חדש'}</span>
          </h1>
          <p className="text-lg text-gray-600">
            {isEditMode ? 'ערכי את המאמר שלך' : 'שתפי את הידע והניסיון שלך עם הקהילה'}
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-600" />
              פרטי המאמר
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-red-600 text-center p-2 border border-red-300 bg-red-50 rounded">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="title">כותרת המאמר *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="כותרת מעניינת ומושכת לקוראות..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="summary">תקציר קצר</Label>
                <Textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="תקציר קצר שיעזור לקוראות להחליט אם לקרוא את המאמר..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">תוכן המאמר *</Label>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  placeholder="כאן את יכולה לכתוב את המאמר המלא. שתפי טיפים, ניסיון אישי, עצות מקצועיות..."
                  modules={WriteArticle.modules}
                  formats={WriteArticle.formats}
                  className="bg-white rounded-md shadow-sm"
                />
              </div>

              <div>
                <Label>תמונת נושא (אופציונלי)</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300"
                  >
                    <ImagePlus className="w-5 h-5 text-gray-600" />
                    בחרי תמונה
                  </label>
                  {imagePreview && (
                    <div className="mt-4">
                      <img src={imagePreview} alt="תצוגה מקדימה" className="max-w-xs h-auto rounded-lg shadow-md" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                {/* Changed "ביטול" to navigate to ManageArticles */}
                <Link to={createPageUrl('ManageArticles')}>
                  <Button type="button" variant="outline">
                    ביטול
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {isEditMode ? 'שומר...' : 'שולח...'}
                    </>
                  ) : (
                    isEditMode ? 'שמור שינויים' : 'שליחה לאישור'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
