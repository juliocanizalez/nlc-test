import dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

interface JWTConfig {
  secret: string;
  expiresIn: string;
}

interface AppConfig {
  port: number;
  environment: string;
  database: DatabaseConfig;
  jwt: JWTConfig;
  logLevel: string;
}

const config: AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'dev',
    password: process.env.DB_PASSWORD || 'password123!',
    database: process.env.DB_NAME || 'service_order_db',
    port: parseInt(process.env.DB_PORT || '3306', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'develop',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  logLevel: process.env.LOG_LEVEL || 'info',
};

export default config;
