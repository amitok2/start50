import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Crown, Mic, Briefcase, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Join() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              💫 איך את רוצה <span className="gradient-text">להצטרף אלינו</span>?
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              בחרי את המסלול שהכי מדבר אלייך –<br />
              כל דרך מובילה למקום אחר ומיוחד בקהילה של ReStart 50+
            </p>
          </motion.div>
        </div>

        {/* Four Path Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          
          {/* Community Path */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-rose-50 to-pink-100 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 h-full flex flex-col">
              <div className="h-2 bg-gradient-to-r from-rose-400 to-pink-500"></div>
              <CardHeader className="text-right pb-4">
                <div className="text-5xl mb-4 text-center">🌸</div>
                <CardTitle className="text-2xl font-bold text-gray-900 text-right">
                  הקהילה
                </CardTitle>
                <CardDescription className="text-gray-600 text-base text-right leading-relaxed mt-2">
                  זה המקום שבו חברות חדשות ונפשות תאומות נפגשות,<br />
                  והחיים מקבלים ריסטארט.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow flex flex-col">
                <div className="text-right flex-grow">
                  <p className="text-gray-700 leading-relaxed text-right">
                    בגיל 50+ זה בדיוק הזמן שלך לפרוח, לצחוק, להיפגש ולחלום יחד.
                    קהילה של נשים אמיתיות, עם שיחות מהלב, מטרות משותפות
                    וחברויות שהופכות לנפשות תאומות.
                  </p>
                </div>
                <Button asChild size="lg" className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-full shadow-lg mt-auto">
                  <Link to={createPageUrl("ApplyForMembership")}>
                    <Heart className="w-5 h-5 ml-2" />
                    אני רוצה להצטרף!
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Expert Path (Mentor) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-purple-50 to-indigo-100 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 h-full flex flex-col">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
              <CardHeader className="text-right pb-4">
                <div className="text-5xl mb-4 text-center">🌟</div>
                <CardTitle className="text-2xl font-bold text-gray-900 text-right">
                  המומחיות
                </CardTitle>
                <CardDescription className="text-gray-600 text-base text-right leading-relaxed mt-2">
                  (מנטורית / מאמנת / יועצת)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow flex flex-col">
                <div className="text-right flex-grow space-y-3">
                  <p className="text-gray-700 leading-relaxed text-right">
                    יש לך ידע וניסיון חיים? אנחנו מביאות את הקהל שמחכה לו.
                    במה אמיתית, לקהל אמיתי – סוף סוף רואים אותך.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-right">
                    תני למי שאת, למה שעברת ולכלים שלך,<br />
                    להפוך להשראה ולתמיכה לאחרות.
                  </p>
                </div>
                <Button asChild size="lg" className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full shadow-lg mt-auto">
                  <Link to={createPageUrl("BecomeMentor")}>
                    <Crown className="w-5 h-5 ml-2" />
                    הצטרפי כמומחית
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Instructor Path */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-orange-50 to-yellow-100 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 h-full flex flex-col">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-yellow-600"></div>
              <CardHeader className="text-right pb-4">
                <div className="text-5xl mb-4 text-center">🎤</div>
                <CardTitle className="text-2xl font-bold text-gray-900 text-right">
                  המרצות
                </CardTitle>
                <CardDescription className="text-gray-600 text-base text-right leading-relaxed mt-2">
                  יש לך ידע שראוי להישמע?<br />
                  הסיפור שלך שווה במה – ואנחנו דואגות לקהל.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow flex flex-col">
                <div className="text-right flex-grow">
                  <p className="text-gray-700 leading-relaxed text-right">
                    בגיל 50+ את לא רק מספרת סיפור, את עושה שינוי.
                    כאן מתחילה ההרצאה שתמיד חלמת להעביר,
                    וממנה כולן ילמדו ויצמחו.
                  </p>
                </div>
                <Button asChild size="lg" className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white rounded-full shadow-lg mt-auto">
                  <Link to={createPageUrl("BecomeInstructor")}>
                    <Mic className="w-5 h-5 ml-2" />
                    הצטרפי כמרצה
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Career Path - NEW! */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-cyan-100 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 h-full flex flex-col">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardHeader className="text-right pb-4">
                <div className="text-5xl mb-4 text-center">💼</div>
                <CardTitle className="text-2xl font-bold text-gray-900 text-right">
                  הקריירה שלך
                </CardTitle>
                <CardDescription className="text-gray-600 text-base text-right leading-relaxed mt-2">
                  בין אם את מחפשת כיוון חדש כשכירה,<br />
                  ובין אם בא לך לגלות מה באמת את רוצה לעשות עכשיו –<br />
                  זה המקום בשבילך.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow flex flex-col">
                <div className="text-right flex-grow">
                  <p className="text-gray-700 leading-relaxed text-right">
                    יחד נבנה את קורות החיים שלך מחדש,
                    נשפר ביטחון עצמי ונמצא את המקום שבו הניסיון שלך
                    הופך ליתרון אמיתי.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-right font-semibold mt-3">
                    כי זה לא מאחורייך — זה רק מתחיל עכשיו.
                  </p>
                </div>
                <Button asChild size="lg" className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-full shadow-lg mt-auto">
                  <Link to={createPageUrl("Subscribe")}>
                    <Briefcase className="w-5 h-5 ml-2" />
                    הצטרפי למסלול הקריירה שלך
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 border-2 border-purple-200"
        >
          <h3 className="text-2xl font-bold text-purple-800 mb-4">
            עוד לא בטוחה איזה מסלול?
          </h3>
          <p className="text-purple-700 mb-6 text-lg">
            זה בסדר גמור! רוב הנשים שלנו מתחילות כמנויות ואז מגלות את הכישרונות שלהן.
            את תמיד יכולה להוסיף תפקידים בהמשך.
          </p>
          <Button asChild size="lg" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-200">
            <Link to={createPageUrl("ApplyForMembership")}>
              בואי נתחיל מהקהילה
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Link>
          </Button>
        </motion.div>

      </div>
    </div>
  );
}