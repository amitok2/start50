
import React, { useState, useEffect } from 'react';
import { InvokeLLM } from '@/api/integrations';
import { User } from '@/api/entities';
import { Connection } from '@/api/entities';
import { SocialProfile } from '@/api/entities';
import { Message } from '@/api/entities';
import { Conversation } from '@/api/entities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Moon, Star, Sun, Loader2, ArrowLeft, Users as UsersIcon, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const zodiacSigns = [
    { value: 'aries', label: 'טלה', emoji: '♈', dates: '21 במרץ - 19 באפריל' },
    { value: 'taurus', label: 'שור', emoji: '♉', dates: '20 באפריל - 20 במאי' },
    { value: 'gemini', label: 'תאומים', emoji: '♊', dates: '21 במאי - 20 ביוני' },
    { value: 'cancer', label: 'סרטן', emoji: '♋', dates: '21 ביוני - 22 ביולי' },
    { value: 'leo', label: 'אריה', emoji: '♌', dates: '23 ביולי - 22 באוגוסט' },
    { value: 'virgo', label: 'בתולה', emoji: '♍', dates: '23 באוגוסט - 22 בספטמבר' },
    { value: 'libra', label: 'מאזניים', emoji: '♎', dates: '23 בספטמבר - 22 באוקטובר' },
    { value: 'scorpio', label: 'עקרב', emoji: '♏', dates: '23 באוקטובר - 21 בנובמבר' },
    { value: 'sagittarius', label: 'קשת', emoji: '♐', dates: '22 בנובמבר - 21 בדצמבר' },
    { value: 'capricorn', label: 'גדי', emoji: '♑', dates: '22 בדצמבר - 19 בינואר' },
    { value: 'aquarius', label: 'דלי', emoji: '♒', dates: '20 בינואר - 18 בפברואר' },
    { value: 'pisces', label: 'דגים', emoji: '♓', dates: '19 בפברואר - 20 במרץ' }
];

export default function StarsInsight() {
    const [selectedZodiac, setSelectedZodiac] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [insight, setInsight] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [friends, setFriends] = useState([]);
    const [isLoadingFriends, setIsLoadingFriends] = useState(false);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const user = await User.me();
            setCurrentUser(user);
        } catch (error) {
            console.error('Error loading user:', error);
        }
    };

    const getCurrentMonthName = () => {
        const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
        return months[new Date().getMonth()];
    };

    const getSelectedZodiacLabel = () => {
        const zodiac = zodiacSigns.find(z => z.value === selectedZodiac);
        return zodiac ? zodiac.label : '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedZodiac) {
            alert('אנא בחרי את המזל שלך');
            return;
        }

        setIsLoading(true);
        
        try {
            const currentMonth = getCurrentMonthName();
            const zodiacLabel = getSelectedZodiacLabel();
            
            const prompt = `
את יועצת אסטרולוגית חמה, מעצימה ותומכת, שמדברת לנשים בגיל 50+.

המזל: ${zodiacLabel}
החודש הנוכחי: ${currentMonth}

כתבי אבחון אסטרולוגי אישי, קצר ומעצים (2-3 פסקאות) עבור מזל ${zodiacLabel} לחודש ${currentMonth}.

התמקדי ב:
- האנרגיות האסטרולוגיות הייחודיות לחודש זה עבור המזל הזה
- כוח פנימי, חוכמה והזדמנויות חדשות שמתגלות
- המלצות עדינות לפעולה או התבוננות
- מסר מעצים ומלא תקווה

השתמשי בטון חם ואישי. דברי ישירות אל הלב.
אל תכתבי נבואות ספציפיות - רק השראה והכוונה עדינה.
אל תכתבי משפטים טכניים כמו "לפי האסטרולוגיה" - דברי ישירות.
            `;

            const result = await InvokeLLM({
                prompt: prompt
            });
            
            setInsight(result);
        } catch (error) {
            console.error('Error generating insight:', error);
            alert('אירעה שגיאה ביצירת האבחון. אנא נסי שוב.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadFriends = async () => {
        if (!currentUser) return;
        
        setIsLoadingFriends(true);
        try {
            const allConnections = await Connection.list();
            const userConnections = allConnections.filter(c => 
                c.requester_email === currentUser.email || c.recipient_email === currentUser.email
            );
            
            if (userConnections.length > 0) {
                const friendEmails = [...new Set(
                    userConnections.map(c => 
                        c.requester_email === currentUser.email ? c.recipient_email : c.requester_email
                    )
                )];
                
                const allProfiles = await SocialProfile.list();
                const friendProfiles = allProfiles.filter(p => friendEmails.includes(p.email));
                setFriends(friendProfiles);
            } else {
                setFriends([]);
            }
        } catch (error) {
            console.error('Error loading friends:', error);
            alert('אירעה שגיאה בטעינת רשימת החברות');
        } finally {
            setIsLoadingFriends(false);
        }
    };

    const handleShareClick = () => {
        setShowShareModal(true);
        loadFriends();
    };

    const handleSendToFriend = async (friend) => {
        if (!currentUser || !insight) return;
        
        setIsSending(true);
        try {
            const conversationId = `${currentUser.email}_${friend.email}_${Date.now()}`;
            
            const allConversations = await Conversation.list();
            const existingConversation = allConversations.find(conv => 
                Array.isArray(conv.participants) &&
                conv.participants.includes(currentUser.email) && 
                conv.participants.includes(friend.email)
            );

            const messagePreview = `${currentUser.full_name || 'חברה'} שיתפה איתך השראה מהכוכבים ✨`;
            const now = new Date().toISOString();

            if (existingConversation) {
                await Conversation.update(existingConversation.id, {
                    last_message_date: now,
                    last_message_preview: messagePreview,
                    unread_count: {
                        ...existingConversation.unread_count,
                        [friend.email]: (existingConversation.unread_count?.[friend.email] || 0) + 1
                    }
                });
            } else {
                await Conversation.create({
                    conversation_id: conversationId,
                    participants: [currentUser.email, friend.email],
                    participant_names: [currentUser.full_name || 'חברה', friend.nickname],
                    last_message_date: now,
                    last_message_preview: messagePreview,
                    unread_count: {
                        [friend.email]: 1,
                        [currentUser.email]: 0
                    },
                    is_active: true
                });
            }
            
            await Message.create({
                sender_email: currentUser.email,
                sender_name: currentUser.full_name || 'חברה',
                recipient_email: friend.email,
                recipient_name: friend.nickname,
                subject: '✨ חברה שלך שיתפה איתך השראה מהכוכבים',
                content: `היי ${friend.nickname},\n\nראי את ההשראה שקיבלתי החודש:\n\n${insight}\n\n💫\n\nשתהיה לך יום מלא באור! 🌟`,
                message_type: 'direct_message',
                conversation_id: existingConversation ? existingConversation.conversation_id : conversationId
            });
            
            try {
                const { createNotification } = await import('@/api/functions');
                
                const insightPreview = insight.length > 100 
                    ? `${insight.substring(0, 100)}...` 
                    : insight;
                
                await createNotification({
                    recipient_email: friend.email,
                    title: `${currentUser.full_name || 'חברה'} שיתפה איתך השראה מהכוכבים ✨`,
                    message: `"${insightPreview}"\n\nלחצי כאן לקריאת המסר המלא.`,
                    type: 'message',
                    action_url: `${window.location.origin}${createPageUrl('Messages')}`,
                    sender_name: currentUser.full_name || 'חברה',
                    priority: 'normal'
                });
                console.log('[StarsInsight] ✅ Notification created successfully');
            } catch (notificationError) {
                console.error('[StarsInsight] ⚠️ Could not create notification:', notificationError);
            }
            
            alert(`המסר נשלח בהצלחה ל-${friend.nickname}! 💫`);
            setShowShareModal(false);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('אירעה שגיאה בשליחת ההודעה. אנא נסי שוב.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 relative overflow-hidden">
            {/* Background stars animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-white opacity-60"
                        initial={{ 
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                            scale: Math.random() * 0.5 + 0.5
                        }}
                        animate={{
                            y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
                            opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    >
                        ✨
                    </motion.div>
                ))}
            </div>

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Back button */}
                <div className="mb-6">
                    <Link to={createPageUrl("MyProfile")}>
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            חזרה לפרופיל
                        </Button>
                    </Link>
                </div>

                {/* Hero Image */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <img 
                        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/9ec324e7c_.jpg"
                        alt="אסטרולוגיה"
                        className="w-48 h-48 mx-auto rounded-full object-cover border-4 border-white shadow-2xl mb-6"
                    />
                    <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
                        מה הכוכבים מספרים לך החודש ✨
                    </h1>
                    <p className="text-xl text-purple-700 leading-relaxed">
                        אבחון אסטרולוגי אישי לחודש {getCurrentMonthName()}
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!insight ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
                                <CardContent className="p-8">
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                            בחרי את המזל שלך
                                        </h2>
                                        <p className="text-gray-600">
                                            קבלי אבחון אישי ומעצים לחודש הנוכחי
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <Label htmlFor="zodiac" className="text-lg mb-3 block text-center">
                                                אני מזל... 🌟
                                            </Label>
                                            <Select value={selectedZodiac} onValueChange={setSelectedZodiac}>
                                                <SelectTrigger className="text-lg h-14">
                                                    <SelectValue placeholder="בחרי את המזל שלך" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {zodiacSigns.map((sign) => (
                                                        <SelectItem key={sign.value} value={sign.value}>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-2xl">{sign.emoji}</span>
                                                                <div>
                                                                    <div className="font-semibold">{sign.label}</div>
                                                                    <div className="text-xs text-gray-500">{sign.dates}</div>
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                            <p className="text-sm text-purple-800 text-center">
                                                🔮 האבחון שלך יתבסס על האנרגיות האסטרולוגיות של חודש {getCurrentMonthName()}
                                            </p>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isLoading || !selectedZodiac}
                                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-6 rounded-full shadow-lg"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                                                    יוצרת את האבחון שלך...
                                                </>
                                            ) : (
                                                <>
                                                    גלי
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Card className="bg-gradient-to-br from-white via-purple-50 to-pink-50 shadow-2xl border-0">
                                <CardContent className="p-8">
                                    <div className="text-center mb-8">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200 }}
                                            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mb-4"
                                        >
                                            <span className="text-4xl">
                                                {zodiacSigns.find(z => z.value === selectedZodiac)?.emoji}
                                            </span>
                                        </motion.div>
                                        <h2 className="text-3xl font-bold text-purple-900 mb-2">
                                            האבחון שלך לחודש {getCurrentMonthName()}
                                        </h2>
                                        <p className="text-lg text-purple-700">
                                            מזל {getSelectedZodiacLabel()}
                                        </p>
                                    </div>

                                    <div className="prose prose-lg max-w-none text-right mb-8">
                                        <div className="bg-white/70 p-6 rounded-2xl shadow-inner border-2 border-purple-200">
                                            <p className="text-gray-800 leading-relaxed whitespace-pre-line text-lg">
                                                {insight}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Decorative icons */}
                                    <div className="flex justify-center gap-8 mb-8">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Star className="w-8 h-8 text-yellow-500" />
                                        </motion.div>
                                        <motion.div
                                            animate={{ y: [-5, 5] }}
                                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                        >
                                            <Moon className="w-8 h-8 text-purple-500" />
                                        </motion.div>
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <Sun className="w-8 h-8 text-orange-500" />
                                        </motion.div>
                                    </div>

                                    {/* Call to action - Share with friend */}
                                    <div className="flex justify-center">
                                        <Button
                                            onClick={handleShareClick}
                                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full"
                                        >
                                            <UsersIcon className="w-4 h-4 ml-2" />
                                            שתפי את ההשראה עם חברה
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Bottom Back Button */}
                {insight && (
                    <div className="text-center mt-12">
                        <Link to={createPageUrl("MyProfile")}>
                            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg">
                                <ArrowLeft className="w-5 h-5 ml-2" />
                                חזרה למקום הפרטי שלי
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Share with Friend Modal */}
            <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl">
                            שתפי את ההשראה עם חברה 💫
                        </DialogTitle>
                    </DialogHeader>
                    
                    {isLoadingFriends ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                        </div>
                    ) : friends.length === 0 ? (
                        <div className="text-center py-8">
                            <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">
                                עדיין אין לך חברות ברשימה
                            </p>
                            <Button asChild variant="outline">
                                <Link to={createPageUrl("SocialTinder")}>
                                    הכירי חברות חדשות
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <ScrollArea className="h-96 pr-4">
                            <div className="space-y-3">
                                {friends.map(friend => (
                                    <div 
                                        key={friend.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center overflow-hidden">
                                                {friend.profile_image_url ? (
                                                    <img 
                                                        src={friend.profile_image_url} 
                                                        alt={friend.nickname}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-white text-xl">👩</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{friend.nickname}</p>
                                                <p className="text-sm text-gray-500">{friend.location}</p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => handleSendToFriend(friend)}
                                            disabled={isSending}
                                            size="sm"
                                            className="bg-purple-600 hover:bg-purple-700"
                                        >
                                            {isSending ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4 ml-1" />
                                                    שלחי
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
