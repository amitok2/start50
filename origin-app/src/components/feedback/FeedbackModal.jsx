import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Send } from 'lucide-react';
import { submitFeedback } from '@/api/functions';

export default function FeedbackModal({ isOpen, onClose }) {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('[FeedbackModal] 📝 Starting feedback submission...');
        
        setIsSubmitting(true);
        
        try {
            const currentUrl = window.location.href;
            
            console.log('[FeedbackModal] 🚀 Calling backend function...');
            const { data } = await submitFeedback({
                subject: subject,
                message: message,
                page_url: currentUrl
            });
            
            if (data.success) {
                console.log('[FeedbackModal] ✅ Feedback submitted successfully');
                alert('תודה רבה על הפידבק! 🙏\n\nהמשוב שלך חשוב לנו מאוד ויעזור לנו לשפר את החוויה שלך באפליקציה.');
                
                setSubject('');
                setMessage('');
                onClose();
            } else {
                throw new Error(data.error || 'Unknown error');
            }
            
        } catch (error) {
            console.error('[FeedbackModal] ❌ Error submitting feedback:', error);
            alert('אופס! משהו השתבש. אנא נסי שוב או פני אלינו ישירות במייל: restart@rse50.co.il');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold text-gray-900">
                        💬 שיתוף פידבק על גרסת הבטא
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <Label htmlFor="subject">נושא</Label>
                        <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="למשל: באג בדף הפרופיל, רעיון לשיפור..."
                            required
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="message">הודעה</Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="ספרי לנו מה עובד מצוין, מה צריך שיפור, או כל רעיון שיש לך..."
                            rows={6}
                            required
                        />
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-800">
                        <p className="mb-2">💡 <strong>טיפ:</strong> ככל שתהיי יותר ספציפית, כך נוכל לעזור טוב יותר!</p>
                        <p className="text-xs">הפידבק שלך נשלח למנהלת האפליקציה ויטופל בהקדם.</p>
                    </div>
                    
                    <div className="flex gap-3 justify-end pt-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            ביטול
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                    שולח...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 ml-2" />
                                    שליחה
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}