
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { User } from '@/api/entities';
import { Heart, Sparkles, Loader2, BookOpen, Users, Gift, MessageCircle } from 'lucide-react';
import { useUser } from '../components/auth/UserContext';

export default function LaunchOffer() {
  const navigate = useNavigate();
  const { currentUser, isLoadingUser } = useUser();

  const handleLogin = async () => {
    try {
      const currentUrl = window.location.origin + createPageUrl("Home"); // Redirect to home after login
      User.loginWithRedirect(currentUrl);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (isLoadingUser) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 text-rose-500 animate-spin" /></div>;
  }

  const features = [
    { icon: Users, title: "קהילה תומכת", description: "נשים כמוך, שמבינות אותך." },
    { icon: Heart, title: "מנטוריות מנוסות", description: "ליווי אישי להצלחה שלך." },
    { icon: BookOpen, title: "קורסים וסדנאות", description: "כלים חדשים לפרק הבא." },
    { icon: MessageCircle, title: "חברות חדשות", description: "קשרים משמעותיים לחיים." },
  ];
  
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-full mb-8 shadow-lg">
          <Gift className="w-6 h-6" />
          <span className="text-lg font-bold">
            השקה מיוחדת - הצטרפי חינם!
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          הצעד הראשון לפרק הבא שלך <span className="gradient-text">מתחיל כאן</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
          אנו מזמינות אותך להצטרף לקהילת ReStart 50+ וליהנות מחודש התנסות מלא במתנה.
          בלי התחייבות, בלי אותיות קטנות - רק הזדמנות אמיתית לצמוח.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12 text-right">
          {features.map(feature => (
            <div key={feature.title} className="flex items-start gap-4 p-4 bg-white/70 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              מוכנה להתחיל את המסע?
            </h2>
          <div className="flex flex-col items-center justify-center">
            {!currentUser ? (
              <>
                <p className="text-lg text-gray-600 mb-6">התחברי או הירשמי כדי להגיש בקשת הצטרפות.</p>
                <Button
                  size="lg"
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl"
                >
                  <Heart className="w-6 h-6 ml-2" />
                  התחברות והגשת בקשה
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-lg text-gray-700">שלום {currentUser.full_name.split(' ')[0]}! 👋</p>
                <p className="text-gray-600">בואי נגיש את בקשת ההצטרפות שלך.</p>
                <Button
                  size="lg"
                  onClick={() => navigate(createPageUrl("ApplyForMembership"))}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-10 py-3 rounded-full font-bold text-lg shadow-xl"
                >
                  להגשת בקשת הצטרפות
                  <Sparkles className="w-6 h-6 mr-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
