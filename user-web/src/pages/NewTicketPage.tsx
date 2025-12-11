import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSend, FiX } from 'react-icons/fi';
import { ticketAPI } from '../api/client';
import './NewTicketPage.css';

const NewTicketPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        category: '',
        title: '',
        description: '',
        priority: 'normal'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const categories = [
        { value: 'account', label: 'Account Issues' },
        { value: 'technical', label: 'Technical Support' },
        { value: 'billing', label: 'Billing & Payments' },
        { value: 'general', label: 'General Inquiry' }
    ];

    const priorities = [
        { value: 'low', label: 'Low' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.category || !formData.title || !formData.description) {
            setError('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await ticketAPI.create(formData);
            const ticketId = response.data.ticketId;
            navigate(`/tickets/${ticketId}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create ticket');
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/tickets');
    };

    return (
        <div className="new-ticket-page">
            <motion.div
                className="page-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>Create New Ticket</h1>
                <p>Submit a support request and we'll get back to you soon</p>
            </motion.div>

            <motion.div
                className="ticket-form-container glass"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <form onSubmit={handleSubmit} className="ticket-form">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="category">Category *</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Brief description of your issue"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Please provide detailed information about your issue"
                            rows={6}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            {priorities.map(pri => (
                                <option key={pri.value} value={pri.value}>
                                    {pri.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            <FiX />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            <FiSend />
                            {isSubmitting ? 'Creating...' : 'Create Ticket'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default NewTicketPage;
