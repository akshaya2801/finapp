const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_h3TPwvaX1pQl@ep-square-sunset-a1970xvd-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

async function initDatabase() {
    try {
        console.log('🔄 Initializing Neon database...\n');

        // Create users table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Created users table');

        // Create tickets table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        priority VARCHAR(50) DEFAULT 'medium',
        status VARCHAR(50) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Created tickets table');

        // Create messages table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY,
        ticket_id UUID REFERENCES tickets(id),
        sender_id UUID REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Created messages table');

        // Create attachments table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS attachments (
        id UUID PRIMARY KEY,
        message_id UUID REFERENCES messages(id),
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(100),
        file_size INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Created attachments table');

        // Create devices table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS devices (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        device_token VARCHAR(500) UNIQUE NOT NULL,
        platform VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Created devices table');

        // Create draft_tickets table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS draft_tickets (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        title VARCHAR(255),
        description TEXT,
        category VARCHAR(100),
        priority VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Created draft_tickets table');

        console.log('\n🎉 Database initialized successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        process.exit(1);
    }
}

initDatabase();
