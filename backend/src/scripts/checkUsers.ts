import 'dotenv/config';
import pool from '../db';

const checkUsers = async () => {
    try {
        console.log('🔍 Checking users in database...\n');

        const result = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');

        console.log(`Found ${result.rows.length} users:\n`);

        if (result.rows.length === 0) {
            console.log('❌ No users found in database');
        } else {
            result.rows.forEach((user, index) => {
                console.log(`${index + 1}. ${user.name}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Created: ${user.created_at}`);
                console.log('');
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
};

checkUsers();
