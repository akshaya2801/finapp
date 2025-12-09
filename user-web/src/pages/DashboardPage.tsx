import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiInbox, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';
import { ticketAPI } from '../api/client';
import { Ticket } from '../store/ticketStore';
import './DashboardPage.css';

const DashboardPage = () => {
    const { user } = useAuthStore();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            const response = await ticketAPI.getAll();
            setTickets(response.data);
        } catch (error) {
            console.error('Failed to load tickets:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = {
        total: tickets.length,
        open: tickets.filter((t) => t.status === 'open').length,
        inProgress: tickets.filter((t) => t.status === 'in_progress').length,
        resolved: tickets.filter((t) => t.status === 'resolved').length,
    };

    return (
        <div className="dashboard-page">
            <motion.div
                className="page-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>Welcome back, {user?.name}!</h1>
                <p>Here's an overview of your support tickets</p>
            </motion.div>

            <div className="stats-grid">
                <motion.div
                    className="stat-card glass"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="stat-icon" style={{ background: 'var(--gradient-primary)' }}>
                        <FiInbox />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.total}</div>
                        <div className="stat-label">Total Tickets</div>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-card glass"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="stat-icon" style={{ background: 'var(--gradient-warm)' }}>
                        <FiClock />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.open}</div>
                        <div className="stat-label">Open</div>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-card glass"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="stat-icon" style={{ background: 'var(--gradient-secondary)' }}>
                        <FiAlertCircle />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.inProgress}</div>
                        <div className="stat-label">In Progress</div>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-card glass"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="stat-icon" style={{ background: 'var(--gradient-success)' }}>
                        <FiCheckCircle />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.resolved}</div>
                        <div className="stat-label">Resolved</div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                className="quick-actions glass"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/tickets/new" className="action-card">
                        <FiInbox />
                        <span>Create New Ticket</span>
                    </Link>
                    <Link to="/tickets" className="action-card">
                        <FiClock />
                        <span>View All Tickets</span>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardPage;
