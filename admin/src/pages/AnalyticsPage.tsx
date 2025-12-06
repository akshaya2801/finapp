import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { FiArrowLeft, FiTrendingUp, FiUsers, FiCheckCircle, FiClock } from 'react-icons/fi';
import '../styles/AnalyticsPage.css';

const API_URL = 'https://finapp-backend-9td9.onrender.com/api';

interface Analytics {
    stats: {
        total_tickets: number;
        open_tickets: number;
        in_progress_tickets: number;
        resolved_tickets: number;
        closed_tickets: number;
    };
    categoryBreakdown: Array<{ category: string; count: number }>;
    statusBreakdown: Array<{ status: string; count: number }>;
    trends: Array<{ date: string; count: number }>;
    ratings: {
        average_rating: number;
        total_ratings: number;
    };
}

const AnalyticsPage: React.FC = () => {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { token } = useAuthStore();

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        if (!token) return;

        try {
            const response = await axios.get(`${API_URL}/analytics/dashboard`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAnalytics(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="analytics-loading">Loading analytics...</div>;
    }

    if (error) {
        return <div className="analytics-error">{error}</div>;
    }

    if (!analytics) {
        return null;
    }

    const { stats, categoryBreakdown, statusBreakdown, ratings } = analytics;

    return (
        <div className="analytics-page">
            <header className="analytics-header">
                <button onClick={() => navigate('/dashboard')} className="back-button">
                    <FiArrowLeft /> Back to Dashboard
                </button>
                <h1>Analytics & Insights</h1>
            </header>

            <div className="analytics-content">
                {/* Statistics Cards */}
                <div className="stats-grid">
                    <div className="stat-card total">
                        <div className="stat-icon">
                            <FiTrendingUp />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.total_tickets}</h3>
                            <p>Total Tickets</p>
                        </div>
                    </div>

                    <div className="stat-card open">
                        <div className="stat-icon">
                            <FiClock />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.open_tickets}</h3>
                            <p>Open Tickets</p>
                        </div>
                    </div>

                    <div className="stat-card in-progress">
                        <div className="stat-icon">
                            <FiUsers />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.in_progress_tickets}</h3>
                            <p>In Progress</p>
                        </div>
                    </div>

                    <div className="stat-card closed">
                        <div className="stat-icon">
                            <FiCheckCircle />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.closed_tickets}</h3>
                            <p>Closed Tickets</p>
                        </div>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="chart-section">
                    <h2>Tickets by Category</h2>
                    <div className="category-list">
                        {categoryBreakdown.map((item) => (
                            <div key={item.category} className="category-item">
                                <span className="category-name">{item.category}</span>
                                <div className="category-bar-container">
                                    <div
                                        className="category-bar"
                                        style={{
                                            width: `${(item.count / stats.total_tickets) * 100}%`,
                                        }}
                                    />
                                </div>
                                <span className="category-count">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Breakdown */}
                <div className="chart-section">
                    <h2>Tickets by Status</h2>
                    <div className="status-list">
                        {statusBreakdown.map((item) => (
                            <div key={item.status} className="status-item">
                                <span className="status-name">{item.status}</span>
                                <div className="status-bar-container">
                                    <div
                                        className="status-bar"
                                        style={{
                                            width: `${(item.count / stats.total_tickets) * 100}%`,
                                            backgroundColor: getStatusColor(item.status),
                                        }}
                                    />
                                </div>
                                <span className="status-count">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ratings */}
                {ratings.total_ratings > 0 && (
                    <div className="ratings-section">
                        <h2>Customer Satisfaction</h2>
                        <div className="ratings-card">
                            <div className="average-rating">
                                <span className="rating-value">
                                    {ratings.average_rating?.toFixed(1) || '0.0'}
                                </span>
                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={
                                                star <= Math.round(ratings.average_rating)
                                                    ? 'star filled'
                                                    : 'star'
                                            }
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <p className="ratings-count">
                                Based on {ratings.total_ratings} rating
                                {ratings.total_ratings !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
        open: '#007aff',
        in_progress: '#ff9500',
        resolved: '#34c759',
        closed: '#8e8e93',
    };
    return colors[status.toLowerCase()] || '#8e8e93';
};

export default AnalyticsPage;
