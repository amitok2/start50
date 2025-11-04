
import React, { useState } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Heart, Eye, Ear, Brain, HandHeart, Phone, Mail, CheckCircle } from "lucide-react";

export default function Accessibility() {
  const [user, setUser] = useState(null);
  const [accessibilityNeeds, setAccessibilityNeeds] = useState("");
  const [selectedNeeds, setSelectedNeeds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      if (currentUser.accessibility_needs) {
        setAccessibilityNeeds(currentUser.accessibility_needs);
      }
      if (currentUser.accessibility_categories) {
        setSelectedNeeds(currentUser.accessibility_categories);
      }
    } catch (error) {
      // Not logged in
    }
  };

  const accessibilityCategories = [
    { id: "visual", label: "ראייה (לקות ראייה, עיוורון צבעים, צורך בגופנים גדולים)", icon: Eye },
    { id: "hearing", label: "שמיעה (כבדות שמיעה, חירשות)", icon: Ear },
    { id: "motor", label: "תנועה (קושי בתנועת ידיים, שימוש בעכבר או מקלדת)", icon: HandHeart },
    { id: "cognitive", label: "קוגניציה (דיסלקציה, קושי בריכוז, זיכרון)", icon: Brain },
    { id: "other", label: "אחר או שילוב של מספר מגבלות", icon: Heart }
  ];

  const handleCategoryChange = (categoryId, checked) => {
    if (checked) {
      setSelectedNeeds([...selectedNeeds, categoryId]);
    } else {
      setSelectedNeeds(selectedNeeds.filter(id => id !== categoryId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await User.updateMyUserData({
        accessibility_needs: accessibilityNeeds,
        accessibility_categories: selectedNeeds
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error("Failed to update accessibility needs:", error);
      alert("שגיאה בשמירת הפרטים. נסי שוב.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ♿ הצהרת נגישות – <span className="gradient-text">ReStart 50<span className="text-sm relative top-[-0.1em]">+</span></span>
          </h1>
          <p className="text-lg text-gray-600">
            כי כל אחת מגיעה לה מקום נגיש, נוח ומכיל
          </p>
        </div>

        {/* Our Commitment */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-green-800">
              <Heart className="w-6 h-6 text-green-600" />
              המחויבות שלנו לנגישות
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-green-800 leading-relaxed">
            <p>
              <strong>ב-ReStart 50+ אנו מאמינות שכל אישה מגיעה לה מקום בקהילה שלנו</strong> – ללא קשר למגבלות פיזיות, קוגניציביות או טכנולוגיות שעלולות להיות לה.
            </p>
            <p>
              אנו עובדות ללא הרף כדי להפוך את הפלטפורמה שלנו לנגישה ומכילה ככל הניתן, ומזמינות אותך לספר לנו איך נוכל לעזור לך להרגיש בנוח.
            </p>
          </CardContent>
        </Card>

        {/* What We've Implemented */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">מה כבר עשינו כדי להנגיש את האתר</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">נגישות ראייה</h4>
                    <p className="text-sm text-gray-600">גופנים ברורים וגדולים, ניגודיות טובה, תמיכה בגדלת טקסט</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">עיצוב פשוט וברור</h4>
                    <p className="text-sm text-gray-600">ניווט אינטואיטיבי, הוראות ברורות, מעט הסחות דעת</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <HandHeart className="w-5 h-5 text-rose-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">נגישות מקלדת</h4>
                    <p className="text-sm text-gray-600">אפשרות לנווט באתר רק עם המקלדת, ללא עכבר</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">תמיכה אישית</h4>
                    <p className="text-sm text-gray-600">צוות שירות זמין לעזרה טכנית ותמיכה</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Accessibility Form */}
        {user && (
          <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">ספרי לנו על הצרכים שלך (פרטי ומאובטח)</CardTitle>
              <p className="text-gray-600">
                המידע הזה נשמר באופן פרטי ומאובטח וישמש אותנו לשפר את החוויה שלך בקהילה.
                זה לא חובה, אבל זה מאוד עוזר לנו לדעת איך לתמוך בך טוב יותר.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="text-base font-semibold text-gray-800 mb-4 block">
                    איזה תחומים רלוונטיים בשבילך? (אופציונלי)
                  </Label>
                  <div className="space-y-3">
                    {accessibilityCategories.map((category) => (
                      <div key={category.id} className="flex items-start gap-3">
                        <Checkbox
                          id={category.id}
                          checked={selectedNeeds.includes(category.id)}
                          onCheckedChange={(checked) => handleCategoryChange(category.id, checked)}
                        />
                        <div className="flex items-start gap-2">
                          <category.icon className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                          <Label htmlFor={category.id} className="text-sm cursor-pointer leading-relaxed">
                            {category.label}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="accessibility-details" className="text-base font-semibold text-gray-800 mb-2 block">
                    יש משהו ספציפי שחשוב לנו לדעת? (אופציונלי)
                  </Label>
                  <Textarea
                    id="accessibility-details"
                    value={accessibilityNeeds}
                    onChange={(e) => setAccessibilityNeeds(e.target.value)}
                    placeholder="למשל: 'אני זקוקה לגופנים גדולים מאוד', 'אני משתמשת בקורא מסך', 'יש לי קושי עם צבעים מסוימים'..."
                    rows={4}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    המידע הזה נשמר באופן פרטי ונועד לעזור לנו לשפר את הנגישות עבורך.
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white"
                  >
                    {isSubmitting ? "שומר..." : "שמירת העדפות"}
                  </Button>
                </div>

                {submitted && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span>הפרטים נשמרו בהצלחה! תודה על השיתוף.</span>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        )}

        {/* Standards and Compliance */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">תקנים ותאימות</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              אנו שואפות לעמוד בתקן הנגישות הישראלי (תקן ישראלי 5568) ובהנחיות הנגישות הבינלאומיות (WCAG 2.1).
            </p>
            <p>
              הפלטפורמה שלנו נבדקת באופן קבוע לנגישות, ואנו מקבלות הכוונה ממומחי נגישות כדי להמשיך להשתפר.
            </p>
          </CardContent>
        </Card>

        {/* How to Get Help */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-blue-800">
              <Phone className="w-6 h-6 text-blue-600" />
              איך לקבל עזרה
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-blue-800 leading-relaxed">
            <p>
              <strong>נתקלת בבעיית נגישות? יש לך הצעה לשיפור?</strong>
            </p>
            <p>אנו כאן כדי לעזור ולשמוע ממך:</p>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="space-y-2">
                <a 
                  href="mailto:restart@rse50.co.il" 
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Mail className="w-4 h-4" />
                  restart@rse50.co.il
                </a>
                <p className="text-sm text-blue-600">
                  כתבי לנו במייל ונחזור אלייך בתוך 24 שעות עם פתרון או הסבר.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Our Promise */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">ההבטחה שלנו לך</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              אנו מתחייבות להמשיך לשפר את הנגישות של הקהילה שלנו. 
              <br/>
              כל משוב, בקשה או הצעה יקבלו מאיתנו תשובה מהירה ומכבדת.
            </p>
            <div className="text-purple-600 text-xl font-semibold">
              💜 כי כל אחת מגיעה לה מקום בקהילה
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
