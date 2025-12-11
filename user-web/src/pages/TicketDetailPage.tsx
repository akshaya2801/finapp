import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSend, FiClock, FiUser } from 'react-icons/fi';
import { ticketAPI, messageAPI } from '../api/client';
import './TicketDetailPage.css';

interface Ticket {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface Message {
    id: string;
    ticket_id?: string;
    sender_id?: string;
    sender_role: string;
    content: string;
    created_at: string;
}

const TicketDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (id) {
            fetchTicketDetails();
            fetchMessages();
        }
    }, [id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchTicketDetails = async () => {
        try {
            const response = await ticketAPI.getById(id!);
            setTicket(response.data.ticket);
        } catch (error) {
            console.error('Failed to load ticket:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await messageAPI.getByTicket(id!);
            // Backend returns messages in a different format
            const backendMessages = response.data.messages || [];
            // Transform to match our interface
            const transformedMessages = backendMessages.map((msg: any) => ({
                id: msg.id,
                sender_role: msg.sender?.role || 'customer',
                content: msg.text || msg.content,
                created_at: msg.createdAt || msg.created_at
            }));
            setMessages(transformedMessages);
        } catch (error) {
            console.error('Failed to load messages:', error);
            setMessages([]);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || isSending) return;

        setIsSending(true);

        try {
            // Backend expects POST /:ticketId with {text}
            await messageAPI.send({
                ticketId: id!,
                content: newMessage.trim()
            });

            setNewMessage('');
            await fetchMessages();
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    };

    const getStatusClass = (status: string) => {
        return `status-badge status-${status.replace('_', '-')}`;
    };

    const getPriorityClass = (priority: string) => {
        return `priority-badge priority-${priority}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatMessageTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return formatDate(dateString);
    };

    if (isLoading) {
        return <div className="loading-state">Loading ticket...</div>;
    }

    if (!ticket) {
        return (
            <div className="error-state">
                <h2>Ticket not found</h2>
                <button onClick={() => navigate('/tickets')} className="btn btn-primary">
                    Back to Tickets
                </button>
            </div>
        );
    }

    return (
        <div className="ticket-detail-page">
            <motion.div
                className="page-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <button onClick={() => navigate('/tickets')} className="back-button">
                    <FiArrowLeft />
                    Back to Tickets
                </button>
            </motion.div>

            <div className="ticket-detail-container">
                <motion.div
                    className="ticket-info glass"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="ticket-header">
                        <h1>{ticket.title}</h1>
                        <div className="ticket-badges">
                            <span className={getStatusClass(ticket.status)}>
                                {ticket.status.replace('_', ' ')}
                            </span>
                            <span className={getPriorityClass(ticket.priority)}>
                                {ticket.priority}
                            </span>
                        </div>
                    </div>

                    <div className="ticket-meta">
                        <div className="meta-item">
                            <span className="meta-label">Ticket ID:</span>
                            <span className="meta-value">#{ticket.id.slice(0, 8)}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Category:</span>
                            <span className="meta-value">{ticket.category}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Created:</span>
                            <span className="meta-value">{formatDate(ticket.createdAt)}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Last Updated:</span>
                            <span className="meta-value">{formatDate(ticket.updatedAt)}</span>
                        </div>
                    </div>

                    <div className="ticket-description">
                        <h3>Description</h3>
                        <p>{ticket.description}</p>
                    </div>
                </motion.div>

                <motion.div
                    className="messages-section glass"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="messages-header">
                        <h2>Conversation</h2>
                        <span className="message-count">{messages.length} messages</span>
                    </div>

                    <div className="messages-container">
                        {messages.length === 0 ? (
                            <div className="empty-messages">
                                <FiClock size={32} />
                                <p>No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <motion.div
                                    key={message.id}
                                    className={`message ${message.sender_role === 'customer' ? 'message-user' : 'message-admin'}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="message-avatar">
                                        {message.sender_role === 'customer' ? <FiUser /> : <FiClock />}
                                    </div>
                                    <div className="message-content">
                                        <div className="message-header">
                                            <span className="message-sender">
                                                {message.sender_role === 'customer' ? 'You' : 'Support Team'}
                                            </span>
                                            <span className="message-time">
                                                {formatMessageTime(message.created_at)}
                                            </span>
                                        </div>
                                        <div className="message-text">{message.content}</div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="message-input-form">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            disabled={isSending || ticket.status === 'closed'}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!newMessage.trim() || isSending || ticket.status === 'closed'}
                        >
                            <FiSend />
                            {isSending ? 'Sending...' : 'Send'}
                        </button>
                    </form>

                    {ticket.status === 'closed' && (
                        <div className="closed-notice">
                            This ticket is closed. You cannot send new messages.
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default TicketDetailPage;
