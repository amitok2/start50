import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Upload, Loader2, CheckCircle, Trash2, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function RecommendationLettersWidget({ user, onSuccess }) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            setUploadError('יש להעלות קובץ PDF או תמונה בלבד');
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
            console.log('[RecommendationLetters] Uploading file:', file.name);
            
            // Upload file to private storage
            const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
            console.log('[RecommendationLetters] File uploaded successfully:', file_uri);
            
            // Get current recommendation letters or initialize empty array
            const currentLetters = user.recommendation_letters_urls || [];
            
            // Add new file URI to the array
            const updatedLetters = [...currentLetters, file_uri];
            console.log('[RecommendationLetters] Updating user with letters:', updatedLetters);
            
            // Update user profile with new array
            await base44.auth.updateMe({ recommendation_letters_urls: updatedLetters });
            
            alert('מכתב ההמלצה הועלה בהצלחה! ✅');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('[RecommendationLetters] Failed to upload:', error);
            setUploadError('אירעה שגיאה בהעלאת הקובץ. אנא נסי שוב.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteLetter = async (index) => {
        if (!confirm('האם את בטוחה שברצונך למחוק מכתב המלצה זה?')) return;

        try {
            const currentLetters = user.recommendation_letters_urls || [];
            const updatedLetters = currentLetters.filter((_, i) => i !== index);
            
            await base44.auth.updateMe({ recommendation_letters_urls: updatedLetters });
            
            alert('מכתב ההמלצה נמחק בהצלחה');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('[RecommendationLetters] Failed to delete:', error);
            alert('אירעה שגיאה במחיקת הקובץ');
        }
    };

    const hasLetters = user?.recommendation_letters_urls && user.recommendation_letters_urls.length > 0;

    return (
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Star className="w-5 h-5 text-amber-600" />
                    מכתבי המלצה שלי
                </CardTitle>
            </CardHeader>
            <CardContent>
                {hasLetters ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg mb-3">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">יש לך {user.recommendation_letters_urls.length} מכתבי המלצה</span>
                        </div>
                        
                        <div className="space-y-2">
                            {user.recommendation_letters_urls.map((letterUrl, index) => (
                                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-amber-200">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-amber-600" />
                                        <span className="text-sm text-gray-700">מכתב המלצה {index + 1}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteLetter(index)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        
                        <Button
                            onClick={() => document.getElementById('letter-add-input').click()}
                            disabled={isUploading}
                            variant="outline"
                            className="w-full mt-3"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                    מעלה...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 ml-2" />
                                    הוספת מכתב המלצה נוסף
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-gray-600 text-sm">
                            מכתבי המלצה יכולים להיות משמעותיים מאוד בחיפוש עבודה. העלי את המכתבים שלך כאן כדי שיהיו זמינים בכל עת.
                        </p>
                        <Button
                            onClick={() => document.getElementById('letter-upload-input').click()}
                            disabled={isUploading}
                            className="bg-amber-600 hover:bg-amber-700 w-full"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                    מעלה...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 ml-2" />
                                    העלאת מכתב המלצה
                                </>
                            )}
                        </Button>
                        <p className="text-xs text-gray-500">
                            ניתן להעלות קבצי PDF או תמונות עד 5MB
                        </p>
                    </div>
                )}

                {uploadError && (
                    <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                        {uploadError}
                    </div>
                )}

                <input
                    id="letter-upload-input"
                    type="file"
                    accept=".pdf,image/jpeg,image/jpg,image/png"
                    onChange={handleFileUpload}
                    className="hidden"
                />
                <input
                    id="letter-add-input"
                    type="file"
                    accept=".pdf,image/jpeg,image/jpg,image/png"
                    onChange={handleFileUpload}
                    className="hidden"
                />
            </CardContent>
        </Card>
    );
}