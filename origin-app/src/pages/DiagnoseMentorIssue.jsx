import React, { useState, useEffect } from 'react';
import { MentorApplication } from '@/api/entities';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, RefreshCw, AlertTriangle } from 'lucide-react';

export default function DiagnoseMentorIssue() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState({});
    const [testRecord, setTestRecord] = useState(null);

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

    const runDiagnostics = async () => {
        if (!currentUser || currentUser.role !== 'admin') {
            alert('רק אדמין יכול להריץ אבחון זה');
            return;
        }

        setIsLoading(true);
        setResults({});

        const diagnostics = {};

        try {
            // Test 1: Direct entity access with user permissions
            console.log('🔍 [Diagnosis] Test 1: Direct entity access...');
            try {
                const directAccess = await MentorApplication.list('-created_date', 10);
                diagnostics.directAccess = {
                    success: true,
                    count: directAccess.length,
                    data: directAccess.slice(0, 2) // Just first 2 records
                };
                console.log('✅ [Diagnosis] Direct access successful:', directAccess.length);
            } catch (error) {
                diagnostics.directAccess = {
                    success: false,
                    error: error.message
                };
                console.error('❌ [Diagnosis] Direct access failed:', error);
            }

            // Test 2: Filter with empty criteria
            console.log('🔍 [Diagnosis] Test 2: Filter with empty criteria...');
            try {
                const filterEmpty = await MentorApplication.filter({}, '-created_date', 10);
                diagnostics.filterEmpty = {
                    success: true,
                    count: filterEmpty.length,
                    data: filterEmpty.slice(0, 2)
                };
                console.log('✅ [Diagnosis] Filter empty successful:', filterEmpty.length);
            } catch (error) {
                diagnostics.filterEmpty = {
                    success: false,
                    error: error.message
                };
                console.error('❌ [Diagnosis] Filter empty failed:', error);
            }

            // Test 3: Filter by status
            console.log('🔍 [Diagnosis] Test 3: Filter by pending status...');
            try {
                const filterPending = await MentorApplication.filter({ status: 'pending' }, '-created_date', 10);
                diagnostics.filterPending = {
                    success: true,
                    count: filterPending.length,
                    data: filterPending.slice(0, 2)
                };
                console.log('✅ [Diagnosis] Filter pending successful:', filterPending.length);
            } catch (error) {
                diagnostics.filterPending = {
                    success: false,
                    error: error.message
                };
                console.error('❌ [Diagnosis] Filter pending failed:', error);
            }

            // Test 4: Try to get entity schema
            console.log('🔍 [Diagnosis] Test 4: Get entity schema...');
            try {
                const schema = await MentorApplication.schema();
                diagnostics.schema = {
                    success: true,
                    schema: schema
                };
                console.log('✅ [Diagnosis] Schema retrieved successfully');
            } catch (error) {
                diagnostics.schema = {
                    success: false,
                    error: error.message
                };
                console.error('❌ [Diagnosis] Schema failed:', error);
            }

        } catch (globalError) {
            diagnostics.globalError = globalError.message;
        }

        setResults(diagnostics);
        setIsLoading(false);
    };

    const createTestRecord = async () => {
        if (!currentUser || currentUser.role !== 'admin') {
            alert('רק אדמין יכול ליצור רשומת בדיקה');
            return;
        }

        try {
            console.log('🧪 [Diagnosis] Creating test record...');
            const testData = {
                full_name: `בדיקה טכנית - ${new Date().toLocaleTimeString('he-IL')}`,
                email: 'test@technical-diagnosis.com',
                specialty: 'בדיקה טכנית',
                experience_summary: 'זוהי רשומת בדיקה טכנית לאבחון הבעיה',
                why_join: 'רשומת בדיקה'
            };

            const created = await MentorApplication.create(testData);
            setTestRecord(created);
            console.log('✅ [Diagnosis] Test record created:', created);
            
            // Refresh diagnostics after creating test record
            setTimeout(runDiagnostics, 1000);
        } catch (error) {
            console.error('❌ [Diagnosis] Test record creation failed:', error);
            alert(`שגיאה ביצירת רשומת בדיקה: ${error.message}`);
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
                        <p className="text-gray-600">רק מנהלות יכולות לגשת לדף האבחון</p>
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
                        אבחון בעיות MentorApplication
                    </h1>
                    <p className="text-gray-600">
                        כלי לאבחון בעיות גישה לרשומות MentorApplication
                    </p>
                </div>

                <div className="flex gap-4 mb-6">
                    <Button onClick={runDiagnostics} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Search className="w-4 h-4 ml-2" />}
                        הרץ אבחון
                    </Button>
                    <Button onClick={createTestRecord} variant="outline">
                        <RefreshCw className="w-4 h-4 ml-2" />
                        צור רשומת בדיקה
                    </Button>
                </div>

                {testRecord && (
                    <Card className="mb-6 border-green-200 bg-green-50">
                        <CardHeader>
                            <CardTitle className="text-green-800">רשומת בדיקה נוצרה</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>ID:</strong> {testRecord.id}</p>
                            <p><strong>שם:</strong> {testRecord.full_name}</p>
                            <p><strong>סטטוס:</strong> {testRecord.status}</p>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6">
                    {Object.entries(results).map(([testName, result]) => (
                        <Card key={testName}>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <CardTitle className="flex-1">בדיקה: {testName}</CardTitle>
                                    <Badge className={result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                        {result.success ? '✅ הצליח' : '❌ נכשל'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {result.success ? (
                                    <div>
                                        {result.count !== undefined && (
                                            <p className="mb-2"><strong>מספר רשומות:</strong> {result.count}</p>
                                        )}
                                        {result.data && result.data.length > 0 && (
                                            <div>
                                                <p className="font-semibold mb-2">דוגמא לרשומות:</p>
                                                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                                                    {JSON.stringify(result.data, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                        {result.schema && (
                                            <div>
                                                <p className="font-semibold mb-2">Schema:</p>
                                                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                                                    {JSON.stringify(result.schema, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-red-600">
                                        <strong>שגיאה:</strong> {result.error}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}