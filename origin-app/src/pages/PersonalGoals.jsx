import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Goal } from '@/api/entities';
import GoalsManager from '../components/profile/GoalsManager';
import GoalsOverview from '../components/profile/GoalsOverview';
import { Loader2, Target, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';

export default function PersonalGoals() {
    const [user, setUser] = useState(null);
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const fetchUserAndGoals = async () => {
            setIsLoading(true);
            try {
                const currentUser = await User.me();
                setUser(currentUser);
                if (currentUser) {
                    if (currentUser.subscription_status === 'active') {
                        setIsSubscribed(true);
                        await loadGoals(currentUser.email);
                    }
                }
            } catch (error) {
                // Not logged in
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserAndGoals();
    }, []);

    const loadGoals = async (userEmail) => {
        try {
            const userGoals = await Goal.filter({ created_by: userEmail }, '-created_date');
            setGoals(userGoals);
        } catch (error) {
            console.error("Failed to load goals", error);
        }
    };
    
    const handleGoalUpdate = () => {
        if(user) {
            loadGoals(user.email);
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">הצטרפי כדי להגדיר את המטרות שלך</h1>
                    <p className="text-gray-600 mb-6">כדי להתחיל את מסלול המטרות האישי שלך, יש להתחבר או להירשם.</p>
                    <Button asChild size="lg" className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white">
                        <Link to={createPageUrl("Join")}>הצטרפי אלינו</Link>
                    </Button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 to-cyan-50">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Target className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        מסלול המטרות האישי שלך
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        כאן תוכלי להגדיר, לעקוב ולכבוש את היעדים החשובים לך. חלום גדול מתחיל בצעד קטן.
                    </p>
                </div>
                
                {!isSubscribed ? (
                     <Card className="text-center p-8 bg-purple-50 border-purple-200">
                        <Lock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-purple-800 mb-3">זהו כלי למנויות פרימיום</h2>
                        <p className="text-purple-700 mb-6">שדרגי את המנוי שלך כדי לקבל גישה למסלול המטרות וכלים נוספים שיעזרו לך לצמוח.</p>
                        <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                            <Link to={createPageUrl("Subscribe")}>לשדרוג המנוי</Link>
                        </Button>
                    </Card>
                ) : (
                    <>
                        <GoalsOverview goals={goals} />
                        <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8">
                             <GoalsManager user={user} goals={goals} onGoalUpdate={handleGoalUpdate} />
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}