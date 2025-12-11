import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiAlertCircle, FiXCircle, FiPlus } from 'react-icons/fi';
import { ticketAPI } from '../api/client';
import { Ticket } from '../store/ticketStore';
import './TicketListPage.css';

const TicketListPage = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTickets();
    }, []);

    useEffect(() => {
        filterTickets();
    }, [tickets, activeFilter]);

    const loadTickets = async () => {
        try {
            const response = await ticketAPI.getAll();
            setTickets(response.data.tickets || []);
        } catch (error) {
            console.error('Failed to load tickets:', error);
            setTickets([]);
        } finally {
            setIsLoading(false);
        }
    };

    const filterTickets = () => {
        if (activeFilter === 'all') {
            setFilteredTickets(tickets);
        } else {
            setFilteredTickets(tickets.filter(t => t.status === activeFilter));
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'open':
                return <FiClock />;
            case 'in_progress':
                return <FiAlertCircle />;
            case 'resolved':
                return <FiCheckCircle />;
            case 'closed':
                return <FiXCircle />;
            default:
                return <FiClock />;
        }
    };

    const getStatusClass = (status: string) => {
        return `status-badge status-${status.replace('_', '-')}`;
    };

    const getPriorityClass = (priority: string) => {
        return `priority-badge priority-${priority}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filters = [
        { key: 'all', label: 'All Tickets', count: tickets.length },
        { key: 'open', label: 'Open', count: tickets.filter(t => t.status === 'open').length },
        { key: 'in_progress', label: 'In Progress', count: tickets.filter(t => t.status === 'in_progress').length },
        { key: 'resolved', label: 'Resolved', count: tickets.filter(t => t.status === 'resolved').length },
        { key: 'closed', label: 'Closed', count: tickets.filter(t => t.status === 'closed').length }
    ];

    return (
        <div className="ticket-list-page">
            <motion.div
                className="page-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h1>My Tickets</h1>
                    <p>View and manage your support tickets</p>
                </div>
                <Link to="/tickets/new" className="btn btn-primary">
                    <FiPlus />
                    New Ticket
                </Link>
            </motion.div>

            <motion.div
                className="filter-tabs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                {filters.map(filter => (
                    <button
                        key={filter.key}
                        className={`filter-tab ${activeFilter === filter.key ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter.key)}
                    >
                        {filter.label}
                        <span className="count">{filter.count}</span>
                    </button>
                ))}
            </motion.div>

            <div className="tickets-grid">
                {isLoading ? (
                    <div className="loading-state">Loading tickets...</div>
                ) : filteredTickets.length === 0 ? (
                    <motion.div
                        className="empty-state glass"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <FiClock size={48} />
                        <h3>No tickets found</h3>
                        <p>
                            {activeFilter === 'all'
                                ? "You haven't created any tickets yet"
                                : `No ${activeFilter.replace('_', ' ')} tickets`}
                        </p>
                        <Link to="/tickets/new" className="btn btn-primary">
                            <FiPlus />
                            Create Your First Ticket
                        </Link>
                    </motion.div>
                ) : (
                    filteredTickets.map((ticket, index) => (
                        <motion.div
                            key={ticket.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link to={`/tickets/${ticket.id}`} className="ticket-card glass">
                                <div className="ticket-header">
                                    <div className="ticket-title">{ticket.title}</div>
                                    <div className={getStatusClass(ticket.status)}>
                                        {getStatusIcon(ticket.status)}
                                        {ticket.status.replace('_', ' ')}
                                    </div>
                                </div>

                                <div className="ticket-meta">
                                    <span className="ticket-id">#{ticket.id.slice(0, 8)}</span>
                                    <span className={getPriorityClass(ticket.priority)}>
                                        {ticket.priority}
                                    </span>
                                    <span className="ticket-category">{ticket.category}</span>
                                </div>

                                <div className="ticket-description">
                                    {ticket.description.length > 150
                                        ? `${ticket.description.slice(0, 150)}...`
                                        : ticket.description}
                                </div>

                                <div className="ticket-footer">
                                    <span>Created {formatDate(ticket.created_at)}</span>
                                    {ticket.updated_at !== ticket.created_at && (
                                        <span>Updated {formatDate(ticket.updated_at)}</span>
                                    )}
                                </div>
                            </Link>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TicketListPage;
