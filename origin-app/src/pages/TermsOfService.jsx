
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Mic, Shield, AlertTriangle, MessageCircle, Copyright } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-slate-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            תקנון ותנאי שימוש – ReStart 50+
          </h1>
          <p className="text-lg text-gray-600">
            תאריך עדכון אחרון: יוני 2025
          </p>
        </div>

        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
              <Users className="w-5 h-5 text-rose-500" />
              1. כללי והגדרות
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>1.1. ברוכה הבאה ל-ReStart 50+ ("הפלטפורמה" או "האתר"). השימוש באתר, בתכנים ובשירותים המוצעים בו כפוף לתנאים המפורטים בתקנון זה.</p>
            <p>1.2. השימוש בלשון נקבה הוא מטעמי נוחות בלבד ומתייחס לכל המגדרים. גלישה או שימוש בפלטפורמה מהווה הסכמה לתנאי התקנון.</p>
            <p>1.3. "הנהלת האתר" – הגורמים המפעילים את הפלטפורמה. "משתמשת" – כל אדם הגולש באתר, בין אם נרשמה כמנויה ובין אם לאו.</p>
          </CardContent>
        </Card>

        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
              <Mic className="w-5 h-5 text-purple-500" />
              2. מהות השירות
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>2.1. הפלטפורמה הינה קהילה דיגיטלית לנשים בגיל 50+ ומציעה, בין היתר: קורסים, תכנים, מפגשי מנטורינג, קהילת חברות, פורומים וכלים להתפתחות אישית ומקצועית.</p>
            <p>2.2. חלק מהשירותים (כמו ליווי אישי, גישה מלאה לקורסים ולספריית המשאבים) זמינים למנויות פרימיום בלבד, בכפוף לתשלום דמי מנוי.</p>
            <p>2.3. הנהלת האתר שומרת לעצמה את הזכות לשנות את היקף השירותים, תכנם ומחירם בכל עת ולפי שיקול דעתה הבלעדי.</p>
          </CardContent>
        </Card>

        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
              <Shield className="w-5 h-5 text-green-500" />
              3. כללי התנהגות בקהילה
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>3.1. הפלטפורמה היא מרחב בטוח ומכבד. על כל המשתמשות לנהוג בכבוד הדדי, להימנע משפה פוגענית, הסתה, לשון הרע או כל תוכן בלתי הולם.</p>
            <p>3.2. חל איסור מוחלט על פרסום מסחרי, שיווק, גיוס כספים או הפצת "ספאם" ללא אישור מפורש מהנהלת האתר.</p>
            <p>3.3. באזור "להכיר חברות" וביצירת קשרים אישיים, על המשתמשות לנהוג בזהירות ובשיקול דעת. הנהלת האתר אינה אחראית לטיב הקשרים שנוצרים בין המשתמשות.</p>
            <p>3.4. משתמשת שתפר כלל מכללי ההתנהגות, חשבונה עלול להיחסם או להימחק ללא החזר כספי.</p>
          </CardContent>
        </Card>

        <Card className="mb-8 border-0 shadow-lg bg-rose-50 border-rose-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-rose-800">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              4. אחריות המשתמשות לתוכן
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-rose-900 leading-relaxed">
            <p className="font-semibold">4.1. אחריות כללית לתוכן משתמשות:</p>
            <p>המשתמשת מצהירה ומתחייבת כי כל תוכן, מידע, פרטים אישיים, פרטי התקשרות, תיאורי ניסיון מקצועי, תמונות, קורסים, הצעות ליווי, פוסטים בקהילה, או כל חומר אחר שהיא מעלה, מפרסמת או משתפת בפלטפורמה (להלן: "תוכן משתמשת"), הינו באחריותה הבלעדית והמלאה.</p>
            
            <p className="font-semibold">4.2. התחייבות לדיוק ואמיתות:</p>
            <p>המשתמשת מתחייבת כי תוכן המשתמשת שהועלה על ידה הינו:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>אמיתי, מדויק, מלא ועדכני</li>
              <li>אינו מטעה, מוטעה או כוזב</li>
              <li>אינו פוגעני, גזעני, מאיים או מטריד</li>
              <li>אינו מפר כל דין ו/או כל זכות של צד שלישי (לרבות זכויות קניין רוחני, פרטיות, סודות מסחריים או זכויות יוצרים)</li>
              <li>אינו מהווה לשון הרע או הסתה</li>
            </ul>

            <p className="font-semibold">4.3. אחריות ספציפית לפרופילים:</p>
            <p><strong>פרופילים חברתיים:</strong> משתמשות המעלות פרופילים חברתיים (בעמוד "להכיר חברות") מתחייבות כי המידע שהן מספקות על עצמן (שם, גיל, מיקום, תחומי עניין, תיאור אישי ותמונות) הוא נכון ומדויק.</p>
            <p><strong>פרופילי מנטוריות ומאמנות:</strong> משתמשות המציעות שירותי ליווי, מנטורינג או אימון מקצועי מתחייבות כי המידע אודות כישוריהן, ניסיונן המקצועי, הסמכותיהן והמלצותיהן הוא אמיתי, מדויק ולא מטעה. הן מתחייבות לפעול בהגינות מקצועית מלאה.</p>
            <p><strong>פרופילי מרצות:</strong> משתמשות המציעות קורסים או סדנאות מתחייבות כי תיאור הקורס, תכני הלימוד, מחירים ותנאים הם נכונים ומדויקים.</p>

            <p className="font-semibold">4.4. התחייבות מנטוריות לשיחת היכרות חינמית:</p>
            <p><strong>כל מנטורית/מאמנת המצטרפת לפלטפורמה מתחייבת לספק שיחת היכרות ראשונה (intro call) חינמית בת כ-30 דקות למנויה שפונה אליה דרך המערכת.</strong> שיחת ההיכרות נועדה להכיר, להבין את הצרכים של המנויה ולראות כיצד ניתן לסייע לה. המנטורית רשאית לקבוע את מועד השיחה בתיאום עם המנויה, ואינה מחויבת לספק יותר משיחת היכרות אחת חינמית לכל מנויה. שירותי ליווי נוספים מעבר לשיחת ההיכרות יהיו בתשלום, בהתאם להסדר ישיר בין המנטורית למנויה.</p>

            <p className="font-semibold">4.5. פטור מאחריות של הנהלת האתר:</p>
            <p>הנהלת האתר אינה נושאת בכל אחריות ואינה מתחייבת לבצע בדיקות רקע, אימות זהות, בדיקת הסמכות מקצועיות או אימות של כל תוכן משתמשת. הנהלת האתר אינה אחראית לדיוק, איכות, חוקיות או הולמות התוכן שהועלה על ידי המשתמשות.</p>
            <p>המשתמשות נדרשות לבצע את שיקול דעתן העצמאי ולנקוט משנה זהירות בעת יצירת קשרים עם משתמשות אחרות, רכישת שירותים או הסתמכות על מידע שהועלה על ידי משתמשות אחרות.</p>

            <p className="font-semibold">4.6. זכות להסרת תוכן:</p>
            <p>הנהלת האתר רשאית, אך אינה חייבת, להסיר, לערוך, להסתיר או לחסום כל תוכן משתמשת שייראה לה בלתי הולם, פוגעני, מטעה או מפר את התקנון, מבלי שתחול עליה חובת נימוק כלשהי ומבלי שתישא בכל אחריות כלפי המשתמשת או צד שלישי.</p>

            <p className="font-semibold">4.7. פיטורים ושיפוי:</p>
            <p>המשתמשת מתחייבת לפצות ולשפות את הנהלת האתר, עובדיה, נושאי משרה בה, קבלניה ושותפיה העסקיים, בגין כל נזק, הפסד, הוצאה, תשלום, קנס או תביעה (לרבות שכר טרחת עורך דין) שייגרמו להם כתוצאה מתוכן משתמשת שהועלה על ידה או כתוצאה מהפרת התקנון על ידה.</p>
          </CardContent>
        </Card>

        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
              <Copyright className="w-5 h-5 text-blue-500" />
              5. קניין רוחני
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>5.1. כל התכנים המופיעים באתר, לרבות קורסים, מאמרים, תבניות, עיצובים, לוגו וסימנים מסחריים, הינם קניינה הבלעדי של הנהלת האתר ו/או צדדים שלישיים שהתירו לה שימוש. אין להעתיק, לשכפל, להפיץ או לעשות כל שימוש מסחרי בתוכן ללא אישור מראש ובכתב.</p>
            <p>5.2. תוכן משתמשות: בהעלאת תוכן לפלטפורמה, המשתמשת מעניקה להנהלת האתר רישיון שימוש לא בלעדי, כלל עולמי, ללא תמלוגים ולצמיתות, להציג, לשכפל, להפיץ, לערוך ולהשתמש בתוכן המשתמשת לצורך הפעלת הפלטפורמה ושיווקה. המשתמשת שומרת על כל זכויות היוצרים האחרות בתוכן שלה.</p>
          </CardContent>
        </Card>

        <Card className="mb-8 border-0 shadow-lg bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-yellow-800">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              6. הגבלת אחריות
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-yellow-900 leading-relaxed">
            <p>6.1. התכנים בפלטפורמה, לרבות ייעוץ מפי מנטוריות, קורסים ותכנים מקצועיים, ניתנים "כמו שהם" (As Is) ואינם מהווים ייעוץ מקצועי (רפואי, משפטי, פיננסי וכד'). כל החלטה שתתקבל על סמך התכנים היא באחריותה הבלעדית של המשתמשת.</p>
            <p>6.2. הנהלת האתר אינה אחראית לתוכן המועבר במפגשי מנטורינג אישיים או קבוצתיים, בקורסים המוצעים על ידי מרצות חיצוניות, או לאיכות השירותים הניתנים על ידי מנטוריות ומאמנות. האחריות על התהליך והתוצאות חלה על המשתמשות עצמן.</p>
            <p>6.3. הנהלת האתר עושה מאמצים לשמור על זמינות ותקינות הפלטפורמה, אך אינה מתחייבת לפעילות רציפה וללא תקלות, ולא תהיה אחראית לנזקים שייגרמו עקב בעיות טכניות.</p>
          </CardContent>
        </Card>

        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-indigo-500">
              <MessageCircle className="w-5 h-5 text-indigo-500" />
              7. יצירת קשר ושירות לקוחות
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>בכל שאלה, בקשה או בעיה, ניתן לפנות להנהלת האתר באמצעות כתובת הדוא"ל: restart@rse50.co.il</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
