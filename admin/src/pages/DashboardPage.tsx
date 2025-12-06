import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../api/admin';
import { useAuthStore } from '../store/authStore';
import { FiLogOut, FiFilter } from 'react-icons/fi';
import '../styles/DashboardPage.css';

interface Ticket {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    createdAt: string;
    user?: {
        name: string;
        email: string;
    };
}

const DashboardPage: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const navigate = useNavigate();
    const { token, user, logout } = useAuthStore();

    useEffect(() => {
        fetchTickets();
    }, [statusFilter]);

    const fetchTickets = async () => {
        if (!token) return;

        setLoading(true);
        setError('');

        try {
            const response = await adminAPI.getTickets(token, statusFilter);
            setTickets(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            open: '#007aff',
            'in-progress': '#ff9500',
            resolved: '#34c759',
            closed: '#8e8e93',
        };
        return colors[status.toLowerCase()] || '#8e8e93';
    };

    const getPriorityColor = (priority: string) => {
        const colors: { [key: string]: string } = {
            low: '#34c759',
            normal: '#007aff',
            high: '#ff9500',
            urgent: '#ff3b30',
        };
        return colors[priority.toLowerCase()] || '#8e8e93';
    };

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <div className="header-content">
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p>Welcome back, {user?.name}</p>
                    </div>
                    <button onClick={handleLogout} className="logout-button">
                        <FiLogOut /> Logout
                    </button>
                </div>
            </header>

            <div className="dashboard-content">
                <div className="filters-section">
                    <div className="filter-group">
                        <FiFilter />
                        <label>Filter by Status:</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Tickets</option>
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                    <button onClick={fetchTickets} className="refresh-button">
                        Refresh
                    </button>
                </div>

                {loading && <div className="loading">Loading tickets...</div>}
                {error && <div className="error-message">{error}</div>}

                {!loading && !error && tickets.length === 0 && (
                    <div className="empty-state">
                        <p>No tickets found</p>
                    </div>
                )}

                {!loading && !error && tickets.length > 0 && (
                    <div className="tickets-grid">
                        {tickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className="ticket-card"
                                onClick={() => navigate(`/ticket/${ticket.id}`)}
                            >
                                <div className="ticket-header">
                                    <h3>{ticket.title}</h3>
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(ticket.status) }}
                                    >
                                        {ticket.status}
                                    </span>
                                </div>

                                <p className="ticket-description">{ticket.description}</p>

                                <div className="ticket-meta">
                                    <span className="category-tag">{ticket.category}</span>
                                    <span
                                        className="priority-badge"
                                        style={{ color: getPriorityColor(ticket.priority) }}
                                    >
                                        {ticket.priority}
                                    </span>
                                </div>

                                {ticket.user && (
                                    <div className="ticket-user">
                                        <strong>{ticket.user.name}</strong>
                                        <span>{ticket.user.email}</span>
                                    </div>
                                )}

                                <div className="ticket-footer">
                                    <small>
                                        Created: {new Date(ticket.createdAt).toLocaleDateString()}
                                    </small>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
