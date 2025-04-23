import { createConnection } from 'mysql2/promise';
import bcrypt from 'bcrypt';
import config from '../../config/config';
import runMigrations from '../migrations';

async function seed() {
  try {
    // Separate migrations and seeds
    await runMigrations();

    const dbConfig = {
      host: config.database.host,
      port: config.database.port,
      database: config.database.database,
      user: config.database.user,
      password: config.database.password,
    };

    const connection = await createConnection(dbConfig);

    console.log('Seeding database...');

    // Seed Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      ['admin'],
    );

    if (Array.isArray(existingUsers) && existingUsers.length === 0) {
      await connection.execute(
        `
          INSERT INTO users (username, password, email)
          VALUES (?, ?, ?)
        `,
        ['admin', hashedPassword, 'admin@example.com'],
      );
      console.log('Added user: admin');
    } else {
      console.log('User admin already exists, skipping insertion');
    }

    // Seed Projects
    await connection.execute(`
      INSERT INTO projects (name, description)
      VALUES
        ('Website Redesign', 'Complete overhaul of company website with new branding'),
        ('Mobile App Development', 'New customer-facing mobile application for iOS and Android'),
        ('Infrastructure Upgrade', 'Server and network infrastructure upgrade project')
    `);
    console.log('Added sample projects');

    // Seed Service Orders
    await connection.execute(`
      INSERT INTO service_orders (name, category, description, project_id, is_approved)
      VALUES
        ('Homepage Design', 'UI/UX', 'Design new homepage layout and elements', 1, true),
        ('About Page Content', 'Content', 'Create copy for the about page', 1, false),
        ('User Authentication Module', 'Development', 'Implement user login and registration', 2, true),
        ('Notification System', 'Development', 'Push notification system for mobile app', 2, false),
        ('Server Migration', 'Infrastructure', 'Migrate services to new cloud servers', 3, true)
    `);
    console.log('Added sample service orders');

    await connection.end();
    console.log('Database seeding completed successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
