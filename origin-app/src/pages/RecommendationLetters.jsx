
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Upload, Loader2, FileText, Trash2, Eye, Download, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';

export default function RecommendationLetters() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [letters, setLetters] = useState([]);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const user = await base44.auth.me();
            setCurrentUser(user);
            
            if (user.recommendation_letters_urls && user.recommendation_letters_urls.length > 0) {
                setLetters(user.recommendation_letters_urls);
            }
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            setUploadError('יש להעלות קובץ PDF או Word בלבד');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('גודל הקובץ חייב להיות עד 5MB');
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            // Upload file to private storage
            const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
            
            // Add to existing letters
            const updatedLetters = [...letters, file_uri];
            
            // Update user profile
            await base44.auth.updateMe({ recommendation_letters_urls: updatedLetters });
            
            setLetters(updatedLetters);
            alert('מכתב ההמלצה הועלה בהצלחה! ✅');
            
            // Reload user data
            await loadUserData();
        } catch (error) {
            console.error('Failed to upload recommendation letter:', error);
            setUploadError('אירעה שגיאה בהעלאת הקובץ. אנא נסי שוב.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteLetter = async (letterUrl) => {
        if (!confirm('האם את בטוחה שברצונך למחוק מכתב המלצה זה?')) return;

        try {
            const updatedLetters = letters.filter(url => url !== letterUrl);
            await base44.auth.updateMe({ recommendation_letters_urls: updatedLetters });
            setLetters(updatedLetters);
            alert('מכתב ההמלצה נמחק בהצלחה');
        } catch (error) {
            console.error('Failed to delete letter:', error);
            alert('אירעה שגיאה במחיקת המכתב');
        }
    };

    const handleViewLetter = async (letterUri) => {
        try {
            // Create signed URL for private file
            const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({
                file_uri: letterUri,
                expires_in: 3600 // 1 hour
            });
            
            // Open in new tab
            window.open(signed_url, '_blank');
        } catch (error) {
            console.error('Failed to view letter:', error);
            alert('אירעה שגיאה בפתיחת המכתב');
        }
    };

    const getFileNameFromUri = (uri) => {
        try {
            const parts = uri.split('/');
            return parts[parts.length - 1] || 'מכתב המלצה';
        } catch {
            return 'מכתב המלצה';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md">
                    <CardContent className="text-center p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">נדרשת התחברות</h2>
                        <p className="text-gray-600 mb-6">אנא התחברי כדי לנהל את מכתבי ההמלצה שלך</p>
                        <Button onClick={() => base44.auth.redirectToLogin()}>
                            התחברי
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link 
                        to={createPageUrl("MyProfile")} 
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-4 transition-colors"
                    >
                        <ArrowRight className="w-4 h-4" />
                        <span>חזרה לפרופיל</span>
                    </Link>
                    
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                            <Star className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">מכתבי ההמלצה שלי</h1>
                            <p className="text-gray-600">נהלי את מכתבי ההמלצה שלך למשרות עתידיות</p>
                        </div>
                    </div>
                </div>

                {/* Upload Section */}
                <Card className="mb-8 shadow-xl border-2 border-green-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Upload className="w-6 h-6 text-green-600" />
                            העלאת מכתב המלצה חדש
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-sm text-green-800 leading-relaxed">
                                    <strong>💡 טיפ:</strong> מכתבי המלצה חזקים יכולים להיות המפתח להתקבלות לתפקיד חלומותייך! 
                                    העלי מכתבי המלצה ממעסיקים קודמים, מנהלים או עמיתים שיכולים להמליץ על העבודה המקצועית שלך.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <Button
                                    onClick={() => document.getElementById('letter-upload-input').click()}
                                    disabled={isUploading}
                                    className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                            מעלה...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 ml-2" />
                                            בחרי קובץ להעלאה
                                        </>
                                    )}
                                </Button>
                                <p className="text-sm text-gray-500">
                                    קבצי PDF או Word עד 5MB
                                </p>
                            </div>

                            {uploadError && (
                                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                                    {uploadError}
                                </div>
                            )}

                            <input
                                id="letter-upload-input"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Letters List */}
                <Card className="shadow-xl border-2 border-green-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <FileText className="w-6 h-6 text-green-600" />
                            המכתבים שלי ({letters.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {letters.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    טרם העלית מכתבי המלצה
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    העלי את מכתב ההמלצה הראשון שלך כדי להתחיל
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {letters.map((letterUri, index) => (
                                    <div 
                                        key={index}
                                        className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FileText className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 truncate">
                                                    מכתב המלצה #{index + 1}
                                                </h4>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {getFileNameFromUri(letterUri)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 flex-shrink-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewLetter(letterUri)}
                                                className="border-green-300 text-green-700 hover:bg-green-50"
                                            >
                                                <Eye className="w-4 h-4 ml-1" />
                                                צפייה
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteLetter(letterUri)}
                                                className="border-red-300 text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        למה חשוב להעלות מכתבי המלצה?
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">✓</span>
                            <span>מכתבי המלצה מקצועיים מגבירים את הסיכויים שלך להתקבל לעבודה</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">✓</span>
                            <span>מראה למעסיקים פוטנציאליים את הערך המקצועי שלך</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">✓</span>
                            <span>שמירה מאובטחת של כל המכתבים במקום אחד נגיש</span>
                        </li>
                    </ul>
                </div>

                {/* Back to Profile Link */}
                <div className="mt-8 text-center">
                    <Link 
                        to={createPageUrl("MyProfile")} 
                        className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium transition-colors"
                    >
                        <Heart className="w-4 h-4 fill-rose-600" />
                        <span>חזרה למקום הפרטי שלי</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
