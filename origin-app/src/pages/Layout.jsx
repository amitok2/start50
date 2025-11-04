


import React, { useState, useEffect, createContext, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { Home, BookOpen, Users, Heart, MessageCircle, HeartHandshake, LogOut, Crown, Globe, Wand2, HelpCircle, Sparkles, ChevronDown, Gift, Library, Shield, Bell, Mic, Facebook, Linkedin, Instagram, Mail, Edit, Loader2, AlertTriangle, RefreshCw, Settings, Calendar, Menu, X, UserPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import NotificationCenter from "../components/notifications/NotificationCenter";
import FeedbackModal from '../components/feedback/FeedbackModal';
import { Notification } from "@/api/entities";
import { UserContext, isUserAdmin } from './components/auth/UserContext';
import { sendWelcomeEmailToNewUser } from "@/api/functions"; // Import the backend function

const navigationItems = [
  { title: "בית", url: createPageUrl("Home"), icon: Home },
  { title: "פעילויות וחוויות", url: createPageUrl("CoursesAndEvents"), icon: BookOpen },
  { title: "מאמרים ותובנות", url: createPageUrl("Articles"), icon: BookOpen },
  { title: "למה להצטרף", url: createPageUrl("Faq"), icon: HelpCircle },
];

const servicesItems = [
  { title: "להכיר חברות", url: createPageUrl("SocialTinder"), icon: HeartHandshake, description: "יצירת קשרים וחברויות משמעותיים" },
  { title: "קורסים והכשרות", url: createPageUrl("CoursesAndEvents"), icon: BookOpen, description: "למידה חדשה והתפתחות מקצועית" },
  { title: "ספריית משאבים ליזמות", url: createPageUrl("ResourceLibrary"), icon: Library, description: "חלמת להיות עצמאית בגיל 50? כל הכלים שצריך כאן" },
  { title: "קהילה ופורומים", url: createPageUrl("Community"), icon: Users, description: "שיתוף, תמיכה ושיחות מעשירות" }, // Fixed: Added icon: Users
  { title: "תעבירי את זה הלאה", url: createPageUrl("PayItForward"), icon: Gift, description: "מתנות, טיפים והזדמנויות לקהילה" },
  { title: "מאמנות ויועצות", url: createPageUrl("CoachesAndConsultants"), icon: Crown, description: "מקבלת ליווי מקצועי ממאמנות ויועצות מומחיות" }
];

const joinAsProviderItems = [
  { title: "הצטרפי כמומחית (מנטורית/מאמנת)", url: createPageUrl("BecomeMentor"), icon: Crown, description: "חלקי מהידע והניסיון שלך בליווי מקצועי" },
  { title: "הצטרפי כמרצה", url: createPageUrl("BecomeInstructor"), icon: Mic, description: "הציעי קורס או סדנה משלך" },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [openAnswer, setOpenAnswer] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showProfileBubble, setShowProfileBubble] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Add Google Site Verification meta tag
  useEffect(() => {
    const metaTag = document.createElement('meta');
    metaTag.name = 'google-site-verification';
    metaTag.content = 'sThOeNOe-CZMTbIhlUlM-7C6WLcnVdSAtT6Fx_46BmQ';
    document.head.appendChild(metaTag);
    
    return () => {
      if (document.head.contains(metaTag)) {
        document.head.removeChild(metaTag);
      }
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const checkUserStatus = useCallback(async () => {
    console.log('[Layout.js] 🔄 Starting user status check...');
    setIsLoadingUser(true);
    
    try {
        console.log('[Layout.js] 🔐 Attempting to authenticate user...');
        let user = await User.me();

        if (user) {
            console.log('[Layout.js] ✅ User authenticated successfully:', {
                email: user.email,
                role: user.role,
                subscription_status: user.subscription_status,
                subscription_type: user.subscription_type,
                subscription_end_date: user.subscription_end_date
            });
            
            // Determine if trial setup is needed
            let needsTrialSetup = false;
            if (!user.subscription_status || user.subscription_status === 'inactive') {
                needsTrialSetup = true;
            } else if (user.subscription_status === 'active' && user.subscription_end_date) {
                const endDate = new Date(user.subscription_end_date);
                const now = new Date();
                if (endDate < now) { // Subscription has expired
                    needsTrialSetup = true;
                }
            } else if (user.subscription_status === 'active' && !user.subscription_end_date && user.subscription_type !== 'trial') {
                // Active user without end date (non-trial), assume valid.
                needsTrialSetup = false;
            }

            if (needsTrialSetup) {
                console.log('[Layout.js] ⚠️ User requires trial setup or existing subscription is invalid. Attempting to set up trial...');
                try {
                    // Call the backend function directly
                    const response = await sendWelcomeEmailToNewUser({
                        userEmail: user.email,
                        userName: user.full_name || user.email
                    });
                    
                    if (response.status === 'success') {
                        console.log('[Layout.js] ✅ Trial subscription (or status check) processed successfully! Re-fetching user data...');
                        user = await User.me(); // Re-fetch user to get updated subscription status
                        console.log('[Layout.js] ✅ User data refreshed after trial processing:', {
                            subscription_status: user.subscription_status,
                            subscription_type: user.subscription_type,
                            subscription_end_date: user.subscription_end_date
                        });
                        
                    } else {
                        console.error('[Layout.js] ❌ Failed to process trial setup. Response:', response);
                    }
                } catch (trialError) {
                    console.error('[Layout.js] ❌ Error processing trial subscription:', trialError);
                }
            } else {
                console.log('[Layout.js] ✅ User has a valid active subscription. No trial setup needed.');
            }
            
            setCurrentUser(user);

            let validSubscription = false;
            if (user.subscription_status === 'active') {
                if (user.subscription_end_date) {
                    const endDate = new Date(user.subscription_end_date);
                    const now = new Date();
                    if (endDate > now) {
                        validSubscription = true;
                    }
                } else {
                    validSubscription = true; // Assume indefinite if active but no end date
                }
            }
            setIsSubscribed(validSubscription);
            
            if (user.email) {
                try {
                    console.log('[Layout.js] 🔔 Starting to load notifications for:', user.email);
                    
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    console.log('[Layout.js] 🔍 Attempting to load ALL notifications for debugging...');
                    const allNotifications = await Notification.filter(
                        { recipient_email: user.email },
                        '-created_date',
                        100
                    );
                    console.log('[Layout.js] 📊 TOTAL notifications found for user:', allNotifications.length);
                    
                    if (allNotifications.length > 0) {
                        console.log('[Layout.js] 📋 First 3 notifications sample:', allNotifications.slice(0, 3));
                        
                        const unreadNotifications = allNotifications.filter(n => !n.is_read);
                        console.log('[Layout.js] ✅ Unread notifications count:', unreadNotifications.length);
                        
                        if (unreadNotifications.length > 0) {
                            console.log('[Layout.js] 🔍 Unread notification IDs:', unreadNotifications.map(n => n.id));
                            console.log('[Layout.js] 🔍 First unread notification:', unreadNotifications[0]);
                        }
                        
                        setUnreadNotificationsCount(unreadNotifications.length);
                    } else {
                        console.log('[Layout.js] ⚠️ NO notifications found at all for this user');
                        setUnreadNotificationsCount(0);
                    }
                } catch (notificationError) {
                    console.error('[Layout.js] ❌ Critical error loading notifications');
                    console.error('[Layout.js] 🔍 Error name:', notificationError.name);
                    console.error('[Layout.js] 🔍 Error message:', notificationError.message);
                    console.error('[Layout.js] 🔍 Error stack:', notificationError.stack);
                    setUnreadNotificationsCount(0);
                }
            }
        } else {
            console.log('[Layout.js] ℹ️ No user authenticated - guest mode');
            setCurrentUser(null);
            setIsSubscribed(false);
            setUnreadNotificationsCount(0);
        }
    } catch (error) {
        console.warn('[Layout.js] ⚠️ User authentication check failed:', {
            message: error.message,
            status: error.status || error.response?.status
        });
        
        setCurrentUser(null);
        setIsSubscribed(false);
        setUnreadNotificationsCount(0);
        
        if (error.message?.includes('401')) {
            console.log('[Layout.js] 🔒 User not logged in (normal for public pages)');
        } else {
            console.warn('[Layout.js] ⚠️ Unexpected auth error, but continuing...');
        }
    } finally {
        setIsLoadingUser(false);
        console.log('[Layout.js] 🏁 User status check completed');
    }
  }, []);

  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  useEffect(() => {
    if (currentUser && !isLoadingUser) {
      const bubbleKey = 'restart50_profile_bubble_v3';
      const hasSeenBubble = localStorage.getItem(bubbleKey);

      if (!hasSeenBubble) {
        setTimeout(() => {
          setShowProfileBubble(true);
          localStorage.setItem(bubbleKey, 'true');
        }, 1000);
      } else {
        setShowProfileBubble(true);
      }
    } else {
      setShowProfileBubble(false);
    }
  }, [currentUser, isLoadingUser]);

  const handleLogout = async () => {
    try {
      await User.logout();
      setCurrentUser(null);
      setIsSubscribed(false);
      setUnreadNotificationsCount(0);
      localStorage.removeItem('restart50_profile_bubble_v3');
      navigate(createPageUrl("Home"));
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleLoginClick = async () => {
    setIsLoggingIn(true);
    try {
        await User.login();
    } catch (error) {
        console.error("Login initiation failed", error);
        alert("לא ניתן להתחיל בתהליך ההתחברות. נסו לרענן את הדף.");
    } finally {
        setIsLoggingIn(false);
    }
  };

  const getDisplayName = () => {
    if (currentUser && currentUser.full_name) {
      return currentUser.full_name.split(' ')[0];
    }
    return 'משתמשת';
  };

  const getSubscriptionBadge = () => {
    if (currentUser && currentUser.subscription_status === 'active') {
      if (!currentUser.subscription_end_date || new Date(currentUser.subscription_end_date) > new Date()) {
        return currentUser.subscription_plan === 'premium' ? 'מנויה פרימיום' : 'מנויה בסיסי';
      }
    }
    return null;
  };

  const toggleAnswer = (index) => {
    setOpenAnswer(openAnswer === index ? null : index);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };
  
  const handleMobileMenuToggle = () => {
    console.log('Mobile menu toggle clicked, current state:', mobileMenuOpen);
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <UserContext.Provider value={{ currentUser, isSubscribed, isLoadingUser, checkUserStatus, unreadNotificationsCount, setUnreadNotificationsCount }}>
      <div dir="rtl" className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
        <style>
          {`
          :root {
            --primary-rose: #f43f5e;
            --primary-pink: #ec4899;
            --secondary-orange: #fb923c;
            --accent-purple: #8b5cf6;
            --warm-cream: #fefcf0;
            --soft-gray: #f8fafc;
          }
          
          * {
            direction: rtl;
          }
          
          html, body {
            direction: rtl;
            text-align: right;
          }
          
          input, textarea, select {
            direction: rtl;
            text-align: right;
          }
          
          .gradient-text {
            background: linear-gradient(135deg, var(--primary-rose), var(--primary-pink));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .card-hover {
            transition: all 0.3s ease;
          }
          
          .card-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04);
          }
          
          .flex {
            direction: ltr;
          }
          
          .flex > * {
            direction: rtl;
          }
          
          .lucide {
            margin-left: 0.5rem;
            margin-right: 0;
          }
          
          button .lucide {
            margin-left: 0.5rem;
            margin-right: 0;
          }
          
          ::placeholder {
            text-align: right;
            direction: rtl;
          }

          .beta-pulse-light {
            animation: beta-pulse-light 2.5s infinite;
          }
          
          @keyframes beta-pulse-light {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.4);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 0 10px rgba(236, 72, 153, 0);
            }
          }

          @keyframes bubble-appear {
            0% {
              opacity: 0;
              transform: translateY(-10px) scale(0.9);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes bubble-gentle-pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.03);
            }
          }

          .profile-bubble {
            animation: bubble-appear 0.5s ease-out, bubble-gentle-pulse 3s ease-in-out infinite 0.5s;
          }

          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0.8;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .mobile-menu-enter {
            animation: slideInRight 0.3s ease-out forwards;
          }

          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          .animate-shimmer {
            animation: shimmer 2s infinite;
          }

          @media (max-width: 640px) {
            h1 { font-size: 1.5rem; }
            h2 { font-size: 1.25rem; }
            h3 { font-size: 1.1rem; }
          }

          body {
            overflow-x: hidden;
          }
          
          .mobile-menu-overlay {
            position: fixed;
            top: 64px;
            right: 0;
            bottom: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 998;
          }
          
          .mobile-menu-panel {
            position: fixed;
            top: 64px;
            right: 0;
            bottom: 0;
            width: 320px;
            max-width: 90vw;
            background: white;
            overflow-y: auto;
            z-index: 999;
            box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
          }
          `}
        </style>

        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to={createPageUrl("Home")} className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">ReStart 50+</h1>
                  <p className="text-xs text-gray-500">מתחילות מחדש ביחד</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {currentUser && (
                  <>
                    {navigationItems.map((item) => (
                      <Link
                        key={item.title}
                        to={item.url}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                          location.pathname === item.url
                            ? "bg-rose-100 text-rose-700"
                            : "text-gray-600 hover:bg-rose-50"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                    
                    <Link
                      to={createPageUrl("Messages")}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                        location.pathname === createPageUrl("Messages")
                          ? "bg-rose-100 text-rose-700"
                          : "text-gray-600 hover:bg-rose-50"
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>הודעות</span>
                    </Link>

                    {/* Services Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:bg-rose-50 text-sm">
                          <Sparkles className="w-4 h-4" />
                          <span>מה מחכה לך כאן</span>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-80" align="end">
                        <div className="p-2">
                          <h3 className="font-bold text-center mb-2">מה מחכה לך כאן</h3>
                          {servicesItems.map((service) => (
                            <DropdownMenuItem key={service.title} asChild>
                              <Link to={service.url} className="flex items-start gap-3 p-3 rounded-lg hover:bg-rose-50">
                                <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                                  <service.icon className="w-4 h-4 text-rose-600" />
                                </div>
                                <div>
                                  <div className="font-medium">{service.title}</div>
                                  <div className="text-xs text-gray-500">{service.description}</div>
                                </div>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Provider Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:bg-purple-50 text-sm">
                          <Wand2 className="w-4 h-4" />
                          <span>נותנת שירות</span>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-80" align="end">
                        <div className="p-2">
                          <h3 className="font-bold text-center mb-2">הצטרפי כנותנת שירות</h3>
                          {joinAsProviderItems.map((item) => (
                            <DropdownMenuItem key={item.title} asChild>
                              <Link to={item.url} className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                  <item.icon className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                  <div className="font-medium">{item.title}</div>
                                  <div className="text-xs text-gray-500">{item.description}</div>
                                </div>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {currentUser.user_type === 'mentor' && currentUser.is_approved_mentor && (
                      <>
                        <Link to={createPageUrl("MentorDashboard")} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-purple-50">
                          <Crown className="w-4 h-4" />
                          <span>אזור המנטורית</span>
                        </Link>
                        <Link to={createPageUrl("WriteArticle")} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-purple-50">
                          <Edit className="w-4 h-4" />
                          <span>כתיבת מאמר</span>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </nav>

              <div className="flex items-center gap-2">
                {currentUser && (
                  <button
                    onClick={handleMobileMenuToggle}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="תפריט"
                  >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                )}

                {currentUser && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </Button>
                )}

                {currentUser && isUserAdmin(currentUser) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Shield className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("AdminDashboard")}>לוח בקרה</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("ManageUsers")}>ניהול משתמשות</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("ManageCommunityPosts")}>ניהול פוסטים</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("ManageArticles")}>ניהול מאמרים</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("ManageCourses")}>ניהול קורסים</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {currentUser ? (
                  <>
                    <div className="hidden lg:block text-sm text-gray-600">
                      שלום, {getDisplayName()}
                    </div>
                    
                    <Link to={createPageUrl("MyProfile")}>
                      <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center cursor-pointer">
                        <span className="text-white text-xl">👩‍🦰</span>
                      </div>
                    </Link>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Settings className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={createPageUrl("MyBookings")}>
                            <Calendar className="w-4 h-4 ml-2" />
                            הפגישות שלי
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-rose-600">
                          <LogOut className="w-4 h-4 ml-2" />
                          יציאה
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleLoginClick}
                      disabled={isLoggingIn}
                      className="text-gray-600 hover:text-rose-600 px-4 py-2 text-sm"
                    >
                      {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : 'התחברות'}
                    </button>
                    <Link to={createPageUrl("Join")}>
                      <button className="bg-gradient-to-r from-rose-400 to-pink-500 text-white px-6 py-2 rounded-full text-sm">
                        הצטרפי אלינו
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {currentUser && mobileMenuOpen && (
          <>
            <div className="mobile-menu-overlay lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="mobile-menu-panel mobile-menu-enter lg:hidden">
              <div className="p-4">
                <div className="bg-rose-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👩‍🦰</span>
                    </div>
                    <div>
                      <div className="font-bold">שלום, {getDisplayName()}!</div>
                      {getSubscriptionBadge() && (
                        <div className="text-xs text-purple-600">{getSubscriptionBadge()}</div>
                      )}
                    </div>
                  </div>
                  <Link to={createPageUrl("MyProfile")} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-rose-500">למקום האישי שלי</Button>
                  </Link>
                </div>

                <div className="space-y-1 mb-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-rose-50"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                  <Link
                    to={createPageUrl("Messages")}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-rose-50"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>הודעות</span>
                  </Link>
                </div>

                <div className="mb-4">
                  <h3 className="font-bold px-4 mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-rose-500" />
                    מה מחכה לך כאן
                  </h3>
                  {servicesItems.map((service) => (
                    <Link
                      key={service.title}
                      to={service.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-rose-50"
                    >
                      <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <service.icon className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{service.title}</div>
                        <div className="text-xs text-gray-500">{service.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mb-4">
                  <h3 className="font-bold px-4 mb-2 flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-purple-500" />
                    הצטרפי כנותנת שירות
                  </h3>
                  {joinAsProviderItems.map((item) => (
                    <Link 
                      key={item.title}
                      to={item.url} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-purple-50"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>

                {currentUser.user_type === 'mentor' && currentUser.is_approved_mentor && (
                  <div className="border-t pt-4 mb-4">
                    <Link
                      to={createPageUrl("MentorDashboard")}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-50"
                    >
                      <Crown className="w-5 h-5" />
                      <span>אזור המנטורית</span>
                    </Link>
                    <Link
                      to={createPageUrl("WriteArticle")}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 mt-1"
                    >
                      <Edit className="w-5 h-5" />
                      <span>כתיבת מאמר</span>
                    </Link>
                  </div>
                )}

                <div className="border-t pt-4">
                  <Link
                    to={createPageUrl("MyBookings")}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>הפגישות שלי</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-rose-600 hover:bg-rose-50 w-full text-right"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>יציאה</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {currentUser && (
          <NotificationCenter 
            isOpen={showNotifications} 
            onClose={() => {
              setShowNotifications(false);
              checkUserStatus();
            }} 
          />
        )}
        
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-rose-100 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold gradient-text">ReStart 50+</span>
                </div>
                <p className="text-gray-600 mb-4">
                  התחילי מחדש! לא רק לנשים בגיל 50, אלא לכל מי שמאמינה שצמיחה, קריירה וחיבורים חברתיים מתחילים בכל גיל.
                </p>
                <a href="mailto:restart@rse50.co.il" className="flex items-center gap-2 text-rose-600 hover:text-rose-700">
                  <MessageCircle className="w-5 h-5" />
                  <span>ליצירת קשר</span>
                </a>
                <div className="flex gap-4 mt-6">
                  <a href="https://www.facebook.com/DIGITAL2U2U" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href="https://www.linkedin.com/company/rstart/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700">
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a href="https://www.instagram.com/restartup7?igsh=dzBjNjk3bWt2N2Zy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500">
                    <Instagram className="w-6 h-6" />
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">קישורים מהירים</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to={createPageUrl("CoursesAndEvents")} className="text-gray-600 hover:text-rose-600">קורסים ואירועים</Link></li>
                  <li><Link to={createPageUrl("SocialTinder")} className="text-gray-600 hover:text-rose-600">קשרים חברתיים</Link></li>
                  <li><Link to={createPageUrl("Community")} className="text-gray-600 hover:text-rose-600">קהילה</Link></li>
                  <li><Link to={createPageUrl("MyProfile")} className="text-gray-600 hover:text-rose-600">המקום הפרטי שלי</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">יצירת קשר</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="mailto:restart@rse50.co.il" className="text-gray-600 hover:text-rose-600">restart@rse50.co.il</a></li>
                  <li><Link to={createPageUrl("Faq")} className="text-gray-600 hover:text-rose-600">שאלות נפוצות</Link></li>
                  <li><Link to={createPageUrl("Privacy")} className="text-gray-600 hover:text-rose-600">מדיניות פרטיות</Link></li>
                  <li><Link to={createPageUrl("TermsOfService")} className="text-gray-600 hover:text-rose-600">תקנון שימוש</Link></li>
                  <li><Link to={createPageUrl("Accessibility")} className="text-gray-600 hover:text-rose-600">הצהרת נגישות</Link></li>
                </ul>
              </div>
            </div>
            
            {/* Beta Feedback Section */}
            <div className="border-t border-gray-200 mt-8 pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-right flex-1">
                  <p className="text-gray-500 text-sm">
                    © 2024 ReStart 50+. כל הזכויות שמורות.
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  <button 
                    onClick={() => setShowFeedbackModal(true)}
                    className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🧪</span>
                      <div className="text-right">
                        <div className="text-sm font-bold">גרסת בטא</div>
                        <div className="text-xs">יש לך פידבק? לחצי כאן</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {currentUser && <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />}

        <div className="fixed bottom-20 left-5 z-50">
          <button 
            onClick={toggleChat}
            className="w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center text-2xl"
          >
            💬
          </button>

          {showChat && (
            <div className="absolute bottom-16 left-0 w-80 bg-white rounded-2xl shadow-2xl border">
              <div className="bg-purple-600 text-white p-4 text-center font-semibold">
                איך נוכל לעזור?
              </div>
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                <div>
                  <button 
                    onClick={() => toggleAnswer(0)}
                    className="w-full text-right bg-gray-100 hover:bg-gray-200 p-3 rounded-lg flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    <span className="flex-1">✨ מה זה ריסטרט 50+?</span>
                  </button>
                  {openAnswer === 0 && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                      פלטפורמה לנשים בגיל 50+ שמעוניינות להתחיל מחדש בקריירה, התפתחות אישית או חיבורים חברתיים.
                    </div>
                  )}
                </div>

                <div>
                  <button 
                    onClick={() => toggleAnswer(1)}
                    className="w-full text-right bg-gray-100 hover:bg-gray-200 p-3 rounded-lg flex items-center gap-2"
                  >
                    <UserPlus className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    <span className="flex-1">💡 איך מצטרפים?</span>
                  </button>
                  {openAnswer === 1 && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm space-y-2">
                      <p>פשוט לוחצים על כפתור ההרשמה, בוחרים מנוי ומתחילים.</p>
                      <Button asChild size="sm" className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white">
                        <Link to={createPageUrl("Join")}>
                          <UserPlus className="w-4 h-4 ml-2" />
                          הצטרפי עכשיו
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <button 
                    onClick={() => toggleAnswer(2)}
                    className="w-full text-right bg-gray-100 hover:bg-gray-200 p-3 rounded-lg flex items-center gap-2"
                  >
                    <span className="flex-1">💰 כמה עולה המנוי?</span>
                  </button>
                  {openAnswer === 2 && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                      המנוי החודשי עולה 55₪ בלבד.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </UserContext.Provider>
  );
}

