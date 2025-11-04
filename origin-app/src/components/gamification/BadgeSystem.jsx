
import React, { useState, useEffect } from "react";
import { UserBadge } from "@/api/entities";
import { User } from "@/api/entities";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, Award, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

const AVAILABLE_BADGES = {
    welcome: {
        id: "welcome",
        name: "ברוכה הבאה",
        description: "הצטרפת לקהילה!",
        icon: "🎉",
        color: "purple",
        category: "special"
    },
    veteran: {
        id: "veteran",
        name: "חברה ותיקה",
        description: "חצי שנה של מנוי פעיל",
        icon: "👑",
        color: "gold",
        category: "special"
    },
    social_butterfly: {
        id: "social_butterfly",
        name: "פרפר חברתי",
        description: "יצרת 5 חיבורים חברתיים",
        icon: "🦋",
        color: "pink",
        category: "social"
    },
    mentor_seeker: {
        id: "mentor_seeker",
        name: "מחפשת ליווי",
        description: "קבעת פגישה עם מנטורית",
        icon: "🤝",
        color: "blue",
        category: "mentor"
    },
    course_lover: {
        id: "course_lover",
        name: "אוהבת ללמוד",
        description: "השתתפת ב-3 קורסים",
        icon: "📚",
        color: "green",
        category: "learning"
    },
    entrepreneur: {
        id: "entrepreneur",
        name: "יזמית בנשמה",
        description: "צפית ב-5 משאבים יזמיים",
        icon: "💼",
        color: "orange",
        category: "learning"
    },
    community_star: {
        id: "community_star",
        name: "כוכבת הקהילה",
        description: "פרסמת 3 פוסטים בקהילה",
        icon: "⭐",
        color: "gold",
        category: "community"
    },
    helper: {
        id: "helper",
        name: "תומכת ומעודדת",
        description: "הגבת על 10 פוסטים בקהילה",
        icon: "💖",
        color: "red",
        category: "community"
    },
    goal_setter: {
        id: "goal_setter",
        name: "מגדירת מטרות",
        description: "יצרת 3 מטרות אישיות",
        icon: "🎯",
        color: "purple",
        category: "special"
    },
    achiever: {
        id: "achiever",
        name: "מגשימה חלומות",
        description: "השלמת 2 מטרות",
        icon: "🏆",
        color: "gold",
        category: "special"
    }
};

const getBadgeColorClass = (color) => {
    const colors = {
        purple: "bg-purple-100 text-purple-800 border-purple-300",
        pink: "bg-pink-100 text-pink-800 border-pink-300",
        blue: "bg-blue-100 text-blue-800 border-blue-300",
        green: "bg-green-100 text-green-800 border-green-300",
        orange: "bg-orange-100 text-orange-800 border-orange-300",
        red: "bg-red-100 text-red-800 border-red-300",
        gold: "bg-yellow-100 text-yellow-800 border-yellow-300"
    };
    return colors[color] || colors.purple;
};

export const BadgeDisplay = ({ badges = [], showTitle = true, maxBadges = null }) => {
    const [displayBadges, setDisplayBadges] = useState([]);

    useEffect(() => {
        setDisplayBadges(maxBadges && badges ? badges.slice(0, maxBadges) : badges || []);
    }, [badges, maxBadges]);

    if (!displayBadges || displayBadges.length === 0) {
        return showTitle ? <div className="text-sm text-gray-500">עוד לא זכית בתגים</div> : null;
    }

    return (
        <div>
            {showTitle && (
                <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold text-sm text-gray-800">התגים שלי</span>
                </div>
            )}
            <div className="flex flex-wrap gap-2">
                <TooltipProvider>
                    {displayBadges.map((badge) => (
                        <Tooltip key={badge.id}>
                            <TooltipTrigger>
                                <Badge 
                                    className={`${getBadgeColorClass(badge.badge_color)} border text-xs px-2 py-1 flex items-center gap-1 hover:scale-105 transition-transform cursor-help`}
                                >
                                    <span>{badge.badge_icon}</span>
                                    <span>{badge.badge_name}</span>
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="text-center">
                                    <p className="font-medium">{badge.badge_description}</p>
                                    <p className="text-xs text-gray-500">
                                        זכית בתאריך: {format(new Date(badge.earned_date), 'd MMMM yyyy', { locale: he })}
                                    </p>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </div>
        </div>
    );
};

export const BadgeManager = ({ userEmail, initialBadges }) => {
    const [badges, setBadges] = useState(initialBadges || []);
    const [availableBadges, setAvailableBadges] = useState([]);

    const loadBadges = async () => {
        if (!userEmail) return;
        
        try {
            const userBadges = initialBadges || await UserBadge.filter({ user_email: userEmail });
            setBadges(userBadges);
            
            // Get badges user doesn't have yet
            const earnedBadgeIds = userBadges.map(b => b.badge_id);
            const available = Object.values(AVAILABLE_BADGES).filter(
                badge => !earnedBadgeIds.includes(badge.id)
            );
            setAvailableBadges(available);
        } catch (error) {
            console.error("Error loading badges:", error);
        }
    };

    useEffect(() => {
        loadBadges();
    }, [userEmail, initialBadges]);

    const awardBadge = async (badgeData) => {
        try {
            await UserBadge.create({
                user_email: userEmail,
                badge_id: badgeData.id,
                badge_name: badgeData.name,
                badge_description: badgeData.description,
                badge_icon: badgeData.icon,
                badge_color: badgeData.color,
                category: badgeData.category,
                earned_date: new Date().toISOString()
            });
            
            // Create notification
            try {
                const { createNotification } = await import('@/api/functions');
                await createNotification({
                    recipient_email: userEmail,
                    title: `🎉 זכית בתג חדש!`,
                    message: `מזל טוב! זכית בתג "${badgeData.name}" - ${badgeData.description}`,
                    type: 'system',
                    action_url: '/my-profile'
                });
            } catch (notificationError) {
                console.log('Could not create badge notification:', notificationError);
            }
            
            loadBadges();
        } catch (error) {
            console.error("Error awarding badge:", error);
        }
    };

    return { badges, availableBadges, awardBadge };
};

export default function BadgeSystem({ userEmail, initialBadges }) {
    const { badges, availableBadges } = BadgeManager({ userEmail, initialBadges });
    
    const groupedBadges = badges.reduce((acc, badge) => {
        if (!acc[badge.category]) acc[badge.category] = [];
        acc[badge.category].push(badge);
        return acc;
    }, {});

    const categoryNames = {
        social: "חברתי",
        learning: "למידה",
        mentor: "ליווי",
        community: "קהילה",
        special: "מיוחד"
    };

    return (
        <div className="space-y-6">
            {/* Current Badges */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        הישגי התגים שלי
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {badges.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>עוד לא זכית בתגים</p>
                            <p className="text-sm">התחילי לפעול בקהילה וזכי בתגים ראשונים!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(groupedBadges).map(([category, categoryBadges]) => (
                                <div key={category}>
                                    <h4 className="font-semibold text-gray-800 mb-2">
                                        {categoryNames[category] || category}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        <TooltipProvider>
                                            {categoryBadges.map((badge) => (
                                                <Tooltip key={badge.id}>
                                                    <TooltipTrigger>
                                                        <Badge 
                                                            className={`${getBadgeColorClass(badge.badge_color)} border px-3 py-2 flex items-center gap-2 hover:scale-105 transition-transform cursor-help`}
                                                        >
                                                            <span className="text-lg">{badge.badge_icon}</span>
                                                            <div className="text-left">
                                                                <div className="font-medium">{badge.badge_name}</div>
                                                                <div className="text-xs opacity-80">{badge.badge_description}</div>
                                                            </div>
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>זכית בתאריך: {format(new Date(badge.earned_date), 'd MMMM yyyy', { locale: he })}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </TooltipProvider>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Available Badges */}
            {availableBadges.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-gray-400" />
                            תגים זמינים
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {availableBadges.map((badge) => (
                                <div 
                                    key={badge.id}
                                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50"
                                >
                                    <span className="text-2xl opacity-60">{badge.icon}</span>
                                    <div>
                                        <div className="font-medium text-gray-700">{badge.name}</div>
                                        <div className="text-sm text-gray-500">{badge.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
