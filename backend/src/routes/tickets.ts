import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Create ticket
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { category, title, description, priority } = req.body;
    const userId = req.user?.userId;

    if (!category || !title || !description) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const ticketId = uuidv4();

    await query(
      `INSERT INTO tickets (id, user_id, category, title, description, priority, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [ticketId, userId, category, title, description, priority || 'normal', 'open']
    );

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      ticketId,
    });
  } catch (err: any) {
    console.error('Create ticket error:', err);
    res.status(500).json({ success: false, message: 'Failed to create ticket', error: err.message });
  }
});

// Get all tickets for user (or all tickets if admin)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    const { status } = req.query;

    let queryStr = 'SELECT * FROM tickets';
    const params: any[] = [];

    // Admins see all tickets, users see only their own
    if (!isAdmin) {
      queryStr += ' WHERE user_id = $1';
      params.push(userId);
    }

    if (status) {
      queryStr += isAdmin ? ' WHERE status = $1' : ' AND status = $2';
      params.push(status);
    }

    queryStr += ' ORDER BY created_at DESC';

    const result = await query(queryStr, params);

    res.json({
      success: true,
      tickets: result.rows,
    });
  } catch (err: any) {
    console.error('Get tickets error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch tickets', error: err.message });
  }
});

// Get ticket by ID
router.get('/:ticketId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user?.userId;

    const result = await query(
      'SELECT * FROM tickets WHERE id = $1 AND user_id = $2',
      [ticketId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.json({
      success: true,
      ticket: result.rows[0],
    });
  } catch (err: any) {
    console.error('Get ticket error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch ticket', error: err.message });
  }
});

// Update ticket status (admin only)
router.put('/:ticketId/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;
    const userId = req.user?.userId;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    // Check if user is admin or ticket owner
    const ticketResult = await query('SELECT user_id FROM tickets WHERE id = $1', [ticketId]);
    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const ticket = ticketResult.rows[0];
    const isAdmin = req.user?.role === 'admin';
    const isOwner = ticket.user_id === userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await query(
      'UPDATE tickets SET status = $1, updated_at = NOW() WHERE id = $2',
      [status, ticketId]
    );

    res.json({
      success: true,
      message: 'Ticket status updated',
    });
  } catch (err: any) {
    console.error('Update ticket status error:', err);
    res.status(500).json({ success: false, message: 'Failed to update ticket', error: err.message });
  }
});

export default router;
