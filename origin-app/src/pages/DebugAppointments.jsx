
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Plus, List, AlertTriangle } from 'lucide-react';
import { debugAppointments } from '@/api/functions';

export default function DebugAppointments() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [mentorEmail, setMentorEmail] = useState('bloriarehovot@gmail.com');
    const [userEmail, setUserEmail] = useState('adarazimut@gmail.com');

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await User.me();
                setCurrentUser(user);
            } catch (error) {
                console.error('Failed to load user:', error);
            }
        };
        loadUser();
    }, []);

    const runDebugAction = async (action, data = {}) => {
        if (!currentUser || currentUser.role !== 'admin') {
            alert('רק אדמין יכול להריץ פונקציות ניפוי שגיאות');
            return;
        }

        setIsLoading(true);
        try {
            console.log(`[DebugAppointments] Running action: ${action}`, data);
            const { data: response, error } = await debugAppointments({ action, data });
            
            if (error) {
                throw new Error(error.response?.data?.error || error.message || 'Unknown error');
            }

            setResults(response);
            console.log(`[DebugAppointments] Action ${action} completed:`, response);
        } catch (error) {
            console.error(`[DebugAppointments] Action ${action} failed:`, error);
            alert(`שגיאה בפעולת ${action}: ${error.message}`);
            setResults({ error: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (currentUser.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="p-6 text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">אין הרשאה</h2>
                        <p className="text-gray-600">רק אדמינים יכולים לגשת לכלי ניפוי השגיאות</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        כלי ניפוי שגיאות - פגישות
                    </h1>
                    <p className="text-gray-600">
                        כלים לאבחון בעיות בפגישות בין משתמשות למנטוריות
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <List className="w-5 h-5" />
                                פעולות כלליות
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                onClick={() => runDebugAction('list_all')}
                                disabled={isLoading}
                                className="w-full"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
                                הצג את כל הפגישות במערכת
                            </Button>
                            
                            <Button
                                onClick={() => runDebugAction('check_rls')}
                                disabled={isLoading}
                                variant="outline"
                                className="w-full"
                            >
                                בדוק הרשאות RLS
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="w-5 h-5" />
                                חיפוש ספציפי
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">מייל מנטורית:</label>
                                <Input
                                    value={mentorEmail}
                                    onChange={(e) => setMentorEmail(e.target.value)}
                                    placeholder="mentor@example.com"
                                />
                            </div>
                            
                            <Button
                                onClick={() => runDebugAction('search_by_mentor', { mentor_email: mentorEmail })}
                                disabled={isLoading}
                                className="w-full"
                            >
                                חפש פגישות של המנטורית
                            </Button>

                            <div>
                                <label className="block text-sm font-medium mb-2">מייל משתמשת:</label>
                                <Input
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    placeholder="user@example.com"
                                />
                            </div>
                            
                            <Button
                                onClick={() => runDebugAction('search_by_user', { user_email: userEmail })}
                                disabled={isLoading}
                                variant="outline"
                                className="w-full"
                            >
                                חפש פגישות של המשתמשת
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Test Creation */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            יצירת פגישת בדיקה
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                            פעולה זו תיצור פגישה חדשה עם הסטטוס 'ממתין לאישור' עבור המיילים שהוגדרו בתיבות החיפוש למעלה.
                        </p>
                        <Button
                            onClick={() => runDebugAction('create_test', {
                                mentor_email: mentorEmail,
                                user_email: userEmail,
                            })}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
                            יצור פגישת בדיקה
                        </Button>
                    </CardContent>
                </Card>

                {/* Results */}
                {results && (
                    <Card>
                        <CardHeader>
                            <CardTitle>תוצאות</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                                {JSON.stringify(results, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
