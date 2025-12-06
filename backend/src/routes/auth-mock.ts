import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

const router = Router();

// In-memory mock database for testing (without PostgreSQL)
const mockUsers = new Map<string, any>([
  [
    'rajesh@example.com',
    {
      id: 'user-001',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '9876543210',
      password_hash: '$2b$10$YourHashedPasswordHere123', // Mock hash for Test@123
      role: 'customer',
    },
  ],
  [
    'priya@example.com',
    {
      id: 'user-002',
      name: 'Priya Singh',
      email: 'priya@example.com',
      phone: '9876543211',
      password_hash: '$2b$10$YourHashedPasswordHere123',
      role: 'customer',
    },
  ],
  [
    'admin@example.com',
    {
      id: 'user-003',
      name: 'Admin User',
      email: 'admin@example.com',
      phone: '9876543212',
      password_hash: '$2b$10$YourHashedPasswordHere123',
      role: 'admin',
    },
  ],
]);

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (mockUsers.has(email)) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    mockUsers.set(email, {
      id: userId,
      name,
      phone,
      email,
      password_hash: hashedPassword,
      role: 'customer',
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId,
    });
  } catch (err: any) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
  }
});

// Login (Test: all users password is "Test@123" in mock mode)
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // For mock mode, accept any of these test credentials
    const testUsers: any = {
      'rajesh@example.com': { id: 'user-001', email: 'rajesh@example.com', role: 'customer' },
      'priya@example.com': { id: 'user-002', email: 'priya@example.com', role: 'customer' },
      'admin@example.com': { id: 'user-003', email: 'admin@example.com', role: 'admin' },
    };

    const user = testUsers[email as keyof typeof testUsers];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // For testing, accept any password
    if (password !== 'Test@123') {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
});

// Refresh Token
router.post('/refresh', (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }

    const payload = verifyRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err: any) {
    console.error('Refresh token error:', err);
    res.status(401).json({ success: false, message: 'Invalid refresh token', error: err.message });
  }
});

export default router;
