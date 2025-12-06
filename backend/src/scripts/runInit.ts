import 'dotenv/config';
import initDb from './initDb';
import pool from '../db';

const run = async () => {
    try {
        console.log('🚀 Starting database initialization...\n');
        await initDb();
        console.log('\n✅ Database setup complete!');
        console.log('\nTables created:');
        console.log('  - users');
        console.log('  - tickets');
        console.log('  - messages');
        console.log('  - attachments');
        console.log('  - devices');
        console.log('  - draft_tickets');
        console.log('\nYou can now start the backend server with: npm run dev');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Database initialization failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
};

run();
