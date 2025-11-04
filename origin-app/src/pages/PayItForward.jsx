
import React, { useState, useEffect } from "react";
import { PayItForward } from "@/api/entities";
import { User } from "@/api/entities";
import { VolunteerRegistration } from "@/api/entities"; // Added
import { SendEmail } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Gift, Plus, MapPin, Calendar, User as UserIcon, Briefcase, Lightbulb, Package, Ticket, Pencil, Trash2, ArrowLeft, ExternalLink, CheckCircle } from "lucide-react"; // Added CheckCircle
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // Added
import { Textarea } from "@/components/ui/textarea"; // Added
import { Label } from "@/components/ui/label"; // Added
import { format } from "date-fns";
import { he } from "date-fns/locale";
import CreateGiftForm from "../components/payitforward/CreateGiftForm";
import { Link, useNavigate } from "react-router-dom";
import { createNotification } from "@/api/functions"; // Added
import { createPageUrl } from "@/utils"; // Replaced placeholder with actual import

export default function PayItForwardPage() {
  const navigate = useNavigate();
  const [gifts, setGifts] = useState([]);
  const [myGifts, setMyGifts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [editingGift, setEditingGift] = useState(null);
  const [activeMainTab, setActiveMainTab] = useState("gifts");
  
  // New states for volunteer modal
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [volunteerCategory, setVolunteerCategory] = useState('');
  const [isSubmittingVolunteer, setIsSubmittingVolunteer] = useState(false);
  const [volunteerFormData, setVolunteerFormData] = useState({
    volunteer_name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    loadData();
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      if (user.subscription_status === 'active' && new Date(user.subscription_end_date) > new Date()) {
        setIsSubscribed(true);
      }
      
      // Pre-fill volunteer form if user is logged in
      setVolunteerFormData({
        volunteer_name: user.full_name || '',
        email: user.email || '',
        phone: '', // Phone might not be on User.me, keep empty or fetch if available
        message: ''
      });
    } catch (e) {
      setCurrentUser(null);
      setIsSubscribed(false);
      // If user is not logged in, reset volunteer form data
      setVolunteerFormData({
        volunteer_name: '',
        email: '',
        phone: '',
        message: ''
      });
    }
  };

  const loadData = async () => {
    // טען מתנות זמינות
    const availableGifts = await PayItForward.filter({ status: "available" }, "-created_date");
    setGifts(availableGifts);
  };

  const loadMyGifts = async () => {
    if (currentUser) {
      const userGifts = await PayItForward.filter({ giver_email: currentUser.email }, "-created_date");
      setMyGifts(userGifts);
    }
  };

  const handleGiftCreated = () => { // This function is called after create OR update in CreateGiftForm
    setShowCreateModal(false);
    setEditingGift(null); // Important: reset editing state
    loadData(); // Reload available gifts
    loadMyGifts(); // Reload user's gifts
  };

  const handleTakeGift = async (gift) => {
    if (!currentUser || !isSubscribed) {
      alert("כדי לקבל מתנות, עליך להיות מנויה פעילה בקהילה.");
      return;
    }

    try {
      // עדכן את המתנה כנלקחה
      await PayItForward.update(gift.id, {
        status: "taken",
        receiver_name: currentUser.full_name,
        receiver_email: currentUser.email,
        taken_date: new Date().toISOString().split('T')[0]
      });

      // 3. תיקון: שליחת מייל לנותנת המתנה
      try {
        console.log(`Attempting to send email to giver: ${gift.giver_email}`);
        await SendEmail({
          to: gift.giver_email,
          subject: `המתנה שלך נלקחה! 🎁 - ${gift.title}`,
          body: `שלום ${gift.giver_name}!<br><br>המתנה הנפלאה שלך "${gift.title}" זה עתה נלקחה על ידי ${currentUser.full_name} מהקהילה!<br><br>פרטי המקבלת:<br>שם: ${currentUser.full_name}<br>מייל: ${currentUser.email}<br><br>תוכלי ליצור קשר איתה ישירות כדי לתאם את מסירת המתנה.<br><br>תודה שאת חלק מהקסם הזה של נתינה בקהילה שלנו! ❤️<br><br>בברכה חמה,<br>צוות ReStart 50+<br><br>---<br>שאלות? כתבי לנו: restart@rse50.co.il`
        });
        console.log('Email to giver sent successfully.');
      } catch (emailError) {
        console.error("Failed to send email to giver:", emailError);
        // המערכת תמשיך גם אם שליחת המייל נכשלה, כדי לא לפגוע בחוויה
      }
      
      // שלח מייל למקבלת
      try {
         console.log(`Attempting to send email to receiver: ${currentUser.email}`);
        await SendEmail({
          to: currentUser.email,
          subject: `קיבלת מתנה מהקהילה! 🎁 - ${gift.title}`,
          body: `שלום ${currentUser.full_name}!<br><br>איזה כיף! זה עתה קיבלת את המתנה "${gift.title}" מ${gift.giver_name}!<br><br>תיאור המתנה: ${gift.description}<br><br>פרטי הנותנת לתיאום:<br>שם: ${gift.giver_name}<br>מייל: ${gift.giver_email}<br><br>אנא צרי איתה קשר כדי לתאם את קבלת המתנה.<br><br>נהני מהמתנה ומהחיבור החדש! ❤️<br><br>בברכה חמה,<br>צוות ReStart 50+<br><br>---<br>שאלות? כתבי לנו: restart@rse50.co.il`
        });
        console.log('Email to receiver sent successfully.');
      } catch (emailError) {
        console.error("Failed to send email to receiver:", emailError);
      }

      alert(`המתנה שלך! ${gift.giver_name} תקבל הודעה עם הפרטים שלך לתיאום.`);
      loadData();
    } catch (error) {
      console.error("Error taking gift:", error);
      alert("אופס! משהו השתבש. נסי שוב מאוחר יותר.");
    }
  };

  const handleEditGift = (gift) => {
    setEditingGift(gift);
    setShowCreateModal(true);
  };

  const handleDeleteGift = async (giftId) => {
    if (confirm("את בטוחה שאת רוצה למחוק את המתנה הזו?")) {
      try {
        await PayItForward.update(giftId, { status: "expired" }); 
        loadData(); // Refresh available gifts
        loadMyGifts(); // Refresh my gifts
        alert("המתנה נמחקה בהצלחה.");
      } catch (error) {
        console.error("Error deleting gift:", error);
        alert("אופס! משהו השתבש במחיקת המתנה.");
      }
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "משרה": <Briefcase className="w-5 h-5" />,
      "טיפ": <Lightbulb className="w-5 h-5" />,
      "פריט": <Package className="w-5 h-5" />,
      "חוויה": <Ticket className="w-5 h-5" />
    };
    return icons[category] || <Gift className="w-5 h-5" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      "משרה": "bg-blue-100 text-blue-800",
      "טיפ": "bg-yellow-100 text-yellow-800", 
      "פריט": "bg-green-100 text-green-800",
      "חוויה": "bg-purple-100 text-purple-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const filteredGifts = selectedCategory === "all" 
    ? gifts 
    : gifts.filter(gift => gift.category === selectedCategory);

  // New function to handle volunteer click
  const handleVolunteerClick = (topic) => {
    if (!currentUser) {
      alert("כדי להירשם להתנדבות, עליך להתחבר תחילה.");
      User.login(); // Assuming User.login() handles the login flow
      return;
    }
    
    setVolunteerCategory(topic);
    setShowVolunteerModal(true);
    // Pre-fill form data with current user's details
    setVolunteerFormData(prev => ({
      ...prev,
      volunteer_name: currentUser.full_name || '',
      email: currentUser.email || ''
    }));
  };

  // New function to handle volunteer form submission
  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    
    if (!volunteerFormData.volunteer_name || !volunteerFormData.email) {
      alert('נא למלא את כל שדות החובה המסומנים בכוכבית (*).');
      return;
    }

    setIsSubmittingVolunteer(true);
    try {
      const registrationData = {
        volunteer_name: volunteerFormData.volunteer_name,
        email: volunteerFormData.email,
        phone: volunteerFormData.phone || '',
        category: volunteerCategory,
        message: volunteerFormData.message || '',
        status: 'pending' // Default status
      };

      await VolunteerRegistration.create(registrationData);

      // Send notification to admin
      try {
        await createNotification({
          recipient_email: 'restart@rse50.co.il', // Or specific admin email
          title: `✨ בקשת התנדבות חדשה: ${volunteerCategory}`,
          message: `${volunteerFormData.volunteer_name} (${volunteerFormData.email}) מעוניינת להתנדב בנושא "${volunteerCategory}". ${volunteerFormData.phone ? `טלפון: ${volunteerFormData.phone}` : ''}. ${volunteerFormData.message ? `הודעה: ${volunteerFormData.message}` : ''}`,
          type: 'system',
          action_url: createPageUrl('AdminDashboard'), // Assuming an admin dashboard page
          send_manager_email_alert: true,
          priority: 'normal'
        });
      } catch (notificationError) {
        console.error('Failed to send notification:', notificationError);
      }

      // Send WhatsApp message (dynamically import to avoid server-side issues if not needed there)
      try {
        const { sendWhatsappMessage } = await import('@/api/functions');
        await sendWhatsappMessage({
          title: `✨ בקשת התנדבות חדשה`,
          message: `שם: ${volunteerFormData.volunteer_name}
מייל: ${volunteerFormData.email}
${volunteerFormData.phone ? `טלפון: ${volunteerFormData.phone}` : ''}
קטגוריה: ${volunteerCategory}
${volunteerFormData.message ? `הודעה: ${volunteerFormData.message}` : ''}

צרי קשר עם המתנדבת לתיאום פרטים.`
        });
      } catch (whatsappError) {
        console.error('Failed to send WhatsApp:', whatsappError);
      }

      alert('הבקשה נשלחה בהצלחה! נחזור אלייך בהקדם.');
      setShowVolunteerModal(false);
      setVolunteerFormData({ volunteer_name: currentUser?.full_name || '', email: currentUser?.email || '', phone: '', message: '' });
    } catch (error) {
      console.error('Submission failed:', error);
      alert('אירעה שגיאה. נסי שוב מאוחר יותר.');
    } finally {
      setIsSubmittingVolunteer(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">✨🎁🤝✨</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="gradient-text">תעבירי את זה הלאה: מעגל הנתינה והתנדבות</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            כאן, בכל מתנה קטנה או גדולה, ובכל שעה של התנדבות, הטוב מתגלגל ומתחבר.
            ממשרה ששמעת עליה, דרך טיפ מנצח, עד שעות של עזרה והתנדבות – כל מה שאת נותנת הופך להזדמנות חדשה שפורחת בקהילה שלנו.
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            כי כשהיד נותנת, הלב מתרחב, והכוח שלנו גדל יחד.
          </p>
        </div>

        {/* Main Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-2 rounded-full shadow-md">
            <Button 
              onClick={() => setActiveMainTab('gifts')}
              variant={activeMainTab === 'gifts' ? 'default' : 'ghost'}
              className={`px-6 py-2 rounded-full ${activeMainTab === 'gifts' ? 'bg-rose-500 hover:bg-rose-600' : ''}`}
            >
              <Gift className="ml-2 w-4 h-4" />
              מתנות ומשאבים
            </Button>
            <Button 
              onClick={() => setActiveMainTab('volunteer')}
              variant={activeMainTab === 'volunteer' ? 'default' : 'ghost'}
              className={`px-6 py-2 rounded-full ${activeMainTab === 'volunteer' ? 'bg-purple-500 hover:bg-purple-600' : ''}`}
            >
              <Heart className="ml-2 w-4 h-4" />
              התנדבות בקהילה
            </Button>
          </div>
        </div>

        {activeMainTab === 'gifts' && (
          <>
            {/* Add Gift Button */}
            {currentUser && isSubscribed && (
              <div className="text-center mb-8">
                <Button
                  onClick={() => { setShowCreateModal(true); setEditingGift(null); }}
                  size="lg"
                  className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
                >
                  <Plus className="w-5 h-5 ml-2" />
                  הוספת מתנה חדשה
                </Button>
              </div>
            )}

            {/* Existing Tabs for Gifts */}
            <Tabs defaultValue="available" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
                <TabsTrigger value="available">מתנות זמינות</TabsTrigger>
                <TabsTrigger value="my-gifts" onClick={loadMyGifts}>המתנות שלי</TabsTrigger>
              </TabsList>

              {/* Available Gifts */}
              <TabsContent value="available" className="space-y-8">
                {/* Category Filter */}
                <div className="flex justify-center mb-8">
                  <div className="flex gap-2 bg-white p-2 rounded-xl shadow-md">
                    <Button
                      variant={selectedCategory === "all" ? "default" : "outline"}
                      onClick={() => setSelectedCategory("all")}
                      className={selectedCategory === "all" ? "bg-rose-500 hover:bg-rose-600" : ""}
                    >
                      הכל
                    </Button>
                    {["משרה", "טיפ", "פריט", "חוויה"].map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                        className={selectedCategory === category ? "bg-rose-500 hover:bg-rose-600" : ""}
                      >
                        {getCategoryIcon(category)}
                        <span className="mr-2">{category}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Gifts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGifts.map((gift) => (
                    <Card key={gift.id} className="card-hover border-0 shadow-lg bg-white">
                      {gift.image_url && (
                        <div className="h-48 bg-gradient-to-br from-rose-100 to-pink-100 relative overflow-hidden rounded-t-lg">
                          <img 
                            src={gift.image_url} 
                            alt={gift.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
                            {gift.title}
                          </CardTitle>
                          <Badge className={getCategoryColor(gift.category)}>
                            {gift.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <UserIcon className="w-4 h-4 text-rose-500" />
                          <span>מ{gift.giver_name}</span>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {gift.description}
                        </p>

                        {gift.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <MapPin className="w-4 h-4 text-rose-500" />
                            <span>{gift.location}</span>
                          </div>
                        )}

                        {gift.expiry_date && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <Calendar className="w-4 h-4 text-rose-500" />
                            <span>בתוקף עד: {format(new Date(gift.expiry_date), 'dd/MM/yyyy')}</span>
                          </div>
                        )}

                        <Button
                          onClick={() => handleTakeGift(gift)}
                          className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-full"
                          disabled={!currentUser || !isSubscribed}
                        >
                          <Heart className="w-4 h-4 ml-2" />
                          אני רוצה את המתנה הזו!
                        </Button>

                        {(!currentUser || !isSubscribed) && (
                          <p className="text-xs text-gray-500 text-center mt-2">
                            להרשמה לקהילה כדי לקבל מתנות
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredGifts.length === 0 && (
                  <div className="text-center py-12">
                    <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">אין מתנות זמינות כרגע</h3>
                    <p className="text-gray-500">בקרי שוב מאוחר יותר או הוסיפי מתנה בעצמך!</p>
                  </div>
                )}
              </TabsContent>

              {/* My Gifts */}
              <TabsContent value="my-gifts" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">המתנות שנתתי</h2>
                  <p className="text-gray-600">תודה על הנדיבות שלך! ❤️</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myGifts.map((gift) => (
                    <Card key={gift.id} className="border-0 shadow-lg bg-white">
                      {gift.image_url && (
                        <div className="h-48 bg-gradient-to-br from-rose-100 to-pink-100 relative overflow-hidden rounded-t-lg">
                          <img 
                            src={gift.image_url} 
                            alt={gift.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-bold text-gray-900">
                              {gift.title}
                            </CardTitle>
                            <div className="flex gap-2 mt-2">
                              <Badge 
                                className={
                                  gift.status === "taken" 
                                    ? "bg-green-100 text-green-800" 
                                    : gift.status === "expired"
                                    ? "bg-gray-100 text-gray-600"
                                    : "bg-blue-100 text-blue-800"
                                }
                              >
                                {gift.status === "taken" ? "נלקח" : gift.status === "expired" ? "נמחק" : "זמין"}
                              </Badge>
                              <Badge className={getCategoryColor(gift.category)}>
                                {gift.category}
                              </Badge>
                            </div>
                          </div>
                          
                          {gift.status === "available" && (
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditGift(gift)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteGift(gift.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent>
                        <p className="text-gray-700 mb-4">{gift.description}</p>
                        
                        {gift.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 text-rose-500" />
                            <span>{gift.location}</span>
                          </div>
                        )}

                        {gift.expiry_date && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <Calendar className="w-4 h-4 text-rose-500" />
                            <span>בתוקף עד: {format(new Date(gift.expiry_date), 'dd/MM/yyyy')}</span>
                          </div>
                        )}
                        
                        {gift.status === "taken" && gift.receiver_name && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-sm text-green-800">
                              <strong>נלקח על ידי:</strong> {gift.receiver_name}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              {format(new Date(gift.taken_date), 'dd/MM/yyyy')}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {myGifts.length === 0 && (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">עדיין לא נתת מתנות</h3>
                    <p className="text-gray-500 mb-4">התחילי לחלוק את הטוב שלך עם הקהילה!</p>
                    <Button
                      onClick={() => { setShowCreateModal(true); setEditingGift(null); }} // Clear editingGift when creating new
                      className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
                    >
                      הוספת מתנה ראשונה
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}

        {activeMainTab === 'volunteer' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">התנדבות בקהילה 🤝</h2>
              <p className="text-gray-600">שתפי מהזמן והכישורים שלך, או מצאי עזרה בדברים שאת צריכה</p>
            </div>

            {/* Volunteer Opportunities Coming Soon */}
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">בקרוב - מערכת התנדבויות!</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  אנחנו בונות מערכת מיוחדת שתאפשר לכן לשתף כוח אדם, כישורים וזמן:
                  <br/>
                  עזרה במעבר דירה • ליווי לרופא • עזרה במחשב • שמרטפות • ועוד הרבה אפשרויות...
                </p>
                <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
                  מתפתח כרגע - בקרוב אצלכן!
                </Badge>
              </CardContent>
            </Card>

            <div className="text-center mt-12 mb-6">
                <h3 className="text-xl font-bold text-gray-800">רוצה להתחיל להתנדב כבר עכשיו?</h3>
                <p className="text-gray-600">הנה כמה אתרים מומלצים למציאת התנדבות שמתאימה לך:</p>
            </div>

            {/* External Links */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="card-hover">
                  <CardHeader>
                      <CardTitle>רוח טובה</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-gray-600 mb-4">מאגר ההתנדבויות הגדול בישראל, למציאת התנדבות בכל תחום.</p>
                      <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                          <a href="https://www.ruachtova.org.il/" target="_blank" rel="noopener noreferrer">
                              לאתר רוח טובה <ExternalLink className="w-4 h-4 mr-2" />
                          </a>
                      </Button>
                  </CardContent>
              </Card>

              <Card className="card-hover">
                  <CardHeader>
                      <CardTitle>המועצה להתנדבות</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-gray-600 mb-4">הארגון המרכזי לקידום ההתנדבות והחברה האזרחית בישראל.</p>
                      <Button asChild className="w-full bg-green-500 hover:bg-green-600 text-white">
                          <a href="https://ivolunteer.org.il/" target="_blank" rel="noopener noreferrer">
                              למועצה להתנדבות <ExternalLink className="w-4 h-4 mr-2" />
                          </a>
                      </Button>
                  </CardContent>
              </Card>

              <Card className="card-hover">
                  <CardHeader>
                      <CardTitle>התנדבות במד"א</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-gray-600 mb-4">הצטרפי למערך המתנדבים של מגן דוד אדום להצלת חיים.</p>
                      <Button asChild className="w-full bg-red-500 hover:bg-red-600 text-white">
                          <a href="https://www.mdais.org/itnadvut" target="_blank" rel="noopener noreferrer">
                              להתנדבות במד"א <ExternalLink className="w-4 h-4 mr-2" />
                          </a>
                      </Button>
                  </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { emoji: '💻', title: 'עזרה טכנולוגית', desc: 'הדרכה במחשב, סמארטפון, רשתות חברתיות' },
                { emoji: '🏠', title: 'עזרה בבית', desc: 'ניקיון, ארגון, עזרה במעבר דירה' },
                { emoji: '🚗', title: 'הסעות וליווי', desc: 'ליווי לרופא, לקניות, לאירועים' },
                { emoji: '👶', title: 'שמרטפות', desc: 'עזרה עם הנכדים, שמרטפות חד-פעמיות' },
                { emoji: '📚', title: 'הוראה וחונכות', desc: 'שיתוף ידע מקצועי, חונכות קריירה' },
                { emoji: '🎨', title: 'יצירה ותחביבים', desc: 'שיתוף כישורים יצירתיים, הדרכות' }
              ].map((item, index) => (
                <Card key={index} className="bg-white border-gray-200 flex flex-col">
                  <CardContent className="p-6 text-center flex-grow flex flex-col justify-between">
                    <div>
                      <div className="text-4xl mb-3">{item.emoji}</div>
                      <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    {/* Updated button to open modal */}
                    <Button 
                      variant="outline" 
                      className="mt-4 w-full"
                      onClick={() => handleVolunteerClick(item.title)}
                    >
                      <Heart className="w-4 h-4 ml-2" />
                      מעוניינת להתנדב
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Create/Edit Gift Modal */}
        <Dialog open={showCreateModal} onOpenChange={(open) => {
            setShowCreateModal(open);
            if (!open) { // If dialog is closing
                setEditingGift(null); // Clear editing state
            }
        }}>
          <DialogContent className="sm:max-w-2xl p-4 md:p-8 max-h-[90vh] overflow-y-auto">
            <CreateGiftForm 
              gift={editingGift} // Pass the gift object if editing
              currentUser={currentUser}
              onSuccess={handleGiftCreated} // Handles both create and update success
              onCancel={() => {
                setShowCreateModal(false);
                setEditingGift(null);
              }} 
            />
          </DialogContent>
        </Dialog>

        {/* Volunteer Registration Modal */}
        <Dialog open={showVolunteerModal} onOpenChange={setShowVolunteerModal}>
          <DialogContent className="sm:max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">
                {volunteerCategory === 'עזרה טכנולוגית' && '💻'}
                {volunteerCategory === 'עזרה בבית' && '🏠'}
                {volunteerCategory === 'הסעות וליווי' && '🚗'}
                {volunteerCategory === 'שמרטפות' && '👶'}
                {volunteerCategory === 'הוראה וחונכות' && '📚'}
                {volunteerCategory === 'יצירה ותחביבים' && '🎨'}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">רישום להתנדבות</h2>
              <p className="text-gray-600">{volunteerCategory}</p>
            </div>

            <form onSubmit={handleVolunteerSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="volunteer_name">שם מלא <span className="text-red-500">*</span></Label>
                <Input
                  id="volunteer_name"
                  value={volunteerFormData.volunteer_name}
                  onChange={(e) => setVolunteerFormData(prev => ({...prev, volunteer_name: e.target.value}))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">כתובת מייל <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  value={volunteerFormData.email}
                  onChange={(e) => setVolunteerFormData(prev => ({...prev, email: e.target.value}))}
                  required
                  readOnly // Make email read-only as it's pre-filled from current user
                  disabled={!!currentUser?.email} // Disable if current user has an email
                  className={!!currentUser?.email ? "bg-gray-100" : ""} // Style if disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">מספר טלפון</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={volunteerFormData.phone}
                  onChange={(e) => setVolunteerFormData(prev => ({...prev, phone: e.target.value}))}
                  placeholder="לתיאום פרטים"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">ספרי לנו קצת על עצמך ועל הניסיון שלך</Label>
                <Textarea
                  id="message"
                  value={volunteerFormData.message}
                  onChange={(e) => setVolunteerFormData(prev => ({...prev, message: e.target.value}))}
                  rows={4}
                  placeholder="למשל: יש לי ניסיון בהדרכת מחשבים, או: אשמח לעזור עם הסעות באזור תל אביב..."
                />
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-purple-800">
                <p className="font-medium mb-2">💡 שימי לב:</p>
                <p>לאחר שליחת הבקשה, נחזור אלייך בהקדם לתיאום פרטים ולהתאים את ההתנדבות בצורה הטובה ביותר.</p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowVolunteerModal(false)}
                  className="flex-1"
                >
                  ביטול
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={isSubmittingVolunteer}
                >
                  {isSubmittingVolunteer ? (
                    <>שולח... </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 ml-2" />
                      שלחי בקשה
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Back to My Profile Button */}
      <div className="flex justify-center mt-12 mb-8">
        <Button asChild variant="outline" size="lg" className="border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700 shadow-md">
          <Link to={createPageUrl('MyProfile')}>
            <Heart className="w-4 h-4 ml-2" />
            חזרה למקום שלי
          </Link>
        </Button>
      </div>
    </div>
  );
}
