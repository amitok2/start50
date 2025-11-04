import React, { useState, useEffect } from "react";
import { Notification } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, MessageCircle, Calendar, Users, BookOpen, Target, Settings, X, Check, Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Link } from "react-router-dom";

const getNotificationIcon = (type) => {
    const icons = {
        message: MessageCircle,
        appointment: Calendar,
        connection: Users,
        course: BookOpen,
        goal: Target,
        system: Settings
    };
    return icons[type] || Bell;
};

const getNotificationColor = (type) => {
    const colors = {
        message: "text-purple-500",
        appointment: "text-blue-500",
        connection: "text-pink-500",
        course: "text-green-500",
        goal: "text-orange-500",
        system: "text-gray-500"
    };
    return colors[type] || "text-gray-500";
};

export default function NotificationCenter({ isOpen, onClose }) {
    const [notifications, setNotifications] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingNotificationId, setDeletingNotificationId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            loadNotifications();
        }
    }, [isOpen]);

    const loadNotifications = async () => {
        console.log('[NotificationCenter] 🔄 Loading notifications...');
        setIsLoading(true);
        try {
            const currentUser = await User.me();
            console.log('[NotificationCenter] ✅ User authenticated:', currentUser.email);
            setUser(currentUser);
            
            console.log('[NotificationCenter] 📊 Fetching ALL notifications for:', currentUser.email);
            
            const allUserNotifications = await Notification.filter(
                { recipient_email: currentUser.email },
                '-created_date',
                100
            );
            
            console.log('[NotificationCenter] 📈 Total notifications in DB for this user:', allUserNotifications.length);
            
            if (allUserNotifications.length === 0) {
                console.warn('[NotificationCenter] ⚠️ NO NOTIFICATIONS FOUND IN DATABASE for user:', currentUser.email);
            } else {
                console.log('[NotificationCenter] ✅ Notifications found!');
                console.log('[NotificationCenter] 📋 Sample of first 3:', allUserNotifications.slice(0, 3));
            }
            
            setNotifications(allUserNotifications);
        } catch (error) {
            console.error("[NotificationCenter] ❌ Critical error loading notifications");
            console.error("[NotificationCenter] 🔍 Error details:", {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        console.log('[NotificationCenter] 📝 Marking notification as read:', notificationId);
        try {
            await Notification.update(notificationId, { is_read: true });
            setNotifications(prev => 
                prev.map(n => n.id === notificationId ? {...n, is_read: true} : n)
            );
            console.log('[NotificationCenter] ✅ Notification marked as read');
        } catch (error) {
            console.error("[NotificationCenter] ❌ Error marking notification as read:", error);
        }
    };

    const deleteNotification = async (notificationId, e) => {
        // Prevent the notification click event from firing
        if (e) {
            e.stopPropagation();
        }
        
        console.log('[NotificationCenter] 🗑️ Deleting notification:', notificationId);
        setDeletingNotificationId(notificationId);
        
        try {
            await Notification.delete(notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            console.log('[NotificationCenter] ✅ Notification deleted successfully');
        } catch (error) {
            console.error("[NotificationCenter] ❌ Error deleting notification:", error);
            alert('אירעה שגיאה במחיקת ההתראה');
        } finally {
            setDeletingNotificationId(null);
        }
    };

    const markAllAsRead = async () => {
        console.log('[NotificationCenter] 📝 Marking all notifications as read...');
        try {
            const unreadNotifications = notifications.filter(n => !n.is_read);
            for (const notification of unreadNotifications) {
                await Notification.update(notification.id, { is_read: true });
            }
            setNotifications(prev => prev.map(n => ({...n, is_read: true})));
            console.log('[NotificationCenter] ✅ All notifications marked as read');
        } catch (error) {
            console.error("[NotificationCenter] ❌ Error marking all notifications as read:", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-16">
            <Card className="w-full max-w-md mx-4 shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-purple-500" />
                        <h3 className="font-bold text-lg">התראות</h3>
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                                {unreadCount}
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={markAllAsRead}
                                className="text-xs"
                            >
                                <Check className="w-3 h-3 mr-1" />
                                סמן הכל כנקרא
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                
                <ScrollArea className="h-96">
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex flex-col justify-center items-center h-32 gap-2">
                                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                                <p className="text-sm text-gray-500">טוען התראות...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>אין התראות</p>
                                <p className="text-xs mt-2">כל ההתראות שלך יופיעו כאן</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {notifications.map((notification) => {
                                    const IconComponent = getNotificationIcon(notification.type);
                                    const iconColor = getNotificationColor(notification.type);
                                    
                                    return (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors relative group ${
                                                !notification.is_read ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                                            }`}
                                            onClick={() => {
                                                markAsRead(notification.id);
                                                if (notification.action_url) {
                                                    window.location.href = notification.action_url;
                                                }
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                                                    <IconComponent className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className={`font-medium text-sm ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                                                            {notification.title}
                                                        </h4>
                                                        <span className="text-xs text-gray-500">
                                                            {format(new Date(notification.created_date), 'HH:mm', { locale: he })}
                                                        </span>
                                                    </div>
                                                    <p className={`text-sm mt-1 ${!notification.is_read ? 'text-gray-800' : 'text-gray-600'}`}>
                                                        {notification.message}
                                                    </p>
                                                    {notification.sender_name && (
                                                        <p className="text-xs text-purple-600 mt-1">
                                                            מאת: {notification.sender_name}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                {/* Delete Button */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => deleteNotification(notification.id, e)}
                                                    disabled={deletingNotificationId === notification.id}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600 flex-shrink-0"
                                                >
                                                    {deletingNotificationId === notification.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </ScrollArea>
            </Card>
        </div>
    );
}