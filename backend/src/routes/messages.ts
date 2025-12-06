import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get messages for a ticket
router.get('/ticket/:ticketId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user?.userId;

    // Verify user has access to this ticket
    const ticketResult = await query(
      'SELECT user_id FROM tickets WHERE id = $1',
      [ticketId]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const ticket = ticketResult.rows[0];
    const isAdmin = req.user?.role === 'admin';
    
    if (!isAdmin && ticket.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const result = await query(
      `SELECT m.*, u.name as sender_name, u.email as sender_email,
              json_agg(json_build_object('id', a.id, 'file_url', a.file_url, 'file_name', a.file_name, 'file_type', a.file_type)) as attachments
       FROM messages m
       LEFT JOIN users u ON m.sender_id = u.id
       LEFT JOIN attachments a ON m.id = a.message_id
       WHERE m.ticket_id = $1
       GROUP BY m.id, u.name, u.email
       ORDER BY m.created_at ASC`,
      [ticketId]
    );

    res.json({
      success: true,
      messages: result.rows,
    });
  } catch (err: any) {
    console.error('Get messages error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch messages', error: err.message });
  }
});

// Send message
router.post('/:ticketId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { text } = req.body;
    const senderId = req.user?.userId;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    // Verify ticket exists
    const ticketResult = await query('SELECT * FROM tickets WHERE id = $1', [ticketId]);
    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const messageId = uuidv4();

    await query(
      'INSERT INTO messages (id, ticket_id, sender_id, text) VALUES ($1, $2, $3, $4)',
      [messageId, ticketId, senderId, text]
    );

    res.status(201).json({
      success: true,
      message: 'Message sent',
      messageId,
    });
  } catch (err: any) {
    console.error('Send message error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message', error: err.message });
  }
});

export default router;
