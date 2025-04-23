import { createConnection } from 'mysql2/promise';
import Postgrator from 'postgrator';
import config from '../config/config';
import path from 'path';

async function runMigrations() {
  try {
    const dbConfig = {
      host: config.database.host,
      port: config.database.port,
      database: config.database.database,
      user: config.database.user,
      password: config.database.password,
    };

    console.log('Connecting to database for migrations:', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
    });

    const connection = await createConnection(dbConfig);

    const postgrator = new Postgrator({
      migrationPattern: path.join(__dirname, './migrations/*'),
      driver: 'mysql',
      database: config.database.database,
      schemaTable: 'postgrator_schema_version',
      execQuery: async (query) => {
        const [rows] = await connection.query(query);
        return { rows: Array.isArray(rows) ? rows : [rows] };
      },
      execSqlScript: async (sqlScript) => {
        const statements = sqlScript.split(';').filter((stmt) => stmt.trim());
        for (const stmt of statements) {
          if (stmt.trim()) {
            await connection.query(stmt + ';');
          }
        }
      },
    });

    console.log('Running database migrations...');
    const appliedMigrations = await postgrator.migrate();
    console.log('Migrations completed:', appliedMigrations);

    await connection.end();
    console.log('Migration process completed successfully');

    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Error during migrations:', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
}

export default runMigrations;
