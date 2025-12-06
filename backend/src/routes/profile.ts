import { Router, Request, Response } from 'express';
import { query } from '../db';
import { authMiddleware } from '../middleware/auth';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';

const router = Router();

// Get user profile
router.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        const result = await query(
            'SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: result.rows[0] });
    } catch (error: any) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update user profile
router.put(
    '/',
    authMiddleware,
    [
        body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
        body('phone').optional().trim().matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits')
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const userId = (req as any).user.userId;
            const { name, phone } = req.body;

            const updates: string[] = [];
            const values: any[] = [];
            let paramCount = 1;

            if (name) {
                updates.push(`name = $${paramCount}`);
                values.push(name);
                paramCount++;
            }

            if (phone) {
                updates.push(`phone = $${paramCount}`);
                values.push(phone);
                paramCount++;
            }

            if (updates.length === 0) {
                return res.status(400).json({ error: 'No fields to update' });
            }

            updates.push(`updated_at = NOW()`);
            values.push(userId);

            const result = await query(
                `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, name, email, phone, role`,
                values
            );

            res.json({
                message: 'Profile updated successfully',
                user: result.rows[0]
            });
        } catch (error: any) {
            console.error('Profile update error:', error);
            res.status(500).json({ error: 'Failed to update profile' });
        }
    }
);

// Change password
router.put(
    '/password',
    authMiddleware,
    [
        body('currentPassword').notEmpty().withMessage('Current password is required'),
        body('newPassword')
            .isLength({ min: 6 })
            .withMessage('New password must be at least 6 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Password must contain uppercase, lowercase, and number')
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const userId = (req as any).user.userId;
            const { currentPassword, newPassword } = req.body;

            // Get current password hash
            const userResult = await query(
                'SELECT password_hash FROM users WHERE id = $1',
                [userId]
            );

            if (userResult.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Verify current password
            const isValid = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
            if (!isValid) {
                return res.status(401).json({ error: 'Current password is incorrect' });
            }

            // Hash new password
            const newPasswordHash = await bcrypt.hash(newPassword, 10);

            // Update password
            await query(
                'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
                [newPasswordHash, userId]
            );

            res.json({ message: 'Password changed successfully' });
        } catch (error: any) {
            console.error('Password change error:', error);
            res.status(500).json({ error: 'Failed to change password' });
        }
    }
);

// Get user activity stats
router.get('/activity', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        const result = await query(`
      SELECT 
        COUNT(*) as total_tickets,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_tickets,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tickets,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_tickets,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_tickets,
        COUNT(CASE WHEN rating IS NOT NULL THEN 1 END) as rated_tickets
      FROM tickets
      WHERE user_id = $1
    `, [userId]);

        res.json({ activity: result.rows[0] });
    } catch (error: any) {
        console.error('Activity fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch activity' });
    }
});

export default router;
