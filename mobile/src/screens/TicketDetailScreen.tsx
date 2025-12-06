import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setSelectedTicket, setError } from '../store/ticketSlice';
import { setMessages, addMessage } from '../store/messageSlice';
import { ticketAPI, messageAPI } from '../api/index';

interface TicketDetailScreenProps {
  navigation: any;
  route: any;
}

const TicketDetailScreen: React.FC<TicketDetailScreenProps> = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { ticketId } = route.params;
  const { selectedTicket } = useSelector((state: RootState) => state.tickets);
  const messages = useSelector((state: RootState) => state.messages.messages[ticketId] || []);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    fetchTicketDetails();
    fetchMessages();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      const response = await ticketAPI.getTicketById(ticketId);
      dispatch(setSelectedTicket(response.data.ticket));
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to load ticket'));
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await messageAPI.getMessages(ticketId);
      dispatch(setMessages({ ticketId, messages: response.data.messages || [] }));
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to load messages'));
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    const tempMessage = messageText;
    setMessageText('');
    setSending(true);

    try {
      const response = await messageAPI.sendMessage(ticketId, tempMessage);
      await fetchMessages(); // Refresh messages
    } catch (err: any) {
      setMessageText(tempMessage);
      dispatch(setError(err.message || 'Failed to send message'));
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#FF9800';
      case 'in_progress':
        return '#2196F3';
      case 'resolved':
        return '#4CAF50';
      case 'closed':
        return '#9E9E9E';
      default:
        return '#757575';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return '#4CAF50';
      case 'normal':
        return '#2196F3';
      case 'high':
        return '#FF9800';
      case 'urgent':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!selectedTicket) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Ticket not found</Text>
      </View>
    );
  }

  const renderMessage = ({ item }: any) => {
    const isCustomer = true; // Adjust based on actual sender logic
    return (
      <View style={[styles.messageContainer, !isCustomer && styles.messageRight]}>
        <View
          style={[styles.messageBubble, isCustomer && styles.messageBubbleLeft]}
        >
          <Text style={styles.messageSender}>{item.senderName || item.senderEmail}</Text>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTime}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.detailsSection}>
        <View style={styles.headerCard}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>
              {selectedTicket.title}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(selectedTicket.status) },
              ]}
            >
              <Text style={styles.statusText}>{selectedTicket.status}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Category</Text>
              <Text style={styles.metaValue}>{selectedTicket.category}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Priority</Text>
              <View
                style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(selectedTicket.priority) },
                ]}
              >
                <Text style={styles.priorityText}>{selectedTicket.priority}</Text>
              </View>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.description}>{selectedTicket.description}</Text>
          </View>
        </View>

        <View style={styles.messagesHeader}>
          <Text style={styles.sectionTitle}>Conversation</Text>
        </View>
      </ScrollView>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        scrollEnabled={false}
        style={styles.messagesList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
          editable={!sending}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!messageText.trim() || sending) && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!messageText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  detailsSection: {
    maxHeight: '45%',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  headerCard: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  priorityText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  descriptionContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  descriptionLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
  },
  messagesHeader: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 4,
    alignItems: 'flex-start',
  },
  messageRight: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  messageBubbleLeft: {
    backgroundColor: '#f0f0f0',
  },
  messageSender: {
    fontSize: 10,
    color: '#999',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 13,
    color: '#333',
  },
  messageTime: {
    fontSize: 9,
    color: '#999',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default TicketDetailScreen;
