
import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@/api/entities';
import { Goal } from '@/api/entities';
import { Connection } from '@/api/entities';
import { SocialProfile } from '@/api/entities';
import { Conversation } from '@/api/entities';
import { Message } from '@/api/entities';
import { CommunityPost } from '@/api/entities';
import { UserBadge } from '@/api/entities';
import { PathfinderResponse } from '@/api/entities';
import { CareerReferral } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, Heart, LogOut, ArrowLeft, Sparkles, Briefcase, Users, CheckCircle, BookOpen, Edit, Cake, Settings, MessageCircle, Mail, Gift, Home, Crown, Check, FileText, Star, TrendingUp, Target, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EditProfileForm from '../components/social/EditProfileForm';
import CreateProfileForm from '../components/social/CreateProfileForm';
import EditUserForm from '../components/profile/EditUserForm';
import ExpiredSubscriptionBanner from '../components/profile/ExpiredSubscriptionBanner';
import { hasValidSubscription } from '../components/auth/UserContext';
import { motion } from 'framer-motion';
import { base44 } from "@/api/base44Client";
import CvUploadWidget from '../components/profile/CvUploadWidget';
import ProgressTracker from '../components/profile/ProgressTracker';

export default function MyProfile() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [socialProfile, setSocialProfile] = useState(null);
    const [goals, setGoals] = useState([]);
    const [pathfinderResponse, setPathfinderResponse] = useState(null);
    const [careerReferrals, setCareerReferrals] = useState([]);
    const [friends, setFriends] = useState([]);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [showFullIntro, setShowFullIntro] = useState(false);
    const [activeTab, setActiveTab] = useState('start');
    const [showCvUploadModal, setShowCvUploadModal] = useState(false);

    const loadData = useCallback(async () => {
        try {
            const user = await User.me();
            setCurrentUser(user);

            if (user?.email) {
                let socialProfileData = null;
                
                try {
                    const response1 = await base44.functions.invoke('getUserSocialProfileDirect');
                    if (response1.data?.success && response1.data?.profile) {
                        socialProfileData = response1.data.profile;
                    }
                } catch (err1) {
                    try {
                        const allProfiles = await SocialProfile.list();
                        socialProfileData = allProfiles.find(p => p.email === user.email);
                    } catch (err2) {
                        console.error('Failed to load profile', err2);
                    }
                }
                
                setSocialProfile(socialProfileData);

                const [goalsData, referralsData, pathfinderDataResult] = await Promise.all([
                    Goal.filter({ created_by: user.email }).catch(() => []),
                    CareerReferral.filter({ created_by: user.email }).catch(() => []),
                    PathfinderResponse.filter({ created_by: user.email }).catch(() => []),
                ]);

                setGoals(goalsData || []);
                setCareerReferrals(referralsData || []);
                setPathfinderResponse(pathfinderDataResult?.length > 0 ? pathfinderDataResult[0] : null);

                // Load friends using multiple approaches for reliability
                try {
                    console.log('[MyProfile] 🔍 Loading friends data...');
                    
                    const friendEmails = new Set();
                    
                    // Approach 1: Check sent and received messages
                    try {
                        const [sentMessages, receivedMessages] = await Promise.all([
                            Message.filter({ sender_email: user.email }).catch(() => []),
                            Message.filter({ recipient_email: user.email }).catch(() => []),
                        ]);

                        console.log('[MyProfile] 📧 Sent messages:', sentMessages?.length || 0);
                        console.log('[MyProfile] 📧 Received messages:', receivedMessages?.length || 0);

                        if (sentMessages && sentMessages.length > 0) {
                            sentMessages.forEach(msg => {
                                if (msg.recipient_email && msg.recipient_email !== user.email) {
                                    friendEmails.add(msg.recipient_email);
                                }
                            });
                        }
                        
                        if (receivedMessages && receivedMessages.length > 0) {
                            receivedMessages.forEach(msg => {
                                if (msg.sender_email && msg.sender_email !== user.email) {
                                    friendEmails.add(msg.sender_email);
                                }
                            });
                        }
                    } catch (msgError) {
                        console.log('[MyProfile] ⚠️ Could not load messages:', msgError.message);
                    }

                    // Approach 2: Check Conversations (as backup/additional source)
                    try {
                        const allConversations = await Conversation.list().catch(() => []);
                        console.log('[MyProfile] 💬 Total conversations found:', allConversations?.length || 0);
                        
                        if (allConversations && allConversations.length > 0) {
                            const userConversations = allConversations.filter(conv => 
                                conv.participants && Array.isArray(conv.participants) && conv.participants.includes(user.email)
                            );
                            
                            console.log('[MyProfile] 💬 User conversations:', userConversations.length);
                            
                            userConversations.forEach(conv => {
                                if (conv.participants && Array.isArray(conv.participants)) {
                                    conv.participants.forEach(email => {
                                        if (email !== user.email) {
                                            friendEmails.add(email);
                                        }
                                    });
                                }
                            });
                        }
                    } catch (convError) {
                        console.log('[MyProfile] ⚠️ Could not load conversations:', convError.message);
                    }

                    console.log('[MyProfile] 📋 Unique friend emails found:', Array.from(friendEmails));

                    // Get profiles for these friends
                    if (friendEmails.size > 0) {
                        const allProfiles = await SocialProfile.list().catch(() => []);
                        console.log('[MyProfile] 👥 All profiles:', allProfiles?.length || 0);
                        
                        if (allProfiles && allProfiles.length > 0) {
                            const friendProfiles = allProfiles.filter(profile => 
                                friendEmails.has(profile.email)
                            );
                            
                            console.log('[MyProfile] ✅ Friend profiles found:', friendProfiles.length);
                            setFriends(friendProfiles);
                        } else {
                            console.log('[MyProfile] ℹ️ No profiles loaded');
                            setFriends([]);
                        }
                    } else {
                        console.log('[MyProfile] ℹ️ No friend emails found');
                        setFriends([]);
                    }
                } catch (friendsError) {
                    console.error('[MyProfile] ❌ Error loading friends:', friendsError);
                    setFriends([]);
                }
            }
        } catch (error) {
            console.error('Error loading profile data:', error);
            setCurrentUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (!isLoading && !currentUser) {
            User.login();
        }
    }, [isLoading, currentUser]);

    useEffect(() => {
        if (!isLoading && currentUser && !socialProfile) {
            setShowCreateProfileModal(true);
        }
    }, [isLoading, currentUser, socialProfile]);

    const handleLogout = async () => {
        try {
            await User.logout();
            navigate(createPageUrl("Home"));
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
        );
    }

    if (!socialProfile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-6 sm:py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
                        <Link to={createPageUrl("Home")} className="text-gray-600 hover:text-rose-600 flex items-center gap-2 text-sm sm:text-base">
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            חזרה לדף הבית
                        </Link>
                        <Button onClick={handleLogout} variant="ghost" size="sm" className="text-sm">
                            <LogOut className="w-4 h-4 ml-2" />
                            יציאה
                        </Button>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <Card className="shadow-2xl border-0 bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100">
                            <CardContent className="p-6 sm:p-12 text-center">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                                    <Users className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                                </div>
                                <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                                    🌸 ברוכה הבאה ל-ReStart 50+! 🌸
                                </h1>
                                <p className="text-lg sm:text-2xl text-gray-800 mb-4 sm:mb-6 font-semibold">
                                    שמחים שהצטרפת אלינו! 💕
                                </p>
                                <p className="text-base sm:text-xl text-gray-700 mb-3 sm:mb-4 leading-relaxed max-w-2xl mx-auto px-2">
                                    כדי להתחיל להכיר חברות חדשות ולהיות חלק מהקהילה המדהימה שלנו,
                                    <strong className="text-rose-600"> הצעד הראשון והחשוב ביותר הוא ליצור את הפרופיל הקהילתי שלך.</strong>
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8">
                                    זה לוקח רק 2-3 דקות! ✨
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-3xl mx-auto">
                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-md">
                                        <Users className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500 mx-auto mb-2" />
                                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">הכירי חברות</h3>
                                        <p className="text-xs sm:text-sm text-gray-600">מצאי נשים דומות לך</p>
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-md">
                                        <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mx-auto mb-2" />
                                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">למידה וצמיחה</h3>
                                        <p className="text-xs sm:text-sm text-gray-600">קורסים וסדנאות</p>
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-md">
                                        <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500 mx-auto mb-2" />
                                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">קריירה</h3>
                                        <p className="text-xs sm:text-sm text-gray-600">כלים להצלחה</p>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => setShowCreateProfileModal(true)}
                                    size="lg"
                                    className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-base sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all w-full sm:w-auto"
                                >
                                    <Users className="w-5 h-5 sm:w-6 sm:h-6 ml-3" />
                                    בואי ניצור את הפרופיל שלך עכשיו!
                                </Button>
                                <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">⏱️ לוקח רק 2-3 דקות</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {!hasValidSubscription(currentUser) && (
                        <div className="mt-6 sm:mt-8">
                            <ExpiredSubscriptionBanner user={currentUser} />
                        </div>
                    )}

                    <Dialog open={showCreateProfileModal} onOpenChange={setShowCreateProfileModal}>
                        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
                                    בואי ניצור את הפרופיל שלך ✨
                                </DialogTitle>
                            </DialogHeader>
                            <CreateProfileForm
                                user={currentUser}
                                onSuccess={async () => {
                                    setShowCreateProfileModal(false);
                                    await loadData();
                                }}
                                onCancel={() => setShowCreateProfileModal(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        );
    }

    const hasCv = currentUser?.cv_url;
    const hasRecommendationLetters = currentUser?.recommendation_letters_urls && currentUser.recommendation_letters_urls.length > 0;
    const completedGoals = goals.filter(g => g.status === 'הושלם').length;
    const hasCareerData = careerReferrals.length > 0;
    const hasPathfinderData = pathfinderResponse?.is_complete;

    const tabs = [
        { id: 'start', label: 'המסע שלך', icon: Sparkles },
        { id: 'progress', label: 'בדרך ליעד', icon: TrendingUp },
        { id: 'professional', label: 'הפינה שלך', icon: Crown }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-6 sm:py-12 px-3 sm:px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                        <div className="relative">
                            {socialProfile?.profile_image_url ? (
                                <img src={socialProfile.profile_image_url} alt={socialProfile?.nickname} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg" />
                            ) : (
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                    <span className="text-4xl">👩‍🦰</span>
                                </div>
                            )}
                            
                            {/* Mentor Crown - Only for approved mentors */}
                            {currentUser.is_approved_mentor && (
                                <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                                    <Crown className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-rose-700 mb-1">
                                היי {currentUser.full_name ? currentUser.full_name.split(' ')[0] : 'מהממת'} המהממת
                            </h1>
                            <p className="text-base sm:text-lg text-gray-700">
                                ברוכה הבאה למרחב האישי שלך 🌸
                            </p>
                            <p className="text-sm sm:text-base text-gray-600 mt-1">
                                כאן הכול שלך, שקט, דיסקרטי ובטוח.
                            </p>
                            <p className="text-sm sm:text-base text-gray-600 mt-1">
                                תכנני, עקבי והתקדמי בדרך ובקצב שלך
                            </p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 justify-center mb-8 flex-wrap">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-3 rounded-full font-medium text-sm sm:text-base transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-lg'
                                            : 'bg-white text-gray-600 hover:bg-rose-50'
                                    }`}
                                >
                                    <Icon className="w-4 h-4 inline ml-2" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {!hasValidSubscription(currentUser) && <ExpiredSubscriptionBanner user={currentUser} />}

                {currentUser.subscription_status === 'active' && (
                    <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300">
                        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                            <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 flex-shrink-0" />
                            <div className="flex-grow text-center sm:text-right">
                                <h3 className="text-lg sm:text-2xl font-bold text-blue-800 mb-1 sm:mb-2">את במנוי פרימיום!</h3>
                                <p className="text-sm sm:text-base text-blue-700">את נהנית מגישה מלאה לכל התכנים והכלים.</p>
                            </div>
                            <Button asChild className="bg-blue-600 hover:bg-blue-700 flex-shrink-0 w-full sm:w-auto">
                                <Link to={createPageUrl("Subscribe")}>
                                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                                    פרטי המנוי
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Progress Tracker - Shows user's journey */}
                <ProgressTracker
                    hasSocialProfile={!!socialProfile}
                    hasPathfinder={hasPathfinderData}
                    hasGoals={goals.length > 0}
                    hasCv={hasCv}
                    hasAppointment={false} // We'll need to check appointments later
                    hasCommunityPost={false} // We'll need to check posts later
                />

                {/* Tab Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* המסע שלך */}
                    {activeTab === 'start' && (
                        <>
                            {/* קריירה ופרנסה */}
                            <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white border-2 border-blue-100 relative overflow-hidden">
                                {/* Background Image */}
                                <div 
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{
                                        backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/8ae0884cf__Restart.jpg)',
                                    }}
                                />
                                
                                {/* Dark Overlay for readability */}
                                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />
                                
                                {/* Content */}
                                <CardContent className="p-6 flex flex-col h-full relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 shadow-md border border-white/30">
                                            <Briefcase className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white drop-shadow-lg">קריירה ופרנסה</h3>
                                    </div>
                                    
                                    <div className="space-y-3 mb-4 flex-grow">
                                        <div className="flex items-start gap-2">
                                            {hasCv ? (
                                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5 drop-shadow-md" />
                                            ) : (
                                                <div className="w-5 h-5 border-2 border-white/50 rounded-full flex-shrink-0 mt-0.5" />
                                            )}
                                            <div className="flex-1">
                                                <button 
                                                    onClick={() => setShowCvUploadModal(true)}
                                                    className="text-white hover:text-white/90 transition-colors text-right block mb-1 underline decoration-dotted drop-shadow-md font-medium"
                                                >
                                                    {hasCv ? 'העלית קורות חיים ✓' : 'העלי את קורות החיים שלך'}
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3, duration: 0.5 }}
                                        >
                                            <Link 
                                                to={createPageUrl("CvLinkedInEnhancer")} 
                                                className="group block"
                                            >
                                                <motion.div
                                                    whileHover={{ scale: 1.02, y: -2 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="relative bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-xl p-3 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                                                >
                                                    {/* Background animated gradient */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 via-blue-100/20 to-indigo-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                    
                                                    {/* Sparkle animation */}
                                                    <motion.div
                                                        animate={{
                                                            rotate: [0, 360],
                                                            scale: [1, 1.2, 1]
                                                        }}
                                                        transition={{
                                                            duration: 3,
                                                            repeat: Infinity,
                                                            ease: "easeInOut"
                                                        }}
                                                        className="absolute top-2 left-2 text-yellow-400"
                                                    >
                                                        <Sparkles className="w-5 h-5 drop-shadow-glow" />
                                                    </motion.div>

                                                    <div className="relative flex items-center gap-3 pr-6">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                                                <span className="text-xl">💡</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-bold text-white leading-tight drop-shadow-lg">
                                                                קבלי סיוע מ-ReStart לשדרוג הקו״ח והלינקדאין שלך
                                                            </p>
                                                            <p className="text-xs text-white/90 mt-1 font-medium group-hover:text-white transition-colors drop-shadow-md">
                                                                לחצי לכלי השדרוג המתקדם ←
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Pulse effect on hover */}
                                                    <motion.div
                                                        className="absolute inset-0 border-2 border-white/40 rounded-xl opacity-0 group-hover:opacity-100"
                                                        animate={{
                                                            scale: [1, 1.05, 1],
                                                            opacity: [0, 0.3, 0]
                                                        }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            ease: "easeInOut"
                                                        }}
                                                    />
                                                </motion.div>
                                            </Link>
                                        </motion.div>
                                    </div>
                                    
                                    <Button 
                                        asChild 
                                        className="w-full bg-gradient-to-r from-white/90 to-white/80 hover:from-white hover:to-white/90 text-blue-700 font-bold rounded-full shadow-lg backdrop-blur-sm"
                                    >
                                        <Link to={createPageUrl("CareerReferrals")}>
                                            התחילי עכשיו
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* אסטרולוגיה והשראה אישית */}
                            <Link to={createPageUrl("StarsInsight")} className="block h-full">
                                <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full text-center p-6 flex flex-col items-center justify-between relative overflow-hidden">
                                    {/* Background Image */}
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{
                                            backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/9ec324e7c_.jpg)',
                                        }}
                                    />
                                    
                                    {/* Dark Overlay for readability */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />
                                    
                                    {/* Content */}
                                    <div className="relative z-10 w-full">
                                        <div className="flex items-center gap-3 mb-4 justify-center">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                                                <span className="text-2xl">🌙</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white drop-shadow-lg">אסטרולוגיה<br />והשראה אישית</h3>
                                        </div>
                                        <p className="text-white mb-6 text-center drop-shadow-md font-medium">
                                            גלי מה הכוכבים אומרים על<br />הקריירה שלך השבוע
                                        </p>
                                        <Button className="w-full bg-gradient-to-r from-white/90 to-white/80 hover:from-white hover:to-white/90 text-purple-700 font-bold rounded-full shadow-lg backdrop-blur-sm">
                                            גלי
                                        </Button>
                                    </div>
                                </Card>
                            </Link>

                            {/* הכנה למשרה הבאה שלך (Career Assessment) */}
                            <Card className="shadow-lg hover:shadow-xl transition-shadow text-center p-6 flex flex-col items-center justify-between relative overflow-hidden">
                                {/* Background Image */}
                                <div 
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{
                                        backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/218e815fb_50.jpg)',
                                    }}
                                />
                                
                                {/* Dark Overlay for readability */}
                                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />
                                
                                {/* Content */}
                                <div className="relative z-10 w-full">
                                    <div className="flex items-center gap-3 mb-4 justify-center">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                                            <TrendingUp className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white drop-shadow-lg">הכנה למשרה<br />הבאה שלך</h3>
                                    </div>
                                    <div className="space-y-3 mb-6">
                                        <div className="text-center">
                                            <p className="text-white font-semibold mb-2 drop-shadow-md">מוכנה לגלות את הייעוד הבא שלך?</p>
                                        </div>
                                        
                                        {hasPathfinderData ? (
                                            <Link 
                                                to={createPageUrl("EntrepreneurshipPathfinder")} 
                                                className="flex items-center gap-2 justify-center hover:bg-white/20 p-2 rounded-lg transition-colors backdrop-blur-sm"
                                            >
                                                <span className="text-white drop-shadow-md">השלמת אבחון קריירה ✓</span>
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                            </Link>
                                        ) : (
                                            <Link 
                                                to={createPageUrl("EntrepreneurshipPathfinder")} 
                                                className="flex items-center gap-2 hover:bg-white/20 p-2 rounded-lg transition-colors justify-center backdrop-blur-sm"
                                            >
                                                <span className="text-white font-medium drop-shadow-md">גלי מה מתאים לך, אבחון קריירה מהיר</span>
                                                <Sparkles className="w-5 h-5 text-yellow-400" />
                                            </Link>
                                        )}
                                        
                                        <Link 
                                            to={createPageUrl("InterviewPrepAI")} 
                                            className="group block"
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4, duration: 0.5 }}
                                                className="relative bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-xl p-3 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                                            >
                                                {/* Sparkle animation - top left */}
                                                <motion.div
                                                    animate={{
                                                        rotate: [0, 360],
                                                        scale: [1, 1.2, 1]
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                        delay: 0.5
                                                    }}
                                                    className="absolute top-2 left-2 text-yellow-400"
                                                >
                                                    <Sparkles className="w-4 h-4 drop-shadow-glow" />
                                                </motion.div>

                                                {/* Message Circle icon with pulse */}
                                                <motion.div
                                                    animate={{
                                                        scale: [1, 1.1, 1]
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                    className="absolute top-2 right-2"
                                                >
                                                    <MessageCircle className="w-5 h-5 text-white drop-shadow-glow" />
                                                </motion.div>

                                                <div className="relative flex items-start gap-3 pt-6">
                                                    <div className="flex-1 text-right">
                                                        <p className="text-sm font-bold text-white leading-tight mb-1 drop-shadow-lg">
                                                            התאמני לראיון דרך ReStart
                                                        </p>
                                                        <p className="text-xs text-white/90 font-medium leading-relaxed group-hover:text-white transition-colors drop-shadow-md">
                                                            * אם לא תתאמני, איך תתקבלי? בואי נתאמן יחד!
                                                        </p>
                                                        <div className="mt-2 flex items-center justify-end gap-1 text-xs text-white/80 font-semibold">
                                                            <span className="drop-shadow-md">לחצי להתחיל</span>
                                                            <motion.span
                                                                animate={{ x: [0, 5, 0] }}
                                                                transition={{
                                                                    duration: 1.5,
                                                                    repeat: Infinity,
                                                                    ease: "easeInOut"
                                                                }}
                                                            >
                                                                ←
                                                            </motion.span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
                                                            <span className="text-xl">🎯</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Pulse effect on hover */}
                                                <motion.div
                                                    className="absolute inset-0 border-2 border-white/40 rounded-xl opacity-0 group-hover:opacity-100"
                                                    animate={{
                                                        scale: [1, 1.05, 1],
                                                        opacity: [0, 0.3, 0]
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                            </motion.div>
                                        </Link>
                                    </div>
                                    <Button asChild className="w-full bg-gradient-to-r from-white/90 to-white/80 hover:from-white hover:to-white/90 text-rose-700 font-bold rounded-full shadow-lg backdrop-blur-sm">
                                        <Link to={createPageUrl("EntrepreneurshipPathfinder")}>
                                            {hasPathfinderData ? 'צפי בתוצאות' : 'התחילי אבחון עכשיו'}
                                        </Link>
                                    </Button>
                                </div>
                            </Card>

                            {/* מכתבי המלצה */}
                            <Card className="shadow-lg hover:shadow-xl transition-shadow text-center p-6 flex flex-col items-center justify-between relative overflow-hidden">
                                {/* Background Image */}
                                <div 
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{
                                        backgroundImage: 'url(https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop)',
                                    }}
                                />
                                
                                {/* Dark Overlay for readability */}
                                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />
                                
                                {/* Content */}
                                <div className="relative z-10 w-full">
                                    <div className="flex items-center gap-3 mb-4 justify-center">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                                            <Star className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white drop-shadow-lg">מכתבי המלצה</h3>
                                    </div>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 justify-center">
                                            {hasRecommendationLetters ? (
                                                <>
                                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                                    <span className="text-white drop-shadow-md">יש לך {currentUser.recommendation_letters_urls.length} מכתבי המלצה</span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center border border-white/50">
                                                        <Check className="w-3 h-3 text-white" />
                                                    </div>
                                                    <span className="text-white drop-shadow-md">טרם העלית מכתבי המלצה</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <Button asChild className="w-full bg-gradient-to-r from-white/90 to-white/80 hover:from-white hover:to-white/90 text-green-700 font-bold rounded-full shadow-lg backdrop-blur-sm">
                                        <Link to={createPageUrl("RecommendationLetters")}>
                                            {hasRecommendationLetters ? 'צפי במכתבים' : 'העלי מכתב המלצה'}
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        </>
                    )}

                    {/* בדרך ליעד */}
                    {activeTab === 'progress' && (
                        <>
                            <Card className="shadow-lg hover:shadow-xl transition-shadow text-center p-6 flex flex-col items-center justify-between">
                                <div className="flex items-center gap-3 mb-4 justify-center">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Target className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">המטרות שלי</h3>
                                </div>
                                <p className="text-gray-600 mb-4">יש לך {goals.length} מטרות, {completedGoals} הושלמו</p>
                                <Button asChild className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-full">
                                    <Link to={createPageUrl("PersonalGoals")}>צפי במטרות</Link>
                                </Button>
                            </Card>

                            <Card className="shadow-lg hover:shadow-xl transition-shadow text-center p-6 flex flex-col items-center justify-between">
                                <div className="flex items-center gap-3 mb-4 justify-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">הפניות לקריירה</h3>
                                </div>
                                <p className="text-gray-600 mb-4">{hasCareerData ? `יש לך ${careerReferrals.length} הפניות למעקב` : 'טרם הוספת הפניות'}</p>
                                <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                                    <Link to={createPageUrl("CareerReferrals")}>
                                        {hasCareerData ? 'למעקב' : 'הוסיפי הפניה'}
                                    </Link>
                                </Button>
                            </Card>

                            <Link to={createPageUrl("EntrepreneurshipHub")} className="block h-full">
                                <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full text-center p-6 flex flex-col items-center justify-between">
                                    <div className="flex items-center gap-3 mb-4 justify-center">
                                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <Crown className="w-6 h-6 text-orange-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">המקום לעצמאית</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        הכלים והמדריכים להקמת עסק משלך
                                    </p>
                                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full">
                                        גלי עוד
                                    </Button>
                                </Card>
                            </Link>

                            <Link to={createPageUrl("SocialTinder")} className="block h-full">
                                <Card className="card-hover shadow-lg h-full text-center p-6 flex flex-col items-center justify-between">
                                    <div className="flex items-center gap-3 mb-4 justify-center">
                                        <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                                            <Users className="w-6 h-6 text-rose-600" />
                                        </div>
                                        <h3 className="font-bold mb-2 text-xl">הכירי חברות</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">מצאי נשים דומות לך</p>
                                    <Button className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white rounded-full">
                                        בואי נכיר
                                    </Button>
                                </Card>
                            </Link>
                        </>
                    )}

                    {/* הפינה שלי */}
                    {activeTab === 'professional' && (
                        <>
                            {/* Mentor Dashboard Card - Only for approved mentors */}
                            {currentUser.is_approved_mentor && (
                                <Card className="shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
                                    <CardContent className="p-6 text-center">
                                        <div className="flex items-center justify-center gap-3 mb-4">
                                            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                                <Crown className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                                אזור המנטורית שלך
                                            </h3>
                                        </div>
                                        <p className="text-gray-700 mb-6 text-lg">
                                            כאן תמצאי את לוח הבקרה המלא שלך כמנטורית - ניהול פגישות, מאמרים וע עוד
                                        </p>
                                        <Button asChild size="lg" className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-lg shadow-lg">
                                            <Link to={createPageUrl("MentorDashboard")}>
                                                <Crown className="w-5 h-5 ml-2" />
                                                ללוח הבקרה שלי כמנטורית
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Personal Details Card */}
                            <Card className="shadow-lg hover:shadow-xl transition-shadow text-center p-6 flex flex-col items-center justify-between">
                                <div className="flex items-center gap-3 mb-4 justify-center">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <Settings className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">הפרטים האישיים שלי</h3>
                                </div>
                                <p className="text-gray-600 mb-4">שם, מייל, תאריך לידה ועוד</p>
                                <Button onClick={() => setShowEditUserModal(true)} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-full">
                                    עדכני פרטים
                                </Button>
                            </Card>

                            {/* Social Profile Card */}
                            <Card className="shadow-lg hover:shadow-xl transition-shadow text-center p-6 flex flex-col items-center justify-between">
                                <div className="flex items-center gap-3 mb-4 justify-center">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Users className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">הפרופיל החברתי שלי</h3>
                                </div>
                                <p className="text-gray-600 mb-4">כך חברות הקהילה רואות אותך</p>
                                <Button onClick={() => setShowEditProfileModal(true)} className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-full">
                                    עדכני פרופיל
                                </Button>
                            </Card>

                            {/* Friends List Card - NEW */}
                            <Card className="shadow-lg hover:shadow-xl transition-shadow p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <UserPlus className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">החברות שלי</h3>
                                </div>
                                {friends.length > 0 ? (
                                    <>
                                        <p className="text-gray-600 mb-4">{friends.length} חברות מחוברות</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            {friends.map((friend) => (
                                                <div key={friend.id} className="flex flex-col items-center text-center bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                                                    {friend.profile_image_url ? (
                                                        <img 
                                                            src={friend.profile_image_url} 
                                                            alt={friend.nickname} 
                                                            className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-white shadow-md" 
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full flex items-center justify-center mb-2 border-2 border-white shadow-md">
                                                            <span className="text-2xl">👩‍🦰</span>
                                                        </div>
                                                    )}
                                                    <p className="font-semibold text-gray-800 text-sm">{friend.nickname}</p>
                                                    <p className="text-xs text-gray-500 mb-2">{friend.location}</p>
                                                    <Link to={createPageUrl(`Messages`)}>
                                                        <Button variant="link" size="sm" className="text-rose-500 text-xs">
                                                            שלחי הודעה
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 mb-4">עדיין לא יצרת חיבורים חברתיים</p>
                                        <Button asChild className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white">
                                            <Link to={createPageUrl("SocialTinder")}>
                                                <Users className="w-4 h-4 ml-2" />
                                                הכירי חברות חדשות
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </Card>

                            {/* Community, Bookings, Messages cards */}
                            <Link to={createPageUrl("Community")} className="block h-full">
                                <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full text-center p-6 flex flex-col items-center justify-between">
                                    <div className="flex items-center gap-3 mb-4 justify-center">
                                        <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                                            <MessageCircle className="w-6 h-6 text-rose-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">הקהילה שלך</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">שתפי, שאלי וקבלי תמיכה מהקהילה</p>
                                    <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full">
                                        לקהילה
                                    </Button>
                                </Card>
                            </Link>

                            <Link to={createPageUrl("MyBookings")} className="block h-full">
                                <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full text-center p-6 flex flex-col items-center justify-between">
                                    <div className="flex items-center gap-3 mb-4 justify-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">הפגישות שלי</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">צפי בפגישות קרובות ועבר</p>
                                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                                        לפגישות
                                    </Button>
                                </Card>
                            </Link>

                            <Link to={createPageUrl("Messages")} className="block h-full">
                                <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full text-center p-6 flex flex-col items-center justify-between">
                                    <div className="flex items-center gap-3 mb-4 justify-center">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <MessageCircle className="w-6 h-6 text-green-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">הודעות</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">הודעות מחברות ומנטוריות</p>
                                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full">
                                        להודעות
                                    </Button>
                                </Card>
                            </Link>
                        </>
                    )}
                </div>

                {/* Bottom Navigation Tabs - for easy continuation */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-center text-lg font-semibold text-gray-700 mb-4">המשיכי לחקור</h3>
                    <div className="flex gap-2 justify-center flex-wrap">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`px-6 py-3 rounded-full font-medium text-sm sm:text-base transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-lg'
                                            : 'bg-white text-gray-600 hover:bg-rose-50'
                                    }`}
                                >
                                    <Icon className="w-4 h-4 inline ml-2" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Modals */}
                <Dialog open={showEditProfileModal} onOpenChange={setShowEditProfileModal}>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-xl sm:text-2xl font-bold text-center">עדכון הפרופיל שלך ✨</DialogTitle>
                        </DialogHeader>
                        <EditProfileForm
                            user={currentUser}
                            profile={socialProfile}
                            onSuccess={async () => {
                                setShowEditProfileModal(false);
                                await loadData();
                            }}
                            onCancel={() => setShowEditProfileModal(false)}
                        />
                    </DialogContent>
                </Dialog>

                <Dialog open={showEditUserModal} onOpenChange={setShowEditUserModal}>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-xl sm:text-2xl font-bold text-center">עדכון הפרטים שלך</DialogTitle>
                        </DialogHeader>
                        <EditUserForm 
                            user={currentUser}
                            onSuccess={async () => {
                                setShowEditUserModal(false);
                                await loadData();
                            }}
                            onCancel={() => setShowEditUserModal(false)}
                        />
                    </DialogContent>
                </Dialog>

                <Dialog open={showCvUploadModal} onOpenChange={setShowCvUploadModal}>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl sm:text-2xl font-bold text-center">העלאת קורות חיים 📄</DialogTitle>
                        </DialogHeader>
                        <CvUploadWidget 
                            user={currentUser}
                            onSuccess={async () => {
                                setShowCvUploadModal(false);
                                await loadData();
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
