import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiHome,
    FiInbox,
    FiPlusCircle,
    FiUser,
    FiLogOut,
    FiMenu,
    FiX,
} from 'react-icons/fi';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import './MainLayout.css';

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, clearAuth } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
        { path: '/tickets', icon: FiInbox, label: 'My Tickets' },
        { path: '/tickets/new', icon: FiPlusCircle, label: 'New Ticket' },
        { path: '/profile', icon: FiUser, label: 'Profile' },
    ];

    return (
        <div className="main-layout">
            {/* Header */}
            <header className="main-header glass">
                <div className="header-content">
                    <button
                        className="menu-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <FiX /> : <FiMenu />}
                    </button>

                    <div className="header-brand">
                        <h1>Prowell Finvest</h1>
                    </div>

                    <div className="header-actions">
                        <div className="user-menu">
                            <div className="user-avatar">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="user-name">{user?.name}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <aside className={`main-sidebar glass ${sidebarOpen ? 'open' : ''}`}>
                <nav className="sidebar-nav">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <Icon className="nav-icon" />
                                <span className="nav-label">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        className="nav-indicator"
                                        layoutId="nav-indicator"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}

                    <button className="nav-item logout-btn" onClick={handleLogout}>
                        <FiLogOut className="nav-icon" />
                        <span className="nav-label">Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <div className="content-wrapper">
                    <Outlet />
                </div>
            </main>

            {/* Sidebar Overlay (Mobile) */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default MainLayout;
