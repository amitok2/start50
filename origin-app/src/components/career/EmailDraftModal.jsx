import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, CheckCircle, Mail, FileText, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function EmailDraftModal({ isOpen, onClose, referral, user }) {
    const [copied, setCopied] = useState(false);
    const [recipientEmail, setRecipientEmail] = useState('');
    const [cvUrl, setCvUrl] = useState(null);
    const [isLoadingCv, setIsLoadingCv] = useState(false);

    useEffect(() => {
        if (isOpen && user?.cv_url) {
            loadCvSignedUrl();
        }
    }, [isOpen, user]);

    const loadCvSignedUrl = async () => {
        setIsLoadingCv(true);
        try {
            const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({
                file_uri: user.cv_url,
                expires_in: 604800 // 7 days
            });
            setCvUrl(signed_url);
        } catch (error) {
            console.error('Failed to create signed URL:', error);
        } finally {
            setIsLoadingCv(false);
        }
    };

    const subject = `מועמדות למשרת ${referral?.job_title || '[שם המשרה]'} - ${user?.full_name || ''}`;
    
    const body = `שלום רב,

אני ${user?.full_name || '[שמך המלא]'}, ואני מעוניינת להגיש מועמדות למשרת ${referral?.job_title || '[שם המשרה]'} ב${referral?.company_name || '[שם החברה]'}.

${referral?.recommender_details ? `קיבלתי המלצה חמה מ${referral.recommender_details}.` : ''}

מצורף קישור לקורות החיים שלי:
${cvUrl || '[הקישור לקורות החיים שלך יופיע כאן]'}

אשמח לשמוע ממכם ולקבוע פגישה להכרות.

בברכה,
${user?.full_name || '[שמך]'}
${user?.email || '[המייל שלך]'}`;

    const handleCopy = () => {
        const fullEmail = `נושא: ${subject}\n\n${body}`;
        navigator.clipboard.writeText(fullEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Mail className="w-6 h-6 text-blue-600" />
                        טיוטת מייל למעסיק
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {!user?.cv_url && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                            <FileText className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-800">
                                <p className="font-semibold mb-1">טרם העלת קורות חיים</p>
                                <p>כדי לשלוח את המייל, תצטרכי להעלות קורות חיים בדף "המקום האישי שלי"</p>
                            </div>
                        </div>
                    )}

                    <div>
                        <Label htmlFor="recipient">כתובת המייל של המעסיק</Label>
                        <Input
                            id="recipient"
                            type="email"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            placeholder="jobs@company.com"
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label>נושא המייל</Label>
                        <Input
                            value={subject}
                            readOnly
                            className="mt-1 bg-gray-50"
                        />
                    </div>

                    <div>
                        <Label>גוף המייל</Label>
                        <Textarea
                            value={body}
                            readOnly
                            rows={15}
                            className="mt-1 bg-gray-50 font-mono text-sm"
                        />
                    </div>

                    {isLoadingCv && (
                        <div className="flex items-center gap-2 text-blue-600">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">טוען קישור לקורות חיים...</span>
                        </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            מה לעשות עכשיו?
                        </h4>
                        <ol className="text-sm text-blue-800 space-y-2 mr-5 list-decimal">
                            {!recipientEmail && <li>מלאי את כתובת המייל של המעסיק למעלה</li>}
                            <li>לחצי על "העתקת המייל המלא"</li>
                            <li>פתחי את תוכנת המייל שלך (Gmail, Outlook וכו')</li>
                            <li>צרי מייל חדש והדביקי את כל התוכן</li>
                            <li>בדקי שהכל נראה טוב ושלחי! 🚀</li>
                        </ol>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <Button variant="outline" onClick={onClose}>
                            סגירה
                        </Button>
                        <Button
                            onClick={handleCopy}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={!user?.cv_url || isLoadingCv}
                        >
                            {copied ? (
                                <>
                                    <CheckCircle className="w-4 h-4 ml-2" />
                                    הועתק!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 ml-2" />
                                    העתקת המייל המלא
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}