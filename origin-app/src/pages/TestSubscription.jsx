import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { MentorSession } from '@/api/entities';
import { SocialProfile } from '@/api/entities';
import { CommunityPost } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';

export default function TestSubscription() {
    const [user, setUser] = useState(null);
    const [testResults, setTestResults] = useState({
        mentors: { status: 'loading', data: null, error: null },
        profiles: { status: 'loading', data: null, error: null },
        posts: { status: 'loading', data: null, error: null }
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        runTests();
    }, []);

    const runTests = async () => {
        setIsLoading(true);
        
        try {
            // Test user status
            const currentUser = await User.me();
            setUser(currentUser);
            
            // Test mentors access
            try {
                const mentors = await MentorSession.list('-created_date', 5);
                setTestResults(prev => ({
                    ...prev,
                    mentors: { status: 'success', data: mentors, error: null }
                }));
            } catch (error) {
                setTestResults(prev => ({
                    ...prev,
                    mentors: { status: 'error', data: null, error: error.message }
                }));
            }

            // Test social profiles access
            try {
                const profiles = await SocialProfile.list('-created_date', 5);
                setTestResults(prev => ({
                    ...prev,
                    profiles: { status: 'success', data: profiles, error: null }
                }));
            } catch (error) {
                setTestResults(prev => ({
                    ...prev,
                    profiles: { status: 'error', data: null, error: error.message }
                }));
            }

            // Test community posts access
            try {
                const posts = await CommunityPost.list('-created_date', 5);
                setTestResults(prev => ({
                    ...prev,
                    posts: { status: 'success', data: posts, error: null }
                }));
            } catch (error) {
                setTestResults(prev => ({
                    ...prev,
                    posts: { status: 'error', data: null, error: error.message }
                }));
            }

        } catch (error) {
            console.error('Failed to load user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'loading':
                return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">בדיקת גישה למנוי</h1>
                    <Button onClick={runTests} disabled={isLoading}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        הרץ בדיקה מחדש
                    </Button>
                </div>

                {/* User Status */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>פרטי המשתמש</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {user ? (
                            <div className="space-y-2">
                                <p><strong>שם:</strong> {user.full_name}</p>
                                <p><strong>מייל:</strong> {user.email}</p>
                                <p><strong>סטטוס מנוי:</strong> {user.subscription_status || 'לא מוגדר'}</p>
                                <p><strong>רמת מנוי:</strong> {user.subscription_plan || 'לא מוגדר'}</p>
                                <p><strong>תאריך תחילת מנוי:</strong> {user.subscription_start_date || 'לא מוגדר'}</p>
                                <p><strong>תאריך סיום מנוי:</strong> {user.subscription_end_date || 'לא מוגדר'}</p>
                                <div className="mt-4 p-3 rounded-lg bg-gray-100">
                                    <p className="text-sm"><strong>בדיקת תוקף:</strong></p>
                                    <p className="text-sm">
                                        מנוי פעיל: {user.subscription_status === 'active' && 
                                        user.subscription_end_date && 
                                        new Date(user.subscription_end_date) > new Date() ? 
                                        '✅ כן' : '❌ לא'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p>טוען פרטי משתמש...</p>
                        )}
                    </CardContent>
                </Card>

                {/* Test Results */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {getStatusIcon(testResults.mentors.status)}
                                גישה למנטוריות
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {testResults.mentors.status === 'success' ? (
                                <div>
                                    <p className="text-green-600 mb-2">✅ גישה מאושרת</p>
                                    <p className="text-sm text-gray-600">
                                        נמצאו {testResults.mentors.data?.length || 0} מנטוריות
                                    </p>
                                </div>
                            ) : testResults.mentors.status === 'error' ? (
                                <div>
                                    <p className="text-red-600 mb-2">❌ אין גישה</p>
                                    <p className="text-sm text-gray-600">{testResults.mentors.error}</p>
                                </div>
                            ) : (
                                <p>בודק...</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {getStatusIcon(testResults.profiles.status)}
                                גישה לפרופילים חברתיים
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {testResults.profiles.status === 'success' ? (
                                <div>
                                    <p className="text-green-600 mb-2">✅ גישה מאושרת</p>
                                    <p className="text-sm text-gray-600">
                                        נמצאו {testResults.profiles.data?.length || 0} פרופילים
                                    </p>
                                </div>
                            ) : testResults.profiles.status === 'error' ? (
                                <div>
                                    <p className="text-red-600 mb-2">❌ אין גישה</p>
                                    <p className="text-sm text-gray-600">{testResults.profiles.error}</p>
                                </div>
                            ) : (
                                <p>בודק...</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {getStatusIcon(testResults.posts.status)}
                                גישה לפוסטים בקהילה
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {testResults.posts.status === 'success' ? (
                                <div>
                                    <p className="text-green-600 mb-2">✅ גישה מאושרת</p>
                                    <p className="text-sm text-gray-600">
                                        נמצאו {testResults.posts.data?.length || 0} פוסטים
                                    </p>
                                </div>
                            ) : testResults.posts.status === 'error' ? (
                                <div>
                                    <p className="text-red-600 mb-2">❌ אין גישה</p>
                                    <p className="text-sm text-gray-600">{testResults.posts.error}</p>
                                </div>
                            ) : (
                                <p>בודק...</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>הסבר על הבדיקה</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>• <strong>✅ גישה מאושרת:</strong> המנוי פעיל ויש גישה לתוכן</p>
                            <p>• <strong>❌ אין גישה:</strong> המנוי לא פעיל או שפג תוקפו</p>
                            <p>• אם את רואה "אין גישה" למרות שיש מנוי פעיל, יש בעיה בהגדרות הרשאות</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}