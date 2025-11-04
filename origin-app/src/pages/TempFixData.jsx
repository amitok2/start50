import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { MentorProfile } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export default function TempFixData() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [summary, setSummary] = useState({ total: 0, updated: 0, noUser: 0, noProfile: 0, noActionNeeded: 0, errors: 0 });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await User.me();
                setCurrentUser(user);
            } catch (error) {
                console.error("User not logged in");
            }
        };
        fetchUser();
    }, []);

    const runFixScript = async () => {
        if (!currentUser || currentUser.role !== 'admin') {
            alert("רק למנהלות יש הרשאה להריץ סקריפט זה.");
            return;
        }

        setIsLoading(true);
        setResults([]);
        setSummary({ total: 0, updated: 0, noUser: 0, noProfile: 0, noActionNeeded: 0, errors: 0 });

        try {
            const allUsers = await User.filter({ user_type: 'mentor' });
            
            let tempSummary = { total: allUsers.length, updated: 0, noUser: 0, noProfile: 0, noActionNeeded: 0, errors: 0 };
            let tempResults = [];

            for (const user of allUsers) {
                if (!user.mentor_id) {
                    tempResults.push({ email: user.email, status: 'error', message: 'משתמשת מסוג מנטורית אך ללא mentor_id מקושר.' });
                    tempSummary.errors++;
                    continue;
                }

                try {
                    const mentorProfile = await MentorProfile.get(user.mentor_id);
                    if (!mentorProfile) {
                        tempResults.push({ email: user.email, status: 'error', message: `לא נמצא פרופיל מנטורית עם ID: ${user.mentor_id}` });
                        tempSummary.noProfile++;
                        continue;
                    }

                    if (mentorProfile.contact_email !== user.email) {
                        await MentorProfile.update(mentorProfile.id, { contact_email: user.email });
                        tempResults.push({ email: user.email, status: 'success', message: `עודכן המייל בפרופיל מ- ${mentorProfile.contact_email} ל- ${user.email}` });
                        tempSummary.updated++;
                    } else {
                        tempResults.push({ email: user.email, status: 'skipped', message: 'המייל בפרופיל תואם למייל המשתמשת. אין צורך בפעולה.' });
                        tempSummary.noActionNeeded++;
                    }
                } catch (profileError) {
                    tempResults.push({ email: user.email, status: 'error', message: `שגיאה באחזור או עדכון פרופיל: ${profileError.message}` });
                    tempSummary.errors++;
                }
            }

            setResults(tempResults);
            setSummary(tempSummary);
        } catch (error) {
            console.error("Error running fix script:", error);
            alert(`שגיאה כללית בהרצת הסקריפט: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!currentUser) {
        return <div className="text-center p-8">טוען נתוני משתמש...</div>;
    }

    if (currentUser.role !== 'admin') {
        return (
            <div className="text-center p-8">
                <AlertTriangle className="mx-auto text-red-500 w-12 h-12 mb-4" />
                <h2 className="text-xl font-bold">אין לך הרשאה לגשת לדף זה.</h2>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>תיקון נתוני מייל של מנטוריות</CardTitle>
                    <CardDescription>
                        סקריפט זה סורק את כל המשתמשות שהן מנטוריות ומוודא שכתובת המייל בפרופיל המנטורית שלהן זהה לכתובת המייל שאיתה הן מתחברות לאתר.
                        פעולה זו תפתור בעיות שבהן מנטוריות לא רואות פגישות שנקבעו להן.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={runFixScript} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                        הרץ את סקריפט התיקון
                    </Button>
                </CardContent>
            </Card>

            {results.length > 0 && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>תוצאות הריצה</CardTitle>
                        <CardDescription>
                            סה"כ נבדקו: {summary.total} | 
                            עודכנו: {summary.updated} | 
                            ללא שינוי: {summary.noActionNeeded} | 
                            שגיאות: {summary.errors}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {results.map((result, index) => (
                                <li key={index} className={`p-3 rounded-md flex items-start gap-3 text-sm ${
                                    result.status === 'success' ? 'bg-green-50 text-green-800' :
                                    result.status === 'error' ? 'bg-red-50 text-red-800' :
                                    'bg-gray-50 text-gray-800'
                                }`}>
                                    {result.status === 'success' && <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                                    {result.status === 'error' && <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                                    <div>
                                        <strong className="font-semibold">{result.email}</strong>: {result.message}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}