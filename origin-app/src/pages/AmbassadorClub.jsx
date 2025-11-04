
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Gift, Crown, Users, Heart, Copy, Check, Mail, Coffee, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AmbassadorClub() {
  const [user, setUser] = useState(null);
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [emailTextCopied, setEmailTextCopied] = useState(false); // Added new state for email text copy
  const [isLoading, setIsLoading] = useState(true);

  // Define referralLink and emailBodyText here so they are accessible and reactive
  const referralLink = user ? `${window.location.origin}${createPageUrl("Subscribe")}?ref=${referralCode}` : '';
  const emailBodyText = `שלום יקרה,

גיליתי קהילה מיוחדת לנשים בגיל 50+ ורציתי לשתף אותך!

ReStart 50+ זה מקום חם וחכם של נשים שמתחילות מחדש - בקריירה, בחברות, בהתפתחות אישית.

יש שם:
🎓 קורסים מעשיים ומעצימים
👭 קהילה תומכת באמת
🌿 ליווי אישי עם מנטוריות מנוסות
🧭 אירועים ומפגשי קפה

אם זה נשמע לך מעניין, תוכלי להצטרף דרך הקישור שלי:
${referralLink}

אשמח שנהיה שם ביחד! 💖

בחיבה,
${user?.full_name || ''}`; // Ensure full_name is safely accessed

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      // יצירת קוד הפניה אישי (בדרך כלל יתבסס על מזהה המשתמש)
      setReferralCode(`RESTART${currentUser.id?.slice(-6)?.toUpperCase() || 'FRIEND'}`);
      
      // כאן יטען מספר ההפניות מהמערכת
      setReferralCount(currentUser.referral_count || 0);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareByEmail = () => {
    const subject = "הצטרפי איתי לקהילת ReStart 50+ המדהימה!";
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBodyText)}`;
  };

  // New function to copy email text
  const copyEmailText = () => {
    navigator.clipboard.writeText(emailBodyText);
    setEmailTextCopied(true);
    setTimeout(() => setEmailTextCopied(false), 2000);
  };

  const rewards = [
    {
      count: 1,
      icon: Coffee,
      title: "כניסה חינם למפגש קפה",
      description: "בחרי מפגש קפה אחד לבחירתך",
      color: "from-amber-400 to-orange-500"
    },
    {
      count: 3,
      icon: Crown,
      title: "חודש מנוי פרימיום במתנה",
      description: "גישה מלאה לכל התכנים והשירותים",
      color: "from-purple-400 to-indigo-500"
    },
    {
      count: 5,
      icon: Gift,
      title: "ערכת השראה פיזית",
      description: "מחברת השראה, נר ריחני והפתעה אישית",
      color: "from-pink-400 to-rose-500"
    },
    {
      count: 10,
      icon: Star,
      title: "שיחת מנטורינג + תעודת שגרירה",
      description: "ליווי אישי והכרה מיוחדת באתר",
      color: "from-emerald-400 to-teal-500"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">מועדון השגרירות</h1>
          <p className="text-lg text-gray-600 mb-8">
            כדי להצטרף למועדון השגרירות ולהתחיל לקבל מתנות, עליך להיות חברה בקהילה
          </p>
          <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full px-8">
            <Link to={createPageUrl("Join")}>הצטרפי לקהילה עכשיו</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🎁 <span className="gradient-text">מועדון השגרירות</span> של ReStart 50+
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            מביאה חברה – זוכה בחוויה
          </p>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto">
            ב־ReStart 50+ אנחנו מאמינות שחברות טובות מביאות חברות טובות.
            אם מצאת אצלנו מקום חם, חכם ומרגש – למה לא לשתף מישהי שאת אוהבת?
          </p>
        </div>

        {/* Current Status */}
        <Card className="mb-12 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
          <CardContent className="p-8 text-center">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-purple-600">{referralCount}</div>
                <div className="text-gray-600">חברות שהצטרפו בזכותך</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600">{referralCode}</div>
                <div className="text-gray-600">הקוד האישי שלך</div>
              </div>
              <div>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-lg px-4 py-2">
                  👑 שגרירת ReStart
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What is Ambassador */}
        <Card className="mb-12 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">👑 מי היא שגרירת ReStart?</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              שגרירה היא אישה שמשתפת, מזמינה, מחברת – ויוצרת גלים טובים בקהילה.
              על כל חברה חדשה שתצטרף בזכותך – את מקבלת מתנה!
            </p>
          </CardContent>
        </Card>

        {/* Rewards System */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">מה את מקבלת?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {rewards.map((reward, index) => (
              <Card key={index} className={`shadow-lg overflow-hidden ${referralCount >= reward.count ? 'ring-2 ring-green-500' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${reward.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <reward.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-lg font-bold">
                          {reward.count} חברות
                        </Badge>
                        {referralCount >= reward.count && (
                          <Badge className="bg-green-500 text-white">✅ זכאית!</Badge>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">{reward.title}</h3>
                      <p className="text-gray-600 text-sm">{reward.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How to Share */}
        <Card className="mb-12 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">💬 איך מצטרפים למועדון?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">שלחי קישור</h3>
                <p className="text-gray-600 text-sm">שולחת לחברה שלך את הקישור האישי שלך</p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">היא נרשמת</h3>
                <p className="text-gray-600 text-sm">היא נרשמת ומשלמת על מנוי – את מקבלת קרדיט</p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-green-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">מקבלת מתנה</h3>
                <p className="text-gray-600 text-sm">ברגע שצברת חברות – המתנה נשלחת אלייך</p>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="mt-8 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <Label className="font-semibold text-gray-700 mb-2 block">הקישור האישי שלך (לווצאפ, פייסבוק...):</Label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={referralLink} // Now uses the reactive constant
                    readOnly
                    className="flex-1 p-3 border rounded-lg bg-white text-gray-700"
                  />
                  <Button onClick={copyReferralLink} className="bg-purple-600 hover:bg-purple-700">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={shareByEmail}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full"
                >
                  <Mail className="w-5 h-5 ml-2" />
                  שליחת מייל לחברה
                </Button>
                <Button 
                  onClick={copyEmailText} // New button to copy email text
                  variant="outline"
                  className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50 rounded-full"
                >
                  {emailTextCopied ? <Check className="w-5 h-5 ml-2" /> : <Copy className="w-5 h-5 ml-2" />}
                  {emailTextCopied ? 'הנוסח הועתק!' : 'העתקת תוכן המייל'}
                </Button>
              </div>
              <p className="text-center text-xs text-gray-500">
                  "שליחת מייל" פותח את תוכנת המיילים שלך. אם זה לא עובד, השתמשי ב"העתקת תוכן המייל" והדביקי ידנית.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why Worth It */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-2xl">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-6">💜 למה זה שווה?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Heart className="w-8 h-8 mx-auto mb-3 text-pink-200" />
                <h3 className="font-semibold mb-2">מחזק אתכן כחברות</h3>
              </div>
              <div>
                <Users className="w-8 h-8 mx-auto mb-3 text-pink-200" />
                <h3 className="font-semibold mb-2">מחזק את הקהילה מבפנים</h3>
              </div>
              <div>
                <Gift className="w-8 h-8 mx-auto mb-3 text-pink-200" />
                <h3 className="font-semibold mb-2">מרגש לקבל מתנה ממקום שרואה אותך</h3>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">💌 קיבלת השראה?</h3>
              <Button 
                onClick={shareByEmail}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-50 rounded-full px-8"
              >
                שלחי קישור לחברה אחת ותתחילי לצבור מתנות 💫
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
