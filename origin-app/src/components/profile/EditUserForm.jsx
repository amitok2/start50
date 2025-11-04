import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function EditUserForm({ user, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        full_name: '',
        birth_date: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                birth_date: user.birth_date ? user.birth_date.split('T')[0] : ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!formData.full_name.trim()) {
            setError('יש למלא שם מלא');
            setIsLoading(false);
            return;
        }

        try {
            await base44.auth.updateMe(formData);
            alert('הפרטים עודכנו בהצלחה!');
            onSuccess();
        } catch (error) {
            console.error("Error updating user:", error);
            setError(`אירעה שגיאה בעדכון הפרטים: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-red-800 text-sm">{error}</div>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="full_name">שם מלא *</Label>
                <Input 
                    id="full_name" 
                    value={formData.full_name} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="השם המלא שלך"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="birth_date">תאריך לידה</Label>
                <Input 
                    id="birth_date" 
                    type="date" 
                    value={formData.birth_date} 
                    onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500">
                    תאריך הלידה משמש לחישובים אסטרולוגיים ותכנים מותאמים לגיל
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    💡 <strong>שימי לב:</strong> לא ניתן לשנות את כתובת המייל. אם את צריכה לעדכן אותה, צרי קשר עם התמיכה.
                </p>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                    ביטול
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-purple-500 hover:bg-purple-600">
                    {isLoading ? (
                        <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            שומר שינויים...
                        </>
                    ) : (
                        'שמירת שינויים'
                    )}
                </Button>
            </div>
        </form>
    );
}