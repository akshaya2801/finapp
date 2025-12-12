import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../api/admin';
import { useAuthStore } from '../store/authStore';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import '../styles/TicketDetailPage.css';

interface Message {
    id: string;
    text: string;
    senderId: string;
    createdAt: string;
    sender?: {
        name: string;
        role: string;
    };
}

interface Ticket {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    createdAt: string;
    action_taken?: string;
    rating?: number;
    feedback?: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

const TicketDetailPage: React.FC = () => {
    const { ticketId } = useParams<{ ticketId: string }>();
    const navigate = useNavigate();
    const { token } = useAuthStore();

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [actionTaken, setActionTaken] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [savingAction, setSavingAction] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (ticketId && token) {
            fetchTicketDetails();
            fetchMessages();

            // Poll for new messages every 5 seconds
            const interval = setInterval(() => {
                fetchMessages();
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [ticketId, token]);

    const fetchTicketDetails = async () => {
        if (!ticketId || !token) return;

        try {
            const response = await adminAPI.getTicketById(ticketId, token);
            const ticketData = response.data.ticket;
            setTicket(ticketData);
            setActionTaken(ticketData.action_taken || '');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load ticket');
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        if (!ticketId || !token) return;

        try {
            const response = await adminAPI.getMessages(ticketId, token);
            setMessages(response.data.messages || []);
        } catch (err: any) {
            console.error('Failed to load messages:', err);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !ticketId || !token) return;

        setSending(true);
        try {
            await adminAPI.sendMessage(ticketId, newMessage, token);
            setNewMessage('');
            fetchMessages(); // Refresh messages
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!ticketId || !token) return;

        try {
            await adminAPI.updateTicketStatus(ticketId, newStatus, token);
            setTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
            alert('Status updated successfully');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    const handleSaveAction = async () => {
        if (!ticketId || !token) return;

        setSavingAction(true);
        try {
            await adminAPI.updateTicketAction(ticketId, actionTaken, token);
            setTicket((prev) => (prev ? { ...prev, action_taken: actionTaken } : null));
            alert('Action saved successfully');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to save action');
        } finally {
            setSavingAction(false);
        }
    };

    if (loading) {
        return <div className="loading-page">Loading ticket details...</div>;
    }

    if (error || !ticket) {
        return (
            <div className="error-page">
                <p>{error || 'Ticket not found'}</p>
                <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="ticket-detail-page">
            <header className="detail-header">
                <button onClick={() => navigate('/dashboard')} className="back-button">
                    <FiArrowLeft /> Back to Dashboard
                </button>
            </header>

            <div className="detail-content">
                <div className="ticket-info-section">
                    <div className="ticket-title-row">
                        <h1>{ticket.title}</h1>
                        <span className={`status-badge status-${ticket.status}`}>
                            {ticket.status}
                        </span>
                    </div>

                    <div className="ticket-meta-grid">
                        <div className="meta-item">
                            <label>Category:</label>
                            <span>{ticket.category}</span>
                        </div>
                        <div className="meta-item">
                            <label>Priority:</label>
                            <span className={`priority-${ticket.priority}`}>
                                {ticket.priority}
                            </span>
                        </div>
                        <div className="meta-item">
                            <label>Created:</label>
                            <span>{new Date((ticket as any).created_at || ticket.createdAt).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="ticket-description">
                        <h3>Description</h3>
                        <p>{ticket.description}</p>
                    </div>

                    {ticket.user && (
                        <div className="customer-info">
                            <h3>Customer Information</h3>
                            <p>
                                <strong>Name:</strong> {ticket.user.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {ticket.user.email}
                            </p>
                        </div>
                    )}

                    {/* Rating Section */}
                    {ticket.rating && (
                        <div className="rating-section">
                            <h3>Customer Rating</h3>
                            <div className="rating-display">
                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={star <= ticket.rating! ? 'star filled' : 'star'}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="rating-value">{ticket.rating}/5</span>
                            </div>
                            {ticket.feedback && (
                                <div className="feedback">
                                    <strong>Feedback:</strong>
                                    <p>{ticket.feedback}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="status-actions">
                        <h3>Update Status</h3>
                        <div className="status-buttons">
                            <button
                                onClick={() => handleStatusChange('open')}
                                className="status-btn status-open"
                                disabled={ticket.status === 'open'}
                            >
                                Open
                            </button>
                            <button
                                onClick={() => handleStatusChange('in-progress')}
                                className="status-btn status-in-progress"
                                disabled={ticket.status === 'in-progress'}
                            >
                                In Progress
                            </button>
                            <button
                                onClick={() => handleStatusChange('resolved')}
                                className="status-btn status-resolved"
                                disabled={ticket.status === 'resolved'}
                            >
                                Resolved
                            </button>
                            <button
                                onClick={() => handleStatusChange('closed')}
                                className="status-btn status-closed"
                                disabled={ticket.status === 'closed'}
                            >
                                Closed
                            </button>
                        </div>
                    </div>

                    <div className="action-section">
                        <h3>Action Taken / Resolution</h3>
                        <textarea
                            value={actionTaken}
                            onChange={(e) => setActionTaken(e.target.value)}
                            placeholder="Describe the action taken to resolve this ticket..."
                            rows={4}
                            className="action-textarea"
                        />
                        <button
                            onClick={handleSaveAction}
                            disabled={savingAction}
                            className="save-action-btn"
                        >
                            {savingAction ? 'Saving...' : 'Save Action'}
                        </button>
                    </div>
                </div>

                <div className="messages-section">
                    <h2>Conversation</h2>

                    <div className="messages-container">
                        {messages.length === 0 ? (
                            <p className="no-messages">No messages yet</p>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`message ${message.sender?.role === 'admin' ? 'message-admin' : 'message-customer'
                                        }`}
                                >
                                    <div className="message-header">
                                        <strong>{message.sender?.name || 'Unknown'}</strong>
                                        <span className="message-time">
                                            {new Date(message.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="message-text">{message.text}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <form onSubmit={handleSendMessage} className="message-form">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your reply..."
                            disabled={sending}
                            className="message-input"
                        />
                        <button type="submit" disabled={sending || !newMessage.trim()} className="send-button">
                            <FiSend /> {sending ? 'Sending...' : 'Send'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TicketDetailPage;
