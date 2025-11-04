import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { SocialProfile } from '@/api/entities';
import { tempDeleteSocialProfile } from '@/api/functions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertTriangle, Trash2, ShieldCheck } from 'lucide-react';

const userEmailToDelete = "career@azimut2000.co.il";

export default function TempDeleteTool() {
    const [currentUser, setCurrentUser] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const user = await User.me();
                setCurrentUser(user);

                if (user.email === userEmailToDelete || user.role === 'admin') {
                    const fetchedProfiles = await SocialProfile.filter({ email: userEmailToDelete });
                    setProfiles(fetchedProfiles);
                }
            } catch (err) {
                setError("Failed to load user or profile data. " + err.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const handleDelete = async (profileId) => {
        if (!window.confirm(`האם את בטוחה שברצונך למחוק את הפרופיל הזה? (${profileId}) הפעולה אינה הפיכה.`)) {
            return;
        }
        setDeletingId(profileId);
        setError('');
        try {
            const result = await tempDeleteSocialProfile({ profileId });
            if (result.data.success) {
                setProfiles(prev => prev.filter(p => p.id !== profileId));
                alert(`פרופיל ${profileId} נמחק בהצלחה.`);
            } else {
                throw new Error(result.data.error || 'Unknown error occurred');
            }
        } catch (err) {
            setError("מחיקה נכשלה: " + err.message);
            alert("מחיקה נכשלה: " + err.message);
        } finally {
            setDeletingId(null);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 animate-spin" /></div>;
    }

    if (!currentUser || (currentUser.email !== userEmailToDelete && currentUser.role !== 'admin')) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle>גישה נדחתה</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p>אין לך הרשאה לגשת לכלי זה.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Card className="border-red-500 bg-red-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700"><AlertTriangle /> כלי ניקוי פרופילים כפולים (זמני)</CardTitle>
                    <CardDescription className="text-red-600">
                        עמוד זה נועד לאפשר לך למחוק פרופילים כפולים שנוצרו עבור המייל <strong>{userEmailToDelete}</strong>.
                        יש להשאיר רק פרופיל אחד תקין. לאחר סיום הניקוי, יש לעדכן אותי כדי שאוכל להסיר את הכלי.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="space-y-4">
                        <h3 className="font-bold">נמצאו {profiles.length} פרופילים:</h3>
                        {profiles.length > 0 ? profiles.map(profile => (
                            <div key={profile.id} className="flex justify-between items-center p-3 border rounded-lg bg-white">
                                <div>
                                    <p><strong>כינוי:</strong> {profile.nickname || 'אין'}</p>
                                    <p className="text-sm text-gray-500"><strong>ID:</strong> {profile.id}</p>
                                    <p className="text-sm text-gray-500"><strong>נוצר ב:</strong> {new Date(profile.created_date).toLocaleString('he-IL')}</p>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(profile.id)}
                                    disabled={deletingId === profile.id}
                                >
                                    {deletingId === profile.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    <span className="mr-2">מחק</span>
                                </Button>
                            </div>
                        )) : (
                            <div className="text-center p-6 bg-green-50 border-green-200 rounded-lg">
                                <ShieldCheck className="w-10 h-10 text-green-500 mx-auto mb-2" />
                                <p className="font-semibold text-green-700">לא נמצאו פרופילים המשויכים למייל זה. נראה שהכל נקי!</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}