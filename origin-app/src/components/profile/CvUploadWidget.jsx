
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Loader2, CheckCircle, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function CvUploadWidget({ user, onSuccess }) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

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
            
            // Update user profile with CV URL
            await base44.auth.updateMe({ cv_url: file_uri });
            
            alert('קורות החיים הועלו בהצלחה! ✅');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Failed to upload CV:', error);
            setUploadError('אירעה שגיאה בהעלאת הקובץ. אנא נסי שוב.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteCv = async () => {
        if (!confirm('האם את בטוחה שברצונך למחוק את קורות החיים?')) return;

        try {
            await base44.auth.updateMe({ cv_url: null });
            alert('קורות החיים נמחקו בהצלחה');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Failed to delete CV:', error);
            alert('אירעה שגיאה במחיקת הקובץ');
        }
    };

    const hasCv = user?.cv_url;

    return (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                    קורות החיים שלי
                </CardTitle>
            </CardHeader>
            <CardContent>
                {hasCv ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">קורות החיים שלך שמורות במערכת</span>
                        </div>
                        <p className="text-sm text-gray-600">
                            כעת תוכלי להשתמש בקורות החיים שלך בעת שליחת מועמדות למשרות
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById('cv-update-input').click()}
                                disabled={isUploading}
                            >
                                <Upload className="w-4 h-4 ml-2" />
                                עדכון קורות חיים
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDeleteCv}
                                className="text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="w-4 h-4 ml-2" />
                                מחיקה
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-gray-600">
                            העלי את קורות החיים שלך כדי להשתמש בהן בעת פנייה למשרות. ראי שדרוג קורות חיים בהמשך!
                        </p>
                        <Button
                            onClick={() => document.getElementById('cv-upload-input').click()}
                            disabled={isUploading}
                            className="bg-blue-600 hover:bg-blue-700 w-full"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                    מעלה...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 ml-2" />
                                    העלאת קורות חיים
                                </>
                            )}
                        </Button>
                        <p className="text-xs text-gray-500">
                            ניתן להעלות קבצי PDF או Word עד 5MB
                        </p>
                    </div>
                )}

                {uploadError && (
                    <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                        {uploadError}
                    </div>
                )}

                <input
                    id="cv-upload-input"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                />
                <input
                    id="cv-update-input"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                />
            </CardContent>
        </Card>
    );
}
