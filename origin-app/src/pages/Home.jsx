import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, BookOpen, MessageCircle, Sparkles, ArrowLeft, Loader2, Bell, UserPlus, X, ArrowRight } from "lucide-react";
import { useUser } from '../components/auth/UserContext';
import ServicesHighlight from '../components/home/ServicesHighlight';
import AiInspiration from '../components/home/AiInspiration';
import { User } from "@/api/entities";
import { MemberApplication } from "@/api/entities";
import { SocialProfile } from "@/api/entities";
import { sendWelcomeEmailToNewUser } from "@/api/functions";
import { motion } from "framer-motion";

const WelcomeBanner = ({ currentUser }) => {
  return (
    <section className="relative py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Animated Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-rose-200 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-purple-200 rounded-full opacity-10 animate-bounce"></div>
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-orange-200 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute top-2/3 right-1/4 w-24 h-24 bg-pink-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-1/4 right-1/2 w-16 h-16 bg-rose-300 rounded-full opacity-25 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-purple-300 rounded-full opacity-15 animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-3/4 left-1/5 w-12 h-12 bg-orange-300 rounded-full opacity-30 animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>
      
      <div className="relative max-w-5xl mx-auto text-center">
        <div className="flex justify-center items-center mb-10 relative">
          <div className="relative group">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100 shadow-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/842a4252c_ReStart.jpg"
                alt="ReStart 50+ Logo"
                className="w-44 h-44 object-cover rounded-full shadow-lg border-4 border-white/70"
              />
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight mt-8">
          🌸 ברוכה הבאה לקהילת <span className="gradient-text">ReStart 50+</span>
        </h1>
        <p className="text-xl text-gray-700 mb-10 font-light">
          הגעת למרחב שמחבר בין קריירה, קהילה והעצמה אישית<br />
          כי אף פעם לא מאוחר להתחיל מחדש, לגלות את עצמך ולצמוח יחד.
        </p>
        
        {/* תצוגה מותאמת למשתמשות מחוברות ולא מחוברות */}
        {currentUser ? (
          /* עבור משתמשות מחוברות */
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-full px-8 py-4 font-semibold text-lg shadow-lg"
            >
              <Link to={createPageUrl("MyProfile")}>
                <Heart className="w-5 h-5 ml-2" />
                למקום האישי שלי
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-4 font-semibold text-lg">
              <Link to={createPageUrl("Community")}>
                <Users className="w-5 h-5 ml-2" />
                לקהילה שלנו
              </Link>
            </Button>
          </div>
        ) : (
          /* עבור משתמשות לא מחוברות */
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => User.login()}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-full px-8 py-4 font-semibold text-lg shadow-lg"
            >
              <UserPlus className="w-5 h-5 ml-2" />
              בואי נתחיל - זה חינם!
            </Button>
            <Button size="lg" asChild variant="outline" className="rounded-full px-8 py-4 font-semibold text-lg">
              <Link to={createPageUrl("Join")}>
                <Sparkles className="w-5 h-5 ml-2" />
                אני רוצה להצטרף
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

// New Component: Welcome Banner for New Users
const NewUserWelcomeBanner = ({ onClose, onGoToProfile }) => {
  return (
    <div className="relative bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-2xl animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <div className="text-right flex-1">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">🎉 ברוכה הבאה לקהילת ReStart 50+!</h3>
              <p className="text-white/95 text-base md:text-lg leading-relaxed mb-3">
                כיף שהצטרפת אלינו! שלחנו לך מייל עם כל הפרטים על מה שמחכה לך כאן.
              </p>
              <p className="text-white font-semibold text-lg md:text-xl mb-2">
                ⭐ הצעד הבא: מלאי את הפרופיל האישי שלך
              </p>
              <p className="text-white/90 text-sm md:text-base">
                זה יעזור לנו להתאים לך חברויות מושלמות ולשלוח תכנים רלוונטיים במיוחד עבורך.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <Button 
              onClick={onGoToProfile}
              size="lg" 
              className="bg-white text-rose-600 hover:bg-rose-50 font-bold shadow-xl text-base md:text-lg px-8 py-6 rounded-full transform hover:scale-105 transition-all"
            >
              <Sparkles className="w-5 h-5 ml-2" />
              למילוי הפרופיל שלי
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
            
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 text-sm underline"
            >
              אמלא מאוחר יותר
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
    const { currentUser, isLoadingUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
    const [isSendingWelcomeEmail, setIsSendingWelcomeEmail] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [hasProfile, setHasProfile] = useState(false);

    // Check new user status and send welcome email if needed
    const checkNewUserStatus = useCallback(async () => {
        console.log('[Home.js] 🔍 Checking new user status...');
        
        const urlParams = new URLSearchParams(window.location.search);
        const isNewUserParam = urlParams.get('is_new_user');
        
        try {
            const user = await User.me();
            console.log('[Home.js] ✅ Current user:', { 
                email: user?.email, 
                subscription_status: user?.subscription_status,
                subscription_type: user?.subscription_type,
                subscription_end_date: user?.subscription_end_date
            });
            
            if (!user) {
                console.log('[Home.js] ℹ️ No user authenticated - skipping trial setup');
                return;
            }

            // Determine if the user needs a trial subscription setup
            let needsTrialSubscription = false;
            if (isNewUserParam === 'true') {
                if (!user.subscription_status || user.subscription_status === 'inactive') {
                    needsTrialSubscription = true;
                } else if (user.subscription_status === 'active' && user.subscription_end_date) {
                    const endDate = new Date(user.subscription_end_date);
                    const now = new Date();
                    if (endDate < now) { // Subscription has expired
                        needsTrialSubscription = true;
                    }
                }
            }

            if (!needsTrialSubscription) {
                console.log('[Home.js] ℹ️ User does not need trial setup or is not a new user with the param.');
                setShowWelcomeBanner(isNewUserParam === 'true' && !hasProfile);
                return;
            }

            const welcomeEmailSentKey = `restart50_welcome_email_sent_${user.email}`;
            const alreadySent = localStorage.getItem(welcomeEmailSentKey);

            if (alreadySent) {
                console.log('[Home.js] ℹ️ Welcome email already sent flag found in localStorage.');
                // Re-check subscription status to ensure it's truly not active before retrying
                if (!user.subscription_status || user.subscription_status === 'inactive' || (user.subscription_status === 'active' && user.subscription_end_date && new Date(user.subscription_end_date) < new Date())) {
                    console.log('[Home.js] ⚠️ User still needs trial setup. Retrying and clearing localStorage flag...');
                    localStorage.removeItem(welcomeEmailSentKey); // Clear to re-trigger
                } else {
                    console.log('[Home.js] ✅ User has active subscription. Skipping trial setup, even if new user param exists.');
                    setShowWelcomeBanner(isNewUserParam === 'true' && !hasProfile);
                    return; 
                }
            }

            console.log('[Home.js] 📧 Setting up trial subscription...');
            setIsSendingWelcomeEmail(true);

            // Call the backend function which now contains robust checks
            const response = await sendWelcomeEmailToNewUser({ 
                userEmail: user.email, 
                userName: user.full_name || user.email
            });

            console.log('[Home.js] ✅ Trial setup response:', response);

            if (response.status === 'success') {
                localStorage.setItem(welcomeEmailSentKey, 'true');
                
                console.log('[Home.js] 🔄 Refreshing user data...');
                const updatedUser = await User.me();
                
                console.log('[Home.js] ✅ Updated subscription:', {
                    subscription_status: updatedUser?.subscription_status,
                    subscription_type: updatedUser?.subscription_type,
                    subscription_end_date: updatedUser?.subscription_end_date
                });

                if (!updatedUser?.subscription_status || updatedUser.subscription_status === 'inactive' || (updatedUser.subscription_status === 'active' && updatedUser.subscription_end_date && new Date(updatedUser.subscription_end_date) < new Date())) {
                    console.error('[Home.js] ❌ Subscription not set properly or expired after setup attempt.');
                    alert('אירעה שגיאה בהגדרת מנוי הניסיון. אנא פני לתמיכה.');
                } else {
                    console.log('[Home.js] ✅ Trial subscription (or existing) confirmed successfully!');
                }
                
                setShowWelcomeBanner(isNewUserParam === 'true' && !hasProfile); 
                
            } else {
                console.error('[Home.js] ❌ Failed to set up trial:', response.error);
                alert('אירעה שגיאה בהגדרת מנוי הניסיון. אנא פני לתמיכה.');
            }
        } catch (error) {
            // Handle 401 (Unauthorized) silently - user not logged in
            if (error.message?.includes('401') || error.response?.status === 401) {
                console.log('[Home.js] ℹ️ User not logged in - skipping trial setup (normal for public pages)');
                return;
            }
            
            // For other errors, log and alert
            console.error('[Home.js] ❌ Unexpected error in checkNewUserStatus:', error);
            // Only show alert if user was logged in (to avoid spamming guests)
            if (isNewUserParam === 'true') {
                alert('אירעה שגיאה בהגדרת החשבון. אנא פני לתמיכה.');
            }
        } finally {
            setIsSendingWelcomeEmail(false);
            
            // Remove the is_new_user parameter from URL after processing
            if (isNewUserParam === 'true' && window.history.replaceState) {
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.delete('is_new_user');
                window.history.replaceState({}, document.title, newUrl.toString());
            }
        }
    }, [hasProfile]);

    useEffect(() => {
        if (!isLoadingUser) { 
            checkNewUserStatus();
        }
    }, [isLoadingUser, checkNewUserStatus]);

    const handleCloseBanner = () => {
        setShowWelcomeBanner(false);
    };

    const handleGoToProfile = () => {
        navigate(createPageUrl("MyProfile"));
        setShowWelcomeBanner(false); // Hide banner after navigating
    };

    if (isLoadingUser || isSendingWelcomeEmail || isCheckingStatus) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
            </div>
        );
    }
    
    return (
        <div dir="rtl">
            {/* New User Welcome Banner - only for logged in users without profile, shown if flag is true */}
            {currentUser && showWelcomeBanner && !hasProfile && (
              <NewUserWelcomeBanner 
                onClose={handleCloseBanner} 
                onGoToProfile={handleGoToProfile}
              />
            )}
            
            <WelcomeBanner currentUser={currentUser} />
            <AiInspiration />
            <ServicesHighlight />
            
            {/* Call to Action Section */}
            <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-100 via-pink-100 to-orange-100">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            מוכנה להתחיל <span className="gradient-text">מחדש?</span>
                        </h2>
                        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                            הצטרפי לאלפי נשים שכבר בחרו להתחיל מסע חדש של צמיחה, התפתחות וקשרים משמעותיים
                        </p>
                        
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button 
                                asChild 
                                size="lg" 
                                className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 hover:from-rose-600 hover:via-pink-600 hover:to-orange-600 text-white text-xl py-6 px-12 rounded-full shadow-2xl"
                            >
                                <Link to={createPageUrl("Join")}>
                                    <Sparkles className="w-6 h-6 ml-2" />
                                    בואי נצא לדרך
                                </Link>
                            </Button>
                        </motion.div>
                        
                        <p className="text-sm text-gray-600 mt-6">
                            💝 חודש ראשון חינם במסגרת גרסת הבטא
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}