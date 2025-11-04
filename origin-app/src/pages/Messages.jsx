
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User } from '@/api/entities';
import { Message } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Send, Search, MessageCircle, Users, Clock, CheckCircle, Plus, Mail, Loader2, Heart, LogIn } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { createPageUrl } from '@/utils';
import { getMessagingData } from '@/api/functions';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Messages() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
    const [allProfiles, setAllProfiles] = useState([]);
    const [newMessageForm, setNewMessageForm] = useState({
        recipient: '',
        subject: '',
        content: ''
    });
    const [pendingConnections, setPendingConnections] = useState([]);
    
    // Use ref to prevent multiple simultaneous email parameter processing
    const isProcessingEmailParam = useRef(false);
    const hasProcessedEmailParam = useRef(false);

    const loadMessages = async (conversationId) => {
        try {
            const conversationMessages = await Message.filter(
                { conversation_id: conversationId },
                'created_date'
            );
            setMessages(Array.isArray(conversationMessages) ? conversationMessages : []);
            
            const safeMessages = Array.isArray(conversationMessages) ? conversationMessages : [];
            const unreadMessages = safeMessages.filter(
                msg => user && msg.recipient_email === user.email && !msg.is_read
            );
            
            for (const message of unreadMessages) {
                await Message.update(message.id, { is_read: true });
            }
        } catch (error) {
            console.error('Error loading messages:', error);
            setMessages([]);
        }
    };

    // NEW: Load messages between two users directly (when conversation not found)
    const loadMessagesBetweenUsers = async (userEmail1, userEmail2) => {
        try {
            console.log('[Messages] 🔍 Loading messages between:', userEmail1, 'and', userEmail2);
            
            // Get all messages where either user is sender and the other is recipient
            const allMessages = await Message.list(); // Assuming Message.list() returns all messages
            const filteredMessages = allMessages.filter(msg => 
                (msg.sender_email === userEmail1 && msg.recipient_email === userEmail2) ||
                (msg.sender_email === userEmail2 && msg.recipient_email === userEmail1)
            );
            
            // Sort by date
            filteredMessages.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
            
            console.log('[Messages] ✅ Found', filteredMessages.length, 'messages between users');
            
            setMessages(filteredMessages);
            
            // Mark unread messages as read for the current user (userEmail1)
            const unreadMessages = filteredMessages.filter(
                msg => msg.recipient_email === userEmail1 && !msg.is_read
            );
            
            for (const message of unreadMessages) {
                await Message.update(message.id, { is_read: true });
            }
            
            return filteredMessages;
        } catch (error) {
            console.error('[Messages] ❌ Error loading messages between users:', error);
            setMessages([]);
            return [];
        }
    };

    const loadUserAndMessages = useCallback(async () => {
        setIsLoading(true);
        try {
            const currentUser = await User.me();
            setUser(currentUser);
            
            if (!currentUser) {
                setIsLoading(false);
                return;
            }
            
            const response = await getMessagingData();
            
            if (response.data.success && response.data.data) {
                const { conversations: fetchedConversations, pendingConnections: fetchedPendingConnections, allProfiles: fetchedProfiles } = response.data.data;
                
                setConversations(Array.isArray(fetchedConversations) ? fetchedConversations : []);
                setPendingConnections(Array.isArray(fetchedPendingConnections) ? fetchedPendingConnections : []);
                setAllProfiles(Array.isArray(fetchedProfiles) ? fetchedProfiles : []);
            }
            
        } catch (error) {
            console.error("Error loading user and message data:", error);
            setUser(null);
            setConversations([]);
            setPendingConnections([]);
            setAllProfiles([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUserAndMessages();
    }, [loadUserAndMessages]);

    // FIXED: Handle email parameter with proper safeguards
    useEffect(() => {
        // Prevent processing if already done or in progress
        if (isProcessingEmailParam.current || hasProcessedEmailParam.current) {
            return;
        }
        
        // Wait for all data to be loaded
        if (isLoading || !user || (conversations.length === 0 && allProfiles.length === 0)) {
            console.log('[Messages] ⏳ Still loading data, waiting...');
            return;
        }

        const searchParams = new URLSearchParams(location.search);
        const emailParam = searchParams.get('email');
        
        if (!emailParam) {
            console.log('[Messages] ℹ️ No email parameter in URL');
            return;
        }

        console.log('[Messages] 📧 Processing email parameter:', emailParam);
        console.log('[Messages] 📊 Available conversations:', conversations.length);
        console.log('[Messages] 👥 Available profiles:', allProfiles.length);
        
        // Mark as processing
        isProcessingEmailParam.current = true;
        hasProcessedEmailParam.current = true; // Mark that we've attempted to process an email param
        
        // Clean URL immediately to prevent re-processing
        const newUrl = location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        
        // Try to find existing conversation
        const targetConversation = conversations.find(conv => 
            conv.participants && 
            Array.isArray(conv.participants) && 
            conv.participants.includes(emailParam)
        );
        
        if (targetConversation) {
            console.log('[Messages] ✅ Found existing conversation, opening it');
            setSelectedConversation(targetConversation);
            loadMessages(targetConversation.conversation_id).finally(() => {
                isProcessingEmailParam.current = false;
            });
        } else {
            console.log('[Messages] ⚠️ No existing conversation found, searching for existing messages between users...');
            
            // Try to find the profile in allProfiles
            const targetProfile = allProfiles.find(p => p.email === emailParam);
            
            // Load any existing messages between the two users
            loadMessagesBetweenUsers(user.email, emailParam).then(existingMessages => {
                // Determine conversation_id from existing messages or create new one
                let conversationId;
                if (existingMessages.length > 0) {
                    conversationId = existingMessages[0].conversation_id;
                    console.log('[Messages] 📝 Using conversation_id from existing messages:', conversationId);
                } else {
                    conversationId = `new_${user.email}_${emailParam}_${Date.now()}`;
                    console.log('[Messages] 🆕 Creating new conversation_id:', conversationId);
                }
                
                // Create virtual conversation
                const virtualConversation = {
                    id: existingMessages.length > 0 ? 'existing_virtual' : 'new_virtual', // Differentiate from 'new' for conversations
                    conversation_id: conversationId,
                    participants: [user.email, emailParam],
                    participant_names: [
                        user.full_name, 
                        targetProfile ? targetProfile.nickname : emailParam
                    ],
                    last_message_preview: existingMessages.length > 0 ? existingMessages[existingMessages.length - 1].content : '',
                    last_message_date: existingMessages.length > 0 ? existingMessages[existingMessages.length - 1].created_date : null,
                    unread_count: {},
                    subject: `שיחה עם ${targetProfile ? targetProfile.nickname : emailParam}`
                };
                
                console.log('[Messages] 💬 Virtual conversation created with', existingMessages.length, 'messages');
                setSelectedConversation(virtualConversation);
                // The messages state is already set by loadMessagesBetweenUsers
            }).finally(() => {
                // Mark as done
                isProcessingEmailParam.current = false;
            });
        }
        
        // Cleanup on unmount
        return () => {
            isProcessingEmailParam.current = false;
        };
        
    }, [user, isLoading, conversations, allProfiles, location.search, location.pathname, setSelectedConversation, loadMessages, loadMessagesBetweenUsers]);

    // Reset the flag when navigating away from Messages page
    useEffect(() => {
        return () => {
            hasProcessedEmailParam.current = false;
        };
    }, [location.pathname]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation || !user) return;
        
        setIsSending(true);
        try {
            const recipient = selectedConversation.participants.find(p => p !== user.email);
            const recipientName = selectedConversation.participant_names[
                selectedConversation.participants.indexOf(recipient)
            ];

            let conversationId = selectedConversation.conversation_id;
            // If it's a virtual conversation (either 'new' or 'existing_virtual')
            if (selectedConversation.id === 'new_virtual' || selectedConversation.id === 'existing_virtual' || conversationId.startsWith('new_')) {
                // If it was a 'new_virtual' conversation, we confirm the conversationId with current timestamp
                if (selectedConversation.id === 'new_virtual') {
                     conversationId = `${user.email}_${recipient}_${Date.now()}`;
                }
                // If it was an 'existing_virtual' conversation, keep its conversationId as it's derived from existing messages
            }

            const messageData = {
                sender_email: user.email,
                sender_name: user.full_name,
                recipient_email: recipient,
                recipient_name: recipientName,
                content: newMessage,
                conversation_id: conversationId,
                subject: selectedConversation.subject || `Re: ${selectedConversation.last_message_preview?.substring(0, 30) || 'שיחה'}`
            };

            await Message.create(messageData);
            
            try {
                const { createNotification } = await import('@/api/functions');
                console.log('[Messages] 📨 Sending in-app notification to:', recipient);
                
                await createNotification({
                    recipient_email: recipient,
                    title: 'הודעה חדשה 💌',
                    message: `${user.full_name} שלחה לך הודעה: "${newMessage.substring(0, 50)}..."`,
                    type: 'message',
                    action_url: `${window.location.origin}${createPageUrl('Messages')}?email=${encodeURIComponent(user.email)}`,
                    sender_name: user.full_name
                });
                console.log('[Messages] ✅ In-app notification sent successfully');
            } catch (notificationError) {
                console.error('[Messages] ❌ Could not create notification:', notificationError);
            }

            try {
                console.log('[Messages] 📧 Attempting to send email to:', recipient);
                const emailBody = `
                    <div dir="rtl" style="font-family: Arial, sans-serif; text-align: right; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; background-color: #fff5f7; border-radius: 10px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #ec4899; margin: 0;">💌 הודעה חדשה!</h2>
                        </div>
                        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <p style="font-size: 16px; color: #333;"><strong>${user.full_name}</strong> שלחה לך הודעה:</p>
                            <div style="background: #fef3c7; padding: 15px; border-right: 4px solid #f59e0b; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0; font-size: 16px; color: #333; white-space: pre-wrap;">${newMessage}</p>
                            </div>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${window.location.origin}${createPageUrl('Messages')}?email=${encodeURIComponent(user.email)}" 
                                   style="background: linear-gradient(to right, #ec4899, #f43f5e); 
                                          color: white; 
                                          padding: 12px 25px; 
                                          text-decoration: none; 
                                          border-radius: 25px; 
                                          font-weight: bold;
                                          display: inline-block;">
                                    💬 תני מענה
                                </a>
                            </div>
                        </div>
                        <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
                            מצפות לראות אתכן ממשיכות לשוחח! 💕<br/>
                            צוות ReStart 50+
                        </p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="font-size: 14px; color: #666; text-align: center;">
                            לכל שאלה, תמיכה ובאהבה, אפשר לפנות אלינו למייל: 
                            <a href="mailto:restart@rse50.co.il" style="color: #ec4899; text-decoration: none;">restart@rse50.co.il</a>
                        </p>
                    </div>
                `;
                
                const { SendEmail } = await import('@/api/integrations');
                await SendEmail({
                    to: recipient,
                    subject: `הודעה חדשה מ-${user.full_name} ב-ReStart 50+`,
                    body: emailBody
                });
                console.log('[Messages] ✅ Email sent successfully');
            } catch (emailError) {
                console.error('[Messages] ❌ Failed to send email:', emailError);
            }

            setNewMessage('');
            await loadUserAndMessages();
            
            const updatedConversationsData = await getMessagingData();
            if (updatedConversationsData.data.success && updatedConversationsData.data.data) {
                const newlyUpdatedConv = updatedConversationsData.data.data.conversations.find(c => 
                    c.conversation_id === conversationId
                );
                if (newlyUpdatedConv) {
                    setSelectedConversation(newlyUpdatedConv);
                    loadMessages(conversationId);
                } else {
                    // If it was a new virtual conversation, it might not appear in conversations list yet.
                    // Reload messages for the current conversation ID.
                    loadMessages(conversationId);
                }
            }

        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const startNewConversation = async () => {
        if (!newMessageForm.recipient || !newMessageForm.content || !user) return;
        
        setIsSending(true);
        try {
            const recipient = allProfiles.find(p => p.email === newMessageForm.recipient);
            if (!recipient) {
                console.error("Recipient not found in profiles.");
                return;
            }

            const existingConversation = conversations.find(conv => 
                Array.isArray(conv.participants) &&
                conv.participants.includes(user.email) && 
                conv.participants.includes(recipient.email)
            );

            let conversationId;
            if (existingConversation) {
                conversationId = existingConversation.conversation_id;
            } else {
                conversationId = `${user.email}_${recipient.email}_${Date.now()}`;
            }
            
            const messageData = {
                sender_email: user.email,
                sender_name: user.full_name,
                recipient_email: recipient.email,
                recipient_name: recipient.nickname,
                content: newMessageForm.content,
                subject: newMessageForm.subject || 'הודעה חדשה',
                conversation_id: conversationId
            };

            await Message.create(messageData);
            
            try {
                const { createNotification } = await import('@/api/functions');
                console.log('[Messages] 📨 Sending in-app notification for new conversation to:', recipient.email);
                
                await createNotification({
                    recipient_email: recipient.email,
                    title: 'הודעה חדשה 💌',
                    message: `${user.full_name} שלחה לך הודעה: "${newMessageForm.content.substring(0, 50)}..."`,
                    type: 'message',
                    action_url: `${window.location.origin}${createPageUrl('Messages')}?email=${encodeURIComponent(user.email)}`,
                    sender_name: user.full_name
                });
                console.log('[Messages] ✅ In-app notification sent for new conversation');
            } catch (notificationError) {
                console.error('[Messages] ❌ Could not create notification:', notificationError);
            }

            try {
                console.log('[Messages] 📧 Attempting to send email for new conversation to:', recipient.email);
                const emailBody = `
                    <div dir="rtl" style="font-family: Arial, sans-serif; text-align: right; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; background-color: #fff5f7; border-radius: 10px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #ec4899; margin: 0;">💌 הודעה חדשה!</h2>
                        </div>
                        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <p style="font-size: 16px; color: #333;"><strong>${user.full_name}</strong> שלחה לך הודעה:</p>
                            <div style="background: #fef3c7; padding: 15px; border-right: 4px solid #f59e0b; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0; font-size: 16px; color: #333; white-space: pre-wrap;">${newMessageForm.content}</p>
                            </div>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${window.location.origin}${createPageUrl('Messages')}?email=${encodeURIComponent(user.email)}" 
                                   style="background: linear-gradient(to right, #ec4899, #f43f5e); 
                                          color: white; 
                                          padding: 12px 25px; 
                                          text-decoration: none; 
                                          border-radius: 25px; 
                                          font-weight: bold;
                                          display: inline-block;">
                                    💬 תני מענה
                                </a>
                            </div>
                        </div>
                        <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
                            מצפות לראות אתכן ממשיכות לשוחח! 💕<br/>
                            צוות ReStart 50+
                        </p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="font-size: 14px; color: #666; text-align: center;">
                            לכל שאלה, תמיכה ובאהבה, אפשר לפנות אלינו למייל: 
                            <a href="mailto:restart@rse50.co.il" style="color: #ec4899; text-decoration: none;">restart@rse50.co.il</a>
                        </p>
                    </div>
                `;
                
                const { SendEmail } = await import('@/api/integrations');
                await SendEmail({
                    to: recipient.email,
                    subject: `הודעה חדשה מ-${user.full_name} ב-ReStart 50+`,
                    body: emailBody
                });
                console.log('[Messages] ✅ Email sent successfully for new conversation');
            } catch (emailError) {
                console.error('[Messages] ❌ Failed to send email:', emailError);
            }
            
            try {
                const { checkAndAwardBadges } = await import('@/api/functions');
                await checkAndAwardBadges({ userEmail: user.email });
            } catch (badgeError) {
                console.log('Could not check badges:', badgeError);
            }
            
            setNewMessageForm({ recipient: '', subject: '', content: '' });
            setShowNewMessageDialog(false);
            
            await loadUserAndMessages();
            
        } catch (error) {
            console.error('Error creating new conversation:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleAcceptConnection = async (connection) => {
        if (!user) return;

        try {
            console.log('[Messages] 🤝 Accepting connection from:', connection.requester_email);
            
            // First, delete the connection request as it's now accepted
            try {
                const { Connection } = await import('@/api/entities');
                await Connection.delete(connection.id);
                console.log('[Messages] ✅ Connection deleted successfully');
            } catch (deleteError) {
                console.warn('[Messages] Could not delete connection directly after acceptance (might be already processed):', deleteError);
            }

            const conversationId = `${connection.requester_email}_${connection.recipient_email}_${Date.now()}`;
            
            const welcomeMessageContent = `שלום ${connection.requester_name}! שמחה להכיר אותך דרך הקהילה שלנו 😊`;
            
            const welcomeMessage = {
                sender_email: user.email,
                sender_name: user.full_name,
                recipient_email: connection.requester_email,
                recipient_name: connection.requester_name,
                content: welcomeMessageContent,
                subject: 'קבלת בקשת חברות',
                conversation_id: conversationId
            };

            console.log('[Messages] 📝 Creating welcome message...');
            await Message.create(welcomeMessage);
            console.log('[Messages] ✅ Welcome message created successfully');
            
            // Create the Conversation entity
            try {
                const { Conversation } = await import('@/api/entities');
                const conversationData = {
                    conversation_id: conversationId,
                    participants: [user.email, connection.requester_email],
                    participant_names: [user.full_name, connection.requester_name],
                    last_message_date: new Date().toISOString(),
                    last_message_preview: welcomeMessageContent,
                    unread_count: {
                        [connection.requester_email]: 1,
                        [user.email]: 0
                    },
                    is_active: true
                };
                
                console.log('[Messages] 💬 Creating conversation...');
                await Conversation.create(conversationData);
                console.log('[Messages] ✅ Conversation created successfully');
            } catch (convError) {
                console.error('[Messages] ❌ Could not create conversation:', convError);
            }
            
            try {
                const { createNotification } = await import('@/api/functions');
                console.log('[Messages] 📨 Sending connection approval notification to:', connection.requester_email);
                
                await createNotification({
                    recipient_email: connection.requester_email,
                    title: 'בקשת החברות אושרה! 🎉',
                    message: `${user.full_name} קיבלה את בקשת החברות שלך ושלחה לך הודעת ברכה`,
                    type: 'connection',
                    action_url: `${window.location.origin}${createPageUrl('Messages')}?email=${encodeURIComponent(user.email)}`,
                    sender_name: user.full_name
                });
                console.log('[Messages] ✅ In-app notification sent for connection approval');
            } catch (notificationError) {
                console.error('[Messages] ❌ Could not create notification:', notificationError);
            }

            try {
                console.log('[Messages] 📧 Sending connection approval email to:', connection.requester_email);
                const emailBody = `
                    <div dir="rtl" style="font-family: Arial, sans-serif; text-align: right; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; background-color: #fff5f7; border-radius: 10px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #ec4899; margin: 0;">🎉 בשורה טובה!</h2>
                        </div>
                        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <p style="font-size: 16px; color: #333;"><strong>${user.full_name}</strong> קיבלה את בקשת החברות שלך ושלחה לך הודעת ברכה!</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${window.location.origin}${createPageUrl('Messages')}?email=${encodeURIComponent(user.email)}" 
                                   style="background: linear-gradient(to right, #ec4899, #f43f5e); 
                                          color: white; 
                                          padding: 12px 25px; 
                                          text-decoration: none; 
                                          border-radius: 25px; 
                                          font-weight: bold;
                                          display: inline-block;">
                                    💬 צפי בהודעה
                                </a>
                            </div>
                        </div>
                        <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
                            מאחלות לכן חברות מופלאה! 💕<br/>
                            צוות ReStart 50+
                        </p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="font-size: 14px; color: #666; text-align: center;">
                            לכל שאלה, תמיכה ובאהבה, אפשר לפנות אלינו למייל: 
                            <a href="mailto:restart@rse50.co.il" style="color: #ec4899; text-decoration: none;">restart@rse50.co.il</a>
                        </p>
                    </div>
                `;
                
                const { SendEmail } = await import('@/api/integrations');
                await SendEmail({
                    to: connection.requester_email,
                    subject: `🎉 ${user.full_name} קיבלה את בקשת החברות שלך!`,
                    body: emailBody
                });
                console.log('[Messages] ✅ Connection approval email sent successfully');
            } catch (emailError) {
                console.error('[Messages] ❌ Failed to send connection approval email:', emailError);
            }
            
            console.log('[Messages] 🔄 Refreshing data...');
            await loadUserAndMessages(); // Refresh UI to remove accepted connection
            navigate(createPageUrl('MyProfile')); // Navigate away after acceptance
            
        } catch (error) {
            console.error('[Messages] ❌ Error accepting connection:', error);
            alert('שגיאה באישור בקשת החברות. אנא נסי שוב.');
        }
    };

    const handleSendMessageToConnection = async (connection) => {
        if (!user) return;

        try {
            // This action only sends a message, it does NOT accept or decline the connection.
            // The connection request will remain pending until accepted or declined separately.
            const conversationId = `${user.email}_${connection.requester_email}_${Date.now()}`; // Unique ID for a new conversation

            const initialMessageContent = `שלום ${connection.requester_name}! קיבלתי את בקשת החברות שלך, בואי נתחבר ונדבר קצת 😊`;
            
            const initialMessage = {
                sender_email: user.email,
                sender_name: user.full_name,
                recipient_email: connection.requester_email,
                recipient_name: connection.requester_name,
                content: initialMessageContent,
                subject: 'בואי נתחבר!',
                conversation_id: conversationId
            };

            await Message.create(initialMessage);
            
            try {
                const { createNotification } = await import('@/api/functions');
                console.log('[Messages] 📨 Sending in-app notification to:', connection.requester_email);
                
                await createNotification({
                    recipient_email: connection.requester_email,
                    title: 'הודעה חדשה 💌',
                    message: `${user.full_name} שלחה לך הודעה: "${initialMessageContent.substring(0, 50)}..."`,
                    type: 'message',
                    action_url: `${window.location.origin}${createPageUrl('Messages')}?email=${encodeURIComponent(user.email)}`,
                    sender_name: user.full_name
                });
                console.log('[Messages] ✅ In-app notification sent successfully');
            } catch (notificationError) {
                console.error('[Messages] ❌ Could not create notification:', notificationError);
            }

            try {
                console.log('[Messages] 📧 Attempting to send email to:', connection.requester_email);
                const emailBody = `
                    <div dir="rtl" style="font-family: Arial, sans-serif; text-align: right; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; background-color: #fff5f7; border-radius: 10px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #ec4899; margin: 0;">💌 הודעה חדשה!</h2>
                        </div>
                        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <p style="font-size: 16px; color: #333;"><strong>${user.full_name}</strong> שלחה לך הודעה:</p>
                            <div style="background: #fef3c7; padding: 15px; border-right: 4px solid #f59e0b; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0; font-size: 16px; color: #333; white-space: pre-wrap;">${initialMessageContent}</p>
                            </div>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${window.location.origin}${createPageUrl('Messages')}?email=${encodeURIComponent(user.email)}" 
                                   style="background: linear-gradient(to right, #ec4899, #f43f5e); 
                                          color: white; 
                                          padding: 12px 25px; 
                                          text-decoration: none; 
                                          border-radius: 25px; 
                                          font-weight: bold;
                                          display: inline-block;">
                                    💬 תני מענה
                                </a>
                            </div>
                        </div>
                        <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
                            מצפות לראות אתכן ממשיכות לשוחח! 💕<br/>
                            צוות ReStart 50+
                        </p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="font-size: 14px; color: #666; text-align: center;">
                            לכל שאלה, תמיכה ובאהבה, אפשר לפנות אלינו למייל: 
                            <a href="mailto:restart@rse50.co.il" style="color: #ec4899; text-decoration: none;">restart@rse50.co.il</a>
                        </p>
                    </div>
                `;
                
                const { SendEmail } = await import('@/api/integrations');
                await SendEmail({
                    to: connection.requester_email,
                    subject: `הודעה חדשה מ-${user.full_name} ב-ReStart 50+`,
                    body: emailBody
                });
                console.log('[Messages] ✅ Email sent successfully');
            } catch (emailError) {
                console.error('[Messages] ❌ Failed to send email:', emailError);
            }

            await loadUserAndMessages(); // Refresh conversations list

            // Find and select the newly created conversation
            const updatedConversationsData = await getMessagingData();
            if (updatedConversationsData.data.success && updatedConversationsData.data.data) {
                const newConv = updatedConversationsData.data.data.conversations.find(c => 
                    c.conversation_id === initialMessage.conversation_id
                );
                if (newConv) {
                    setSelectedConversation(newConv);
                    loadMessages(newConv.conversation_id);
                }
            }
            
        } catch (error) {
            console.error('Error sending message to connection:', error);
            alert('שגיאה בשליחת ההודעה. אנא נסי שוב.');
        }
    };


    const handleDeclineConnection = async (connection) => {
        if (!user) return;
        try {
            try {
                const { Connection } = await import('@/api/entities');
                await Connection.delete(connection.id);
            } catch (deleteError) {
                console.warn('Could not delete connection directly:', deleteError);
            }
            
            await loadUserAndMessages();
        } catch (error) {
            console.error('Error declining connection:', error);
        }
    };

    const filteredConversations = Array.isArray(conversations) ? conversations.filter(conv =>
        Array.isArray(conv.participant_names) && conv.participant_names.some(name => 
            name && name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) : [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
        );
    }
    
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4 flex items-center justify-center">
                <Card className="text-center p-8 shadow-xl max-w-md mx-auto">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                                <Mail className="w-8 h-8 text-purple-600"/>
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">הודעות אישיות</CardTitle>
                        <CardDescription className="text-gray-600 mt-2">
                            כדי לצפות בהודעות שלך ולהתכתב עם חברות הקהילה, עליך להתחבר.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => User.login()} className="bg-purple-600 hover:bg-purple-700 w-full">
                           <LogIn className="w-4 h-4 ml-2"/> התחברות
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        <span className="gradient-text">הודעות</span>
                    </h1>
                    <p className="text-gray-600">התכתבי עם חברות הקהילה שלך</p>
                </div>

                {Array.isArray(pendingConnections) && pendingConnections.length > 0 && (
                    <Card className="mb-6 border-pink-200 bg-pink-50">
                        <CardHeader>
                            <CardTitle className="text-lg text-pink-800 flex items-center gap-2">
                                <Heart className="w-5 h-5" />
                                בקשות חברות ממתינות ({pendingConnections.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {pendingConnections.map((connection) => (
                                    <div key={connection.id} className="bg-white p-4 rounded-lg border border-pink-200 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{connection.requester_name || 'שם לא ידוע'}</h3>
                                            <p className="text-sm text-gray-600">רוצה להכיר אותך דרך הקהילה</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                onClick={() => handleDeclineConnection(connection)}
                                                variant="outline" 
                                                size="sm"
                                            >
                                                לא מעוניינת
                                            </Button>
                                            <Button 
                                                onClick={() => handleSendMessageToConnection(connection)}
                                                className="bg-purple-500 hover:bg-purple-600" 
                                                size="sm"
                                            >
                                                <MessageCircle className="w-4 h-4 ml-1" />
                                                שלחי הודעה
                                            </Button>
                                            <Button 
                                                onClick={() => handleAcceptConnection(connection)}
                                                className="bg-pink-500 hover:bg-pink-600" 
                                                size="sm"
                                            >
                                                בואי נכיר!
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid lg:grid-cols-3 gap-6 h-[70vh]">
                    <Card className="lg:col-span-1">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">שיחות</CardTitle>
                                <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                                            <Plus className="w-4 h-4 ml-2" />
                                            הודעה חדשה
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>הודעה חדשה</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="recipient">אל:</Label>
                                                <select 
                                                    className="w-full p-2 border rounded-md"
                                                    value={newMessageForm.recipient}
                                                    onChange={(e) => setNewMessageForm({...newMessageForm, recipient: e.target.value})}
                                                >
                                                    <option value="">בחרי נמענת</option>
                                                    {allProfiles.map(profile => (
                                                        <option key={profile.email} value={profile.email}>
                                                            {profile.nickname} ({profile.location})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <Label htmlFor="subject">נושא:</Label>
                                                <Input 
                                                    id="subject"
                                                    value={newMessageForm.subject}
                                                    onChange={(e) => setNewMessageForm({...newMessageForm, subject: e.target.value})}
                                                    placeholder="נושא ההודעה"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="content">תוכן:</Label>
                                                <Textarea 
                                                    id="content"
                                                    value={newMessageForm.content}
                                                    onChange={(e) => setNewMessageForm({...newMessageForm, content: e.target.value})}
                                                    placeholder="כתבי את ההודעה שלך..."
                                                    rows={4}
                                                />
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" onClick={() => setShowNewMessageDialog(false)}>
                                                    ביטול
                                                </Button>
                                                <Button onClick={startNewConversation} disabled={isSending}>
                                                    {isSending ? 'שולח...' : 'שליחה'}
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="relative">
                                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="חיפוש שיחות..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pr-10"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[50vh]">
                                {filteredConversations.map((conversation) => {
                                    const otherParticipant = conversation.participants && Array.isArray(conversation.participants) ? 
                                        conversation.participants.find(p => user && p !== user.email) : null;
                                    const otherParticipantName = conversation.participant_names && Array.isArray(conversation.participant_names) && otherParticipant ?
                                        conversation.participant_names[conversation.participants.indexOf(otherParticipant)] : 'שם לא ידוע';
                                    const unreadCount = user ? (conversation.unread_count?.[user.email] || 0) : 0;

                                    return (
                                        <div
                                            key={conversation.conversation_id}
                                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                                                selectedConversation?.conversation_id === conversation.conversation_id ? 'bg-purple-50' : ''
                                            }`}
                                            onClick={() => {
                                                setSelectedConversation(conversation);
                                                loadMessages(conversation.conversation_id);
                                            }}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-gray-900">{otherParticipantName}</h3>
                                                        {unreadCount > 0 && (
                                                            <Badge variant="destructive" className="text-xs">
                                                                {unreadCount}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 truncate mt-1">
                                                        {conversation.last_message_preview || ''}
                                                    </p>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {conversation.last_message_date ? 
                                                        format(new Date(conversation.last_message_date), 'HH:mm', { locale: he }) : ''
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        {selectedConversation ? (
                            <>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">
                                        {selectedConversation.participant_names && Array.isArray(selectedConversation.participant_names) ?
                                            selectedConversation.participant_names.find(name => 
                                                user && name !== user.full_name
                                            ) : 'שיחה'
                                        }
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <ScrollArea className="h-[40vh] p-4">
                                        <div className="space-y-4">
                                            {Array.isArray(messages) && messages.map((message) => (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${
                                                        user && message.sender_email === user.email ? 'justify-end' : 'justify-start'
                                                    }`}
                                                >
                                                    <div
                                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                            user && message.sender_email === user.email
                                                                ? 'bg-purple-500 text-white'
                                                                : 'bg-gray-100 text-gray-900'
                                                        }`}
                                                    >
                                                        <p className="text-sm">{message.content}</p>
                                                        <div className="flex justify-between items-center mt-1">
                                                            <p className="text-xs opacity-75">
                                                                {format(new Date(message.created_date), 'HH:mm', { locale: he })}
                                                            </p>
                                                            {user && message.sender_email === user.email && (
                                                                <div className="flex items-center">
                                                                    {message.is_read ? (
                                                                        <CheckCircle className="w-3 h-3 text-green-300" />
                                                                    ) : (
                                                                        <Clock className="w-3 h-3 opacity-75" />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                    <div className="border-t p-4">
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="כתבי הודעה..."
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                                className="flex-1"
                                            />
                                            <Button 
                                                onClick={sendMessage} 
                                                disabled={isSending || !newMessage.trim()}
                                                size="sm"
                                                className="bg-purple-500 hover:bg-purple-600"
                                            >
                                                <Send className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </>
                        ) : (
                            <CardContent className="flex items-center justify-center h-full text-center">
                                <div>
                                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">בחרי שיחה</h3>
                                    <p className="text-gray-500">בחרי שיחה מהרשימה או התחילי שיחה חדשה</p>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
