
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { SocialProfile } from '@/api/entities';
import { Connection } from '@/api/entities';
import { Conversation } from '@/api/entities';
import { Notification } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  MessageSquare,
  UserPlus,
  Sparkles,
  Users,
  Crown,
  Play,
  X,
  Loader2,
  Coffee
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useUser, isUserAdmin } from '../components/auth/UserContext';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { sendConnectionEmail } from '@/api/functions';

import CreateProfileForm from '../components/social/CreateProfileForm';
import EditProfileForm from '../components/social/EditProfileForm';
import ProfileFilters from '../components/social/ProfileFilters';

const ProfileCard = ({ profile, currentUser, onContact, isDisabled, connectionStatus, onTagClick }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleSendMessage = async () => {
    if (isDisabled) {
        onContact();
        return;
    }

    if (connectionStatus === 'connected') {
      window.location.href = `${createPageUrl('Messages')}?email=${profile.email}`;
      return;
    }

    if (connectionStatus === 'pending') {
      alert('כבר שלחת בקשת חברות לאישה הזו. היא תוכל לענות לך דרך מערכת ההודעות.');
      return;
    }

    const isCurrentUserSubscribed = currentUser && currentUser.subscription_status === 'active' && new Date(currentUser.subscription_end_date) > new Date();

    if (!currentUser || (!isCurrentUserSubscribed && !isUserAdmin(currentUser))) {
        onContact();
        return;
    }

    try {
      await Connection.create({
          requester_email: currentUser.email,
          requester_name: currentUser.full_name,
          recipient_email: profile.email,
          recipient_name: profile.nickname,
      });

      try {
        await Notification.create({
          recipient_email: profile.email,
          title: `${currentUser.full_name} רוצה להכיר אותך! 💕`,
          message: `${currentUser.full_name} שלחה לך בקשת חברות. לחצי כדי לראות את הפרופיל שלה ולהחליט אם תרצי להתחבר.`,
          type: 'connection',
          action_url: `${window.location.origin}${createPageUrl('Messages')}?email=${currentUser.email}`,
          sender_name: currentUser.full_name
        });
      } catch (notificationError) {
        console.error("Failed to create notification:", notificationError);
      }

      try {
          await sendConnectionEmail({
              recipientEmail: profile.email,
              recipientName: profile.nickname,
          });
          console.log(`Connection email initiated for ${profile.nickname}`);
      } catch (emailError) {
          console.error("Failed to send connection email:", emailError);
      }

      alert(`בקשת החברות נשלחה ל${profile.nickname}! היא תקבל על כך התראה במערכת ובמייל.`);
      setShowProfileModal(false);
      window.location.reload();

    } catch (error) {
      console.error("Error in message sending process:", error);
      alert("אופס! משהו השתבש. נסי שוב מאוחר יותר.");
    }
  };

  const getButtonText = () => {
    if (isDisabled) return 'הצטרפי כדי להכיר';
    if (connectionStatus === 'loading') return <Loader2 className="w-4 h-4 animate-spin"/>;
    if (connectionStatus === 'connected') return 'שלחי הודעה 💬';
    if (connectionStatus === 'pending') return 'בקשה נשלחה ⏳';
    return 'בואי נכיר';
  };

  const getButtonClass = () => {
    if (isDisabled) return 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-full';
    if (connectionStatus === 'connected') return 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full';
    if (connectionStatus === 'pending') return 'bg-gray-300 text-gray-600 rounded-full cursor-not-allowed';
    return 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-full';
  };

  const getModalButtonText = () => {
    if (connectionStatus === 'connected') return 'שלחי הודעה 💬';
    if (connectionStatus === 'pending') return 'בקשה נשלחה ⏳';
    return 'בואי נכיר';
  };

  const getModalButtonClass = () => {
    if (connectionStatus === 'connected') return 'flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white';
    if (connectionStatus === 'pending') return 'flex-1 bg-gray-300 text-gray-600 cursor-not-allowed';
    return 'flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white';
  };

  if (!profile) return null;

  const interestColors = [
    "bg-rose-100 text-rose-700",
    "bg-purple-100 text-purple-700",
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-orange-100 text-orange-700"
  ];

  return (
    <>
      <Card className={`card-hover border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden group flex flex-col ${isDisabled ? 'opacity-80' : ''}`}>
        <CardHeader className="text-center p-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-rose-100 to-pink-100 flex items-center justify-center mb-6 border-4 border-white shadow-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
            {profile.profile_image_url ? (
              <img
                src={profile.profile_image_url}
                alt={profile.nickname}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl">👩</span>
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">{profile.nickname}</CardTitle>
          <p className="text-lg text-gray-600">{profile.location}</p>
          {profile.status_quote && (
            <p className="text-sm text-gray-500 italic mt-2">"{profile.status_quote}"</p>
          )}
          {profile.created_date && (
            <p className="text-xs text-gray-400 mt-2">
              חברה מאז {format(new Date(profile.created_date), 'MMMM yyyy', { locale: he })}
            </p>
          )}

          {connectionStatus === 'connected' && (
            <div className="mt-3">
              <Badge className="bg-green-100 text-green-700 border-green-300">
                ✓ כבר חברות
              </Badge>
            </div>
          )}
          {connectionStatus === 'pending' && (
            <div className="mt-3">
              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                ⏳ בקשה ממתינה
              </Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="px-8 pb-8 flex-grow flex flex-col">
          {profile.interests && profile.interests.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2">תחומי עניין:</p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.slice(0, 3).map((interest, idx) => (
                  <Badge
                    key={idx}
                    className={`${interestColors[idx % interestColors.length]} border-0 text-xs cursor-pointer hover:opacity-80 transition-opacity`}
                    onClick={(e) => { e.stopPropagation(); onTagClick('interest', interest); }}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {profile.looking_for && profile.looking_for.length > 0 && (
             <div className="mb-6">
                <p className="text-xs font-medium text-gray-500 mb-2">מחפשת:</p>
                <div className="flex flex-wrap gap-2">
                    {profile.looking_for.slice(0, 2).map((item, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="border-purple-300 text-purple-700 text-xs cursor-pointer hover:bg-purple-50 transition-colors"
                        onClick={(e) => { e.stopPropagation(); onTagClick('looking_for', item); }}
                      >
                        {item}
                      </Badge>
                    ))}
                </div>
            </div>
          )}
          
          <div className="mt-auto">
            <Button
              onClick={() => isDisabled ? onContact() : setShowProfileModal(true)}
              className={`w-full ${getButtonClass()}`}
              disabled={!isDisabled && connectionStatus === 'pending'}
            >
              <MessageSquare className="w-4 h-4 ml-2" />
              {getButtonText()}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-2xl p-0 max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 left-4 z-10 bg-black/20 hover:bg-black/30 text-white rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="bg-gradient-to-br from-rose-100 to-pink-100 p-8 text-center">
              <div className="w-32 h-32 mx-auto rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center mb-6 border-4 border-white shadow-xl overflow-hidden">
                {profile.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt={profile.nickname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl">👩</span>
                )}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{profile.nickname}</h2>
              <p className="text-xl text-gray-700 mb-2">{profile.age} שנים • {profile.location}</p>
              {profile.status_quote && (
                <p className="text-lg text-gray-600 italic mb-2">"{profile.status_quote}"</p>
              )}
              {profile.created_date && (
                <p className="text-sm text-gray-500">
                  חברה בקהילה מאז {format(new Date(profile.created_date), 'MMMM yyyy', { locale: he })}
                </p>
              )}
            </div>

            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">קצת עליי</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{profile.about_me}</p>
              </div>

              {profile.interests && profile.interests.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">מה מעניין אותי</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, idx) => (
                      <Badge
                        key={idx}
                        className={`${interestColors[idx % interestColors.length]} border-0`}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.looking_for && profile.looking_for.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">מה אני מחפשת</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.looking_for.map((item, idx) => (
                      <Badge key={idx} variant="outline" className="border-purple-300 text-purple-700">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1"
                >
                  חזרה
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={connectionStatus === 'pending'}
                  className={`${getModalButtonClass()} disabled:opacity-50`}
                >
                  <MessageSquare className="w-4 h-4 ml-2" />
                  {getModalButtonText()}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function SocialTinder() {
  const { currentUser, isSubscribed, isLoadingUser } = useUser();
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [connectionStatuses, setConnectionStatuses] = useState({});

  const [lookingForFilter, setLookingForFilter] = useState([]);
  const [interestFilter, setInterestFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    document.title = "קשרים חברתיים | ריסטארט 50+";

    const loadData = async () => {
        if (!currentUser) {
            console.log('❌ [SocialTinder] No user logged in, skipping profile load');
            setProfiles([]);
            setIsLoadingProfiles(false);
            setConnectionStatuses({});
            return;
        }

        console.log('🔄 [SocialTinder] Loading profiles for user:', currentUser.email);
        setIsLoadingProfiles(true);
        try {
            const allProfiles = await SocialProfile.list();
            console.log('📊 [SocialTinder] Loaded profiles:', allProfiles.length);
            setProfiles(allProfiles);
            
            const myProfile = allProfiles.find(p => p.email === currentUser.email) || null;
            setUserProfile(myProfile);

            const otherProfileEmails = allProfiles
                .map(p => p.email)
                .filter(email => email && email !== currentUser.email);

            if (otherProfileEmails.length === 0) {
                setConnectionStatuses({});
                setIsLoadingProfiles(false);
                return;
            }

            console.log('🔍 [SocialTinder] Checking connection statuses for:', otherProfileEmails);

            const initialStatuses = {};
            otherProfileEmails.forEach(email => initialStatuses[email] = 'loading');
            setConnectionStatuses(initialStatuses);
            
            const [connectionsResult, conversationsResult] = await Promise.all([
                Connection.list().catch(error => {
                    console.error("❌ Error fetching connections:", error);
                    return [];
                }),
                Conversation.filter({
                    participants: { '$all': [currentUser.email] }
                }).catch(error => {
                    console.error("❌ Error fetching conversations:", error);
                    return [];
                })
            ]);

            console.log('🔗 [SocialTinder] Connections loaded:', connectionsResult.length);
            console.log('💬 [SocialTinder] Conversations loaded:', conversationsResult.length);

            const finalStatuses = { ...initialStatuses };

            otherProfileEmails.forEach(email => {
                const hasConversation = conversationsResult.some(conv => 
                    conv.participants && 
                    Array.isArray(conv.participants) && 
                    conv.participants.includes(currentUser.email) &&
                    conv.participants.includes(email)
                );

                if (hasConversation) {
                    finalStatuses[email] = 'connected';
                    console.log(`✅ [SocialTinder] ${email} -> CONNECTED (has conversation)`);
                    return;
                }

                const hasPendingConnection = connectionsResult.some(conn => 
                    (conn.requester_email === currentUser.email && conn.recipient_email === email) ||
                    (conn.requester_email === email && conn.recipient_email === currentUser.email)
                );

                if (hasPendingConnection) {
                    finalStatuses[email] = 'pending';
                    console.log(`⏳ [SocialTinder] ${email} -> PENDING (has connection request)`);
                } else {
                    finalStatuses[email] = 'none';
                    console.log(`🆕 [SocialTinder] ${email} -> NONE (no connection)`);
                }
            });

            setConnectionStatuses(finalStatuses);
            console.log('🎯 [SocialTinder] Final connection statuses:', finalStatuses);
            
        } catch (error) {
            console.error("❌ [SocialTinder] Error loading data:", error);
            setProfiles([]);
            setConnectionStatuses({});
        } finally {
            setIsLoadingProfiles(false);
        }
    };

    loadData();
  }, [currentUser, isSubscribed, isLoadingUser]);

  useEffect(() => {
    let tempFiltered = profiles;

    console.log('🔍 [SocialTinder] === FILTER DEBUG ===');
    console.log('📊 Original profiles count:', profiles.length);
    console.log('📋 Location filter:', locationFilter);
    console.log('🎯 Looking for filter:', lookingForFilter);
    console.log('💡 Interest filter:', interestFilter);

    if (locationFilter) {
      tempFiltered = tempFiltered.filter(p =>
        p.location && p.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
      console.log('📍 After location filter:', tempFiltered.length);
    }

    if (lookingForFilter && lookingForFilter.length > 0 && lookingForFilter[0] !== 'all') {
      tempFiltered = tempFiltered.filter(p =>
        p.looking_for && p.looking_for.some(item => lookingForFilter.includes(item))
      );
      console.log('🎯 After looking_for filter:', tempFiltered.length);
    }
    
    if (interestFilter) {
        tempFiltered = tempFiltered.filter(p =>
            p.interests && p.interests.includes(interestFilter)
        );
        console.log('💡 After interest filter:', tempFiltered.length);
    }

    tempFiltered.sort((a, b) => {
      if (!a.is_demo && b.is_demo) return -1;
      if (a.is_demo && !b.is_demo) return 1;
      return new Date(b.created_date) - new Date(a.created_date);
    });

    console.log('✅ Final filtered count:', tempFiltered.length);
    setFilteredProfiles(tempFiltered);
    console.log('🔍 === END FILTER DEBUG ===');
  }, [profiles, lookingForFilter, locationFilter, interestFilter]);

  const handleContactAttempt = () => {
    setShowLoginModal(true);
  };

  const handleProfileUpdate = () => {
    setShowCreateProfileModal(false);
    setShowEditProfileModal(false);
    window.location.reload();
  };
  
  const handleTagClick = (type, value) => {
    if (type === 'interest') {
        setInterestFilter(value);
        setLookingForFilter([]);
        setLocationFilter('');
    } else if (type === 'looking_for') {
        setLookingForFilter([value]);
        setInterestFilter('');
        setLocationFilter('');
    }
    const element = document.getElementById('profiles-section');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleResetFilters = () => {
    setLookingForFilter([]);
    setLocationFilter('');
    setInterestFilter('');
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  const hasActiveSubscription = currentUser && currentUser.subscription_status === 'active';
  const isAdmin = currentUser && isUserAdmin(currentUser);
  const canViewFullContent = hasActiveSubscription || isAdmin;

  console.log('🎯 [SocialTinder] === SUBSCRIPTION CHECK ===');
  console.log('🎫 [SocialTinder] hasActiveSubscription:', hasActiveSubscription);
  console.log('👑 [SocialTinder] isAdmin:', isAdmin);
  console.log('✅ [SocialTinder] canViewFullContent:', canViewFullContent);
  console.log('📺 [SocialTinder] Will show:', !currentUser ? 'Hero' : (canViewFullContent ? 'FullView' : 'TeaserView'));
  console.log('🎯 [SocialTinder] === END SUBSCRIPTION CHECK ===');

  const TeaserView = () => (
    <div id="profiles-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">הצצה לקהילת החברות שלנו</h1>
            <p className="text-lg text-gray-600 mt-2">דפדפי, סנני ומצאי חברות חדשות עם תחומי עניין דומים לשלך.</p>
        </div>

        {profiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
                {profiles.slice(0, 5).map((profile) => (
                    <ProfileCard
                        key={profile.id}
                        profile={profile}
                        onContact={handleContactAttempt}
                        currentUser={currentUser}
                        isDisabled={true}
                        connectionStatus="none"
                        onTagClick={() => {}}
                    />
                ))}
                <Card className="flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 shadow-2xl">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-purple-800">רוצה לראות עוד?</CardTitle>
                    <CardDescription className="mt-2 mb-6 text-purple-700">הצטרפי לקהילה וקבלי גישה מלאה לכל הפרופילים, ליצירת קשר ועוד המון הפתעות!</CardDescription>
                    <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                        <Link to={createPageUrl("Subscribe")}>כן, אני רוצה להצטרף!</Link>
                    </Button>
                </Card>
            </div>
        ) : (
             <div className="text-center py-16">
                <Users className="w-16 h-16 text-rose-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">עדיין אין פרופילים להציג.</h3>
                <p className="text-gray-500">חזרי בקרוב כדי לראות מי הצטרפה לקהילה!</p>
            </div>
        )}
    </div>
  );

  const FullView = () => {
    const profilesToShow = filteredProfiles.filter(p => {
      if (p.email === currentUser.email) {
        return false;
      }
      
      const status = connectionStatuses[p.email];
      
      console.log(`🃏 [SocialTinder] Profile ${p.nickname} (${p.email}) status: ${status}`);
      
      const shouldShow = status === 'none';
      
      if (!shouldShow) {
        console.log(`🚫 [SocialTinder] Hiding ${p.nickname} because status is: ${status}`);
      }
      
      return shouldShow;
    });

    console.log('🖥️ [SocialTinder] === FULL VIEW RENDER ===');
    console.log('📊 Total filtered profiles:', filteredProfiles.length);
    console.log('👥 Profiles to show (after connection filter):', profilesToShow.length);
    console.log('📋 Profiles being hidden:');
    filteredProfiles.forEach(p => {
      if (p.email !== currentUser.email && connectionStatuses[p.email] !== 'none') {
        console.log(`   - ${p.nickname}: ${connectionStatuses[p.email]}`);
      }
    });
    console.log('🖥️ === END FULL VIEW RENDER ===');

    return (
      <div id="profiles-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">קהילת החברות שלנו</h1>
            <p className="text-lg text-gray-600 mt-2">דפדפי, סנני ומצאי חברות חדשות או שוחחי עם חברות קיימות.</p>
            <Button variant="outline" className="mt-4" onClick={() => userProfile ? setShowEditProfileModal(true) : setShowCreateProfileModal(true)}>
                {userProfile ? 'עדכון הפרופיל שלי' : 'יצירת פרופיל'}
            </Button>
        </div>

        {(interestFilter || (lookingForFilter && lookingForFilter.length > 0 && lookingForFilter[0] !== 'all') || locationFilter) && (
            <div className="text-center mb-6 flex justify-center items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">מציג תוצאות עבור:</span>
                {interestFilter && (
                    <Badge variant="secondary" className="text-base py-1 px-3">
                        {interestFilter}
                    </Badge>
                )}
                {lookingForFilter && lookingForFilter.length > 0 && lookingForFilter[0] !== 'all' && (
                    <Badge variant="secondary" className="text-base py-1 px-3">
                        {lookingForFilter[0]}
                    </Badge>
                )}
                {locationFilter && (
                    <Badge variant="secondary" className="text-base py-1 px-3">
                        {locationFilter}
                    </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-rose-500 hover:text-rose-700">
                    <X className="w-4 h-4 ml-1" />
                    איפוס סינון
                </Button>
            </div>
        )}

        <ProfileFilters 
            onFilterChange={setLookingForFilter} 
            onLocationFilterChange={setLocationFilter}
            onInterestFilterChange={setInterestFilter}
            currentLookingFor={lookingForFilter[0] || 'all'}
            currentLocation={locationFilter}
            currentInterest={interestFilter}
            onReset={handleResetFilters}
        />

        {profilesToShow.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {profilesToShow.map((profile) => (
                    <ProfileCard
                        key={profile.id}
                        profile={profile}
                        onContact={handleContactAttempt}
                        currentUser={currentUser}
                        isDisabled={false}
                        connectionStatus={connectionStatuses[profile.email] || 'loading'}
                        onTagClick={handleTagClick}
                    />
                ))}
            </div>
        ) : (
            <div className="text-center py-16">
                <Users className="w-16 h-16 text-rose-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">
                  {isLoadingProfiles ? 'טוען פרופילים...' : 'הכרת את כל החברות הזמינות! 🎉'}
                </h3>
                <p className="text-gray-500">
                  {isLoadingProfiles ? 'רק עוד רגע...' : 'נסי לשנות את תנאי הסינון או חזרי בקרוב כדי לראות מי הצטרפה!'}
                </p>
                {!isLoadingProfiles && (
                  <Button asChild className="mt-4" variant="outline">
                    <Link to={createPageUrl('MyProfile')}>
                      <Users className="w-4 h-4 ml-2" />
                      צפי בחברות הקיימות שלך
                    </Link>
                  </Button>
                )}
            </div>
        )}
    </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">

      {!currentUser && (
        <section 
          className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
          style={{
            backgroundImage: "url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/3a72396ba_.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-pink-50/80 to-orange-50/80"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50">
              
              <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full mb-8">
                <Coffee className="w-5 h-5" />
                <span className="font-semibold text-sm">מועדון החברות של ReStart 50+</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                קפה עם חברה
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 mb-4 leading-relaxed">
                כי חברות טובה היא כמו קפה – חמה, כנה ומעט ממכרת.
              </p>
              
              <p className="text-lg md:text-xl font-semibold gradient-text mb-10">
                ✨ גלי נשים שמדברות את השפה שלך!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl"
                  onClick={() => User.login()}
                >
                  <UserPlus className="w-5 h-5 ml-2" />
                  התחברי ונתחיל
                </Button>
                <Button size="lg" asChild variant="outline" className="rounded-full px-8 py-4 font-semibold text-lg border-rose-300 text-rose-700 hover:bg-rose-50">
                  <Link to={createPageUrl("Join")}>
                    אני רוצה להצטרף
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {currentUser && (
        isLoadingProfiles ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          </div>
        ) : (
          canViewFullContent ? <FullView /> : <TeaserView />
        )
      )}

      <div className="flex justify-center mt-12 mb-8">
        <Button asChild variant="outline" size="lg" className="border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700 shadow-md">
          <Link to={createPageUrl('MyProfile')}>
            <Heart className="w-4 h-4 ml-2" />
            חזרה למקום שלי
          </Link>
        </Button>
      </div>

      <Dialog open={showCreateProfileModal} onOpenChange={setShowCreateProfileModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
              בואי ניצור את הפרופיל שלך ✨
            </DialogTitle>
          </DialogHeader>
          <CreateProfileForm
            user={currentUser}
            onSuccess={handleProfileUpdate}
            onCancel={() => setShowCreateProfileModal(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showEditProfileModal} onOpenChange={setShowEditProfileModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
              עדכון הפרופיל שלך ✨
            </DialogTitle>
          </DialogHeader>
          <EditProfileForm
            user={currentUser}
            profile={userProfile}
            onSuccess={handleProfileUpdate}
            onCancel={() => setShowEditProfileModal(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-gray-900">
              הצטרפי אלינו! 💕
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4 py-4">
            <p className="text-gray-600">
              כדי להכיר חברות חדשות ולהתחבר לקהילה, את צריכה להירשם ולה להיות מנויה.
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white">
                <Link to={createPageUrl("Join")}>
                  <UserPlus className="w-4 h-4 ml-2" />
                  הרשמה חינמית
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={createPageUrl("Subscribe")}>
                  <Crown className="w-4 h-4 ml-2" />
                  מנוי מלא
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
