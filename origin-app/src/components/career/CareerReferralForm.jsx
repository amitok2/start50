
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, Calendar, Clock } from 'lucide-react';

export default function CareerReferralForm({ referral, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        referral_date: '',
        company_name: '',
        job_title: '',
        recommender_details: '',
        status: 'ממתין',
        interview_date_1: '',
        interview_time_1: '',
        interview_date_2: '',
        interview_time_2: '',
        actions_taken: '',
        notes: '',
        job_post_url: '',
        company_research_notes: '',
        questions_for_interviewer: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (referral) {
            setFormData({
                referral_date: referral.referral_date ? referral.referral_date.split('T')[0] : '',
                company_name: referral.company_name || '',
                job_title: referral.job_title || '',
                recommender_details: referral.recommender_details || '',
                status: referral.status || 'ממתין',
                interview_date_1: referral.interview_date_1 ? referral.interview_date_1.split('T')[0] : '',
                interview_time_1: referral.interview_time_1 || '',
                interview_date_2: referral.interview_date_2 ? referral.interview_date_2.split('T')[0] : '',
                interview_time_2: referral.interview_time_2 || '',
                actions_taken: referral.actions_taken || '',
                notes: referral.notes || '',
                job_post_url: referral.job_post_url || '',
                company_research_notes: referral.company_research_notes || '',
                questions_for_interviewer: referral.questions_for_interviewer || ''
            });
        } else {
            // אם זו הפניה חדשה, הגדר תאריך היום כברירת מחדל
            const today = new Date().toISOString().split('T')[0];
            setFormData(prev => ({ ...prev, referral_date: today }));
        }
    }, [referral]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* פרטי ההפניה הבסיסיים */}
            <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">פרטי ההפניה</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="referral_date">תאריך ההפניה</Label>
                        <Input
                            id="referral_date"
                            type="date"
                            value={formData.referral_date}
                            onChange={(e) => handleInputChange('referral_date', e.target.value)}
                            className="text-right"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">סטטוס נוכחי</Label>
                        <Select 
                            value={formData.status} 
                            onValueChange={(value) => handleInputChange('status', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ממתין">ממתין</SelectItem>
                                <SelectItem value="זומנתי לראיון">זומנתי לראיון</SelectItem>
                                <SelectItem value="בתהליך">בתהליך</SelectItem>
                                <SelectItem value="קיבלתי הצעה">קיבלתי הצעה</SelectItem>
                                <SelectItem value="התחלתי לעבוד">התחלתי לעבוד</SelectItem>
                                <SelectItem value="נדחיתי">נדחיתי</SelectItem>
                                <SelectItem value="הושלם">הושלם</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="company_name" className="text-red-500">שם החברה או הארגון *</Label>
                        <Input
                            id="company_name"
                            value={formData.company_name}
                            onChange={(e) => handleInputChange('company_name', e.target.value)}
                            placeholder="לדוגמה: מיקרוסופט, בנק הפועלים..."
                            className="text-right"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="job_title" className="text-red-500">התפקיד אליו הופנתה *</Label>
                        <Input
                            id="job_title"
                            value={formData.job_title}
                            onChange={(e) => handleInputChange('job_title', e.target.value)}
                            placeholder="לדוגמה: מנהלת פרויקטים, מפתחת תוכנה..."
                            className="text-right"
                            required
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="recommender_details">מי המליץ או איך הגעת אליהם</Label>
                        <Input
                            id="recommender_details"
                            value={formData.recommender_details}
                            onChange={(e) => handleInputChange('recommender_details', e.target.value)}
                            placeholder="לדוגמה: מנטורית שרה, חברה מהקורס, LinkedIn..."
                            className="text-right"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="job_post_url">קישור למודעת המשרה</Label>
                        <Input
                            id="job_post_url"
                            type="url"
                            value={formData.job_post_url}
                            onChange={(e) => handleInputChange('job_post_url', e.target.value)}
                            placeholder="https://..."
                            className="text-right"
                        />
                    </div>
                </div>
            </div>

            {/* פרטי ראיונות */}
            {(formData.status === 'זומנתי לראיון' || formData.status === 'בתהליך' || formData.interview_date_1) && (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-lg mb-4 text-blue-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        פרטי ראיונות
                    </h3>
                    
                    {/* ראיון ראשון */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-blue-800">ראיון ראשון</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="interview_date_1">תאריך ראיון</Label>
                                <Input
                                    id="interview_date_1"
                                    type="date"
                                    value={formData.interview_date_1}
                                    onChange={(e) => handleInputChange('interview_date_1', e.target.value)}
                                    className="text-right"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="interview_time_1">שעת ראיון</Label>
                                <Input
                                    id="interview_time_1"
                                    type="time"
                                    value={formData.interview_time_1}
                                    onChange={(e) => handleInputChange('interview_time_1', e.target.value)}
                                    className="text-right"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ראיון שני */}
                    <div className="space-y-4 mt-6">
                        <h4 className="font-medium text-blue-800">ראיון שני (אופציונלי)</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="interview_date_2">תאריך ראיון שני</Label>
                                <Input
                                    id="interview_date_2"
                                    type="date"
                                    value={formData.interview_date_2}
                                    onChange={(e) => handleInputChange('interview_date_2', e.target.value)}
                                    className="text-right"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="interview_time_2">שעת ראיון שני</Label>
                                <Input
                                    id="interview_time_2"
                                    type="time"
                                    value={formData.interview_time_2}
                                    onChange={(e) => handleInputChange('interview_time_2', e.target.value)}
                                    className="text-right"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* הכנה לראיון */}
            {(formData.status === 'זומנתי לראיון' || formData.status === 'בתהליך') && (
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-lg mb-4 text-green-900">הכנה לראיון</h3>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="company_research_notes">הערות מחקר על החברה</Label>
                            <Textarea
                                id="company_research_notes"
                                value={formData.company_research_notes}
                                onChange={(e) => handleInputChange('company_research_notes', e.target.value)}
                                placeholder="מה למדת על החברה? ערכים, חדשות עדכניות, אתגרים..."
                                className="text-right h-20"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="questions_for_interviewer">שאלות שאני רוצה לשאול במראיין</Label>
                            <Textarea
                                id="questions_for_interviewer"
                                value={formData.questions_for_interviewer}
                                onChange={(e) => handleInputChange('questions_for_interviewer', e.target.value)}
                                placeholder="לדוגמה: איך נראה יום רגיל בתפקיד? מה האתגרים הגדולים של הצוות?"
                                className="text-right h-20"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* פעולות שבוצעו */}
            <div className="space-y-2">
                <Label htmlFor="actions_taken">פעולות נוספות שבוצעו</Label>
                <Textarea
                    id="actions_taken"
                    value={formData.actions_taken}
                    onChange={(e) => handleInputChange('actions_taken', e.target.value)}
                    placeholder="לדוגמה: קיבלתי המלצה מהמנטורית שלי ב-15/1, הכנתי ראיון עם מנטורית ב-20/1, שלחתי מייל תודה ב-25/1..."
                    className="text-right h-24"
                />
                <p className="text-xs text-gray-500">כאן תוכלי לתעד את כל הפעולות שעשית הקשורות להפניה הזו</p>
            </div>

            {/* הערות */}
            <div className="space-y-2">
                <Label htmlFor="notes">הערות אישיות</Label>
                <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="הערות, רשמים, מה ללמוד בפעם הבאה..."
                    className="text-right h-20"
                />
            </div>

            {/* כפתורים */}
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    ביטול
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-rose-500 to-pink-600">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                            שומר...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 ml-2" />
                            {referral ? 'עדכון הפניה' : 'שמירת הפניה'}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
