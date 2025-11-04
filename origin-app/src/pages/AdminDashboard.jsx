import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Users, Search, Loader2, Mail, RefreshCw, Eye, Edit, Trash, XCircle, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import EditUserForm from '../components/profile/EditUserForm';

export default function AdminDashboard() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [combinedUsers, setCombinedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingReminders, setIsProcessingReminders] = useState(false);
  const [sendingReminderId, setSendingReminderId] = useState(null);

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0][0];
    return `${parts[0][0]}${parts[1][0]}`;
  };

  const getStatusBadge = (user) => {
    if (user.pendingMemberApp || user.pendingMentorApp) {
      return <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">ממתינה לאישור</span>;
    }
    if (user.is_premium) {
      return <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">פרימיום</span>;
    }
    if (user.is_basic) {
      return <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">בייסיק</span>;
    }
    if (!user.profile_complete) {
      return <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">פרופיל לא שלם</span>;
    }
    return <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">פעילה</span>;
  };

  const getTypeBadge = (user) => {
    if (user.is_admin) {
      return <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">מנהלת</span>;
    }
    if (user.is_mentor) {
      return <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">מנטורית</span>;
    }
    return <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">משתמשת</span>;
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const res = await base44.functions.invoke('getAllUsersWithStatus');
      setCombinedUsers(res.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      alert('שגיאה בטעינת נתוני המשתמשות.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSendIncompleteReminders = async () => {
    setIsProcessingReminders(true);
    try {
      const res = await base44.functions.invoke('sendIncompleteRegistrationReminders');
      alert(res.data.message || 'תזכורות נשלחו בהצלחה למשתמשות עם רישום לא שלם.');
    } catch (error) {
      console.error("Failed to send incomplete reminders:", error);
      alert('שגיאה בשליחת תזכורות: ' + error.message);
    } finally {
      setIsProcessingReminders(false);
    }
  };

  const handleReviewClick = (user) => {
    setSelectedUser(user);
    setAdminNotes('');
    setShowReviewModal(true);
  };

  const approveApplication = async () => {
    console.log('[APPROVE] 🚀 Function called!');
    
    if (!selectedUser || (!selectedUser.pendingMemberApp && !selectedUser.pendingMentorApp)) {
      console.log('[APPROVE] ❌ No application found');
      return;
    }

    setIsProcessing(true);
    const application = selectedUser.pendingMemberApp || selectedUser.pendingMentorApp;
    const isMentorApp = !!selectedUser.pendingMentorApp;

    console.log(`[APPROVE] 📝 Processing: ${application.email}, isMentor: ${isMentorApp}`);

    try {
      // Update application status to approved
      if (isMentorApp) {
        await base44.entities.MentorApplication.update(application.id, { 
          status: 'approved',
          admin_notes: adminNotes || undefined
        });
      } else {
        await base44.entities.MemberApplication.update(application.id, { 
          status: 'approved',
          notes: adminNotes || undefined
        });
      }
      console.log('[APPROVE] ✅ Application status updated');

      // Get or update user
      const userUpdates = {
        subscription_status: 'active',
        subscription_type: 'trial',
        subscription_plan: 'premium',
        subscription_start_date: new Date().toISOString().split('T')[0],
        subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        member_since: selectedUser.member_since || new Date().toISOString().split('T')[0]
      };

      if (isMentorApp) {
        userUpdates.user_type = 'mentor';
        userUpdates.is_approved_mentor = true;
        userUpdates.mentor_id = application.id;
      }

      if (selectedUser.id && !selectedUser.id.startsWith('app-')) {
        await base44.entities.User.update(selectedUser.id, userUpdates);
        console.log('[APPROVE] ✅ User record updated');
        
        // Send approval notification via backend function
        console.log('[APPROVE] 📧 Sending approval notification...');
        try {
          await base44.functions.invoke('createNotification', {
            recipient_email: application.email,
            title: isMentorApp ? '🎉 בקשתך להצטרף כמנטורית אושרה!' : '🎉 בקשת ההצטרפות שלך אושרה!',
            message: isMentorApp 
              ? `שלום ${application.full_name}! 🎊\n\nמזל טוב! בקשתך להצטרף כמנטורית ל-ReStart 50+ אושרה. את עכשיו חלק מצוות המנטוריות המובחרות שלנו!\n\n✨ הצעד הבא שלך:\nעדכני את הפרופיל המקצועי שלך - הוסיפי תמונת פרופיל, פרטי התמחות, תחומי מיקוד והמלצות. פרופיל מלא ומעודכן יבטיח לך חשיפה מרבית למנויות הקהילה ויעזור לנשים למצוא בדיוק את הליווי שהן מחפשות.\n\nלחצי על הכפתור למטה כדי להתחיל לערוך את הפרופיל שלך! 💜`
              : `מזל טוב ${application.full_name}! בקשת ההצטרפות שלך ל-ReStart 50+ אושרה. את עכשיו מנויה פעילה בקהילה שלנו עם גישה מלאה לכל השירותים. קיבלת מנוי ניסיון פרימיום לחודש אחד!`,
            type: 'system',
            action_url: isMentorApp ? 'https://rse50.co.il/EditMentorProfile' : 'https://rse50.co.il/MyProfile',
            priority: 'high',
            send_manager_email_alert: false
          });
          console.log('[APPROVE] ✅ Notification created successfully');
        } catch (notificationError) {
          console.error('[APPROVE] ⚠️ Failed to send notification:', notificationError);
        }

        // Send email to mentor or member
        if (isMentorApp) {
          console.log('[APPROVE] 📧 Sending approval email to mentor...');
          const emailSubject = '🎉 מזל טוב! את מנטורית מאושרת ב-ReStart 50+';
          
          try {
            const emailBody = `
              <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff5f7;">
                <div style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">🎉 מזל טוב! את מנטורית מאושרת! 🎉</h1>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                  <p style="font-size: 18px; color: #333;">שלום ${application.full_name},</p>
                  
                  <p style="font-size: 16px; line-height: 1.6; color: #555;">
                    אנחנו נרגשים לאשר את בקשתך להצטרף לצוות המנטוריות המובחר שלנו ב-<strong>ReStart 50+</strong>! 💜
                  </p>

                  <p style="font-size: 16px; line-height: 1.6; color: #555;">
                    כעת את חלק ממעגל המומחיות שלנו, ומוזמנת להשפיע וללוות נשים בדרכן החדשה.
                  </p>

                  <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border-right: 4px solid #f59e0b;">
                    <h3 style="color: #92400e; margin-top: 0;">✨ הצעד הבא והחשוב ביותר:</h3>
                    <p style="color: #78350f; margin-bottom: 0;">
                      כדי שתוכלי להופיע ברשימת המנטוריות שלנו ולקבל פניות מהמנויות, <strong>חשוב מאוד שתמלאי ותעדכני את הפרופיל הציבורי שלך</strong>.
                    </p>
                  </div>

                  <p style="font-size: 16px; line-height: 1.6; color: #555;">
                    הפרופיל הציבורי שלך הוא הדף שיציג אותך למנויות הקהילה ויאפשר להן להכיר אותך ולהזמין פגישות איתך.
                  </p>

                  <p style="font-size: 16px; line-height: 1.6; color: #555;">
                    <strong>בפרופיל את יכולה למלא:</strong>
                  </p>
                  <ul style="line-height: 1.8; color: #555;">
                    <li>תמונת פרופיל מקצועית</li>
                    <li>תיאור ההתמחות והשירותים שלך</li>
                    <li>תחומי מיקוד נוספים</li>
                    <li>המלצות מלקוחות קודמות</li>
                    <li>זמינות לפגישות (זום/פרונטלי)</li>
                  </ul>

                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://rse50.co.il/EditMentorProfile" 
                       style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-size: 18px; font-weight: bold;">
                      למילוי הפרופיל שלי 🚀
                    </a>
                  </div>

                  <div style="background: #f3f4f6; padding: 15px; border-radius: 10px; margin-top: 20px;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">
                      💡 <strong>טיפ:</strong> פרופיל מלא ומעודכן יבטיח לך חשיפה מרבית למנויות הקהילה ויעזור לנשים למצוא בדיוק את הליווי שהן מחפשות.
                    </p>
                  </div>

                  <p style="font-size: 16px; color: #555; margin-top: 30px;">
                    לאחר שתמלאי את הפרופיל, תוכלי להיכנס ללוח הבקרה שלך, לנהל פגישות ולכתוב מאמרים המשלבים את המומחיות שלך.
                  </p>

                  <p style="font-size: 16px; color: #555;">
                    אם יש לך שאלות, אנחנו כאן בשבילך! פשוט השיבי למייל הזה.
                  </p>

                  <p style="font-size: 16px; color: #555;">
                    אנחנו מצפים לעבוד איתך! 🌟<br>
                    <strong>צוות ReStart 50+</strong>
                  </p>
                </div>
              </div>
            `;

            await base44.integrations.Core.SendEmail({
              to: application.email,
              subject: emailSubject,
              body: emailBody
            });
            
            console.log('[APPROVE] ✅ Approval email sent successfully to mentor');
            
            // Log successful email send
            await base44.entities.EmailLog.create({
              recipient_email: application.email,
              recipient_name: application.full_name,
              subject: emailSubject,
              email_type: 'mentor_approval',
              status: 'sent',
              sent_date: new Date().toISOString(),
              sent_by: "admin"
            });
            
            // Send success notification to manager
            const managerEmail = 'marblodia@gmail.com';
            await base44.functions.invoke('createNotification', {
              recipient_email: managerEmail,
              title: '✅ מייל אישור נשלח בהצלחה',
              message: `מייל אישור מנטורית נשלח בהצלחה ל-${application.full_name} (${application.email}). המנטורית יכולה כעת למלא את הפרופיל הציבורי שלה.`,
              type: 'system',
              priority: 'normal',
              send_manager_email_alert: false
            });
            
          } catch (emailError) {
            console.error('[APPROVE] ⚠️ Failed to send approval email to mentor:', emailError);
            
            // Log failed email send
            await base44.entities.EmailLog.create({
              recipient_email: application.email,
              recipient_name: application.full_name,
              subject: emailSubject,
              email_type: 'mentor_approval',
              status: 'failed',
              sent_date: new Date().toISOString(),
              error_message: emailError.message,
              sent_by: "admin"
            });
          }
        }
      } else {
        console.log('[APPROVE] ⚠️ No user record found, user needs to complete registration.');
      }

      alert('הבקשה אושרה בהצלחה! נשלחה התראה ומייל למשתמשת.');
      setShowReviewModal(false);
      setSelectedUser(null);
      setAdminNotes('');
      await loadAllData();

    } catch (error) {
      console.error('[APPROVE] ❌ Error approving application:', error);
      alert('שגיאה באישור הבקשה: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendProfileReminder = async (user) => {
    setSendingReminderId(user.id);
    try {
      const res = await base44.functions.invoke('sendProfileCompletionReminder', { userId: user.id });
      alert(res.data.message || `תזכורת נשלחה ל-${user.full_name} לגבי השלמת הפרופיל.`);
    } catch (error) {
      console.error("Failed to send profile reminder:", error);
      alert('שגיאה בשליחת תזכורת: ' + error.message);
    } finally {
      setSendingReminderId(null);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const res = await base44.functions.invoke('deleteUser', { userId: userToDelete.id });
      if (res.data.success) {
        alert(`המשתמשת ${userToDelete.full_name} נמחקה בהצלחה.`);
        loadAllData();
      } else {
        alert(`שגיאה במחיקת המשתמשת: ${res.data.error}`);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert('שגיאה חריגה במחיקת המשתמשת: ' + error.message);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = combinedUsers.filter(user => {
    const matchesSearchTerm = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatusFilter = () => {
      switch (statusFilter) {
        case 'all': return true;
        case 'pending_members': return !!user.pendingMemberApp;
        case 'pending_mentors': return !!user.pendingMentorApp;
        case 'incomplete_registration': return !user.email_verified;
        case 'incomplete_profiles': return !user.profile_complete;
        case 'active_premium': return user.is_premium;
        case 'active_basic': return user.is_basic;
        case 'mentors_approved': return user.is_mentor && !user.pendingMentorApp;
        case 'active_mentors': return user.is_mentor && user.is_premium;
        case 'expired_mentor_subscriptions': return user.is_mentor && !user.is_premium;
        case 'expiring_mentor_subscriptions': return user.is_mentor && user.is_premium;
        case 'admins': return user.is_admin;
        case 'expired_trials': return user.is_trial && user.trial_expired;
        case 'expiring_trials': return user.is_trial && !user.trial_expired;
        default: return true;
      }
    };
    return matchesSearchTerm && matchesStatusFilter();
  });

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3"><Users className="w-8 h-8"/>ניהול משתמשות</h1>
          <p className="text-gray-600">צפייה, סינון, אישור ועריכה של כל חברות הקהילה במקום אחד</p>
        </header>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="חיפוש לפי שם או מייל..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10"/>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button onClick={handleSendIncompleteReminders} disabled={isProcessingReminders} variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                  {isProcessingReminders ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" />שולח תזכורות...</> : <><Mail className="ml-2 h-4 w-4" />שלח תזכורות רישום</>}
                </Button>
                <Button onClick={() => loadAllData()} variant="outline"><RefreshCw className="ml-2 h-4 w-4" />רענון</Button>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[220px]"><SelectValue placeholder="סינון לפי סטטוס" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">הצג הכל</SelectItem>
                  <SelectItem value="pending_members">ממתינות לאישור (מנויה)</SelectItem>
                  <SelectItem value="pending_mentors">ממתינות לאישור (מנטורית)</SelectItem>
                  <SelectItem value="incomplete_registration" className="text-orange-600">רישומים לא שלמים</SelectItem>
                  <SelectItem value="incomplete_profiles" className="text-orange-600">פרופיל חברתי לא שלם</SelectItem>
                  <SelectItem value="active_premium">מנויות פרימיום</SelectItem>
                  <SelectItem value="active_basic">מנויות בייסיק</SelectItem>
                  <SelectItem value="mentors_approved">מנטוריות מאושרות</SelectItem>
                  <SelectItem value="active_mentors" className="text-purple-600">מנטוריות עם מנוי פעיל</SelectItem>
                  <SelectItem value="expired_mentor_subscriptions" className="text-red-600">מנטוריות שמנוין פג תוקף</SelectItem>
                  <SelectItem value="expiring_mentor_subscriptions" className="text-amber-600">מנטוריות שמנוין מסתיים השבוע</SelectItem>
                  <SelectItem value="admins">מנהלות</SelectItem>
                  <SelectItem value="expired_trials" className="text-red-600">מנויות ניסיון שתוקפן פג</SelectItem>
                  <SelectItem value="expiring_trials" className="text-amber-600">מנויות ניסיון מסתיימות השבוע</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-20"><Loader2 className="w-12 h-12 text-rose-500 animate-spin" /></div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="bg-white shadow-md flex flex-col hover:shadow-lg transition-shadow border-2 border-transparent data-[pending=true]:border-rose-400" data-pending={!!(user.pendingMemberApp || user.pendingMentorApp)}>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <span className="text-2xl font-bold text-rose-600">{getInitials(user.full_name)}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{user.full_name}</CardTitle>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {getStatusBadge(user)}
                          {getTypeBadge(user)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="mt-auto flex flex-col">
                      <p className="text-xs text-gray-500 mb-4">תאריך הצטרפות: {user.created_date ? new Date(user.created_date).toLocaleDateString('he-IL') : 'לא זמין'}</p>
                      <div className="flex gap-2">
                        {(user.pendingMemberApp || user.pendingMentorApp) ? (
                          <Button onClick={() => handleReviewClick(user)} className="w-full bg-rose-500 hover:bg-rose-600"><Eye className="w-4 h-4 ml-2" /> בדיקת בקשה</Button>
                        ) : statusFilter === 'incomplete_profiles' ? (
                          <Button 
                            onClick={() => handleSendProfileReminder(user)} 
                            disabled={sendingReminderId === user.id}
                            className="w-full bg-orange-500 hover:bg-orange-600"
                          >
                            {sendingReminderId === user.id ? (
                              <><Loader2 className="w-4 h-4 ml-2 animate-spin" /> שולח...</>
                            ) : (
                              <><Mail className="w-4 h-4 ml-2" /> שלח תזכורת</>
                            )}
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleEditClick(user)} className="w-full"><Edit className="w-4 h-4 ml-2" /> עריכת פרטים</Button>
                        )}
                        {!user.isOnlyApplication && statusFilter !== 'incomplete_profiles' && (
                         <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(user)}><Trash className="w-4 h-4" /></Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
             {filteredUsers.length === 0 && !isLoading && (<p className="text-center py-10 text-gray-500">לא נמצאו משתמשות התואמות את הסינון.</p>)}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>עריכת פרטי משתמשת</DialogTitle></DialogHeader>
          <EditUserForm user={selectedUser} onSuccess={() => { setShowEditModal(false); loadAllData(); }} onCancel={() => setShowEditModal(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            {selectedUser && (
                <>
                    <DialogHeader>
                        <DialogTitle className="text-2xl">בדיקת בקשת הצטרפות</DialogTitle>
                        <DialogDescription>{selectedUser.pendingMentorApp ? `בקשה להצטרפות כמנטורית עבור: ${selectedUser.full_name}` : `בקשה להצטרף לקהילה עבור: ${selectedUser.full_name}`}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        {selectedUser.pendingMemberApp && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">למה תרצי להצטרף לקהילה?</h3>
                                <p className="text-gray-800 whitespace-pre-wrap">{selectedUser.pendingMemberApp.why_join}</p>
                            </div>
                        )}
                        {selectedUser.pendingMentorApp && (
                            <div className="space-y-4">
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2">תחום התמחות: {selectedUser.pendingMentorApp.specialty}</h3>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2">ניסיון:</h3>
                                    <p className="text-gray-800 whitespace-pre-wrap">{selectedUser.pendingMentorApp.experience_summary}</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2">למה להצטרף כמומחית:</h3>
                                    <p className="text-gray-800 whitespace-pre-wrap">{selectedUser.pendingMentorApp.why_join}</p>
                                </div>
                            </div>
                        )}
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">הערות מנהלת</label>
                            <Textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="הערות..." rows={2}/>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button variant="outline" onClick={() => setShowReviewModal(false)} disabled={isProcessing}>סגירה</Button>
                            <Button variant="destructive" onClick={() => alert('Reject logic to be implemented')} disabled={isProcessing}>
                                <XCircle className="w-4 h-4" /> דחיית בקשה
                            </Button>
                            <Button onClick={approveApplication} disabled={isProcessing} className="bg-green-600 hover:bg-green-700">
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} אישור בקשה
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!userToDelete} onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>האם את בטוחה שברצונך למחוק?</AlertDialogTitle>
            <AlertDialogDescription>פעולה זו תמחק לצמיתות את המשתמשת <strong>{userToDelete?.full_name}</strong> ואת כל הנתונים המשויכים אליה. לא ניתן לבטל פעולה זו.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>ביטול</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />} כן, למחוק
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}