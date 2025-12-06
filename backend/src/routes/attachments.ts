import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Create uploads directory if it doesn't exist
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = (process.env.ALLOWED_UPLOAD_TYPES || 'image/jpeg,image/png,application/pdf').split(',');
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
  },
});

// Upload attachment
router.post('/upload', authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { ticketId, messageId } = req.body;

    if (!ticketId && !messageId) {
      return res.status(400).json({ success: false, message: 'ticketId or messageId is required' });
    }

    const attachmentId = uuidv4();
    const fileUrl = `/uploads/${req.file.filename}`;

    await query(
      `INSERT INTO attachments (id, ticket_id, message_id, file_url, file_name, file_type, file_size)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        attachmentId,
        ticketId || null,
        messageId || null,
        fileUrl,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      attachment: {
        id: attachmentId,
        fileUrl,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
      },
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: 'Upload failed', error: err.message });
  }
});

// Delete attachment
router.delete('/:attachmentId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { attachmentId } = req.params;

    const result = await query('SELECT file_url FROM attachments WHERE id = $1', [attachmentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Attachment not found' });
    }

    const fileUrl = result.rows[0].file_url;
    const filePath = path.join(uploadDir, path.basename(fileUrl));

    // Delete file from disk
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await query('DELETE FROM attachments WHERE id = $1', [attachmentId]);

    res.json({
      success: true,
      message: 'Attachment deleted',
    });
  } catch (err: any) {
    console.error('Delete attachment error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete attachment', error: err.message });
  }
});

export default router;
