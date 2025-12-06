import { Router, Request, Response } from 'express';
import { query } from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get dashboard analytics
router.get('/dashboard', authMiddleware, async (req: Request, res: Response) => {
    try {
        // Get overall statistics
        const statsResult = await query(`
      SELECT 
        COUNT(*) as total_tickets,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_tickets,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tickets,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_tickets,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_tickets
      FROM tickets
    `);

        // Get category breakdown
        const categoryResult = await query(`
      SELECT category, COUNT(*) as count
      FROM tickets
      GROUP BY category
      ORDER BY count DESC
    `);

        // Get status breakdown
        const statusResult = await query(`
      SELECT status, COUNT(*) as count
      FROM tickets
      GROUP BY status
      ORDER BY count DESC
    `);

        // Get ticket trends (last 30 days)
        const trendResult = await query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM tickets
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

        // Get average rating
        const ratingResult = await query(`
      SELECT 
        AVG(rating) as average_rating,
        COUNT(rating) as total_ratings
      FROM tickets
      WHERE rating IS NOT NULL
    `);

        res.json({
            stats: statsResult.rows[0],
            categoryBreakdown: categoryResult.rows,
            statusBreakdown: statusResult.rows,
            trends: trendResult.rows,
            ratings: ratingResult.rows[0]
        });
    } catch (error: any) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
});

// Get ratings analytics
router.get('/ratings', authMiddleware, async (req: Request, res: Response) => {
    try {
        const result = await query(`
      SELECT 
        t.id,
        t.title,
        t.rating,
        t.feedback,
        t.created_at,
        u.name as customer_name,
        u.email as customer_email
      FROM tickets t
      JOIN users u ON t.user_id = u.id
      WHERE t.rating IS NOT NULL
      ORDER BY t.updated_at DESC
      LIMIT 50
    `);

        res.json({ ratings: result.rows });
    } catch (error: any) {
        console.error('Ratings fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch ratings' });
    }
});

export default router;
