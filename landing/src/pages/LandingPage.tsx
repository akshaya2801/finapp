import { motion } from 'framer-motion';
import { FiShield, FiUsers, FiArrowRight } from 'react-icons/fi';
import './LandingPage.css';

const LandingPage = () => {
    const handleAdminClick = () => {
        // Use environment variable for production, fallback to localhost for development
        const adminUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:3000';
        window.location.href = adminUrl;
    };

    const handleUserClick = () => {
        // Use environment variable for production, fallback to localhost for development
        const userUrl = import.meta.env.VITE_USER_URL || 'http://localhost:5173';
        window.location.href = userUrl;
    };

    return (
        <div className="landing-page">
            {/* Animated Background */}
            <div className="landing-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            {/* Main Content */}
            <div className="landing-content">
                {/* Header */}
                <motion.div
                    className="landing-header"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <h1 className="brand-title">
                        <span className="gradient-text">Prowell Finvest Services</span>
                    </h1>
                    <p className="brand-subtitle">Your Trusted Financial Partner</p>
                </motion.div>

                {/* Portal Selection Cards */}
                <motion.div
                    className="portal-cards"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    {/* Admin Portal Card */}
                    <motion.div
                        className="portal-card glass admin-card"
                        whileHover={{ scale: 1.05, y: -10 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        onClick={handleAdminClick}
                    >
                        <div className="card-icon admin-icon">
                            <FiShield size={48} />
                        </div>
                        <h2 className="card-title">Admin Portal</h2>
                        <p className="card-description">
                            Manage tickets, view analytics, and oversee customer support operations
                        </p>
                        <button className="btn btn-primary card-button">
                            Access Admin Portal
                            <FiArrowRight />
                        </button>
                        <div className="card-glow admin-glow"></div>
                    </motion.div>

                    {/* User Portal Card */}
                    <motion.div
                        className="portal-card glass user-card"
                        whileHover={{ scale: 1.05, y: -10 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        onClick={handleUserClick}
                    >
                        <div className="card-icon user-icon">
                            <FiUsers size={48} />
                        </div>
                        <h2 className="card-title">User Portal</h2>
                        <p className="card-description">
                            Create support tickets, track your requests, and manage your profile
                        </p>
                        <button className="btn btn-secondary card-button">
                            Access User Portal
                            <FiArrowRight />
                        </button>
                        <div className="card-glow user-glow"></div>
                    </motion.div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    className="landing-footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <p className="footer-text">
                        © 2024 Prowell Finvest Services. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPage;
