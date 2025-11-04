
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { User } from '@/api/entities';
import { MemberApplication } from '@/api/entities';
import { MentorApplication } from '@/api/entities';
import { Subscription } from '@/api/entities';
import { SendEmail } from '@/api/integrations';
import { createNotification } from '@/api/functions';
import { sendIncompleteRegistrationReminders } from '@/api/functions';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Loader2, Users, Search, Edit, Trash, CheckCircle, XCircle, Eye, UserPlus, Crown, CalendarClock, Mail, RefreshCw, Download
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from '@/components/ui/textarea';
import EditUserForm from '../components/admin/EditUserForm';

const getInitials = (name) => {
  if (!name) return "?";
  const names = name.split(' ');
  const initials = names.map(n => n[0]).join('');
  return initials.slice(0, 2).toUpperCase();
};

export default function ManageUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [pendingMemberApps, setPendingMemberApps] = useState([]);
  const [pendingMentorApps, setPendingMentorApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  
  const [isProcessingReminders, setIsProcessingReminders] = useState(false);

  const [incompleteProfilesData, setIncompleteProfilesData] = useState(null);
  const [sendingReminderId, setSendingReminderId] = useState(null);

  const location = useLocation();

  useEffect(() => {
    document.title = "ניהול משתמשות | ריסטארט 50+";
  }, []);

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [usersData, memberAppsData, mentorAppsData] = await Promise.all([
        User.list('-created_date', 1000),
        MemberApplication.filter({ status: 'pending' }, '-created_date'),
        MentorApplication.filter({ status: 'pending' }, '-created_date')
      ]);
      setAllUsers(usersData);
      setPendingMemberApps(memberAppsData);
      setPendingMentorApps(mentorAppsData);
    } catch (error) {
      console.error("Failed to load data:", error);
      alert("שגיאה בטעינת הנתונים: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadIncompleteProfilesData = useCallback(async () => {
    console.log('[ManageUsers] 🔄 Loading incomplete profiles data...');
    try {
      const { data } = await base44.functions.invoke('getIncompleteProfiles');
      console.log('[ManageUsers] ✅ Incomplete profiles data loaded:', data);
      
      if (data.error) {
        console.warn('[ManageUsers] ⚠️ API returned error:', data.error);
      }
      
      if (data.summary) {
        console.log('[ManageUsers] 📊 Summary:', data.summary);
      }
      
      if (data.users && data.users.length > 0) {
        console.log(`[ManageUsers] 👥 Found ${data.users.length} incomplete profiles`);
        console.log('[ManageUsers] 📋 First 3 users:', data.users.slice(0, 3));
      } else {
        console.log('[ManageUsers] ℹ️ No incomplete profiles found');
      }
      
      setIncompleteProfilesData(data);
    } catch (error) {
      console.error("[ManageUsers] ❌ Failed to load incomplete profiles data:", error);
      setIncompleteProfilesData(null);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    if (filter) {
      console.log('[ManageUsers] 🔍 Filter from URL:', filter);
      setStatusFilter(filter);
      
      if (filter === 'incomplete_profiles') {
        console.log('[ManageUsers] Filter is incomplete_profiles, loading data...');
        loadIncompleteProfilesData();
      } else {
        setIncompleteProfilesData(null);
      }
    } else {
      setIncompleteProfilesData(null);
    }
  }, [location.search, loadIncompleteProfilesData]);
  
  // NEW: Watch statusFilter changes and load data when needed
  useEffect(() => {
    console.log('[ManageUsers] 📝 Status filter changed to:', statusFilter);
    if (statusFilter === 'incomplete_profiles') {
      console.log('[ManageUsers] 🚀 Triggering loadIncompleteProfilesData...');
      loadIncompleteProfilesData();
    }
  }, [statusFilter, loadIncompleteProfilesData]);

  const handleSendProfileReminder = async (user) => {
    if (!confirm(`האם את בטוחה שברצונך לשלוח תזכורת ל-${user.full_name}?\n\nהיא תקבל מייל עם הזמנה להשלים את הפרופיל החברתי שלה.`)) {
      return;
    }

    setSendingReminderId(user.id);
    try {
      const { data } = await base44.functions.invoke('sendProfileCompletionReminder', {
        userEmail: user.email,
        userName: user.full_name
      });
      
      if (data.success) {
        alert(`✅ תזכורת נשלחה בהצלחה ל-${user.full_name}!`);
        // Reload data to show updated reminder date
        await loadAllData();
      } else {
        alert(`❌ שגיאה בשליחת התזכורת: ${data.error || 'שגיאה לא ידועה'}`);
      }
    } catch (error) {
      console.error("Failed to send reminder:", error);
      alert(`❌ שגיאה בשליחת התזכורת: ${error.message}`);
    } finally {
      setSendingReminderId(null);
    }
  };

  const combinedUsers = useMemo(() => {
    const userMap = new Map();
    allUsers.forEach(user => {
      userMap.set(user.email, { ...user, pendingMemberApp: null, pendingMentorApp: null, isOnlyApplication: false });
    });
    pendingMemberApps.forEach(app => {
      if (userMap.has(app.email)) {
        userMap.get(app.email).pendingMemberApp = app;
      } else {
        userMap.set(app.email, { id: `app-member-${app.id}`, full_name: app.full_name, email: app.email, created_date: app.created_date, pendingMemberApp: app, pendingMentorApp: null, isOnlyApplication: true });
      }
    });
    pendingMentorApps.forEach(app => {
      if (userMap.has(app.email)) {
        userMap.get(app.email).pendingMentorApp = app;
      } else {
        userMap.set(app.email, { id: `app-mentor-${app.id}`, full_name: app.full_name, email: app.email, created_date: app.created_date, pendingMemberApp: null, pendingMentorApp: app, isOnlyApplication: true });
      }
    });
    const combined = Array.from(userMap.values());
    let filtered = combined;
    if (searchTerm) {
      filtered = filtered.filter(u => u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);
    switch (statusFilter) {
      case 'pending_members': filtered = filtered.filter(u => u.pendingMemberApp); break;
      case 'pending_mentors': filtered = filtered.filter(u => u.pendingMentorApp); break;
      case 'active_premium': filtered = filtered.filter(u => u.subscription_status === 'active' && u.subscription_plan === 'premium'); break;
      case 'active_basic': filtered = filtered.filter(u => u.subscription_status === 'active' && u.subscription_plan === 'basic'); break;
      case 'mentors_approved': filtered = filtered.filter(u => u.is_approved_mentor === true); break;
      case 'admins': filtered = filtered.filter(u => u.role === 'admin'); break;
      case 'expired_trials': filtered = filtered.filter(u => u.subscription_type === 'trial' && u.subscription_end_date && new Date(u.subscription_end_date) < now); break;
      case 'expiring_trials': filtered = filtered.filter(u => u.subscription_type === 'trial' && u.subscription_end_date && new Date(u.subscription_end_date) >= now && new Date(u.subscription_end_date) <= sevenDaysFromNow); break;
      case 'incomplete_registration': filtered = filtered.filter(u => !u.pendingMemberApp && !u.pendingMentorApp && u.subscription_status !== 'active' && u.subscription_status !== 'expired' && !u.isOnlyApplication && !u.is_approved_mentor && u.role !== 'admin' && !(u.subscription_type === 'trial' && u.subscription_end_date && new Date(u.subscription_end_date) < now)); break;
      
      case 'active_mentors': 
        filtered = filtered.filter(u => {
          if (!u.is_approved_mentor) return false;
          if (u.subscription_status !== 'active') return false;
          if (!u.subscription_end_date) return true;
          const endDate = new Date(u.subscription_end_date);
          return endDate > sevenDaysFromNow;
        }); 
        break;
      case 'expired_mentor_subscriptions': 
        filtered = filtered.filter(u => {
          if (!u.is_approved_mentor) return false;
          if (u.subscription_status === 'expired') return true;
          if (u.subscription_status === 'active' && u.subscription_end_date) {
            const endDate = new Date(u.subscription_end_date);
            return endDate < now;
          }
          return false;
        }); 
        break;
      case 'expiring_mentor_subscriptions': 
        filtered = filtered.filter(u => {
          if (!u.is_approved_mentor) return false;
          if (u.subscription_status !== 'active') return false;
          if (!u.subscription_end_date) return false;
          const endDate = new Date(u.subscription_end_date);
          return endDate >= now && endDate <= sevenDaysFromNow;
        }); 
        break;
      
      case 'incomplete_profiles': 
        console.log('[ManageUsers] 🔍 Filtering for incomplete_profiles');
        console.log('[ManageUsers] 📊 incompleteProfilesData:', incompleteProfilesData);
        
        if (incompleteProfilesData && incompleteProfilesData.users) {
          const incompleteEmails = new Set(
            incompleteProfilesData.users.map(u => u.email.toLowerCase().trim())
          );
          console.log('[ManageUsers] 📧 Incomplete emails count:', incompleteEmails.size);
          console.log('[ManageUsers] 📧 Sample emails:', Array.from(incompleteEmails).slice(0, 5));
          
          filtered = filtered.filter(u => {
            if (!u.email) return false;
            const userEmail = u.email.toLowerCase().trim();
            const isIncomplete = incompleteEmails.has(userEmail);
            if (isIncomplete) {
              console.log(`[ManageUsers] ✅ Matched incomplete user: ${u.email}`);
            }
            return isIncomplete;
          });
          
          console.log('[ManageUsers] 👥 Filtered users count:', filtered.length);
        } else {
          console.log('[ManageUsers] ⚠️ No incomplete profiles data available yet');
          filtered = [];
        }
        break;
      
      default: break;
    }
    return filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  }, [allUsers, pendingMemberApps, pendingMentorApps, searchTerm, statusFilter, incompleteProfilesData]);

  const handleEditClick = (user) => { setSelectedUser(user); setShowEditModal(true); };
  const handleReviewClick = (user) => { setSelectedUser(user); setAdminNotes(''); setShowReviewModal(true); };
  const handleDeleteClick = (user) => { setUserToDelete(user); };

  const confirmDelete = async () => {
    if (!userToDelete || userToDelete.isOnlyApplication) return;
    setIsDeleting(true);
    try {
      await User.delete(userToDelete.id);
      alert(`המשתמשת ${userToDelete.full_name} נמחקה בהצלחה.`);
      setUserToDelete(null);
      await loadAllData();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("שגיאה במחיקת המשתמשת.");
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleSendIncompleteReminders = async () => {
    setIsProcessingReminders(true);
    try {
      const { data } = await sendIncompleteRegistrationReminders({});
      alert(`הפעלה הושלמה בהצלחה!\n\n${data.message}\n\nפרטים:\n- נמצאו ${data.details.incompleteUsers} משתמשות עם רישום לא שלם\n- נשלחו ${data.details.emailsSent} מיילי עידוד\n- שגיאות: ${data.details.emailErrors}`);
      await loadAllData();
    } catch (error) {
      console.error("Failed to send incomplete registration reminders:", error);
      alert("שגיאה בשליחת תזכורות רישום: " + error.message);
    } finally {
      setIsProcessingReminders(false);
    }
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
      const AppEntity = isMentorApp ? MentorApplication : MemberApplication;
      
      await AppEntity.update(application.id, { 
        status: 'approved',
        admin_notes: adminNotes || undefined
      });
      console.log('[APPROVE] ✅ Application status updated');

      let userRecord = allUsers.find(u => u.email === application.email);
      const userUpdates = {
        subscription_status: 'active',
        subscription_type: 'trial',
        subscription_plan: 'premium',
        subscription_start_date: new Date().toISOString().split('T')[0],
        subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        member_since: userRecord?.member_since || new Date().toISOString().split('T')[0]
      };

      if (isMentorApp) {
        userUpdates.user_type = 'mentor';
        userUpdates.is_approved_mentor = true;
        userUpdates.mentor_id = application.id;
      }

      if (userRecord) {
        await User.update(userRecord.id, userUpdates);
        console.log('[APPROVE] ✅ User record updated');
        
        console.log('[APPROVE] 📧 Sending approval notification...');
        try {
          await createNotification({
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

                  <div style="background: linear-gradient(135deg, #fef3c7, #fed7aa); padding: 20px; border-radius: 10px; margin: 25px 0; border-right: 4px solid #f59e0b;">
                    <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">✨ הצעד הבא והחשוב ביותר:</h4>
                    <p style="color: #78350f; margin: 0; font-size: 14px;">
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

            await SendEmail({
              to: application.email,
              subject: emailSubject,
              body: emailBody
            });
            
            console.log('[APPROVE] ✅ Approval email sent successfully to mentor');
            
            await base44.entities.EmailLog.create({
              recipient_email: application.email,
              recipient_name: application.full_name,
              subject: emailSubject,
              email_type: 'mentor_approval',
              status: 'sent',
              sent_date: new Date().toISOString(),
              sent_by: "admin"
            });
            
            const managerEmail = 'marblodia@gmail.com';
            await createNotification({
              recipient_email: managerEmail,
              title: '✅ מייל אישור נשלח בהצלחה',
              message: `מייל אישור מנטורית נשלח בהצלחה ל-${application.full_name} (${application.email}). המנטורית יכולה כעת למלא את הפרופיל הציבורי שלה.`,
              type: 'system',
              priority: 'normal',
              send_manager_email_alert: false
            });
            
          } catch (emailError) {
            console.error('[APPROVE] ⚠️ Failed to send approval email to mentor:', emailError);
            
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

  const getStatusBadge = (user) => {
    if (user.pendingMemberApp) return <Badge className="bg-blue-100 text-blue-800 animate-pulse">ממתינה לאישור (מנויה)</Badge>;
    if (user.pendingMentorApp) return <Badge className="bg-purple-100 text-purple-800 animate-pulse">ממתינה לאישור (מנטורית)</Badge>;
    if (user.subscription_type === 'trial' && user.subscription_end_date && new Date(user.subscription_end_date) < new Date()) return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><CalendarClock className="w-3 h-3"/>תם תוקף ניסיון</Badge>;
    if (user.subscription_status === 'active') return <Badge className="bg-green-100 text-green-800">מנויה פעילה</Badge>;
    if (user.subscription_status === 'expired') return <Badge className="bg-red-100 text-red-800">פג תוקף</Badge>;
    if (user.isOnlyApplication) return <Badge variant="outline">בקשה בלבד</Badge>;
    if (!user.pendingMemberApp && !user.pendingMentorApp && user.subscription_status !== 'active' && user.subscription_status !== 'expired' && !user.isOnlyApplication && !user.is_approved_mentor && user.role !== 'admin' && !(user.subscription_type === 'trial' && user.subscription_end_date && new Date(user.subscription_end_date) < new Date())) return <Badge className="bg-orange-100 text-orange-800">רישום לא הושלם</Badge>;
    return <Badge variant="secondary">לא פעילה</Badge>;
  };
  
  const getTypeBadge = (user) => {
    if (user.role === 'admin') return <Badge className="bg-yellow-500 text-white">מנהלת</Badge>;
    if (user.is_approved_mentor) return <Badge className="bg-purple-500 text-white">מנטורית</Badge>;
    return <Badge variant="outline" className="border-gray-400">חברה</Badge>;
  };

  const handleExportToExcel = () => {
    const headers = [
      'שם מלא',
      'אימייל',
      'תפקיד',
      'סוג משתמש',
      'סטטוס מנוי',
      'תוכנית מנוי',
      'סוג מנוי',
      'תאריך התחלת מנוי',
      'תאריך סיום מנוי',
      'מנטורית מאושרת',
      'תאריך הצטרפות',
      'תזכורת פרופיל נשלחה', // Added new header
      'בקשת חברות ממתינה',
      'בקשת מנטורית ממתינה'
    ];

    const rows = combinedUsers.map(user => [
      user.full_name || '',
      user.email || '',
      user.role || '',
      user.user_type || '',
      user.subscription_status || '',
      user.subscription_plan || '',
      user.subscription_type || '',
      user.subscription_start_date || '',
      user.subscription_end_date || '',
      user.is_approved_mentor ? 'כן' : 'לא',
      user.created_date ? new Date(user.created_date).toLocaleDateString('he-IL') : '',
      user.last_profile_reminder_sent_date ? new Date(user.last_profile_reminder_sent_date).toLocaleDateString('he-IL') : '', // Added new data field
      user.pendingMemberApp ? 'כן' : 'לא',
      user.pendingMentorApp ? 'כן' : 'לא'
    ]);

    let csvContent = '\uFEFF';
    csvContent += headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `משתמשות_${new Date().toLocaleDateString('he-IL')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
                <Button onClick={handleExportToExcel} variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
                  <Download className="ml-2 h-4 w-4" />הורדת אקסל
                </Button>
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
                {combinedUsers.map((user) => (
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
                      <div className="space-y-1 mb-4">
                        <p className="text-xs text-gray-500">תאריך הצטרפות: {user.created_date ? new Date(user.created_date).toLocaleDateString('he-IL') : 'לא זמין'}</p>
                        {statusFilter === 'incomplete_profiles' && user.last_profile_reminder_sent_date && (
                          <p className="text-xs text-orange-600 font-medium">
                            תזכורת נשלחה: {new Date(user.last_profile_reminder_sent_date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </p>
                        )}
                      </div>
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
             {combinedUsers.length === 0 && !isLoading && (<p className="text-center py-10 text-gray-500">לא נמצאו משתמשות התואמות את הסינון.</p>)}
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
