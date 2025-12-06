-- FinApp Database Setup Script
-- Run this in PostgreSQL after creating the finapp database

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(50) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  file_url VARCHAR(500) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Create devices table for push notifications
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id VARCHAR(255) NOT NULL,
  fcm_token VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create draft tickets table for offline support
CREATE TABLE IF NOT EXISTS draft_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(50) DEFAULT 'normal',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_ticket_id ON messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_attachments_ticket_id ON attachments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_attachments_message_id ON attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_draft_tickets_user_id ON draft_tickets(user_id);

-- Insert sample users (passwords hashed with bcrypt)
-- Test User 1: password = "Test@123"
INSERT INTO users (name, email, phone, password_hash, role) VALUES
('Rajesh Kumar', 'rajesh@example.com', '9876543210', '$2b$10$YourHashedPasswordHere123', 'customer'),
('Priya Singh', 'priya@example.com', '9876543211', '$2b$10$YourHashedPasswordHere123', 'customer'),
('Admin User', 'admin@example.com', '9876543212', '$2b$10$YourHashedPasswordHere123', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample tickets
INSERT INTO tickets (user_id, category, title, description, priority, status) 
SELECT id, 'Billing', 'Invoice not received', 'I have not received the invoice for my recent purchase', 'normal', 'open'
FROM users WHERE email = 'rajesh@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO tickets (user_id, category, title, description, priority, status) 
SELECT id, 'Technical', 'App crashes on startup', 'The mobile app crashes every time I try to open it', 'urgent', 'in_progress'
FROM users WHERE email = 'priya@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO tickets (user_id, category, title, description, priority, status) 
SELECT id, 'Account', 'Cannot reset password', 'Password reset link is not working', 'high', 'open'
FROM users WHERE email = 'rajesh@example.com'
ON CONFLICT DO NOTHING;
