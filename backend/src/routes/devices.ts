import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Register device for push notifications
router.post('/register', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { deviceId, fcmToken } = req.body;
    const userId = req.user?.userId;

    if (!deviceId) {
      return res.status(400).json({ success: false, message: 'deviceId is required' });
    }

    // Check if device already exists
    const existingDevice = await query(
      'SELECT id FROM devices WHERE device_id = $1 AND user_id = $2',
      [deviceId, userId]
    );

    if (existingDevice.rows.length > 0) {
      // Update existing device
      await query(
        'UPDATE devices SET fcm_token = $1, updated_at = NOW() WHERE device_id = $2 AND user_id = $3',
        [fcmToken || null, deviceId, userId]
      );
    } else {
      // Create new device
      const deviceRecordId = uuidv4();
      await query(
        'INSERT INTO devices (id, user_id, device_id, fcm_token) VALUES ($1, $2, $3, $4)',
        [deviceRecordId, userId, deviceId, fcmToken || null]
      );
    }

    res.json({
      success: true,
      message: 'Device registered successfully',
    });
  } catch (err: any) {
    console.error('Register device error:', err);
    res.status(500).json({ success: false, message: 'Failed to register device', error: err.message });
  }
});

export default router;
