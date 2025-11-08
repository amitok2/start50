import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

interface Conversation {
  id: string;
  otherParticipantName: string;
  otherParticipantEmail: string;
  lastMessage: string;
  lastMessageDate: Date;
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  senderEmail: string;
  createdDate: Date;
  isRead: boolean;
}

interface PendingConnection {
  id: string;
  requesterName: string;
  requesterEmail: string;
  date: Date;
}

// Sample data
const sampleConversations: Conversation[] = [
  {
    id: '1',
    otherParticipantName: 'שרה כהן',
    otherParticipantEmail: 'sarah@example.com',
    lastMessage: 'היי! איך הייתה הפגישה אתמול?',
    lastMessageDate: new Date(2025, 0, 8, 14, 30),
    unreadCount: 2,
  },
  {
    id: '2',
    otherParticipantName: 'רחל לוי',
    otherParticipantEmail: 'rachel@example.com',
    lastMessage: 'תודה רבה על העצות המדהימות!',
    lastMessageDate: new Date(2025, 0, 7, 10, 15),
    unreadCount: 0,
  },
];

const sampleMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      content: 'שלום! כיף להכיר אותך',
      senderEmail: 'sarah@example.com',
      createdDate: new Date(2025, 0, 8, 14, 0),
      isRead: true,
    },
    {
      id: '2',
      content: 'היי! גם לי, נראה שיש לנו הרבה במשותף',
      senderEmail: 'me@example.com',
      createdDate: new Date(2025, 0, 8, 14, 15),
      isRead: true,
    },
    {
      id: '3',
      content: 'היי! איך הייתה הפגישה אתמול?',
      senderEmail: 'sarah@example.com',
      createdDate: new Date(2025, 0, 8, 14, 30),
      isRead: false,
    },
  ],
};

const samplePendingConnections: PendingConnection[] = [
  {
    id: '1',
    requesterName: 'מיכל אברהם',
    requesterEmail: 'michal@example.com',
    date: new Date(2025, 0, 7),
  },
];

export default function MessagesScreen() {
  const [conversations] = useState<Conversation[]>(sampleConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [pendingConnections] = useState<PendingConnection[]>(samplePendingConnections);
  const [searchQuery, setSearchQuery] = useState('');

  const currentUserEmail = 'me@example.com'; // Would come from auth context

  useEffect(() => {
    if (selectedConversation) {
      const conversationMessages = sampleMessages[selectedConversation.id] || [];
      setMessages(conversationMessages);
    }
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderEmail: currentUserEmail,
      createdDate: new Date(),
      isRead: true,
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleAcceptConnection = (connection: PendingConnection) => {
    console.log('Accept connection:', connection.requesterName);
    // Would create new conversation here
  };

  const handleDeclineConnection = (connection: PendingConnection) => {
    console.log('Decline connection:', connection.requesterName);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.otherParticipantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        selectedConversation?.id === item.id && styles.conversationItemSelected,
      ]}
      onPress={() => setSelectedConversation(item)}
    >
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color={theme.colors.purple[400]} />
          </View>
          <View style={styles.conversationInfo}>
            <View style={styles.conversationTop}>
              <Text style={styles.conversationName}>{item.otherParticipantName}</Text>
              {item.unreadCount > 0 && (
                <Badge
                  style={{
                    backgroundColor: theme.colors.rose[500],
                    minWidth: 20,
                    height: 20,
                    borderRadius: 10,
                  }}
                  textStyle={{
                    color: 'white',
                    fontSize: 12,
                  }}
                >
                  {item.unreadCount}
                </Badge>
              )}
            </View>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          </View>
        </View>
        <Text style={styles.timestamp}>
          {format(item.lastMessageDate, 'HH:mm', { locale: he })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isMine = item.senderEmail === currentUserEmail;

    return (
      <View
        style={[
          styles.messageContainer,
          isMine ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMine ? styles.myMessageBubble : styles.theirMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMine ? styles.myMessageText : styles.theirMessageText,
            ]}
          >
            {item.content}
          </Text>
          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.messageTime,
                isMine && styles.myMessageTime,
              ]}
            >
              {format(item.createdDate, 'HH:mm', { locale: he })}
            </Text>
            {isMine && (
              <Ionicons
                name={item.isRead ? 'checkmark-done' : 'checkmark'}
                size={14}
                color="white"
                style={{ opacity: 0.7 }}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.purple[500], theme.colors.pink[500], theme.colors.rose[400]]}
        style={styles.hero}
      >
        <Text style={styles.heroTitle}>💌 הודעות</Text>
        <Text style={styles.heroSubtitle}>התכתבי עם חברות הקהילה שלך</Text>
      </LinearGradient>

      {/* Pending Connections */}
      {pendingConnections.length > 0 && (
        <Card style={styles.pendingCard}>
          <CardHeader>
            <CardTitle style={styles.pendingTitle}>
              <Ionicons name="heart" size={20} color={theme.colors.pink[600]} />
              {' '}בקשות חברות ממתינות ({pendingConnections.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingConnections.map((connection) => (
              <View key={connection.id} style={styles.pendingItem}>
                <View style={styles.pendingInfo}>
                  <Text style={styles.pendingName}>{connection.requesterName}</Text>
                  <Text style={styles.pendingText}>רוצה להכיר אותך דרך הקהילה</Text>
                </View>
                <View style={styles.pendingActions}>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => handleDeclineConnection(connection)}
                    style={{ marginLeft: theme.spacing.sm }}
                  >
                    <Text style={styles.declineButtonText}>לא מעוניינת</Text>
                  </Button>
                  <Button
                    variant="gradient"
                    gradientColors={[theme.colors.pink[500], theme.colors.rose[500]]}
                    size="sm"
                    onPress={() => handleAcceptConnection(connection)}
                  >
                    <Text style={styles.acceptButtonText}>בואי נכיר!</Text>
                  </Button>
                </View>
              </View>
            ))}
          </CardContent>
        </Card>
      )}

      <View style={styles.content}>
        {/* Conversations List */}
        <View style={styles.conversationsPanel}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={theme.colors.gray[400]}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="חיפוש שיחות..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.colors.gray[400]}
            />
          </View>

          <FlatList
            data={filteredConversations}
            renderItem={renderConversationItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.conversationsList}
          />
        </View>

        {/* Messages Panel */}
        {selectedConversation ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.messagesPanel}
          >
            <View style={styles.messagesHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setSelectedConversation(null)}
              >
                <Ionicons name="arrow-forward" size={24} color={theme.colors.gray[700]} />
              </TouchableOpacity>
              <Text style={styles.messagesHeaderTitle}>
                {selectedConversation.otherParticipantName}
              </Text>
            </View>

            <FlatList
              data={messages}
              renderItem={renderMessageItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              inverted={false}
            />

            <View style={styles.messageInputContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="כתבי הודעה..."
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
                placeholderTextColor={theme.colors.gray[400]}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Ionicons
                  name="send"
                  size={24}
                  color={newMessage.trim() ? theme.colors.purple[500] : theme.colors.gray[300]}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color={theme.colors.gray[300]} />
            <Text style={styles.emptyStateTitle}>בחרי שיחה</Text>
            <Text style={styles.emptyStateText}>
              בחרי שיחה מהרשימה או התחילי שיחה חדשה
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  hero: {
    paddingVertical: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    marginBottom: theme.spacing.sm,
  },
  heroSubtitle: {
    fontSize: theme.fontSize.base,
    color: 'white',
    opacity: 0.95,
  },
  pendingCard: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.pink[50],
    borderColor: theme.colors.pink[200],
    borderWidth: 1,
  },
  pendingTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.pink[800],
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingItem: {
    backgroundColor: 'white',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.pink[200],
  },
  pendingInfo: {
    marginBottom: theme.spacing.md,
  },
  pendingName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
    textAlign: 'right',
    marginBottom: theme.spacing.xs,
  },
  pendingText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    textAlign: 'right',
  },
  pendingActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'flex-end',
  },
  declineButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
  },
  acceptButtonText: {
    fontSize: theme.fontSize.sm,
    color: 'white',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  conversationsPanel: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.md,
    overflow: 'hidden',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  searchIcon: {
    position: 'absolute',
    right: 24,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    paddingRight: 40,
    paddingLeft: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.lg,
    fontSize: theme.fontSize.sm,
    textAlign: 'right',
  },
  conversationsList: {
    padding: 0,
  },
  conversationItem: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  conversationItemSelected: {
    backgroundColor: theme.colors.purple[50],
  },
  conversationContent: {
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  conversationHeader: {
    flex: 1,
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.purple[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  conversationName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
  },
  lastMessage: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    textAlign: 'right',
  },
  timestamp: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[500],
    marginTop: theme.spacing.xs,
  },
  messagesPanel: {
    flex: 2,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.md,
    overflow: 'hidden',
  },
  messagesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
    gap: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  messagesHeaderTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
  },
  messagesList: {
    padding: theme.spacing.lg,
  },
  messageContainer: {
    marginBottom: theme.spacing.md,
    maxWidth: '75%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  myMessageBubble: {
    backgroundColor: theme.colors.purple[500],
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: theme.colors.gray[100],
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm * 1.5,
    textAlign: 'right',
  },
  myMessageText: {
    color: 'white',
  },
  theirMessageText: {
    color: theme.colors.gray[900],
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
    justifyContent: 'flex-end',
  },
  messageTime: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[500],
  },
  myMessageTime: {
    color: 'white',
    opacity: 0.7,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
    gap: theme.spacing.md,
  },
  messageInput: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.lg,
    fontSize: theme.fontSize.sm,
    textAlign: 'right',
  },
  sendButton: {
    padding: theme.spacing.sm,
  },
  emptyState: {
    flex: 2,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing['2xl'],
  },
  emptyStateTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[600],
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  emptyStateText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[500],
    textAlign: 'center',
  },
});

